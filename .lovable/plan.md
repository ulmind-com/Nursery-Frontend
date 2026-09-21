# Product detail page reference refinement

## Goal
Make the product detail page match the supplied reference more closely while keeping every real product value dynamic from the backend.

## Changes
- Rework the top product area into a reference-style two-column layout: left image card with vertical thumbnail rail and a large product image, right purchase card with rating, title, subtitle, SKU, selectors, price, quantity and purchase buttons.
- Keep multiple product images dynamic: live products use backend `images` / selected variant images; preview products use temporary generated gallery images until admin products replace them.
- Move the selected size/planter/color/price/quantity block into the right purchase card in the same visual order as the reference.
- Add two side-by-side purchase actions: **Add to cart** and **Buy it now**. Buy it now will add the selected item and take the customer to checkout; preview products will remain non-purchasable.
- Add delivery-time/support text only from `/settings`; if a setting is missing, hide that line instead of inventing a promise.
- Add reference-style lower content: left column accordion cards for **Description** and **Care Instruction**, plus an **Estimate shipping** panel using user-entered country/province/zip fields for display only unless the backend exposes a shipping-estimate endpoint later.
- Add a dynamic plant facts grid like the screenshots: Water Requirement, Flower Color, Fragrance, Use, Size, Genus, With Pots, Sunlight Requirement and related use tags.
- Use backend `plant_spec`, selected variant data, product tags, care instructions and description for the facts grid and copy. Preview products will use clearly temporary sample facts that disappear when live admin data exists.
- Keep the offer panel and yellow service strips below the purchase controls, sourced from active coupons and settings.

## Dynamic behavior
- **Live products:** image thumbnails, selected variant, SKU, price, MRP, stock, size, planter, color, description, care content and facts all update from backend product data.
- **Preview products:** temporary gallery, product facts and copy demonstrate the layout only; Add to cart and Buy it now remain disabled-safe.
- **Checkout:** Add to cart preserves current quantity/size/planter; Buy it now uses the same selected variant and then opens checkout.

## Technical details
- Add small helper mapping for optional plant-spec fields without hardcoding commercial claims.
- Extend preview product data with non-commerce sample facts/care text for the empty-backend state.
- Keep uploaded screenshots and external product pages as visual references only; do not embed their images, logos or proprietary copy.
- Use existing design tokens and Button components; avoid hardcoded prices, taxes, stock, guarantees or delivery promises for live products.

## Validation
- Check `/product/preview-plants-0` at desktop, tablet and mobile widths.
- Verify thumbnail changes, size/planter/color changes, quantity changes and both action buttons.
- Verify live-product behavior still follows backend variants and no preview content appears when backend data exists.
- Confirm no layout overflow and no browser console errors.
