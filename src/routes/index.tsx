import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  blogApi,
  categoriesApi,
  gardenServicesApi,
  giftingApi,
  homeApi,
  miscApi,
  pageSectionsApi,
  pressApi,
  productsApi,
  queryKeys,
  settingsApi,
  storesApi,
} from "@/api/services";
import { SectionRenderer } from "@/components/home/section-renderer";
import { FALLBACK_HOME_SECTIONS, type HomeData, type HomeRail } from "@/components/home/home-data";
import { displayName } from "@/config/brand";
import type { GoogleReview, Product } from "@/types/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Premium Plants Online | MyGarden" },
      { name: "description", content: "Shop healthy indoor and outdoor plants, planters, and care essentials from a trusted Indian nursery." },
      { property: "og:title", content: "Premium Plants Online | MyGarden" },
      { property: "og:description", content: "Thoughtfully grown plants and garden essentials, delivered with care." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://mygarden.ulmind.store/og-image.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://mygarden.ulmind.store/og-image.png" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  /* The band list decides what renders and in what order; everything below it
     is the content those bands draw on, fetched once and shared. */
  const pageSections = useQuery({ queryKey: queryKeys.pageSections("home"), queryFn: () => pageSectionsApi.list("home") });

  const sections = useQuery({ queryKey: queryKeys.home, queryFn: homeApi.sections });
  const banners = useQuery({ queryKey: ["banners"], queryFn: homeApi.banners });
  const categories = useQuery({ queryKey: queryKeys.categories, queryFn: categoriesApi.list });
  const categoryTree = useQuery({ queryKey: queryKeys.categoryTree, queryFn: categoriesApi.tree });
  const settings = useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get });
  const recommendations = useQuery({ queryKey: ["recommendations", "home"], queryFn: homeApi.recommendations });
  const storefrontProducts = useQuery({ queryKey: queryKeys.products({ limit: 12 }), queryFn: () => productsApi.list({ limit: 12 }) });
  const googleReviews = useQuery({ queryKey: ["google-reviews"], queryFn: miscApi.googleReviews });
  const posts = useQuery({ queryKey: queryKeys.blog, queryFn: () => blogApi.list() });
  const storesQuery = useQuery({ queryKey: queryKeys.stores, queryFn: storesApi.list });
  const gardenServices = useQuery({ queryKey: queryKeys.gardenServices, queryFn: gardenServicesApi.get });
  const gifting = useQuery({ queryKey: queryKeys.gifting, queryFn: giftingApi.get });
  const press = useQuery({ queryKey: queryKeys.press, queryFn: pressApi.get });

  const recommended: Product[] = Array.isArray(recommendations.data)
    ? recommendations.data.flatMap((entry) => ("products" in entry ? entry.products || [] : [entry as Product]))
    : [];

  /* Admin rails and the recommendation feed overlap, so the page was showing
     two "Recommended for you" rails with the same products. Titles are claimed
     once, and a product only appears in the first rail that carries it. */
  const seenTitles = new Set<string>();
  const seenProductIds = new Set<string>();
  const rails: HomeRail[] = [];

  const pushRail = (rail: HomeRail) => {
    const titleKey = rail.title.trim().toLowerCase();
    if (!titleKey || seenTitles.has(titleKey)) return;
    const fresh = rail.products.filter((product) => product.id && !seenProductIds.has(product.id));
    if (fresh.length === 0) return;
    fresh.forEach((product) => seenProductIds.add(product.id));
    seenTitles.add(titleKey);
    rails.push({ ...rail, products: fresh });
  };

  for (const section of sections.data ?? []) {
    if (section.active === false) continue;
    pushRail({
      key: section.id ?? section.title ?? "section",
      title: section.title || "Handpicked",
      featured: section.layout === "featured",
      products: section.products ?? [],
    });
  }
  pushRail({ key: "recommended", title: "Recommended for you", eyebrow: "Picked for you", featured: true, products: recommended });

  /* /google-reviews answers with a paginated envelope, not a bare array. */
  const reviewData = googleReviews.data as GoogleReview[] | { items?: GoogleReview[] } | undefined;
  const reviews: GoogleReview[] = Array.isArray(reviewData) ? reviewData : reviewData?.items ?? [];

  const productResult = storefrontProducts.data;
  const products: Product[] = Array.isArray(productResult) ? productResult : productResult?.items ?? [];

  const ctx: HomeData = {
    banners: banners.data ?? [],
    shopName: displayName(settings.data?.shop.name),
    categories: categories.data,
    categoryTree: categoryTree.data,
    settings: settings.data,
    products,
    rails,
    reviews: reviews,
    blogPosts: posts.data?.items ?? [],
    stores: storesQuery.data,
    gardenServices: gardenServices.data?.section,
    gifting: gifting.data,
    press: { section: press.data?.section, items: press.data?.items ?? [] },
  };

  /* Until the band list arrives — or on a backend that predates it — the page
     falls back to the layout the site ships with, so nothing goes blank. */
  const layout = pageSections.data?.length ? pageSections.data : FALLBACK_HOME_SECTIONS;

  return (
    <>
      {layout.map((section) => (
        <SectionRenderer key={section.id} section={section} ctx={ctx} />
      ))}
    </>
  );
}
