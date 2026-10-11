/**
 * How people can give.
 *
 * Methods are data, not markup, so adding PayPal, Venmo, Stripe, Zeffy or
 * Givebutter later means adding an entry here — not editing the Donate page.
 * Only configured methods render; there is no half-wired state where a button
 * appears but goes nowhere.
 *
 * ## Framing — not a style choice
 *
 * Everything here must read as a *suggested donation*, never a purchase. The
 * site is on Vercel's Hobby plan, which forbids commercial use but explicitly
 * permits asking for donations (ADR 0004). Wording like "buy a pass",
 * "checkout" or "price" would make this commercial use. The trails are also
 * genuinely free to use, so the framing is honest as well as necessary.
 *
 * ## Adding a method
 *
 * `link` covers anything that is a URL: a PayPal donate link, a Venmo profile,
 * a Stripe Payment Link, a Zeffy or Givebutter campaign page. Prefer it.
 *
 * An embedded form (Zeffy and Givebutter both offer one) is deliberately NOT
 * supported yet. It means a third-party iframe, which brings tracking, layout
 * fragility and a privacy question the board has not been asked. Send people to
 * the provider's hosted page instead, and revisit only if the board wants
 * on-site giving.
 */

interface GivingMethodBase {
  /** Stable id, used as a key. */
  id: string;
  label: string;
  /** One sentence on why someone might pick this one. */
  description: string;
}

export interface GivingLink extends GivingMethodBase {
  kind: 'link';
  href: string;
  /** Text on the link itself. */
  action: string;
}

export interface GivingByMail extends GivingMethodBase {
  kind: 'mail';
  /** Who the cheque is made out to. */
  payTo: string;
  address: readonly string[];
}

export type GivingMethod = GivingLink | GivingByMail;

/**
 * Configured methods, in the order they should appear.
 *
 * Only cheque is live. The June 2026 audit records that the organisation
 * already uses PayPal and Venmo, but neither the account handles nor the donate
 * links have been provided, and guessing a payment destination is the one
 * mistake here that could send someone's money to a stranger. Add them when the
 * real URLs are in hand.
 */
export const GIVING_METHODS: readonly GivingMethod[] = [
  {
    kind: 'mail',
    id: 'cheque',
    label: 'By cheque',
    description: 'Nothing is lost to processing fees, so the full amount reaches the trails.',
    payTo: 'Friends of A Fierce Chase Cross Country Ski Trails',
    address: ['C/O John Chase', '246 Elliotsville Road', 'Monson, ME 04464'],
  },
  // Add when the real destinations are confirmed — see docs/plans/giving.md:
  // { kind: 'link', id: 'paypal', label: 'PayPal', action: 'Give with PayPal',
  //   href: 'https://...', description: '...' },
  // { kind: 'link', id: 'venmo', label: 'Venmo', action: 'Give with Venmo',
  //   href: 'https://...', description: '...' },
];
