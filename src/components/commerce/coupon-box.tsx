import { useQuery } from "@tanstack/react-query";
import { Check, Copy, Lock, TicketPercent } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { couponApi } from "@/api/services";
import type { Coupon } from "@/types/api";

export const COUPON_STORAGE_KEY = "plant-nursery-coupon";

function money(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function CouponBox({ subtotal }: { subtotal: number }) {
  const [copied, setCopied] = useState<string | null>(null);
  const { data, isPending, isError } = useQuery({ queryKey: ["coupons", "active"], queryFn: couponApi.active, staleTime: 5 * 60 * 1000 });
  const coupons: Coupon[] = data ?? [];

  if (isPending) return <div className="h-24 animate-pulse rounded-xl bg-muted" />;
  if (isError || coupons.length === 0) return null;

  const pick = (coupon: Coupon) => {
    try {
      window.localStorage.setItem(COUPON_STORAGE_KEY, coupon.code);
    } catch {
      /* storage unavailable */
    }
    void navigator.clipboard?.writeText(coupon.code).catch(() => undefined);
    setCopied(coupon.code);
    toast.success(`${coupon.code} saved — it will be applied at checkout.`);
  };

  return (
    <section aria-label="Available offers" className="rounded-xl border bg-card p-5">
      <h2 className="flex items-center gap-2 text-sm font-bold"><TicketPercent className="size-4 text-primary" /> Offers for you</h2>
      <ul className="mt-4 space-y-3">
        {coupons.map((coupon) => {
          const min = coupon.minimum_order ?? 0;
          const needed = Math.max(0, min - subtotal);
          const locked = needed > 0;
          return (
            <li key={coupon.code} className="flex items-start gap-3 rounded-lg border border-dashed p-3">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-bold tracking-wide">
                  {coupon.code}
                  {locked && <Lock className="size-3.5 text-muted-foreground" aria-hidden />}
                </p>
                {coupon.description && <p className="mt-1 text-xs leading-5 text-muted-foreground">{coupon.description}</p>}
                <p className="mt-1 text-xs text-muted-foreground">
                  {locked ? `Add ${money(needed)} more to unlock` : "Ready to apply"}
                  {coupon.max_discount ? ` · Up to ${money(coupon.max_discount)} off` : ""}
                  {coupon.free_shipping ? " · Free shipping" : ""}
                </p>
              </div>
              <button
                type="button"
                disabled={locked}
                onClick={() => pick(coupon)}
                className="shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors duration-200 hover:border-primary hover:text-primary disabled:opacity-50"
              >
                {copied === coupon.code ? <Check className="size-3.5" aria-label="Saved" /> : <Copy className="size-3.5" aria-label={`Use ${coupon.code}`} />}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
