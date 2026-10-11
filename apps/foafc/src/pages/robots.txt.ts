import type { APIRoute } from 'astro';
import { isProductionHost } from '../site';

export const GET: APIRoute = ({ site }) => {
  // Staging domains disallow everything. See src/site.ts.
  // TODO: add a Sitemap: line here once @astrojs/sitemap is installed.
  const body = isProductionHost(site)
    ? `User-agent: *\nAllow: /\n`
    : `User-agent: *\nDisallow: /\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
