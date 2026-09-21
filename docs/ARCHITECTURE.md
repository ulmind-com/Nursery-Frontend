# Architecture — Nursery Frontend

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 19 + TanStack Start (SSR) |
| **Language** | TypeScript 5.x |
| **Routing** | TanStack Router (file-based) |
| **Styling** | Tailwind CSS 4.x |
| **UI Components** | Radix UI primitives + shadcn/ui |
| **State** | React Context (Auth, Cart) + TanStack Query |
| **HTTP Client** | Axios |
| **Animations** | Motion (Framer Motion) |
| **Payments** | Razorpay Web SDK |
| **Auth** | Firebase Auth (Google Sign-In) + JWT |
| **Build** | Vite 8 + Nitro (SSR) |
| **Deployment** | Netlify |

## Directory Structure

```
src/
├── api/
│   └── services.ts          # All API service functions (centralized)
├── components/
│   ├── ai-elements/          # AI chat assistant components
│   ├── category/             # Category browsing components
│   ├── commerce/             # Cart, checkout, payment components
│   ├── home/                 # Homepage sections, banners
│   ├── layout/               # Header, footer, navigation
│   ├── product/              # Product cards, detail views
│   ├── shared/               # Reusable shared components
│   └── ui/                   # shadcn/ui primitives (Button, Input, etc.)
├── config/
│   └── brand.ts              # Brand config constants
├── contexts/
│   ├── auth-context.tsx       # Auth state (user, token, login/logout)
│   └── cart-context.tsx       # Cart state (items, add/remove)
├── hooks/                    # Custom React hooks
├── lib/
│   ├── api.ts                # Axios instance + interceptors
│   ├── firebase.ts           # Firebase SDK init + Google provider
│   ├── razorpay.ts           # Razorpay checkout helper
│   ├── token.ts              # JWT token storage (localStorage)
│   └── utils.ts              # Utility functions
├── routes/                   # TanStack file-based routes (see below)
├── types/
│   └── api.ts                # TypeScript interfaces for API responses
├── router.tsx                # Router configuration
├── server.ts                 # SSR entry point
├── start.ts                  # TanStack Start entry
└── styles.css                # Global Tailwind styles
```

## Route Map

| Route | Page |
|---|---|
| `/` | Homepage (sections, banners, recommendations) |
| `/login` | Email/password + Google login |
| `/signup` | 3-step OTP signup + Google signup |
| `/products` | All products listing |
| `/product/:id` | Product detail (images, variants, reviews) |
| `/category/:slug` | Category filtered products |
| `/plants` | Plant catalogue |
| `/search` | Search results |
| `/cart` | Shopping cart |
| `/checkout` | Multi-step checkout |
| `/order-confirmation` | Post-purchase confirmation |
| `/wishlist` | Saved items |
| `/account` | Account dashboard |
| `/account/profile` | Edit profile |
| `/account/orders` | Order history |
| `/account/orders/:id` | Order detail + invoice |
| `/account/addresses` | Manage addresses |
| `/blog` | Blog listing |
| `/blog/:slug` | Blog article |
| `/combos` | Combo deals |
| `/offers` | Active offers |
| `/about`, `/contact`, `/support` | Info pages |
| `/shipping`, `/returns`, `/privacy`, `/terms` | Policy pages |

## Data Flow

```
User Action → React Component → API Service (services.ts)
                                     ↓
                              Axios (lib/api.ts)
                                     ↓
                           Backend API (Render)
                                     ↓
                              MongoDB Atlas
```

## Auth Flow

```
Email/Password:
  Signup: Email → OTP → Verify → Register → JWT
  Login: Email + Password → JWT

Google Sign-In:
  Click "Continue with Google"
    → Firebase signInWithPopup
    → Get Firebase ID token
    → POST /auth/firebase (backend verifies token)
    → Backend upserts user + returns JWT
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `VITE_API_BASE_URL` | Backend API URL |
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project ID |
| `VITE_FIREBASE_APP_ID` | Firebase app ID |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID (optional) |
