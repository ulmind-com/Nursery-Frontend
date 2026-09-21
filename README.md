# Verdant Bloom

MASTER PROMPT: BUILD A PREMIUM PLANT NURSERY E-COMMERCE FRONTEND

Build a complete, production-ready, ultra-premium Plant Nursery e-commerce frontend.

This is a FRONTEND-ONLY project.

The backend, database, authentication APIs, admin panel, payment APIs, upload APIs, recommendation APIs, review APIs, order APIs and business logic already exist.

DO NOT build or replace the backend.

DO NOT create a new backend.

DO NOT use Supabase.

DO NOT use Supabase Auth.

DO NOT create Supabase database tables.

DO NOT mock the backend as the final implementation.

DO NOT replace the existing REST API with local JSON data.

The frontend must communicate directly with the existing external REST API.

1. CORE TECHNOLOGY REQUIREMENTS

Use:

TypeScript

React

Vite

Tailwind CSS

React Router

TanStack Query / React Query for server state

Axios for API communication

Lucide React for icons

Framer Motion for premium animations

Zod for frontend validation where useful

React Hook Form for complex forms

Sonner or an equivalent premium toast system

Proper reusable component architecture

The application must be strongly typed.

Avoid any wherever possible.

Create proper TypeScript interfaces/types for:

User

Product

ProductSize

PlantSpecification

Category

Brand

Banner

HomeSection

SiteMedia

Coupon

Combo

Review

Order

OrderItem

Address

BlogPost

GoogleReview

Wishlist

Recommendation

Settings

ChatMessage

Pagination

API errors

Authentication responses

Checkout responses

2. API CONFIGURATION

Create:

.env

with:

VITE_API_BASE_URL=YOUR_EXISTING_BACKEND_URL
VITE_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
VITE_RAZORPAY_KEY_ID=YOUR_RAZORPAY_KEY_ID


The API base URL must NEVER be hardcoded inside individual components.

Create one centralized Axios client:

src/lib/api.ts


Configure:

baseURL: import.meta.env.VITE_API_BASE_URL


Add an Axios interceptor that automatically attaches:

Authorization: Bearer <access_token>


when a token exists.

Handle:

401

403

404

422

429

500

network errors

with proper UI feedback.

Never expose secrets.

3. VERY IMPORTANT: NO SUPABASE

This project already has a complete external backend.

Therefore:

DO NOT:

install Supabase

initialize Supabase

create Supabase client

use Supabase database

use Supabase Auth

create Supabase edge functions

create Supabase storage

migrate API data to Supabase

The only data source must be the existing REST API.

4. DESIGN DIRECTION

The website should feel like a premium Indian plant and gardening brand.

Design inspiration:

Reference website:

https://www.ugaoo.com/collections/plants

Use this only as inspiration for:

overall ecommerce hierarchy

premium plant-commerce feel

navigation

category organization

product grid

filter/sort experience

merchandising

whitespace

product presentation

promotional sections

DO NOT copy:

logo

brand name

exact copy

product images

proprietary illustrations

source code

exact layouts pixel-for-pixel

Create an original visual identity.

The design must be substantially more polished and modern.

5. VISUAL LANGUAGE

Primary theme:

WHITE + PREMIUM GREEN

Suggested palette:

Primary Green: #1F6B4F
Dark Green: #123F31
Emerald: #237A58
Soft Green: #EAF5EE
Mint: #F3FAF5
Background: #FFFFFF
Secondary Background: #F7F9F7
Text Primary: #17352B
Text Secondary: #68756F
Border: #E7ECE8
Success: #2E7D5B
Warning: #D98C23
Danger: #D94A4A


Do not overuse green.

The site should primarily use:

white

soft off-white

muted green

deep botanical green

subtle neutral gray

The overall look should feel:

premium

elegant

botanical

sophisticated

spacious

trustworthy

modern

minimal

high-end

conversion focused

Avoid:

cheap gradients

excessive shadows

cartoon UI

excessive rounded cards

excessive glassmorphism

neon colors

clutter

huge unnecessary headings

generic dashboard-style ecommerce UI

6. TYPOGRAPHY

Use a premium modern typography system.

Preferred:

Inter

Manrope

DM Sans

or another premium modern sans-serif

Use a refined type scale.

Headlines:

elegant

slightly heavier

