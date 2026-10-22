/**
 * Organisation facts, from `docs/source/donate-copy.md`.
 *
 * These are published figures (EIN, charity status, mailing address) rather
 * than personal data. Keep them here so a page never hard-codes them and they
 * only have to be corrected once.
 */

export const ORG = {
  legalName: 'Friends of A Fierce Chase Cross Country Ski Trails',
  shortName: 'Friends of A Fierce Chase',
  ein: '99-1538734',
  charityStatus: '501(c)(3) public charity — IRC Section 509(a)(2)',
  effectiveDate: 'March 20, 2024',
  mailingAddress: ['C/O John Chase', '246 Elliotsville Road', 'Monson, ME 04464'],
} as const;

/**
 * The trailhead, for the map and for weather.
 *
 * This is Elliottsville Road, the access road named in the trail information —
 * "off Elliottsville Rd near Mathews Rd". It is the closest point anyone has
 * written down, and it is a real verified location rather than a guess.
 *
 * It is NOT the exact trailhead. Elliottsville Rd and Mathews Rd are 1.5 km
 * apart, so the pin could be a few hundred metres out, and the trail system is
 * not in OpenStreetMap or Google Maps as a place. Replace `query` with a real
 * Google Maps place, or these coordinates with ones taken at the trailhead,
 * when someone can stand there with a phone. The map and the weather both
 * follow this one value.
 */
export const TRAILHEAD = {
  latitude: 45.3232,
  longitude: -69.4936,
  /** What to call it on the page. */
  label: 'Monson, Maine',
  /** What Google Maps is asked to find. */
  query: 'Elliottsville Road, Monson, ME 04464',
  timeZone: 'America/New_York',
} as const;

/**
 * Where the organisation posts. Facebook is the source of truth for events and
 * trail conditions — the site mirrors it, and no flow should ever ask anyone to
 * post twice.
 */
export const SOCIAL = [
  { label: 'Facebook', href: 'https://www.facebook.com/friendsofafiercechase' },
] as const;

/**
 * Suggested donation levels.
 *
 * Framed as suggested donations, never as purchases: the site is hosted on
 * Vercel's Hobby plan, which forbids commercial use but explicitly permits
 * asking for donations (ADR 0004). Wording here must not imply a sale.
 *
 * The Family pass is intentionally absent — the board set one in September 2026
 * but the amount was never recorded, and inventing it would be worse than
 * omitting it. The season amount still needs confirming (see CLAUDE.md).
 */
export const SUGGESTED_DONATIONS = [
  { label: 'Day', amount: '$20', note: 'A day on the trails' },
  { label: 'Season', amount: '$150', note: 'The whole winter' },
] as const;
