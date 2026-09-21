# Move Description / Care Instruction / Estimate shipping under the product image

## Goal
Put the three content blocks — **Description**, **Care Instruction**, **Estimate shipping** (Country / Province / Zip code / Estimate) — directly below the product image (left column), matching the mybageecha-style reference layout where these sit under the gallery, not in a full-width strip below both columns.

## Current state (verified by reading `src/routes/product.$id.tsx`)
- `Gallery` (lines 94–114) is the left column of the main two-column grid.
- `ProductInfoSection` (lines 186–201) is a **full-width** block rendered *below* the main grid (called at line 311 in `PreviewProductPage` and line 471 in `LiveProductPage`). It is itself a two-column grid:
  - Left: `DetailAccordion` Description + `DetailAccordion` Care Instruction + `ShippingEstimator`.
  - Right: `ProductFactsGrid` + "Product Description" text.
- `DetailAccordion`, `ShippingEstimator`, `ProductFactsGrid` are self-contained components.

## Change
Restructure only the placement of existing blocks. No new components, no styling/sizing/logic changes.

### 1. Replace `ProductInfoSection` with two smaller renderers
Delete the `ProductInfoSection` function (lines 186–201). Add:

- `BelowImageInfo({ description, care, deliveryLabel })` — renders only the three blocks that belong under the image:
  - `DetailAccordion` "Description" (if `description`)
  - `DetailAccordion` "Care Instruction" (if `care.length > 0`)
  - `ShippingEstimator` (always, since it is display-only)
  - Wrapped in `<div className="mt-8 space-y-6">`.
- `FactsAndDescription({ facts, description })` — renders only the facts + product description (full-width below the grid):
  - `ProductFactsGrid` (if `facts.length`)
  - "Product Description" heading + paragraph (if `description`)
  - Wrapped in `<div className="mt-8">`.

### 2. Rebuild the main grid in both pages
**`PreviewProductPage`** (around lines 245–311) and **`LiveProductPage`** (around lines 400–471):

- Left column of the `lg:grid-cols-[minmax(0,1.18fr)_minmax(400px,.82fr)]` grid becomes:
  ```
  <div className="min-w-0">
    <Gallery ... />
    <BelowImageInfo description={...} care={...} deliveryLabel={...} />
  </div>
  ```
  (`Gallery` already has `self-start`; wrap so the accordions sit under it on the same column.)
- Right column stays the existing purchase `<section>` unchanged.
- After the closing `</div>` of the main grid, replace the `<ProductInfoSection .../>` call with:
  ```
  <FactsAndDescription facts={...} description={...} />
  ```

### 3. Responsive / mobile order
On mobile (single column) the order becomes: image → Description → Care Instruction → Estimate shipping → purchase panel → facts → Product Description. This matches the reference. No extra mobile-only markup needed.

### 4. Unchanged
- All accordion, shipping-estimator, facts-grid styling, sizing, behavior, and dynamic data mapping stay identical.
- `includes`, `ReviewsSection`, similar-products rail, mobile sticky bar, size-guide modal untouched.
- No new files, no package installs, no token changes.

## Files touched
- `src/routes/product.$id.tsx` — only file edited.

## Verification
- `bunx tsgo --noEmit` clean.
- Playwright at 1280 and 375 on `/product/preview-plants-0`: confirm Description / Care Instruction / Estimate shipping render directly under the product image (left column) on desktop, and in the same stacked order on mobile; facts grid + Product Description remain below; 0 console errors.
