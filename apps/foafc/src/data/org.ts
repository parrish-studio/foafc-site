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
