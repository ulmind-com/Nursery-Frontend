import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Check, ChevronLeft, ShoppingCart, Zap } from "lucide-react";
import { toast } from "sonner";
import { combosApi, queryKeys } from "@/api/services";
import { EmptyState, PageSkeleton } from "@/components/shared/page-state";
import { money } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import { dealLine } from "@/routes/combos.index";
import type { CartItem, ComboEntry } from "@/types/api";

export const Route = createFileRoute("/combos/$id")({
  head: () => ({ meta: [{ title: "Plant Combo | MyGarden" }] }),
  component: Page,
});

const toCartItem = (entry: ComboEntry): CartItem => ({
  product_id: entry.product_id,
  title: entry.title,
  ...(entry.image ? { image: entry.image } : {}),
  qty: 1,
  ...(entry.size_variant ? { size_variant: entry.size_variant } : {}),
  ...(entry.pot_type ? { pot_type: entry.pot_type } : {}),
  unit_price: entry.price,
  ...(entry.mrp ? { mrp: entry.mrp } : {}),
  stock: entry.stock,
  ...(entry.sku ? { sku: entry.sku } : {}),
});

function PlantTile({
  entry,
  picked,
  locked,
  onToggle,
}: {
  entry: ComboEntry;
  picked: boolean;
  locked: boolean;
  onToggle: () => void;
}) {
  const sold = !entry.in_stock;
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border bg-card transition ${
        picked ? "border-primary ring-2 ring-primary/40" : "border-border"
      } ${sold ? "opacity-55" : ""}`}
    >
      <Link
        to="/product/$id"
        params={{ id: entry.product_id }}
        className="block aspect-square overflow-hidden bg-primary-soft"
      >
        {entry.image ? (
          <img src={entry.image} alt={entry.title} loading="lazy" className="size-full object-cover" />
        ) : (
          <span className="flex size-full items-center justify-center px-3 text-center text-xs text-muted-foreground">
            Image coming soon
          </span>
        )}
      </Link>

      {picked && (
        <span className="absolute left-2 top-2 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
          <Check className="size-4" aria-hidden="true" />
        </span>
      )}

      <div className="p-3">
        <Link
          to="/product/$id"
          params={{ id: entry.product_id }}
          className="line-clamp-2 text-sm font-semibold text-forest hover:text-primary"
        >
          {entry.title}
        </Link>
        <p className="mt-0.5 text-[11px] text-muted-foreground">
          {entry.size_variant ? `Size ${entry.size_variant} · ` : ""}
          {sold ? "Out of stock" : `${money(entry.price)} on its own`}
        </p>

        {!locked && (
          <Button
            type="button"
            variant={picked ? "default" : "outline"}
            disabled={sold}
            onClick={onToggle}
            className="mt-3 h-9 w-full rounded-full text-xs"
          >
            {sold ? "Out of stock" : picked ? "Selected" : "Select"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Page() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { addItem, openCart } = useCart();
  const q = useQuery({ queryKey: queryKeys.combo(id), queryFn: () => combosApi.get(id) });

  const combo = q.data;
  const entries = useMemo(() => combo?.products ?? [], [combo]);
  /* A fixed bundle has nothing to choose, so every in-stock plant is already in. */
  const locked = Boolean(combo?.is_fixed);
  const [chosen, setChosen] = useState<string[]>([]);

  if (q.isLoading) return <PageSkeleton />;
  if (q.isError || !combo)
    return (
      <div className="mx-auto max-w-[1480px] px-6 py-12 lg:px-10">
        <EmptyState title="Bundle not found" description="This combo may have ended. Browse the others instead." />
      </div>
    );

  const available = entries.filter((entry) => entry.in_stock);
  const selected: ComboEntry[] = locked ? available.slice(0, combo.qty) : available.filter((e) => chosen.includes(e.key));
  const need = combo.qty - selected.length;
  const ready = selected.length === combo.qty;
  const regular = selected.reduce((sum, entry) => sum + entry.price, 0);
  const saving = ready && regular > combo.price ? regular - combo.price : 0;

  const toggle = (entry: ComboEntry) =>
    setChosen((current) => {
      if (current.includes(entry.key)) return current.filter((key) => key !== entry.key);
      /* Past the required count the oldest pick drops out, so the customer
         never has to deselect before choosing something else. */
      const next = [...current, entry.key];
      return next.length > combo.qty ? next.slice(next.length - combo.qty) : next;
    });

  const addBundle = () => {
    selected.forEach((entry) => addItem(toCartItem(entry), { openDrawer: false }));
    toast.success(`${combo.name} added — ${combo.qty} plants for ${money(combo.price)}`, {
      description: "The bundle price is applied at checkout.",
      action: { label: "View cart", onClick: openCart },
    });
  };

  const buyNow = async () => {
    selected.forEach((entry) => addItem(toCartItem(entry), { openDrawer: false }));
    await navigate({ to: "/checkout" });
  };

  return (
    <div className="mx-auto max-w-[1480px] px-6 py-10 lg:px-10">
      <Link to="/combos" className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-forest">
        <ChevronLeft className="size-4" aria-hidden="true" /> All combos
      </Link>

      <header className="mt-4">
        <span className="rounded-full bg-star px-3 py-1 text-xs font-bold uppercase tracking-wide text-forest">
          {dealLine(combo)}
        </span>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl">{combo.name}</h1>
        {combo.description && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{combo.description}</p>
        )}
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <h2 className="text-lg font-bold text-forest">
            {locked ? "What's in this bundle" : `Pick any ${combo.qty} of these ${entries.length}`}
          </h2>
          {!locked && (
            <p className="mt-1 text-sm text-muted-foreground">
              {ready ? "Your bundle is ready." : `Choose ${need} more ${need === 1 ? "plant" : "plants"}.`}
            </p>
          )}

          {entries.length === 0 ? (
            <EmptyState
              title="This bundle has no plants yet"
              description="The nursery is still filling it in — check back shortly."
            />
          ) : (
            <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {entries.map((entry) => (
                <PlantTile
                  key={entry.key}
                  entry={entry}
                  locked={locked}
                  picked={selected.some((item) => item.key === entry.key)}
                  onToggle={() => toggle(entry)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Summary rides along on desktop and sits under the grid on a phone. */}
        <aside className="h-fit lg:sticky lg:top-24">
          <div className="surface-card p-5">
            <h2 className="text-base font-bold text-forest">Your bundle</h2>

            <ul className="mt-4 space-y-3">
              {selected.map((entry) => (
                <li key={entry.key} className="flex items-center gap-3">
                  <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-primary-soft">
                    {entry.image && <img src={entry.image} alt="" className="size-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-medium text-forest">{entry.title}</p>
                    <p className="text-xs text-muted-foreground">{money(entry.price)}</p>
                  </div>
                </li>
              ))}
              {Array.from({ length: Math.max(0, need) }, (_, i) => (
                <li key={`slot-${i}`} className="flex items-center gap-3">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted-foreground">
                    +
                  </div>
                  <p className="text-sm text-muted-foreground">Choose a plant</p>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-1.5 border-t border-border pt-4 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <dt>Bought separately</dt>
                <dd className="price-num">{ready ? money(regular) : "—"}</dd>
              </div>
              <div className="flex justify-between font-bold text-forest">
                <dt>Bundle price</dt>
                <dd className="price-num text-lg">{money(combo.price)}</dd>
              </div>
              {saving > 0 && (
                <div className="flex justify-between text-primary">
                  <dt>You save</dt>
                  <dd className="price-num font-bold">{money(saving)}</dd>
                </div>
              )}
            </dl>

            <p className="mt-3 text-[11px] leading-4 text-muted-foreground">
              Plants go into your cart at their normal price — the bundle discount is applied automatically at checkout.
            </p>

            <div className="mt-4 grid gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={!ready}
                onClick={addBundle}
                className="h-11 w-full gap-2 rounded-full text-sm font-semibold"
              >
                <ShoppingCart className="size-4" aria-hidden="true" /> Add bundle to cart
              </Button>
              <Button
                type="button"
                disabled={!ready}
                onClick={buyNow}
                className="h-11 w-full gap-2 rounded-full bg-forest text-sm font-semibold text-forest-foreground hover:bg-forest/90"
              >
                <Zap className="size-4" aria-hidden="true" /> Buy now
              </Button>
            </div>

            {!ready && (
              <p className="mt-2 text-center text-xs text-muted-foreground">
                {available.length < combo.qty
                  ? "Not enough plants in stock for this bundle right now."
                  : `Select ${need} more to continue.`}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
