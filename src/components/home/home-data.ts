/* Everything a home band might need, loaded once by the route and shared with
   every section so twenty bands don't fire twenty copies of the same query. */

import type {
  Banner,
  BlogPost,
  Combo,
  Category,
  GardenServiceSection,
  GiftingSection,
  GoogleReview,
  PageSection,
  PressLogo,
  PressSection,
  Product,
  Settings,
  StoreLocation,
} from "@/types/api";

export interface HomeRail {
  key: string;
  title: string;
  eyebrow?: string;
  featured: boolean;
  products: Product[];
}

export interface HomeData {
  banners: Banner[];
  shopName: string;
  categories: Category[] | undefined;
  categoryTree: Category[] | undefined;
  settings: Settings | undefined;
  products: Product[];
  /* Products flagged `is_bestseller`, fetched separately so the Bestsellers
     band is not limited to whatever the storefront grid happened to load. */
  bestsellers: Product[];
  /* Products the catalogue marks as easy to care for. */
  lowEffort: Product[];
  combos: Combo[];
  rails: HomeRail[];
  reviews: GoogleReview[];
  blogPosts: BlogPost[];
  stores: StoreLocation[] | undefined;
  gardenServices: GardenServiceSection | undefined;
  gifting: GiftingSection | undefined;
  press: { section: PressSection | undefined; items: PressLogo[] };
}

/* The layout the site ships with. The API seeds exactly this, so it is only
   reached while `/page-sections` is unavailable — an older backend, or the
   very first paint before the query resolves. */
export const FALLBACK_HOME_SECTIONS: PageSection[] = [
  "hero",
  "category_strip",
  "trust_strip",
  "bestsellers",
  "video_reel",
  "spotlight",
  "low_effort",
  "bhidu",
  "offers",
  "combos",
  "self_watering",
  "planters",
  "product_grid",
  "shop_by_space",
  "trust_bar",
  "product_rails",
  "google_reviews",
  "blog",
  "farm_to_home",
  "comparison",
  "grow_banner",
  "store_locator",
  "garden_services",
  "gifting",
  "press",
].map((type, order) => ({ id: `fallback-${type}`, type, order, active: true, items: [] }));
