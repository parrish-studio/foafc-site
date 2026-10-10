# ADR 0004 — Host on Vercel (Hobby), public repo, org-owned account

Date: 2026-10-10
Status: Accepted — action items pending

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
- Action items: (1) ~~make the repo public~~ — done 2026-10-10, (2) create the Vercel account under the org email, (3) connect the repo and set Keystatic env vars, (4) record all of it in `HANDOFF.md`.
