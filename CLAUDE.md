# CLAUDE.md — foafc-site

Standing brief for Claude Code sessions in this repo. Read this first, then `docs/project-brief.md` for full context.

## What this is

The website for **Friends of A Fierce Chase** (FOAFC), a 501(c)(3) cross-country ski trails nonprofit in Monson, Maine — friendsofafiercechase.org. It replaces the current Wix site (paid through March 2028, so there is no deadline pressure).

It is also the **first build of a reusable platform** for small-business sites and apps (Parrish Studio). Every structural decision should serve both goals: ship FOAFC, and keep the packages extractable.

Owner and maintainer: Jeneve Parrish (board member, webmaster, only technical person on the board).

## Repo structure

pnpm workspaces monorepo.

```
apps/foafc/            the FOAFC site — content, pages, config. Keep it thin.
packages/tokens/       design tokens as CSS custom properties. Zero dependencies.
packages/module-*/     self-contained feature modules (trails, events, publishing, …)
docs/                  brief, source material, decisions (ADRs)
```

### Boundary rules (non-negotiable)

1. **Apps import packages. Packages never import apps**, and never contain FOAFC-specific content or copy. FOAFC data lives in `apps/foafc` (or is passed in); a package's own `data/` folder holds only seed/example data.
2. **Each module = framework-agnostic core + thin UI layer.** Schemas, types, data access and CMS/API adapters must not depend on the UI framework. This keeps "swap Trails for Scheduling" real and hedges the framework choice.
3. **Packages talk to external services through an interface** (adapter pattern), so a CMS or Facebook integration can be swapped without touching UI.
4. Packages will eventually be extracted to their own repo and published (likely open source, MIT). Write them as if that has already happened: own README, own `package.json`, no relative imports reaching outside the package.

## Styling

- **Plain CSS with custom properties. No MUI, no Tailwind, no CSS-in-JS.** Stability and easy client reskinning are the point.
- All color, type, spacing and radius values come from `packages/tokens`. Components never hard-code a hex value.
- A client reskin should be a token-file swap and nothing else.
- **Colour source of truth is the prototype**, as of the 2026-10-11 alignment pass. The
  prototype and the Canva brand docs disagree on two values: amber (`#c19434` vs `#d4922a`)
  and cream (`#f0ebe1` vs `#f5f0e8`). `packages/tokens` currently uses the prototype's.
  Both lines are commented in `tokens.css` so the brand-doc values can be restored in one
  edit if the board prefers them. Forest green `#1b4332` is the same in both.

## Stack — decided vs. open

Decided: GitHub, static site + light headless CMS, free-tier hosting, DNS cutover from Wix at launch.

- **Astro** for `apps/foafc`, static output by default (ADR 0002).
- **React** for interactive islands and for every module's UI layer, so module components also work in Next.js for future clients. No `.astro` components inside `packages/`.
- **Keystatic in GitHub mode** as the CMS (ADR 0003). Content lives in the repo; editors sign in at `/keystatic` with GitHub accounts; saves commit to `main`. Public pages stay static; only Keystatic's routes need a server adapter. Keystatic schemas belong in `apps/foafc`; reusable field definitions can come from module cores.

- **Vercel, Hobby plan** (ADR 0004). Account owned by friendsofafiercechase@gmail.com; the repo is public (required for Hobby to deploy from the org), so never commit secrets or private board material. Hobby is non-commercial: nothing on the site may sell goods or services directly.

**Open:**
1. Live data source for trail status ("All trails open — 6 miles groomed") and the weather widget
2. Pulling Facebook events/posts in automatically
3. Donation processor (existing: PayPal, Venmo; options: Stripe, Zeffy, Givebutter)

Record each decision as an ADR in `docs/decisions/`.

## Product principles

- **Facebook is the source of truth** for events and trail conditions. John Chase posts conditions via Facebook Live. The site mirrors Facebook automatically; never design a flow that asks anyone to post twice.
- **Board continuity.** Board members are not technical. Admin tools must be usable without touching code. Keep `HANDOFF.md` current whenever a service, account or secret is added.
- **Transferability.** This repo will be transferred to a future webmaster. No secrets in the repo; all external accounts owned by the org (friendsofafiercechase@gmail.com) where possible.
- **Accessibility and SEO are baseline**, not polish: semantic HTML, alt text, page descriptions, keyboard navigation, sufficient contrast.
- Board priorities, in order: (1) trail information, (2) events and community engagement, (3) donations and supporter growth.

## Known data issues

- The organisation is **"Friends of a Fierce Chase"** — lowercase "a". The prototype, the
  logo files and the logo usage guide all agree. (The trail *system* is "A Fierce Chase",
  capitalised, as in `trails.json`.) Earlier drafts of this file used a capital A.

- Day pass is **$20** (not $10 as in the prototype), and there is a **Family pass** (amount TBD). Season pass $150 — confirm. Present all passes as **suggested donations**, never as purchases (ADR 0004).
- Wolf Chase Loop km figure in the source looks wrong; see `packages/module-trails/data/trails.json`.
- ~~Heading typeface~~ — **resolved 2026-10-11.** The prototype uses **Fraunces** bold
  (serif) for headings and **Libre Franklin** for body, not Archivo Black / Source Sans 3.
  Read directly from the published prototype's embedded design data. Both are self-hosted
  via `@fontsource`.

## Licensing

Code is MIT (`LICENSE`). FOAFC content and branding are excluded and belong to the organization. Keep FOAFC content in `apps/foafc` (e.g. `src/content`) so the line between licensed code and excluded content stays clear; packages must contain no FOAFC content beyond seed data.

## Conventions

- Package manager: pnpm. Node LTS.
- Commit messages: short imperative subject; explain *why* in the body when not obvious.
