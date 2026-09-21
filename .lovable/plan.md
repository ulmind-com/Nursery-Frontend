# Premium slide-in cart drawer

Add to cart will open a right-side cart panel that looks like the reference screenshot, instead of only bumping the header count.

## What the user sees

- Tapping "Add to cart" (product page, recommended cards, anywhere) slides a cart panel in from the right over a dimmed page, with a soft warm background and rounded corners.
- Top row: bold "Cart" title and a close (X) button. Closes on X, on backdrop click, and on Escape.
- Progress strip under the title: "Add ₹X more to unlock free delivery" with a slim green track, a delivery-truck marker that moves with progress, and an end badge. Shown only when the store's free-delivery threshold is available from the store settings; once reached it reads as unlocked. No invented thresholds or discount numbers.
- Each cart line: square product photo, product name, selected size/planter line in muted text, current price with struck-through original price when available, a trash icon on the right, and a rounded minus / number / plus stepper.
- "Recommended Products" block with a heading and left/right round arrow buttons, horizontally scrolling white cards: photo with rounded top, yellow BESTSELLER chip top-left when the product is flagged, rating + review-count chip bottom-left, name on one truncated line, price, and a dark-green round add-to-cart button. Items come from the existing cart-recommendation data; the panel simply hides the block when there is nothing to show.
- Sticky bottom bar: large total, "Inclusive of all taxes" with a chevron that expands a small breakdown (subtotal, and delivery/tax only as the backend states them), and a wide dark-green pill CHECKOUT button that closes the panel and goes to checkout.
- Empty state inside the panel: short line plus a button to browse plants.
- Mobile: panel becomes full width, image/typography scale down, footer stays pinned, list scrolls.

## Data rules

- Prices, MRP, totals, ratings, bestseller flags and recommendations all come from cart state and the backend. The free-delivery line is rendered only from the store settings value; nothing is hardcoded.
- Preview/demo products stay non-transactable as today.

## Technical notes

- New `CartDrawer` component built on the existing `sheet` primitive, mounted once in the site layout so it is available on every route.
- Extend the cart context with `isOpen`, `openCart()`, `closeCart()`; `addItem` opens the drawer by default (an option lets callers skip it). Persistence logic unchanged.
- Header and mobile-nav cart buttons open the drawer instead of navigating; the existing `/cart` page stays as a full-page fallback and is unchanged.
- Recommendations use the existing `recommendationApi.cart` query; free-delivery threshold via the existing settings query.
- Respect reduced motion, keep focus trapped in the panel, label the stepper and remove buttons for screen readers.

## Validation

Check on desktop and 375px: add to cart opens the panel, quantity/remove update totals live, recommended cards add items, checkout button navigates, no console errors.
