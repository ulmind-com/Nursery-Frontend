# Product-specific FAQ section

## What will be added

- Add a new full-width **FAQs** section immediately after **You may also like** on every product detail page.
- Match the reference composition closely:
  - warm pale background
  - large rounded product/lifestyle visual on the left
  - bold **FAQs** heading and three compact accordion rows on the right
  - first question open by default, with chevrons and thin row dividers
- Use original, human-free product imagery only; do not copy the celebrity/person, badge, text, or artwork from the screenshot.
- Keep the existing purchase controls unchanged; the screenshot’s bottom purchase bar will not be copied as part of this FAQ request.

## Dynamic product content

- Extend product data with a structured FAQ block containing an optional image, image alt text, and question/answer rows.
- Give every preview plant, pot, and other preview category product three relevant sample FAQs based on that product type.
- Use plant-specific questions for plant pages and material, maintenance, fit, drainage, or usage questions for non-plant products.
- Keep preview answers clearly within the existing design-preview data and avoid new delivery, guarantee, inventory, or care claims that are not already represented.
- For live products, render FAQs only when the API/admin product supplies usable FAQ rows; never substitute preview FAQs into a live product.
- Use a backend-provided FAQ image when available, otherwise use the product’s own image without inventing another live asset.

## Responsive behaviour

- Desktop: balanced two-column layout matching the screenshot proportions.
- Mobile/tablet: image first, accordion below, with readable question wrapping and no clipping or overlap.
- Preserve keyboard navigation, visible focus states, screen-reader semantics, and reduced-motion behaviour through the existing accordion control.

## Technical details

- Add a reusable product FAQ component built with the project’s existing accordion components.
- Extend `PreviewItem` and the live `Product` type with FAQ data.
- Populate preview FAQs through category-aware helpers so all current and future preview items receive product-appropriate content.
- Render the section after `YouMayAlsoLike` in both preview and live product paths.

## Validation

- Confirm the order is **MyGarden vs the Rest → You may also like → FAQs**.
- Check representative plant, pot, and general-goods preview products on desktop and 375px mobile.
- Verify accordion open/close behaviour, product-specific wording and imagery, no overlaps, and no browser errors.
- Confirm live products without FAQ data do not show an empty section.
