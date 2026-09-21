# "You may also like" product carousel

Add a new full-width recommendation carousel to the product page, placed right after the "MyGarden vs the Rest" comparison section, styled to match the reference: warm pale band, large bold heading, and a row of white rounded cards.

## Card design

Each card shows:
- Large product photo with rounded top corners
- Yellow "BESTSELLER" chip at top-left when the product is a bestseller
- Small rating chip (rating and review count) at the bottom-left of the photo
- Product name (single line, trimmed with an ellipsis if long)
- Short one-line subtitle
- Price with struck-through MRP beside it
- Dark-green pill "View Product" button on the right of the price row

## Carousel behaviour

- Four cards visible on desktop, two on tablet, one and a bit on phones
- Horizontal scrolling with snap, plus a round arrow button on the right edge to advance (arrow hidden when there is nothing more to scroll)
- Keyboard and screen-reader friendly: each card links to its product page, the arrow is a real button with a label
- Respects reduced-motion (no smooth scroll animation when the visitor prefers reduced motion)

## Where the content comes from

- Live products: uses the existing recommendation call for similar products. This replaces the current plain rail at the bottom of the live product page so there is only one "You may also like" area, now in the new design and in the new position.
- Preview (demo) products: shows other demo products from the same category, falling back to demo plants when a category has too few. All values (image, name, subtitle, price, MRP, rating, bestseller flag) come from the existing demo product data, so once real products are added in the admin panel the same section fills itself from the backend.
- No invented prices, ratings or claims: a card only renders the fields that exist.

## Technical notes

- New component `src/components/product/you-may-also-like.tsx` exporting `YouMayAlsoLike` with a normalised item shape `{ id, title, subtitle?, image, price, mrp?, rating?, reviewCount?, bestseller?, href }`, plus small adapters from `Product` and from `PreviewItem`.
- `src/routes/product.$id.tsx`: render `<YouMayAlsoLike />` after `<ComparisonSection />` in both `PreviewProductPage` and `LiveProductPage`; remove the old `ProductRail` "You may also like" block from the live page.
- Preview items come from `previewItemsFor(category)` in `src/components/category/preview-products.ts`, excluding the current item.
- Scroll handled with a ref and `scrollBy`, no new dependency.
- Verify with a typecheck and a browser pass at 1280 and 375 on a demo plant and a demo pot page.
