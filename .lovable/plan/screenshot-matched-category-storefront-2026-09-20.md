# Screenshot-matched category storefront

## Goal

Pots page-কে দেওয়া reference-এর composition, spacing এবং visual hierarchy-এর যতটা সম্ভব কাছাকাছি করা হবে। একই reusable structure বাকি category pages-এও থাকবে, তবে প্রত্যেকটির artwork ও content category অনুযায়ী হবে।

## Page structure

- বর্তমান three-level header থাকবে, কিন্তু reference-এর মতো compact scale, wide centered search, evenly spaced menu এবং active category underline হবে।
- Category banner হবে প্রায় full-width, wide ও shallow, soft rounded cornersসহ; Pots artwork-এ planter arrangement বামে এবং বড় দুই লাইনের headline ডানে থাকবে। বর্তমান extra description বাদ যাবে, যাতে reference-এর মতো clean থাকে।
- Banner-এর ঠিক নিচে homepage-এর একই ৯টি circular illustrated category tile বসবে; বর্তমান page অনুযায়ী tile-এ thin green selection ring থাকবে। সব tile নিজ নিজ category page-এ যাবে।
- Category row-এর পর thin divider সহ এক লাইনের toolbar থাকবে: বামে icon + `FILTER`, ডানে minimal `Sort by` dropdown। Desktop sidebar আর default অবস্থায় জায়গা নেবে না; filter click করলে panel খুলবে।
- Toolbar-এর পর reference-এর মতো roomy 3-column product grid হবে; tablet-এ 2–3 এবং mobile-এ 2 columns থাকবে।

## Product cards

- Cards হবে borderless white, বড় nearly-square image, 12–16px corners, top-left yellow `BESTSELLER` badge এবং প্রয়োজন হলে compact rating stripসহ।
- Card body-তে bold display title, optional one-line description, bold current price, muted struck MRP এবং right-aligned dark-green pill `View Product` button থাকবে।
- Live admin products পাওয়া গেলে image, badge, rating, title, description, price/MRP, stock এবং destination সব backend থেকেই আসবে।
- API empty থাকলে design অসম্পূর্ণ না দেখাতে category-matched preview cards দেখানো হবে। Pots-এর জন্য original planter product photos তৈরি হবে; অন্য preset categories-এ তাদের নিজস্ব original preview artwork/content থাকবে। Preview cards demo-only—cart, checkout বা nonexistent product page খুলবে না। Live products এলে preview set সম্পূর্ণ সরে যাবে, কখনো mix হবে না।

## Category-specific treatment

- Plants, Pots, Soil, Fertilisers, Seeds, Garden Tools, Watering Solutions, Pest Control এবং Gardening Decor একই layout ব্যবহার করবে।
- প্রতিটি page-এ selected ring, headline, banner artwork এবং preview product imagery তার category অনুযায়ী বদলাবে।
- কোনো মানুষ, celebrity, Ugaoo logo, screenshot crop, watermark বা proprietary artwork ব্যবহার হবে না; reference শুধু layout/style guide হিসেবে থাকবে।

## Responsive and behaviour

- Desktop-এ reference-এর wide storefront rhythm রাখা হবে; 375px mobile-এ category rail horizontally scrollable, banner clean stacked/cropped এবং controls এক লাইনে থাকবে।
- Existing real filters, sort, load-more এবং API queries অক্ষুণ্ণ থাকবে; শুধু presentation বদলাবে।
- 1280px, 768px ও 375px widths-এ Pots এবং অন্য preset category যাচাই করা হবে: no overflow, clipped text, overlap বা console error; live products preview data-কে replace করে কি না তাও পরীক্ষা হবে।
