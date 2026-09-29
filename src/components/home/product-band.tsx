import { Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/api";

/* The shared body of the catalogue bands the admin can drop on the home page —
   Bestsellers, Low-Effort Plants, and any future band that is "a heading over a
   slice of products". They differ only in which products they are handed. */
export function ProductBand({
  products,
  title,
  subtitle,
  ctaLabel = "View all",
  ctaLink = "/plants",
  limit = 10,
}: {
  products: Product[];
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
  limit?: number;
}) {
  /* Five across on a desktop, so the shipped limit of 10 is the two rows these
     bands are meant to be; a thin catalogue just runs short. */
  const shown = products.slice(0, limit);
  /* Nothing matching yet is a real state on a fresh catalogue — the band hides
     rather than showing an empty grid. */
  if (shown.length === 0) return null;

  return (
    <section className="bg-storefront-wash py-12 lg:py-16">
      <div className="mx-auto max-w-[1480px] px-3 sm:px-6 lg:px-9">
        <div className="mb-8 text-center lg:mb-10">
          <h2 className="font-display text-3xl font-extrabold text-forest sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-5">
          {shown.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {ctaLabel && (
          <div className="mt-8 text-center lg:mt-10">
            <Link
              to={ctaLink}
              className="inline-flex items-center gap-2 rounded-full border border-forest px-7 py-3 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-background"
            >
              {ctaLabel} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
