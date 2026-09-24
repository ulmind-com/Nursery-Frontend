import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Flower2, Heart, Leaf, PawPrint, Sparkles, Star, Wind } from "lucide-react";
import { AddToBasketButton, type QuickAddItem } from "@/components/product/cart-actions";
import { cn } from "@/lib/utils";
import type { Product, ProductSize } from "@/types/api";

export const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);



/* Short label for a size swatch: "Extra Large" -> XL, "Small" -> S. */
const SIZE_SHORT: Record<string, string> = {
  small: "S", medium: "M", large: "L", "extra large": "XL", "extra small": "XS",
  s: "S", m: "M", l: "L", xl: "XL", xs: "XS", xxl: "2XL",
};
function sizeLabel(name: string) {
  const key = name.trim().toLowerCase();
  if (SIZE_SHORT[key]) return SIZE_SHORT[key];
  const words = name.trim().split(/\s+/);
  if (words.length > 1) return words.map((w) => w[0]).join("").toUpperCase().slice(0, 3);
  return name.slice(0, 2).toUpperCase();
}

/* Admin types a colour name ("Ivory") or a hex ("#1B4DB1"); both work as CSS. */
const swatchColor = (value: string) => (value.startsWith("#") ? value : value.toLowerCase());

/* Up to two benefit pills, straight from the plant spec the admin fills in. */
function benefitPills(product: Product) {
  const spec = product.plant_spec ?? {};
  const difficulty = String(spec.difficulty ?? spec.difficulty_level ?? "").toLowerCase();
  return [
    spec.pet_safe ? { icon: PawPrint, label: "Pet Safe", tone: "bg-[#eef2ff] text-[#3730a3]" } : null,
    spec.air_purifying ? { icon: Wind, label: "Air Purifying", tone: "bg-[#e6f6ef] text-forest" } : null,
    difficulty === "easy" ? { icon: Leaf, label: "Low Maintenance", tone: "bg-[#fdf3e3] text-[#8a5a1a]" } : null,
    spec.flowering ? { icon: Flower2, label: "Flowering", tone: "bg-[#fdeef4] text-[#9d2b5a]" } : null,
    spec.fragrant ? { icon: Sparkles, label: "Fragrant", tone: "bg-[#f3eefd] text-[#5b3a9d]" } : null,
  ].filter((pill): pill is { icon: typeof Leaf; label: string; tone: string } => pill !== null).slice(0, 2);
}

