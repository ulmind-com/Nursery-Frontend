# Screenshot-Matched Homepage Top Section

## লক্ষ্য
শুধু homepage-এর উপরের অংশ—announcement strip, header, hero banner, category artwork row, এবং তার নিচের filter/sort transition—দেওয়া screenshot-এর composition, proportion, spacing ও visual rhythm-এর যতটা সম্ভব কাছাকাছি করা। কোনো celebrity বা মানুষের ছবি ব্যবহার করা হবে না।

## Header এবং navigation
- Screenshot-এর মতো তিন স্তরের desktop header রাখা: সরু dark-green rotating offer strip, তার নিচে logo + বড় centered search + compact account/wishlist/cart icons, তারপর centered category navigation row।
- Header-এর height, search field width, border, typography, horizontal spacing এবং sticky behaviour reference-এর কাছাকাছি করা।
- Brand name/logo বর্তমান brand configuration থেকেই আসবে; Ugaoo-এর logo, নাম বা proprietary copy ব্যবহার করা হবে না।
- Live category data থাকলে navigation-এ সেটিই আগে দেখানো হবে; existing fallback links শুধু empty API অবস্থায় থাকবে।
- Mobile-এ একই visual identity রেখে compact header, drawer, search এবং bottom navigation ঠিক রাখা হবে।

## Hero banner
- Reference-এর মতো constrained, wide, shallow, softly rounded banner বানানো হবে—full-screen hero নয়।
- একটি নতুন original banner image generate করা হবে: উজ্জ্বল premium indoor room, সামনে একাধিক healthy potted plants, warm natural light, clean cream backdrop; **কোনো মানুষ, celebrity, logo বা baked-in text থাকবে না**।
- Banner-এর plant cluster ও negative space reference-এর মতো balanced হবে, যাতে title right/center-right অংশে বসে।
- Live banner API image/video থাকলে সেটিই priority পাবে; generated image হবে polished fallback।
- Live title/subtitle/offer/CTA থাকলে ব্যবহার হবে; empty data-তে original nursery copy দেখানো হবে। একাধিক live banner থাকলে autoplay ও dots থাকবে।

## Illustrated circular categories
- Plants, Pots, Soil, Fertilisers, Seeds, Garden Tools, Watering Solutions, Pest Control এবং Gardening Decor-এর জন্য একটি cohesive, original illustrated icon set generate করা হবে।
- Artwork হবে screenshot-এর মতো colourful hand-drawn botanical/gardening illustration, white circular tile-এর মধ্যে; তবে reference-এর proprietary illustrations সরাসরি কপি করা হবে না।
- বড় circular image, প্রথম item-এর thin green outline, centered two-line labels, equal spacing এবং pale blush/green background reference-এর proportion অনুযায়ী মিলানো হবে।
- API category image থাকলে সেটিই ব্যবহার হবে; image না থাকলে matching generated illustration ব্যবহার হবে। কোনো catalogue item উদ্ভাবন করা হবে না—fallback shortcuts শুধু existing empty-API browsing links হিসেবে থাকবে।
- Desktop-এ এক সারিতে ৯টি item; tablet/mobile-এ clipped না হয়ে smooth horizontal scroll থাকবে।

## নিচের transition
- Category row-এর নিচে reference-এর মতো subtle divider এবং compact Filter / Sort controls-এর visual lead-in রাখা হবে, যাতে first viewport-এর composition screenshot-এর মতো শেষ হয়।
- Existing product/catalogue logic পরিবর্তন করা হবে না; এই controls real listing navigation/filter behaviour-এর সঙ্গে যুক্ত থাকবে, decorative dead controls হবে না।

## Styling constraints
- Approved blended green palette, pale storefront wash, Plus Jakarta Sans/Inter typography এবং semantic colour tokens বজায় থাকবে।
- Screenshot embed করা হবে না; Ugaoo branding, celebrity photo, exact marketing copy বা proprietary artwork কপি করা হবে না।
- Product, checkout, account, API integration ও backend business logic এই pass-এ অপরিবর্তিত থাকবে।

## যাচাই
- 1280px desktop view-তে screenshot-এর header/hero/category proportions পাশাপাশি তুলনা করা হবে।
- 768px ও 375px-এ horizontal overflow, clipped labels, overlapping icons বা broken navigation থাকবে না।
- Search, category links, wishlist/cart/account controls, carousel এবং filter/sort entry কাজ করছে কিনা দেখা হবে।
- Console error শূন্য এবং live API banner/category precedence অক্ষুণ্ণ থাকবে।
