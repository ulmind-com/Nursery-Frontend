# Align the storefront with the new design document

The shop is already built end to end against the live nursery API. This round applies the specific look and details from your uploaded document, keeping all existing functionality and the live backend connection.

## Colour and type

Blended palette, as you chose:

- Deep forest green stays for headings, footer, and large dark surfaces.
- Bright green (#16a34a, hover #15803d) becomes the button, link, badge and accent colour.
- Soft green tints (#dcfce7 / #f0fdf4) for badges, pills and hover fills.
- Page background gets the subtle green tint (#fafdfb); cards stay white.
- Sale red and star gold added as their own tokens so status is never green-on-green.
- Headings switch to Plus Jakarta Sans 700, body to Inter, prices bold with tabular figures.

Corner radii, shadow depth and the 200ms hover timing are normalised across cards, buttons and badges to match the document.

## Product card rework

Rebuild the card to the layout in your document: image with hover zoom and image swap, wishlist heart, sale/new/bestseller badges, title, one-line short description, plant care pills (sunlight, watering, difficulty), price row with green price, struck MRP and red discount badge, star rating with count, and an Add to Cart button that reveals on hover on desktop and is always visible on mobile. Grid stays 2 columns on mobile, 3 on tablet, 4 on desktop with consistent card heights.

## Page-level alignment

- Home: announcement bar rotating every 4 seconds, banner carousel with autoplay and dots, category grid, dynamic API sections, trust bar (plant guarantee, free shipping threshold, secure payments, expert support — all values from settings), Google reviews, blog preview.
- Listing: filter set extended with watering and preset price bands; active filters as removable pills; load-more pagination.
- Product page: specification grid with icons, plant trait pills (pet safe, air purifying, flowering, medicinal, fragrant), what's-included checklist, care instructions and tips, guarantee banner, similar plants rail, reviews with star breakdown.
- Checkout: gift wrap toggle and gift note, payment choice, Razorpay popup themed green, confirmation screen styling.
- Support page at /support built from the settings support block, plus policy pages (shipping, returns, privacy, terms).
- Mobile bottom tab bar (Home, Categories, Search, Wishlist, Account) and a floating WhatsApp button shown only when a number exists in settings.
- Toasts, skeletons and empty states restyled to the green-tinted treatment described.

## Technical notes

- Tokens are defined in `src/styles.css` under `@theme`; no component hardcodes a colour. Fonts load via a link tag in the root route.
- Backend base URL stays in the environment file pointing at the live nursery API; nothing hardcoded in components.
- Razorpay key comes from the environment variable, not inline in code; backend verification remains the only path to order success.
- No mock data is introduced — sections with empty API responses keep their empty states.

## Verification

Check home, listing, product, cart, checkout, account and blog at 375, 768 and 1280 widths, confirm no runtime or console errors, and confirm every price, fee and guarantee value still comes from the backend.
