import { Check, Minus, X } from "lucide-react";
import type { ProductComparison, ProductComparisonCell } from "@/types/api";

const statusIcon = {
  positive: Check,
  negative: X,
  mixed: Minus,
} as const;

function ComparisonValue({ cell, featured = false }: { cell: ProductComparisonCell; featured?: boolean }) {
  const Icon = statusIcon[cell.status];
  return (
    <div className={`flex min-w-0 flex-col items-center justify-center px-2 py-3 text-center sm:px-3 ${featured ? "text-primary-foreground" : "text-forest"}`}>
      <Icon className={`size-4 shrink-0 stroke-[2.5] ${featured ? "text-star" : "text-forest"}`} aria-hidden="true" />
      {cell.title && <p className="mt-1.5 text-[11px] font-bold leading-4 sm:text-xs">{cell.title}</p>}
      {cell.badge && <span className="mt-1 rounded-sm bg-star px-1.5 py-0.5 text-[9px] font-bold leading-3 text-foreground sm:text-[10px]">{cell.badge}</span>}
      {cell.detail && <p className={`mt-1 text-[10px] leading-4 sm:text-[11px] ${featured ? "text-primary-foreground/85" : "text-muted-foreground"}`}>{cell.detail}</p>}
    </div>
  );
}

export function ComparisonSection({ comparison }: { comparison?: ProductComparison | undefined }) {
  if (!comparison?.image || comparison.rows.length === 0) return null;
  const brandLabel = comparison.brand_label || "MyGarden";

  return (
    <section className="bg-storefront-wash py-8 sm:py-10 lg:py-12" aria-labelledby="comparison-title">
      <div className="mx-auto grid max-w-[1480px] gap-9 px-4 sm:px-6 lg:grid-cols-[minmax(0,.9fr)_minmax(660px,1.1fr)] lg:items-center lg:gap-12 lg:px-10">
        <div className="min-w-0 text-center lg:text-left">
          {(comparison.image_title || comparison.image_subtitle) && (
            <div className="mx-auto mb-5 max-w-xl lg:mx-0">
              {comparison.image_title && <h2 className="text-2xl italic leading-tight text-forest sm:text-3xl">{comparison.image_title}</h2>}
              {comparison.image_subtitle && <p className="mt-1 text-sm text-forest/80 sm:text-base">{comparison.image_subtitle}</p>}
            </div>
          )}
          <div className="mx-auto aspect-square max-w-[610px] overflow-hidden lg:mx-0">
            <img src={comparison.image} alt={comparison.image_alt || "Potted nursery plant"} width={1200} height={1200} loading="lazy" className="size-full object-cover" />
          </div>
        </div>

        <div className="min-w-0">
          <h2 id="comparison-title" className="mb-8 text-center text-3xl leading-tight text-foreground sm:text-4xl lg:text-5xl">{comparison.title || `${brandLabel} vs the Rest`}</h2>

          <div className="hidden grid-cols-[150px_repeat(3,minmax(0,1fr))] sm:grid">
            <div className="rounded-tl-md bg-forest" />
            <div className="flex min-h-16 items-center justify-center bg-forest px-3 text-center text-base font-semibold leading-5 text-forest-foreground">{comparison.local_label || "Local Nurseries"}</div>
            <div className="-mt-4 flex min-h-20 items-center justify-center rounded-t-lg bg-primary px-3 text-center text-lg font-bold text-primary-foreground shadow-card-hover">{brandLabel}</div>
            <div className="flex min-h-16 items-center justify-center rounded-tr-md bg-forest px-3 text-center text-base font-semibold text-forest-foreground">{comparison.others_label || "Others"}</div>

            {comparison.rows.map((row, index) => {
              const isLast = index === comparison.rows.length - 1;
              return (
                <div key={`${row.label}-${index}`} className="contents">
                  <div className={`flex min-h-[72px] items-center border-b border-border px-3 text-sm font-semibold leading-5 text-forest ${isLast ? "rounded-bl-md" : ""}`}>{row.label}</div>
                  <div className="min-h-[72px] border-b border-l border-border"><ComparisonValue cell={row.local} /></div>
                  <div className={`min-h-[72px] border-b border-primary-foreground/15 bg-primary ${isLast ? "rounded-b-lg" : ""}`}><ComparisonValue cell={row.brand} featured /></div>
                  <div className={`min-h-[72px] border-b border-border ${isLast ? "rounded-br-md" : ""}`}><ComparisonValue cell={row.others} /></div>
                </div>
              );
            })}
          </div>

          <div className="space-y-3 sm:hidden">
            <div className="grid grid-cols-3 overflow-hidden rounded-t-md bg-forest text-center text-[11px] font-semibold leading-4 text-forest-foreground">
              <span className="flex min-h-12 items-center justify-center px-1">{comparison.local_label || "Local Nurseries"}</span>
              <span className="flex min-h-12 items-center justify-center bg-primary px-1 font-bold">{brandLabel}</span>
              <span className="flex min-h-12 items-center justify-center px-1">{comparison.others_label || "Others"}</span>
            </div>
            {comparison.rows.map((row, index) => (
              <div key={`${row.label}-mobile-${index}`} className="overflow-hidden rounded-md border border-border bg-background">
                <h3 className="border-b border-border px-3 py-2 text-center text-xs font-bold text-forest">{row.label}</h3>
                <div className="grid grid-cols-3">
                  <ComparisonValue cell={row.local} />
                  <div className="bg-primary"><ComparisonValue cell={row.brand} featured /></div>
                  <ComparisonValue cell={row.others} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}