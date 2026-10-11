# Blog posts

One Markdoc file per post. Board members do not need to read this — they use
the CMS at `/keystatic`, which writes these files for them.

## The quick version

- **Add a post:** `/keystatic` → Blog → add. Or create a `.mdoc` file here.
- **Edit a post:** edit it in `/keystatic`, or edit the file.
- **Delete a post:** delete it in `/keystatic`, or delete the file. Nothing else
  references it — no index to update, no list to maintain.
- **Unpublish without deleting:** set `draft: true`.

## Frontmatter

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Also the page heading |
| `date` | yes | `YYYY-MM-DD`. Sorts the index, newest first |
| `coverImage` | no | Path relative to this file, e.g. `../../assets/blog/photo.jpg` |
| `coverAlt` | no | Describe the photo for people who cannot see it. Set it whenever there is a cover image |
| `draft` | no | Defaults to `false` |

## Drafts and previewing

A draft is **unlisted, not hidden**:

- It does **not** appear on the blog index.
- It **does** have a real page at its normal URL, so it can be previewed on the
  live site. Keystatic shows a Preview link in the editor.
- It is marked `noindex, nofollow`, so search engines leave it alone.
- The page itself says, visibly, that it is a draft.

This exists because board members do not run a development server. Without it,
the people most likely to write a draft would be the only ones unable to see it
rendered.

**Unlisted is not private.** Anyone with the link can read a draft. Do not put
anything confidential in one, and do not share a preview link more widely than
you would share the published post.

Launching with no published posts is fully supported — the blog index shows its
empty state rather than placeholder content.

When a sitemap is added, it must exclude drafts. There is a TODO for this in
`src/pages/robots.txt.ts`.

The two posts currently here are drafts written during the build to exercise the
blog end to end. The fungi post is based on real photos from September 2026 but
the words have not been reviewed by anyone. **Rewrite or delete both before
launch** — do not simply flip them to published.
