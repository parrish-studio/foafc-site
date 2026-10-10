# HANDOFF.md

Everything a future webmaster needs to take over this site. **Update this file whenever you add a service, account, domain setting or secret.**

Never put passwords, tokens or recovery codes in this file or anywhere in the repo. Record *where* they are kept instead.

## People

| Role | Name | Since |
|---|---|---|
| Webmaster / repo owner | Jeneve Parrish | 2026 |
| Second board member with admin access | _TBD — board to designate_ | |

## Accounts and services

| Service | Purpose | Owned by (login) | Admins | Cost | Renewal | Credentials kept at |
|---|---|---|---|---|---|---|
| GitHub — `parrish-studio/foafc-site` | Source code | parrish-studio org (Jeneve) | Jeneve | Free | — | — |
| Wix | Current live site (to be retired) | _confirm_ | _confirm_ | Business plan, prepaid | **March 2028** | _TBD_ |
| Domain registrar — friendsofafiercechase.org | Domain | _confirm registrar and login_ | | | _confirm_ | _TBD_ |
| DNS | Points domain at hosting | _TBD_ | | | | |
| Vercel (Hobby) | Site hosting and deploys | friendsofafiercechase@gmail.com (_to create_) | Shared org login (Hobby has no team members) | Free; non-commercial use only | — | _TBD — board password store_ |
| Keystatic (GitHub mode) | Board content editing at `/keystatic` | Keystatic GitHub App installed on parrish-studio (_to set up_) | Jeneve | Free | — | App secrets in hosting env vars |
| GitHub collaborators | Board editors' accounts with write access to `foafc-site` | Each editor | Jeneve | Free | — | Editors' own logins |
| Facebook page / app | Events and trail conditions source | _confirm_ | | | | |
| Google account friendsofafiercechase@gmail.com | Drive assets, org identity | Org | | Free | — | _TBD_ |
| Bonfire | Merch store | _confirm_ | | Free (print on demand) | — | |
| PayPal / Venmo | Donations | _confirm_ | | Fees per transaction | — | |
| Google Search Console / Business Profile | SEO | _TBD_ | | Free | — | |

## Environment variables

Set in the hosting dashboard, never committed. List names and what they're for here.

| Name | Used by | Purpose |
|---|---|---|
| `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Keystatic | Editor sign-in via the Keystatic GitHub App (expected names; confirm at setup) |

## Routine tasks

_To be written once the CMS is chosen: posting news, adding an event, updating trail status, swapping the trail map._

## Transferring ownership

1. Add the new webmaster as an admin on every account above.
2. Transfer the GitHub repo (Settings → Transfer) to their account or org.
3. Confirm they can deploy, edit content and reach DNS.
4. Remove the outgoing webmaster's access and update this file.
