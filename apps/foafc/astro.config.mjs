// @ts-check
import { defineConfig } from 'astro/config';
import markdoc from '@astrojs/markdoc';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';
import keystatic from '@keystatic/astro';

// Static output (ADR 0002). The Vercel adapter is present only so Keystatic's
// admin and auth routes can be server-rendered (ADR 0003/0004); those routes
// opt out of prerendering themselves, so every public page stays static.
export default defineConfig({
  site: 'https://friendsofafiercechase.org',
  output: 'static',
  adapter: vercel(),
  integrations: [react(), markdoc(), keystatic()],
});
