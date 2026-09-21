# Plan: Move purchase buttons to right after Quantity

## Goal
On the product detail page (preview + live), the two action buttons (**Add to cart** / **Buy it now**) currently render inside `PurchaseActions`, which sits **after** the "Select Planter" section. The reference screenshot shows them placed **immediately after the Quantity stepper + delivery-time line**, with nothing between. Move the two-button row up so it sits right after `PurchaseInfo` (after the delivery-time line) and **before** "Select Planter". The CouponBox and the guarantee/support/delivery strips stay where they are (after Select Planter) — only the button row moves.

## Changes

### `src/components/product/purchase-extras.tsx`
Split `PurchaseActions` into two exported pieces:
1. **`PurchaseButtons`** — new component containing only the two-button grid (`Add to cart` / `Buy it now`). Props: `stock`, `preview`, `onAdd`, `onBuyNow`. Same classes/sizes/icons as today (`bg-star` for Add to cart, `bg-primary` green for Buy it now).
2. **`PurchaseActions`** — keeps the CouponBox + guarantee/support/delivery strips, **without** the button row. Props unchanged minus the button-related ones (`price`, `quantity`, `stock`, `preview`, `settings`).

### `src/routes/product.$id.tsx`
In both `PreviewProductPage` and `LiveProductPage`, insert `<PurchaseButtons .../>` **immediately after** `<PurchaseInfo .../>` and **before** the "Select Planter" block. The existing `<PurchaseActions .../>` (now coupon + strips only) stays after "Select Planter" unchanged. Pass the same `onAdd`/`onBuyNow`/`stock`/`preview` values to `PurchaseButtons` that `PurchaseActions` currently receives.

## Scope
- `src/components/product/purchase-extras.tsx` and `src/routes/product.$id.tsx` only.
- No layout/sizing/color changes beyond the position move.

## Verification
- `bunx tsgo --noEmit` clean.
- Playwright at 1280 + 375 on `/product/preview-plants-0`: button row appears directly under Quantity (before "Select Planter"); coupon/guarantee strips remain after "Select Planter"; 0 console errors.
