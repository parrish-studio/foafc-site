# @parrish-studio/module-trails

Trail listings: names, distances, difficulty, use restrictions, rules and safety notices.

**Status:** seed data only. Schema, data access and UI to come once the framework is chosen.

## Planned shape

- `src/core/` — types/schema and data access. No UI framework imports.
- `src/ui/` — components (trail card, trail list, difficulty badge) built on `@parrish-studio/tokens`.
- `data/trails.json` — seed data. Currently the FOAFC trail system; move it to `apps/foafc` once the CMS owns trail content, and keep a generic example here.

## Data notes

- Difficulty uses the standard Nordic scale: `easy`, `more-difficult`, `most-difficult`.
- `km` values are copied from the source doc; Wolf Chase Loop's is flagged as a probable copy error.
