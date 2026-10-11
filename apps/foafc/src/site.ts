/**
 * Where this build thinks it lives.
 *
 * Until the DNS cutover from Wix, the site is deployed on a temporary Vercel
 * domain while friendsofafiercechase.org still serves the old Wix site. Two
 * things must follow from that, or the staging deploy damages the real site's
 * search presence:
 *
 *   1. Canonical URLs must point at the domain actually being served. Pointing
 *      them at friendsofafiercechase.org would tell search engines these pages
 *      are duplicates of the Wix pages.
 *   2. Nothing should be indexed until the real domain serves this site.
 *
 * Both are derived from one build-time variable, so the cutover is a config
 * change rather than a code change.
 */

/** The domain that may be indexed. Everything else is treated as staging. */
export const PRODUCTION_HOST = 'friendsofafiercechase.org';

/** True only when this build is being served from the production domain. */
export function isProductionHost(site: URL | undefined): boolean {
  return site?.hostname === PRODUCTION_HOST;
}
