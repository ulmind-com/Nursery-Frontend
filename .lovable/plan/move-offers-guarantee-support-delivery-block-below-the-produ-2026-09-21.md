# Move Offers / Guarantee / Support / Delivery block below the product image

## Goal
Move the Offers / 30-Day Plant Guarantee / Support / Free-delivery block (today rendered by `PurchaseActions` inside the right purchase panel) so it sits under the product image, after the Estimate shipping block — matching the reference layout where Description → Care Instruction → Estimate shipping → Offers/Guarantee/Support/Delivery all live in the left column under the gallery. Remove it from the right purchase panel.

## Current state (verified by reading `src/routes/product.$id.tsx` + `purchase-extras.tsx`)
- `BelowImageInfo` (lines 186–201) renders Description + Care Instruction + `ShippingEstimator` in the left column under the `Gallery`.
- `PurchaseActions` (in `src/components/product/purchase-extras.tsx`, lines ~141–170) renders: `CouponBox` ("Offers for you"), then a `space-y-2` block with the guarantee strip, then a `sm:grid-cols-2` block with support + delivery strips. Props: `price`, `quantity`, `stock`, `preview`, `settings`.
- In `PreviewProductPage` (lines ~315–321) `<PurchaseActions .../>` is rendered after the "Select Planter" grid inside the right `<section>`.
- In `LiveProductPage` (lines ~474–479) `<PurchaseActions .../>` is rendered after the "Select Planter" block inside the right `<section>`.

## Change

### 1. `BelowImageInfo` gains the offers/guarantee/support/delivery block
Add a new optional prop `actions?: ReactNode` to `BelowImageInfo`. Render it (if provided) after `ShippingEstimator`, still inside the `mt-8 space-y-6` wrapper. Signature:
```
BelowImageInfo({ description, care, deliveryLabel, actions })
```
Render order: Description accordion → Care Instruction accordion → ShippingEstimator → `actions`.

### 2. Remove `<PurchaseActions .../>` from the right `<section>` in both pages
- `PreviewProductPage`: delete the `<PurchaseActions .../>` JSX (lines ~315–321) so "Select Planter" is the last thing in the right column (followed only by the existing trailing traits in the live page).
- `LiveProductPage`: delete the `<PurchaseActions .../>` JSX (lines ~474–479).

### 3. Pass the block into `BelowImageInfo` from both pages
In both pages, change the `<BelowImageInfo .../>` call to include an `actions` prop:
```
<BelowImageInfo description={...} care={...} deliveryLabel={...}
  actions={<PurchaseActions price={...} quantity={...} stock={...} preview={...} settings={...} />} />
```
Use the same prop values that were on the removed right-column `<PurchaseActions>` call.

### 4. Unchanged
- `PurchaseActions`, `CouponBox`, guarantee/support/delivery strip styling, sizing, and dynamic data mapping stay identical — only its placement moves.
- `PurchaseInfo`, `PurchaseButtons`, "Select Planter", facts grid, Product Description, `includes`, reviews, similar rail, mobile sticky bar, size-guide modal untouched.
- No new files, no package installs, no token changes.

## Files touched
- `src/routes/product.$id.tsx` — add `actions` prop to `BelowImageInfo`; remove two `<PurchaseActions>` calls from right columns; pass `actions` into `BelowImageInfo` in both pages.

## Verification
- `bunx tsgo --noEmit` clean.
- Playwright at 1280 and 375 on `/product/preview-plants-0`: confirm order under the image = Description → Care Instruction → Estimate shipping → Offers/Guarantee/Support/Delivery; right purchase panel no longer shows the Offers/Guarantee strips; 0 console errors.
