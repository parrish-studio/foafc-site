# News posts

One Markdoc file per post. Board members do not need to read this — they use
the CMS at `/keystatic`, which writes these files for them.

## The quick version

- **Add a post:** `/keystatic` → News → add. Or create a `.mdoc` file here.
- **Edit a post:** edit it in `/keystatic`, or edit the file.
- **Delete a post:** delete it in `/keystatic`, or delete the file. Nothing else
  references it — no index to update, no list to maintain.
- **Unpublish without deleting:** set `draft: true`.

## Frontmatter

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Also the page heading |
| `date` | yes | `YYYY-MM-DD`. Sorts the index, newest first |
| `coverImage` | no | Path relative to this file, e.g. `../../assets/news/photo.jpg` |
| `coverAlt` | no | Describe the photo for people who cannot see it. Set it whenever there is a cover image |
| `draft` | no | Defaults to `false` |

## Drafts

Drafts are visible when running the site locally and **excluded from production
builds**. A draft has no page and no URL on the live site, so it cannot be
reached by guessing the address.

This is what lets the site launch before there is real content: the News page
shows its empty state rather than placeholder posts.

The two posts currently here are drafts written during the build to exercise the
blog end to end. The fungi post is based on real photos from September 2026 but
the words have not been reviewed by anyone. **Rewrite or delete both before
launch** — do not simply flip them to published.
