import { useQuery } from "@tanstack/react-query";
import { Check, Copy, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { couponApi } from "@/api/services";
import type { Coupon } from "@/types/api";
import { Button } from "@/components/ui/button";

export const COUPON_STORAGE_KEY = "plant-nursery-coupon";

function money(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

export function CouponBox({ subtotal, preview = false }: { subtotal: number; preview?: boolean }) {
  const [copied, setCopied] = useState<string | null>(null);
  const { data, isPending, isError } = useQuery({ queryKey: ["coupons", "active"], queryFn: couponApi.active, staleTime: 5 * 60 * 1000 });
  const coupons: Coupon[] = data ?? [];

  if (isPending) return <div className="h-20 animate-pulse rounded-md bg-muted" />;
  if (isError || coupons.length === 0) {
    if (!preview) return null;
    return (
      <section aria-label="Available offers">
        <h2 className="text-lg text-forest">Offers for you:</h2>
        <div className="mt-2.5 rounded-md border border-dashed border-primary/55 bg-primary-tint/65 px-3.5 py-3.5 text-xs leading-5 text-muted-foreground">
          Current shop offers will appear here when added in the admin panel.
        </div>
      </section>
    );
  }

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
    <section aria-label="Available offers">
      <h2 className="text-lg text-forest">Offers for you:</h2>
      <ul className="mt-2.5 divide-y divide-dashed divide-primary/35 overflow-hidden rounded-md border border-dashed border-primary/55 bg-primary-tint/65">
        {coupons.map((coupon) => {
          const min = coupon.minimum_order ?? 0;
          const needed = Math.max(0, min - subtotal);
          const locked = needed > 0;
          return (
            <li key={coupon.code} className="flex items-center gap-2.5 px-3.5 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{coupon.description || coupon.code}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {locked && <Lock className="size-3.5" aria-hidden />}
                  {locked ? `Add ${money(needed)} more to unlock` : "Ready to apply"}
                  {coupon.max_discount ? ` · Up to ${money(coupon.max_discount)} off` : ""}
                  {coupon.free_shipping ? " · Free shipping" : ""}
                </p>
              </div>
              <Button
                type="button"
                disabled={locked}
                onClick={() => pick(coupon)}
                variant="ghost"
                className="h-9 shrink-0 gap-2 rounded-full px-3 text-xs font-semibold text-forest"
              >
                <span>{coupon.code}</span>{copied === coupon.code ? <Check className="size-3.5" aria-label="Saved" /> : <Copy className="size-3.5" aria-label={`Use ${coupon.code}`} />}
              </Button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
