/**
 * Reading the Blog collection.
 *
 * One place decides what counts as published, so the index, the post pages and
 * anything added later (a feed, a sitemap, a social cross-post) cannot disagree
 * about it.
 */

import { getCollection, type CollectionEntry } from 'astro:content';

export type BlogPost = CollectionEntry<'blog'>;

/**
 * Published posts, newest first.
 *
 * Drafts are shown while developing and hidden in production builds, so
 * unfinished or unapproved posts can sit in the repo without reaching the
 * public site. If the collection is empty, callers show an empty state —
 * launching with no posts is a supported state, not an error.
 */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const posts = await getCollection('blog', ({ data }) =>
    import.meta.env.PROD ? !data.draft : true,
  );
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Formats a post date consistently. UTC, so the day never shifts by timezone. */
export const formatPostDate = (date: Date): string =>
  new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(date);
