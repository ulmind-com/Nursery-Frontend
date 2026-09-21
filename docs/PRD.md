# Product Requirements Document — Nursery Frontend

## Overview
A premium customer-facing plant e-commerce storefront built with TypeScript, React 19, TanStack Start, and Tailwind CSS. Users can browse plants, filter by categories, shop by size/pot type, manage wishlists, place orders with Razorpay payments, and get AI-powered plant recommendations.

## Target Users
- **Customers**: Plant enthusiasts looking to browse and purchase indoor/outdoor plants, garden essentials, and combos online.
- **Visitors**: Casual browsers exploring plant care tips via the blog and AI plant assistant.

## Core Features

### 🛒 Shopping Experience
- Browse products by category, search, and filter
- Product detail pages with size variants, images, reviews
- Wishlist to save favorite plants
- Cart with quantity management
- Combo deals and offers

### 🔐 Authentication
- Email/Password signup with OTP verification (3-step flow)
- Google Sign-In via Firebase Authentication
- JWT-based session management
- Profile and address management

### 💳 Checkout & Payments
- Multi-step checkout (address → payment)
- Razorpay payment gateway integration
- Order quotes with delivery/discount calculations
- Coupon code support
- Order confirmation and tracking

### 👤 Account Management
- Order history with detail view
- Invoice download
- Profile editing
- Multiple saved addresses
- Wishlist management

### 📝 Content
- Blog with articles
- About, Contact, Support pages
- Shipping, Returns, Privacy, Terms pages
- AI-powered plant care chat assistant

### 🔍 Discovery
- Full-text product search with trending terms
- Category tree navigation
- AI-powered product recommendations (similar items, cart-based)
- Homepage with curated sections, banners, and site media
- Google Reviews integration

## Non-Functional Requirements
- Mobile-first responsive design
- SEO optimized with proper meta tags
- SSR via TanStack Start + Nitro
- Deployed on Netlify
- Backend API: FastAPI on Render (`https://nursery-backend-c8yw.onrender.com`)
