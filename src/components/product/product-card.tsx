import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Droplets, Heart, Leaf, ShoppingBag, Star, Sun } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import type { Product, ProductSize } from "@/types/api";

export const money = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

function carePills(product: Product) {
  const spec = product.plant_spec;
  if (!spec) return [];
  return [
    spec.sunlight ? { icon: Sun, label: String(spec.sunlight) } : null,
    spec.watering || spec.water_schedule ? { icon: Droplets, label: String(spec.watering ?? spec.water_schedule) } : null,
    spec.difficulty || spec.difficulty_level ? { icon: Leaf, label: String(spec.difficulty ?? spec.difficulty_level) } : null,
  ].filter((pill): pill is { icon: typeof Sun; label: string } => pill !== null);
}

export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [hovered, setHovered] = useState(false);
  const variant: ProductSize | undefined = product.sizes?.find((size) => size.stock > 0) || product.sizes?.[0];
  const price = variant?.price ?? product.price ?? 0;
  const mrp = variant?.mrp ?? product.mrp;
  const stock = variant?.stock ?? product.stock ?? 0;
  const images = (variant?.images?.length ? variant.images : product.images) || [];
  const primary = images[0];
  const secondary = images[1];
  const image = hovered && secondary ? secondary : primary;
  const discount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const pills = carePills(product);

  const add = () => {
    if (stock < 1) return;
    addItem({
      product_id: product.id,
      title: product.title,
      ...(primary ? { image: primary } : {}),
      qty: 1,
      ...(variant?.name ? { size_variant: variant.name } : {}),
      ...(variant?.pot_type ? { pot_type: variant.pot_type } : {}),
      unit_price: price,
      ...(mrp ? { mrp } : {}),
      stock,
    });
    toast.success(`${product.title} added to cart`);
  };

  return (
    <article
      className="surface-card group relative flex min-w-0 flex-col overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to="/product/$id" params={{ id: product.id }} className="relative block aspect-[4/5] overflow-hidden bg-primary-tint">
        {image ? (
          <img src={image} alt={product.title} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <span className="flex size-full items-center justify-center text-sm text-muted-foreground">Image coming soon</span>
        )}
        <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
          {discount > 0 && <span className="rounded-md bg-sale px-2 py-1 text-[10px] font-bold uppercase text-sale-foreground">{discount}% off</span>}
          {product.is_bestseller && <span className="rounded-md bg-forest px-2 py-1 text-[10px] font-bold uppercase text-forest-foreground">Bestseller</span>}
          {product.is_new_arrival && <span className="rounded-md bg-primary-soft px-2 py-1 text-[10px] font-bold uppercase text-primary-soft-foreground">New</span>}
        </div>
        {stock < 1 && (
          <span className="absolute inset-x-0 bottom-0 bg-foreground/80 py-1.5 text-center text-[11px] font-semibold text-background">Out of stock</span>
        )}
      </Link>
      <Button
        variant="secondary"
        size="icon"
        className="absolute right-2.5 top-2.5 size-9 rounded-full bg-background/90 shadow-sm transition-colors duration-200 hover:text-sale"
        aria-label={`Save ${product.title} to wishlist`}
      >
        <Heart className="size-4" />
      </Button>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div className="flex min-h-4 items-center gap-1 text-[11px] text-muted-foreground">
          {Boolean(product.rating) && (
            <>
              <Star className="size-3 fill-star text-star" />
              <span className="font-semibold text-foreground">{product.rating?.toFixed(1)}</span>
              <span>({product.review_count || 0})</span>
            </>
          )}
        </div>
        <Link to="/product/$id" params={{ id: product.id }} className="mt-1 line-clamp-2 min-h-10 text-sm font-semibold leading-5 transition-colors duration-200 hover:text-primary">
          {product.title}
        </Link>
        {product.short_description && <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{product.short_description}</p>}
        {pills.length > 0 && (
          <ul className="mt-2.5 flex flex-wrap gap-1.5">
            {pills.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-1 rounded-full bg-primary-tint px-2 py-1 text-[10px] font-medium text-primary-soft-foreground">
                <Icon className="size-3" />
                {label}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="price-num text-base text-forest">{money(price)}</span>
          {mrp && mrp > price && <span className="price-num text-xs font-medium text-muted-foreground line-through">{money(mrp)}</span>}
        </div>
        <Button
          onClick={add}
          disabled={stock < 1}
          className="mt-3 w-full text-xs lg:opacity-0 lg:transition-opacity lg:duration-200 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100"
        >
          <ShoppingBag />
          {stock > 0 ? "Add to cart" : "Out of stock"}
        </Button>
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
