import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

// Mirrors the News collection in keystatic.config.ts. Keystatic owns the
// editing schema; this is how Astro reads what it writes.
const news = defineCollection({
  loader: glob({ pattern: '**/*.mdoc', base: './src/content/news' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      coverImage: image().optional(),
      coverAlt: z.string().optional(),
      // Drafts are visible while developing and excluded from production
      // builds, so unfinished or unapproved posts can live in the repo without
      // reaching the public site. See src/content/news/README.md.
      draft: z.boolean().default(false),
    }),
});

export const collections = { news };
