import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { combosApi, queryKeys } from "@/api/services";
import { EmptyState, PageSkeleton } from "@/components/shared/page-state";
import { money } from "@/components/product/product-card";
import type { Combo } from "@/types/api";

export const Route = createFileRoute("/combos/")({
  head: () => ({
    meta: [
      { title: "Plant Combos | MyGarden" },
      { name: "description", content: "Curated plant combinations for thoughtful green spaces." },
      { property: "og:title", content: "Plant Combos | MyGarden" },
      { property: "og:description", content: "Curated plant combinations." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

/** "Any 3 for ₹300" / "3 plants for ₹300" — the headline of every bundle. */
export function dealLine(combo: Combo): string {
  const unit = combo.qty === 1 ? "plant" : "plants";
  return combo.is_fixed ? `${combo.qty} ${unit} for ${money(combo.price)}` : `Any ${combo.qty} for ${money(combo.price)}`;
}

function ComboCard({ combo }: { combo: Combo }) {
  const entries = combo.products ?? [];
  const inStock = entries.filter((entry) => entry.in_stock).length;
  const enough = inStock >= combo.qty;

  return (
    <article className="surface-card group flex flex-col overflow-hidden">
      {/* The pool itself is the artwork — a tile per plant in the bundle. */}
      <div className="grid grid-cols-2 gap-px bg-border">
        {entries.slice(0, 4).map((entry) => (
          <div key={entry.key} className="aspect-square overflow-hidden bg-primary-soft">
            {entry.image ? (
              <img
                src={entry.image}
                alt={entry.title}
                loading="lazy"
                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <span className="flex size-full items-center justify-center text-[11px] text-muted-foreground">
                {entry.title}
              </span>
            )}
          </div>
        ))}
        {entries.length === 0 && (
          <div className="col-span-2 flex aspect-[2/1] items-center justify-center bg-primary-soft text-sm text-muted-foreground">
            Bundle items coming soon
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <span className="w-fit rounded-full bg-star px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-forest">
          {dealLine(combo)}
        </span>
        <h2 className="mt-3 font-display text-xl text-forest">{combo.name}</h2>
        {combo.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{combo.description}</p>
        )}

        <div className="mt-4 flex items-baseline gap-2">
          <span className="price-num text-2xl font-extrabold text-forest">{money(combo.price)}</span>
          {combo.regular_total ? (
            <span className="price-num text-sm text-muted-foreground line-through">{money(combo.regular_total)}</span>
          ) : null}
          {combo.savings ? (
            <span className="text-xs font-bold text-primary">Save {money(combo.savings)}</span>
          ) : null}
        </div>

        <p className="mt-2 text-xs text-muted-foreground">
          {combo.is_fixed
            ? `${entries.length} plants included`
            : `Pick any ${combo.qty} from ${entries.length} plants`}
          {!enough && entries.length > 0 && " · some are out of stock"}
        </p>

        <Link
          to="/combos/$id"
          params={{ id: combo.id }}
          className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-forest text-sm font-semibold text-forest-foreground transition hover:bg-forest/90"
        >
          {combo.is_fixed ? "View bundle" : "Build this bundle"}
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

function Page() {
  const q = useQuery({ queryKey: queryKeys.combos, queryFn: combosApi.list });
  if (q.isLoading) return <PageSkeleton />;

  const combos = q.data ?? [];

  return (
    <div className="mx-auto max-w-[1480px] px-6 py-12 lg:px-10">
      <h1 className="font-display text-4xl">Curated plant combos</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
        Hand-picked sets at a bundle price. Choose your plants, add them in one tap, and the discount is applied at
        checkout.
      </p>

      {combos.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {combos.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="New combinations are taking root"
          description="Curated plant sets will appear here when the nursery publishes them."
        />
      )}
    </div>
  );
}
