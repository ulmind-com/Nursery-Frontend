# Premium Plant Nursery Storefront

## Goal
Build the complete customer-facing plant nursery storefront against the existing REST API at `https://nursery-backend-c8yw.onrender.com`, with a refined white-and-botanical-green identity inspired by Ugaoo’s commerce hierarchy while remaining original in branding, copy, imagery, and composition.

The nursery name, logo, favicon, and support details will live in one brand configuration with an editable placeholder until final brand assets are supplied.

## Confirmed architecture decisions
- Keep the project’s existing React 19, Vite, TypeScript, Tailwind CSS 4, TanStack Start, TanStack Router, and TanStack Query foundation. TanStack Router replaces the requested React Router because it is the project’s fixed, type-safe routing system.
- Add Axios and Motion for React, and use the existing React Hook Form, Zod, Lucide, Sonner, Radix/shadcn controls, carousel, OTP, drawer, and skeleton components.
- Use only the external REST API; no new backend, database, Supabase, fake products, or fabricated commerce data.
- Keep the cart in browser-persisted client state. Revalidate products and pricing through `/orders/quote`, then submit `{ items, address, payment_method, coupon_code, is_gift, gift_note }` to `/orders`.
- Save signed-in users’ cart and address arrays through `PATCH /auth/me` only when useful and compatible; Swagger exposes no dedicated cart/address CRUD routes.
- Treat backend quote, order creation, payment verification, availability, settings, and API responses as authoritative.

## 1. Foundation and API layer
- Create semantic design tokens for the supplied premium green/neutral palette, refined typography, focus states, restrained shadows, spacing, and reduced-motion behavior.
- Add centralized environment validation and brand configuration. The public API URL and public provider keys will be environment-driven and never scattered through components.
- Create a typed Axios client with bearer-token attachment, safe 401 handling, network/error normalization, and readable handling for 403/404/422/429/500 responses.
- Model the documented API entities, request bodies, pagination, errors, authentication, checkout, product variants, content sections, and settings. Preserve backend field names or map them explicitly at the service boundary.
- Build small typed service modules and query-key factories for auth, products, categories, brands, home, banners, media, search, cart orchestration, wishlist, orders, coupons, reviews, recommendations, blog, settings, waitlist, uploads, and chat.
- Configure sensible query stale times, retries, request deduplication, invalidation, and cancellation.

## 2. Authentication and client state
- Implement an `AuthProvider` that restores a stored bearer token through `GET /auth/me`, clears invalid sessions, and protects only private account/checkout routes.
- Build email/password login, three-step email → OTP → profile registration, resend timing, paste-friendly OTP entry, and configured social-provider buttons.
- Integrate Google/Firebase/Facebook only when their public configuration is present; hide unavailable providers.
- Build focused client stores/providers for browser cart, recent searches, and drawer/modal state without duplicating server data.
- Persist anonymous cart data locally, merge safely after login where possible, and never store passwords or log tokens.

## 3. Shared premium storefront shell
- Build a backend-driven announcement bar, compact sticky desktop/mobile header, dynamic category navigation, search overlay, account/wishlist/cart controls, mobile drawer, cart drawer, and settings-driven footer.
- Use a restrained editorial aesthetic: large botanical imagery from the API, generous whitespace, Manrope-style modern typography, subtle borders, crisp controls, and green only as an accent.
- Implement responsive behavior intentionally for 375, 390, 480, 768, 1024, 1280, and 1440 widths.
- Add reusable buttons, fields, badges, ratings, quantity controls, media, dialogs/drawers, price display, empty/error states, and all requested skeleton families.

## 4. Homepage and dynamic merchandising
- Render `/home-sections/resolved` through reusable layout renderers for hero, rail, grid, featured, editorial, split, banner, and collection sections.
- Integrate banners, site media, categories, brands, home recommendations, review highlights, Google reviews/summary, blog posts, settings, guarantees, and social/contact content.
- Support responsive image/video heroes, muted lazy video with poster fallback and visibility-aware playback, cinematic but restrained transitions, and omission of empty API sections.

## 5. Catalogue, search, and product discovery
- Build `/plants`, `/products`, and category routes from the same collection experience.
- Keep filters, sorting, search, and pagination in validated URL search parameters so links and browser history preserve state.
- Implement the supported plant attributes, sticky desktop sidebar, active-filter chips, mobile filter drawer, backend-safe sorting values, loading skeletons, and no-results recovery.
- Build debounced global autocomplete with recent/trending searches, keyboard navigation, category/product suggestions, stale-request cancellation, and a dedicated `/search` page.
- Build polished responsive product cards with backend imagery, hover image swap, badges, ratings, variant-aware pricing/stock, optimistic wishlist behavior, and functional quick add.

