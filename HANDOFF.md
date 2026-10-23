# HANDOFF.md

Everything a future webmaster needs to take over this site.

**This is a living document, not a handover-day artifact.** Handover is a long
way off — the site will be built out and validated in production on the `.org`
domain for months first. Keep it current as the site is built, so that when
handover does happen nothing has to be reconstructed from memory. **Update it
whenever you add a service, account, domain setting or secret.**

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
| Vercel (Hobby) | Site hosting and deploys | **Jeneve's personal Vercel account** (interim — see "Open: move hosting to the org") | Jeneve only | Free; non-commercial use only | — | Jeneve's own login |
| rclone remote `foafc` | Read-only Drive access for pulling brand assets | Webmaster's personal Google account | Jeneve | Free | Shared client ID retires during 2026 | Local `~/.config/rclone/rclone.conf` (not in the repo) |
| Keystatic (GitHub mode) | Board content editing at `/keystatic` | Keystatic GitHub App installed on parrish-studio (_to set up_) | Jeneve | Free | — | App secrets in hosting env vars |
| GitHub collaborators | Board editors' accounts with write access to `foafc-site` | Each editor | Jeneve | Free | — | Editors' own logins |
| Facebook page / app | Events and trail conditions source | _confirm_ | | | | |
| Google account friendsofafiercechase@gmail.com | Drive assets, org identity | Org | **Credentials holder unknown — the webmaster does not have them** | Free | — | _UNKNOWN — must be found; blocks org-owned hosting_ |
| Bonfire | Merch, print on demand | _confirm_ | | Free | — | Verified nonprofit org page: `bonfire.com/org/friends-of-a-fierce-chase-cross-country-ski-trails-991538734`. $269 raised lifetime. The one campaign, `bonfire.com/friends-of-fierce-chase-merch`, **ended 15 Jan 2026** (10 of a 20 goal, $146) and is not buyable. See "Merch" below. |
| PayPal / Venmo | Donations | _confirm_ | | Fees per transaction | — | |
| Google Search Console / Business Profile | SEO | _TBD_ | | Free | — | |

## External services with no account

Two things the site depends on need no sign-up, no key and no payment, which
is exactly why they are easy to forget until they break.

| Service | Used for | What breaks, and what to do |
|---|---|---|
| **National Weather Service** `api.weather.gov` (ADR 0006) | The weather card on the home page | US government, keyless, no rate limit published but it does ask for an identifying User-Agent, which `src/lib/weather.ts` sends. If it fails the card hides itself rather than showing stale numbers — the rest of the page is unaffected. A paid provider would be the fallback, but there is no reason to expect to need one. |
| **Google Maps embed** on the Trails page | Showing the trailhead | Keyless `maps?q=…&output=embed`, which Google has never formally documented. If it stops working, the page still carries the address and a "Directions" link, and the embed would need replacing with the Maps Embed API (free tier, but requires an API key and therefore an account and a billing profile). |

Neither sends anything identifying about a visitor from our side, but the Maps
iframe is Google's and sets Google's cookies. If the board ever wants a cookie
notice, that iframe is the reason it would be needed.

## Environment variables

Set in the hosting dashboard, never committed. List names and what they're for here.

**The repo is public** (Vercel Hobby requires it), so the config/secret split is
not academic — anything committed is world-readable, permanently, including in
git history.

| | Treat as |
|---|---|
| `SITE_URL` | Config. It is printed into every page's canonical tag and into `robots.txt`. Nothing to protect. |
| `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Config, by design. See the naming rule below. |
| `KEYSTATIC_GITHUB_CLIENT_ID` | Low sensitivity — appears in OAuth redirect URLs, not a credential alone. |
| `KEYSTATIC_GITHUB_CLIENT_SECRET` | **Secret.** Authenticates the GitHub App; leaking it lets someone act as the CMS. |
| `KEYSTATIC_SECRET` | **Secret.** Encrypts editor session cookies. |

**Naming rule:** in Astro, any variable prefixed `PUBLIC_` is inlined into the
browser bundle. The prefix is not a label describing intent — it is an
instruction to the bundler. Never give a credential that prefix.

| Name | Used by | Purpose |
|---|---|---|
| `SITE_URL` | Astro build | The origin this build is served from. **Set it to the Vercel URL for as long as the site lives on a temporary domain**, and remove it at the DNS cutover. It drives canonical URLs and whether the site may be indexed — see below. |
| `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_GITHUB_CLIENT_SECRET`, `KEYSTATIC_SECRET`, `PUBLIC_KEYSTATIC_GITHUB_APP_SLUG` | Keystatic | Editor sign-in via the Keystatic GitHub App (names confirmed against @keystatic/core 0.6.9). Not needed for the first deploy; `/keystatic/setup` generates them. |

### Why `SITE_URL` matters before the cutover

`friendsofafiercechase.org` still serves the Wix site. Without `SITE_URL`, every
page on the Vercel domain would carry a canonical link pointing at that domain
— telling search engines the new pages are duplicates of the Wix ones, which
damages the search presence you want to keep at launch.

With `SITE_URL` set to a non-production origin, the build also emits
`noindex, nofollow` and a `robots.txt` that disallows everything, so the staging
site cannot be indexed or compete with the live one.

At the cutover: delete `SITE_URL` (or set it to `https://friendsofafiercechase.org`)
and redeploy. Canonicals correct themselves, the noindex disappears and
`robots.txt` opens up. Logic lives in `apps/foafc/src/site.ts`.

