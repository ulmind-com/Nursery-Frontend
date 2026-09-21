# Move purchase info above "Select Planter", keep action buttons below

## Goal
On the product detail page (preview + live), the info portion of the purchase block — SKU, Pot size, Color, Price/MRP/discount, gift checkbox + note, Quantity — should render **above** the "Select Planter" section. The action buttons (Add to cart / Buy it now), the coupon box, and the guarantee/support/delivery strips stay **below** the planter section, exactly as today.

This matches the Ugaoo/mybageecha reference flow where price and quantity sit near the top of the buy column and the action buttons sit after the planter selection.

## New layout order (right column)

```text
Rating line
Title
Subtitle
Select Plant Size        (existing)
PurchaseInfo             ← NEW position (was at bottom)
  SKU / Pot size
  Color swatches
  Price + MRP + discount + inclusive-of-taxes
  Make this a gift (checkbox + note)
  Quantity stepper
  Delivery time line (from settings)
Select Planter           (existing)
PurchaseActions          ← stays at bottom
  Add to cart / Buy it now
  Coupon box
  Guarantee / support / delivery strips
```

The planter tiles are no longer pushed down by the info block; the buy buttons remain the last thing the shopper sees after choosing a planter.

## Changes

### 1. `src/components/product/purchase-extras.tsx`
Split the single `PurchaseExtras` component into two exported components that share the same props slices. Gift state (isGift/giftNote) stays in the info component (it only writes to localStorage, which checkout reads — no shared state needed).

- `PurchaseInfo` — props: `colors`, `selectedColor`, `onColorChange`, `price`, `mrp`, `quantity`, `stock`, `onQuantityChange`, `preview`, `settings`, `sku`, `sizeLabel`.
  Renders: SKU/Pot size row, Color section, Price row, gift checkbox + note, Quantity stepper, delivery-time line. Same markup/spacing as today, root `mt-5`.
- `PurchaseActions` — props: `price`, `quantity`, `stock`, `preview`, `settings`, `onAdd`, `onBuyNow`.
  Renders: Add to cart / Buy it now button row, `CouponBox`, guarantee/support/delivery strips. Same markup/spacing as today, root `mt-5`.

Keep `GIFT_ORDER_KEY` / `GIFT_NOTE_KEY` exports. Keep `swatchClass` / `settingText` helpers. The existing default-exported `PurchaseExtras` is removed (both call sites updated).

### 2. `src/routes/product.$id.tsx`
- `PreviewProductPage`: replace the single `<PurchaseExtras …/>` (after the planter grid) with `<PurchaseInfo …/>` placed right after the "Select Plant Size" block (before "Select Planter"), and `<PurchaseActions …/>` placed after the "Select Planter" block. Same prop values as today.
- `LiveProductPage`: same reorder — `<PurchaseInfo …/>` after "Select Plant Size" (before "Select Planter"), `<PurchaseActions …/>` after "Select Planter". The trailing traits `<ul>` stays after `PurchaseActions`.
- Remove the now-unused `PurchaseExtras` import; add `PurchaseInfo`, `PurchaseActions` imports.

## No behavior changes
- No data, pricing, cart, or backend logic changes — pure layout reorder.
- Preview products remain non-transactable (Buy it now disabled, sku PREVIEW-PLANT).
- Gift note still persists to localStorage; checkout still reads it.
- Responsive behavior and the flat (no white-card) styling are unchanged.

## Verify
- `bunx tsgo --noEmit` clean.
- Playwright at 1280 / 768 / 375: confirm info block sits above Select Planter, buttons sit below it, 0 console errors, no overflow.
