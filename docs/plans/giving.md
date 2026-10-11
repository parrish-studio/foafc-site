# Wiring up giving

The Donate page is built and live. Methods are data in
`apps/foafc/src/data/giving.ts`, so adding one is adding an entry — the page
does not change.

Only **cheque** is configured. The June 2026 audit records that the
organisation already uses PayPal and Venmo, but no handles or donate links have
been provided, and a wrong payment destination is the one mistake on this page
that could send someone's money to a stranger. Nothing goes in until the real
destination is confirmed by someone who can log into the account.

## What I need, per option

Bring back any one of these and it can be wired the same day.

| Option | What to bring | Build effort |
|---|---|---|
| **PayPal** | The donate-button URL from the PayPal nonprofit dashboard (`paypal.com/donate/?hosted_button_id=…`) | One entry |
| **Venmo** | The charity profile URL, not a personal `@handle` | One entry |
| **Stripe** | A Payment Link URL, created in the Stripe dashboard | One entry |
| **Zeffy** | The hosted campaign page URL | One entry |
| **Givebutter** | The hosted campaign page URL | One entry |

All five are the same shape — a `kind: 'link'` entry. The work is in choosing
and opening the account, not in the site.

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
- **Which processor.**

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
