# Premium Razorpay checkout

## Goal
Rebuild `/checkout` to closely match the supplied two-column reference while keeping MyGarden’s own branding, colors, copy, and live backend rules. Both the cart’s **Checkout** button and a live product’s **Buy it now** button will land on this checkout experience.

## Checkout layout
- Use a focused checkout shell with a slim MyGarden header, centered brand mark/name, cart icon, and no storefront navigation or footer.
- Desktop: wide two-column layout with the customer and payment form on the left, plus a softly tinted sticky order summary on the right.
- Mobile: single-column flow with the order summary available before payment, comfortable tap targets, and no clipped fields.
- Match the reference’s compact premium treatment: thin borders, restrained rounding, clear section headings, green selected states, muted helper copy, and tabular prices.

## Customer and delivery details
- Build a **Contact** section with email and a sign-in link when the customer is signed out.
- Build the **Delivery** form with first/last name, address, area, city, state, PIN code, and phone, mapping those values safely into the backend’s existing address format.
- Pre-fill known customer/address details when the authenticated account provides them; never invent missing data.
- Keep gift order and gift note support in the checkout flow.
- Require sign-in before requesting a quote or placing an order because the live order endpoints require authentication; preserve entered form data while the user signs in where practical.

## Quote, coupon, shipping, and summary
- Show each cart item with its real image, quantity badge, selected size/planter, backend price, and MRP when available.
- Add the reference-style coupon field and display real active/applicable offers only; applying a code refreshes the authoritative quote.
- Keep subtotal, discount, delivery, tax, and total entirely backend-driven via `POST /orders/quote`—no client-calculated order total, tax, discount, or shipping promises.
- Before an address is quoted, show a neutral shipping placeholder; after quoting, show the backend-confirmed values and any backend message.
- Build the lower trust area only from configured settings such as the plant guarantee, support, and delivery policy. Do not copy or invent the screenshot’s customer-count, farm, replacement, or packaging claims.

## Razorpay and COD flow
- Present **Razorpay Secure** as the primary online payment option and show **Cash on delivery** only when the quote says it is available.
- For online payment: create the order, open Razorpay Checkout with the exact order ID, amount, currency, and key returned by the backend, then send Razorpay’s payment ID, order ID, and signature to `POST /orders/verify`.
- Treat only successful backend verification as payment success. Keep the cart intact on cancellation, failed payment, or failed verification; show a clear retryable error.
- For COD: create the order only after a valid quote and then navigate to its order page.
- Clear the cart and gift state only after COD order creation or verified Razorpay success.
- The final button changes contextually between **Pay now** and **Place order**, with busy and unavailable states.

## Entry behavior
- Cart **Checkout** closes the cart panel before navigation.
- Live-product **Buy it now** adds the selected variant without opening the cart panel, then opens checkout immediately.
- Preview-only products remain non-purchasable and never create fake orders.

## Technical details
- Refactor the checkout into focused presentational sections while keeping strict TypeScript types and existing semantic design tokens/components.
- Add a typed, client-only Razorpay script loader and checkout response types; do not add private keys or hardcoded payment values.
- Reuse the existing cart, auth, settings, coupon, quote, order creation, and verification services.
- Preserve route-specific checkout metadata.

## Validation
- Verify cart Checkout and live Buy it now both open the new page without the drawer covering it.
- Test desktop and 375px layouts, form validation, quote refresh, coupon states, online/COD availability, payment cancellation, and error states.
- Confirm cart clearing happens only after COD creation or backend-verified Razorpay payment, and confirm no browser errors.
