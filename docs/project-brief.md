# Friends of A Fierce Chase — Website Project Brief

_Consolidated October 10, 2026 from past chats, Google Drive, and Canva. Source documents are in `docs/source/`. Decisions since then live in `docs/decisions/`._

Owner: Jeneve Parrish, board member and webmaster
Live site today: friendsofafiercechase.org (Wix, built with the Wix Harmony AI editor; Business plan paid through **March 2028**)
Prototype: Canva Code site at https://foafc-prototype.my.canva.site/ (design "Friends of a Fierce Chase Website Prototype")

---

## 1. How the plan evolved

| When | Document | Direction |
|---|---|---|
| June 13, 2026 | Website Audit & Improvement Plan (`source/website-audit-2026-06.md`) | Stay on Wix. Phase 1: make everything real and current — trail map, Donate page (PayPal/Venmo/check), connect the real Bonfire store, mirror Facebook events, copy and link fixes, SEO basics. |
| Sept 2026 | Canva Code prototype | Full redesign mock with eight pages, including internal admin tools. |
| Sept 19, 2026 | Board brief (`source/board-brief-2026-09.md`) | Build a real custom site from the prototype, host free-tier on Vercel or Netlify, add a lightweight CMS, then DNS cutover from Wix. |
| Oct 10, 2026 | ADR 0001 | Monorepo in the `parrish-studio` org; extract packages when client #2 exists. |
| Oct 10, 2026 | ADR 0002 | Astro for the site; React for islands and module UI. |
| Oct 10, 2026 | ADR 0003 | Keystatic in GitHub mode as the CMS. |
| Oct 10, 2026 | ADR 0004 | Vercel Hobby hosting; public repo; org-owned account. |

The current direction is the custom build. The audit still matters: it records the board's priorities, the existing payment and store accounts, and the "don't make anyone post twice" principle.

## 2. Goals

**For the organization (board priorities, in order)**
1. Trail information — trails, map, history, photo gallery, area info and other things to do in Monson
2. Events and community engagement — events, volunteer opportunities, calendar
3. Donations and supporter growth

**For Jeneve (portfolio and foundation)**
- A portfolio piece and a repeatable foundation for client work
- Loosely coupled modules: Trails is one module and could be swapped for Scheduling or Commerce on another build
- Admin and internal apps are part of the offering, not just marketing pages
- Custom design system in plain CSS with custom properties (no MUI, no CSS-in-JS), for stability and easy client reskinning via token swap

## 3. Technical direction

- Custom codebase in GitHub (`parrish-studio/foafc-site`)
- Static site plus a light headless CMS
- Framework: **Astro**, static by default; **React** islands and module UI (ADR 0002)
- Hosting: **Vercel Hobby**, org-owned account, public repo; passes framed as suggested donations (ADR 0004)
- CMS: **Keystatic, GitHub mode** — content in the repo, editors sign in with GitHub (ADR 0003)
- Launch: DNS cutover of friendsofafiercechase.org away from Wix

## 4. Site map (from the board brief and prototype)

| Page | Contents |
|---|---|
| Home | Hero with CTA, live trail status banner, feature highlights (four-season activities, dog-friendly, volunteer-run), weather widget, donate prompt |
| Trails | Embedded Google map to trailhead, view/download trail map, all 12 trails with distance/difficulty/description, etiquette rules, safety guidelines |
| About | Mission and vision, board members, trail system history timeline, current projects and community impact |
| Blog | Featured post with image, chronological feed, newsletter signup sidebar, cross-linked to Facebook and Instagram |
| Events | Calendar view, upcoming events with RSVP, event details, cross-linked to Facebook |
| Donate | Day pass, season pass, custom amount, 501(c)(3) tax-deductible notice |
| Trail Desk _(internal)_ | Blog post composer and event manager for board members |
| Content Studio _(internal)_ | Rich content editor with image uploads and social cross-publishing |

Global: top nav, mobile hamburger menu, footer with org info, email signup, social links.
Prototype nav as built: Home · Trails · About · Blog · Events · Admin, plus a gold Donate pill.

## 5. Design system

- **Type:** Archivo Black (headings) + Source Sans 3 (body). _Note: the Canva prototype's hero headline appears to be a serif — confirm which is current._
- **Brand hex values (from Canva docs):** forest green `#1B4332`, amber/gold `#D4922A`, cream `#F5F0E8`
- **Additional palette colors discussed:** sage, warm brown, slate blue, navy (no hex values recorded yet; provisional values in `packages/tokens`)
- **Logo:** T-Rex on skis, circle badge. Variants: primary (badge), icon, horizontal, vertical, wordmark — each in Color, Green, Gold, Navy, Cream, White, Black. Usage rules in `source/logo-usage-guide.md`; asset links in `source/asset-index.md`.
- **Prototype look:** dark green header, photo hero with green overlay, gold primary buttons, outlined secondary buttons, sage status banner, cream body with a subtle dot texture.

## 6. Content and data already in hand

- Trail system: 12 named trails, 8.3+ miles (`packages/module-trails/data/trails.json`, `source/trail-system.md`)
- Donate copy and nonprofit details: EIN, 509(a)(2) status, mailing address (`source/donate-copy.md`)
- Trail map PDF: "Cross Country Ski Trails Map - No Legend.pdf" in the FOAFC Drive
- Merch: Bonfire store at bonfire.com/friends-of-fierce-chase-merch
- Existing payment channels: PayPal and Venmo

## 7. Content still needed

- [ ] Events: races, volunteer days, community events, recurring programs
- [ ] Board member bios and optional photos
- [ ] Social links (Instagram, Facebook; YouTube and X don't exist)
- [ ] Public contact email
- [ ] Trail photos, especially summer, fall, events, and volunteer work
- [ ] Donation setup decision: PayPal, Venmo, Stripe, check, or a nonprofit platform such as Zeffy or Givebutter
- [ ] Copy review of the prototype
- [ ] About Monson and other things to do in town

Notes at the end of the board brief (Sept 19 meeting):
- **Day pass is $20, not $10, and there is also a Family pass.** The prototype and Canva donate copy still show $10.
- Link trail cards to photos, Facebook, or voting
- "93 days" (context unclear — possibly the season length)
- Dynamic content wanted: the trail report, projects, articles

## 8. Principles

- **Facebook stays the source of truth** for events and trail conditions. John Chase posts conditions via Facebook Live. The site mirrors that automatically and never asks anyone to post twice.
- **Board continuity:** a second board member needs admin access to hosting, domain, and CMS, plus a one-page how-to (`HANDOFF.md`).
- **Accessibility and SEO basics:** page descriptions, alt text, Google Search Console, Google Business Profile.

## 9. Open decisions

1. ~~Next.js vs Astro~~ — **Astro** (ADR 0002)
2. ~~Headless CMS~~ — **Keystatic, GitHub mode** (ADR 0003). Content Studio's social cross-publishing still open.
3. ~~Hosting~~ — **Vercel Hobby** (ADR 0004)
4. Data source for the live trail status and the weather widget
5. How to pull Facebook events and posts in automatically
6. Donation processor
7. One canonical color token set; heading typeface confirmation
8. Pricing: Day $20, Family pass amount, Season $150?
9. Whether the Shop/Bonfire link appears in the new nav
