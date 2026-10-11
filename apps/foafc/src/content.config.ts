import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

// Blog posts, authored on this site. Mirrors the Blog collection in
// keystatic.config.ts — Keystatic owns the editing schema, this is how Astro
// reads what it writes.
//
// Note what this is NOT: the Facebook-sourced news feed and events. Those flow
// the other way and are not content collections. See
// docs/decisions/0005-content-direction.md.
const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      coverImage: image().optional(),
      coverAlt: z.string().optional(),
      // Drafts are visible while developing and excluded from production
      // builds, so unfinished or unapproved posts can live in the repo without
      // reaching the public site. See src/content/blog/README.md.
      draft: z.boolean().default(false),
    }),
});

export const collections = { blog };
