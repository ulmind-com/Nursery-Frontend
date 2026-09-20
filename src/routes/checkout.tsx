import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Gift, ShieldCheck } from "lucide-react";
import { ordersApi } from "@/api/services";
import { useCart } from "@/contexts/cart-context";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/page-state";
import { money } from "@/components/product/product-card";
import { normalizeApiError } from "@/lib/api";
import type { Address, OrderQuote } from "@/types/api";
import { GIFT_NOTE_KEY, GIFT_ORDER_KEY } from "@/components/product/purchase-extras";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout | Plant Nursery" },
      { name: "description", content: "Confirm delivery details and complete your nursery order." },
      { property: "og:title", content: "Secure Checkout | Plant Nursery" },
      { property: "og:description", content: "Complete your nursery order securely." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CheckoutPage,
});

const FIELDS: Array<[string, string, boolean]> = [
  ["name", "Full name", false],
  ["phone", "Phone", false],
  ["house", "House / flat", false],
  ["area", "Area / street", true],
  ["city", "City", false],
  ["state", "State", false],
  ["pincode", "Pincode", false],
];

function CheckoutPage() {
  const { items, clear } = useCart();
  const { isAuthenticated } = useAuth();
  const [quote, setQuote] = useState<OrderQuote | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [coupon, setCoupon] = useState(() => {
    if (typeof window === "undefined") return "";
    try {
      return window.localStorage.getItem("plant-nursery-coupon") ?? "";
    } catch {
      return "";
    }
  });
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [payment, setPayment] = useState("cod");
  const [busy, setBusy] = useState(false);
  const nav = useNavigate();

  useEffect(() => {
    try {
      setIsGift(window.localStorage.getItem(GIFT_ORDER_KEY) === "true");
      setGiftNote(window.localStorage.getItem(GIFT_NOTE_KEY) ?? "");
    } catch { /* storage unavailable */ }
  }, []);

  if (!items.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add plants before checking out."
        action={<Button asChild><Link to="/plants" search={{}}>Shop plants</Link></Button>}
      />
    );
  }

  const orderItems = items.map((i) => ({
    product_id: i.product_id,
    qty: i.qty,
    ...(i.size_variant ? { size_variant: i.size_variant } : {}),
    ...(i.pot_type ? { pot_type: i.pot_type } : {}),
  }));

  const payload = (a: Address) => ({
    items: orderItems,
    address: a,
    payment_method: payment,
    is_gift: isGift,
    ...(coupon ? { coupon_code: coupon } : {}),
    ...(isGift && giftNote ? { gift_note: giftNote } : {}),
  });

  async function getQuote(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const a: Address = {
      tag: "Home",
      name: String(f.get("name")),
      house: String(f.get("house")),
      area: String(f.get("area")),
      city: String(f.get("city")),
      state: String(f.get("state")),
      pincode: String(f.get("pincode")),
      phone: String(f.get("phone")),
    };
    setBusy(true);
    try {
      setQuote(await ordersApi.quote(payload(a)));
      setAddress(a);
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setBusy(false);
    }
  }

  async function place() {
    if (!address) return;
    setBusy(true);
    try {
      const order = await ordersApi.create(payload(address));
      clear();
      try {
        window.localStorage.removeItem(GIFT_ORDER_KEY);
        window.localStorage.removeItem(GIFT_NOTE_KEY);
      } catch { /* storage unavailable */ }
      await nav({ to: "/account/orders/$id", params: { id: order.id } });
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setBusy(false);
    }
  }

  const codBlocked = quote?.cod_available === false && payment === "cod";

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
      <h1 className="text-3xl sm:text-4xl">Checkout</h1>
      {!isAuthenticated && (
        <div className="mt-5 rounded-lg border-l-4 border-primary bg-primary-tint p-4 text-sm">
          Already have an account? <Link to="/login" className="font-bold text-primary">Sign in</Link> for saved addresses and order history.
        </div>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
        <form onSubmit={getQuote} className="space-y-8">
          <section>
            <h2 className="mb-4 text-lg">Delivery address</h2>
            <div className="grid gap-5 sm:grid-cols-2">
              {FIELDS.map(([name, label, wide]) => (
                <div key={name} className={wide ? "sm:col-span-2" : ""}>
                  <Label htmlFor={name}>{label}</Label>
                  <Input id={name} name={name} required className="mt-2" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg">Payment method</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {[["cod", "Cash on delivery"], ["online", "Pay online"]].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={payment === value}
                  onClick={() => { setPayment(value as string); setQuote(null); }}
                  className={`rounded-lg border px-4 py-3 text-left text-sm font-semibold transition-colors duration-200 ${payment === value ? "border-primary bg-primary-soft text-primary-soft-foreground" : "hover:border-primary"}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg">Coupon</h2>
            <div className="flex gap-3">
              <Input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="Enter coupon code" aria-label="Coupon code" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Coupons are validated by the nursery when your total is calculated.</p>
          </section>

          <section className="rounded-xl border p-4">
            <label className="flex items-center gap-3 text-sm font-semibold">
              <input type="checkbox" checked={isGift} onChange={(e) => { setIsGift(e.target.checked); try { window.localStorage.setItem(GIFT_ORDER_KEY, String(e.target.checked)); } catch { /* storage unavailable */ } }} className="size-4 accent-[var(--primary)]" />
              <Gift className="size-4 text-primary" /> This order is a gift
            </label>
            {isGift && (
              <Textarea value={giftNote} onChange={(e) => { setGiftNote(e.target.value); try { window.localStorage.setItem(GIFT_NOTE_KEY, e.target.value); } catch { /* storage unavailable */ } }} placeholder="Add a short gift note (optional)" className="mt-4" rows={3} aria-label="Gift note" />
            )}
          </section>

          <Button disabled={busy} size="lg" className="w-full sm:w-auto">Get final total</Button>
        </form>

        <aside className="h-fit rounded-xl border bg-card p-6 lg:sticky lg:top-28">
          <h2 className="text-xl">Order summary</h2>
          {quote ? (
            <div className="mt-5 space-y-3 text-sm">
              {([["Subtotal", quote.subtotal], ["Discount", -quote.discount], ["Delivery", quote.delivery], ["Tax", quote.tax]] as Array<[string, number]>).map(([label, value]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className="price-num font-medium">{money(Number(value))}</span>
                </div>
              ))}
              <div className="flex justify-between border-t pt-4 text-lg">
                <span className="font-bold">Total</span>
                <span className="price-num text-forest">{money(quote.total)}</span>
              </div>
              {quote.message && <p className="text-xs text-muted-foreground">{quote.message}</p>}
              {codBlocked && <p className="text-xs font-semibold text-sale">Cash on delivery is not available for this order. Please choose pay online.</p>}
              <Button onClick={() => void place()} disabled={busy || codBlocked} size="lg" className="mt-4 w-full">Place order</Button>
              <p className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary" /> Totals confirmed by the nursery
              </p>
            </div>
          ) : (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Enter your delivery address to receive the confirmed total, delivery charge, tax, and payment options.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
