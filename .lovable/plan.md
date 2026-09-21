# Compact plant facts section

## Goal
Make the plant-facts area match the supplied screenshot’s small, polished three-column presentation while keeping all live product values dynamic.

## Changes
- Keep the current nine facts and their existing dynamic backend mapping.
- Reduce each icon from the current oversized treatment to a compact reference-style size.
- Reduce value and label typography, spacing, row gaps, and section padding.
- Use a balanced three-column desktop grid with icon and text aligned tightly side by side.
- Let long values such as “Outdoor Shade, Outdoor Sun” and the multi-use list wrap cleanly without enlarging the row or overflowing.
- Preserve readable responsive behavior: three columns where space allows, two on smaller screens, and a compact mobile layout.
- Keep the surrounding Product Description content and all other product-page sections unchanged.

## Dynamic behavior
- Live products continue to populate Water Requirement, Flower Color, Fragrance, Use, Size, Genus, With Pots, Sunlight Requirement, and tags from product/variant data.
- Missing backend facts remain hidden rather than receiving invented values.
- Preview products continue to show the supplied nine example facts only as a design preview.

## Validation
- Check the preview product at desktop, tablet, and mobile widths.
- Confirm all nine facts fit cleanly, long text wraps properly, and no horizontal overflow occurs.
- Confirm the page has no browser console errors.
