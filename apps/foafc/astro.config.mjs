// @ts-check
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';

// Draft blog posts, read at config time so the sitemap can exclude them.
// Kept here rather than in the integration so the rule is visible next to it.
const DRAFT_PATHS = readdirSync(new URL('./src/content/blog/', import.meta.url))
  .filter((file) => file.endsWith('.mdoc'))
  .filter((file) =>
    readFileSync(new URL(`./src/content/blog/${file}`, import.meta.url), 'utf8').includes(
      'draft: true',
    ),
  )
  .map((file) => `/blog/${file.replace(/\.mdoc$/, '')}/`);

// Static output (ADR 0002). The Vercel adapter is present only so Keystatic's
// admin and auth routes can be server-rendered (ADR 0003/0004); those routes
// opt out of prerendering themselves, so every public page stays static.
export default defineConfig({
  // Set SITE_URL to the deployed origin on any non-production domain, so
  // canonical URLs and robots.txt describe where the site really is. See
  // src/site.ts.
  site: process.env.SITE_URL ?? 'https://friendsofafiercechase.org',
  output: 'static',
  adapter: vercel(),
  integrations: [
    react(),
    markdoc(),
    keystatic(),
    sitemap({
      // Draft posts have real URLs so they can be previewed, but they are
      // unlisted on purpose — a sitemap would hand exactly those URLs to search
      // engines, which is the opposite of what the draft flag is for.
      filter: (page) => !DRAFT_PATHS.some((path) => page.endsWith(path)),
    }),
  ],
  vite: {
    resolve: {
      alias: [
        // Astro 7 drags the build-time bundler into the serverless entry via
        // the integration import chain (@astrojs/react -> @vitejs/plugin-react
        // -> rolldown). It is imported but never called at runtime, and its
        // native binding cannot load in the function, which crashes every
        // request. Stub it out of the output bundles only; Vite's own copy is
        // unaffected because Vite loads it through Node, not this resolver.
        // Subpaths are matched too. A subpath import would hit the stub and
        // fail the BUILD on a missing export, which is a better failure than
        // the silent runtime crash this works around.
        {
          find: /^rolldown(\/.*)?$/,
          replacement: fileURLToPath(new URL('./src/stub-rolldown.mjs', import.meta.url)),
        },
      ],
    },
  },
});
