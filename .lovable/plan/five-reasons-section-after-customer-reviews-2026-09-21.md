# Five reasons section after customer reviews

Add a new product-detail section directly after **Customer Reviews**, matching the reference layout: a deep green full-width band, large plant image on the left, bold headline on the right, and five yellow checkmarked reasons.

## What the customer sees

After the reviews:

```text
[ large lifestyle plant image ]     5 Reasons to
                                    buy this plant.

                                    ✓ Reason one
                                    ✓ Reason two
                                    ✓ Reason three
                                    ✓ Reason four
                                    ✓ Reason five
```

- Desktop: two-column section with the image taking the left side and the reasons on the right.
- Mobile: stacked layout, image first, reasons below, with no overflow.
- Use an original/demo plant image only for preview products; never embed the uploaded screenshot or copied website assets.
- Keep the existing sticky add-to-cart bar behavior unchanged.

## Dynamic behavior

- Live products should use backend-provided content when available.
- Preview products should show dummy reasons so the design is visible now.
- If a live product does not provide reasons yet, derive a short fallback from dynamic product fields only, such as plant specs, tags, care details, short description, or selected variant.
- Do not invent prices, delivery promises, stock, guarantees, or copied commercial claims.

## Technical details

- Add a reusable `ReasonsToBuySection` in the product area.
- Extend preview product data with `reasonsToBuy` and an optional section image.
- In `product.$id.tsx`, render the new section after `ReviewsSection` for both preview and live products.
- For live products, build the reasons from safe dynamic fields first; hide the section only if there is no reliable product data to show.
- Use existing design tokens: forest background, star/yellow checklist accents, current typography, responsive constraints, and reduced-motion-safe transitions.

## Validation

- Check `/product/preview-plants-0` at desktop and mobile widths.
- Confirm the order is: Product Description → Customer Reviews → 5 Reasons section.
- Confirm no copied screenshot image is used, no layout overflow appears, and no browser console errors occur.
