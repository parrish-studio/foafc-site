# Wiring up giving

The Donate page is built and live. Methods are data in
`apps/foafc/src/data/giving.ts`, so adding one is adding an entry — the page
does not change.

**PayPal, Venmo and cheque are live.** Both online destinations were verified
before publishing, because a wrong one sends a donor's money to a stranger:

- `venmo.com/u/FOAFC` resolves to "Friends of A Fierce Chase Cross Country Ski
  Trails" and is a Venmo charity profile.
- The PayPal link came from the organisation's own exported configuration.

Verify the same way before changing either.

## Open: PayPal is a checkout link, not a Donate button

The configured PayPal link is a **No-Code Checkout** link
(`paypal.com/ncp/payment/…`). It works, and it takes a custom amount, but it is
PayPal's commerce product. Its own wording is "Fill in how much you want to
**pay**".

PayPal also offers a **nonprofit Donate button** for confirmed 501(c)(3)s
(`paypal.com/donate/?hosted_button_id=…`). Two reasons it is probably the better
fit:

1. **It reads as a donation.** The site is careful to frame everything as a
   suggested donation rather than a sale, both because that is true and because
   ADR 0004 requires it. A checkout flow saying "pay" undercuts that at the last
   step, which is the worst place to lose it.
2. **Rates.** PayPal publishes reduced transaction rates for confirmed
   charities. Whether this account is enrolled is worth checking — on a season
   of donations the difference is real money.

Switching is a one-line change here once the button exists. Nothing else moves.

## Adding another option later

All of these are the same shape — a `kind: 'link'` entry pointing at the
provider's hosted page. The work is choosing and opening the account, not the
site.

| Option | What to bring |
|---|---|
| **Stripe** | A Payment Link URL from the Stripe dashboard |
| **Zeffy** | The hosted campaign page URL |
| **Givebutter** | The hosted campaign page URL |

## What changes the build

**Hosted page (a link).** What the code supports today. The donor leaves the
site, gives on the provider's page, comes back. Nothing to maintain, no
third-party JavaScript, no privacy question.

**Embedded form (an iframe).** Zeffy and Givebutter both offer one. Deliberately
not supported yet, because it means:

- A third-party iframe with its own tracking on a page the board has not been
  asked about.
- Layout that breaks when the provider redesigns.
- Content-Security-Policy work if we ever tighten headers.

Worth doing only if the board specifically wants giving to happen on-site, and
worth asking them rather than assuming.

## Choosing — what actually matters here

Fee rates change often enough that any number written here would be stale.
**Confirm current rates directly with each provider.** What is stable is the
*shape* of the choice:

1. **Does it issue tax receipts automatically?** This is the one most likely to
   be underweighted. A 501(c)(3) has to acknowledge donations, and doing that by
   hand for every cheque and PayPal notification is real recurring work for a
   volunteer treasurer. Purpose-built nonprofit platforms do it; generic payment
   tools largely do not.
2. **Who can administer it?** Anything tied to one person's personal account
   repeats the problem already logged with the org Google account. It should be
   owned by the organisation.
3. **Fee model, not fee rate.** Some platforms take a percentage; some take
   nothing and ask the donor to tip; some are free to the nonprofit but
   noticeably push the tip. That difference shows up in what donors experience,
   not just the accounting.
4. **What happens at handover.** A processor tied to the current treasurer is a
   migration later.

Cheque genuinely has the best economics — nothing is lost — and should stay on
the page whatever else is added.

## Still open, and blocking

These are board decisions, already in the board questions list:

- **The Family pass amount.** The board set one in September 2026; the amount
  was never recorded. It is omitted from the page rather than guessed.
- **Season pass — is $150 current?** It is published and people will act on it.
- **Is the PayPal account on the nonprofit rate**, and should the checkout link
  be swapped for a Donate button? See above.

## Not in scope

- **Custom amount entry.** The prototype has a field for it. It needs a
  processor first, and most hosted pages offer it anyway, so it would duplicate
  what the provider already does.
- **Recurring giving.** Worth asking the board about separately; it changes
  which processors are viable.
- **Anything resembling a shop.** Vercel's Hobby plan forbids commercial use
  but explicitly permits donations (ADR 0004). Selling passes rather than
  suggesting them would break that, and would also be untrue — the trails are
  free to use.
