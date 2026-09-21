import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { ChevronDown, ChevronLeft, ChevronRight, Minus, Plus, ShoppingBag, Trash2, Truck, X } from "lucide-react";
import { useRef, useState } from "react";
import { queryKeys, recommendationApi, settingsApi } from "@/api/services";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart-context";
import type { CartItem, Product } from "@/types/api";

const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function cartItemFromProduct(product: Product): CartItem | null {
  const size = product.sizes?.find((s) => s.stock > 0) ?? product.sizes?.[0];
  const price = size?.price ?? product.price;
  if (typeof price !== "number") return null;
  const image = size?.images?.[0] ?? product.images?.[0];
  const mrp = size?.mrp ?? product.mrp;
  return {
    product_id: product.id,
    title: product.title,
    ...(image ? { image } : {}),
    qty: 1,
    ...(size?.name ? { size_variant: size.name } : {}),
    ...(size?.pot_type ? { pot_type: size.pot_type } : {}),
    unit_price: price,
    ...(typeof mrp === "number" ? { mrp } : {}),
    ...(typeof (size?.stock ?? product.stock) === "number" ? { stock: size?.stock ?? product.stock } : {}),
    ...(size?.sku ? { sku: size.sku } : {}),
  };
}

export function CartDrawer() {
  const { items, subtotal, count, isOpen, setCartOpen, closeCart, updateQty, removeItem, addItem } = useCart();
  const { data: settings } = useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get, staleTime: 300_000 });
  const { data: recs = [] } = useQuery({ queryKey: ["recommendations", "cart"], queryFn: recommendationApi.cart, staleTime: 300_000, retry: false, enabled: isOpen });
  const [showBreakdown, setShowBreakdown] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  const freeAbove = settings?.delivery?.free_above;
  const threshold = typeof freeAbove === "number" && freeAbove > 0 ? freeAbove : undefined;
  const remaining = threshold ? Math.max(0, threshold - subtotal) : 0;
  const progress = threshold ? Math.min(100, Math.round((subtotal / threshold) * 100)) : 0;

  const scrollRail = (direction: -1 | 1) => {
    railRef.current?.scrollBy({ left: direction * 240, behavior: "smooth" });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setCartOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 border-l-0 bg-storefront-wash p-0 sm:max-w-[430px] [&>button]:hidden"
        aria-describedby="cart-drawer-description"
      >
        <header className="flex items-center justify-between bg-background px-5 py-4">
          <SheetTitle className="font-display text-2xl font-extrabold text-forest">Cart</SheetTitle>
          <SheetDescription id="cart-drawer-description" className="sr-only">Items you added, with quantity controls and checkout.</SheetDescription>
          <button type="button" onClick={closeCart} aria-label="Close cart" className="rounded-full p-1.5 text-forest transition-colors duration-200 hover:bg-secondary">
            <X className="size-5" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 pb-6">
          {threshold && items.length > 0 && (
            <div className="pt-5">
              <p className="text-sm text-foreground">
                {remaining > 0 ? <>Add <strong className="font-bold">{inr(remaining)}</strong> more to unlock <span className="font-bold text-primary">free delivery</span></> : <span className="font-semibold text-primary">Free delivery unlocked</span>}
              </p>
              <div className="relative mt-5 h-1 rounded-full bg-primary-soft">
                <div className="h-full rounded-full bg-forest transition-[width] duration-300" style={{ width: `${progress}%` }} />
                <span className="absolute top-1/2 flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-forest text-forest-foreground transition-[left] duration-300" style={{ left: `${progress}%` }}>
                  <Truck className="size-4" />
                </span>
                <span className="absolute right-0 top-1/2 flex size-8 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full border border-forest bg-background text-[10px] font-bold text-forest">
                  {progress}%
                </span>
              </div>
            </div>
          )}

          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <span className="flex size-16 items-center justify-center rounded-full bg-primary-soft text-forest"><ShoppingBag className="size-7" /></span>
              <p className="mt-5 font-display text-xl font-bold text-forest">Your cart is empty</p>
              <p className="mt-2 text-sm text-muted-foreground">Add something green and it will show up here.</p>
              <Button asChild className="mt-6 rounded-full px-7" onClick={closeCart}><Link to="/plants" search={{}}>Explore plants</Link></Button>
            </div>
          ) : (
            <ul className="mt-6 space-y-5">
              {items.map((item) => (
                <li key={`${item.product_id}-${item.size_variant ?? ""}-${item.pot_type ?? ""}`} className="flex gap-4">
                  <div className="size-[86px] shrink-0 overflow-hidden rounded-md bg-primary-tint">
                    {item.image && <img src={item.image} alt={item.title} loading="lazy" className="size-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start gap-3">
                      <h3 className="min-w-0 flex-1 font-display text-base font-bold leading-snug text-forest">{item.title}</h3>
                      <button type="button" onClick={() => removeItem(item.product_id, item.size_variant)} aria-label={`Remove ${item.title}`} className="shrink-0 rounded p-1 text-forest/70 transition-colors duration-200 hover:text-destructive">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                    {(item.size_variant || item.pot_type) && (
                      <p className="mt-1 text-sm text-muted-foreground">{[item.size_variant, item.pot_type].filter(Boolean).join(" ")}</p>
                    )}
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="flex items-baseline gap-2 tabular-nums">
                        <span className="text-base font-bold text-forest">{inr(item.unit_price)}</span>
                        {typeof item.mrp === "number" && item.mrp > item.unit_price && <span className="text-sm text-muted-foreground line-through">{inr(item.mrp)}</span>}
                      </p>
                      <div className="flex items-center gap-1 rounded-full border border-forest/30 px-1">
                        <button type="button" aria-label="Decrease quantity" disabled={item.qty <= 1} onClick={() => updateQty(item.product_id, item.qty - 1, item.size_variant)} className="flex size-7 items-center justify-center rounded-full text-forest transition-colors duration-200 hover:bg-secondary disabled:opacity-40"><Minus className="size-3.5" /></button>
                        <span className="w-6 text-center text-sm font-semibold tabular-nums">{item.qty}</span>
                        <button type="button" aria-label="Increase quantity" onClick={() => updateQty(item.product_id, item.qty + 1, item.size_variant)} className="flex size-7 items-center justify-center rounded-full text-forest transition-colors duration-200 hover:bg-secondary"><Plus className="size-3.5" /></button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {recs.length > 0 && (
            <section className="mt-10" aria-label="Recommended products">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-xl font-extrabold text-forest">Recommended Products</h3>
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Scroll recommendations left" onClick={() => scrollRail(-1)} className="flex size-8 items-center justify-center rounded-full text-forest transition-colors duration-200 hover:bg-secondary"><ChevronLeft className="size-5" /></button>
                  <button type="button" aria-label="Scroll recommendations right" onClick={() => scrollRail(1)} className="flex size-8 items-center justify-center rounded-full text-forest transition-colors duration-200 hover:bg-secondary"><ChevronRight className="size-5" /></button>
                </div>
              </div>
              <div ref={railRef} className="-mx-5 mt-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {recs.slice(0, 10).map((product) => {
                  const image = product.images?.[0] ?? product.sizes?.[0]?.images?.[0];
                  const price = product.sizes?.[0]?.price ?? product.price;
                  const payload = cartItemFromProduct(product);
                  return (
                    <article key={product.id} className="w-[200px] shrink-0 snap-start overflow-hidden rounded-xl bg-background">
                      <Link to="/product/$id" params={{ id: product.id }} onClick={closeCart} className="relative block aspect-square bg-primary-tint">
                        {image && <img src={image} alt={product.title} loading="lazy" className="size-full object-cover" />}
                        {product.is_bestseller && <span className="absolute left-3 top-3 rounded-full bg-star px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide text-forest">Bestseller</span>}
                        {typeof product.rating === "number" && (
                          <span className="absolute bottom-3 left-3 rounded bg-background/95 px-2 py-1 text-[11px] font-semibold text-forest tabular-nums">
                            {product.rating.toFixed(1)}{typeof product.review_count === "number" && <span className="text-muted-foreground"> | {product.review_count}</span>}
                          </span>
                        )}
                      </Link>
                      <div className="p-3">
                        <Link to="/product/$id" params={{ id: product.id }} onClick={closeCart} className="block truncate font-display text-base font-bold text-forest">{product.title}</Link>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="text-sm font-bold tabular-nums text-forest">{typeof price === "number" ? inr(price) : ""}</span>
                          <button
                            type="button"
                            disabled={!payload}
                            aria-label={`Add ${product.title} to cart`}
                            onClick={() => { if (payload) addItem(payload, { openDrawer: false }); }}
                            className="flex size-9 items-center justify-center rounded-full bg-forest text-forest-foreground transition-colors duration-200 hover:bg-forest/90 disabled:opacity-40"
                          >
                            <ShoppingBag className="size-4" />
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </div>

        {items.length > 0 && (
          <footer className="border-t border-border bg-background px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-display text-2xl font-extrabold tabular-nums text-forest">{inr(subtotal)}</p>
                <button type="button" onClick={() => setShowBreakdown((v) => !v)} aria-expanded={showBreakdown} className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  Inclusive of all taxes
                  <ChevronDown className={`size-4 transition-transform duration-200 ${showBreakdown ? "rotate-180" : ""}`} />
                </button>
              </div>
              <Button asChild size="lg" className="rounded-full bg-forest px-10 text-sm font-bold uppercase tracking-wide text-forest-foreground hover:bg-forest/90" onClick={closeCart}>
                <Link to="/checkout">Checkout</Link>
              </Button>
            </div>
            {showBreakdown && (
              <div className="mt-3 space-y-1 border-t border-border pt-3 text-xs text-muted-foreground">
                <p className="flex justify-between"><span>Items ({count})</span><span className="tabular-nums">{inr(subtotal)}</span></p>
                <p>Delivery, tax and discounts are confirmed by the nursery at checkout.</p>
              </div>
            )}
          </footer>
        )}
      </SheetContent>
    </Sheet>
  );
}
