import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Leaf, Star, Sprout, RefreshCcw, MessageCircle } from "lucide-react";
import { blogApi, categoriesApi, homeApi, miscApi, productsApi, queryKeys, settingsApi } from "@/api/services";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { StorefrontProductGrid } from "@/components/home/storefront-product-grid";
import { TrustBar } from "@/components/home/trust-bar";
import { ProductRail, SectionHeader } from "@/components/home/section-rail";
import { VideoGallery } from "@/components/home/video-gallery";
import { SpotlightSection, type SpotlightPromo } from "@/components/home/spotlight-section";
import { brand } from "@/config/brand";
import type { Product } from "@/types/api";
const categoryPlants = "/images/category-plants.png";
const categoryPots = "/images/category-pots.png";
const categorySoil = "/images/category-soil.png";
const categoryFertilisers = "/images/category-fertilisers.png";
const categorySeeds = "/images/category-seeds.png";
const categoryTools = "/images/category-tools.png";
const categoryWatering = "/images/category-watering.png";
const categoryPestControl = "/images/category-pest-control.png";
const categoryDecor = "/images/category-decor.png";

const browseShortcuts = [
  { name: "Plants", slug: "plants", image: categoryPlants },
  { name: "Pots", slug: "pots", image: categoryPots },
  { name: "Soil", slug: "soil", image: categorySoil },
  { name: "Fertilisers", slug: "fertilisers", image: categoryFertilisers },
  { name: "Seeds", slug: "seeds", image: categorySeeds },
  { name: "Garden Tools", slug: "garden-tools", image: categoryTools },
  { name: "Watering Solutions", slug: "watering-solutions", image: categoryWatering },
  { name: "Pest Control", slug: "pest-control", image: categoryPestControl },
  { name: "Gardening Decor", slug: "gardening-decor", image: categoryDecor },
] as const;

const homeVideos = [
  { id: "v1", src: "/Video/video-1.mp4", title: "Transform your living room" },
  { id: "v2", src: "/Video/video-2.mp4", title: "Easy care tips for busy days" },
  { id: "v3", src: "/Video/video-3.mp4", title: "Styling your work desk" },
  { id: "v4", src: "/Video/video-4.mp4", title: "Pet-friendly plants" },
  { id: "v5", src: "/Video/video-5.mp4", title: "Morning mist routine" },
  { id: "v6", src: "/Video/video-6.mp4", title: "Propagating made simple" },
];

