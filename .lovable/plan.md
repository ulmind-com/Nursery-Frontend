# Complete screenshot-style product detail preview

## What will change
- Current preview product page-এর simple single-image layout বদলে screenshot-এর full product detail composition করা হবে।
- Desktop-এ বাঁ পাশে vertical thumbnail rail, মাঝখানে বড় rounded product image, ডান পাশে rating, title, subtitle, size selector এবং planter selector থাকবে।
- Mobile-এ বড় image-এর নিচে horizontal thumbnail rail এবং তারপর selectors stack হবে; কোনো overlap বা horizontal overflow থাকবে না।

## Dummy gallery for the empty catalogue
- Each generated preview plant will receive a small original gallery made only from the existing generated nursery imagery and clean detail crops; the supplied screenshots will remain reference-only and will not be embedded.
- Thumbnail click will update the large image and selected green outline exactly like the reference.
- Preview title, subtitle, rating and review count will be clearly presentation-only and will never enter cart, checkout or orders.

## Dynamic plant size selector
- Preview products will temporarily show `Small` and `Medium` selector tiles in the same proportions, spacing and green selected state as the screenshot.
- Changing the size will switch the compatible dummy planter list, selected variant, displayed price and gallery where applicable.
- For real admin products, unique size names will continue to come directly from the backend `sizes` array; no dummy size will be mixed with live data.
- Fully unavailable live sizes will be disabled.

## Dynamic planter selector
- Preview plants will temporarily show a full compact planter grid, including options such as GroPot, Krish, Kyoto, Yoda, Lagos, Roma, Diamond, Table Top and Spiro, with original minimal line-pot illustrations and preview prices.
- Selected planter will use the solid green state; other planter tiles will use white surfaces, thin borders and dark-green line art matching the reference.
- Choosing a planter will update its preview price and selected state, but preview products will remain non-purchasable.
- For real admin products, planter names, colours, price, MRP, stock, SKU and images will come only from matching backend variants. As soon as those exist, the temporary planter set disappears completely.

## Live-data behaviour
- Real products keep `/product/$id` and use backend variants as the sole source of truth.
- Selecting a live size filters its compatible planter variants; selecting a planter updates image gallery, price, MRP, discount, stock, SKU, cart payload and notify-me payload together.
- Products without planter variants hide the planter section. Products without sizes show only their base backend price and stock.
- Size Guide is shown only when the backend supplies height or size details.

## Visual matching
- Tighten the top-view proportions to the latest screenshots: pale blush canvas, broad image area, narrow thumbnail column, large dark-green heading, generous vertical spacing, large size tiles and a four-column planter grid on desktop.
- Use the existing semantic colour tokens, original brand and generated assets only; no Ugaoo logo, copied artwork, people or screenshot content.
- Preserve the current header, guarantee, details, care, reviews, similar products, mobile purchase bar and backend rules below this section.

## Verification
- Verify preview gallery switching, Small/Medium switching, planter selection and preview-only safety.
- Verify a real backend product shape with multiple sizes/planters updates gallery, price and cart payload correctly.
- Check 1280px, 768px and 375px layouts for matching proportions, clipping, overflow and console errors.
