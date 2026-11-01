# ADR 0007 — Merch links out to a Bonfire-branded store

Date: 2026-11-01
Status: Accepted, blocked on a board action

## Context

FOAFC sells merchandise through Bonfire, print-on-demand. The June 2026
website audit listed "connect the real Bonfire store" as Phase 1 work and left
"link out or embed" open. Open question 9 in `docs/project-brief.md` asks
whether a Shop link belongs in the nav at all.

What is actually there, checked 2026-11-01:

- A **campaign** at `bonfire.com/friends-of-fierce-chase-merch` that **ended on
  15 January 2026**. It sold 10 shirts against a goal of 20 and raised $146 on
  a $27.99 tee. Nothing is buyable.
- A **verified nonprofit org page** at
  `bonfire.com/org/friends-of-a-fierce-chase-cross-country-ski-trails-991538734`
  showing $269 raised to date. It sells nothing — it invites visitors to start
  a fundraiser on FOAFC's behalf.

Bonfire distinguishes a **campaign**, which is time-boxed and ends, from an
**on-demand merch store**, which stays open. FOAFC has only ever run the first.
A website link needs the second, or it goes dead on a date nobody remembers.

## Decision

**A single nav link out to a Bonfire store, styled on Bonfire's side to look
like us. No shop page, no product listings, no prices on this domain.**

Bonfire stores support a logo, colours and a banner. That is where the
branding work goes. Our side is one link.

Blocked until the board relaunches the campaign as an on-demand store, which
is a Bonfire action, not a website one. Until then there is nothing to link to
and the nav stays as it is.

## Why not a shop page on our site

A `/shop/` page carrying product photos, names and prices — with a "Buy on
Bonfire" button per item — would look better and would be the obvious thing to
build. Two reasons not to.

**It goes stale.** Product data would be hand-maintained. Bonfire has no feed
we could pull, so every design added or retired on Bonfire is a code change
here. The failure mode is a site advertising a shirt nobody can buy, which is
exactly the situation this ADR exists to get out of.

**It is the one version that is plainly commercial.** Vercel's fair use
guidelines list "advertising the sale of a product or service" as commercial
usage, which the Hobby plan does not allow. A page with product photography
and prices is that, whoever takes the payment. A nav link to the
organisation's own Bonfire page is much harder to call advertising a sale —
it is the same shape as the Facebook and Instagram links already in the
footer. See "On the hosting question" below; the point of this decision is
that it does not depend on resolving that.

## Why not the Bonfire Pro embed

Bonfire Pro collections offer an "Embed on another website" option. Three
problems: it is Bonfire's styling inside our page, so less seamless than
"embed" sounds; it is a third-party frame setting third-party cookies, like
the Maps iframe; and the help centre does not say what Pro costs a nonprofit.
Revisit only if the board ends up on Bonfire Pro for other reasons.

## On the hosting question

An earlier draft of this treated Vercel's non-commercial clause as a blocker
for merch of any kind. That was an over-reading and it is worth writing down
why, because the question will come back.

The guidelines say, in these words:

- *"Asking for Donations **does not** fall under commercial usage."*
- *"Advertising the sale of a product or service"* **is** commercial usage.

The enumerated examples around that second line — processing payment,
affiliate linking as the primary purpose, AdSense — describe sites whose
purpose or revenue model is commerce. An informational nonprofit site with a
link to its own merch page is not that, and the footer already links to
Facebook, a commercial company, without anyone thinking it advertises a sale.

So **the decision above is defensible on Hobby as written**: a link, no
prices, no product photography, copy that describes the organisation's store
rather than urging a purchase. A `/shop/` page would not be.

The enforcement risk was also overstated. Vercel is not scanning nonprofit
sites for merch links; action follows abuse reports and usage outliers. But
the penalty is a paused deployment — the whole site, not the page — so the
asymmetry is bad enough to stay on the conservative side of a line that costs
us nothing to stay on.

**If the board ever wants the shop page**, that is a hosting move, not a
design argument. Cloudflare Pages and Netlify both have free tiers with no
non-commercial clause. It would mean revisiting ADR 0004 and re-pointing the
Keystatic GitHub App callback URL.

## Merch proceeds are not donations

Worth stating because it comes up and because it changes how the page may be
worded.

On the one campaign we have numbers for: a $27.99 tee, 10 sold, $146 raised.
About $14.60 per shirt reached FOAFC; the rest paid for the shirt. The buyer
received goods of roughly the remaining value.

That is a purchase with a margin donated, not a donation. It is why Bonfire
says "raised" rather than "donated", and why the Donate page's language —
passes as *suggested donations*, nothing received in return (ADR 0004) —
works there and must not be copied onto merch. Telling a buyer their t-shirt
is tax-deductible would be wrong, and for a 501(c)(3) it is the kind of wrong
that matters.

## Consequences

- One nav or footer link when the store exists. No `/shop/` route, no product
  data in the repo, nothing to keep in sync.
- Branding lives on Bonfire, so the board can change it without a developer —
  which is the `HANDOFF.md` "routine tasks" test, and it passes.
- Someone needs the Bonfire admin login. Nobody has recorded who holds it; it
  is now in the accounts table as an open item alongside the
  friendsofafiercechase@gmail.com password.
- Whoever relaunches the store should fix the capital A: the campaign page
  reads "Friends of a Fierce Chase".
