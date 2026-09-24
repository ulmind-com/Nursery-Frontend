import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { searchApi } from "@/api/services";
import { ProductGrid } from "@/components/product/product-card";
import { EmptyState } from "@/components/shared/page-state";
import { useTypewriter } from "@/hooks/use-typewriter";
import { SEARCH_PHRASES } from "@/lib/search-phrases";
import { Input } from "@/components/ui/input";
import type { Product } from "@/types/api";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): { q?: string } =>
    typeof s["q"] === "string" && s["q"] ? { q: s["q"] } : {},
  head: () => ({
    meta: [
      { title: "Search | MyGarden" },
      { name: "description", content: "Search plants, planters, and garden essentials." },
      { property: "og:title", content: "Search | MyGarden" },
      { property: "og:description", content: "Find the right plants and garden essentials." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const s = Route.useSearch();
  const term = s.q ?? "";
  const nav = useNavigate();
  const [q, setQ] = useState(term);
  const placeholder = useTypewriter(SEARCH_PHRASES);

  useEffect(() => {
    const id = setTimeout(() => {
      if (q !== term) void nav({ to: "/search", search: q ? { q } : {}, replace: true });
    }, 400);
    return () => clearTimeout(id);
  }, [q, term, nav]);

  const result = useQuery({
    queryKey: ["search", term],
    queryFn: () => searchApi.search({ q: term, limit: 24 }),
    enabled: term.length > 1,
  });
  const products: Product[] = Array.isArray(result.data) ? result.data : result.data?.items || [];

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-10">
      <h1 className="text-3xl sm:text-4xl">Search the nursery</h1>
      <form className="relative mt-6 max-w-2xl" onSubmit={(e) => e.preventDefault()} role="search">
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search products"
          placeholder={placeholder}
          className="h-14 rounded-full pl-12"
        />
      </form>
      <div className="mt-10">
        {products.length ? (
          <ProductGrid products={products} />
        ) : (
          <EmptyState
            title={term ? "No matches yet" : "What are you looking for?"}
            description={
              term
                ? "Try a different plant name or a broader search."
                : "Search by plant name, room, light level, or gardening need."
            }
          />
        )}
      </div>
    </div>
  );
}
