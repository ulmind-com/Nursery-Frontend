import { Link } from "@tanstack/react-router";
import { ChevronDown, SlidersHorizontal, Star } from "lucide-react";
import { money } from "@/components/product/product-card";
import {
  CartActions,
  quickAddFromProduct,
  type QuickAddItem,
} from "@/components/product/cart-actions";
import type { Product, ProductSize } from "@/types/api";
import { previewItemsFor, type PreviewItem } from "@/components/category/preview-products";

const previewProducts = previewItemsFor("plants");
const previewMeta = [
  ["Stunning air-purifying plant", 4.8, 440],
  ["Long-lasting indoor plant", 4.8, 110],
  ["Easy-care lucky succulent", 4.8, 414],
  ["Graceful tropical indoor palm", 4.7, 286],
  ["Lush trailing foliage plant", 4.9, 532],
  ["Hardy low-light favourite", 4.8, 368],
] as const;

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

function RatingStrip({ rating, reviews }: { rating: number; reviews: number }) {
  return (
    <span className="absolute bottom-2 left-2 flex h-5 items-center gap-1 rounded-sm bg-background/95 px-1.5 text-[10px] shadow-sm sm:text-xs">
      <strong className="font-semibold text-forest">{rating.toFixed(1)}</strong>
      <Star className="size-2.5 fill-primary text-primary" />
      <span className="h-3 w-px bg-border" />
      <span className="text-muted-foreground">{reviews}</span>
    </span>
  );
}

/** Preview cards show placeholder catalogue items — still fully buyable. */
function previewQuickAdd(product: PreviewItem): QuickAddItem {
  return {
    id: product.id,
    title: product.title,
    image: product.image,
    price: product.price,
    mrp: product.mrp,
    stock: 99,
  };
}

function PreviewCard({ product, index }: { product: PreviewItem; index: number }) {
  const meta = previewMeta[index] ?? ["Nursery product preview", 0, 0];
  return (
    <article className="group min-w-0 overflow-hidden rounded-xl bg-card">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <img
          src={product.image}
          alt={product.title}
          width={768}
          height={960}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
        />
        <span className="absolute left-2 top-2 rounded-md bg-star px-2 py-1 text-[9px] font-bold uppercase text-foreground shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">
          Bestseller
        </span>
        <RatingStrip rating={meta[1]} reviews={meta[2]} />
      </Link>
      <div className="p-3 sm:p-4">
        <h3 className="line-clamp-1 text-base text-forest sm:text-xl">
          <Link to="/product/$id" params={{ id: product.id }}>
            {product.title}
          </Link>
        </h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground sm:text-sm">
          {meta[0]}
        </p>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="price-num text-sm text-foreground sm:text-base">
            {money(product.price)}
          </span>
          <span className="price-num text-[10px] font-medium text-muted-foreground line-through sm:text-sm">
            {money(product.mrp)}
          </span>
        </div>
        <CartActions item={previewQuickAdd(product)} />
      </div>
    </article>
  );
}

function LiveProductCard({ product }: { product: Product }) {
  const { image, price, mrp } = liveProductDetails(product);
  return (
    <article className="group min-w-0 overflow-hidden rounded-xl bg-card">
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        {image ? (
          <img
            src={image}
            alt={product.title}
            width={768}
            height={960}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <span className="flex size-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
            Image coming soon
          </span>
        )}
        {product.is_bestseller && (
          <span className="absolute left-2 top-2 rounded-md bg-star px-2 py-1 text-[9px] font-bold uppercase text-foreground shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">
            Bestseller
          </span>
        )}
        {Boolean(product.rating) && (
          <RatingStrip rating={product.rating ?? 0} reviews={product.review_count ?? 0} />
        )}
      </Link>
      <div className="p-3 sm:p-4">
        <Link to="/product/$id" params={{ id: product.id }} className="block">
          <h3 className="line-clamp-1 text-base text-forest transition-colors hover:text-primary sm:text-xl">
            {product.title}
          </h3>
        </Link>
        <p className="mt-0.5 line-clamp-1 min-h-4 text-[11px] text-muted-foreground sm:text-sm">
          {product.short_description ?? product.description ?? ""}
        </p>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="price-num text-sm text-foreground sm:text-base">{money(price)}</span>
          {mrp && mrp > price ? (
            <span className="price-num text-[10px] font-medium text-muted-foreground line-through sm:text-sm">
              {money(mrp)}
            </span>
          ) : null}
        </div>
        <CartActions item={quickAddFromProduct(product)} />
      </div>
    </article>
  );
}

export function StorefrontProductGrid({ products }: { products: Product[] }) {
  const hasLiveProducts = products.length > 0;

  return (
    <section className="border-t border-border bg-storefront-wash px-3 pb-12 sm:px-6 lg:px-9 lg:pb-16">
      <div className="mx-auto max-w-[1480px]">
        <div className="flex h-14 items-center justify-between border-b border-border/70 sm:h-16">
          <Link
            to="/plants"
            search={{}}
            className="flex items-center gap-2 text-xs font-semibold uppercase text-forest transition-colors hover:text-primary sm:text-sm"
          >
            <SlidersHorizontal className="size-4" /> Filter
          </Link>
          <Link
            to="/plants"
            search={{ sort_by: "recommended" }}
            className="flex items-center gap-1.5 text-xs font-medium text-forest transition-colors hover:text-primary sm:text-sm"
          >
            Sort by <ChevronDown className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 sm:gap-5 sm:pt-5 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-8">
          {hasLiveProducts
            ? products
                .slice(0, 6)
                .map((product) => <LiveProductCard key={product.id} product={product} />)
            : previewProducts.map((product, index) => (
                <PreviewCard key={product.id} product={product} index={index} />
              ))}
        </div>
      </div>
    </section>
  );
}
