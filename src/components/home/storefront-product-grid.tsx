import { Link } from "@tanstack/react-router";
import { ChevronDown, SlidersHorizontal, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { money } from "@/components/product/product-card";
import type { Product, ProductSize } from "@/types/api";
import samplePeaceLily from "@/assets/sample-peace-lily.jpg";
import sampleAnthurium from "@/assets/sample-anthurium.jpg";
import sampleJade from "@/assets/sample-jade.jpg";
import sampleArecaPalm from "@/assets/sample-areca-palm.jpg";
import sampleMoneyPlant from "@/assets/sample-money-plant.jpg";
import sampleSnakePlant from "@/assets/sample-snake-plant.jpg";

type PreviewProduct = {
  title: string;
  description: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  mrp: number;
};

const previewProducts: PreviewProduct[] = [
  { title: "Peace Lily Plant", description: "Stunning air-purifying plant", image: samplePeaceLily, rating: 4.8, reviews: 440, price: 299, mrp: 350 },
  { title: "Anthurium Red Plant", description: "Long-lasting indoor plant", image: sampleAnthurium, rating: 4.8, reviews: 110, price: 699, mrp: 800 },
  { title: "Jade Mini Plant", description: "Easy-care lucky succulent", image: sampleJade, rating: 4.8, reviews: 414, price: 249, mrp: 300 },
  { title: "Areca Palm Plant", description: "Graceful tropical indoor palm", image: sampleArecaPalm, rating: 4.7, reviews: 286, price: 599, mrp: 749 },
  { title: "Golden Money Plant", description: "Lush trailing foliage plant", image: sampleMoneyPlant, rating: 4.9, reviews: 532, price: 279, mrp: 349 },
  { title: "Snake Plant", description: "Hardy low-light favourite", image: sampleSnakePlant, rating: 4.8, reviews: 368, price: 399, mrp: 499 },
];

function liveProductDetails(product: Product) {
  const variant: ProductSize | undefined = product.sizes?.find((size) => size.stock > 0) ?? product.sizes?.[0];
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

function PreviewCard({ product }: { product: PreviewProduct }) {
  return (
    <article className="group min-w-0 overflow-hidden rounded-xl bg-card">
      <div className="relative aspect-square overflow-hidden bg-muted">
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
        <RatingStrip rating={product.rating} reviews={product.reviews} />
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="line-clamp-1 text-base text-forest sm:text-xl">{product.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-muted-foreground sm:text-sm">{product.description}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="price-num text-sm text-foreground sm:text-base">{money(product.price)}</span>
            <span className="price-num text-[10px] font-medium text-muted-foreground line-through sm:text-sm">{money(product.mrp)}</span>
          </div>
          <Button
            type="button"
            className="h-9 w-full rounded-full bg-forest px-3 text-[11px] text-forest-foreground hover:bg-forest/90 sm:w-auto sm:min-w-32 sm:text-sm"
            onClick={() => toast.info("Preview product — add it in the admin panel to enable shopping.")}
          >
            View Product
          </Button>
        </div>
      </div>
    </article>
  );
}

function LiveProductCard({ product }: { product: Product }) {
  const { image, price, mrp } = liveProductDetails(product);
  return (
    <article className="group min-w-0 overflow-hidden rounded-xl bg-card">
      <Link to="/product/$id" params={{ id: product.id }} className="relative block aspect-square overflow-hidden bg-muted">
        {image ? (
          <img src={image} alt={product.title} width={768} height={960} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
        ) : (
          <span className="flex size-full items-center justify-center px-4 text-center text-xs text-muted-foreground">Image coming soon</span>
        )}
        {product.is_bestseller && (
          <span className="absolute left-2 top-2 rounded-md bg-star px-2 py-1 text-[9px] font-bold uppercase text-foreground shadow-sm sm:left-3 sm:top-3 sm:text-[10px]">Bestseller</span>
        )}
        {Boolean(product.rating) && <RatingStrip rating={product.rating ?? 0} reviews={product.review_count ?? 0} />}
      </Link>
      <div className="p-3 sm:p-4">
        <Link to="/product/$id" params={{ id: product.id }} className="block">
          <h3 className="line-clamp-1 text-base text-forest transition-colors hover:text-primary sm:text-xl">{product.title}</h3>
        </Link>
        <p className="mt-0.5 line-clamp-1 min-h-4 text-[11px] text-muted-foreground sm:text-sm">{product.short_description ?? product.description ?? ""}</p>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="price-num text-sm text-foreground sm:text-base">{money(price)}</span>
            {mrp && mrp > price ? <span className="price-num text-[10px] font-medium text-muted-foreground line-through sm:text-sm">{money(mrp)}</span> : null}
          </div>
          <Button asChild className="h-9 w-full rounded-full bg-forest px-3 text-[11px] text-forest-foreground hover:bg-forest/90 sm:w-auto sm:min-w-32 sm:text-sm">
            <Link to="/product/$id" params={{ id: product.id }}>View Product</Link>
          </Button>
        </div>
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
          <Link to="/plants" search={{}} className="flex items-center gap-2 text-xs font-semibold uppercase text-forest transition-colors hover:text-primary sm:text-sm">
            <SlidersHorizontal className="size-4" /> Filter
          </Link>
          <Link to="/plants" search={{ sort_by: "recommended" }} className="flex items-center gap-1.5 text-xs font-medium text-forest transition-colors hover:text-primary sm:text-sm">
            Sort by <ChevronDown className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 sm:gap-5 sm:pt-5 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-8">
          {hasLiveProducts
            ? products.slice(0, 6).map((product) => <LiveProductCard key={product.id} product={product} />)
            : previewProducts.map((product) => <PreviewCard key={product.title} product={product} />)}
        </div>
      </div>
    </section>
  );
}