# Category-specific hero banners

## লক্ষ্য
Homepage-এর প্রতিটি গোল category-তে click করলে সেই category অনুযায়ী screenshot-এর মতো wide, shallow, rounded hero banner দেখাবে। Pots page-এ pottery-focused composition থাকবে; অন্য প্রতিটি category-তেও একই layout ও visual quality থাকবে, কিন্তু artwork ও headline category অনুযায়ী বদলাবে।

## কী বদলাবে
- `Pots` banner হবে reference-এর composition অনুসরণ করে: warm peach/cream background, বাঁ পাশে বিভিন্ন premium planter-এর layered arrangement, ডান পাশে বড় dark-green দুই লাইনের headline। কোনো মানুষ, brand logo বা screenshot artwork ব্যবহার হবে না।
- একই art direction-এ original, human-free hero artwork তৈরি হবে:
  - Plants
  - Pots
  - Soil
  - Fertilisers
  - Seeds
  - Garden Tools
  - Watering Solutions
  - Pest Control
  - Gardening Decor
- সব banner-এর একই proportion, corner radius, text position, spacing ও soft natural-light styling থাকবে; শুধু category অনুযায়ী objects, background tint ও headline বদলাবে।
- Desktop-এ reference-এর মতো wide cinematic crop; tablet/mobile-এ artwork-এর focal point ও text position বদলে কোনো overlap ছাড়াই readable থাকবে।
- Homepage-এর temporary category shortcuts আর search listing-এ যাবে না; প্রতিটিকে dedicated category URL-এ নেওয়া হবে।
- Live category থাকলে slug থেকে তার আসল category ID resolve করে product request পাঠানো হবে, যাতে admin panel-এর ওই category-তে product যোগ করলে সেই page-এর grid-এ real product দেখা যায়।
- Live category name, description ও suitable category image থাকলে সেগুলো ব্যবহার করা হবে; পরিচিত নয় এমন future category-র জন্য clean reusable botanical fallback থাকবে।
- Hero-এর নিচে বর্তমান real API product listing, filters, sorting, load-more ও empty/error state থাকবে; কোনো fake category product, price বা stock যোগ হবে না।

## বাস্তবায়ন
- Reusable category hero component বানিয়ে category slug/name অনুযায়ী banner asset, headline এবং crop configuration map করা হবে।
- Category route live category list থেকে slug/id resolve করবে এবং resolved ID দিয়ে catalogue load করবে।
- Homepage fallback shortcut links `/category/$slug` route ব্যবহার করবে; live category links আগের মতো real slug ব্যবহার করবে।
- প্রতিটি category page-এর title, description এবং social metadata category অনুযায়ী unique থাকবে।

## যাচাই
- Homepage থেকে সব ৯টি category click করে সঠিক page/banner ও product filtering যাচাই।
- বিশেষভাবে Pots page-কে supplied screenshot-এর layout, crop, spacing ও hierarchy-এর সঙ্গে তুলনা।
- 1280px, 768px ও 375px-এ banner crop, text fit, no horizontal overflow এবং product grid continuity পরীক্ষা।
- সব page 200, zero console errors, এবং live API data precedence নিশ্চিত করা।
