import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ChevronLeft, Download, Headset, Loader2, MapPin, Package, RotateCcw, Truck, XCircle } from "lucide-react";
import { toast } from "sonner";
import { ordersApi, queryKeys } from "@/api/services";
import { AccountShell } from "@/components/account/account-shell";
import { CANCELLABLE, OrderProgress, OrderStatusPill } from "@/components/account/order-bits";
import { money } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ErrorState, PageSkeleton } from "@/components/shared/page-state";
import { useCart } from "@/contexts/cart-context";
import { useSupportChat } from "@/contexts/support-chat-context";
import { normalizeApiError } from "@/lib/api";
import { tokenStore } from "@/lib/token";

export const Route = createFileRoute("/account/orders/$id")({
  head: () => ({
    meta: [
      { title: "Order Details | MyGarden" },
      { name: "description", content: "Order items, payment and delivery status." },
      { property: "og:title", content: "Order Details | MyGarden" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: OrderDetail,
});

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className={`flex justify-between ${strong ? "text-base font-bold text-forest" : "text-sm text-muted-foreground"}`}>
      <span>{label}</span>
      <span className={strong ? "price-num" : "price-num text-foreground"}>{value}</span>
    </div>
  );
}

function OrderDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addItem } = useCart();

  const q = useQuery({ queryKey: ["order", id], queryFn: () => ordersApi.get(id) });
  const [cancelOpen, setCancelOpen] = useState(false);
  const support = useSupportChat();
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  if (q.isLoading) return <PageSkeleton />;
  if (q.isError || !q.data) return <ErrorState retry={() => void q.refetch()} />;

  const order = q.data;
  const canCancel = CANCELLABLE.has(order.status);

  const cancel = async () => {
    setBusy(true);
    try {
      await ordersApi.cancel(order.id, reason);
      await q.refetch();
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders });
      setCancelOpen(false);
      toast.success("Order cancelled", { description: "Any payment is refunded to the original method." });
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setBusy(false);
    }
  };

  /* Reorder puts the same lines back in the basket at today's prices — the
     cart re-prices from the catalogue, so nothing is locked to an old total. */
  const reorder = () => {
    let added = 0;
    for (const item of order.items) {
      if (!item.product_id) continue;
      addItem(
        {
          product_id: item.product_id,
          title: item.title || item.product?.title || "Plant",
          ...(item.image ? { image: item.image } : {}),
          qty: item.qty || 1,
          ...(item.size_variant ? { size_variant: item.size_variant } : {}),
          unit_price: item.unit_price ?? 0,
          stock: 99,
        },
        { openDrawer: false },
      );
      added += 1;
    }
    if (added === 0) {
      toast.error("These items are no longer available");
      return;
    }
    toast.success(`${added} item${added === 1 ? "" : "s"} added to your cart`);
    void navigate({ to: "/cart" });
  };

  /* The invoice route needs the bearer token, which a plain link can't carry. */
  const downloadInvoice = async () => {
    setBusy(true);
    try {
      const response = await fetch(ordersApi.invoiceUrl(order.id), {
        headers: { Authorization: `Bearer ${tokenStore.get() ?? ""}` },
      });
      if (!response.ok) throw new Error("Invoice isn't ready for this order yet");
      const url = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${order.order_number || order.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AccountShell
      title={`Order ${order.order_number || order.id.slice(-6).toUpperCase()}`}
      {...(order.created_at
        ? { description: `Placed on ${new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}` }
        : {})}
    >
      <Link to="/account/orders" className="mb-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-forest">
        <ChevronLeft className="size-4" aria-hidden="true" /> All orders
      </Link>

      <div className="surface-card p-5 sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <OrderStatusPill status={order.status} />
          {order.estimated_delivery && order.status !== "cancelled" && (
            <p className="text-xs text-muted-foreground">
              Expected by{" "}
              <strong className="text-forest">
                {new Date(order.estimated_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </strong>
            </p>
          )}
        </div>

        <OrderProgress status={order.status} />

        <div className="mt-5 flex flex-wrap gap-2">
          {order.tracking_url && (
            <Button asChild variant="outline" className="h-10 rounded-full">
              <a href={order.tracking_url} target="_blank" rel="noreferrer">
                <Truck className="size-4" aria-hidden="true" /> Track shipment
              </a>
            </Button>
          )}
          <Button variant="outline" className="h-10 rounded-full" onClick={reorder}>
            <RotateCcw className="size-4" aria-hidden="true" /> Reorder
          </Button>
          <Button variant="outline" className="h-10 rounded-full" onClick={downloadInvoice} disabled={busy}>
            <Download className="size-4" aria-hidden="true" /> Invoice
          </Button>
          {/* Opens Help & Support already pointed at this order. */}
          <Button variant="outline" className="h-10 rounded-full" onClick={() => support.open({ orderId: order.id })}>
            <Headset className="size-4" aria-hidden="true" /> Need help?
          </Button>
          {canCancel && (
            <Button
              variant="ghost"
              className="h-10 rounded-full text-muted-foreground hover:text-destructive"
              onClick={() => setCancelOpen(true)}
            >
              <XCircle className="size-4" aria-hidden="true" /> Cancel order
            </Button>
          )}
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="surface-card p-5 sm:p-6">
          <h2 className="font-display text-base font-bold text-forest">Items</h2>
          <ul className="mt-4 divide-y divide-border">
            {order.items.map((item, index) => (
              <li key={`${item.product_id}-${index}`} className="flex items-center gap-3 py-3.5">
                <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary-soft">
                  {item.image ? (
                    <img src={item.image} alt="" className="size-full object-cover" />
                  ) : (
                    <Package className="size-5 text-primary" aria-hidden="true" />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  {item.product_id ? (
                    <Link
                      to="/product/$id"
                      params={{ id: item.product_id }}
                      className="line-clamp-2 text-sm font-semibold text-forest hover:text-primary"
                    >
                      {item.title || item.product?.title || "Plant"}
                    </Link>
                  ) : (
                    <p className="line-clamp-2 text-sm font-semibold text-forest">{item.title || "Plant"}</p>
                  )}
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.size_variant ? `Size ${item.size_variant} · ` : ""}Qty {item.qty}
                  </p>
                </div>
                <p className="price-num shrink-0 text-sm font-bold text-forest">{money(item.total ?? 0)}</p>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-4">
          <div className="surface-card p-5">
            <h2 className="font-display text-base font-bold text-forest">Payment</h2>
            <div className="mt-4 space-y-2">
              <Row label="Subtotal" value={money(order.subtotal ?? 0)} />
              {Boolean(order.discount) && <Row label="Discount" value={`- ${money(order.discount ?? 0)}`} />}
              <Row label="Delivery" value={order.delivery ? money(order.delivery) : "Free"} />
              {Boolean(order.tax) && <Row label="Tax" value={money(order.tax ?? 0)} />}
              <div className="border-t border-border pt-2">
                <Row label="Total" value={money(order.total ?? 0)} strong />
              </div>
            </div>
            {order.payment_method && (
              <p className="mt-3 text-xs text-muted-foreground">
                Paid by {order.payment_method.toUpperCase()}
                {order.payment_status ? ` · ${order.payment_status}` : ""}
              </p>
            )}
          </div>

          {order.address && (
            <div className="surface-card p-5">
              <h2 className="flex items-center gap-1.5 font-display text-base font-bold text-forest">
                <MapPin className="size-4 text-primary" aria-hidden="true" /> Delivering to
              </h2>
              <p className="mt-3 text-sm font-semibold text-forest">{order.address.name}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {order.address.house}
                {order.address.area ? `, ${order.address.area}` : ""}
                <br />
                {order.address.city}, {order.address.state} {order.address.pincode}
                <br />
                {order.address.phone}
              </p>
            </div>
          )}
        </aside>
      </div>

      <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Cancel this order?</DialogTitle>
          </DialogHeader>
          <p className="text-sm leading-6 text-muted-foreground">
            The plants go back to the nursery and any payment is refunded to the original method. This can't be undone.
          </p>
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tell us why (optional) — it helps us improve."
            rows={3}
            className="mt-1"
          />
          <div className="mt-2 flex gap-2">
            <Button variant="destructive" onClick={cancel} disabled={busy} className="h-11 flex-1 rounded-full">
              {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              Cancel order
            </Button>
            <Button variant="ghost" onClick={() => setCancelOpen(false)} className="h-11 rounded-full">
              Keep it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AccountShell>
  );
}
