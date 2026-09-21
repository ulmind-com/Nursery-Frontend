# Move the plant-facts grid under "Select Planter"

Right now the icon facts (Daily / Water Requirement, Pink / Flower Color, Fragrant, Hedge, Large, Nyctanthes, Yes With Pots, Sunlight Requirement, Use) sit in a full-width block below the whole page grid. In the reference they sit in the right-hand column, directly under the planter tiles, with "Product Description" following after.

## Changes

- Move the 3-column facts grid into the right purchase column, placed immediately after the "Select Planter" tile grid (and after the traits list on live products).
- Add a thin divider line above and below the facts grid, matching the reference.
- Keep the "Product Description" heading and paragraph where it is today: full width, below the page grid.
- Apply to both the preview product page and the live product page, identically.
- No change to the left column (image, Description, Care Instruction, Estimate shipping, offers/guarantee strips), to sizing/typography of the facts, or to any other route.

## Technical notes

In `src/routes/product.$id.tsx`: split `FactsAndDescription` into `ProductFactsGrid` (already exists, rendered inside the right column with divider borders) and a `ProductDescriptionSection` rendered after the grid closes. Update both `PreviewProductPage` and `LiveProductPage` call sites; live page keeps the `specRows` fallback mapping for facts. Verify with Playwright at 1280 and 375.