spacious

Body:

highly readable

comfortable line height

Product names:

medium weight

compact

clean

Prices:

strong visual hierarchy

Discount:

subtle but visible

7. DESKTOP HEADER

Create a sophisticated multi-layer header.

Top announcement bar:

Example dynamic announcements from:

GET /settings

The announcement content should come from backend whenever available.

Below it, main navigation:

Left:

Logo

Brand name

Center:

Plants

Pots & Planters

Plant Care

Seeds

Combos

Offers

Blog

Right:

Search

Account

Wishlist

Cart

Do NOT hardcode category structure when the backend provides dynamic data.

Use API data where possible.

8. HEADER BEHAVIOR

Desktop:

sticky header

elegant transition when scrolling

compact header after scroll

smooth navigation

search interaction

wishlist count

cart count

Mobile:

sticky compact header

hamburger menu

centered logo

search icon

wishlist

cart

Create a premium mobile drawer navigation.

Navigation must work using React Router.

9. GLOBAL SEARCH

Create a premium search experience.

Endpoint:

GET /search


Supported parameters:

q

category_id

brands

sizes

colors

price_min

price_max

min_rating

min_discount

in_stock

sort

skip

limit

Also:

GET /search/trending


Display trending searches from backend.

Search should support:

debounced search

autocomplete

recent searches

trending searches

product suggestions

category suggestions

keyboard navigation

enter-to-search

dedicated search results page

loading skeleton

no-results state

Do not call the backend on every keystroke.

Use debounce.

10. HOME PAGE

Create an extremely premium homepage.

Route:

/


Homepage should be API-driven.

Use:

GET /home-sections/resolved
GET /banners
GET /site-media
GET /recommendations/home
GET /categories
GET /brands
GET /reviews/highlights
GET /google-reviews
GET /google-reviews/summary
GET /settings


The homepage should not look like a static template.

It must dynamically render the content configured through the backend/admin panel.

11. HOME PAGE STRUCTURE

Recommended structure:

Announcement Bar

Dynamic promotional messaging.

Hero Section

Use backend banners/media.

Support:

image

video

poster

title

subtitle

promotional code

CTA

active state

Create cinematic hero transitions.

Shop by Category

Large visual category cards.

Use category images/icons from API.

Featured / Bestseller Products

Use:

GET /recommendations/home


and/or home sections.

Create horizontal product rails.

New Arrivals

Use product flags:

is_new_arrival


Bestsellers

Use:

is_bestseller


Featured Plants

Use:

is_featured


Plant Care / Educational Section

Use backend-managed site media.

Promotional / Combo Section

Highlight combos.

Reviews

Use:

GET /reviews/highlights
GET /google-reviews
GET /google-reviews/summary


Blog / Journal

Use:

GET /blog/posts


Plant Guarantee

Use settings:

GET /settings


Newsletter / final CTA

Premium footer CTA.

12. DYNAMIC HOME SECTIONS

Backend has:

GET /home-sections
GET /home-sections/resolved
POST /home-sections
PATCH /home-sections/{section_id}
PUT /home-sections/order
DELETE /home-sections/{section_id}


Frontend must consume resolved sections dynamically.

Supported concept:

title
type
layout
product_ids
category_id
limit
order
active


Possible layout variants:

rail

grid

featured

editorial

hero

split

banner

collection

Create reusable section renderers rather than hardcoding every section.

13. SITE MEDIA

Use:

GET /site-media/sections
GET /site-media


Media can be:

image

video

poster

title

subtitle

Create rich editorial sections with cinematic visuals.

Video sections should:

autoplay where appropriate

be muted

lazy-load

have poster fallback

pause when out of viewport when appropriate

14. PRODUCT COLLECTION PAGE

Routes:

/plants
/products
/category/:slug
/category/:id


Create a premium ecommerce collection experience.

Use:

GET /products


Supported filtering:

category_id

q

brand

plant_type

sunlight

difficulty

pet_safe

air_purifying

flowering

is_bestseller

is_new_arrival

is_featured

min_price

max_price

sort_by

limit

skip

admin


Create:

Desktop:

- left filter sidebar
- right product grid

Mobile:

- filter button
- filter bottom sheet/drawer
- sort button

Do NOT reload the entire page for every filter.

Use URL query parameters so filters are shareable.

Example:

