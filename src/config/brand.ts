export const brand = {
  brandName: "MyGarden",
  logo: null as string | null,
  favicon: "/favicon.ico",
  primaryColor: "#1F6B4F",
  supportEmail: "",
  supportPhone: "",
} as const;

/** The stored shop name was seeded before the rebrand, so treat the old value
 *  as unset until Store Settings is updated. */
const LEGACY_SHOP_NAME = "Plant Nursery";

export function displayName(shopName: string | undefined): string {
  const name = shopName?.trim();
  return !name || name === LEGACY_SHOP_NAME ? brand.brandName : name;
}
