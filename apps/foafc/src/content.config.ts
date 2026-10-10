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
    }),
});

export const collections = { news };
