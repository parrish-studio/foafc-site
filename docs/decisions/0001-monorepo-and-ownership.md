# ADR 0001 — Monorepo now, extract packages later; studio org owns the repo

Date: 2026-10-10
Status: Accepted

## Context

The FOAFC site is also the first build of a reusable platform for small-business sites and apps. There is one consumer today. Jeneve is the only technical board member and will own the site while webmaster, but ownership must be easy to transfer later. Future client work will follow the same pattern: build, maintain, eventually hand off.

## Decision

- One repo, `parrish-studio/foafc-site`, organised as a pnpm workspaces monorepo: `apps/foafc` plus `packages/*`.
- Packages are not published yet. When a second client site exists, extract `packages/*` into a separate platform repo (preserving history with `git filter-repo`) and publish them, most likely as open source (MIT), so transferred sites can keep installing them.
- The repo lives in the `parrish-studio` GitHub org, not a personal account, so individual repos can be transferred cleanly.
- External accounts (hosting, DNS, CMS, Facebook app) are created under the organisation's own identity (friendsofafiercechase@gmail.com) wherever possible, with the webmaster added as admin. Tracked in `HANDOFF.md`.

## Rejected alternatives

- **Single site repo, extract later:** no enforced boundaries, so coupling creeps in and extraction becomes a refactor.
- **Forkable starter template for shared code:** forks drift; fixes never reach earlier sites.
- **Published libraries from day one:** versioning and release overhead for a single consumer, and premature abstraction.
- **One monorepo for all client sites:** client ownership, access control and handoff get messy.

## Consequences

- Boundary rules in `CLAUDE.md` must be enforced (lint rules once tooling exists).
- At the split, the FOAFC repo keeps its history and is the one transferred; packages move out.