## Deploying

Hosted on **Vercel, Hobby plan** (ADR 0004). Deploys happen on push to `main`;
branches get preview URLs.

### Vercel project settings

These are the only non-default settings. The repo is a pnpm workspaces monorepo,
which is why the root directory matters.

| Setting | Value |
|---|---|
| Framework preset | Astro |
| Root Directory | `apps/foafc` |
| Build command | *(default)* |
| Install command | *(default — Vercel runs pnpm at the workspace root)* |
| Node version | Vercel's default. `engines` in `apps/foafc/package.json` records Astro 7's floor (`>=22.12.0`); the adapter picks the runtime itself and currently emits `nodejs24.x`. |

Root Directory is the only thing to change. Vercel used to need an "Include
files outside the root directory" toggle for monorepos; that option no longer
exists, because Vercel now detects pnpm workspaces itself and installs from the
repository root. Do not go looking for it.

Its detection requires all of the following, which this repo satisfies — keep
them true or builds start installing the wrong thing:

- `pnpm-workspace.yaml` listing every workspace, and a lockfile at the repo root
- a unique `name` in every package's `package.json`
- internal dependencies declared explicitly (`apps/foafc` lists both
  `@parrish-studio/*` packages as `workspace:*` dependencies)
- `packageManager` set in the root `package.json`

The same detection drives "skip unaffected projects", which is on by default:
a push that touches only `packages/*` still rebuilds the site, because those are
declared dependencies of `apps/foafc`.

`@astrojs/vercel` writes `apps/foafc/.vercel/output`, which is exactly where
Vercel looks when the root directory is `apps/foafc`. Nothing else to configure.

### First-time setup, in order

1. The Vercel account. **Currently Jeneve's personal account**, as an interim
   measure — nobody has located the login for friendsofafiercechase@gmail.com.
   See "Open: move hosting to the org" below; this is a deliberate deviation
   from ADR 0004, not an oversight.
2. Import `parrish-studio/foafc-site` and apply the settings above. Deploy.
   The public site works at this point; only `/keystatic` is incomplete.
3. Note the assigned `*.vercel.app` URL. Keystatic's GitHub App needs it.
4. Visit `https://<that-url>/keystatic/setup` and follow the wizard. It creates
   the Keystatic GitHub App and gives you the four environment variables.
5. Add those four variables in Vercel → Settings → Environment Variables, then
   redeploy. `/keystatic` now accepts GitHub sign-in.
6. Add each board editor as a collaborator on the GitHub repo.

Deploy before creating the GitHub App, not after: the app's callback URL has to
match the real deployed domain, so the domain must exist first. The same applies
again at the `.org` cutover — the callback URL must be updated to the new domain
or editor sign-in breaks.

### Open: move hosting to the org

**The site is hosted on the webmaster's personal Vercel account.** ADR 0004
decided hosting should sit on an account owned by
friendsofafiercechase@gmail.com, and that remains the target.

This is deliberate and not urgent. The site will be built out and validated in
production on the `.org` domain for months before any handover, and the
webmaster is an active board member throughout. Revisit it as part of handover
planning, not before — but do not lose it, which is why it is written down.

What it costs while it stands:

1. If the webmaster is unavailable, **no one can reach hosting** — no env var
   fix, no rollback, no DNS change. Hobby has no team members, so a second
   admin cannot simply be invited.
2. If that personal account is ever upgraded to Pro for paid client work,
   FOAFC's site ends up on a plan the organisation does not control or pay for,
   and would have to move if the subscription lapsed.
3. Vercel Hobby is non-commercial. FOAFC qualifies (donations are explicitly
   not commercial usage), but **paid client work must not be put on this same
   Hobby account** — that needs a Pro team, kept separate from FOAFC.

To close it, when the time comes:

1. Find who holds the friendsofafiercechase@gmail.com login and record it in
   the accounts table above. Worth doing early and independently of hosting —
   that account owns the Drive, the brand assets and the org's identity, and
   nobody currently having it is a gap on its own.
2. Create a Vercel account with that address.
3. Transfer the project (Vercel → Project Settings → Transfer). Projects move
   between accounts; the deployment URL and git connection carry over.
4. Re-point the Keystatic GitHub App callback URL if the domain changes, or
   editor sign-in breaks.
5. Update this file and ADR 0004.

