# Screenshot-style product grid beneath categories

## Scope

Homepage-এর illustrated Plants, Pots ইত্যাদি category row-এর পরেই reference screenshot-এর মতো product browsing area যোগ করা হবে। Header, hero, category artwork, checkout এবং অন্য pages এই pass-এ বদলাবে না।

## Layout and styling

- Category row-এর নিচে full-width pale storefront background-এর মধ্যে thin top divider রাখা হবে।
- উপরে compact control row থাকবে: বাঁ পাশে filter icon + `FILTER`, ডান পাশে `Sort by` + chevron—reference-এর একই alignment, scale ও whitespace অনুসরণ করবে।
- তার নিচে desktop-এ 3-column product grid, tablet-এ 2–3 columns এবং mobile-এ 2 columns থাকবে।
- Cards হবে reference-এর মতো tall image-led layout: বড় rounded product image, image-এর top-left yellow `BESTSELLER` badge, bottom-left compact rating/review strip।
- White card body-তে serif-style bold title, এক লাইনের description, bold current price, muted struck MRP এবং dark-green rounded `View Product` button থাকবে।
- Image ratio, card spacing, corners, type hierarchy ও row gaps reference-এর যতটা সম্ভব কাছাকাছি রাখা হবে; existing semantic colour tokens ব্যবহার হবে।
- Hover-এ শুধু restrained image zoom/button response থাকবে; reduced-motion preference মানা হবে।

## Temporary sample products

- Six original, human-free product photographs generate করা হবে: healthy indoor plants in clean white pots, warm premium living-room setting, consistent camera angle and lighting.
- Screenshot image embed/copy করা হবে না; কোনো Ugaoo logo, branding বা watermark থাকবে না।
- API empty থাকলে sample title, short description, rating, review count, price এবং MRP দিয়ে এই preview cards দেখানো হবে, যেমন user নির্বাচন করেছেন।
- Sample cards demo-only থাকবে: তারা cart/order totals-এ যাবে না এবং nonexistent product detail page খুলবে না; button preview state বোঝাবে যাতে fake backend transaction না হয়।

## Live admin products take precedence

- Homepage product query real `/products` API থেকে data নেবে।
- Admin panel-এ এক বা একাধিক product যোগ হলেই temporary sample array সম্পূর্ণ সরিয়ে একই card layout-এ real product image, title, description, badges, rating, price/MRP এবং ID-based product link দেখাবে।
- Pricing, stock, discount ও product availability-এর জন্য API-ই source of truth থাকবে; sample data কখনো real product data-এর সঙ্গে mix হবে না।
- Live products-এর `View Product` button existing `/product/$id` page খুলবে।

## Verification

- API-empty অবস্থায় sample section এবং API-populated shape দিয়ে live-card switching যাচাই করা হবে।
- 1280px, 768px ও 375px widths-এ card count, image crop, text fit, filter/sort alignment, overflow এবং console errors পরীক্ষা করা হবে।
