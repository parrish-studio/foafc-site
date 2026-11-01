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
| Bonfire | Merch, print on demand | **Login holder unknown — needed to relaunch the store (ADR 0007)** | | Free | — | Verified nonprofit org page: `bonfire.com/org/friends-of-a-fierce-chase-cross-country-ski-trails-991538734`. $269 raised lifetime. The one campaign, `bonfire.com/friends-of-fierce-chase-merch`, **ended 15 Jan 2026** (10 of a 20 goal, $146) and is not buyable. See "Merch" below. |
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
| pnpm version | Vercel reads `packageManager` but resolves it loosely: a build log reading `from package.json#packageManager pnpm@9.12.0` finished `using pnpm v9.15.9`. So the exact pin holds locally and in CI, not on Vercel — it gets the newest 9.x. Harmless so far, but do not assume the deployed build used the pinned patch. |
| Node version | **Pinned to `24.x`** via `engines` in `apps/foafc/package.json`, which overrides the dashboard setting. See "Why the Node major is pinned" below — do not loosen it to a range. |

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

### Why the Node major is pinned

`apps/foafc/package.json` says `"node": "24.x"`, not a range. Three facts make
that necessary rather than fussy:

1. **The adapter bakes the build machine's Node major into the deployment.**
   `@astrojs/vercel` calls `getRuntime(process)`, reads `process.version`, and
   writes `nodejs<major>.x` into the function config. Build on 22 and the
   function runs 22. Its support table stops at 24, so a build on Node 26 logs
   "not supported… will use Node.js 24" and silently emits `nodejs24.x`.
2. **Vercel maps an open range to the newest major.** Its docs show
   `>=22.0.0` resolving to the latest 26.x. The old `>=22.12.0` therefore meant
   "build on whatever Vercel's newest is", which today is 26.
3. So the old config gave **a build on 26 and a function on 24**, chosen by
   nobody, and liable to change again whenever Vercel moves its default. Node
   26 also changes `fetch` behaviour (Vercel documents an HTTP/1.1 opt-out),
   which is the kind of thing that breaks `/api/weather` quietly.

Pinning makes the build and the runtime the same version and stops the drift.
Move to `26.x` only once `@astrojs/vercel` lists 26 in `SUPPORTED_NODE_VERSIONS`
— otherwise the mismatch comes straight back.

The root `package.json` keeps `>=22.12.0`, which is Astro 7's real floor and
only governs local tooling. `.nvmrc` says `24`, so `nvm use` with no argument
lands on the right one.

### Node security patches

**Not ours to apply.** Vercel's docs: "Only major versions are available.
Vercel automatically rolls out minor and patch updates when needed, such as to
fix a security issue." Nothing in this repo pins a Node patch version and
nothing can — `24.x` always resolves to Vercel's current 24.

So when a Node advisory lands (the October 2026 batch, ten CVEs including the
Brotli decoder RCE, is the example), the action here is **nothing**, beyond
checking that the site's exposure is what you think it is. For this site that
means remembering it is static HTML plus one function, and that the function's
only outbound hosts — `api.weather.gov` and `api.github.com` — are hard-coded
constants, so the class of CVE that needs an attacker-influenced hostname does
not reach us.

Local builds are a different matter: keep the machine's Node current, which is
what `.nvmrc` and the version guard in `scripts/verify.mjs` are for.

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
    of commercial usage.

  Where that line falls matters, and ADR 0007 works it through. A `/shop/` page
  with product photography and prices is advertising a sale, whoever takes the
  payment. A link to the organisation's own Bonfire page is not obviously that
  — the footer already links to Facebook, a commercial company. The merch
  decision is a link, and stays on the safe side of the line.

  The penalty is a paused deployment — the whole site, not one page — so stay
  conservative where it costs nothing.

### Merch

Decided in **ADR 0007**: one link out to a Bonfire store, branded on Bonfire's
side. No shop page, no prices on this domain.

**Blocked on Bonfire, not on us.** The campaign ended 15 January 2026 and the
org page sells nothing, so there is no live destination. Bonfire distinguishes
a **campaign** (time-boxed, ends, and the link dies with it) from an
**on-demand merch store** (stays open). Relaunching as a store is a board
action, and it is the prerequisite for the link.

**Two things are needed to do it**, both open:

1. **The Bonfire admin login.** Nobody has recorded who holds it. Same class of
   problem as the friendsofafiercechase@gmail.com password, and worth finding
   at the same time.
2. **A board decision to relaunch as a store rather than another campaign.**

Merch proceeds are **not** donations, and the site must never imply they are:
on the one campaign with numbers, a $27.99 tee returned about $14.60 to FOAFC
and the buyer got a shirt for the rest. ADR 0007 has the reasoning.
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

### Keeping dependencies current

Three things run on their own. None of them needs anybody to remember.

| What | When | What it does |
|---|---|---|
| **CI** (`.github/workflows/ci.yml`) | Every push to `main`, every PR | Install, `pnpm check`, `pnpm build`, `pnpm verify`. |
| **Audit** (`.github/workflows/audit.yml`) | Mondays, 13:00 UTC | `pnpm audit`, failing on high and critical. |
| **Dependabot** (`.github/dependabot.yml`) | Weekly | Opens one grouped PR for minor and patch updates; majors get their own. |

**CI matters more here than on a normal repo.** Board members edit through
Keystatic, which commits straight to `main` through the GitHub API, and Vercel
deploys that immediately. No git hook can run for those commits. CI is the only
thing that will notice a content edit that breaks the build — it cannot stop
the deploy, but it turns a silent breakage into a red tick and an email.

**What to do with a Dependabot PR:** if CI is green, merge it. That is the
whole procedure for the grouped minor-and-patch one. A major deserves a look at
the changelog first, which is why they are not grouped.

**Read the CI tick, not the Vercel one.** They check different things and they
disagree. Vercel runs `pnpm build`, which does not type-check. CI runs
`pnpm check` as well. The first major Dependabot opened — TypeScript 7 — came
up **green on Vercel and red on CI**, because TS 7's native compiler drops the
programmatic API `astro check` is built on. Vercel would have deployed it
happily. Anything that looks green on Vercel alone has only been proven to
build, not to be correct.

One already-known hold: **TypeScript majors are ignored** in
`.github/dependabot.yml` until Astro supports the native compiler
(withastro/roadmap#1321). Minor and patch still come through.

**Why the audit is not part of CI.** Its advisory database changes without us.
Wired into the build, a board member's content edit could fail because someone
published an advisory overnight for a build-time package three levels down that
nobody here can patch. That teaches people to ignore a red tick, which is worse
than not checking at all. So it is weekly and separate, and GitHub emails the
repo owner when it fails.

**Why it fails only on high and critical.** As of 2026-11-01 there are four
moderate and two low findings outstanding — `glob`, `minimatch` and `fast-uri`
— and every one is held by a parent package's version range, so no change here
can clear them. They need an upstream release. Gating on moderate would mean a
job that is red forever and therefore ignored. Raise the threshold the day
those clear.

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
