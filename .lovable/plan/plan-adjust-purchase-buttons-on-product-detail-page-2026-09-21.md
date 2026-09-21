# Plan: Adjust purchase buttons on product detail page

## Goal
On the product detail page (preview + live), fix the two purchase action buttons in `src/components/product/purchase-extras.tsx` (`PurchaseActions`):

1. **"Preview only" → "Add to cart"** — the left button's label currently reads `preview ? "Preview only" : stock > 0 ? "Add to cart" : "Notify me"`. Drop the `preview ? "Preview only"` branch so the button always says **"Add to cart"** when in stock (and **"Notify me"** when out of stock), regardless of preview mode. The button stays disabled for preview just as it is today (preview items remain non-transactable); only the visible label changes.

2. **"Buy it now" button color → bright green** — the right button currently uses `bg-forest text-forest-foreground hover:bg-forest/90` (dark forest green). Swap to `bg-primary text-primary-foreground hover:bg-primary/90` so it matches the bright primary green (`#16a34a`) used elsewhere on the site. Layout, size, icon, disabled state, and behavior are unchanged.

## Scope
- Only `src/components/product/purchase-extras.tsx`, the `PurchaseActions` component (the two `<Button>` lines ~137–138).
- No other files, no layout/order changes — the buttons already sit right after Quantity in `PurchaseInfo`/`PurchaseActions`.

## Verification
- `bunx tsgo --noEmit` typecheck clean.
- Playwright at 1280 + 375 on `/product/preview-plants-0`: left button reads "Add to cart", right "Buy it now" button renders bright green (`#16a34a`), 0 console errors.
