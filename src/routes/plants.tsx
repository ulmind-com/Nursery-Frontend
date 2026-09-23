import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CataloguePage, type CatalogueFilters } from "@/components/product/catalogue-page";

const STRING_KEYS = ["q", "plant_type", "sunlight", "watering", "difficulty", "sort_by"] as const;
const BOOL_KEYS = ["pet_safe", "air_purifying", "flowering", "is_bestseller", "is_new_arrival"] as const;
const NUM_KEYS = ["min_price", "max_price"] as const;

function parseSearch(raw: Record<string, unknown>): CatalogueFilters {
  const out: Record<string, string | boolean | number> = {};
  STRING_KEYS.forEach((key) => {
    const value = raw[key];
    if (typeof value === "string" && value) out[key] = value;
  });
  BOOL_KEYS.forEach((key) => {
    const value = raw[key];
    if (value === true || value === "true") out[key] = true;
  });
  NUM_KEYS.forEach((key) => {
    const value = Number(raw[key]);
    if (Number.isFinite(value) && value > 0) out[key] = value;
  });
  return out as CatalogueFilters;
}

export const Route = createFileRoute("/plants")({
  validateSearch: parseSearch,
  head: () => ({
    meta: [
      { title: "Plants | MyGarden" },
      { name: "description", content: "Explore healthy indoor and outdoor plants for Indian homes." },
      { property: "og:title", content: "Plants | MyGarden" },
      { property: "og:description", content: "Explore healthy indoor and outdoor plants for Indian homes." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: PlantsPage,
});

function PlantsPage() {
  const filters = Route.useSearch();
  const nav = useNavigate();
  return (
    <CataloguePage
      title="All plants"
      description="Indoor greens, flowering favourites, and hardy outdoor plants — grown and hardened at our nursery."
      filters={filters}
      onFiltersChange={(next) => void nav({ to: "/plants", search: next, replace: true })}
    />
  );
}
