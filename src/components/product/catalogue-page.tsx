import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/api/services";
import { ProductGrid } from "./product-card";
import { EmptyState, ErrorState, PageSkeleton } from "@/components/shared/page-state";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/api";

export function CataloguePage({ title, params = {} }: { title: string; params?: Record<string, string | number | boolean | undefined> }) {
  const query = useQuery({ queryKey: ["products", params], queryFn: () => productsApi.list({ ...params, limit: 24 }) });
  if (query.isLoading) return <PageSkeleton />;
  if (query.isError) return <ErrorState retry={() => void query.refetch()} />;
  const result = query.data; const products: Product[] = Array.isArray(result) ? result : result?.items || [];
  return <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 lg:px-10"><div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-xs font-bold uppercase text-primary">The nursery edit</p><h1 className="font-display text-4xl sm:text-5xl">{title}</h1><p className="mt-3 text-sm text-muted-foreground">Thoughtfully selected plants and garden essentials for every kind of home.</p></div><Button variant="outline">Sort: Recommended</Button></div>{products.length ? <ProductGrid products={products} /> : <EmptyState title="Fresh arrivals are being prepared" description="Our nursery team is curating this collection. Please check back soon." />}</div>;
}
