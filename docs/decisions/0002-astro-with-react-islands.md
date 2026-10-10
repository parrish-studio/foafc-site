# ADR 0002 — Astro for the FOAFC site; React for islands and module UI

Date: 2026-10-10
Status: Accepted

## Context

The brief left the framework open between Next.js and Astro. Jeneve has more Next.js experience and working familiarity with Astro. The deciding criterion is long-term maintainability: the site will be maintained by volunteers and eventually handed to a future webmaster, likely less technical.

The FOAFC site is mostly content (trails, about, blog, events, donate) that changes weekly at most, with a few interactive pieces (weather widget, trail status banner, events calendar) and internal admin tools (Trail Desk, Content Studio).

## Decision

- `apps/foafc` is an **Astro** site, static output by default.
- Interactive pieces are **React islands**, hydrated only where needed.
- Each module's UI layer (`packages/module-*/src/ui`) is written as **React components styled only with `@parrish-studio/tokens`**, so the same components work in Astro and in Next.js. Framework choice becomes per-client, not platform-wide.
- Module cores (schemas, data access, adapters) stay framework-free. Astro content collections consume those schemas.

## Why

- Content-first sites are Astro's sweet spot: zero JavaScript by default, typed content collections, scoped plain CSS.
- Smaller upgrade surface than Next.js, which has had substantial churn (App Router migration, rendering and caching changes). Fewer concepts for a successor to learn.
- Static output is portable across Netlify, Vercel and Cloudflare and keeps working untouched. Next.js is at its best on Vercel.
- Stewardship: Cloudflare acquired the Astro team in January 2026 and pledged to keep it open source and host-agnostic. Corporate ownership cuts both ways, much like Next.js and Vercel; treated as neutral.

## Rejected

- **Next.js:** more familiar, and stronger for app-heavy builds, but heavier to maintain for a content site and works against static-by-default. Remains the choice for future clients whose product is primarily an application.

## Consequences

- Admin tooling is decided with the CMS (next ADR). Much of it may be the CMS's own editing UI; custom admin UI can be React islands or a separate small React app under `apps/` if it grows.
- Any server-side need (form handling, Facebook sync) uses host functions or scheduled builds, decided per feature.
