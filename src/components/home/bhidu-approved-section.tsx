import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from "lucide-react";
import { useRef, useState } from "react";
import { money } from "@/components/product/product-card";
import { previewItemsFor } from "@/components/category/preview-products";
import type { Product, ProductSize } from "@/types/api";

const DEFAULT_PERSON_IMAGE = "/images/bhidu-person.png";

/* Sunburst rays, drawn in CSS so the product cards can sit on top of them */
const SUNBURST =
  "repeating-conic-gradient(from 6deg at 56% 44%, #fdd95e 0deg 9deg, #fdf5d1 9deg 18deg)";

/* ── Static fallback data (matches screenshot) ── */
const previewProducts = previewItemsFor("plants").slice(0, 6);
const previewMeta: Array<[string, number, number, number]> = [
  ["Stunning air-purifying plant", 4.8, 440, 15],
  ["Long-lasting indoor plant", 4.8, 111, 13],
  ["Easy-care lucky succulent", 4.8, 414, 17],
  ["Graceful tropical indoor palm", 4.7, 286, 12],
  ["Lush trailing foliage plant", 4.9, 532, 10],
  ["Hardy low-light favourite", 4.8, 368, 14],
];

/* ── Helpers ── */
function liveProductDetails(product: Product) {
  const variant: ProductSize | undefined =
    product.sizes?.find((size) => size.stock > 0) ?? product.sizes?.[0];
  const images = variant?.images?.length ? variant.images : product.images;
  return {
    image: images?.[0],
    price: variant?.price ?? product.price ?? 0,
    mrp: variant?.mrp ?? product.mrp,
  };
}

function discountPct(price: number, mrp: number | undefined | null): number {
  return mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
}

