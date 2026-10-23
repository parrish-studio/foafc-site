# apps/foafc

The Friends of A Fierce Chase site. An **Astro** site with React islands
(ADR 0002), Keystatic in GitHub mode as the CMS (ADR 0003), deployed to Vercel
Hobby (ADR 0004).

Keep this app thin: FOAFC content, pages, routing and config only. Anything
reusable belongs in `packages/`.

## Running it

From the repo root:

```
pnpm install
pnpm dev       # http://localhost:4321
pnpm build
pnpm check     # types, Astro diagnostics, then pnpm verify
pnpm verify    # repo invariants — see scripts/verify.mjs at the root
```

`pnpm verify` is the one to reach for after an edit that no type checker would
catch: the capital A in "A Fierce Chase", the package boundary rules, colours
hard-coded outside `packages/tokens`, secrets in anything a `git add .` could
sweep into a public repo, trail data that fails its own parser, and whitespace
Astro has swallowed between a line of text and an expression. It needs a build
on disk for that last one and says so when there isn't one.

Astro 7's `astro dev` daemonises. Use `pnpm --filter @foafc/site exec astro dev
status|logs|stop` to manage the running server.

## How it is wired

- **Output is static** (`output: 'static'`). The Vercel adapter is present only
  so Keystatic's admin and auth routes can be server-rendered; they opt out of
  prerendering themselves, as does `/api/weather` (ADR 0006). Verify after a
  build: `.vercel/output/static/` should hold `index.html` and a directory per
  page, and `config.json` should route only `/keystatic/*`, `/api/keystatic/*`,
  `/api/weather` and Astro's own `/_image` and `/_server-islands` to the
  function. Anything else arriving there means a page lost its prerender.
- **Tokens** come in through `src/styles/global.css`, which `@import`s
  `@parrish-studio/tokens/tokens.css` before anything else. Never hard-code a
  colour, type, spacing or radius value.
- **Module UI** is React, rendered with no `client:*` directive, so the public
  pages ship zero JavaScript. A page that uses a module's components must also
  import that module's stylesheet (see `src/pages/trails.astro`).

## Images

Two kinds, handled differently:

- **Static brand and photography** live in `src/assets/` and are imported in a
  page or layout, so Astro fingerprints and optimises them at build. These
  change rarely; editing one is a code change.
  - `src/assets/brand/` — `FOAFC_Gold_Icon_Logo.png` (the header mark: the
    dinosaur alone, set in a CSS circle, because the full badge repeats the
    organisation's name right beside the name), `FOAFC_Color_Icon_Logo.png`
    (favicon) and `FOAFC_Green_Icon_Logo.png` (board portrait placeholder).
    `FOAFC_Cream_Horizontal_Logo.png` is kept but unused. Variants and the
    rules for choosing one are in `docs/source/logo-usage-guide.md`.
  - `src/assets/photos/` — `pulk-sled-winter.jpg`, the home hero and the
    default link-preview image: Sue Chase pulling baby Aquiles on a sled, the
    picture the trails are named out of.
- **Blog cover images** are uploaded by board members through Keystatic, which
  commits them to `src/assets/blog/`. Nobody needs to touch the repo.

Always use `<Image>` from `astro:assets`, never a bare `<img>`: it emits WebP,
a responsive `srcset`, and explicit `width`/`height` so nothing shifts on load.
Give `alt=""` only when the image is decorative, as the hero is.

`sharp` is a direct dependency of this app. It has to be, even though Astro
pulls it in transitively — pnpm's isolated layout otherwise hides it and the
build fails with `MissingSharp` at the image-generation step.

### Pulling assets from the FOAFC Drive

The assets live in a Drive folder owned by friendsofafiercechase@gmail.com and
shared with the webmaster. `rclone` is configured with a read-only remote named
`foafc`; copy a file by its Drive ID:

```
rclone backend copyid foafc: <file-id> apps/foafc/src/assets/photos/
```

`docs/source/asset-index.md` lists the folders. Do not round-trip binaries
through a chat tool that returns base64 — it is slow and can truncate silently.

### Known gap

No photo in the Drive is big enough for a full-bleed hero. `pulk-sled-winter.jpg`
is 968x716 and is used anyway, because it is the right picture — the family has
approved it. The overlay sits at 0.78 and `object-position` at 42%; both are
tuned to that exact frame and both have comments saying so. A wider,
higher-resolution scan of the same photograph is the single biggest visual
upgrade available and is a one-line import change.

## Keystatic

`keystatic.config.ts` uses GitHub mode. **Its paths are relative to the
repository root, not to this app**, because GitHub mode reads and writes through
the GitHub API — that is why they start with `apps/foafc/`. The matching Astro
content collection is in `src/content.config.ts`.

The admin lives at `/keystatic`. Until the Keystatic GitHub App exists and its
environment variables are set, `/keystatic` renders the sign-in screen and
`/api/keystatic/github/login` redirects to Keystatic's setup wizard. Variable
names are listed in `HANDOFF.md`.

## Known wrinkles

- `@astrojs/react@7.0.1` declares `oxc-transform-react@^0.145.0`, but the
  `@vitejs/plugin-react` it bundles requires `^0.152.0`. The ranges are
  disjoint, so the app pins `0.152.0` — the version the plugin that actually
  runs the transform needs — and the root `package.json` records the override in
  `pnpm.peerDependencyRules`.
- **Use `corepack pnpm`, not bare `pnpm`, if the version check fails.** The repo
  pins pnpm via `packageManager`, and a `pnpm` left on `PATH` by an old nvm Node
  will be the wrong version — it fails with `ERR_PNPM_BAD_PM_VERSION` and no
  build runs. `corepack pnpm` always resolves the pinned version. Do not
  "fix" it by setting `package-manager-strict=false`: that check is what caught
  the mismatch in the first place.

- **`rolldown` is stubbed out of the output bundles** (alias in
  `astro.config.mjs`, stub in `src/stub-rolldown.mjs`). `@astrojs/vercel@11.0.13`
  builds Vercel Edge Middleware with rolldown, and that build-time module
  imports its shared constants from the adapter's barrel `index.js` — which the
  runtime entry imports too. So rolldown lands in the serverless bundle, its
  native binding fails to load there, and because ESM resolves imports eagerly
  the function throws before handling anything. Every server-rendered route
  returned `FUNCTION_INVOCATION_FAILED`.

  The stub is safe because the adapter's own build-time call resolves rolldown
  through Node, not through Vite's resolver — verified by building with
  `edgeMiddleware: true`, which does emit a working `_middleware.func`. The
  stub throws rather than no-ops, so a genuine runtime need fails loudly.

  `scripts/verify-build.mjs` runs after every build, imports the generated
  function, and fails the build if it cannot be loaded — so this class of bug
  cannot reach production again. It also prints a notice when the adapter stops
  importing rolldown, meaning the workaround can be retired. Remove the alias,
  the stub, and that notice together; keep the smoke check.
- `astro check` resolves `@astrojs/check` from astro's own directory, which
  pnpm's isolated `node_modules` layout hides. The `check` script calls the
  `astro-check` binary directly instead.

## Pages

| Route | Source | Notes |
|---|---|---|
| `/` | `src/pages/index.astro` | Hero, trail-status strip, welcome beside the weather card, three teasers, donate band |
| `/trails/` | `src/pages/trails.astro` | Trail cards from `@parrish-studio/module-trails`, trailhead map, etiquette and safety |
| `/about/` | `src/pages/about.astro` | Mission and vision, the board, trail history, projects |
| `/blog/` | `src/pages/blog/index.astro` | Featured post, list, aside |
| `/blog/<slug>/` | `src/pages/blog/[...slug].astro` | One post |
| `/events/` | `src/pages/events.astro` | Empty by design — Meta is the source and the sync is not built |
| `/donate/` | `src/pages/donate.astro` | PayPal, Venmo, cheque; passes as suggested donations (ADR 0004) |
| `/404` | `src/pages/404.astro` | Emitted as `404.html`; the adapter routes unmatched paths to it |
| `/api/weather` | `src/pages/api/weather.ts` | Server-rendered, cached; NWS (ADR 0006) |
| `/keystatic` | the integration | Server-rendered editor |

## Not built yet

- **Events**, beyond the empty state: it waits on the Facebook sync
  (`docs/plans/social-cross-post.md`).
- **The live trail-status banner.** The strip under the hero is currently fixed
  text; `docs/plans/trail-status.md` has the thinking.
- **The footer mailing-list signup** the prototype shows. It needs a provider
  and a public contact address, both board questions. An input that discards
  what someone types is worse than no input.

See `docs/project-brief.md` and `docs/source/prototype-structure.md`, which
tracks the delta between the prototype and what is built.
