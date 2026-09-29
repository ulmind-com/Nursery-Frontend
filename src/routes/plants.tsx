import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CataloguePage, type CatalogueFilters } from "@/components/product/catalogue-page";

/* Facet groups arrive as repeated params and must survive a reload, so an
   array stays an array and a lone value is lifted into one. Everything else is
   a scalar. Unknown keys are dropped rather than forwarded to the API. */
const SCALARS = ["q", "sort_by"] as const;
const FLAGS = ["pet_safe", "air_purifying", "flowering", "fragrant", "medicinal", "is_bestseller", "is_new_arrival"] as const;
const NUMBERS = ["min_price", "max_price"] as const;
const GROUPS = ["plant_type", "sunlight", "watering", "difficulty", "growth_rate", "season", "flower_color", "soil_type", "pot_type", "pot_size"] as const;

function parseSearch(raw: Record<string, unknown>): CatalogueFilters {
  const out: CatalogueFilters = {};

  SCALARS.forEach((key) => {
    const value = raw[key];
    if (typeof value === "string" && value) out[key] = value;
  });
  FLAGS.forEach((key) => {
    if (raw[key] === true || raw[key] === "true") out[key] = true;
  });
  NUMBERS.forEach((key) => {
    const value = Number(raw[key]);
    if (Number.isFinite(value) && value > 0) out[key] = value;
  });
  GROUPS.forEach((key) => {
    const value = raw[key];
    const list = (Array.isArray(value) ? value : [value]).filter(
      (v): v is string => typeof v === "string" && v !== "",
    );
    if (list.length) out[key] = list;
  });

  if (raw["in_stock"] === true || raw["in_stock"] === "true") out.in_stock = true;
  else if (raw["in_stock"] === false || raw["in_stock"] === "false") out.in_stock = false;

  return out;
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
