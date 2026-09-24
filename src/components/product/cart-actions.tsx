import { useNavigate } from "@tanstack/react-router";
import { useState, type MouseEvent } from "react";
import { Check, ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { flyToCart } from "@/lib/fly-to-cart";
import { cutout } from "@/lib/cutout";
import type { CartItem, Product, ProductSize } from "@/types/api";

/** Everything a card needs to drop a product straight into the cart. */
export interface QuickAddItem {
  id: string;
  title: string;
  image?: string | undefined;
  price: number;
  mrp?: number | undefined;
  size_variant?: string | undefined;
  pot_type?: string | undefined;
  stock: number;
  sku?: string | undefined;
}

/** Build a quick-add item from a live product, using its first sellable variant. */
export function quickAddFromProduct(product: Product): QuickAddItem {
  const variant: ProductSize | undefined =
    product.sizes?.find((size) => size.stock > 0) ?? product.sizes?.[0];
  const images = variant?.images?.length ? variant.images : product.images;
  const hasVariants = Boolean(product.sizes?.length);
  return {
    id: product.id,
    title: product.title,
    image: images?.[0],
    price: variant?.price ?? product.price ?? 0,
    mrp: variant?.mrp ?? product.mrp,
    size_variant: variant?.name,
    pot_type: variant?.pot_type ?? undefined,
    stock: hasVariants ? (variant?.stock ?? 0) : (product.stock ?? 0),
    sku: variant?.sku ?? undefined,
  };
}

const toCartItem = (item: QuickAddItem): CartItem => ({
  product_id: item.id,
  title: item.title,
  ...(item.image ? { image: item.image } : {}),
  qty: 1,
  ...(item.size_variant ? { size_variant: item.size_variant } : {}),
  ...(item.pot_type ? { pot_type: item.pot_type } : {}),
  unit_price: item.price,
  ...(item.mrp ? { mrp: item.mrp } : {}),
  stock: item.stock,
  ...(item.sku ? { sku: item.sku } : {}),
});

/**
 * Add to Cart + Buy Now, side by side — the standard card footer.
 *
 * Adding never opens the cart drawer, so a customer can keep filling the grid;
 * the header count updates and the toast offers a shortcut into the cart.
 */
export function CartActions({ item, className }: { item: QuickAddItem; className?: string }) {
  const { addItem, openCart } = useCart();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  if (item.stock < 1)
    return (
      <Button disabled className={cn("mt-3 h-9 w-full rounded-full text-xs", className)}>
        Out of stock
      </Button>
    );

  /** The card's own photo is what takes off, so the flight starts exactly there. */
  const takeOff = (event: MouseEvent<HTMLButtonElement>) => {
    const card = event.currentTarget.closest("article") ?? event.currentTarget.closest("div");
    const photo = card?.querySelector("img");
    void flyToCart(item.image ?? photo?.currentSrc ?? photo?.src, photo?.getBoundingClientRect());
  };

  const add = (event: MouseEvent<HTMLButtonElement>) => {
    addItem(toCartItem(item), { openDrawer: false });
    takeOff(event);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
    toast.success(`${item.title} added to cart`, {
      action: { label: "View cart", onClick: openCart },
    });
  };

  const buyNow = async () => {
    addItem(toCartItem(item), { openDrawer: false });
    await navigate({ to: "/checkout" });
  };

  return (
    // Sized against the card, not the screen: side by side when the card is
    // wide enough, stacked full-width on a very narrow phone.
    <div className={cn("mt-3 grid grid-cols-1 gap-2 @min-[9rem]:grid-cols-2", className)}>
      <Button
        type="button"
        variant="outline"
        onClick={add}
        onPointerEnter={() => {
          if (item.image) void cutout(item.image); // warm the cutout before the click
        }}
        aria-label={`Add ${item.title} to cart`}
        className="h-9 min-w-0 gap-1.5 rounded-full border-forest/30 px-2 text-[11px] font-semibold text-forest hover:bg-primary-tint hover:text-forest sm:text-xs"
      >
        {added ? (
          <Check className="size-3.5 shrink-0" aria-hidden />
        ) : (
          <ShoppingCart className="size-3.5 shrink-0" aria-hidden />
        )}
        <span className="truncate">
          {added ? (
            "Added"
          ) : (
            <>
              Add<span className="hidden @max-[9rem]:inline @min-[14rem]:inline"> to Cart</span>
            </>
          )}
        </span>
      </Button>
      <Button
        type="button"
        onClick={() => void buyNow()}
        aria-label={`Buy ${item.title} now`}
        className="h-9 min-w-0 gap-1.5 rounded-full bg-forest px-2 text-[11px] font-semibold text-forest-foreground hover:bg-forest/90 sm:text-xs"
      >
        <Zap className="size-3.5 shrink-0" aria-hidden />
        <span className="truncate">
          Buy<span className="hidden @max-[9rem]:inline @min-[14rem]:inline"> Now</span>
        </span>
      </Button>
    </div>
  );
}
