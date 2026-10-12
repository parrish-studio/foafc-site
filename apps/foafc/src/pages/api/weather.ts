import type { APIRoute } from 'astro';
import { TRAILHEAD } from '../../data/org';
import { getWeather } from '../../lib/weather';

// The only server-rendered route the public site has. Everything else is
// static; this exists because weather is live data and NWS cannot be called
// from a browser (see src/lib/weather.ts).
export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const weather = await getWeather(TRAILHEAD.latitude, TRAILHEAD.longitude, {
      timeZone: TRAILHEAD.timeZone,
    });

    return new Response(JSON.stringify(weather), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        // Cached at the edge for 15 minutes, so one upstream request to NWS
        // serves every visitor in that window. stale-while-revalidate means a
        // slow or failing NWS shows slightly old weather rather than none.
        'Cache-Control': 'public, max-age=0, s-maxage=900, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    // Degrade quietly. A missing temperature is not worth an error page, and
    // the widget hides itself when this fails.
    console.error('[weather] lookup failed:', error);
    return new Response(JSON.stringify({ error: 'unavailable' }), {
      status: 503,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=0, s-maxage=60',
      },
    });
  }
};
