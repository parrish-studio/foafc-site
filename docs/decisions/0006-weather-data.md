# ADR 0006 — National Weather Service for conditions, fetched through our own cached endpoint

Date: 2026-10-12
Status: Accepted

## Context

The prototype and the board brief both include a weather widget on the home
page. It was open question 4 in `docs/project-brief.md`, together with the live
trail status.

The site is static output with no JavaScript on any page, which has been a
deliberate and defended property. Weather is live data. Something had to give.

## Decision

- **Source: the US National Weather Service** (`api.weather.gov`).
- **Fetched server-side** by our own `/api/weather` route, which is the only
  server-rendered route the public site has.
- **Cached at the edge** for 15 minutes with `stale-while-revalidate`, so one
  upstream request serves every visitor in that window.
- **Displayed by a small inline script**, not a React island. About 1 KB,
  inlined into the page rather than loaded as a separate file.
- **The widget renders hidden** and reveals itself only when data arrives.

## Why

**No key, ever.** NWS needs no account, no API key and no secret in the hosting
dashboard. For a site that will change maintainer, a credential that cannot
expire or be lost is worth more than a marginally nicer API. It is also a
government service, so it will not change its free tier.

**It cannot be called from a browser.** NWS asks callers to identify themselves
with a User-Agent, and browsers forbid scripts from setting one. That forced a
server-side fetch, which turned out to be the better design anyway: the edge
cache means our visitors generate roughly four upstream requests an hour
regardless of traffic.

**React was the wrong tool.** Hydrating React to print a temperature would cost
tens of kilobytes on a page that otherwise ships nothing. Plain DOM work costs
about 1 KB, which is a fair price for the feature.

**Failure is invisible.** The section starts hidden. No JavaScript, a blocked
request, a slow NWS or an outage all produce the same result: the page simply
has no weather section. Nothing else on the page depends on it, and there is no
spinner stuck forever or empty box.

## Rejected

- **Open-Meteo direct from the browser.** Simpler, no server route, and it does
  not demand a User-Agent. Rejected because every visitor would hit a third
  party directly, its weather codes need mapping to readable text, and its free
  terms could change. NWS returns ready-to-display strings like "Mostly Cloudy".
- **Baking weather in at build time.** Builds happen when content changes, so
  the forecast would routinely be days old.
- **Scheduled rebuilds.** Vercel's Hobby plan limits cron to roughly daily,
  which is far too stale, and rebuilding the whole site to change a temperature
  is disproportionate.

## Consequences

- The home page is the only page with JavaScript. That should stay true, and a
  second widget is not a reason to relax it — reach for the same pattern.
- `/api/weather` makes the serverless function load-bearing for the public site,
  where before it only served Keystatic. The post-build check that the function
  can be imported matters more now.
- Coordinates in `src/data/org.ts` are Monson village, not the trailhead.
  Elliottsville Road does not geocode. Close enough that the forecast is the
  same; worth replacing if someone can stand at the trailhead with a phone.
- **Trail status is still open.** It is not weather — ADR 0005 puts it on the
  Meta side, pulled from Facebook, and it needs its own solution.
