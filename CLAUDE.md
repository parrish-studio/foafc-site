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

### Source of truth

- **The published Canva Code prototype is canonical for brand design** — colour, type,
  spacing, margin and padding. Read values from it rather than from any summary in these
  docs. Where an earlier note here disagrees with the prototype, the prototype wins and
  the note should be corrected.
- **Copy, site organisation and content are NOT final.** The prototype's wording is a
  draft; treat page structure, section order and text as open until the board signs off.
  Do not treat prototype copy as a specification the way you would its design values.
- How to read the prototype: it is published at the URL in `docs/project-brief.md`, and
  its exported HTML embeds the entire design as JSON — every string, colour, font and
  font size. `curl` the page and parse the embedded data. Do not strip `<script>` tags
  when extracting text; that is where the content lives. No Canva export is needed, and
  the Canva connector's `read-design` returns empty for Code designs.
- Values recorded in these docs before 2026-10-11 as "confirmed from Canva brand docs"
  (amber `#d4922a`, cream `#f5f0e8`, Archivo Black, Source Sans 3) came from a session
  that does not appear to have actually read the prototype. They are superseded.

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

- **Nobody posts twice.** Direction is decided per content type and each item has
  exactly one origin (ADR 0005): **blog posts originate here** and are pushed to
  Meta; **news, events and trail conditions originate on Meta** and are pulled in.
  John Chase posts conditions via Facebook Live — never design a flow that moves
  that into a CMS. `News` and `Events` are reserved for Meta-sourced content and
  must not become Keystatic collections.
- **Board continuity.** Board members are not technical. Admin tools must be usable without touching code. Keep `HANDOFF.md` current whenever a service, account or secret is added.
- **Transferability.** This repo will be transferred to a future webmaster. No secrets in the repo; all external accounts owned by the org (friendsofafiercechase@gmail.com) where possible.
- **Accessibility and SEO are baseline**, not polish: semantic HTML, alt text, page descriptions, keyboard navigation, sufficient contrast.
- Board priorities, in order: (1) trail information, (2) events and community engagement, (3) donations and supporter growth.

## Known data issues

- **It is always "A Fierce Chase" — capital A. Never lowercase it.** The "A" is an
  initial: the trails are named for John and Sue Chase's son, whose first initial is A.
  So the organisation is "Friends of A Fierce Chase" and the trail system is "A Fierce
  Chase". It reads like a typo and will keep getting "corrected"; it is not one.
  **The logo artwork agrees**: the circular badge reads "A FIERCE CHASE". It is the
  Canva prototype's text and the logo usage guide's prose that lowercase it, and those
  two are wrong on this point — do not use them as authority for the casing.

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
