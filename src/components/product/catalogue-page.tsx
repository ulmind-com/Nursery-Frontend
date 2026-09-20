import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { productsApi } from "@/api/services";
import { ProductCard } from "./product-card";
import { EmptyState, ErrorState, PageSkeleton } from "@/components/shared/page-state";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Product } from "@/types/api";

export type CatalogueFilters = {
  q?: string;
  plant_type?: string;
  sunlight?: string;
  watering?: string;
  difficulty?: string;
  pet_safe?: boolean;
  air_purifying?: boolean;
  flowering?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
};

type FilterPatch = { [K in keyof CatalogueFilters]?: CatalogueFilters[K] | undefined };

const SORTS: Array<{ label: string; value: string }> = [
  { label: "Recommended", value: "" },
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Popular", value: "popular" },
  { label: "Best rated", value: "rating" },
];

const CHOICES: Array<{ key: keyof CatalogueFilters; label: string; options: string[] }> = [
  { key: "plant_type", label: "Plant type", options: ["Indoor", "Outdoor", "Succulent", "Flowering", "Herb", "Bonsai"] },
  { key: "sunlight", label: "Sunlight", options: ["Low Light", "Indirect Light", "Bright Light", "Full Sun"] },
  { key: "watering", label: "Watering", options: ["Low", "Moderate", "High"] },
  { key: "difficulty", label: "Care level", options: ["Easy", "Moderate", "Expert"] },
];

const TOGGLES: Array<{ key: keyof CatalogueFilters; label: string }> = [
  { key: "pet_safe", label: "Pet safe" },
  { key: "air_purifying", label: "Air purifying" },
  { key: "flowering", label: "Flowering" },
  { key: "is_bestseller", label: "Bestsellers" },
  { key: "is_new_arrival", label: "New arrivals" },
];

const PRICE_BANDS: Array<{ label: string; min?: number; max?: number }> = [
  { label: "Under ₹299", max: 299 },
  { label: "₹299 – ₹699", min: 299, max: 699 },
  { label: "₹699 – ₹1,499", min: 699, max: 1499 },
  { label: "Above ₹1,499", min: 1499 },
];

