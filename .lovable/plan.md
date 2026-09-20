# Exact Reference-Style Hero Refinement

## লক্ষ্য
Homepage hero-টিকে নতুন screenshot-এর মতো একই wide cinematic proportion, crop, spacing, rounded corners এবং headline composition-এ আনা। আগের নির্দেশ অনুযায়ী কোনো মানুষ বা celebrity থাকবে না।

## Hero artwork
- বর্তমান মানুষবিহীন indoor-plant scene-টিকে reference-এর composition অনুযায়ী নতুন করে edit/generate করা হবে: বাম পাশে বড় planter, center-left/center-এ layered plants, warm cream room, ডান পাশে clean negative space।
- কোনো মানুষ, body part, celebrity, logo, watermark বা ছবির মধ্যে লেখা থাকবে না।
- Plant arrangement, warm daylight, cream/green colour balance এবং premium catalogue photography reference-এর কাছাকাছি রাখা হবে।

## Layout এবং crop
- Desktop-এ hero হবে reference-এর মতো খুব wide ও shallow, container-এর দুই পাশে সমান margin এবং প্রায় 16px soft corner radius।
- Image crop এমন হবে যাতে plants কাটা না যায় এবং headline-এর জন্য ডান-center অংশ পরিষ্কার থাকে।
- Hero text ডান-center-এ বড় dark-green দুই লাইনের headline হিসেবে বসবে; supporting copy ও CTA reference-এ না থাকায় desktop hero থেকে সেগুলো সরানো হবে।
- API banner title থাকলে একই typography/position-এ দেখানো হবে; empty API-তে “Bring life to your space” থাকবে।
- Live API image/video সর্বদা priority পাবে; নতুন artwork শুধু fallback হবে।

## Responsive behaviour
- Desktop-এ screenshot-এর exact shallow banner rhythm রাখা হবে।
- Tablet ও mobile-এ একই artwork ব্যবহার করে focal-point crop বদলানো হবে, যাতে plants ও headline দুটোই readable থাকে।
- Mobile-এ headline ছোট হবে কিন্তু image-এর ওপর overlap, clipping বা overflow হবে না।
- Multiple live banners থাকলে existing autoplay এবং dots বজায় থাকবে।

## সীমা
- Header, category icons, filter/sort row, product sections, API integration এবং commerce logic পরিবর্তন করা হবে না।
- Reference screenshot app-এ embed করা হবে না এবং Ugaoo branding/proprietary artwork কপি করা হবে না।

## যাচাই
- 1280px-এ reference-এর banner ratio, edge margins, corner radius, crop এবং headline placement তুলনা করা হবে।
- 768px ও 375px-এ crop, readability ও overflow যাচাই করা হবে।
- Console error থাকবে না এবং live API banner precedence অক্ষুণ্ণ থাকবে।
