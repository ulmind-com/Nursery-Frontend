import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { money } from "@/components/product/product-card";
import { CartActions } from "@/components/product/cart-actions";
import type { Product } from "@/types/api";
import type { PreviewItem } from "@/components/category/preview-products";

export type AlsoLikeItem = {
  id: string;
  title: string;
  subtitle?: string | undefined;
  image?: string | undefined;
  price: number;
  mrp?: number | undefined;
  rating?: number | undefined;
  reviewCount?: number | undefined;
  bestseller?: boolean | undefined;
};

export const alsoLikeFromProduct = (product: Product): AlsoLikeItem => {
  const variant = product.sizes?.find((size) => size.stock > 0) ?? product.sizes?.[0];
  const images = (variant?.images?.length ? variant.images : product.images) || [];
  return {
    id: product.id,
    title: product.title,
    subtitle: product.short_description ?? undefined,
    image: images[0],
    price: variant?.price ?? product.price ?? 0,
    mrp: variant?.mrp ?? product.mrp ?? undefined,
    rating: product.rating ?? undefined,
    reviewCount: product.review_count ?? undefined,
    bestseller: product.is_bestseller ?? undefined,
  };
};

export const alsoLikeFromPreview = (item: PreviewItem): AlsoLikeItem => ({
  id: item.id,
  title: item.title,
  subtitle: item.subtitle,
  image: item.image,
  price: item.price,
  mrp: item.mrp,
  rating: item.rating,
  reviewCount: item.reviewCount,
  bestseller: item.bestseller,
});

function Card({ item }: { item: AlsoLikeItem }) {
  return (
    <article className="w-[260px] shrink-0 snap-start overflow-hidden rounded-xl bg-card sm:w-[290px] lg:w-[320px]">
      <Link
        to="/product/$id"
        params={{ id: item.id }}
        className="relative block aspect-[1.05/1] overflow-hidden bg-primary-tint"
      >
        {item.image ? (
          <img
            src={item.image}
            alt={item.title}
            loading="lazy"
            className="size-full object-cover"
          />
        ) : null}
        {item.bestseller ? (
          <span className="absolute left-3 top-3 rounded-full bg-star px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-foreground">
            Bestseller
          </span>
        ) : null}
        {typeof item.rating === "number" ? (
          <span className="absolute bottom-3 left-3 rounded-md bg-background/95 px-2 py-1 text-xs font-semibold tabular-nums text-foreground">
            {item.rating.toFixed(1)}
            {typeof item.reviewCount === "number" ? (
              <span className="ml-1 font-normal text-muted-foreground">| {item.reviewCount}</span>
            ) : null}
          </span>
        ) : null}
      </Link>
      <div className="p-4">
        <Link
          to="/product/$id"
          params={{ id: item.id }}
          className="block truncate text-lg text-forest hover:underline"
        >
          {item.title}
        </Link>
        {item.subtitle ? (
          <p className="mt-1 truncate text-sm text-muted-foreground">{item.subtitle}</p>
        ) : null}
        <p className="mt-3 flex items-baseline gap-1.5 tabular-nums">
          <span className="text-lg font-semibold text-foreground">{money(item.price)}</span>
          {item.mrp && item.mrp > item.price ? (
            <span className="text-sm text-muted-foreground line-through">{money(item.mrp)}</span>
          ) : null}
        </p>
        <CartActions
          item={{
            id: item.id,
            title: item.title,
            image: item.image,
            price: item.price,
            mrp: item.mrp,
            stock: 99,
          }}
        />
      </div>
    </article>
  );
}

export function YouMayAlsoLike({
  items,
  title = "You may also like",
}: {
  items: AlsoLikeItem[];
  title?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  if (items.length === 0) return null;

  const scrollNext = () => {
    const track = trackRef.current;
    if (!track) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const amount = Math.max(280, Math.round(track.clientWidth * 0.8));
    const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    track.scrollTo({
      left: atEnd ? 0 : track.scrollLeft + amount,
      behavior: reduced ? "auto" : "smooth",
    });
  };

  return (
    <section className="bg-storefront-wash py-10 lg:py-14" aria-labelledby="also-like-title">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <h2 id="also-like-title" className="text-3xl text-forest sm:text-4xl lg:text-5xl">
          {title}
        </h2>
        <div className="relative mt-6">
          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item) => (
              <Card key={item.id} item={item} />
            ))}
          </div>
          {items.length > 2 ? (
            <button
              type="button"
              onClick={scrollNext}
              aria-label="Show more products"
              className="absolute -right-1 top-1/2 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest text-forest-foreground shadow-lg transition-colors duration-200 hover:bg-forest/90 lg:flex"
            >
              <ChevronRight className="size-5" />
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
