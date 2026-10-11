// @ts-check
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';

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
  integrations: [react(), markdoc(), keystatic()],
  vite: {
    resolve: {
      alias: [
        // Astro 7 drags the build-time bundler into the serverless entry via
        // the integration import chain (@astrojs/react -> @vitejs/plugin-react
        // -> rolldown). It is imported but never called at runtime, and its
        // native binding cannot load in the function, which crashes every
        // request. Stub it out of the output bundles only; Vite's own copy is
        // unaffected because Vite loads it through Node, not this resolver.
        { find: /^rolldown$/, replacement: fileURLToPath(new URL('./src/stub-empty.mjs', import.meta.url)) },
      ],
    },
  },
});
