import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BadgeCheck,
  Banknote,
  Check,
  ChevronDown,
  Gift,
  Leaf,
  Loader2,
  LocateFixed,
  MapPin,
  Minus,
  PackageCheck,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Tag,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { authApi, couponApi, ordersApi, queryKeys, settingsApi } from "@/api/services";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { GIFT_NOTE_KEY, GIFT_ORDER_KEY } from "@/components/product/purchase-extras";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { ConfettiBurst, OrderSuccessOverlay } from "@/components/shared/celebration";
import { normalizeApiError } from "@/lib/api";
import { loadRazorpay, openRazorpay, type RazorpaySuccessResponse } from "@/lib/razorpay";
import { couponMinOrder } from "@/lib/coupons";
import { cn } from "@/lib/utils";
import { INDIAN_STATES, matchState } from "@/lib/india";
import type { Address, ApplicableCoupon, Coupon, OrderQuote } from "@/types/api";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Secure Checkout | MyGarden" },
      {
        name: "description",
        content:
          "Complete your MyGarden order securely — UPI, cards, netbanking and cash on delivery.",
      },
    ],
  }),
  component: CheckoutPage,
});

type PaymentMethod = "online" | "cod";

const COUPON_KEY = "plant-nursery-coupon";
const inr = (value: number) => `₹${value.toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;

/** Every state and union territory, so the dropdown never blocks a real address. */

interface DeliveryForm {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
}

const isComplete = (form: DeliveryForm) =>
  Boolean(form.firstName.trim() && form.address.trim() && form.city.trim() && form.state.trim()) &&
  /^[1-9][0-9]{5}$/.test(form.pincode.trim()) &&
  /^[6-9][0-9]{9}$/.test(form.phone.replace(/\D/g, "").slice(-10));

const toAddress = (form: DeliveryForm): Address => ({
  tag: "Home",
  name: [form.firstName.trim(), form.lastName.trim()].filter(Boolean).join(" "),
  house: form.address.trim(),
  area: "",
  city: form.city.trim(),
  state: form.state.trim(),
  pincode: form.pincode.trim(),
  phone: form.phone.trim(),
});

/** `is_default` rides along inside the stored address object. */
type SavedAddress = Address & { is_default?: boolean };

/** Same address, typed twice, is still one address — keyed on what identifies it. */
const addressKey = (entry: Address) =>
  `${entry.house}|${entry.pincode}|${entry.phone}`.toLowerCase().replace(/\s+/g, " ").trim();

function CheckoutPage() {
  const { items, subtotal: cartSubtotal, clear, updateQty, removeItem } = useCart();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { data: settings } = useQuery({
    queryKey: queryKeys.settings,
    queryFn: settingsApi.get,
    staleTime: 300_000,
  });
  const { data: coupons = [] } = useQuery({
    queryKey: ["coupons", "active"],
    queryFn: couponApi.active,
    staleTime: 300_000,
    retry: false,
  });
  /* The nursery ranks every live coupon against this cart — which is what lets
     the best saving apply itself instead of the customer hunting for a code. */
  const { data: offerBoard } = useQuery({
    queryKey: ["coupons", "applicable", Math.round(cartSubtotal)],
    queryFn: () => couponApi.applicable(cartSubtotal),
    enabled: isAuthenticated && cartSubtotal > 0,
    staleTime: 60_000,
    retry: false,
  });

  const savedAddresses = useMemo<SavedAddress[]>(
    () => (user?.addresses as SavedAddress[] | undefined) ?? [],
    [user?.addresses],
  );

  const [form, setForm] = useState<DeliveryForm>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "West Bengal",
    pincode: "",
    phone: "",
  });
  const [quote, setQuote] = useState<OrderQuote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const [coupon, setCoupon] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("online");
  const [isGift, setIsGift] = useState(false);
  const [giftNote, setGiftNote] = useState("");
  const [marketing, setMarketing] = useState(true);
  const [saveInfo, setSaveInfo] = useState(false);
  const [sameBilling, setSameBilling] = useState(true);
  const [busy, setBusy] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [error, setError] = useState("");
  const [locating, setLocating] = useState(false);
  const [pickedAddress, setPickedAddress] = useState<number | null>(null);
  /* A code the customer typed or dismissed themselves outranks the automatic
     pick, so the auto-applier never argues with a deliberate choice. */
  const [couponTouched, setCouponTouched] = useState(false);
  const [autoApplied, setAutoApplied] = useState(false);
  /* Re-keyed on every automatic code so a second, better offer fires its own
     burst rather than sitting on the finished one. */
  const [confettiKey, setConfettiKey] = useState<string | null>(null);
  const [placed, setPlaced] = useState<{ orderId: string; amount: string; method: "razorpay" | "cod" } | null>(null);

  /* Contact details come from the account, but the delivery address never
     fills itself — the customer picks a saved one or types a new one, so a
     stale address can't quietly ship an order to the wrong door. */
  useEffect(() => {
    setForm((current) => ({ ...current, email: current.email || user?.email || "" }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(COUPON_KEY) ?? "";
      setCoupon(saved);
      setCouponInput(saved);
      setIsGift(window.localStorage.getItem(GIFT_ORDER_KEY) === "true");
      setGiftNote(window.localStorage.getItem(GIFT_NOTE_KEY) ?? "");
    } catch {
      /* storage unavailable */
    }
  }, []);

  // Quantity edits keep the line count the same, so the quote listens to a
  // signature of the whole cart rather than to items.length.
  const cartSignature = useMemo(
    () =>
      items.map((item) => `${item.product_id}:${item.size_variant ?? ""}:${item.qty}`).join("|"),
    [items],
  );

  const unitCount = items.reduce((sum, item) => sum + item.qty, 0);

  const orderItems = useMemo(
    () =>
      items.map((item) => ({
        product_id: item.product_id,
        qty: item.qty,
        ...(item.size_variant ? { size_variant: item.size_variant } : {}),
        ...(item.pot_type ? { pot_type: item.pot_type } : {}),
      })),
    [items],
  );

  const buildPayload = useCallback(
    (method: PaymentMethod, code: string, nextForm: DeliveryForm) => ({
      items: orderItems,
      address: toAddress(nextForm),
      payment_method: method,
      is_gift: isGift,
      ...(code ? { coupon_code: code } : {}),
      ...(isGift && giftNote.trim() ? { gift_note: giftNote.trim() } : {}),
    }),
    [orderItems, isGift, giftNote],
  );

  /* ── Live quote ───────────────────────────────────────────────────────────
     Shipping and the real total appear as soon as the address is usable, the
     way a customer expects — no "confirm address" step in between. */
  const quoteToken = useRef(0);
  // Read back by payNow: the `error` state it closes over is a render behind.
  const lastQuoteError = useRef("");
  const refreshQuote = useCallback(
    async (method: PaymentMethod, code: string, nextForm: DeliveryForm) => {
      const token = ++quoteToken.current;
      setQuoting(true);
      try {
        const next = await ordersApi.quote(buildPayload(method, code, nextForm));
        if (token !== quoteToken.current) return null; // a newer edit already won
        setQuote(next);
        lastQuoteError.current = "";
        setError("");
        if (next.cod_available === false && method === "cod") setPayment("online");
        return next;
      } catch (caught) {
        if (token !== quoteToken.current) return null;
        const message = normalizeApiError(caught).message;
        /* A coupon the order no longer qualifies for used to take the whole
           checkout down with it — a red banner and no total. Drop the code,
           say so plainly, and let the effect re-quote without it. */
        if (code && /coupon|offer|promo|discount/i.test(message)) {
          setCouponTouched(true);
          setCoupon("");
          setCouponInput("");
          setAutoApplied(false);
          try {
            window.localStorage.removeItem(COUPON_KEY);
          } catch {
            /* storage unavailable */
          }
          toast.info(`“${code}” couldn't be applied — removed so you can continue.`);
          return null;
        }
        setQuote(null);
        lastQuoteError.current = message;
        setError(message);
        return null;
      } finally {
        if (token === quoteToken.current) setQuoting(false);
      }
    },
    [buildPayload],
  );

  const complete = isComplete(form);
  useEffect(() => {
    if (!isAuthenticated || !complete || !items.length) {
      setQuote(null);
      return;
    }
    const timer = window.setTimeout(() => {
      void refreshQuote(payment, coupon, form);
    }, 450);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAuthenticated,
    complete,
    cartSignature,
    payment,
    coupon,
    form.firstName,
    form.lastName,
    form.address,
    form.city,
    form.state,
    form.pincode,
    form.phone,
  ]);

  const set = (key: keyof DeliveryForm) => (value: string) => {
    // Typing over a filled-in field means this is no longer that saved address.
    if (key !== "email") setPickedAddress(null);
    setForm((current) => ({ ...current, [key]: value }));
  };

  /* Choosing a saved address fills the form — and because the quote effect
     watches those fields, shipping for that PIN code recalculates on its own. */
  const fillFrom = (entry: SavedAddress, index: number) => {
    const parts = (entry.name || "").trim().split(/\s+/).filter(Boolean);
    setPickedAddress(index);
    setForm((current) => ({
      ...current,
      firstName: parts[0] ?? "",
      lastName: parts.slice(1).join(" "),
      address: [entry.house, entry.area]
        .map((part) => part?.trim())
        .filter(Boolean)
        .join(", "),
      city: entry.city ?? "",
      state: matchState(entry.state) ?? current.state,
      pincode: entry.pincode ?? "",
      phone: entry.phone || current.phone,
    }));
    toast.success(`Delivering to your ${(entry.tag || "saved").toLowerCase()} address`);
  };

  /* "Save this information" writes the address into the account once the order
     is really placed. The address book is a convenience, so a failure here is
     swallowed — it must never turn a paid order into an error. */
  const rememberAddress = async (nextForm: DeliveryForm) => {
    if (!saveInfo || !isAuthenticated) return;
    const entry = toAddress(nextForm);
    if (savedAddresses.some((saved) => addressKey(saved) === addressKey(entry))) return;
    try {
      await authApi.update({
        addresses: [...savedAddresses, { ...entry, is_default: savedAddresses.length === 0 }],
      });
      await refreshUser();
    } catch {
      /* the order is placed; the address book can wait */
    }
  };

  /* Ask the browser for coordinates, turn them into a street address on the
     server, and fill the fields. Whatever the lookup can't resolve is left
     alone so a partial answer never wipes something already typed. */
  /* Ask the browser where we are, turn that into a street address on the
     server, and fill the fields. Whatever the lookup can't resolve is left
     alone so a partial answer never wipes something already typed.

     The high-accuracy pass asks the OS for a GPS/CoreLocation fix, which fails
     outright on a desktop with Location Services switched off. That failure is
     not the end of the road — the coarse, network-derived fix usually still
     works — so a POSITION_UNAVAILABLE or TIMEOUT is retried without it, and
     only the second failure reaches the customer. */
  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("This browser can't share your location — please type the address.");
      return;
    }
    if (typeof window !== "undefined" && !window.isSecureContext) {
      toast.error("Location needs a secure (https) connection — please type the address.");
      return;
    }

    setLocating(true);

    const fill = async (position: GeolocationPosition) => {
      try {
        const found = await settingsApi.reverseGeocode(
          position.coords.latitude,
          position.coords.longitude,
        );
        const state = matchState(found.state);
        setForm((current) => ({
          ...current,
          address: found.address || current.address,
          city: found.city || current.city,
          state: state ?? current.state,
          pincode: /^[1-9][0-9]{5}$/.test(found.pincode) ? found.pincode : current.pincode,
        }));
        if (found.country && found.country !== "India") {
          toast.warning("We only deliver within India — please check the address.");
        } else if (!found.pincode) {
          toast.warning("Location found, but add your PIN code to continue.");
        } else {
          toast.success("Address filled from your location", { description: found.display_name });
        }
      } catch (locationError) {
        toast.error(normalizeApiError(locationError).message);
      } finally {
        setLocating(false);
      }
    };

    const giveUp = (positionError: GeolocationPositionError) => {
      setLocating(false);
      if (positionError.code === positionError.PERMISSION_DENIED) {
        toast.error("Location access was blocked", {
          description: "Allow location for this site in your browser, then try again.",
        });
        return;
      }
      if (positionError.code === positionError.TIMEOUT) {
        toast.error("Location is taking too long", {
          description: "Try again, or type the address yourself.",
        });
        return;
      }
      toast.error("Your device couldn't provide a location", {
        description:
          "Turn on Location Services for this browser in your system settings, or type the address yourself.",
      });
    };

    /* Second attempt: coarse fix, a longer window, and a recent cached
       position is good enough for filling in an address. */
    const retryCoarse = (firstError: GeolocationPositionError) => {
      if (firstError.code === firstError.PERMISSION_DENIED) {
        giveUp(firstError);
        return;
      }
      navigator.geolocation.getCurrentPosition(fill, giveUp, {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 600000,
      });
    };

    navigator.geolocation.getCurrentPosition(fill, retryCoarse, {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 60000,
    });
  };

  /* Setting the code is all this does. The quote effect already watches
     `coupon`, so quoting here as well fired two requests for one click — and
     whichever landed second decided whether the discount stuck. */
  function applyCoupon(next = couponInput.trim().toUpperCase(), auto = false) {
    setCoupon(next);
    setCouponInput(next);
    setAutoApplied(Boolean(next) && auto);
    if (!auto) setCouponTouched(true);
    try {
      window.localStorage.setItem(COUPON_KEY, next);
    } catch {
      /* storage unavailable */
    }
    if (!next) {
      setConfettiKey(null);
      toast.success("Coupon removed.");
      return;
    }
    /* A discount landing is worth the confetti however it got here — the
       automatic pick and a code typed by hand both count. Keyed on the moment
       rather than the code, so re-applying the same one fires it again.

       This sits above the address check on purpose: the coupon is accepted
       right here, and the branch below only decides whether the saving can be
       shown yet. Below it, the confetti never fired until an address was in. */
    setConfettiKey(`${next}-${Date.now()}`);

    if (!complete) {
      toast.info(`“${next}” saved — add your delivery address to see the discount.`);
      return;
    }
    toast.success(auto ? `Best offer “${next}” applied for you` : `“${next}” applied.`);
  }

  /* Automatic best offer. It reads the ranked board rather than guessing, so it
     only ever picks a code this cart actually qualifies for, and it steps aside
     the moment the customer picks or removes one themselves. */
  useEffect(() => {
    if (!offerBoard) return;
    const current = coupon ? offerBoard.offers.find((offer) => offer.code === coupon) : undefined;
    // Only a code the board itself knows about can be retired here — a code
    // typed by hand that the board never listed is the customer's business.
    if (current && !current.applicable) {
      setCoupon("");
      setCouponInput("");
      setAutoApplied(false);
      try {
        window.localStorage.removeItem(COUPON_KEY);
      } catch {
        /* storage unavailable */
      }
      toast.info(`“${coupon}” no longer applies to this cart.`);
      return;
    }
    if (couponTouched || !offerBoard.best_code || offerBoard.best_code === coupon) return;
    // Never downgrade a coupon that is already the better deal.
    if (current?.applicable && current.discount >= offerBoard.best_discount) return;
    applyCoupon(offerBoard.best_code, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offerBoard, coupon, couponTouched]);

  /* Cart and storage are cleared up front so nothing can be re-submitted while
     the celebration is on screen; the redirect waits for it to finish. */
  function finishOrder(orderId: string, method: "razorpay" | "cod") {
    const amount = inr(quote?.total ?? cartSubtotal);
    clearOrderState();
    setPlaced({ orderId, amount, method });
  }

  function clearOrderState() {
    clear();
    try {
      window.localStorage.removeItem(GIFT_ORDER_KEY);
      window.localStorage.removeItem(GIFT_NOTE_KEY);
      window.localStorage.removeItem(COUPON_KEY);
    } catch {
      /* storage unavailable */
    }
  }

  async function verifyPayment(orderId: string, response: RazorpaySuccessResponse) {
    try {
      const verified = await ordersApi.verify({ order_id: orderId, ...response });
      finishOrder(verified.id || orderId, "razorpay");
    } catch (caught) {
      setBusy(false);
      toast.error(`Payment verification failed: ${normalizeApiError(caught).message}`);
    }
  }

  async function payNow(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    if (!isAuthenticated) {
      void navigate({ to: "/login" });
      return;
    }
    if (!sameBilling) {
      toast.error("Switch billing back to your shipping address to continue.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      // The quote doubles as validation (stock, pincode, coupon), so never
      // place an order against a stale or missing one.
      const confirmed = quote ?? (await refreshQuote(payment, coupon, form));
      if (!confirmed)
        throw new Error(lastQuoteError.current || "We couldn't confirm delivery for this address.");

      const order = await ordersApi.create(buildPayload(payment, coupon, form));
      // `order_id` / `amount` / `currency` are what older builds of the API
      // return; the current one also sends `id` / `razorpay_*`.
      const orderId = order.id || order.order_id;
      const amountPaise = order.razorpay_amount ?? order.amount;
      if (!orderId) throw new Error("The nursery did not return an order reference.");
      void rememberAddress(form);

      if (payment === "cod") {
        finishOrder(orderId, "cod");
        return;
      }
      if (!order.razorpay_order_id || !order.key_id || typeof amountPaise !== "number") {
        throw new Error("The payment details returned by the nursery are incomplete.");
      }

      await loadRazorpay();
      openRazorpay(
        {
          key: order.key_id,
          amount: amountPaise,
          currency: order.razorpay_currency || order.currency || "INR",
          order_id: order.razorpay_order_id,
          name: settings?.shop.name || "MyGarden",
          description: `Order ${order.order_number || orderId}`,
          theme: { color: "#008B5E" },
          prefill: {
            name: toAddress(form).name,
            ...(form.email.trim() || user?.email
              ? { email: form.email.trim() || user?.email || "" }
              : {}),
            contact: form.phone.trim(),
          },
          modal: { confirm_close: true, ondismiss: () => setBusy(false) },
          handler: (response) => void verifyPayment(orderId, response),
        },
        (message) => {
          setBusy(false);
          toast.error(message);
        },
      );
    } catch (caught) {
      setBusy(false);
      const message = normalizeApiError(caught).message;
      setError(message);
      toast.error(message);
    }
  }

  /* Placing the order empties the cart, which would otherwise drop this page
     straight into its empty state — so the celebration owns the screen until it
     hands over to the order. */
  if (placed) {
    return (
      <OrderSuccessOverlay
        amount={placed.amount}
        method={placed.method}
        onDone={() => void navigate({ to: "/account/orders/$id", params: { id: placed.orderId } })}
      />
    );
  }

  if (!items.length) {
    return (
      <div className="mx-auto grid min-h-[62vh] max-w-xl place-items-center px-6 text-center">
        <div>
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#E5F3EE] text-[#008B5E]">
            <ShoppingBag className="size-6" />
          </span>
          <h1 className="mt-5 text-2xl font-bold text-foreground">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add a plant before continuing to checkout.
          </p>
          <Button asChild className="mt-6 rounded-md bg-[#008B5E] px-7 hover:bg-[#00744e]">
            <Link to="/plants" search={{}}>
              Continue shopping
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const shopName = settings?.shop.name || "MyGarden";
  const totalLabel = quote ? inr(quote.total) : quoting ? "Calculating…" : "Total after address";
  const codBlocked = quote?.cod_available === false;
  const appliedOffer = coupon ? offerBoard?.offers.find((o) => o.code === coupon) : undefined;
  const savedByCoupon = quote?.discount ?? appliedOffer?.discount ?? 0;
  /* Signed-out visitors never get a ranked board, so the plain active list is
     ranked locally rather than showing nothing at all. */
  const offerRows: ApplicableCoupon[] = offerBoard
    ? offerBoard.offers.filter((offer) => offer.code !== coupon).slice(0, 3)
    : coupons
        .filter((entry: Coupon) => entry.code !== coupon)
        .slice(0, 2)
        .map((entry: Coupon) => ({
          code: entry.code,
          ...(entry.description ? { description: entry.description } : {}),
          applicable: cartSubtotal >= couponMinOrder(entry),
          discount: 0,
          needed_more: Math.max(0, couponMinOrder(entry) - cartSubtotal),
        }));

  return (
    <div className="min-h-screen bg-white text-[#1a1a1a] antialiased">
      {/* ─── Mobile summary toggle ─── */}
      <button
        type="button"
        onClick={() => setSummaryOpen((open) => !open)}
        className="flex w-full items-center justify-between border-b border-[#e5e5e5] bg-[#fafafa] px-4 py-4 text-sm lg:hidden"
        aria-expanded={summaryOpen}
      >
        <span className="flex items-center gap-2 font-semibold text-[#008B5E]">
          {summaryOpen ? "Hide" : "Show"} order summary
          <ChevronDown className={cn("size-4 transition-transform", summaryOpen && "rotate-180")} />
        </span>
        <span className="font-bold">{totalLabel}</span>
      </button>

      <div className="mx-auto grid max-w-6xl lg:grid-cols-[1.08fr_0.92fr]">
        {/* ════════ LEFT — the form ════════ */}
        <main className="order-2 px-4 py-8 sm:px-8 lg:order-1 lg:px-12 lg:py-12">
          <form onSubmit={payNow} className="mx-auto max-w-xl space-y-9" noValidate={false}>
            {/* ── Contact ── */}
            <section>
              <div className="mb-4 flex items-baseline justify-between">
                <h2 className="text-[19px] font-bold tracking-tight">Contact</h2>
                {!isAuthenticated && (
                  <Link
                    to="/login"
                    className="text-sm font-medium text-[#008B5E] underline-offset-2 hover:underline"
                  >
                    Sign in
                  </Link>
                )}
              </div>
              <Field
                id="email"
                label="Email"
                type="email"
                value={form.email}
                onChange={set("email")}
                autoComplete="email"
                required
              />
              <label className="mt-3 flex cursor-pointer items-center gap-2.5 text-sm text-[#333]">
                <Checkbox
                  checked={marketing}
                  onCheckedChange={(value) => setMarketing(value === true)}
                  className="size-[18px] rounded-[4px] border-[#c9c9c9] data-[state=checked]:border-[#008B5E] data-[state=checked]:bg-[#008B5E]"
                />
                Email me with news and offers
              </label>
            </section>

            {/* ── Delivery ── */}
            <section>
              <h2 className="mb-4 text-[19px] font-bold tracking-tight">Delivery</h2>

              {savedAddresses.length > 0 && (
                <div className="mb-6">
                  <p className="mb-2.5 text-[13px] font-semibold text-[#333]">
                    Deliver to a saved address
                  </p>
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {savedAddresses.map((entry, index) => {
                      const selected = pickedAddress === index;
                      return (
                        <button
                          key={`${addressKey(entry)}-${index}`}
                          type="button"
                          onClick={() => fillFrom(entry, index)}
                          aria-pressed={selected}
                          className={cn(
                            "rounded-lg border px-3.5 py-3 text-left transition-colors",
                            selected
                              ? "border-[#008B5E] bg-[#f2faf6] ring-1 ring-[#008B5E]"
                              : "border-[#d9d9d9] bg-white hover:border-[#008B5E]/60 hover:bg-[#fafcfb]",
                          )}
                        >
                          <span className="flex items-center justify-between gap-2">
                            <span className="flex min-w-0 items-center gap-1.5">
                              <MapPin className="size-3.5 shrink-0 text-[#008B5E]" />
                              <span className="truncate text-[13px] font-bold">
                                {entry.tag || "Address"}
                              </span>
                              {entry.is_default && (
                                <span className="shrink-0 rounded-full bg-[#e8f6ef] px-1.5 py-px text-[9px] font-bold uppercase tracking-wide text-[#00663f]">
                                  Default
                                </span>
                              )}
                            </span>
                            {selected && <Check className="size-4 shrink-0 text-[#008B5E]" />}
                          </span>
                          <span className="mt-1 block truncate text-xs font-medium text-[#333]">
                            {entry.name}
                          </span>
                          <span className="mt-0.5 block text-xs leading-relaxed text-[#6b6b6b]">
                            {[entry.house, entry.area, entry.city, entry.state]
                              .map((part) => part?.trim())
                              .filter(Boolean)
                              .join(", ")}{" "}
                            — {entry.pincode}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="mt-2 text-xs text-[#6b6b6b]">
                    Tap one to fill the form below, or type a new address. Shipping is worked out
                    for whichever PIN code ends up in the form.
                  </p>
                </div>
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <SelectField
                  id="country"
                  label="Country/Region"
                  value="India"
                  onChange={() => undefined}
                  options={["India"]}
                  className="sm:col-span-2"
                />
                <Field
                  id="firstName"
                  label="First name"
                  value={form.firstName}
                  onChange={set("firstName")}
                  autoComplete="given-name"
                  required
                />
                <Field
                  id="lastName"
                  label="Last name"
                  value={form.lastName}
                  onChange={set("lastName")}
                  autoComplete="family-name"
                />
                <div className="sm:col-span-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={useMyLocation}
                    disabled={locating}
                    className="h-11 w-full gap-2 rounded-[6px] border-[#c9c9c9] text-sm font-semibold text-[#008B5E] hover:bg-[#008B5E]/5 sm:w-auto"
                  >
                    {locating ? (
                      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <LocateFixed className="size-4" aria-hidden="true" />
                    )}
                    {locating ? "Finding your location…" : "Use my current location"}
                  </Button>
                  <p className="mt-1.5 text-xs text-[#6b6b6b]">
                    Fills the address, city, state and PIN code for you.
                  </p>
                </div>
                <Field
                  id="address"
                  label="Address"
                  value={form.address}
                  onChange={set("address")}
                  autoComplete="street-address"
                  required
                  className="sm:col-span-2"
                />
                <div className="grid grid-cols-1 gap-3 sm:col-span-2 sm:grid-cols-3">
                  <Field
                    id="city"
                    label="City"
                    value={form.city}
                    onChange={set("city")}
                    autoComplete="address-level2"
                    required
                  />
                  <SelectField
                    id="state"
                    label="State"
                    value={form.state}
                    onChange={set("state")}
                    options={INDIAN_STATES}
                  />
                  <Field
                    id="pincode"
                    label="PIN code"
                    value={form.pincode}
                    onChange={(value) => set("pincode")(value.replace(/\D/g, "").slice(0, 6))}
                    inputMode="numeric"
                    autoComplete="postal-code"
                    required
                  />
                </div>
                <Field
                  id="phone"
                  label="Phone"
                  value={form.phone}
                  onChange={(value) => set("phone")(value.replace(/[^\d+\s-]/g, "").slice(0, 14))}
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  className="sm:col-span-2"
                />
                <label className="mt-1 flex cursor-pointer items-center gap-2.5 text-sm text-[#333] sm:col-span-2">
                  <Checkbox
                    checked={saveInfo}
                    onCheckedChange={(value) => setSaveInfo(value === true)}
                    className="size-[18px] rounded-[4px] border-[#c9c9c9] data-[state=checked]:border-[#008B5E] data-[state=checked]:bg-[#008B5E]"
                  />
                  Save this information for next time
                </label>
              </div>
            </section>

            {/* ── Shipping method ── */}
            <section>
              <h2 className="mb-4 text-[19px] font-bold tracking-tight">Shipping method</h2>
              {quote ? (
                <div className="flex items-center justify-between rounded-md border-2 border-[#008B5E] bg-white px-4 py-4 text-sm">
                  <span className="font-semibold text-[#1a1a1a]">
                    {quote.message || "Standard delivery"}
                  </span>
                  <span className="font-bold">
                    {quote.delivery > 0 ? inr(quote.delivery) : "FREE"}
                  </span>
                </div>
              ) : (
                <div className="rounded-md border border-[#d9d9d9] bg-[#f8f8f8] px-4 py-5 text-center text-sm text-[#707070]">
                  {quoting
                    ? "Checking delivery for this PIN code…"
                    : "Enter your shipping address to view available shipping methods."}
                </div>
              )}
            </section>

            {/* ── Payment ── */}
            <section>
              <h2 className="text-[19px] font-bold tracking-tight">Payment</h2>
              <p className="mb-4 mt-1 text-sm text-[#707070]">
                All transactions are secure and encrypted.
              </p>

              <div className="overflow-hidden rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <PayOption
                  id="pay-online"
                  selected={payment === "online"}
                  onSelect={() => setPayment("online")}
                  title="Razorpay Secure (UPI, Card, Int'l Card, Apple Pay)"
                  badges={<CardBadges extra="+17" />}
                  position="top"
                >
                  You'll be redirected to Razorpay Secure (UPI, Card, Int'l Card, Apple Pay) to
                  complete your purchase
                </PayOption>

                <PayOption
                  id="pay-cod"
                  selected={payment === "cod"}
                  onSelect={() => setPayment("cod")}
                  disabled={codBlocked}
                  title="Cash on Delivery (Pay when it arrives)"
                  badges={
                    <span className="flex h-[22px] items-center gap-1 rounded border border-[#e3e3e3] bg-white px-2">
                      <Banknote className="size-[13px] text-[#008B5E]" />
                      <span className="text-[10px] font-bold tracking-wide text-[#555]">CASH</span>
                    </span>
                  }
                  {...(codBlocked ? { note: "Not available" } : {})}
                  position="bottom"
                >
                  {settings?.cod?.note ||
                    "Pay in cash to our delivery partner when your plants reach your doorstep."}
                </PayOption>
              </div>
            </section>

            {/* ── Billing address ── */}
            <section>
              <h2 className="mb-4 text-[19px] font-bold tracking-tight">Billing address</h2>
              <div className="overflow-hidden rounded-md shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                <PayOption
                  id="billing-same"
                  selected={sameBilling}
                  onSelect={() => setSameBilling(true)}
                  title="Same as shipping address"
                  position="top"
                />
                <PayOption
                  id="billing-different"
                  selected={!sameBilling}
                  onSelect={() => setSameBilling(false)}
                  title="Use a different billing address"
                  position="bottom"
                >
                  A separate billing address isn't supported by the nursery checkout yet — switch
                  back to continue.
                </PayOption>
              </div>
            </section>

            {error && (
              <div
                role="alert"
                className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-[#f3c9c9] bg-[#fdf2f2] px-4 py-3 text-sm font-medium text-[#b42318]"
              >
                <span>{error}</span>
                {complete && (
                  <button
                    type="button"
                    disabled={quoting}
                    onClick={() => void refreshQuote(payment, coupon, form)}
                    className="shrink-0 rounded-md border border-[#e4a9a9] px-3 py-1 text-xs font-bold text-[#b42318] transition-colors hover:bg-[#f9e3e3] disabled:opacity-50"
                  >
                    {quoting ? "Retrying…" : "Try again"}
                  </button>
                )}
              </div>
            )}

            {/* ── Pay now ── */}
            <div>
              <Button
                type="submit"
                disabled={busy || quoting}
                className="h-[54px] w-full rounded-md bg-[#008B5E] text-[17px] font-bold tracking-tight text-white shadow-[0_1px_2px_rgba(0,0,0,0.08)] transition-colors hover:bg-[#00744e] disabled:opacity-60"
              >
                {busy ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-5 animate-spin" /> Processing…
                  </span>
                ) : !isAuthenticated ? (
                  "Sign in to continue"
                ) : payment === "cod" ? (
                  "Place order"
                ) : (
                  "Pay now"
                )}
              </Button>
              <p className="mt-4 text-center text-xs text-[#8a8a8a]">
                Your payment is processed over an encrypted connection. We never store your card
                details.
              </p>
            </div>
          </form>
        </main>

        {/* ════════ RIGHT — order summary ════════ */}
        <aside
          className={cn(
            "order-1 border-[#e5e5e5] bg-[#fafafa] px-4 py-7 sm:px-8 lg:order-2 lg:block lg:min-h-screen lg:border-l lg:px-10 lg:py-12",
            summaryOpen ? "block border-b" : "hidden",
          )}
        >
          <div className="mx-auto max-w-[430px] lg:sticky lg:top-10">
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.product_id}-${item.size_variant ?? ""}-${item.pot_type ?? ""}`}
                  className="flex items-center gap-4"
                >
                  <div className="relative size-16 shrink-0 rounded-lg border border-[#e0e0e0] bg-white">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.title}
                        loading="lazy"
                        className="size-full rounded-lg object-cover"
                      />
                    )}
                    <span className="absolute -right-2 -top-2 flex size-[22px] items-center justify-center rounded-full bg-[#1a1a1a] text-[11px] font-semibold text-white">
                      {item.qty}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{item.title}</p>
                    {[item.size_variant, item.pot_type].filter(Boolean).length > 0 && (
                      <p className="mt-0.5 truncate text-xs text-[#707070]">
                        {[item.size_variant, item.pot_type].filter(Boolean).join(" / ")}
                      </p>
                    )}
                    <QtyStepper
                      qty={item.qty}
                      max={item.stock ?? 99}
                      unitPrice={item.unit_price}
                      onChange={(next) => updateQty(item.product_id, next, item.size_variant)}
                      onRemove={() => {
                        removeItem(item.product_id, item.size_variant);
                        toast.success(`${item.title} removed`);
                      }}
                      label={item.title}
                    />
                  </div>
                  <span className="text-sm font-semibold tabular-nums">
                    {inr(item.unit_price * item.qty)}
                  </span>
                </li>
              ))}
            </ul>

            {/* Discount code */}
            <div className="mt-7 flex gap-3">
              <input
                value={couponInput}
                onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    void applyCoupon();
                  }
                }}
                placeholder="Discount code or gift card"
                aria-label="Discount code"
                className="h-[46px] min-w-0 flex-1 rounded-md border border-[#d9d9d9] bg-white px-3.5 text-sm outline-none transition-colors placeholder:text-[#8a8a8a] focus:border-[#008B5E] focus:ring-1 focus:ring-[#008B5E]"
              />
              <Button
                type="button"
                variant="outline"
                disabled={
                  quoting || !couponInput.trim() || couponInput.trim().toUpperCase() === coupon
                }
                onClick={() => void applyCoupon()}
                className="h-[46px] shrink-0 rounded-md border-[#d9d9d9] bg-[#f4f4f4] px-6 text-sm font-semibold text-[#333] hover:bg-[#ebebeb] disabled:opacity-45"
              >
                Apply
              </Button>
            </div>

            {coupon && (
              <div className="relative mt-3 flex items-start gap-2.5 rounded-lg border border-[#b9e3cf] bg-[#effaf4] px-3.5 py-3">
                {confettiKey && <ConfettiBurst key={confettiKey} />}
                <BadgeCheck className="mt-px size-[18px] shrink-0 text-[#008B5E]" />
                <div className="min-w-0 flex-1">
                  <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] font-bold text-[#00663f]">
                    “{coupon}” applied
                    {autoApplied && (
                      <span className="rounded-full bg-[#008B5E] px-2 py-px text-[9px] font-bold uppercase tracking-wide text-white">
                        Best offer · auto
                      </span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-[#3f7a5f]">
                    {savedByCoupon > 0
                      ? `You save ${inr(savedByCoupon)} on this order.`
                      : quoting
                        ? "Working out your saving…"
                        : "Your saving shows up once the delivery address is in."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => applyCoupon("")}
                  className="shrink-0 text-xs font-semibold text-[#707070] underline underline-offset-2 transition-colors hover:text-[#b42318]"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Rewards */}
            {!isAuthenticated && (
              <div className="mt-6 flex items-center justify-between gap-3 rounded-lg border border-[#c3e3d6] bg-[#f0f9f5] p-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#008B5E]">
                    <Gift className="size-5 text-white" />
                  </span>
                  <span className="text-sm font-semibold">Login to view and apply rewards</span>
                </div>
                <Button
                  asChild
                  size="sm"
                  className="h-9 shrink-0 rounded-md bg-[#008B5E] px-5 font-semibold hover:bg-[#00744e]"
                >
                  <Link to="/login">Login</Link>
                </Button>
              </div>
            )}

            {/* Offers */}
            {offerRows.length > 0 && (
              <div className="mt-5 space-y-3">
                {offerRows.map((offer) => (
                  <OfferRow
                    key={offer.code}
                    offer={offer}
                    disabled={quoting || busy}
                    onApply={() => applyCoupon(offer.code)}
                  />
                ))}
              </div>
            )}

            {/* Totals */}
            <div className="mt-7 space-y-3 border-t border-[#e5e5e5] pt-6 text-sm">
              <PriceLine
                label={`Subtotal · ${unitCount} item${unitCount > 1 ? "s" : ""}`}
                value={inr(quote?.subtotal ?? cartSubtotal)}
              />
              {quote && quote.discount > 0 && (
                <PriceLine label="Discount" value={`− ${inr(quote.discount)}`} accent />
              )}
              <PriceLine
                label="Shipping"
                value={
                  quote
                    ? quote.delivery > 0
                      ? inr(quote.delivery)
                      : "FREE"
                    : quoting
                      ? "Calculating…"
                      : "Enter shipping address"
                }
                muted={!quote}
              />
              {quote && quote.tax > 0 && (
                <PriceLine label="Tax (incl. GST)" value={inr(quote.tax)} />
              )}

              {/* A total is the number the customer is deciding on, so it always
                  shows one. Until the address produces a quote that number is
                  the cart itself, said plainly — a bare dash reads as broken,
                  which is exactly what it looked like when a quote failed. */}
              <div className="flex items-end justify-between pt-4">
                <span className="text-base font-bold">Total</span>
                <span className="flex items-baseline gap-2">
                  <span className="text-xs font-medium text-[#707070]">INR</span>
                  <span
                    className={`text-[22px] font-bold tabular-nums ${quoting ? "animate-pulse text-[#707070]" : ""}`}
                  >
                    {inr(quote?.total ?? cartSubtotal)}
                  </span>
                </span>
              </div>
              {!quote && (
                <p className="text-right text-xs font-medium text-[#707070]">
                  {quoting
                    ? "Working out shipping and tax…"
                    : error
                      ? "Shipping and tax couldn't be worked out just now."
                      : "Shipping and tax are added once your address is in."}
                </p>
              )}
              {quote && quote.discount > 0 && (
                <p className="text-right text-xs font-semibold text-[#008B5E]">
                  You save {inr(quote.discount)} on this order 🌿
                </p>
              )}
            </div>

            <TrustList />
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

/** Shopify-style floating label: placeholder while empty, small caption once filled. */
function Field({
  id,
  label,
  value,
  onChange,
  className,
  type = "text",
  ...rest
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  type?: string;
} & Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "id" | "value" | "onChange" | "type" | "className"
>) {
  const filled = value.length > 0;
  return (
    <div className={cn("relative", className)}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={label}
        className={cn(
          "peer h-[52px] w-full rounded-md border border-[#d9d9d9] bg-white px-3.5 text-[15px] text-[#1a1a1a] outline-none transition-[border-color,box-shadow]",
          "placeholder:text-[#8a8a8a] focus:border-[#008B5E] focus:ring-1 focus:ring-[#008B5E]",
          filled && "pb-1.5 pt-6 placeholder:text-transparent",
        )}
        {...rest}
      />
      <label
        htmlFor={id}
        className={cn(
          "pointer-events-none absolute left-3.5 top-[9px] text-[11px] text-[#707070] transition-opacity",
          filled ? "opacity-100" : "opacity-0",
        )}
      >
        {label}
      </label>
    </div>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  className,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <div className={cn("relative", className)}>
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-3.5 top-[9px] text-[11px] text-[#707070]"
      >
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-[52px] w-full appearance-none rounded-md border border-[#d9d9d9] bg-white pb-1.5 pl-3.5 pr-9 pt-6 text-[15px] text-[#1a1a1a] outline-none transition-[border-color,box-shadow] focus:border-[#008B5E] focus:ring-1 focus:ring-[#008B5E]"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#707070]" />
    </div>
  );
}

function PayOption({
  id,
  selected,
  onSelect,
  title,
  badges,
  children,
  disabled = false,
  note,
  position,
}: {
  id: string;
  selected: boolean;
  onSelect: () => void;
  title: string;
  badges?: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
  note?: string;
  position: "top" | "bottom";
}) {
  return (
    <div
      className={cn(
        "relative bg-white transition-colors",
        position === "bottom" && "-mt-px",
        selected ? "z-10 border-2 border-[#008B5E]" : "border border-[#d9d9d9]",
        position === "top" ? "rounded-t-md" : "rounded-b-md",
        disabled && "opacity-45",
      )}
    >
      <label
        htmlFor={id}
        className={cn(
          "flex items-center gap-3 px-4 py-[15px]",
          disabled ? "cursor-not-allowed" : "cursor-pointer",
        )}
      >
        <input
          id={id}
          type="radio"
          checked={selected}
          disabled={disabled}
          onChange={onSelect}
          className="sr-only"
        />
        <span
          aria-hidden
          className={cn(
            "flex size-[18px] shrink-0 items-center justify-center rounded-full border transition-colors",
            selected ? "border-[5px] border-[#008B5E] bg-white" : "border-[#bdbdbd] bg-white",
          )}
        />
        <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">{title}</span>
        {note && <span className="shrink-0 text-[11px] font-medium text-[#8a8a8a]">{note}</span>}
        {badges && <span className="hidden shrink-0 items-center gap-1 sm:flex">{badges}</span>}
      </label>
      {selected && children && (
        <div className="border-t border-[#e5e5e5] bg-[#fafafa] px-6 py-6 text-center text-sm leading-relaxed text-[#4a4a4a]">
          {children}
        </div>
      )}
    </div>
  );
}

function CardBadges({ extra }: { extra: string }) {
  return (
    <>
      <span className="flex h-[22px] items-center justify-center rounded border border-[#e3e3e3] bg-white px-1.5">
        <span className="text-[11px] font-bold italic tracking-tighter text-[#5f6368]">UPI</span>
      </span>
      <span className="flex h-[22px] items-center justify-center rounded bg-[#1A1F71] px-1.5">
        <span className="text-[10px] font-bold tracking-wider text-white">VISA</span>
      </span>
      <span className="flex h-[22px] items-center justify-center rounded bg-[#202020] px-1.5">
        <span className="flex -space-x-1.5">
          <span className="size-[11px] rounded-full bg-[#EB001B]" />
          <span className="size-[11px] rounded-full bg-[#F79E1B] mix-blend-screen" />
        </span>
      </span>
      <span className="flex h-[22px] items-center justify-center rounded border border-[#e3e3e3] bg-white px-1.5">
        <span className="text-[10px] font-semibold text-[#008B5E]">{extra}</span>
      </span>
    </>
  );
}

function PriceLine({
  label,
  value,
  accent = false,
  muted = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[#4a4a4a]">{label}</span>
      <span
        className={cn(
          "text-right tabular-nums font-medium",
          accent && "font-semibold text-[#008B5E]",
          muted ? "text-[#8a8a8a] font-normal" : "text-[#1a1a1a]",
        )}
      >
        {value}
      </span>
    </div>
  );
}

/**
 * Quantity control on the summary line — a customer who changes their mind can
 * add another of the same plant (or drop the line) without leaving checkout.
 * Every change re-quotes shipping, discount and total automatically.
 */
function QtyStepper({
  qty,
  max,
  unitPrice,
  onChange,
  onRemove,
  label,
}: {
  qty: number;
  max: number;
  unitPrice: number;
  onChange: (next: number) => void;
  onRemove: () => void;
  label: string;
}) {
  const atMax = qty >= max;
  return (
    <div className="mt-2 flex items-center gap-2">
      <div className="flex items-center rounded-md border border-[#d9d9d9] bg-white">
        <button
          type="button"
          onClick={() => (qty <= 1 ? onRemove() : onChange(qty - 1))}
          aria-label={qty <= 1 ? `Remove ${label}` : `Decrease quantity of ${label}`}
          className="flex size-7 items-center justify-center rounded-l-md text-[#333] transition-colors duration-200 hover:bg-[#f1f1f1]"
        >
          {qty <= 1 ? <Trash2 className="size-3.5" /> : <Minus className="size-3.5" />}
        </button>
        <span className="w-7 text-center text-xs font-semibold tabular-nums">{qty}</span>
        <button
          type="button"
          onClick={() => onChange(qty + 1)}
          disabled={atMax}
          aria-label={`Increase quantity of ${label}`}
          title={atMax ? "No more stock available" : undefined}
          className="flex size-7 items-center justify-center rounded-r-md text-[#333] transition-colors duration-200 hover:bg-[#f1f1f1] disabled:opacity-35"
        >
          <Plus className="size-3.5" />
        </button>
      </div>
      <span className="truncate text-[11px] text-[#8a8a8a]">
        {atMax ? "Max available" : `${inr(unitPrice)} each`}
      </span>
    </div>
  );
}

/** One offer, ranked by the nursery: usable ones in colour, locked ones greyed
 *  out with the gap still to close. */
function OfferRow({
  offer,
  onApply,
  disabled,
}: {
  offer: ApplicableCoupon;
  onApply: () => void;
  disabled: boolean;
}) {
  const locked = !offer.applicable;

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        locked ? "border-[#e6e6e6] bg-[#f7f7f7]" : "border-[#f2e5cf] bg-[#fdf9ef]",
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2">
          <Tag className={cn("size-4 shrink-0", locked ? "text-[#9a9a9a]" : "text-[#d97706]")} />
          <strong className="truncate text-sm font-bold">{offer.code}</strong>
          {offer.discount > 0 && (
            <span className="shrink-0 rounded-full bg-[#e8f6ef] px-2 py-px text-[10px] font-bold text-[#00663f]">
              Save {inr(offer.discount)}
            </span>
          )}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled || locked}
          onClick={onApply}
          className="h-7 shrink-0 rounded-md bg-[#f6ecd9] px-3.5 text-xs font-bold text-[#7a5a1e] hover:bg-[#ebdabc] disabled:opacity-50"
        >
          Apply
        </Button>
      </div>
      {offer.description && (
        <p className="mt-2 text-xs leading-relaxed text-[#5f5f5f]">{offer.description}</p>
      )}
      {offer.needed_more > 0 && (
        <p
          className={cn(
            "mt-3 border-t pt-3 text-[11px] font-bold text-[#b45309]",
            locked ? "border-[#e6e6e6]" : "border-[#f2e5cf]",
          )}
        >
          Add {inr(offer.needed_more)} more to unlock this offer
        </p>
      )}
    </div>
  );
}

function TrustList() {
  const trust = [
    {
      icon: ShieldCheck,
      title: "30-Day Replacement Guarantee",
      detail: "If your plant arrives damaged, we'll replace it.",
    },
    {
      icon: Leaf,
      title: "Farm-Fresh, Long-Lasting Plants",
      detail: "Grown on our own farm, nurtured with love & care.",
    },
    {
      icon: PackageCheck,
      title: "Safe, Secure Packaging",
      detail: "Every plant is packed with care and reaches you in pristine condition.",
    },
  ];

  return (
    <section className="mt-10">
      <h2 className="text-base font-bold">Trusted by plant parents across India</h2>
      <ul className="mt-5 space-y-5">
        {trust.map(({ icon: Icon, title, detail }) => (
          <li key={title} className="flex items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[#dcdcdc] bg-white">
              <Icon className="size-6 text-[#707070]" strokeWidth={1.5} />
            </span>
            <div>
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-0.5 text-xs leading-relaxed text-[#707070]">{detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
