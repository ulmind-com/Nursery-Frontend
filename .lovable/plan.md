# Product detail section below “Select Planter”

## Goal
Recreate the lower purchase panel shown in the screenshots, directly beneath the planter selector, while keeping real shop rules controlled by the backend.

## Changes
- Add a compact **Color** selector driven by the selected planter variant’s `pot_color`; changing color will switch to the matching variant and update its image, SKU, stock, price and MRP.
- Add the price row with current price, crossed-out MRP and tax wording only when supported by backend product/settings data. Preview products will use their existing temporary display price.
- Add the gift checkbox and optional handwritten-note field. Preserve the choice for checkout so the existing order quote/order fields (`is_gift`, `gift_note`) receive it.
- Add a quantity stepper beside the primary Add to Cart button. Quantity will respect selected variant stock and the chosen size/planter/color combination; preview products remain visibly non-purchasable.
- Restyle the active coupon list into the screenshot’s dashed **Offers for you** panel. Coupon code, description, threshold, discount and free-shipping status will come from `/coupons/active`, with copy/save behavior for checkout.
- Add the yellow guarantee/support/delivery strips using `/settings` only. Hide any strip whose corresponding setting is absent instead of inventing delivery or guarantee claims.
- Match the reference proportions: pale product background, compact circular color swatches, wide dark-green cart action, dashed pale-green offer rows, yellow service bands, and responsive stacking on mobile.

## Dynamic behavior
- **Temporary preview product:** existing preview gallery, sizes, planters and prices continue to demonstrate the layout; cart/order actions stay disabled-safe.
- **Admin-added product:** backend product variants fully replace preview selections. Product prices, MRP, stock, colors, images and SKU update from the selected variant.
- **Store-wide content:** coupons, taxes, delivery, guarantee and support text always come from live endpoints; no hardcoded commercial promises.

## Validation
- Check preview and live-product states at desktop, tablet and mobile widths.
- Verify size → planter → color selection updates the correct variant and price.
- Verify quantity limits, gift-note persistence, coupon saving, cart payload, no overflow and no browser errors.
