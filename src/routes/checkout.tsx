import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check, ChevronDown, Gift, Headphones, Leaf, LockKeyhole, PackageCheck, ShieldCheck, Tag, Truck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { couponApi, ordersApi, queryKeys, settingsApi } from "@/api/services";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { GIFT_NOTE_KEY, GIFT_ORDER_KEY } from "@/components/product/purchase-extras";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { normalizeApiError } from "@/lib/api";
import { loadRazorpay, openRazorpay, type RazorpaySuccessResponse } from "@/lib/razorpay";
import type { Address, Coupon, OrderQuote } from "@/types/api";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [
    { title: "Secure Checkout | MyGarden" },
    { name: "description", content: "Confirm delivery details and complete your MyGarden order securely." },
    { property: "og:title", content: "Secure Checkout | MyGarden" },
    { property: "og:description", content: "Complete your MyGarden order securely with Razorpay or available payment methods." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: CheckoutPage,
});

type PaymentMethod = "online" | "cod";

const inr = (value: number) => `₹${value.toLocaleString("en-IN")}`;

function CheckoutPage() {
  const { items, subtotal: cartSubtotal, clear } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { data: settings } = useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get, staleTime: 300_000 });
  const { data: coupons = [] } = useQuery({ queryKey: ["coupons", "active"], queryFn: couponApi.active, staleTime: 300_000, retry: false });
  const savedAddress = user?.addresses?.[0];
  const nameParts = (savedAddress?.name || user?.name || "").trim().split(/\s+/).filter(Boolean);
  const [quote, setQuote] = useState<OrderQuote | null>(null);
  const [address, setAddress] = useState<Address | null>(null);
  const [coupon, setCoupon] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("online");
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [sameBilling, setSameBilling] = useState(true);
  const [summaryOpen, setSummaryOpen] = useState(false);

  useEffect(() => {
    try {
      const savedCoupon = window.localStorage.getItem("plant-nursery-coupon") ?? "";
      setCoupon(savedCoupon);
      setCouponInput(savedCoupon);
      setIsGift(window.localStorage.getItem(GIFT_ORDER_KEY) === "true");
      setGiftNote(window.localStorage.getItem(GIFT_NOTE_KEY) ?? "");
    } catch { /* storage unavailable */ }
  }, []);

  const orderItems = useMemo(() => items.map((item) => ({
    product_id: item.product_id,
    qty: item.qty,
    ...(item.size_variant ? { size_variant: item.size_variant } : {}),
    ...(item.pot_type ? { pot_type: item.pot_type } : {}),
  })), [items]);

  const orderPayload = (nextAddress: Address, method: PaymentMethod, code = coupon) => ({
    items: orderItems,
    address: nextAddress,
    payment_method: method,
    is_gift: isGift,
    ...(code ? { coupon_code: code } : {}),
    ...(isGift && giftNote.trim() ? { gift_note: giftNote.trim() } : {}),
  });

  const finishOrder = async (orderId: string) => {
    clear();
    try {
      window.localStorage.removeItem(GIFT_ORDER_KEY);
      window.localStorage.removeItem(GIFT_NOTE_KEY);
      window.localStorage.removeItem("plant-nursery-coupon");
    } catch { /* storage unavailable */ }
    await navigate({ to: "/account/orders/$id", params: { id: orderId } });
  };

  const requestQuote = async (nextAddress: Address, method: PaymentMethod, code = coupon) => {
    const nextQuote = await ordersApi.quote(orderPayload(nextAddress, method, code));
    setQuote(nextQuote);
    setAddress(nextAddress);
    if (nextQuote.cod_available === false && method === "cod") setPayment("online");
    return nextQuote;
  };

  async function submitDelivery(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isAuthenticated) {
      toast.error("Sign in before continuing to payment.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const firstName = String(form.get("firstName") ?? "").trim();
    const lastName = String(form.get("lastName") ?? "").trim();
    const nextAddress: Address = {
      tag: "Home",
      name: [firstName, lastName].filter(Boolean).join(" "),
      house: String(form.get("address") ?? "").trim(),
      area: String(form.get("area") ?? "").trim(),
      city: String(form.get("city") ?? "").trim(),
      state: String(form.get("state") ?? "").trim(),
      pincode: String(form.get("pincode") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
    };
    setBusy(true);
    try {
      await requestQuote(nextAddress, payment);
      toast.success("Delivery and total confirmed.");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setBusy(false);
    }
  }

  async function applyCoupon(nextCoupon = couponInput.trim().toUpperCase()) {
    if (!address) {
      setCoupon(nextCoupon);
      toast.info("Enter your delivery address to validate this offer.");
      return;
    }
    setBusy(true);
    try {
      await requestQuote(address, payment, nextCoupon);
      setCoupon(nextCoupon);
      try { window.localStorage.setItem("plant-nursery-coupon", nextCoupon); } catch { /* storage unavailable */ }
      toast.success(nextCoupon ? `${nextCoupon} applied.` : "Coupon removed.");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setBusy(false);
    }
  }

  async function changePayment(value: string) {
    const next = value === "cod" ? "cod" : "online";
    setPayment(next);
    if (!address) return;
    setBusy(true);
    try { await requestQuote(address, next); }
    catch (error) { toast.error(normalizeApiError(error).message); }
    finally { setBusy(false); }
  }

  async function verifyPayment(orderId: string, response: RazorpaySuccessResponse) {
    try {
      const verified = await ordersApi.verify({ order_id: orderId, ...response });
      await finishOrder(verified.id || orderId);
    } catch (error) {
      setBusy(false);
      toast.error(`Payment verification failed: ${normalizeApiError(error).message}`);
    }
  }

  async function placeOrder() {
    if (!address || !quote) {
      toast.error("Confirm your delivery address first.");
      return;
    }
    setBusy(true);
    try {
      const order = await ordersApi.create(orderPayload(address, payment));
      if (payment === "cod") {
        await finishOrder(order.id);
        return;
      }
      if (!order.razorpay_order_id || !order.key_id || typeof order.razorpay_amount !== "number") {
        throw new Error("The payment details returned by the nursery are incomplete.");
      }
      await loadRazorpay();
      openRazorpay({
        key: order.key_id,
        amount: order.razorpay_amount,
        currency: order.razorpay_currency || "INR",
        order_id: order.razorpay_order_id,
        name: settings?.shop.name || "MyGarden",
        description: `Order ${order.order_number || order.id}`,
        prefill: { name: address.name, ...(user?.email ? { email: user.email } : {}), contact: address.phone },
        modal: { confirm_close: true, ondismiss: () => setBusy(false) },
        handler: (response) => void verifyPayment(order.id, response),
      }, (message) => { setBusy(false); toast.error(message); });
    } catch (error) {
      setBusy(false);
      toast.error(normalizeApiError(error).message);
    }
  }

  if (!items.length) {
    return <div className="mx-auto grid min-h-[62vh] max-w-xl place-items-center px-6 text-center"><div><span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary-tint text-primary"><Leaf /></span><h1 className="mt-5 text-3xl text-forest">Your cart is empty</h1><p className="mt-2 text-sm text-muted-foreground">Add a product before continuing to checkout.</p><Button asChild className="mt-6 rounded-full px-7"><Link to="/plants" search={{}}>Continue shopping</Link></Button></div></div>;
  }

  const shownSubtotal = quote?.subtotal;
  const deliveryText = quote ? inr(quote.delivery) : "Enter shipping address";

  return (
    <div className="min-h-[calc(100vh-74px)] bg-background sm:min-h-[calc(100vh-86px)]">
      <Button type="button" variant="ghost" onClick={() => setSummaryOpen((value) => !value)} className="flex h-auto w-full items-center justify-between rounded-none border-b border-border bg-storefront-wash px-4 py-4 text-sm font-semibold lg:hidden" aria-expanded={summaryOpen}>
        <span className="flex items-center gap-2 text-forest">Order summary <ChevronDown className={`size-4 transition-transform ${summaryOpen ? "rotate-180" : ""}`} /></span>
        <span className="price-num">{quote ? inr(quote.total) : "Total after address"}</span>
      </Button>
      <div className="mx-auto grid max-w-[1180px] lg:grid-cols-[minmax(0,1.08fr)_minmax(390px,.92fr)]">
        <main className="px-4 py-8 sm:px-8 sm:py-10 lg:px-14 lg:py-12">
          <form id="checkout-form" onSubmit={submitDelivery} onChange={(event) => { if ((event.target as HTMLInputElement).name) { setQuote(null); setAddress(null); } }} className="mx-auto max-w-[590px] space-y-9">
            <section>
              <div className="flex items-center justify-between"><h1 className="text-xl text-foreground">Contact</h1>{!isAuthenticated && <Link to="/login" className="text-sm font-semibold text-primary underline underline-offset-2">Sign in</Link>}</div>
              <Input type="email" name="email" defaultValue={user?.email ?? ""} placeholder="Email" required className="mt-4 h-12 rounded-lg" />
              {!isAuthenticated && <p className="mt-2.5 text-xs text-muted-foreground">Sign in is required before the nursery can confirm your order.</p>}
            </section>

            <section>
              <h2 className="text-xl text-foreground">Delivery</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2"><Label className="sr-only" htmlFor="country">Country/Region</Label><Input id="country" value="India" readOnly className="h-12 rounded-lg bg-background" /></div>
                <Input name="firstName" defaultValue={nameParts[0] ?? ""} placeholder="First name" required className="h-12 rounded-lg" />
                <Input name="lastName" defaultValue={nameParts.slice(1).join(" ")} placeholder="Last name" className="h-12 rounded-lg" />
                <Input name="address" defaultValue={savedAddress?.house ?? ""} placeholder="Address" required className="h-12 rounded-lg sm:col-span-2" />
                <Input name="area" defaultValue={savedAddress?.area ?? ""} placeholder="Apartment, suite, area (optional)" className="h-12 rounded-lg sm:col-span-2" />
                <Input name="city" defaultValue={savedAddress?.city ?? ""} placeholder="City" required className="h-12 rounded-lg" />
                <Input name="state" defaultValue={savedAddress?.state ?? ""} placeholder="State" required className="h-12 rounded-lg" />
                <Input name="pincode" defaultValue={savedAddress?.pincode ?? ""} placeholder="PIN code" required inputMode="numeric" pattern="[0-9]{6}" className="h-12 rounded-lg" />
                <Input name="phone" defaultValue={savedAddress?.phone ?? user?.phone ?? ""} placeholder="Phone" required inputMode="tel" className="h-12 rounded-lg" />
              </div>
            </section>

            <section>
              <h2 className="text-base text-foreground">Shipping method</h2>
              <div className="mt-3 rounded-lg bg-muted px-5 py-4 text-center text-sm text-muted-foreground">{quote ? (quote.message || "Delivery confirmed for this address.") : "Enter your shipping address to view available shipping methods."}</div>
            </section>

            <section>
              <h2 className="text-xl text-foreground">Payment</h2>
              <p className="mt-1 text-sm text-muted-foreground">All transactions are secure and encrypted.</p>
              <RadioGroup value={payment} onValueChange={(value) => void changePayment(value)} className="mt-4 overflow-hidden rounded-lg border border-border gap-0">
                <Label htmlFor="pay-online" className={`flex cursor-pointer items-center gap-3 p-4 ${payment === "online" ? "border border-primary bg-primary-tint/40" : ""}`}>
                  <RadioGroupItem value="online" id="pay-online" />
                  <span className="min-w-0 flex-1 text-sm font-semibold">Razorpay Secure <span className="font-normal text-muted-foreground">(UPI, Cards & more)</span></span>
                  <span className="hidden items-center gap-1 sm:flex"><span className="rounded border px-1.5 py-0.5 text-[10px] font-bold text-primary">UPI</span><span className="rounded border px-1.5 py-0.5 text-[10px] font-bold text-forest">VISA</span></span>
                </Label>
                {payment === "online" && <div className="border-y border-border bg-muted/60 px-5 py-3 text-center text-xs leading-5 text-muted-foreground">You’ll be redirected to Razorpay Secure to complete your purchase.</div>}
                <Label htmlFor="pay-cod" className={`flex cursor-pointer items-center gap-3 p-4 ${payment === "cod" ? "border border-primary bg-primary-tint/40" : ""} ${quote?.cod_available === false ? "cursor-not-allowed opacity-50" : ""}`}>
                  <RadioGroupItem value="cod" id="pay-cod" disabled={quote?.cod_available === false} />
                  <span className="text-sm font-semibold">Cash on delivery</span>
                </Label>
              </RadioGroup>
            </section>

            <section>
              <h2 className="text-base text-foreground">Billing address</h2>
              <RadioGroup value={sameBilling ? "same" : "different"} onValueChange={(value) => setSameBilling(value === "same")} className="mt-3 overflow-hidden rounded-lg border border-border gap-0">
                <Label htmlFor="billing-same" className={`flex cursor-pointer items-center gap-3 p-4 text-sm font-semibold ${sameBilling ? "border border-primary" : ""}`}><RadioGroupItem value="same" id="billing-same" />Same as shipping address</Label>
                <Label htmlFor="billing-different" className="flex cursor-pointer items-center gap-3 border-t border-border p-4 text-sm font-semibold"><RadioGroupItem value="different" id="billing-different" />Use a different billing address</Label>
              </RadioGroup>
              {!sameBilling && <p className="mt-3 rounded-lg bg-muted p-4 text-xs text-muted-foreground">A separate billing address is not supported by the nursery checkout yet.</p>}
            </section>

            <section className="rounded-lg border border-border p-4">
              <div className="flex items-center gap-3"><Checkbox id="gift" checked={isGift} onCheckedChange={(checked) => { const next = checked === true; setIsGift(next); try { window.localStorage.setItem(GIFT_ORDER_KEY, String(next)); } catch { /* storage unavailable */ } }} /><Label htmlFor="gift" className="flex cursor-pointer items-center gap-2 text-sm font-semibold"><Gift className="size-4 text-primary" />This order is a gift</Label></div>
              {isGift && <Textarea value={giftNote} onChange={(event) => { setGiftNote(event.target.value); try { window.localStorage.setItem(GIFT_NOTE_KEY, event.target.value); } catch { /* storage unavailable */ } }} placeholder="Add a short gift note (optional)" rows={3} className="mt-4" />}
            </section>

            {!quote ? <Button type="submit" size="lg" disabled={busy || !isAuthenticated} className="h-12 w-full rounded-lg bg-primary text-base font-bold">{busy ? "Confirming…" : isAuthenticated ? "Continue to payment" : "Sign in to continue"}</Button> : <Button type="button" size="lg" disabled={busy || (!sameBilling)} onClick={() => void placeOrder()} className="h-12 w-full rounded-lg bg-primary text-base font-bold">{busy ? "Please wait…" : payment === "online" ? `Pay now · ${inr(quote.total)}` : `Place order · ${inr(quote.total)}`}</Button>}
          </form>
        </main>

        <aside className={`${summaryOpen ? "block" : "hidden"} border-t border-border bg-storefront-wash px-4 py-8 sm:px-8 lg:block lg:min-h-[calc(100vh-86px)] lg:border-l lg:border-t-0 lg:px-10 lg:py-12`}>
          <div className="mx-auto max-w-[430px] lg:sticky lg:top-8">
            <ul className="space-y-4">
              {items.map((item) => <li key={`${item.product_id}-${item.size_variant ?? ""}-${item.pot_type ?? ""}`} className="flex items-center gap-4">
                <div className="relative size-16 shrink-0 rounded-lg border border-border bg-background p-1"><div className="size-full overflow-hidden rounded-md bg-primary-tint">{item.image && <img src={item.image} alt={item.title} className="size-full object-cover" />}</div><span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">{item.qty}</span></div>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{item.title}</p><p className="mt-1 truncate text-xs text-muted-foreground">{[item.size_variant, item.pot_type].filter(Boolean).join(" / ")}</p></div>
                <span className="price-num text-sm">{inr(item.unit_price * item.qty)}</span>
              </li>)}
            </ul>

            <div className="mt-6 flex gap-2"><Input value={couponInput} onChange={(event) => setCouponInput(event.target.value.toUpperCase())} placeholder="Discount code or gift card" aria-label="Discount code" className="h-12 rounded-lg bg-background" /><Button type="button" variant="outline" disabled={busy || !couponInput.trim()} onClick={() => void applyCoupon()} className="h-12 rounded-lg px-5">Apply</Button></div>
            {coupons.length > 0 && <div className="mt-5 space-y-3">{coupons.slice(0, 2).map((offer: Coupon) => <OfferRow key={offer.code} offer={offer} cartSubtotal={cartSubtotal} onApply={() => { setCouponInput(offer.code); void applyCoupon(offer.code); }} disabled={busy} />)}</div>}

            <div className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
              <PriceLine label="Subtotal" value={shownSubtotal === undefined ? "Confirmed after address" : inr(shownSubtotal)} />
              {quote && quote.discount > 0 && <PriceLine label="Discount" value={`−${inr(quote.discount)}`} accent />}
              <PriceLine label="Shipping" value={deliveryText} muted={!quote} />
              {quote && <PriceLine label="Tax" value={inr(quote.tax)} />}
              <div className="flex items-end justify-between border-t border-border pt-4"><span className="text-lg font-bold">Total</span><div className="text-right"><span className="mr-2 text-xs text-muted-foreground">INR</span><span className="price-num text-2xl">{quote ? inr(quote.total) : "—"}</span></div></div>
            </div>

            <TrustList guarantee={settings?.plant_guarantee} deliveryConfigured={Boolean(settings?.delivery)} supportConfigured={Boolean(settings?.support?.title || settings?.support?.note || settings?.support?.["phone"])} />
            <p className="mt-7 flex items-center justify-center gap-2 text-xs text-muted-foreground"><LockKeyhole className="size-3.5 text-primary" />Payments are secured by Razorpay</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PriceLine({ label, value, accent = false, muted = false }: { label: string; value: string; accent?: boolean; muted?: boolean }) {
  return <div className="flex items-center justify-between gap-4"><span>{label}</span><span className={`text-right tabular-nums ${accent ? "font-semibold text-primary" : ""} ${muted ? "text-muted-foreground" : ""}`}>{value}</span></div>;
}

function OfferRow({ offer, cartSubtotal, onApply, disabled }: { offer: Coupon; cartSubtotal: number; onApply: () => void; disabled: boolean }) {
  const minimum = offer.minimum_order ?? 0;
  const remaining = Math.max(0, minimum - cartSubtotal);
  return <div className="rounded-xl border border-dashed border-star/60 bg-background/55 p-3.5"><div className="flex items-center gap-2"><Tag className="size-4 text-star" /><strong className="flex-1 text-sm">{offer.code}</strong><Button type="button" variant="outline" size="sm" disabled={disabled || remaining > 0} onClick={onApply}>Apply</Button></div>{offer.description && <p className="mt-2 text-xs text-muted-foreground">{offer.description}</p>}{remaining > 0 && <p className="mt-2 border-t border-border pt-2 text-xs font-medium text-star">Add {inr(remaining)} more to unlock this offer</p>}</div>;
}

function TrustList({ guarantee, deliveryConfigured, supportConfigured }: { guarantee?: { enabled: boolean; label?: string; description?: string } | undefined; deliveryConfigured: boolean; supportConfigured: boolean }) {
  const items = [
    guarantee?.enabled ? { icon: ShieldCheck, title: guarantee.label || "Plant guarantee", detail: guarantee.description } : null,
    deliveryConfigured ? { icon: Truck, title: "Delivery confirmed at checkout", detail: "Charges and timing follow the nursery’s current delivery settings." } : null,
    { icon: PackageCheck, title: "Order details confirmed by the nursery", detail: "Prices, availability and totals come from the live catalogue." },
    supportConfigured ? { icon: Headphones, title: "Customer support available", detail: "Support details are available from your MyGarden account." } : null,
  ].filter((item): item is { icon: typeof ShieldCheck; title: string; detail: string | undefined } => item !== null);
  return <section className="mt-7"><h2 className="text-lg text-foreground">Shop with confidence</h2><ul className="mt-4 space-y-4">{items.map(({ icon: Icon, title, detail }) => <li key={title} className="flex gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-tint text-primary"><Icon className="size-5" /></span><div><p className="text-sm font-semibold">{title}</p>{detail && <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>}</div></li>)}</ul></section>;
}