const spotlightPromos: SpotlightPromo[] = [
  {
    id: "sp1",
    titleTop: "STARRING",
    titleBottom: "PEACE LILY",
    titleBottomColor: "#e4ff00",
    image: "/images/sample-peace-lily.jpg",
    link: "/search?q=Peace%20Lily",
    buttonText: "Shop Now",
    buttonTheme: "yellow",
  },
  {
    id: "sp2",
    titleTop: "Kadi Patta Plant",
    image: "/images/sample-snake-plant.jpg",
    link: "/search?q=Kadi%20Patta",
    buttonText: "Shop Now",
    buttonTheme: "dark",
    badge: "New Launch",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Premium Plants Online | Plant Nursery" },
      { name: "description", content: "Shop healthy indoor and outdoor plants, planters, and care essentials from a trusted Indian nursery." },
      { property: "og:title", content: "Premium Plants Online | Plant Nursery" },
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
  const sections = useQuery({ queryKey: queryKeys.home, queryFn: homeApi.sections });
  const banners = useQuery({ queryKey: ["banners"], queryFn: homeApi.banners });
  const categories = useQuery({ queryKey: queryKeys.categories, queryFn: categoriesApi.list });
  const settings = useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get });
  const recommendations = useQuery({ queryKey: ["recommendations", "home"], queryFn: homeApi.recommendations });
  const storefrontProducts = useQuery({ queryKey: queryKeys.products({ limit: 6 }), queryFn: () => productsApi.list({ limit: 6 }) });
  const googleReviews = useQuery({ queryKey: ["google-reviews"], queryFn: miscApi.googleReviews });
  const posts = useQuery({ queryKey: queryKeys.blog, queryFn: blogApi.list });

  const recommended: Product[] = Array.isArray(recommendations.data)
    ? recommendations.data.flatMap((entry) => ("products" in entry ? entry.products || [] : [entry as Product]))
    : [];
  const blogPosts = posts.data?.items ?? [];
  const reviews = googleReviews.data ?? [];
  const productResult = storefrontProducts.data;
  const products: Product[] = Array.isArray(productResult) ? productResult : productResult?.items ?? [];

  return (
    <>
      <HeroCarousel banners={banners.data ?? []} shopName={settings.data?.shop.name || brand.brandName} />

      <section className="mt-6 min-w-0 overflow-hidden bg-forest px-3 py-5 sm:px-6 sm:py-7 lg:mt-8 lg:px-9 lg:py-8">
        <h2 className="mb-6 text-center font-display text-[2rem] font-bold text-white sm:mb-8 sm:text-[2.75rem] lg:text-[3.25rem]">Our Categories</h2>
        <div className="mx-auto w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] lg:max-w-[1480px] [&::-webkit-scrollbar]:hidden">
          <div className="flex w-max min-w-full justify-start gap-4 px-2 sm:gap-6 lg:justify-center lg:gap-6">
            {(categories.data ?? []).slice(0, 9).map((cat) => (
              <Link key={cat.id} to="/category/$slug" params={{ slug: cat.slug || cat.id }} className="group w-[96px] shrink-0 text-center sm:w-[110px] lg:w-[116px]">
                <div className="mx-auto flex aspect-square items-center justify-center overflow-hidden rounded-full bg-white p-3 sm:p-4 shadow-sm transition-transform duration-300 group-hover:-translate-y-2">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} loading="lazy" className="size-full object-contain" />
                  ) : (
                    <span className="flex size-full items-center justify-center rounded-full bg-primary-tint"><Leaf className="size-8 text-primary" /></span>
                  )}
                </div>
                <h2 className="mt-4 line-clamp-2 text-sm font-medium leading-5 text-white sm:text-[15px]">{cat.name}</h2>
              </Link>
            ))}
            {(categories.data?.length ?? 0) === 0 && browseShortcuts.map(({ name, slug, image }) => (
              <Link key={name} to="/category/$slug" params={{ slug }} className="group w-[96px] shrink-0 text-center sm:w-[110px] lg:w-[116px]">
                <div className="mx-auto flex aspect-square items-center justify-center overflow-hidden rounded-full bg-white p-3 sm:p-4 shadow-sm transition-transform duration-300 group-hover:-translate-y-2">
                  <img src={image} alt="" width={816} height={816} loading="lazy" className="size-full object-contain" />
                </div>
                <h2 className="mt-4 line-clamp-2 text-sm font-medium leading-5 text-white sm:text-[15px] lg:min-h-10">{name}</h2>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CategoryTrustStrip />
      
      <VideoGallery videos={homeVideos} />

      <SpotlightSection promos={spotlightPromos} />

      <StorefrontProductGrid products={products} />

      <TrustBar settings={settings.data} />

      {(sections.data ?? [])
        .filter((section) => section.active !== false && (section.products?.length ?? 0) > 0)
        .map((section) => (
          <div key={section.id} className={section.layout === "featured" ? "bg-primary-tint" : ""}>
            <ProductRail title={section.title || "Handpicked"} products={section.products ?? []} />
          </div>
        ))}

      {recommended.length > 0 && (
        <div className="bg-primary-tint">
          <ProductRail eyebrow="Picked for you" title="Recommended for you" products={recommended} />
        </div>
      )}

      {reviews.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <SectionHeader eyebrow="Google reviews" title="What our customers say" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(0, 6).map((review, i) => (
              <figure key={review.id ?? i} className="surface-card p-5">
                <div className="flex gap-0.5" aria-label={`Rated ${review.rating} out of 5`}>
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} className={`size-3.5 ${s < review.rating ? "fill-star text-star" : "text-border"}`} />
                  ))}
                </div>
                {review.text && <blockquote className="mt-3 line-clamp-5 text-sm leading-6 text-muted-foreground">{review.text}</blockquote>}
                <figcaption className="mt-4 text-xs font-semibold">{review.author_name || "Google user"}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {blogPosts.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-4 pb-16 sm:px-6 lg:px-10">
          <SectionHeader eyebrow="Journal" title="Plant care stories" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.slice(0, 3).map((post) => (
              <Link key={post.slug ?? post.key ?? post.title} to="/blog/$slug" params={{ slug: post.slug || post.key || "" }} className="surface-card group overflow-hidden">
                <div className="aspect-[16/10] overflow-hidden bg-primary-soft">
                  {(post.hero_image || post.image) && (
                    <img src={post.hero_image || post.image} alt={post.title} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-base">{post.title}</h3>
                  {post.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

function CategoryTrustStrip() {
  return (
    <div className="bg-storefront-wash pb-10 pt-6 px-3 sm:px-6 lg:px-9 lg:pb-12 lg:pt-8">
      <div className="mx-auto flex max-w-[1480px] flex-col items-center justify-between rounded-[2rem] bg-[#facc15] px-6 py-5 shadow-sm sm:flex-row lg:px-10">
        
        {/* Item 1 */}
        <div className="flex flex-1 w-full flex-col items-center justify-center gap-3 py-4 text-center sm:border-r sm:border-black/10">
          <div className="flex size-14 items-center justify-center rounded-full border-2 border-black bg-white">
            <Sprout className="size-6 text-black" />
          </div>
          <p className="text-sm font-semibold text-black">90-Day Pre Fertilised Soil</p>
        </div>

        {/* Item 2 */}
        <div className="flex flex-1 w-full flex-col items-center justify-center gap-3 py-4 text-center sm:border-r sm:border-black/10">
          <div className="flex size-14 items-center justify-center rounded-full border-2 border-black bg-white">
            <Leaf className="size-6 text-black" />
          </div>
          <p className="text-sm font-semibold text-black">Arrives Healthy</p>
        </div>

        {/* Item 3 */}
        <div className="flex flex-1 w-full flex-col items-center justify-center gap-3 py-4 text-center sm:border-r sm:border-black/10">
          <div className="flex size-14 items-center justify-center rounded-full border-2 border-black bg-white">
            <RefreshCcw className="size-6 text-black" />
          </div>
          <p className="text-sm font-semibold text-black">Free Replacement</p>
        </div>

        {/* Item 4 */}
        <div className="flex flex-1 w-full flex-col items-center justify-center gap-3 py-4 text-center">
          <div className="flex size-14 items-center justify-center rounded-full border-2 border-black bg-white">
            <MessageCircle className="size-6 text-black" />
          </div>
          <p className="text-sm font-semibold text-black">Free Plant Care Support</p>
        </div>

      </div>
    </div>
  );
}