export function CataloguePage({
  title,
  description,
  params = {},
  filters,
  onFiltersChange,
}: {
  title: string;
  description?: string;
  params?: Record<string, string | number | boolean | undefined>;
  filters?: CatalogueFilters;
  onFiltersChange?: (next: CatalogueFilters) => void;
}) {
  const [limit, setLimit] = useState(24);
  const active = filters ?? {};
  const editable = Boolean(onFiltersChange);
  const queryParams = { ...params, ...active, limit };
  const query = useQuery({ queryKey: ["products", queryParams], queryFn: () => productsApi.list(queryParams) });

  const set = (patch: FilterPatch) => {
    if (!onFiltersChange) return;
    const next: CatalogueFilters = { ...active, ...patch };
    (Object.keys(next) as Array<keyof CatalogueFilters>).forEach((key) => {
      const value = next[key];
      if (value === undefined || value === "" || value === false) delete next[key];
    });
    onFiltersChange(next);
  };

  const activePills = (Object.entries(active) as Array<[keyof CatalogueFilters, string | number | boolean]>)
    .filter(([key]) => key !== "sort_by")
    .map(([key, value]) => ({
      key,
      label: typeof value === "boolean" ? TOGGLES.find((t) => t.key === key)?.label ?? String(key) : `${String(value)}`,
    }));

  const result = query.data;
  const products: Product[] = Array.isArray(result) ? result : result?.items || [];
  const canLoadMore = products.length >= limit;

  const filterPanel = (
    <div className="space-y-7">
      {CHOICES.map((group) => (
        <fieldset key={String(group.key)}>
          <legend className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">{group.label}</legend>
          <div className="flex flex-wrap gap-2">
            {group.options.map((option) => {
              const selected = active[group.key] === option;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => set({ [group.key]: selected ? undefined : option } as FilterPatch)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${selected ? "border-primary bg-primary-soft text-primary-soft-foreground" : "hover:border-primary hover:text-primary"}`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
      <fieldset>
        <legend className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Price</legend>
        <div className="flex flex-wrap gap-2">
          {PRICE_BANDS.map((band) => {
            const selected = active.min_price === band.min && active.max_price === band.max;
            return (
              <button
                key={band.label}
                type="button"
                aria-pressed={selected}
                onClick={() => set(selected ? { min_price: undefined, max_price: undefined } : { min_price: band.min, max_price: band.max })}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${selected ? "border-primary bg-primary-soft text-primary-soft-foreground" : "hover:border-primary hover:text-primary"}`}
              >
                {band.label}
              </button>
            );
          })}
        </div>
      </fieldset>
      <fieldset>
        <legend className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Good to know</legend>
        <div className="flex flex-wrap gap-2">
          {TOGGLES.map((toggle) => {
            const selected = active[toggle.key] === true;
            return (
              <button
                key={String(toggle.key)}
                type="button"
                aria-pressed={selected}
                onClick={() => set({ [toggle.key]: !selected } as FilterPatch)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors duration-200 ${selected ? "border-primary bg-primary-soft text-primary-soft-foreground" : "hover:border-primary hover:text-primary"}`}
              >
                {toggle.label}
              </button>
            );
          })}
        </div>
      </fieldset>
    </div>
  );

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-10">
      <header className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">The nursery edit</p>
        <h1 className="mt-2 text-3xl sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description || "Thoughtfully selected plants and garden essentials for every kind of home."}
        </p>
      </header>

      <div className={editable ? "grid gap-8 lg:grid-cols-[250px_1fr]" : ""}>
        {editable && <aside className="hidden h-fit lg:sticky lg:top-28 lg:block">{filterPanel}</aside>}
        <div>
          <div className="mb-6 flex flex-wrap items-center gap-3">
            {editable && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden"><SlidersHorizontal className="size-4" /> Filters</Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="max-h-[85vh] overflow-y-auto">
                  <SheetHeader><SheetTitle>Filters</SheetTitle></SheetHeader>
                  <div className="p-4">{filterPanel}</div>
                </SheetContent>
              </Sheet>
            )}
            {editable && (
              <label className="ml-auto flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                Sort
                <select
                  value={active.sort_by ?? ""}
                  onChange={(e) => set({ sort_by: e.target.value || undefined })}
                  className="rounded-md border bg-background px-3 py-2 text-xs font-semibold text-foreground"
                >
                  {SORTS.map((sort) => <option key={sort.label} value={sort.value}>{sort.label}</option>)}
                </select>
              </label>
            )}
          </div>

          {activePills.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {activePills.map((pill) => (
                <button
                  key={String(pill.key)}
                  type="button"
                  onClick={() => set(pill.key === "min_price" || pill.key === "max_price" ? { min_price: undefined, max_price: undefined } : ({ [pill.key]: undefined } as FilterPatch))}
                  className="flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1.5 text-xs font-semibold text-primary-soft-foreground"
                >
                  {pill.label}<X className="size-3" />
                </button>
              ))}
              <button type="button" onClick={() => onFiltersChange?.({})} className="px-2 text-xs font-semibold text-muted-foreground underline">Clear all</button>
            </div>
          )}

          {query.isLoading ? (
            <PageSkeleton />
          ) : query.isError ? (
            <ErrorState retry={() => void query.refetch()} />
          ) : products.length ? (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
              {canLoadMore && (
                <div className="mt-12 text-center">
                  <Button variant="outline" size="lg" onClick={() => setLimit((l) => l + 24)}>Load more plants</Button>
                </div>
              )}
            </>
          ) : (
            <EmptyState title="Nothing matches yet" description="Try removing a filter or exploring a different collection." />
          )}
        </div>
      </div>
    </div>
  );
}
