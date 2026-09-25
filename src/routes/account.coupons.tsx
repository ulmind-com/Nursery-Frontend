import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Check, Copy, Ticket } from "lucide-react";
import { toast } from "sonner";
import { couponApi } from "@/api/services";
import { AccountShell } from "@/components/account/account-shell";
import { money } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { PageSkeleton } from "@/components/shared/page-state";
import type { Coupon } from "@/types/api";

export const Route = createFileRoute("/account/coupons")({
  head: () => ({
    meta: [
      { title: "Coupons | MyGarden" },
      { name: "description", content: "Offers you can use on your next order." },
      { property: "og:title", content: "Coupons | MyGarden" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Coupons,
});

function worth(coupon: Coupon): string {
  // A free-shipping coupon carries no discount value — "₹0 off" reads as broken.
  if (!coupon.value) return coupon.free_shipping ? "Free shipping" : "Special offer";
  if (coupon.type === "flat") return `${money(coupon.value)} off`;
  const capped = coupon.max_discount ? ` up to ${money(coupon.max_discount)}` : "";
  return `${coupon.value}% off${capped}`;
}

function CouponCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      toast.success(`${coupon.code} copied — paste it at checkout`);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — note it down instead");
    }
  };

  return (
    /* The notch down each side is what makes a rectangle read as a ticket. */
    <article className="relative overflow-hidden rounded-2xl border border-dashed border-primary/40 bg-card p-5">
      <span className="absolute -left-2.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-storefront-wash" aria-hidden="true" />
      <span className="absolute -right-2.5 top-1/2 size-5 -translate-y-1/2 rounded-full bg-storefront-wash" aria-hidden="true" />

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-display text-xl font-extrabold text-forest">{worth(coupon)}</p>
          {coupon.description && (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{coupon.description}</p>
          )}
        </div>
        <Ticket className="size-6 shrink-0 text-primary" aria-hidden="true" />
      </div>

      <div className="mt-4 flex items-center gap-2">
        <code className="flex-1 truncate rounded-lg border border-border bg-primary-tint px-3 py-2 font-mono text-sm font-bold tracking-wide text-forest">
          {coupon.code}
        </code>
        <Button variant="outline" size="sm" className="h-9 shrink-0 rounded-full" onClick={copy}>
          {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>

      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
        {Boolean(coupon.min_order) && <span>Min order {money(coupon.min_order ?? 0)}</span>}
        {coupon.free_shipping && <span className="font-semibold text-primary">Free shipping</span>}
        {coupon.first_order_only && <span>First order only</span>}
        {coupon.valid_until && (
          <span>
            Ends {new Date(coupon.valid_until).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        )}
      </div>
    </article>
  );
}

function Coupons() {
  const q = useQuery({ queryKey: ["coupons", "active"], queryFn: couponApi.active });
  if (q.isLoading) return <PageSkeleton />;

  const list = q.data ?? [];

  return (
    <AccountShell title="Coupons" description="Copy a code and paste it at checkout — the best offer always wins.">
      {list.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <Ticket className="mx-auto size-8 text-primary" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-bold text-forest">No offers running right now</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
            New offers land here the moment the nursery publishes them.
          </p>
          <Button asChild className="mt-5 h-11 rounded-full px-7">
            <Link to="/offers">See current deals</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((coupon) => (
            <CouponCard key={coupon.id ?? coupon.code} coupon={coupon} />
          ))}
        </div>
      )}
    </AccountShell>
  );
}
