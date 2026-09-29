import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Minus, Plus, SlidersHorizontal, X } from "lucide-react";
import { productsApi, facetsApi } from "@/api/services";
import { ProductCard } from "./product-card";
import { CategoryPreviewGrid } from "@/components/category/category-preview-grid";
import { EmptyState, ErrorState, PageSkeleton } from "@/components/shared/page-state";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Facets, Product } from "@/types/api";

/* Filters are flat so they serialise straight into the query string the API
   already understands: a facet group is its `param` holding an array of picked
   values, and everything else is a scalar. */
export type CatalogueFilters = {
  q?: string;
  sort_by?: string;
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
  [param: string]: string | string[] | number | boolean | undefined;
};

/** Clearing a filter means passing `undefined`, which the exact-optional
 *  filter type itself does not allow — so patches get their own looser type. */
type FilterPatch = Record<string, string | string[] | number | boolean | undefined>;

const SORTS: Array<{ label: string; value: string }> = [
  { label: "Recommended", value: "" },
  { label: "Best selling", value: "popularity" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Best rated", value: "rating" },
];

const PRICE_BANDS: Array<{ label: string; min?: number; max?: number }> = [
  { label: "Under ₹299", max: 299 },
  { label: "₹299 – ₹699", min: 299, max: 699 },
  { label: "₹699 – ₹1,499", min: 699, max: 1499 },
  { label: "Above ₹1,499", min: 1499 },
];

const money = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

/** One collapsible group in the sidebar. Open by default on the first few so
 *  the panel does not read as an empty list of headings. */
function Group({ label, defaultOpen = false, children }: { label: string; defaultOpen?: boolean; children: React.ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border/70">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-left text-sm font-semibold text-forest transition-colors hover:text-primary"
      >
        {label}
        {open ? <Minus className="size-4 shrink-0" /> : <Plus className="size-4 shrink-0" />}
      </button>
      {open && <div className="space-y-2.5 pb-5">{children}</div>}
    </div>
  );
}

function Check({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground transition-colors hover:text-primary">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 shrink-0 accent-[var(--color-forest,#14532d)]"
      />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      {typeof count === "number" && <span className="shrink-0 text-xs text-muted-foreground">({count})</span>}
    </label>
  );
}

export function CataloguePage({
  title,
  description,
  params = {},
  filters,
  onFiltersChange,
  hideHeader = false,
  previewCategory,
}: {
  title: string;
  description?: string;
  params?: Record<string, string | number | boolean | undefined>;
  filters?: CatalogueFilters;
  onFiltersChange?: (next: CatalogueFilters) => void;
  hideHeader?: boolean;
  previewCategory?: string;
}) {
  const [limit, setLimit] = useState(24);
  const active = filters ?? {};
  const editable = Boolean(onFiltersChange);
  const queryParams = { ...params, ...active, limit };
  const query = useQuery({ queryKey: ["products", queryParams], queryFn: () => productsApi.list(queryParams) });

  /* The sidebar is built from the catalogue, so it can only ever offer values
     that have products behind them. */
  const categoryId = typeof params["category_id"] === "string" ? params["category_id"] : undefined;
  const facetQuery = useQuery({
    queryKey: ["product-facets", categoryId ?? null],
    queryFn: () => facetsApi.get(categoryId),
    enabled: editable,
  });
  const facets: Facets | undefined = facetQuery.data;

  const set = (patch: FilterPatch) => {
    if (!onFiltersChange) return;
    const next: FilterPatch = { ...active, ...patch };
    Object.keys(next).forEach((key) => {
      const value = next[key];
      const empty = value === undefined || value === "" || (Array.isArray(value) && value.length === 0);
      // `in_stock: false` is a real choice ("Out of stock"), so only the flags
      // treat false as "not applied".
      if (empty || (value === false && key !== "in_stock")) delete next[key];
    });
    onFiltersChange(next as CatalogueFilters);
  };

  const picked = (param: string): string[] => {
    const value = active[param];
    return Array.isArray(value) ? value : typeof value === "string" && value ? [value] : [];
  };

  const toggleValue = (param: string, value: string) => {
    const current = picked(param);
    const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
    set({ [param]: next });
  };

  /* Every applied filter as a removable chip, including one per picked value
     inside a group — a single "Sunlight" chip would clear three choices. */
  const chips: Array<{ id: string; label: string; clear: () => void }> = [];
  Object.entries(active).forEach(([key, value]) => {
    if (key === "sort_by" || key === "q") return;
    if (key === "min_price" || key === "max_price") return;
    if (key === "in_stock") {
      chips.push({ id: key, label: value === true ? "In stock" : "Out of stock", clear: () => set({ in_stock: undefined }) });
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((v) =>
        chips.push({ id: `${key}:${v}`, label: v, clear: () => toggleValue(key, v) }),
      );
      return;
    }
    if (value === true) {
      const flag = facets?.flags.find((f) => f.param === key);
      chips.push({ id: key, label: flag?.label ?? key, clear: () => set({ [key]: undefined }) });
    }
  });
  if (active.min_price !== undefined || active.max_price !== undefined) {
    const band = PRICE_BANDS.find((b) => b.min === active.min_price && b.max === active.max_price);
    chips.push({
      id: "price",
      label: band?.label ?? `${money(Number(active.min_price ?? 0))} – ${money(Number(active.max_price ?? 0))}`,
      clear: () => set({ min_price: undefined, max_price: undefined }),
    });
  }

  const result = query.data;
  const products: Product[] = Array.isArray(result) ? result : result?.items || [];
  const canLoadMore = products.length >= limit;

  const filterPanel = (
    <div>
      <Group label="Availability" defaultOpen>
        {(facets?.availability ?? []).map((option) => (
          <Check
            key={option.value}
            label={option.label}
            count={option.count}
            checked={active.in_stock === (option.value === "in_stock")}
            onChange={() =>
              set({
                in_stock:
                  active.in_stock === (option.value === "in_stock") ? undefined : option.value === "in_stock",
              })
            }
          />
        ))}
      </Group>

      <Group label="Price" defaultOpen>
        {PRICE_BANDS.map((band) => (
          <Check
            key={band.label}
            label={band.label}
            checked={active.min_price === band.min && active.max_price === band.max}
            onChange={() =>
              set(
                active.min_price === band.min && active.max_price === band.max
                  ? { min_price: undefined, max_price: undefined }
                  : { min_price: band.min, max_price: band.max },
              )
            }
          />
        ))}
      </Group>

      {(facets?.groups ?? []).map((group, index) => (
        <Group key={group.param} label={group.label} defaultOpen={index === 0}>
          {group.options.map((option) => (
            <Check
              key={option.value}
              label={option.value}
              count={option.count}
              checked={picked(group.param).includes(option.value)}
              onChange={() => toggleValue(group.param, option.value)}
            />
          ))}
        </Group>
      ))}

      {(facets?.flags ?? []).length > 0 && (
        <Group label="Good to know">
          {facets?.flags.map((flag) => (
            <Check
              key={flag.param}
              label={flag.label}
              count={flag.count}
              checked={active[flag.param] === true}
              onChange={() => set({ [flag.param]: active[flag.param] === true ? undefined : true })}
            />
          ))}
        </Group>
      )}
    </div>
  );

  return (
    <div className={`mx-auto max-w-[1480px] px-3 sm:px-6 lg:px-9 ${hideHeader ? "border-t border-border pb-12 lg:pb-16" : "py-10"}`}>
      {!hideHeader && (
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The nursery edit</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">{title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description || "Thoughtfully selected plants and garden essentials for every kind of home."}
          </p>
        </header>
      )}

      <div className="flex gap-8">
        {/* The sidebar is always visible from `lg` up; below that the same panel
            is what the Filter button opens. */}
        {editable && (
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24">{filterPanel}</div>
          </aside>
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-5 flex h-14 items-center gap-3 sm:h-16">
            {editable && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="px-0 text-xs font-semibold uppercase text-forest hover:bg-transparent hover:text-primary sm:text-sm lg:hidden">
                    <SlidersHorizontal className="size-4" /> Filter
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[min(90vw,390px)] overflow-y-auto">
                  <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                  <div className="px-4 pb-8">{filterPanel}</div>
                </SheetContent>
              </Sheet>
            )}

            {facets && (
              <p className="hidden text-sm text-muted-foreground lg:block">
                There {products.length === 1 ? "is" : "are"} {products.length} result{products.length === 1 ? "" : "s"}
                {products.length >= limit ? "+" : ""} in total
              </p>
            )}

            {editable && (
              <label className="ml-auto flex items-center gap-2 text-xs font-medium text-forest sm:text-sm">
                Sort by
                <select
                  value={typeof active.sort_by === "string" ? active.sort_by : ""}
                  onChange={(e) => set({ sort_by: e.target.value || undefined })}
                  className="max-w-32 border-0 bg-transparent py-2 text-xs font-medium text-forest outline-none sm:max-w-none sm:text-sm"
                >
                  {SORTS.map((sort) => <option key={sort.label} value={sort.value}>{sort.label}</option>)}
                </select>
              </label>
            )}
          </div>

          {chips.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={chip.clear}
                  className="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary-soft-foreground"
                >
                  {chip.label}<X className="size-3" />
                </button>
              ))}
              <button type="button" onClick={() => onFiltersChange?.({})} className="px-2 text-xs font-semibold text-muted-foreground underline">
                Clear all
              </button>
            </div>
          )}

          {query.isLoading ? (
            <PageSkeleton />
          ) : query.isError ? (
            <ErrorState retry={() => void query.refetch()} />
          ) : products.length ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-x-5 lg:gap-y-8">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
              {canLoadMore && (
                <div className="mt-12 text-center">
                  <Button variant="outline" size="lg" onClick={() => setLimit((l) => l + 24)}>Load more plants</Button>
                </div>
              )}
            </>
          ) : previewCategory ? (
            <CategoryPreviewGrid slug={previewCategory} />
          ) : (
            <EmptyState title="Nothing matches yet" description="Try removing a filter or exploring a different collection." />
          )}
        </div>
      </div>
    </div>
  );
}