export function ProductCard({ product }: { product: Product }) {
  const sizes = product.sizes ?? [];
  /* Default to the first variant that can actually ship. */
  const firstSellable = Math.max(sizes.findIndex((size) => size.stock > 0), 0);
  const [index, setIndex] = useState(firstSellable);
  const [hovered, setHovered] = useState(false);

  const variant: ProductSize | undefined = sizes[index];
  const price = variant?.price ?? product.price ?? 0;
  const mrp = variant?.mrp ?? product.mrp;
  const stock = sizes.length ? (variant?.stock ?? 0) : (product.stock ?? 0);
  const images = (variant?.images?.length ? variant.images : product.images) || [];
  const image = (hovered && images[1]) || images[0];
  const discount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const pills = benefitPills(product);
  const rating = product.rating ?? 0;
  /* Bestsellers get the red spotlight treatment — driven purely by the flag
     the admin ticks on the product. */
  const featured = Boolean(product.is_bestseller);

  /* Colour swatches when the variants differ by pot colour, size chips otherwise. */
  const hasColors = sizes.some((size) => size.pot_color);
  const chooserLabel = sizes.length > 1 ? (hasColors ? "Select Color" : "Select Size") : null;

  const item: QuickAddItem = {
    id: product.id,
    title: product.title,
    ...(image ? { image } : {}),
    price,
    ...(mrp ? { mrp } : {}),
    ...(variant?.name ? { size_variant: variant.name } : {}),
    ...(variant?.pot_type ? { pot_type: variant.pot_type } : {}),
    stock,
    ...(variant?.sku ? { sku: variant.sku } : {}),
  };

  return (
    <article
      className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl bg-card shadow-[0_1px_3px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)] @container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className={cn("relative block aspect-square overflow-hidden bg-primary-tint", featured ? "rounded-t-2xl" : "rounded-2xl")}
      >
        {image ? (
          <img
            src={image}
            alt={product.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-sm text-muted-foreground">
            Image coming soon
          </span>
        )}

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.is_bestseller && (
            <span className="rounded-full bg-[#b4262f] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              Bestseller
            </span>
          )}
          {product.is_new_arrival && (
            <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-forest shadow-sm">
              New
            </span>
          )}
        </div>

        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-forest px-2.5 py-1 text-[11px] font-bold text-forest-foreground shadow-sm">
            {discount}% OFF
          </span>
        )}

        <span className="absolute bottom-3 right-3 flex size-9 translate-y-2 items-center justify-center rounded-full bg-white/95 text-forest opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Heart className="size-4" aria-hidden />
        </span>

        {stock < 1 && (
          <span className="absolute inset-x-0 bottom-0 bg-foreground/80 py-1.5 text-center text-[11px] font-semibold text-background">
            Out of stock
          </span>
        )}
      </Link>

      <div className={cn("flex flex-1 flex-col px-3 pb-3 pt-3", featured && "rounded-b-2xl bg-[#b4262f] text-white")}>
        <div className="flex items-center gap-1.5">
          <span className="flex gap-0.5" aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className={`size-3.5 ${i < Math.round(rating) ? "fill-star text-star" : "fill-border text-border"}`} />
            ))}
          </span>
          <span className={cn("text-xs font-semibold", featured ? "text-white" : "text-foreground")}>{rating.toFixed(1)}</span>
          <span className={cn("text-xs", featured ? "text-white/75" : "text-muted-foreground")}>| {product.review_count || 0}</span>
        </div>

        <Link
          to="/product/$id"
          params={{ id: product.id }}
          className={cn("mt-2 line-clamp-2 min-h-10 text-[15px] font-semibold leading-5 transition-colors duration-200", featured ? "text-white hover:text-white/85" : "text-forest hover:text-primary")}
        >
          {product.title}
        </Link>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
          <span className={cn("price-num text-lg font-bold", featured ? "text-white" : "text-forest")}>{money(price)}</span>
          {mrp && mrp > price && (
            <span className={cn("price-num text-sm font-medium line-through", featured ? "text-white/75" : "text-sale")}>{money(mrp)}</span>
          )}
        </div>

        {pills.length > 0 && (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {pills.map(({ icon: Icon, label, tone }) => (
              <li key={label} className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${tone}`}>
                <Icon className="size-3" aria-hidden />
                {label}
              </li>
            ))}
          </ul>
        )}

        {chooserLabel && (
          <div className="mt-3">
            <p className={cn("text-xs font-semibold", featured ? "text-white" : "text-foreground")}>{chooserLabel}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((size, i) => {
                const active = i === index;
                const disabled = size.stock < 1;
                return (
                  <button
                    key={`${size.name}-${i}`}
                    type="button"
                    onClick={() => setIndex(i)}
                    disabled={disabled}
                    title={size.pot_color || size.pot_size || size.name}
                    aria-label={`${chooserLabel}: ${size.pot_color || size.name}`}
                    aria-pressed={active}
                    className={`flex size-9 items-center justify-center rounded-full border text-[11px] font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
                      active
                        ? featured
                          ? "border-white ring-2 ring-white/40"
                          : "border-forest ring-2 ring-forest/30"
                        : featured
                          ? "border-white/50 hover:border-white"
                          : "border-border hover:border-forest/50"
                    } ${hasColors ? "" : active ? "bg-star text-foreground" : "bg-background text-foreground"}`}
                    {...(hasColors && size.pot_color
                      ? { style: { backgroundColor: swatchColor(size.pot_color) } }
                      : {})}
                  >
                    {hasColors ? "" : sizeLabel(size.name)}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-3 pb-2">
          <AddToBasketButton item={item} />
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
