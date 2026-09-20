import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Leaf, Star } from "lucide-react";
import { blogApi, categoriesApi, homeApi, miscApi, queryKeys, settingsApi } from "@/api/services";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { TrustBar } from "@/components/home/trust-bar";
import { ProductRail, SectionHeader } from "@/components/home/section-rail";
import { brand } from "@/config/brand";
import type { Product } from "@/types/api";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Premium Plants Online | Plant Nursery" },
      { name: "description", content: "Shop healthy indoor and outdoor plants, planters, and care essentials from a trusted Indian nursery." },
      { property: "og:title", content: "Premium Plants Online | Plant Nursery" },
      { property: "og:description", content: "Thoughtfully grown plants and garden essentials, delivered with care." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
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
  const googleReviews = useQuery({ queryKey: ["google-reviews"], queryFn: miscApi.googleReviews });
  const posts = useQuery({ queryKey: queryKeys.blog, queryFn: blogApi.list });

  const recommended: Product[] = Array.isArray(recommendations.data)
    ? recommendations.data.flatMap((entry) => ("products" in entry ? entry.products || [] : [entry as Product]))
    : [];
  const blogPosts = posts.data?.items ?? [];
  const reviews = googleReviews.data ?? [];

  return (
    <>
      <HeroCarousel banners={banners.data ?? []} shopName={settings.data?.shop.name || brand.brandName} />
      <TrustBar settings={settings.data} />

      {categories.data && categories.data.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
          <SectionHeader eyebrow="Find your green" title="Shop by category" linkLabel="View all" />
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {categories.data.slice(0, 6).map((cat) => (
              <Link key={cat.id} to="/category/$slug" params={{ slug: cat.slug || cat.id }} className="group">
                <div className="aspect-square overflow-hidden rounded-full bg-primary-soft">
                  {cat.image ? (
                    <img src={cat.image} alt={cat.name} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <span className="flex size-full items-center justify-center"><Leaf className="size-7 text-primary" /></span>
                  )}
                </div>
                <h3 className="mt-3 text-center text-xs font-semibold sm:text-sm">{cat.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

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
