import type { APIRoute } from 'astro';
import { isProductionHost } from '../site';

export const GET: APIRoute = ({ site }) => {
  // Staging domains disallow everything. See src/site.ts.
  const body = isProductionHost(site)
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
    : `User-agent: *\nDisallow: /\n`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};
