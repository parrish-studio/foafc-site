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
- `astro check` resolves `@astrojs/check` from astro's own directory, which
  pnpm's isolated `node_modules` layout hides. The `check` script calls the
  `astro-check` binary directly instead.

## Not built yet

Nav covers only the pages that exist (Home, Trails). About, Blog/News, Events
and Donate pages, the live trail-status banner, the weather widget and the
Facebook sync are all still open — see `docs/project-brief.md`.
