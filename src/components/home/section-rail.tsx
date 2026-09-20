import { Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/api";

export function SectionHeader({ eyebrow, title, linkLabel }: { eyebrow?: string; title: string; linkLabel?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
        <h2 className="mt-2 text-2xl sm:text-3xl">{title}</h2>
      </div>
      {linkLabel && (
        <Link to="/plants" search={{}} className="text-sm font-semibold text-primary transition-colors duration-200 hover:text-forest">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}

export function ProductRail({ eyebrow, title, products, linkLabel = "View all" }: { eyebrow?: string; title: string; products: Product[]; linkLabel?: string }) {
  if (!products.length) return null;
  return (
    <section className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <SectionHeader {...(eyebrow ? { eyebrow } : {})} title={title} linkLabel={linkLabel} />
      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
