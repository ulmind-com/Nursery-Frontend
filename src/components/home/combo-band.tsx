import { Link } from "@tanstack/react-router";
import { money } from "@/components/product/product-card";
import { dealLine } from "@/routes/combos.index";
import type { Combo } from "@/types/api";

/* A bundle's artwork is optional, so the pool doubles as the cover: one photo
   fills the tile, two to four tile into a grid. */
function ComboCover({ combo }: { combo: Combo }) {
  const entries = (combo.products ?? []).filter((entry) => entry.image);

  if (combo.image) {
    return (
      <img
        src={combo.image}
        alt={combo.name}
        loading="lazy"
        className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
    );
  }

  if (entries.length === 0) {
    return (
      <span className="flex size-full items-center justify-center bg-primary-soft px-4 text-center text-xs text-muted-foreground">
        Bundle photos coming soon
      </span>
    );
  }

  const tiles = entries.slice(0, entries.length === 1 ? 1 : 4);
  return (
    <div className={`grid size-full gap-px bg-border ${tiles.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
      {tiles.map((entry) => (
        <img
          key={entry.key}
          src={entry.image ?? ""}
          alt={entry.title}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />
      ))}
    </div>
  );
}

function ComboCard({ combo }: { combo: Combo }) {
  const saving = combo.savings ?? 0;
  const percent = combo.regular_total ? Math.round((saving / combo.regular_total) * 100) : 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card shadow-[0_1px_2px_rgba(16,24,40,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-18px_rgba(16,24,40,0.28)]">
      <Link
        to="/combos/$id"
        params={{ id: combo.id }}
        className="relative block aspect-square overflow-hidden bg-muted"
      >
        <ComboCover combo={combo} />
        {percent > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-forest px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-background shadow-sm">
            {percent}% off
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link to="/combos/$id" params={{ id: combo.id }}>
          <h3 className="line-clamp-1 text-base font-semibold text-forest transition-colors group-hover:text-primary sm:text-lg">
            {combo.name}
          </h3>
        </Link>

        <span className="mt-2 w-fit rounded-md bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-forest">
          bundle
        </span>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="price-num text-lg font-extrabold text-forest">{money(combo.price)}</span>
          {combo.regular_total && combo.regular_total > combo.price ? (
            <span className="price-num text-xs font-medium text-muted-foreground line-through sm:text-sm">
              {money(combo.regular_total)}
            </span>
          ) : null}
        </div>

        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{dealLine(combo)}</p>

        {/* A bundle is not one SKU — its plants are chosen on the bundle page,
            so the button opens that rather than dropping straight into the cart. */}
        <Link
          to="/combos/$id"
          params={{ id: combo.id }}
          className="mt-4 flex h-11 items-center justify-center rounded-lg bg-forest text-xs font-bold uppercase tracking-wide text-background transition-colors hover:bg-primary sm:text-sm"
        >
          {combo.is_fixed ? "View bundle" : "Build this bundle"}
        </Link>
      </div>
    </article>
  );
}

export function ComboBand({
  combos,
  title = "Ready to Buy Combos",
  subtitle,
  ctaLabel = "View all combos",
  ctaLink = "/combos",
  limit = 8,
}: {
  combos: Combo[];
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
  limit?: number;
}) {
  /* Four across on a desktop, so the shipped limit of 8 is the two rows this
     band is meant to be. */
  const shown = combos.slice(0, limit);
  if (shown.length === 0) return null;

  return (
    <section className="bg-storefront-wash py-12 lg:py-16">
      <div className="mx-auto max-w-[1480px] px-3 sm:px-6 lg:px-9">
        <div className="mb-8 text-center lg:mb-10">
          <h2 className="font-display text-3xl font-extrabold text-forest sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {shown.map((combo) => (
            <ComboCard key={combo.id} combo={combo} />
          ))}
        </div>

        {ctaLabel && (
          <div className="mt-8 text-center lg:mt-10">
            <Link
              to={ctaLink}
              className="inline-flex items-center gap-2 rounded-full border border-forest px-7 py-3 text-sm font-semibold text-forest transition-colors hover:bg-forest hover:text-background"
            >
              {ctaLabel} →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
