# Match the homepage header, hero, and categories to the reference

## Goal
Rework only the homepage’s top area so it closely matches the supplied screenshot’s composition, sizing, spacing, and responsive behaviour, while keeping the existing nursery brand, live API data, and all current functionality.

## Header and navigation
- Rebuild the desktop header into the same three-tier structure: slim dark-green offer strip, white logo/search/actions row, then a centered category navigation row.
- Make the search field the dominant middle element, with compact account, wishlist, and cart controls on the right.
- Populate navigation labels from the live category API where available, with the existing storefront links retained as safe fallbacks.
- Keep the header sticky and reproduce the screenshot’s restrained borders, compact typography, and white/green visual balance.
- Preserve the existing mobile drawer and bottom navigation, but tune their spacing and proportions to feel consistent with the desktop design.

## Hero banner
- Replace the current full-height hero with a wide, shallow, rounded banner inside a constrained page container, matching the screenshot’s first-viewport proportions.
- Continue using live banner image/video, title, subtitle, offer code, and CTA fields when supplied.
- Generate one original premium botanical fallback banner with a bright indoor setting and grouped plants; it will match the reference’s visual weight without copying its person, logo, text, or proprietary artwork.
- Keep autoplay and carousel dots for multiple live banners, with restrained transitions and reduced-motion support.

## Category rail
- Move categories directly beneath the banner on the same soft-tinted background.
- Render a single horizontal row of large circular category visuals with centered labels, subtle active/hover outlines, and horizontal scrolling on narrower screens.
- Use category images/icons returned by the API. Empty categories remain omitted rather than inventing catalogue data.
- Match the screenshot’s dense spacing so the next product/filter area is visible within the first desktop viewport.

## Styling and boundaries
- Preserve the approved blended green palette and Plus Jakarta Sans/Inter typography.
- Add only semantic design tokens needed for the soft pink-green page tint, header surfaces, and subtle outlines.
- Do not embed the screenshot itself or copy Ugaoo branding, text, celebrity imagery, or proprietary illustrations.
- Leave product cards, checkout, account, backend integration, and business logic unchanged in this pass.

## Verification
- Compare the rebuilt top area against the reference at desktop width, then verify clean adaptations at 768px and 375px.
- Confirm no horizontal overflow, clipped labels, overlapping controls, console errors, or broken search/navigation/cart interactions.
- Confirm live API banners and categories still take precedence over fallback visuals.
