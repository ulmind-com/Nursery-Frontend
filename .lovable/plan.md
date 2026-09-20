# Screenshot-matched product detail page

## Goal
When a shopper clicks a product, open a detail page that closely follows the supplied reference: breadcrumbs, vertical thumbnail gallery, large product image, rating line, bold product title, subtitle, size selector, planter/variant selector, and clear purchase action. The existing three-level storefront header remains unchanged.

## Product gallery and layout
- Use the same pale storefront background and wide desktop two-column composition as the screenshot.
- Add a compact breadcrumb above the product area: Home / Category / Product.
- Desktop gallery: narrow vertical thumbnail rail on the far left and a large rounded main image beside it. Clicking a thumbnail changes the main image and applies a thin green selected outline.
- Keep the details panel on the right with the same spacing and hierarchy: rating and review count, large dark-green title, one-line description, then selectors.
- Tablet and mobile: move thumbnails into a horizontal rail, keep the main image first, and stack the product details below without overlaps. Preserve the existing sticky mobile purchase bar.

## Live size and planter selection
- Treat the backend `sizes` array as the source of truth for every selectable combination, including each variant's size name, pot type, pot colour, price, MRP, stock, SKU, height, and images.
- Build the visible `Select Plant Size` choices from unique size names. Selecting a size updates the valid planter choices below it.
- Build `Select Planter` as a compact bordered tile grid from matching variants. Tiles show available pot name/colour and the backend price; unavailable combinations are visibly disabled.
- If planter artwork is available in the selected variant images, use it; otherwise use a restrained line-pot icon rather than inventing a product image.
- Selecting either control updates the main gallery, price, MRP/discount, stock, SKU, cart payload, and notify-me payload together.
- Show a size-guide link only when the product data provides usable size/height information; it opens a small accessible guide using live values.
- If a product has no planter variants, hide that selector cleanly. If it has no size variants, show the backend's base product price and stock without empty controls.

## Purchase information and actions
- Place current price, struck MRP, discount, tax/delivery note, stock state, wishlist, and Add to Cart below the selectors in the same clean visual language.
- Keep all prices, inventory, taxes, delivery, discounts, guarantee text, and cart data backend-driven; no hardcoded commerce rules.
- Preserve notify-me for unavailable variants and the backend-powered guarantee, specifications, traits, included items, care guide, description, similar products, and reviews below the first view.
- Add a compact review summary in the reference position, using only the product's real rating and review count. Do not invent “happy customer” or sales claims.

## Temporary preview products
- Make the generated sample cards clickable so the design can be inspected while the live catalogue is empty.
- Open the same detail layout with the sample image/title already used by that card, clearly treated as a visual preview.
- Preview pages will not add to cart, create orders, expose fake stock, or pretend to be live products. Their purchase action will explain that the product must be added in the admin panel.
- As soon as admin products exist, the preview cards remain fully replaced by real products, and real clicks use `/product/$id` with backend data.

## Visual fidelity and limits
- Match the reference's proportions, soft blush background, rounded image, green selected states, compact selector tiles, typography scale, and whitespace as closely as possible.
- Use the project's brand and original/generated product imagery only. Do not copy the Ugaoo logo, people, celebrity content, proprietary text, or screenshot itself.
- Keep all colours semantic through the existing design tokens and all interactive controls accessible by keyboard.

## Verification
- Test both a live product payload and the current preview-product path.
- Verify image switching, size-to-planter filtering, variant-specific price/stock/gallery updates, cart payload, out-of-stock handling, and preview safety.
- Check desktop, tablet, and 375px mobile for layout fidelity, scrolling, clipping, overlap, and console errors.
