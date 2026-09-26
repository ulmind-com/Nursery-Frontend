import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Headset, Package } from "lucide-react";
import { ordersApi, queryKeys, reviewsApi, wishlistApi } from "@/api/services";
import { ACCOUNT_LINKS, AccountShell } from "@/components/account/account-shell";
import { OrderStatusPill } from "@/components/account/order-bits";
import { money } from "@/components/product/product-card";
import { useAuth } from "@/contexts/auth-context";
import { useSupportChat } from "@/contexts/support-chat-context";

export const Route = createFileRoute("/account/")({
  head: () => ({
    meta: [
      { title: "My Account | MyGarden" },
      { name: "description", content: "Manage your MyGarden profile, orders and addresses." },
      { property: "og:title", content: "My Account | MyGarden" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Overview,
});

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="surface-card p-4 text-center sm:p-5">
      <p className="font-display text-2xl font-extrabold text-forest sm:text-3xl">{value}</p>
      <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground sm:text-xs">{label}</p>
    </div>
  );
}

function Overview() {
  const { user } = useAuth();
  const support = useSupportChat();
  const orders = useQuery({ queryKey: queryKeys.orders, queryFn: ordersApi.list, enabled: Boolean(user) });
  const wishlist = useQuery({ queryKey: queryKeys.wishlist, queryFn: wishlistApi.ids, enabled: Boolean(user) });
  const reviews = useQuery({ queryKey: queryKeys.myReviews, queryFn: reviewsApi.mine, enabled: Boolean(user) });

  const all = orders.data ?? [];
  const recent = all.slice(0, 3);
  const inFlight = all.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
  const saved = Array.isArray(wishlist.data) ? wishlist.data.length : wishlist.data?.ids?.length ?? 0;

  /* Overview doubles as the phone's menu, so every section is one tap away
     here too — the rail above is a strip, not a full list, on a small screen. */
  const shortcuts = ACCOUNT_LINKS.filter((link) => link.to !== "/account");

  return (
    <AccountShell title={`Hello, ${user?.name?.split(" ")[0] ?? "there"}`} description="Your orders, addresses and saved plants — all in one place.">
      <div className="grid grid-cols-3 gap-3">
        <Stat label="Orders" value={all.length} />
        <Stat label="In transit" value={inFlight} />
        <Stat label="Wishlist" value={saved} />
      </div>

      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-forest">Recent orders</h2>
          {all.length > 0 && (
            <Link to="/account/orders" className="text-sm font-semibold text-primary hover:text-forest">
              View all
            </Link>
          )}
        </div>

        {recent.length > 0 ? (
          <div className="space-y-2.5">
            {recent.map((order) => (
              <Link
                key={order.id}
                to="/account/orders/$id"
                params={{ id: order.id }}
                className="surface-card flex items-center gap-3 p-4 transition hover:border-primary/60"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary-tint text-primary">
                  <Package className="size-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-forest">
                    Order {order.order_number || order.id.slice(-6).toUpperCase()}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {order.created_at ? new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : ""} ·{" "}
                    {order.items.length} item{order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="price-num text-sm font-bold text-forest">{money(order.total ?? 0)}</p>
                  <OrderStatusPill status={order.status} className="mt-1" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="surface-card p-6 text-center">
            <p className="text-sm text-muted-foreground">No orders yet — your first plant is waiting.</p>
            <Link
              to="/plants"
              search={{}}
              className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-forest px-6 text-sm font-semibold text-forest-foreground transition hover:bg-forest/90"
            >
              Shop plants <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>

      <section className="mt-7 lg:hidden">
        <h2 className="mb-3 font-display text-lg font-bold text-forest">Manage</h2>
        <div className="grid grid-cols-2 gap-3">
          {shortcuts.map(({ to, label, icon: Icon, hint }) => (
            <Link key={to} to={to} className="surface-card p-4 transition hover:border-primary/60">
              <Icon className="size-5 text-primary" aria-hidden="true" />
              <p className="mt-2.5 text-sm font-bold text-forest">{label}</p>
              <p className="mt-0.5 text-[11px] leading-4 text-muted-foreground">{hint}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Support lives here rather than on a floating button across the store:
          the assistant works off the customer's orders, so this is where it
          has something to say. It opens on their latest live order. */}
      <section className="mt-6">
        <button
          type="button"
          onClick={() => support.open()}
          className="group flex w-full items-center gap-4 overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-forest p-5 text-left text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-200 hover:scale-[1.01] active:scale-[0.99]"
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15 backdrop-blur">
            <Headset className="size-5" aria-hidden="true" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-lg font-bold">Help &amp; Support</span>
            <span className="mt-0.5 block text-sm text-primary-foreground/80">
              Track or cancel an order, or talk to the nursery team.
            </span>
          </span>
          <ArrowRight className="size-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
        </button>
      </section>

      {reviews.data && reviews.data.length > 0 && (
        <p className="mt-6 text-center text-xs text-muted-foreground lg:text-left">
          You've written {reviews.data.length} review{reviews.data.length === 1 ? "" : "s"} —{" "}
          <Link to="/account/reviews" className="font-semibold text-primary hover:text-forest">
            manage them
          </Link>
          .
        </p>
      )}
    </AccountShell>
  );
}
