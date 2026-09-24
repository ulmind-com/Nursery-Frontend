import type { Category } from "@/types/api";

/* Parent categories that exist only to drive a home-page section — they are
   not part of the shop navigation. Keep in sync with shop-by-space.tsx. */
const SECTION_ONLY_SLUGS = ["shop-by-space", "shop-by-spaces", "spaces", "transform-your-home"];

/* Categories fit for the header nav and the "Our Categories" row: top-level
   only, minus the section-only trees (Shop by Space and its rooms). */
export function navCategories(categories: Category[] | undefined): Category[] {
  const sectionParentIds = new Set(
    (categories ?? [])
      .filter((cat) => SECTION_ONLY_SLUGS.includes((cat.slug || "").toLowerCase()))
      .map((cat) => cat.id),
  );
  return (categories ?? []).filter(
    (cat) => !cat.parent_id && !sectionParentIds.has(cat.id),
  );
}
