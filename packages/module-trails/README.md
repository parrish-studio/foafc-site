# @parrish-studio/module-trails

Trail listings: names, distances, difficulty, use restrictions, etiquette rules
and safety notices.

Framework-agnostic core plus a thin React UI layer, per the boundary rules in
the repo's `CLAUDE.md`.

## Shape

```
src/core/    types, validating parser, derived values and formatting.
             No UI framework imports.
src/ui/      React components built on @parrish-studio/tokens.
data/        seed data.
```

The package is consumed as TypeScript source by a bundler (Astro/Vite today,
Next.js later). It has no build step yet; add one when the packages are
extracted and published.

## Use

```tsx
import { parseTrailSystem, sortTrailsByLength } from '@parrish-studio/module-trails';
import { TrailList, TrailRules, TrailSafetyNotice } from '@parrish-studio/module-trails/ui';
import '@parrish-studio/module-trails/ui/trails.css';

const system = parseTrailSystem(data);
<TrailList trails={sortTrailsByLength(system.trails)} />
```

- **Import the stylesheet once per page** that renders these components. The
  components do not import it themselves, so they stay plain TSX for any
  consumer.
- **`@parrish-studio/tokens` must be loaded** by the host app. Every value in
  `trails.css` is a semantic token; the components hard-code nothing.
- `parseTrailSystem` is the gate between host data and the module's types. It
  throws `TrailDataError` naming the offending path, so a bad CMS edit fails the
  build with a usable message instead of rendering a broken page.
- Components render fine without hydration. In Astro, omit `client:*` and the
  page ships no JavaScript.

## Design notes

- Difficulty uses the standard Nordic scale: `easy`, `more-difficult`,
  `most-difficult`, shown as the matching marker glyph **plus** its text label.
  Meaning never depends on colour or shape alone. Per-level colour can be added
  to `trails.css` once the token set has semantic colours for it.
- The trail list is a `<table>` with row headers, inside a focusable scroll
  region so it can be scrolled by keyboard on narrow viewports.
- `Trail.dataCheck` is an internal data-quality flag. UI layers must not render
  it.

## Data notes

- `data/trails.json` currently holds the real FOAFC trail system. Per boundary
  rule 1 it should move to `apps/foafc` once the CMS owns trail content, leaving
  a generic example here.
- `km` values are copied from the source doc; Wolf Chase Loop's is flagged via
  `dataCheck` as a probable copy error.
