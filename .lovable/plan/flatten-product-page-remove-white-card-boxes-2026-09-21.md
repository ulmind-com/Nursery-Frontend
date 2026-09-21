# Flatten product page — remove white card boxes

## Goal
The product detail page currently shows stark white (#FFFFFF) raised card boxes floating on the warm cream page wash. The user dislikes this white-card look. The primary reference (Ugaoo) uses a **flat** treatment — no raised white cards, no shadows; every section blends into one warm off-white page background, separated only by spacing and subtle borders. Match that flat blend on the product detail page.

## Changes
- Keep the page background as the warm `storefront-wash` (no change to the wash itself).
- Remove the white `bg-card` fill, border, and `box-shadow` from the product-page section containers so they no longer read as floating white boxes:
  - Left **Gallery** container (`surface-card` → flat; keep rounded image crop only).
  - Right **purchase card** (`surface-card bg-card` → flat; keep content, no card fill/shadow).
  - Lower **Description / Care Instruction / Shipping estimator** cards (`surface-card bg-card` → flat).
  - Lower **facts + Product Description** card (`surface-card bg-card` → flat).
- Replace card separation with the flat Ugaoo style: rely on whitespace/gaps between sections and, where a visual divider is needed, a single thin `border-border` line (e.g. the facts grid already uses `border-y`).
- Keep the image thumbnail rail and main image rounded crop; only the outer container's white fill/shadow is removed.
- Keep all existing compact sizing, typography, and responsive behavior from the last pass unchanged — only the background/card treatment changes.
- Do not change the page background color, header, footer, or any other route.

## Dynamic behavior (unchanged)
- Live products keep backend variants, prices, MRP, stock, SKU, coupons, delivery, guarantee, support.
- Preview products stay non-purchasable.
- Facts grid, accordions, shipping estimator, and all data mapping remain identical.

## Validation
- Check `/product/preview-plants-0` at desktop (1280), tablet (768), and mobile (375).
- Confirm sections blend into the warm page background with no stark white boxes or heavy shadows.
- Confirm no layout overflow, no missing content, and no browser console errors.
