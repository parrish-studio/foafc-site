# ADR 0003 — Keystatic (GitHub mode) as the CMS

Date: 2026-10-10
Status: Accepted

## Context

Board members need to publish news, events and page updates without touching code. Requirements: free, simple, survives a handoff, works with Astro (ADR 0002). Board members are not technical, but creating a GitHub account is no harder for them than creating any other account.

## Decision

- Use **Keystatic in GitHub mode** as the CMS. Content is stored in the repo as Markdown/Markdoc/JSON and read by Astro content collections.
- Editors sign in at `/keystatic` with their own GitHub accounts and are added as collaborators on `parrish-studio/foafc-site`.
- Saves commit directly to `main`; the host rebuilds and changes are live in a minute or two.
- The Keystatic admin is the core of the "Trail Desk" (news and event composer). Custom admin UI is only built where Keystatic falls short.
- Public pages stay static. Keystatic's admin and auth routes need a small server route (Astro SSR adapter for those routes only), so the chosen host must support serverless functions. Vercel, Netlify and Cloudflare all do.

## Why

- **Free:** GitHub mode has no per-user cost. Keystatic Cloud (free for up to 3 users) is not needed.
- **Content travels with the repo:** no external content service to migrate or cancel at handoff; every edit is versioned and reversible.
- **Fits the stack:** React admin (matches ADR 0002), schemas in TypeScript next to the module cores.
- **Platform bonus:** Keystatic also integrates with Next.js, so future clients on either framework (ADR 0002) can share the same CMS, schemas and editor experience.

## Rejected

- **Sveltia CMS** (Decap successor): free and serverless apart from an OAuth proxy, but YAML config and no TypeScript schemas. Closest runner-up; remains the fallback.
- **Decap CMS:** maintenance has stalled.
- **Pages CMS:** best editor sign-in (email invites), but a single maintainer and a hosted dependency.
- **TinaCMS:** visual editing is appealing, but cloud dependency, 2-user free tier and heavier setup.
- **Hosted API CMSs:** not evaluated in depth; content would live outside the repo, adding a vendor and a migration risk at handoff.

## Consequences

- Each editor's GitHub account gets write access to the whole repo. Accepted for a small, trusted board; the commit history records who changed what. Revisit if the editor group grows.
- Uploaded images are committed to the repo. Astro optimises them at build time. Move media to external storage if the photo library grows large.
- A one-to-two-minute publish delay is normal and must be explained in the editor how-to.
- Live data (trail status, Facebook events) is **not** CMS content and needs its own sync (separate ADR).
- Social cross-publishing (the "Content Studio" idea) is out of scope for the CMS and conflicts with Facebook being the source of truth; revisit separately.
- Setup adds a Keystatic GitHub App and its secrets to `HANDOFF.md`.
