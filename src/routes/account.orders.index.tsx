import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronRight, Package } from "lucide-react";
import { ordersApi, queryKeys } from "@/api/services";
import { AccountShell } from "@/components/account/account-shell";
import { OrderStatusPill } from "@/components/account/order-bits";
import { money } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/shared/page-state";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/orders/")({
  head: () => ({
    meta: [
      { title: "My Orders | MyGarden" },
      { name: "description", content: "Track your nursery orders and delivery status." },
      { property: "og:title", content: "My Orders | MyGarden" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Orders,
});

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "In progress" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

function Orders() {
  const q = useQuery({ queryKey: queryKeys.orders, queryFn: ordersApi.list });
  const [filter, setFilter] = useState<FilterKey>("all");

  if (q.isLoading) return <PageSkeleton />;

  const all = q.data ?? [];
  const shown = all.filter((order) => {
    if (filter === "all") return true;
    if (filter === "active") return !["delivered", "cancelled"].includes(order.status);
    return order.status === filter;
  });

  return (
    <AccountShell title="Orders" description="Every plant you've ordered, and where it is right now.">
      {all.length > 0 && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {FILTERS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition",
                filter === key
                  ? "border-forest bg-forest text-forest-foreground"
                  : "border-border bg-card text-forest hover:border-primary/50",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <Package className="mx-auto size-8 text-primary" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-bold text-forest">
            {all.length === 0 ? "No orders yet" : "Nothing here"}
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
            {all.length === 0
              ? "Your future plant deliveries will appear here."
              : "Try a different filter to see your other orders."}
          </p>
          {all.length === 0 && (
            <Button asChild className="mt-5 h-11 rounded-full px-7">
              <Link to="/plants" search={{}}>Shop plants</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {shown.map((order) => {
            const thumbs = order.items.slice(0, 4);
            return (
              <Link
                key={order.id}
                to="/account/orders/$id"
                params={{ id: order.id }}
                className="surface-card flex items-center gap-4 p-4 transition hover:border-primary/60 sm:p-5"
              >
                <div className="flex -space-x-3">
                  {thumbs.map((item, i) => (
                    <span
                      key={`${item.product_id}-${i}`}
                      className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl border-2 border-card bg-primary-soft"
                    >
                      {item.image ? (
                        <img src={item.image} alt="" className="size-full object-cover" />
                      ) : (
                        <Package className="size-4 text-primary" aria-hidden="true" />
                      )}
                    </span>
                  ))}
                  {order.items.length > 4 && (
                    <span className="grid size-12 shrink-0 place-items-center rounded-xl border-2 border-card bg-primary-tint text-xs font-bold text-forest">
                      +{order.items.length - 4}
                    </span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-forest">
                      Order {order.order_number || order.id.slice(-6).toUpperCase()}
                    </p>
                    <OrderStatusPill status={order.status} />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : ""}{" "}
                    · {order.items.length} item{order.items.length === 1 ? "" : "s"}
                  </p>
                  <p className="price-num mt-1 text-sm font-bold text-forest sm:hidden">{money(order.total ?? 0)}</p>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <p className="price-num text-base font-bold text-forest">{money(order.total ?? 0)}</p>
                </div>
                <ChevronRight className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      )}
    </AccountShell>
  );
}
