import { Check, X } from "lucide-react";

type CellStatus = "positive" | "negative" | "mixed";

interface Cell {
  status: CellStatus;
  title?: string;
  badge?: string;
}

export interface ComparisonRow {
  label: string;
  local: Cell;
  brand: Cell;
  others: Cell;
}

const BRAND_LABEL = "MyGarden";

export const defaultComparisonRows: ComparisonRow[] = [
  {
    label: "Plant quality",
    local: { status: "negative", title: "Poor health (No quality checks)" },
    brand: { status: "positive", title: "Green, healthy & bushy", badge: "3-step quality check" },
    others: { status: "mixed", title: "Inconsistent" },
  },
  {
    label: "Pests",
    local: { status: "negative", title: "Common issue" },
    brand: { status: "positive", title: "Pest-controlled" },
    others: { status: "negative", title: "Possible risk" },
  },
  {
    label: "Repotting",
    local: { status: "negative", title: "Requires repotting (Pot is missing)" },
    brand: { status: "positive", title: "Not required", badge: `Comes in a ${BRAND_LABEL} Gropot` },
    others: { status: "mixed", title: "Varies; not consistent" },
  },
  {
    label: "Soil",
    local: { status: "negative", title: "Standard soil" },
    brand: { status: "positive", title: "Pre-mixed", badge: "90-Day fertilised" },
    others: { status: "negative", title: "Standard soil" },
  },
  {
    label: "Growing conditions",
    local: { status: "negative", title: "Outsourced" },
    brand: { status: "positive", title: `Grown by experts on ${BRAND_LABEL} farms` },
    others: { status: "negative", title: "Outsourced" },
  },
  {
    label: "After-sale help",
    local: { status: "negative", title: "None" },
    brand: { status: "positive", title: "Expert support" },
    others: { status: "negative", title: "None" },
  },
  {
    label: "Guaranteed",
    local: { status: "negative", title: "No guarantee" },
    brand: { status: "positive", title: "Assured quality, 30 days replacement" },
    others: { status: "mixed", title: "Conditional" },
  },
  {
    label: "One-stop garden shop",
    local: { status: "negative" },
    brand: { status: "positive" },
    others: { status: "negative" },
  },
];

/* Featured column sits on a raised card, so its marks and copy invert to light-on-green */
function StatusMark({ status, featured }: { status: CellStatus; featured: boolean }) {
  if (status === "mixed") {
    return (
      <span aria-hidden="true" className="block text-xl font-bold leading-none text-forest/45 sm:text-2xl">
        ~
      </span>
    );
  }
  const Icon = status === "positive" ? Check : X;
  return (
    <Icon
      aria-hidden="true"
      className={`size-5 stroke-[3] sm:size-[1.4rem] ${
        featured ? "text-star" : status === "positive" ? "text-primary" : "text-forest/55"
      }`}
    />
  );
}

function ComparisonCell({ cell, featured = false }: { cell: Cell; featured?: boolean }) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-1.5 px-2 py-4 text-center sm:px-4 sm:py-5">
      <StatusMark status={cell.status} featured={featured} />
      {cell.title && (
        <p
          className={`max-w-[15ch] text-[11px] font-semibold leading-4 sm:max-w-none sm:text-[0.8125rem] sm:leading-5 ${
            featured ? "text-primary-foreground" : "text-forest/80"
          }`}
        >
          {cell.title}
        </p>
      )}
      {cell.badge && (
        <span className="rounded-full bg-star px-2 py-0.5 text-[9px] font-bold leading-4 text-forest shadow-sm sm:text-[0.6875rem]">
          {cell.badge}
        </span>
      )}
    </div>
  );
}

const GRID_COLS = "grid-cols-[minmax(120px,0.95fr)_repeat(3,minmax(0,1fr))]";

export function BrandComparisonSection({
  rows = defaultComparisonRows,
  title = `${BRAND_LABEL} vs the Rest`,
  brandLabel = BRAND_LABEL,
  localLabel = "Local Nurseries",
  othersLabel = "Others",
}: {
  rows?: ComparisonRow[];
  title?: string;
  brandLabel?: string;
  localLabel?: string;
  othersLabel?: string;
}) {
  if (rows.length === 0) return null;

  return (
    <section className="bg-storefront-wash py-14 lg:py-20" aria-labelledby="brand-comparison-title">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <h2
          id="brand-comparison-title"
          className="text-center font-display text-[2rem] font-extrabold tracking-tight text-forest sm:text-[2.75rem] lg:text-[3.5rem]"
        >
          {title}
        </h2>

        {/* Desktop / tablet: one table, featured column raised above the rest */}
        <div className="relative mx-auto mt-10 hidden max-w-[1180px] pb-6 pt-6 sm:block lg:mt-14">
          <div aria-hidden="true" className={`pointer-events-none absolute inset-0 grid ${GRID_COLS}`}>
            <div />
            <div />
            <div className="rounded-[1.75rem] bg-primary shadow-[0_30px_70px_-28px_oklch(0.378_0.077_168.94/0.75)] ring-1 ring-primary/40" />
            <div />
          </div>

          <div className={`relative grid ${GRID_COLS} overflow-hidden rounded-[1.5rem]`}>
            <div className="bg-forest" />
            <div className="flex min-h-[86px] items-center justify-center bg-forest px-3 text-center font-display text-lg font-bold text-forest-foreground lg:text-[1.375rem]">
              {localLabel}
            </div>
            <div className="flex min-h-[86px] items-center justify-center px-3 text-center font-display text-xl font-extrabold text-primary-foreground lg:text-[1.5rem]">
              {brandLabel}
            </div>
            <div className="flex min-h-[86px] items-center justify-center bg-forest px-3 text-center font-display text-lg font-bold text-forest-foreground lg:text-[1.375rem]">
              {othersLabel}
            </div>

            {rows.map((row, index) => {
              const isLast = index === rows.length - 1;
              const divider = isLast ? "" : "border-b border-border/70";
              return (
                <div key={row.label} className="contents">
                  <div
                    className={`flex items-center bg-primary-tint/50 px-4 py-4 font-display text-sm font-bold leading-5 text-forest lg:px-7 lg:text-base ${divider}`}
                  >
                    {row.label}
                  </div>
                  <div className={`bg-card ${divider}`}>
                    <ComparisonCell cell={row.local} />
                  </div>
                  <div className={isLast ? "" : "border-b border-primary-foreground/20"}>
                    <ComparisonCell cell={row.brand} featured />
                  </div>
                  <div className={`bg-card ${divider}`}>
                    <ComparisonCell cell={row.others} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: one card per attribute */}
        <div className="mt-8 space-y-3 sm:hidden">
          <div className="grid grid-cols-3 overflow-hidden rounded-xl bg-forest text-center font-display text-[11px] font-bold leading-4 text-forest-foreground">
            <span className="flex min-h-12 items-center justify-center px-1.5">{localLabel}</span>
            <span className="flex min-h-12 items-center justify-center bg-primary px-1.5 text-xs text-primary-foreground">
              {brandLabel}
            </span>
            <span className="flex min-h-12 items-center justify-center px-1.5">{othersLabel}</span>
          </div>

          {rows.map((row) => (
            <div key={`${row.label}-mobile`} className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-card">
              <h3 className="bg-primary-tint/60 px-3 py-2 text-center font-display text-xs font-bold text-forest">
                {row.label}
              </h3>
              <div className="grid grid-cols-3 divide-x divide-border/70">
                <ComparisonCell cell={row.local} />
                <div className="bg-primary">
                  <ComparisonCell cell={row.brand} featured />
                </div>
                <ComparisonCell cell={row.others} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