/* ── Product card (matches the reference layout) ── */
function BhiduProductCard({
  title,
  image,
  subtitle,
  rating,
  reviews,
  price,
  mrp,
  discount,
  isBestseller,
  productId,
}: {
  title: string;
  image?: string;
  subtitle: string;
  rating: number;
  reviews: number;
  price: number;
  mrp: number;
  discount: number;
  isBestseller: boolean;
  productId: string;
}) {
  return (
    <article className="group flex w-[72vw] max-w-[270px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl bg-white shadow-[0_2px_14px_rgba(0,0,0,0.06)] sm:w-[240px] sm:max-w-none lg:w-[calc((100%-2.5rem)/3)]">
      {/* Image area */}
      <Link
        to="/product/$id"
        params={{ id: productId }}
        className="relative block aspect-square overflow-hidden bg-[#f4e7d3]"
      >
        {image ? (
          <img
            src={image}
            alt={title}
            width={520}
            height={520}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-xs text-muted-foreground">
            Image coming soon
          </span>
        )}

        {isBestseller && (
          <span className="absolute left-2.5 top-2.5 rounded-md bg-[#f5c518] px-2 py-1 text-[10px] font-extrabold uppercase leading-none tracking-[0.04em] text-[#1c1c1c]">
            Bestseller
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-2.5 top-2.5 rounded-md bg-[#d43c2c] px-2 py-1 text-[10px] font-extrabold uppercase leading-none tracking-[0.04em] text-white">
            {discount}% off
          </span>
        )}

        {rating > 0 && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex h-[24px] items-center gap-1 rounded-md bg-white px-2 text-[11px] shadow-sm">
            <strong className="font-bold text-[#1c1c1c]">{rating.toFixed(1)}</strong>
            <Star className="size-2.5 fill-forest text-forest" />
            <span className="mx-0.5 h-3 w-px bg-border" />
            <span className="text-muted-foreground">{reviews}</span>
          </span>
        )}
      </Link>

      {/* Product info */}
      <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3.5">
        <Link
          to="/product/$id"
          params={{ id: productId }}
          className="line-clamp-2 min-h-[2.75rem] font-display text-[17px] font-extrabold leading-[1.28] text-[#123524] transition-colors hover:text-primary"
        >
          {title}
        </Link>
        <p className="mt-1.5 line-clamp-1 text-[12.5px] leading-5 text-muted-foreground">
          {subtitle}
        </p>
        <div className="mt-3.5 flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="price-num text-[17px] font-extrabold text-[#123524]">{money(price)}</span>
            {mrp > price && (
              <span className="price-num text-[13px] font-medium text-muted-foreground line-through">
                {money(mrp)}
              </span>
            )}
          </div>
          <Link
            to="/product/$id"
            params={{ id: productId }}
            className="flex size-9 items-center justify-center rounded-full bg-forest text-forest-foreground shadow-sm transition-all duration-200 hover:scale-110 hover:bg-forest/90"
            aria-label={`View ${title}`}
          >
            <ShoppingBag className="size-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}

/* ── Main section component ── */
export function BhiduApprovedSection({
  products,
  badgeLabel = "Bhidu",
  badgeLabel2 = "Approved",
  title = "Plants",
  ctaLabel = "view all",
  ctaLink = "/plants",
  personImage = DEFAULT_PERSON_IMAGE,
  limit = 6,
}: {
  products?: Product[];
  badgeLabel?: string;
  badgeLabel2?: string;
  title?: string;
  ctaLabel?: string;
  ctaLink?: string;
  personImage?: string;
  limit?: number;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  /* Advance a full page so the next set of cards lands flush — never a half-card sliver */
  const scrollByPage = (direction: 1 | -1) => {
    const rail = scrollRef.current;
    if (!rail) return;
    rail.scrollBy({ left: direction * (rail.clientWidth + 20), behavior: "smooth" });
  };

  const hasLive = products && products.length > 0;

  return (
    <section className="relative overflow-hidden bg-[#fdfaea]">
      {/* ── Sunburst layer: reaches in from the right, behind the cards ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] xl:w-[58%] lg:block"
        style={{
          background: SUNBURST,
          maskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 16%, #000 38%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.45) 16%, #000 38%)",
        }}
      />

      {/* ── Cut-out person, standing on the sunburst ── */}
      <img
        src={personImage}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[2%] hidden h-[92%] w-auto select-none object-contain lg:block xl:right-[4%]"
      />

      <div className="relative z-10 mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
        {/* Left column — stays clear of the person on desktop */}
        <div className="lg:w-[64%] xl:w-[62%]">
          {/* Title row */}
          <div className="mb-8 flex items-end gap-3 sm:mb-10 sm:gap-4">
            <div className="relative shrink-0 pt-6 sm:pt-7">
              {/* BHIDU APPROVED sticker */}
              <span className="absolute left-0 top-0 z-10 inline-flex -rotate-[7deg] flex-col items-start rounded-[6px] bg-[#eaff00] px-2 py-1 text-[10px] font-black uppercase italic leading-[1.05] tracking-[0.02em] text-[#123524] shadow-[0_2px_6px_rgba(0,0,0,0.12)] sm:px-2.5 sm:py-1.5 sm:text-[11px]">
                {badgeLabel && <span>{badgeLabel}</span>}
                {badgeLabel2 && <span>{badgeLabel2}</span>}
              </span>
              <h2 className="pl-[74px] font-display text-[2.75rem] font-black leading-[0.95] tracking-tight text-[#1f7a1f] sm:pl-[86px] sm:text-[3.5rem] lg:pl-[96px] lg:text-[4.5rem]">
                {title}
              </h2>
            </div>

            <div className="mb-2 flex flex-1 items-center gap-4 sm:mb-3">
              <span className="hidden h-[1.5px] flex-1 bg-forest/40 sm:block" />
              <Link
                to={ctaLink}
                className="shrink-0 text-base font-medium italic text-forest/85 transition-colors duration-200 hover:text-forest sm:text-lg"
              >
                {ctaLabel}
              </Link>
            </div>
          </div>

          {/* Product rail */}
          <div className="relative min-w-0">
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:gap-5 lg:gap-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {hasLive
                ? products.slice(0, limit).map((product) => {
                    const { image, price, mrp } = liveProductDetails(product);
                    return (
                      <BhiduProductCard
                        key={product.id}
                        productId={product.id}
                        title={product.title}
                        image={image ?? ""}
                        subtitle={product.short_description || product.description || ""}
                        rating={product.rating ?? 0}
                        reviews={product.review_count ?? 0}
                        price={price}
                        mrp={mrp ?? price}
                        discount={discountPct(price, mrp)}
                        isBestseller={product.is_bestseller ?? false}
                      />
                    );
                  })
                : previewProducts.map((product, index) => {
                    const meta = previewMeta[index] ?? ["Plant", 0, 0, 0];
                    return (
                      <BhiduProductCard
                        key={product.id}
                        productId={product.id}
                        title={product.title}
                        image={product.image}
                        subtitle={meta[0] as string}
                        rating={meta[1] as number}
                        reviews={meta[2] as number}
                        price={product.price}
                        mrp={product.mrp}
                        discount={meta[3] as number}
                        isBestseller
                      />
                    );
                  })}
            </div>

            {canScrollLeft && (
              <button
                onClick={() => scrollByPage(-1)}
                aria-label="Show previous products"
                className="absolute -left-3 top-[42%] z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-forest text-forest-foreground shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl sm:flex"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scrollByPage(1)}
                aria-label="Show more products"
                className="absolute -right-3 top-[42%] z-20 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-forest text-forest-foreground shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl sm:flex"
              >
                <ChevronRight className="size-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile / tablet: sunburst panel with the person ── */}
      <div
        className="relative mx-4 mb-8 overflow-hidden rounded-2xl sm:mx-6 lg:hidden"
        style={{ background: SUNBURST }}
      >
        <img
          src={personImage}
          alt="Bhidu approved — our plants are handpicked for quality"
          className="mx-auto block h-[260px] w-auto object-contain object-bottom sm:h-[320px]"
        />
      </div>
    </section>
  );
}