### Constraints to respect

- Hobby is **non-commercial**. Nothing on the site may sell goods or services
  directly; passes are presented as suggested donations (ADR 0004). Paid event
  tickets or on-site merch sales would require Vercel Pro or another host.

  Checked against Vercel's live fair use guidelines (updated 2026-09-14), which
  are more specific than ADR 0004 recorded:

  - **"Asking for Donations does not fall under commercial usage."** In those
    words, in the page's own note. The Donate page is unambiguously fine.
  - **"Advertising the sale of a product or service"** is an enumerated example
    of commercial usage — alongside processing payment, affiliate linking and
    advertisements. It does not matter that a merch checkout would happen on
    Bonfire's domain; a Shop page on this site advertises a sale, which is the
    thing named.

  The penalty is not a warning about one page. Vercel pauses the deployment,
  so the whole site goes down.

### Merch

**Nothing can be hooked up today**, for two independent reasons.

1. There is nothing live to link to. The Bonfire campaign ended in January and
   the org page sells nothing — it invites visitors to start a fundraiser.
   Bonfire distinguishes a **campaign** (time-boxed, ends, dies) from an
   **on-demand merch store** (stays open). A website needs the second; FOAFC
   has had the first. Relaunching as a store is a board action on Bonfire's
   side and is the prerequisite for everything else here.
2. Even with a live store, a Shop page breaks Hobby's terms, per above.

So merch is gated on a hosting decision, not a design one. Vercel Pro is $20
per member per month, against $269 of merch raised in the organisation's
lifetime. If the board wants merch on the site, moving to a host without a
non-commercial clause — Cloudflare Pages and Netlify both qualify on their
free tiers — is the proportionate answer, and it means revisiting ADR 0004 and
re-pointing the Keystatic GitHub App callback URL.
- The repo must stay **public** — Hobby cannot deploy private org-owned repos.
  So never commit secrets or private board material.

## Pulling brand assets from Drive

The logo and photo assets live in a Drive folder owned by
friendsofafiercechase@gmail.com and shared with the webmaster. The local machine
has an `rclone` remote named `foafc`, authorised read-only against the
webmaster's personal Google account:

```
rclone backend copyid foafc: <drive-file-id> apps/foafc/src/assets/photos/
```

`docs/source/asset-index.md` lists the folders and file IDs.

**Expiry to watch:** this remote uses rclone's shared Google client ID, which
rclone says is being retired during 2026. When it stops working, create a
personal client ID (https://rclone.org/drive/#making-your-own-client-id, ~10
minutes) and re-run `rclone config`. Nothing about the site breaks in the
meantime; only asset fetching is affected.

## Routine tasks

### Writing a blog post

Blog posts originate here and are the only content type that does (ADR 0005).
Everything else — events, news, trail conditions — comes from Facebook.

1. Go to `https://<the site>/keystatic` and sign in with GitHub.
2. **Blog → Create**. Fill in the title, the date, and a one-line **summary**;
   the summary is what shows on the blog index, so write it for someone
   deciding whether to click.
3. A **cover image** is optional. With one, the post gets the wide featured
   treatment at the top of the blog index when it is the newest. Always fill in
   the image description — it is what a screen reader reads out, and what shows
   if the image fails to load.
4. Leave **draft** ticked while you are still working. See below for exactly
   what that does — it is not quite what "draft" usually means.
5. Save. Keystatic commits to `main` and the site redeploys itself in about a
   minute.

### Editing or deleting a post

Same place: **Blog**, pick the post, edit and save, or use **Delete**. Both are
ordinary commits, so nothing is ever truly lost — a deleted post can be
recovered from the repository's history by whoever maintains the site.

### What "draft" actually does

A draft **is published to the live site at its real URL**. It is kept off the
blog index, out of the sitemap and out of search engines, so nobody will come
across it — but anyone who has the link can read it.

That is on purpose. Board members do not run a development server, and the only
honest way to let someone review a post as it will really look is to render it
somewhere they can open. The trade is that a draft is **unlisted, not private**.
Do not put anything in a draft that would be a problem for a stranger to read.

To publish: open the post, untick **draft**, save. The post joins the blog
index and the sitemap, and the newest one takes the featured slot at the top.

### Launching with no posts at all

The blog is designed for this. With nothing published, `/blog/` shows a short
note pointing at Events and Facebook rather than an empty page. Nothing needs
disabling and the nav link can stay.

### Not yet routine

Adding an event, updating trail status and swapping the trail map all still
require a developer. Events and trail status are waiting on the Facebook sync
(`docs/plans/`); the trail map is a Drive link that the board can change at the
Drive end without touching the site.

## Transferring ownership

1. Add the new webmaster as an admin on every account above.
2. Transfer the GitHub repo (Settings → Transfer) to their account or org.
3. Confirm they can deploy, edit content and reach DNS.
4. Remove the outgoing webmaster's access and update this file.
