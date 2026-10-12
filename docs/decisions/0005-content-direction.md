# ADR 0005 — Content flows in two directions, decided per content type

Date: 2026-10-11
Status: Proposed

## Context

ADR 0003 established that **Facebook is the source of truth**: John Chase posts
trail conditions via Facebook Live, events are announced there, and the site
mirrors Facebook so that nobody is ever asked to post twice. It also noted that
social cross-publishing conflicted with that principle and put it out of scope.

Building the blog made the conflict concrete. A post written in Keystatic has no
upstream Facebook original to mirror — the site *is* where it originates. Under
a strict one-direction reading, either blog posts should not exist, or the
board should write every post twice. Neither is right.

The cause is that "source of truth" was being applied to the site as a whole
when it is really a property of each kind of content.

## Decision

**Direction is decided per content type, and each item has exactly one origin.**

| Content | Origin | Mirror | Mechanism |
|---|---|---|---|
| Blog posts | **This site** (Keystatic) | Facebook, possibly Instagram | Push on publish (not built — `docs/plans/social-cross-post.md`) |
| News feed | **Meta** | This site | Pull (not built) |
| Events | **Meta** | This site | Pull (not built) |
| Trail conditions | **Under review** — see below | | Not built |

**Trail conditions are being reconsidered** (2026-10-12). This ADR placed them
on the Meta side with the other live content. The alternative is the blog's
shape: John enters a status in the admin, the site is the origin, and posting
to socials is a side effect. Pulling structured facts — open/closed, miles
groomed — out of a Facebook Live post is brittle, and it makes the site's most
important fact depend on its most fragile mechanism.

It is not decided, because it depends on whether John would actually use an
admin form instead of his phone at the trailhead. See
`docs/plans/trail-status.md`. If it changes, amend this ADR rather than
contradicting it.

Consequences for naming, which is why this is being recorded before launch
rather than after:

- The site-authored collection is **Blog**, at `/blog/`, edited in Keystatic.
  It was briefly called "News", which conflated the two directions and would
  have made the URL wrong the moment a Meta-sourced feed arrived.
- **News** and **Events** are reserved for Meta-sourced content. They are not
  content collections and must not become Keystatic collections — if a board
  member can type into them here, there are two origins again.

## Why

- **It keeps the "never post twice" principle intact**, which was the real goal.
  The principle was never about direction; it was about nobody doing the same
  work twice. One origin per item delivers that in both directions.
- **It matches where the work actually happens.** A considered post with photos
  belongs in an editor. A trail condition shouted from a phone at the trailhead
  belongs on Facebook. Forcing either through the other's tool would be worse
  for the person doing it.
- **It makes the naming honest.** "News" meaning site-authored posts would have
  collided with the Facebook feed that will eventually want that name.

## Rejected

- **Facebook as the origin for everything.** Would mean composing long-form
  posts with images in a Facebook text box, and the site could never have
  content Facebook does not. Also makes the site's content hostage to one
  platform's API and policies.
- **The site as the origin for everything.** Would ask John to stop posting
  conditions from his phone and use a CMS instead. The one thing the board
  explicitly did not want.
- **Leaving it ambiguous.** The likeliest outcome is someone posting the same
  thing in both places, exactly the failure the original principle guarded
  against.

## Consequences

- Supersedes ADR 0003's note that social cross-publishing is out of scope. It
  is in scope for blog posts only.
- Two integrations will eventually exist, pointing opposite ways. They should
  not share a module: pushing and pulling have different failure modes, and the
  pull side must tolerate Meta being unavailable without breaking a build.
- If a Meta-sourced item ever needs editing on the site, that is a signal the
  direction is wrong for that content type — revisit this ADR rather than
  adding an edit field.
- Deleting a blog post does not retract anything already pushed to Facebook.
  Accepted as a non-feature; see the plan.
