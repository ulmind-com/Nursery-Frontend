# Compact plant-size selector

## Change
- Product detail page-এর `Small` ও `Medium` box দুটো reference-এর মতো compact করা হবে।
- বর্তমান অতিরিক্ত height ও width কমিয়ে desktop-এ পাশাপাশি ছোট rectangular tiles রাখা হবে।
- Selected tile solid green থাকবে; unselected tile white, thin border এবং dark text রাখবে।
- Heading ও Size Guide-এর spacing reference অনুযায়ী tighter করা হবে।
- Mobile-এ box দুটো screen-এর মধ্যে সুন্দরভাবে পাশাপাশি থাকবে, text বা layout overflow করবে না।
- একই sizing live admin products এবং temporary preview products—দুই ক্ষেত্রেই প্রয়োগ হবে।
- Gallery, planter selector, pricing এবং data behaviour অপরিবর্তিত থাকবে।

## Verification
- 1280px, 768px এবং 375px-এ size selector proportions ও alignment পরীক্ষা করা হবে।
- Small/Medium selection state ঠিকভাবে বদলাচ্ছে এবং কোনো console error বা overflow নেই তা যাচাই করা হবে।
