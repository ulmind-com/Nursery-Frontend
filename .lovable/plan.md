# Customer Reviews section on the product page

Add a full customer-reviews block directly below "Product Description" on the product page, styled like the reference: big average score, star breakdown bars, a "Write a review" button, sorting, and the review list.

## What the customer sees

Below Product Description:

```text
                    Customer Reviews
  4.6 out of 5      5 star ####### 17     [ Write a review ]
  Based on 22       4 star ##       4
  reviews           3 star          0
                    2 star #        1
                    1 star          0
  --------------------------------------------------------
  Most Recent  v
  ★★★★★  Arya .  [Verified]
  The plant looks healthy and good condition
  ...
```

- "Write a review" opens an inline form: star rating, title, comment, submit.
- After a real customer buys and submits a review, it is saved to the shop's backend and shows on that product for everyone.
- Only people who actually bought the product can submit; others see a short note instead of the form.
- Sorting: Most recent / Highest rating / Lowest rating.
- If a product has no reviews yet, an empty state with the "Write a review" button.
- On the demo preview product, a few sample reviews are shown so the design is visible; the form there is disabled with a "design preview" note.

## Technical notes

- New `src/components/product/reviews-section.tsx`:
  - Props: `productId`, `preview?`, `fallbackReviews?`, `rating?`, `count?`.
  - Live data via `reviewsApi.list({ product_id, limit: 50 })` (handles array or paginated shape) and `reviewsApi.summary(productId)` for the average/breakdown, falling back to computing the breakdown from the fetched reviews when summary is unavailable.
  - `reviewsApi.canReview(productId)` gates the form (also hidden when unauthenticated); submit via `reviewsApi.create({ product_id, rating, title, comment })` with React Hook Form + Zod, `sonner` toast, then invalidate the reviews/summary/product queries so the new review and counts appear immediately.
  - Helpful vote via `reviewsApi.vote` on each card.
  - Client-side sort select; no invented totals — averages/counts come from backend, computed only from real fetched rows.
- `src/routes/product.$id.tsx`: delete the current inline `ReviewsSection`; render the new component after `ProductDescriptionSection` in both `LiveProductPage` and `PreviewProductPage`.
- `src/components/category/preview-products.ts`: add an optional `reviews` array (author, rating, title, comment, date, verified) to `PreviewItem` and sample entries for the demo plant — used only for preview IDs, never for live products.
- Tokens only for colors (star gold, forest, primary), tabular price/number styling, 200ms transitions, reduced-motion safe; responsive 1440–375.
