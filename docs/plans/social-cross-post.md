# Plan — cross-posting new blog posts to Facebook and Instagram

**Status: plan only. Nothing here is built.**

When a blog post is published, post its link and cover image to the
organisation's social accounts, without anyone having to post twice.

## Direction

Settled in `docs/decisions/0005-content-direction.md`: direction is decided per
content type, and each item has exactly one origin.

| Content | Origin | Mirror |
|---|---|---|
| Blog posts | This site | Facebook, possibly Instagram |
| News feed, events, trail conditions | Meta | This site |

**This plan covers the push side only — blog posts out to Meta.** The pull side
is a separate piece of work with opposite failure modes, and the two should not
share a module.

## What should trigger it

**The draft → published transition, not file creation.** A post can be created,
edited and re-edited for days as a draft. The event that matters is the moment
`draft` goes from `true` to `false` on a post whose date is not in the future.

This has to be idempotent. Editing a typo in a published post must not post
again. That means persisting "we have already announced this post", which is
the main piece of real state the feature needs.

Options for where that state lives, worst to best:

1. A field in the post's own frontmatter (`announcedAt`). Simple and visible,
   but the writer-back is a second commit from a server process, and Keystatic
   editors would see a mysterious field.
2. A small JSON file in the repo, committed by the job. Same commit-loop
   problem, less noise in the content.
3. **A tiny external store** keyed by post slug. No commits, no loop, and the
   job is a pure function of "what is published" versus "what has been
   announced". Preferred.

## Where it should run

Not in the Astro build. A build runs on every push, including content-free
ones, and a failed social call must not fail a deploy.

Candidates:

- **Scheduled job** (Vercel Cron, daily) that diffs published posts against the
  announced store. Simplest, most robust, tolerates failure by retrying next
  run. Latency of up to a day, which is fine for a blog.
- **Deploy hook** firing after a successful production deploy. Faster, but
  couples announcing to deploying and re-runs on unrelated deploys.
- **Keystatic/GitHub webhook** on content change. Most immediate, most moving
  parts, and hardest to make idempotent.

Recommended: scheduled job. Revisit only if same-day announcement matters.

## Keeping it loosely coupled

This must not become FOAFC-shaped code in the app. The shape that matches the
rest of the platform:

```
packages/module-publishing/
  src/core/     what a "publishable item" is; the diffing logic;
                a SocialTarget interface. No network, no framework.
  src/adapters/ facebook.ts, instagram.ts — each implements SocialTarget.
```

- The **core** takes a list of published items and a list of already-announced
  ids, and returns what to announce. That is pure, and therefore testable
  without touching a network.
- Each **adapter** implements one interface. Adding Mastodon, or dropping
  Instagram, touches one file.
- The **app** supplies the data and the credentials. The package contains no
  FOAFC specifics.

This mirrors the boundary rules in `CLAUDE.md` and is the second real test of
whether `module-*` is a genuine pattern or just where the trails code happened
to go.

## Hard parts, in the order they will bite

1. **Instagram may not exist.** There is no public account yet — it is an open
   question for the board. Build Facebook first; the adapter interface means
   Instagram is additive, not a rewrite.
2. **Instagram cannot post links.** No clickable URL in a feed caption. A
   cross-post there is an image plus "link in bio", which is a different and
   much weaker feature. Worth deciding whether it earns its complexity.
3. **Meta tokens expire.** Page access tokens need long-lived exchange and
   periodic refresh. Whatever is built must fail loudly and visibly when a
   token dies, or it will quietly stop working and nobody will notice for
   months. This is the most likely cause of silent failure.
4. **Meta app review.** Posting to a Page via API needs an app with the right
   permissions, and review can be slow. Start it early — it may gate the whole
   feature.
5. **Posts with no cover image.** Facebook will scrape Open Graph tags, so the
   site needs good `og:` tags regardless. **This is worth doing on its own
   merits, before any of the above** — it improves every link anyone shares by
   hand today.
6. **Deletion.** If a post is unpublished or deleted after announcing, nothing
   retracts the social post. Probably acceptable; should be a stated
   non-feature rather than a surprise.

## Suggested order

1. Open Graph and Twitter card tags on all pages. Useful immediately, no
   dependencies, makes every hand-shared link better.
2. ~~ADR recording the direction decision~~ — done, ADR 0005 (Proposed).
3. Start Meta app review, since it may be the long pole.
4. `module-publishing` core with the diff logic and a fake adapter. Fully
   testable with no credentials.
5. Facebook adapter plus the announced-state store.
6. Scheduled job wiring it together.
7. Instagram, only if the board wants an account and accepts the link
   limitation.

Steps 1 and 2 are worth doing whether or not the rest ever happens.
