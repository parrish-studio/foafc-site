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
 * Configured methods, in the order they should appear. Online first, cheque
 * last — slowest to arrive, but nothing is lost to fees.
 *
 * Both destinations were verified before being published here, because a wrong
 * one sends a donor's money to a stranger:
 *   - venmo.com/u/FOAFC resolves to "Friends of A Fierce Chase Cross Country
 *     Ski Trails" and is a Venmo charity profile.
 *   - The PayPal link is from the organisation's own exported configuration.
 *
 * Verify the same way before ever changing one.
 */
export const GIVING_METHODS: readonly GivingMethod[] = [
  {
    kind: 'link',
    id: 'paypal',
    label: 'PayPal',
    description: 'Card or PayPal balance. You choose the amount.',
    action: 'Give with PayPal',
    // PayPal "No-Code Checkout" link, custom amount. See docs/plans/giving.md:
    // PayPal also offers a dedicated nonprofit Donate button, which reads as a
    // donation rather than a payment and may carry reduced 501(c)(3) rates.
    // Worth checking whether this account is enrolled.
    href: 'https://www.paypal.com/ncp/payment/Q2GV9XXL9CLPL',
  },
  {
    kind: 'link',
    id: 'venmo',
    label: 'Venmo',
    description: 'Our charity profile, @FOAFC, if Venmo is already on your phone.',
    action: 'Give with Venmo',
    href: 'https://venmo.com/u/FOAFC',
  },
  {
    kind: 'mail',
    id: 'cheque',
    label: 'By cheque',
    description: 'Slowest to arrive, but nothing is lost to processing fees.',
    payTo: 'Friends of A Fierce Chase Cross Country Ski Trails',
    // One-t spelling deliberate; see the note in data/org.ts.
    address: ['C/O John Chase', '246 Elliotsville Road', 'Monson, ME 04464'],
  },
];
