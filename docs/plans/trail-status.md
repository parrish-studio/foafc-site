# Plan — trail status

**Status: plan only. Nothing here is built.**

The home page banner the prototype shows as "All trails open — 6 miles
groomed". The last unresolved part of open question 4.

## Direction is being reconsidered

ADR 0005 put trail conditions on the Meta side: John posts via Facebook Live,
the site pulls. The alternative now under consideration is the blog's shape —
John enters status in the admin, the site is the origin, and posting to socials
is a side effect.

Reasons the site-as-origin version looks better:

- **The site gets structured data.** "Open/closed, 6 miles groomed, as of
  Tuesday" is three fields. Pulling the same facts out of Facebook means
  parsing prose, or worse, parsing the description of a live video. That is
  brittle in a way that will fail silently and intermittently.
- **No Meta dependency for the site's most important fact.** Whether the trails
  are open is the single most useful thing on the site. Making it depend on API
  tokens that expire and app review that can lapse puts the most valuable
  content behind the most fragile mechanism.
- **The same push machinery as the blog.** One integration, two content types.

## The thing that makes this different from the blog

**A stale trail status is worse than no trail status.**

A blog post from last month is simply an old post. A banner saying "All trails
open" when they were closed on Friday is misinformation, and it is the kind
that puts someone on an unsafe trail in winter. The feature is therefore not
"display the latest status" — it is "display the latest status *and be honest
about how old it is*".

Non-negotiables if this is built:

1. **Every status carries its own timestamp**, shown to the reader. "All trails
   open — updated Tuesday 8am", never a bare "All trails open".
2. **It expires.** After some window — a day or two in season — the banner stops
   asserting and falls back to something like "No recent update. Check
   Facebook." Expiry must be automatic, not dependent on anyone remembering to
   clear it.
3. **Expiry is visible to the person who set it**, so John can see the site is
   no longer claiming anything.
4. **Closed must be as easy to set as open**, and ideally faster. The dangerous
   direction is a stale "open".

Point 2 is the one most likely to be dropped for being inconvenient. It is the
reason the feature is safe.

## The real risk: will it actually get used

John currently posts conditions **by Facebook Live, from his phone, at the
trailhead**. A web admin form is a different act, not a smaller one.

- If he does both, that is posting twice — the exact failure the "nobody posts
  twice" principle exists to prevent.
- If he stops doing Live, the community loses something the form does not
  replace.
- If he forgets the form, the site goes stale, which point 2 above contains but
  does not fix.

The honest framing: the video and the structured status serve different
purposes. The video is engagement and detail. The status is a fact the website
needs in a form it can display. They can coexist **only if entering the status
takes about ten seconds**.

That sets a hard design constraint: **phone-first, and nearly zero effort.**
Realistically a couple of taps — open/closed, miles groomed, submit — on a
phone, outdoors, possibly with gloves on. If it is a Keystatic form with
several fields, it will not get used in February, and the honest thing is to
know that now rather than after building it.

**This is a question for John, not a design decision.** It is in the board
questions list.

## Shape, if built

- Not a blog-style collection. A **singleton** — there is one current status,
  not a list of them. Keystatic supports singletons.
- Fields: `state` (open / partly open / closed), `groomedMiles`, optional
  `note`, and `updatedAt` set automatically rather than typed.
- The banner reads the singleton at build time. A status change is a commit, so
  it triggers a deploy — the same path the blog already uses, no new mechanism.
- Expiry is computed at **render time from `updatedAt`**, not at build time, or
  a status could go stale between deploys and still render as current. That
  means the banner needs either a tiny client-side check, like the weather
  widget, or server rendering.
- Pushing to socials reuses whatever `module-publishing` ends up being
  (`docs/plans/social-cross-post.md`), with trail status as a second item type.

## Open

- **Would John use it?** The whole plan depends on this. Ask before building.
- Does a status update push to Facebook, or would that duplicate his Live post?
  Possibly the push should be opt-in per update rather than automatic.
- What is the right expiry window in season, and out of season?
- If this is adopted, ADR 0005's row for trail conditions changes and the ADR
  should be amended rather than quietly contradicted.
