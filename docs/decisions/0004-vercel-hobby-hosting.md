# ADR 0004 — Host on Vercel (Hobby), public repo, org-owned account

Date: 2026-10-10
Status: Accepted — amended 2026-10-11 (see Amendment), action items pending

## Context

Hosting must be free, support Astro static output plus serverless functions for Keystatic's sign-in routes (ADR 0003), and be manageable by a future volunteer webmaster. Cloudflare was ruled out. Fastly (Jeneve's employer) and Vercel (where Jeneve already hosts a site) were compared.

## Decision

- Host `apps/foafc` on **Vercel, Hobby plan**, with git-push deploys from `main` and preview deploys for branches.
- Create the Vercel account with **friendsofafiercechase@gmail.com**, not Jeneve's personal Vercel account. Hobby has no team members, so the org-owned login is how admin access is shared and handed over. Credentials are kept where the board can reach them (see `HANDOFF.md`).
- **Make `parrish-studio/foafc-site` public.** Vercel Hobby cannot deploy private repos owned by a GitHub organization; public org repos are allowed. The repo holds no secrets by design, its content is the public website, and the packages are headed for open source anyway.
- **Frame day, season and family passes as suggested donations**, not sales. Vercel Hobby is for non-commercial use; Vercel states that asking for donations is not commercial use, and Jeneve's work is unpaid volunteer work. This framing also reflects how the trails actually operate (open to the public, supported by donations).

## Why

- First-class Astro and Keystatic support; zero-config deploys; preview URLs.
- Hobby allowances (100 GB transfer, 1M function invocations per month) far exceed FOAFC's needs.
- Mainstream and familiar: the most likely platform for a successor to know.
- Jeneve already uses Vercel.

## Rejected

- **Fastly Compute:** no official Astro adapter (a staff-recommended community guide exists but is dated), Keystatic's SSR routes would be on an unsupported path, free usage appears to be trial credit rather than a permanent tier, and it's an unlikely platform for a volunteer successor. Better showcased on a future client or a platform demo.
- **Cloudflare:** ruled out by Jeneve.
- **Netlify:** viable, but no advantage over Vercel given existing familiarity.
- **Keeping the repo private + deploying via GitHub Actions and the Vercel CLI:** works, but adds a pipeline to maintain. Fallback if the repo must stay private.

## Consequences

- If FOAFC ever needs to charge for something (paid event tickets, merch sold on-site rather than via Bonfire), revisit the plan: that would be commercial use requiring Vercel Pro or another host.
- Paid client work under Parrish Studio cannot use Hobby; client sites will need Pro or another host.
- Action items: (1) ~~make the repo public~~ — done 2026-10-10, (2) create the Vercel
  account under the org email — **deferred, see Amendment**, (3) connect the repo and set
  Keystatic env vars, (4) record all of it in `HANDOFF.md`.

## Amendment — 2026-10-11: deployed on a personal account, transfer pending

The decision above says the Vercel account must be created with
friendsofafiercechase@gmail.com. That has not happened. **Nobody currently has that
Gmail's password** — the webmaster has only shared access to the org's Drive from a
personal Google account, not the login itself.

Rather than block the first deploy on a board conversation, the site is being deployed
to the **webmaster's personal Vercel account** as an interim measure. Vercel projects
can be transferred between accounts, so this is reversible.

The original reasoning is unchanged and still the target. What this costs in the
meantime:

- Only the webmaster can reach hosting. Hobby has no team members, so a second admin
  cannot be invited — the board-continuity requirement in the brief is unmet.
- If the webmaster's personal account is later upgraded to Pro for Parrish Studio client
  work, FOAFC's site would sit on a paid plan the organisation neither controls nor
  funds. Paid client work must therefore be kept on a separate Pro team, never added to
  the Hobby account hosting FOAFC.
- Hobby's non-commercial restriction is still satisfied: Vercel's fair use guidelines
  state that asking for donations does not constitute commercial usage.

Tracked as an open item in `HANDOFF.md` ("Open: move hosting to the org") with the steps
to close it. This amendment exists so the deviation is visible rather than looking like
the decision was simply ignored.
