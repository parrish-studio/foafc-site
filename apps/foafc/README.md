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
pnpm check     # type-checks every workspace package
```

Astro 7's `astro dev` daemonises. Use `pnpm --filter @foafc/site exec astro dev
status|logs|stop` to manage the running server.

## How it is wired

- **Output is static** (`output: 'static'`). The Vercel adapter is present only
  so Keystatic's admin and auth routes can be server-rendered; they opt out of
  prerendering themselves. Verify after a build: `.vercel/output/static/` should
  hold `index.html` and `trails/index.html`, and `config.json` should route only
  `/keystatic/*` and `/api/keystatic/*` to the function.
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
  - `src/assets/brand/` — `FOAFC_Cream_Horizontal_Logo.png` (site header, cream
    on the forest-green bar) and `FOAFC_Color_Icon_Logo.png` (favicon). Variants
    and the rules for choosing one are in `docs/source/logo-usage-guide.md`.
  - `src/assets/photos/` — `trailhead-winter.jpg`, the home hero.
- **News cover images** are uploaded by board members through Keystatic, which
  commits them to `src/assets/news/`. Nobody needs to touch the repo.

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

There is no high-resolution landscape photo suitable for a full-bleed hero. The
best available is 1286x965, so the hero overlay is deliberately heavy (0.88) to
hide softness and to stop the sign's own lettering competing with the headline.
Replacing it with a wide, high-resolution trail photo is the single biggest
visual upgrade available, and is only a one-line import change.

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

## Not built yet

Nav covers only the pages that exist (Home, Trails). About, Blog/News, Events
and Donate pages, the live trail-status banner, the weather widget and the
Facebook sync are all still open — see `docs/project-brief.md`.
