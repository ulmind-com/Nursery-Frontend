# Full product content for every preview product

Right now only the Peace Lily preview page has description, care, 9 facts, reviews, "5 Reasons" and the "MyGarden vs the Rest" comparison. Every other preview product page shows those sections empty. This fills them in for all products, with content that matches each product.

## What changes

1. Hand-written content for each of the 6 plants and 6 pots
   - Peace Lily, Anthurium Red, Jade Mini, Areca Palm, Golden Money Plant, Snake Plant
   - Sienna Terracotta, Roma Ceramic, Orbit Wooden, Sage Ribbed, Woven Basket, Teal Faceted
   - Each gets: short description, care/use instructions, 9-fact grid, 4-5 sample reviews with varied ratings and dates, 5 reasons to buy, and a comparison table.

2. Category-level defaults for the other categories (soil, fertilisers, seeds, garden tools, watering, pest control, decor), generated from the product name so each page reads correctly instead of being blank.

3. Content is written per product type, not copy-pasted:
   - Plants: watering, sunlight, size, genus, fragrance, air-purifying, pot included.
   - Pots and other products: material, finish, drainage hole, size, indoor/outdoor use, plant not included.
   - Care section for non-plant products becomes usage/maintenance notes.
   - Reasons and comparison rows are worded for the product type (a pot is not "nursery grown").

4. Reviews stay sample-only on preview pages and keep the existing "Design preview" note. Nothing becomes purchasable, no prices/claims invented beyond the existing preview-demo framing.

5. Live products from the admin panel are unaffected: when real catalogue data exists, all of these sections continue to read from the backend fields and preview content is never shown.

## Technical notes

- Extend the plants and pots arrays in `src/components/category/preview-products.ts` with full `PreviewItem` data (description, careInstructions, facts, reviews, reasonsToBuy, reasonsImage, comparison).
- Reuse existing imported assets for gallery/reasons images per product; no new image generation unless a product has no usable image.
- Add a small builder in the same file for generic categories so `previewItemsFor()` returns populated items for soil/fertilisers/seeds/tools/watering/pest/decor.
- Fact icons stay within the existing union (`water | flower | fragrance | use | size | genus | pot | sun`); for non-plants, map material/finish to `genus`/`pot` style entries rather than widening the type.
- No changes to `product.$id.tsx` rendering or to the live-product data path.