## 6. Product detail and reviews
- Build `/product/$id` with responsive gallery, thumbnails, video, zoom/fullscreen viewing, variant-driven image/price/MRP/discount/SKU/stock updates, quantity, wishlist, add-to-cart, buy-now, and waitlist flows.
- Add care/specification/included/warranty/delivery/guarantee sections using API data only.
- Add similar-product merchandising and omit empty or duplicate rails.
- Build review summary, rating histogram, filters, verified-buyer presentation when supplied, customer media, helpful voting, eligibility checks, multipart review uploads, and review submission.
- Add the mobile sticky purchase bar without obscuring content.

## 7. Cart, coupons, checkout, and payments
- Build `/cart` with browser-persisted items, backend product refresh, variant details, quantities, removal, wishlist transfer, coupon discovery, cart recommendations, and settings-driven totals messaging.
- Build the checkout flow for address, delivery, order summary, coupon, payment, and confirmation. Validate complete addresses in the UI because Swagger does not mark their fields required.
- Call `/orders/quote` whenever checkout inputs affecting totals change; display only quote-derived subtotal, discount, delivery, tax, total, and COD availability when returned.
- Create orders through `/orders`. For online payment, open Razorpay using the public key and backend-created order data, then require `/orders/verify` before showing success.
- Support COD only when the backend response permits it. Provide explicit failed/cancelled/payment-pending recovery states with no fake success path.

## 8. Account, wishlist, and orders
- Build account overview, profile editing, multipart avatar upload, browser-backed and profile-compatible address management, wishlist, and responsive account navigation.
- Build order list/detail pages from `/orders`, actual-status timelines, tracking links, invoice download, loading/error/empty states, and safe handling of unknown backend statuses.
- Use optimistic wishlist mutations with rollback and query invalidation.

## 9. Blog, support pages, and botanical assistant
- Build editorial `/blog` and `/blog/$slug` pages from the API, including featured content, metadata, rich article rendering, and related posts when data permits.
- Build original About and Contact pages using backend shop/support/settings data rather than invented contact details.
- Build the floating plant assistant from AI Elements conversation/message/prompt primitives after checking their current component contract. Load backend suggestions and send every real answer through `POST /chat`; keep only session history locally and support optional `order_id`.

## 10. SEO, accessibility, resilience, and performance
- Give every content route unique title, description, canonical URL, Open Graph metadata, Twitter card metadata, semantic headings, and dynamic product/category/blog metadata.
- Add lazy route/page loading where compatible, responsive/lazy images, progressive fallbacks, pagination, cached queries, debounced inputs, and minimal motion respecting `prefers-reduced-motion`.
- Ensure keyboard-operable menus, search, filters, galleries, dialogs, OTP, forms, and chat; visible focus, labels, announcements, alt text, and non-color status cues.
- Add graceful global and section-level network/error/empty states without exposing raw server errors.
- Add a manifest-ready structure and app icon references without introducing service-worker complexity.

## Validation
- Verify the actual live API shapes while implementing and adapt typed mappers where Swagger responses are underspecified.
- Run lint, type checks/build validation, and focused tests for URL filters, 422 formatting, auth restoration, cart calculations display, variant selection, and payment-state handling.
- Exercise anonymous and signed-in journeys in the live preview: home, navigation, search, catalogue, product, cart, signup/login/OTP, wishlist, profile/address, coupon/quote, order creation, payment verification, orders/invoice, reviews, blog, chat, empty states, expired tokens, unavailable API, invalid inputs, out-of-stock, and failed payment.
- Inspect desktop, tablet, and mobile screenshots and interactions, then correct overflow, overlap, tap-target, sticky-control, and content-shift issues before completion.

## Known integration boundaries
- The live API exposes no dedicated cart or address CRUD endpoints. The agreed production behavior is a local browser cart feeding `/orders/quote` and `/orders`; authenticated profile arrays may be synchronized through `/auth/me` where compatible.
- Swagger exposes conceptual values such as payment method and order status as unrestricted strings. The UI will display backend values safely and will not invent unsupported enums.
- Social login and Razorpay controls remain configuration-gated until their public environment values and successful backend responses are available.