```text
/plants?plant_type=Indoor&sunlight=Low%20Light&min_price=200&max_price=1000


15. PRODUCT GRID

Create an extremely polished ProductCard.

Each card can contain:

product image

image hover swap

wishlist button

bestseller badge

new arrival badge

discount badge

rating

review count

product title

short description

current price

MRP

discount percentage

quick add

size/pot selector when applicable

stock state

Interactions:

image zoom on hover

subtle lift

wishlist animation

add-to-cart micro animation

loading state

skeleton state

Avoid excessive shadows.

16. PRODUCT DETAIL PAGE

Route:

/product/:id


Use:

GET /products/{product_id}


Layout:

Left:

large image gallery

thumbnails

zoom

fullscreen viewer

video support if available

Right:

title

rating

review count

pricing

discount

size selector

pot selector

stock state

quantity

add to cart

buy now

wishlist

waitlist

Below:

product description

plant specifications

care instructions

care tips

what's included

warranty

delivery information

plant guarantee

Use product data:

plant_spec
care_instructions
care_tips
includes
warranty


17. PRODUCT SIZE / POT VARIANTS

Products may have:

sizes[]


Each size can have:

name

pot_size

pot_type

pot_color

height

price

mrp

discount_pct

stock

images

sku

Variant selection must dynamically change:

price

MRP

discount

stock

images

SKU

Do not assume a product has only one price.

18. SIMILAR PRODUCTS

Use:

GET /recommendations/similar/{product_id}


Display:

"Complete the Look"

"Similar Plants"

"Plants You May Like"

as appropriate.

19. CART

Cart should feel premium.

Backend user model includes a cart.

Create cart state that stays synchronized with backend/user session.

Cart page:

/cart


Features:

product image

product title

selected size

pot type

quantity

price

subtotal

remove

wishlist/move-to-wishlist if useful

coupon section

recommendations

shipping estimate

final total

Use:

GET /recommendations/cart


20. COUPONS

Use:

GET /coupons/active
POST /coupons/applicable
POST /coupons/validate


Coupon UX should feel similar to modern major ecommerce platforms.

Display:

available coupons

unlocked coupons

locked coupons

required additional amount

discount amount

expiry

minimum order

max discount

free shipping

When applicable coupon endpoint provides:

best_code
computed discount
needed_more


show the best available option clearly.

21. COMBOS

Use:

GET /combos


Create a premium:

Combo Deals

Bundle Offers

Value Packs

experience.

Show:

combo name

description

products included

quantity

price

validity

active state

22. WISHLIST

Use:

GET /wishlist
GET /wishlist/ids
POST /wishlist/{product_id}
DELETE /wishlist/{product_id}


Create:

/wishlist


Features:

beautiful empty state

grid

quick add

remove

login prompt if necessary

Wishlist icon should update instantly optimistically where safe.

23. AUTHENTICATION

Authentication is already available from backend.

Do NOT invent another auth system.

Supported endpoints:

POST /auth/otp/request
POST /auth/otp/verify
POST /auth/register
POST /auth/login
POST /auth/google
POST /auth/firebase
POST /auth/facebook
GET /auth/me
PATCH /auth/me


24. SIGNUP FLOW

Create a beautiful multi-step signup.

Step 1:

Email input.

Call:

POST /auth/otp/request


Step 2:

6-digit OTP input.

Call:

POST /auth/otp/verify


Save returned signup token only for the signup flow.

Step 3:

Collect:

name

phone

password

Call:

POST /auth/register


After registration:

save access token securely in frontend storage

save user state

redirect appropriately

Create polished OTP UX:

auto focus

paste support

resend timer

validation

error handling

success state

25. LOGIN

Login page must support:

Email + password

Google

Firebase-based Google sign-in where configured

Facebook where configured

Email login:

POST /auth/login


Google:

POST /auth/google


Firebase:

POST /auth/firebase


Facebook:

POST /auth/facebook


Do not display social providers that have not been configured.

26. USER ACCOUNT

Route:

/account


Create a premium account dashboard.

Sections:

Overview

My Orders

Wishlist

Profile

Addresses

Account settings

Use:

GET /auth/me
PATCH /auth/me
GET /orders
GET /wishlist


27. PROFILE

Allow editing:

name

phone

avatar

addresses

Avatar upload:

POST /upload/user-image


Then update profile using:

PATCH /auth/me


Do proper loading states.

28. ADDRESS MANAGEMENT

Address structure:

tag
name
house
area
city
state
pincode
phone
lat
lng


Use:

GET /settings/geocode


for address search where appropriate.

Create:

address cards

default address

edit address

delete address

select address during checkout

29. CHECKOUT

Route:

/checkout


Make checkout extremely polished and trustworthy.

Steps:

Address

Delivery information

Order summary

Coupon

Payment

Confirmation

Checkout must use:

POST /orders/quote


before final order creation.

Do not calculate final delivery/tax/total independently when backend provides the quote.

30. ORDER QUOTE

Request:

{
  "items": [],
  "address": {},
  "payment_method": "online",
  "coupon_code": "",
  "is_gift": false,
  "gift_note": ""
}


Use response from backend as source of truth for:

subtotal

discount

delivery

tax

total

31. RAZORPAY PAYMENT

Backend already provides Razorpay integration.

Order creation:

POST /orders


For online payment:

create backend order

read Razorpay order information from response

open Razorpay Checkout

complete payment

collect:

razorpay_order_id

razorpay_payment_id

razorpay_signature

order_id

call:

POST /orders/verify


Never trust the frontend payment success state alone.

Use backend verification as final confirmation.

Do not implement fake payment success.

32. COD

Support COD when backend permits it.

The backend is the authority regarding whether COD is available.

Do not hardcode COD availability.

User-specific COD restrictions may exist through backend.

33. ORDER CONFIRMATION

After successful order:

Create beautiful order success page.

Display:

order number

payment status

delivery address

ordered items

total

estimated delivery information

CTA to view order

continue shopping

34. ORDERS PAGE

Route:

/account/orders


Use:

GET /orders


Display:

order list

status

date

amount

item count

payment state

Order details:

GET /orders/{order_id}


Use an elegant timeline:

Placed
Confirmed
Processing
Packed
Shipped
Out for Delivery
Delivered


Use the actual backend status.

Do not fabricate statuses.

35. TRACKING

If backend provides:

tracking_id
tracking_url


display them.

If tracking URL exists:

"Track Shipment"

button opens the URL safely.

36. INVOICE

Allow customer to download:

GET /orders/{order_id}/invoice


Build a polished invoice download interaction.

37. REVIEWS

Product reviews:

GET /reviews
GET /reviews/summary
GET /reviews/can-review
POST /reviews
POST /reviews/{review_id}/vote


Create:

rating summary

star distribution

review list

photo reviews

helpful voting

verified buyer indication if backend supplies it

review submission UI

Review image upload:

POST /upload/review-image


Support multiple review images.

38. REVIEW EXPERIENCE

On product page:

Show:

average rating

total reviews

rating histogram

customer photos

review highlights

filters by rating

Allow user to submit a review only when:

GET /reviews/can-review


allows it.

39. GOOGLE REVIEWS

Use:

GET /google-reviews
GET /google-reviews/summary


Homepage can contain an elegant social-proof section.

Do not present Google reviews as internal product reviews.

Clearly label them as Google reviews.

40. WAITLIST

Use:

POST /waitlist


for out-of-stock products.

Product page should show:

"Notify Me When Available"

instead of Add to Cart when the selected variant is unavailable.

41. BLOG

Routes:

/blog
/blog/:slug


Use:

GET /blog/posts
GET /blog/posts/{key}
GET /blog/{key}


Create premium editorial design.

Blog listing:

large featured article

article grid

category/tag

author

date

excerpt

Blog detail:

title

hero image

author

date

rich content

related posts

42. AI PLANT ASSISTANT / CHAT

Backend provides:

GET /chat/suggestions
POST /chat


Create a premium floating assistant.

Position:

bottom-right desktop

bottom area/mobile-friendly floating button

Features:

quick suggestions

plant-care questions

order-aware conversation

order_id support

message history during session

typing animation

polished chat interface

error recovery

The design should feel like a premium botanical assistant.

Do not build fake AI responses.

All real responses must come from:

POST /chat


43. RECOMMENDATION SYSTEM

Use:

GET /recommendations/home
GET /recommendations/similar/{product_id}
GET /recommendations/cart


Create intelligent merchandising sections.

Examples:

Recommended for You

You May Also Like

Similar Plants

Complete Your Plant Setup

Frequently Added Together

Only render sections when useful data exists.

Avoid duplicate product rails everywhere.

44. SETTINGS

Use:

GET /settings


The backend settings should control:

currency

tax

shop information

delivery

support

WhatsApp

socials

plant guarantee

announcements

Do not hardcode these values.

Especially do not hardcode:

₹499 free shipping

tax

delivery fees

guarantee duration

Render them from backend settings.

45. PLANT GUARANTEE

Where enabled in settings:

Display:

guarantee badge

duration

description

Example:

"30-Day Plant Guarantee"

But the frontend should render the backend value dynamically.

46. FOOTER

Create an extremely polished footer.

Columns:

Shop

Plants

Pots

Plant Care

Seeds

Combos

Offers

Help

Contact

Shipping

Returns

Plant Guarantee

FAQ

Company

About

Blog

Privacy

Terms

Social

Instagram

Facebook

WhatsApp

Use backend settings for social/contact information wherever available.

47. RESPONSIVE DESIGN

Must work beautifully on:

1440px

1280px

1024px

768px

480px

390px

375px

Mobile experience must NOT simply be a smaller desktop.

Create mobile-specific:

navigation

filter drawer

search modal

sticky add-to-cart

checkout layout

product gallery

account navigation

48. MOBILE PRODUCT PAGE

On mobile:

image gallery first

title

rating

price

variants

stock

delivery

sticky bottom purchase bar

Sticky bar:

Wishlist | Add to Cart | Buy Now


Do not hide important product information.

49. ANIMATIONS

Use Framer Motion carefully.

Animations should include:

page transitions

fade-up sections

product hover

image transitions

cart drawer

wishlist heart animation

button feedback

modal transitions

filter drawer

skeleton transitions

success animation

checkout confirmation

Animation principle:

Elegant > flashy.

No excessive motion.

Respect:

prefers-reduced-motion


50. MICRO INTERACTIONS

Create premium micro-interactions:

cart badge pulse after adding item

heart animation

image zoom

quick add

quantity increment animation

coupon applied state

payment success state

copy coupon interaction

toast feedback

hover states

51. LOADING STATES

Every API-dependent area must have a proper loading state.

Do not show blank white screens.

Create reusable:

ProductCardSkeleton

ProductGridSkeleton

HeroSkeleton

CategorySkeleton

ReviewSkeleton

OrderSkeleton

AccountSkeleton

Use skeleton shimmer subtly.

52. ERROR STATES

Create reusable error UI.

Examples:

Something went wrong.
Please try again.


Provide:

"Retry"

button.

For network failures:

"Unable to connect to the nursery service."

Never expose raw backend stack traces to users.

53. EMPTY STATES

Create premium empty states for:

empty cart

empty wishlist

no search result

no orders

no reviews

no recommendations

no blog posts

Each should contain a clear CTA.

54. ACCESSIBILITY

Implement:

semantic HTML

keyboard navigation

visible focus states

aria-labels

accessible dialogs

accessible forms

proper contrast

alt text

screen-reader-friendly buttons

Do not rely solely on color to communicate status.

55. SEO

Implement frontend SEO.

Each important route should have:

title

meta description

canonical URL

Open Graph metadata

Twitter/X metadata

Product pages:

Dynamic title:

<Product Name> | Plant Nursery


Category:

<Category Name> | Plant Nursery


Blog:

Dynamic title from post.

Use semantic headings.

56. PERFORMANCE

The site should feel extremely fast.

Implement:

lazy loading

route-level code splitting

image lazy loading

responsive images

pagination

query caching

request deduplication

debounced search

skeleton UI

optimized animations

minimal bundle size

Do not fetch everything from backend on every render.

Use React Query cache intelligently.

57. IMAGE HANDLING

Product images come from backend.

Do not replace backend images with placeholders unless the backend actually has no image.

Use:

object-fit cover/contain depending on product

graceful image fallback

progressive loading

lazy loading

Product imagery should be visually consistent.

58. SECURITY

Never expose:

backend admin credentials

private API secrets

Razorpay secret key

Firebase private credentials

server secrets

Only frontend-safe public keys may exist in Vite env variables.

Never store passwords.

Never log authentication tokens.

59. TOKEN MANAGEMENT

Store the backend access token consistently.

Create a central auth system:

AuthProvider
useAuth()


Auth state should contain:

token
user
isAuthenticated
loading


On app initialization:

If token exists:

GET /auth/me


Restore session.

If token is invalid:

clear token

clear user

redirect to login only where necessary

Do not unexpectedly redirect anonymous visitors away from public pages.

60. ROUTING

Create routes similar to:

/
 
/plants
/search
/category/:slug
/product/:id

/combos
/offers

/cart
/checkout

/login
/signup
/verify-otp

/wishlist

/account
/account/profile
/account/orders
/account/orders/:id
/account/addresses

/blog
/blog/:slug

/about
/contact


Routes can be adjusted based on actual navigation needs.

Use protected routes only for authenticated pages.

61. API SERVICE ARCHITECTURE

Do not call Axios directly everywhere.

Create services:

src/api/
  auth.ts
  products.ts
  categories.ts
  brands.ts
  banners.ts
  home.ts
  search.ts
  cart.ts
  wishlist.ts
  orders.ts
  payments.ts
  coupons.ts
  reviews.ts
  recommendations.ts
  blog.ts
  settings.ts
  media.ts
  waitlist.ts
  chat.ts


Components should call typed services/hooks.

62. REACT QUERY ARCHITECTURE

Use query keys such as:

products
product
categories
category
home
recommendations
wishlist
orders
order
reviews
reviews-summary
blog
settings
coupons
google-reviews


Use mutations for:

wishlist

reviews

orders

profile

coupon

waitlist

Invalidate relevant queries after mutations.

63. COMPONENT ARCHITECTURE

Use reusable components.

Suggested:

src/components/
  layout/
    Header
    Footer
    MobileNav
    AnnouncementBar

  home/
    Hero
    CategoryRail
    ProductRail
    EditorialSection
    ReviewSection
    GuaranteeSection

  product/
    ProductCard
    ProductGallery
    ProductInfo
    VariantSelector
    ProductReviews
    CareGuide

  commerce/
    CartDrawer
    CartItem
    CouponBox
    PriceSummary
    CheckoutForm
    AddressSelector

  search/
    SearchOverlay
    SearchSuggestions
    SearchFilters

  ui/
    Button
    Modal
    Drawer
    Skeleton
    Badge
    Tabs
    Rating
    QuantitySelector
    Toast


Keep components small and composable.

64. STATE MANAGEMENT

Use React Query for server data.

Use Context/Zustand only for genuine client state such as:

authentication state

UI drawer state

cart UI state if necessary

recently viewed products

search UI

Do not duplicate the entire backend database into global state.

65. URL STATE

Filters, sort order and search should be reflected in URL query parameters.

Examples:

?sort=price_low
?min_price=499
?max_price=1999
?plant_type=Succulent
?pet_safe=true


Browser back/forward must preserve the browsing state.

66. PRODUCT FILTER DESIGN

Desktop filter sidebar should include backend-supported product fields.

Possible filters:

Plant Type

Sunlight

Difficulty

Pet Safe

Air Purifying

Flowering

Bestseller

New Arrival

Featured

Price

Brand

Category

Availability

Only show filters that make sense for the current catalogue.

67. SORT OPTIONS

Support backend sort_by.

Create polished dropdown:

Recommended

Newest

Price: Low to High

Price: High to Low

Popular

Best Rated

Map these values correctly to backend-supported sort behavior.

Do not invent unsupported values if backend rejects them.

68. PRODUCT DATA MODEL

Use the backend product shape exactly.

Important fields include:

title
description
short_description
tags
brand
category_id
sku
shipping_weight
mrp
price
discount_pct
discount_on
cgst
sgst
igst
images
sizes
plant_spec
care_instructions
care_tips
includes
warranty
stock
low_stock_threshold
rating
review_count
sold_count
is_active
is_featured
is_bestseller
is_new_arrival


Do not rename API fields without a proper mapping layer.

69. ERROR 422 HANDLING

Backend uses validation responses such as:

{
  "detail": [
    {
      "loc": [],
      "msg": "",
      "type": ""
    }
  ]
}


Create a utility that converts these into human-readable frontend errors.

Never display raw JSON.

70. UX RULE

Every button must actually work.

Do not create buttons that only show visual feedback.

Examples:

Add to Cart must work

Buy Now must work

Wishlist must work

Apply Coupon must work

Checkout must work

Search must work

Login must work

Signup must work

OTP must work

Reviews must work

Waitlist must work

Use actual endpoints.

71. NO FAKE CONTENT

Do not fill the application with fake products.

If API returns no data, show a proper empty state.

Do not manufacture ratings, reviews, prices or stock.

Do not hardcode fake orders.

Do not hardcode fake customer information.

72. ADMIN / BACKEND BOUNDARY

This project is NOT the admin panel.

Do not build:

product management dashboard

order management dashboard

coupon management

banner management

category management

review moderation

admin user management

The admin panel already exists.

Build the CUSTOMER-FACING STOREFRONT only.

Public/customer frontend can consume APIs that already exist.

73. UPLOAD ENDPOINTS

Frontend upload functionality must use multipart/form-data.

Product/admin upload APIs are backend/admin concerns.

Customer-facing uploads:

POST /upload/user-image
POST /upload/review-image


Do not send uploaded files as JSON.

74. CART AND ORDER SOURCE OF TRUTH

Do not assume client-side pricing is authoritative.

The backend is always authoritative for:

product price

discounts

tax

delivery

coupon

inventory

order total

payment

COD eligibility

Frontend may calculate temporary UI previews, but final values must come from backend.

75. RESPONSIVE PRODUCT EXPERIENCE

Desktop:

4 products per row


depending on viewport.

Tablet:

3 products per row


Mobile:

2 products per row


Use responsive CSS, not hardcoded widths.

Product cards must maintain consistent visual height.

76. PREMIUM INTERACTION DETAILS

Add subtle details:

smooth hover transitions

sticky filters

elegant dropdowns

animated cart drawer

animated wishlist

image crossfade

smooth accordion

sticky checkout summary

sticky mobile purchase bar

smooth scroll

section reveal animation

Keep animations under control.

77. PWA-READY STRUCTURE

Structure the frontend so it can later become a PWA.

Prepare:

app icons

manifest structure

responsive layout

mobile navigation

installable architecture

Do not add unnecessary complexity unless supported by the existing project setup.

78. DARK MODE

Do NOT make dark mode the default.

Primary experience should be white + green.

A dark mode can be architected later, but do not compromise the primary design to support it.

79. BRANDING

Use a placeholder brand configuration so the actual nursery name/logo can be changed easily.

Create:

src/config/brand.ts


with configurable:

brandName
logo
favicon
primaryColor
supportEmail
supportPhone


Do not scatter brand-specific values throughout components.

80. FINAL QUALITY BAR

The finished site must NOT look like:

a generic React template

a Tailwind starter

a Shopify clone

a dashboard

a basic ecommerce assignment

an AI-generated wireframe

a collection of cards

It should look like a real premium Indian D2C plant brand.

Target quality:

high-end ecommerce

strong visual hierarchy

excellent spacing

premium typography

botanical aesthetic

thoughtful micro-interactions

fast

responsive

conversion focused

production-ready

81. IMPORTANT IMPLEMENTATION RULE

Before writing components, inspect the API structure described in this prompt and create a clean API/service layer.

Do not start by hardcoding the homepage.

First establish:

API client

Type system

Auth system

React Query configuration

Routing

Shared UI system

Layout

Product services

Commerce services

Pages

Then build the final UI.

82. BUILD ORDER

Build in this order:

Phase 1

Project foundation

TypeScript

Vite

Tailwind

React Router

Axios

React Query

Framer Motion

shared UI

Phase 2

API and authentication

Axios client

API services

token handling

AuthProvider

login

signup

OTP

social auth

Phase 3

Global layout

announcement bar

header

search

footer

mobile navigation

Phase 4

Homepage

hero

dynamic sections

categories

recommendations

reviews

blog

guarantees

Phase 5

Catalogue

products

filters

sorting

pagination

search

Phase 6

Product detail

gallery

variants

wishlist

add to cart

waitlist

recommendations

reviews

Phase 7

Commerce

cart

coupon

checkout

quote

Razorpay

COD

order confirmation

Phase 8

Account

profile

addresses

wishlist

orders

invoice

Phase 9

Blog and support

blog

chat assistant

Google reviews

Phase 10

Final polish

responsive

accessibility

SEO

loading

error states

animations

performance

API edge cases

83. TESTING REQUIREMENT

Before considering the project complete, test the actual flows.

Test:

Anonymous user

homepage

category

search

product

cart

login prompt

blog

Registered user

login

signup

OTP

profile

wishlist

review

address

checkout

orders

Commerce

add to cart

variant selection

coupon

quote

Razorpay flow

payment verification

order success

Responsive

desktop

tablet

mobile

Errors

expired token

API unavailable

invalid coupon

empty search

out-of-stock

invalid OTP

422 validation error

failed payment

Fix all obvious UI and runtime errors.

84. FINAL DEVELOPMENT RULES

NEVER:

use Supabase

create fake API data as final content

create fake backend logic

hardcode product prices

hardcode inventory

hardcode shipping fees

hardcode tax

expose secrets

use any unnecessarily

create giant monolithic components

duplicate API requests

ignore mobile

ignore loading states

ignore error states

ALWAYS:

use the existing REST API

use TypeScript

create reusable components

use React Query

centralize Axios

centralize environment variables

handle API errors

use backend values as source of truth

make UI responsive

make interactions functional

maintain premium visual quality

keep code maintainable

85. API ENDPOINT REFERENCE

Use these existing endpoints exactly where applicable.

Authentication

POST /auth/otp/request
POST /auth/otp/verify
POST /auth/register
POST /auth/login
POST /auth/google
POST /auth/firebase
POST /auth/facebook
GET  /auth/me
PATCH /auth/me


Products

GET    /products
POST   /products        // admin-only, frontend storefront should not use
GET    /products/{id}
PATCH  /products/{id}  // admin-only
DELETE /products/{id}  // admin-only
GET    /products/admin/low-stock // admin-only


Categories

GET /categories
GET /categories/tree


Brands

GET /brands


Home

GET /home-sections/resolved
GET /home-sections
GET /banners
GET /site-media
GET /site-media/sections


Recommendations

GET /recommendations/home
GET /recommendations/similar/{product_id}
GET /recommendations/cart


Search

GET /search
GET /search/trending


Wishlist

GET /wishlist
GET /wishlist/ids
POST /wishlist/{product_id}
DELETE /wishlist/{product_id}


Coupons

GET /coupons/active
POST /coupons/applicable
POST /coupons/validate


Combos

GET /combos


Orders

POST /orders/quote
POST /orders
POST /orders/verify
GET  /orders
GET  /orders/{order_id}
GET  /orders/{order_id}/invoice


Reviews

GET  /reviews
GET  /reviews/highlights
GET  /reviews/summary
GET  /reviews/can-review
POST /reviews
POST /reviews/{review_id}/vote


Google Reviews

GET /google-reviews
GET /google-reviews/summary


Blog

GET /blog/posts
GET /blog/posts/{key}
GET /blog/{key}


Settings

GET /settings
GET /settings/geocode


Waitlist

POST /waitlist


Chat

GET /chat/suggestions
POST /chat


Uploads

POST /upload/user-image
POST /upload/review-image


86. DELIVERY EXPECTATION

Generate the complete frontend, not a prototype.

The final result should include:

complete routing

complete responsive UI

complete API integration

complete auth

complete product catalogue

complete search

complete product page

complete wishlist

complete cart

complete checkout

complete Razorpay integration

complete orders

complete reviews

complete blog

complete chat

complete account section

polished loading/error/empty states

SEO

accessibility

performance optimization

Use the existing backend as the source of truth.

Build the frontend as if this is going into production for a premium real-world plant ecommerce company.

Most importantly:

MAKE IT LOOK EXPENSIVE.

The UI should feel premium the moment the homepage loads.

Do not stop at a functional implementation.

Iterate on spacing, typography, responsive behavior, product cards, header, hero, checkout, animations and micro-interactions until the entire experience feels cohesive and professionally designed.

Now build the complete frontend end-to-end.

bhai admin panel r backend kora ache so backend er songe connect rekhe korbi bujhli
swagger link : https://nursery-backend-c8yw.onrender.com/docs
er bhai erm website ta hobe puro same to same : https://www.ugaoo.com/collections/plants

dorkar porle design ta website er moto clone o korte paris same to same bara

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bloom-boutique-fe.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4dcf539e-cc3c-4dc2-852b-7a1dc1df65e7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
