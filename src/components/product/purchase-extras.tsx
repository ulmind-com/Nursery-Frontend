import * as React from "react";
import { CreditCard, Gift, MessageCircle, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { CouponBox } from "@/components/commerce/coupon-box";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { money } from "@/components/product/product-card";
import type { Settings } from "@/types/api";

export const GIFT_ORDER_KEY = "plant-nursery-is-gift";
export const GIFT_NOTE_KEY = "plant-nursery-gift-note";

type ColorOption = { label: string; available: boolean };

function swatchClass(color: string) {
  const value = color.toLowerCase();
  if (value.includes("ivory") || value.includes("cream") || value.includes("white")) return "bg-primary-tint";
  if (value.includes("terracotta") || value.includes("orange") || value.includes("red")) return "bg-sale/75";
  if (value.includes("green")) return "bg-primary";
  if (value.includes("black")) return "bg-foreground";
  return "bg-muted-foreground/55";
}

function settingText(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

type InfoProps = {
  colors?: ColorOption[];
  selectedColor?: string | undefined;
  onColorChange?: (color: string) => void;
  price: number;
  mrp?: number | null | undefined;
  quantity: number;
  stock: number;
  onQuantityChange: (quantity: number) => void;
  preview?: boolean;
  settings?: Settings | undefined;
  sku?: string | null | undefined;
  sizeLabel?: string | undefined;
};

export function PurchaseInfo({ colors = [], selectedColor, onColorChange, price, mrp, quantity, stock, onQuantityChange, preview = false, settings, sku, sizeLabel }: InfoProps) {
  const [isGift, setIsGift] = React.useState(false);
  const [giftNote, setGiftNote] = React.useState("");
  React.useEffect(() => {
    try {
      setIsGift(window.localStorage.getItem(GIFT_ORDER_KEY) === "true");
      setGiftNote(window.localStorage.getItem(GIFT_NOTE_KEY) ?? "");
    } catch { /* storage unavailable */ }
  }, []);
  const discount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const deliveryTitle = settingText(settings?.delivery?.["time"]) ?? settingText(settings?.delivery?.["delivery_time"]) ?? settingText(settings?.delivery?.["title"]) ?? settingText(settings?.delivery?.["label"]);

  const saveGift = (checked: boolean) => {
    setIsGift(checked);
    try { window.localStorage.setItem(GIFT_ORDER_KEY, String(checked)); } catch { /* storage unavailable */ }
  };
  const saveNote = (note: string) => {
    setGiftNote(note);
    try { window.localStorage.setItem(GIFT_NOTE_KEY, note); } catch { /* storage unavailable */ }
  };

  return (
    <div className="mt-5">
      {(sku || sizeLabel) && (
        <div className="border-y border-border py-3.5 text-xs text-muted-foreground">
          {sku && <p>SKU: <span className="font-medium text-foreground">{sku}</span></p>}
          {sizeLabel && <p className={sku ? "mt-1.5" : ""}>Pot size: <span className="font-semibold text-foreground">{sizeLabel}</span></p>}
        </div>
      )}

      {colors.length > 0 && (
        <section aria-labelledby="color-title" className="mt-4">
          <h2 id="color-title" className="text-sm font-semibold text-foreground">Color <span className="font-normal">– {selectedColor}</span></h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {colors.map((color) => (
              <Button key={color.label} type="button" variant="ghost" size="icon" disabled={!color.available} aria-label={`Select ${color.label}`} aria-pressed={selectedColor === color.label} onClick={() => onColorChange?.(color.label)} className={`size-9 rounded-full border bg-background p-1 ${selectedColor === color.label ? "border-primary ring-1 ring-primary" : "border-border"}`}>
                <span className={`size-full rounded-full ${swatchClass(color.label)}`} aria-hidden="true" />
              </Button>
            ))}
          </div>
        </section>
      )}

      <div className={`${colors.length > 0 || sku || sizeLabel ? "mt-4" : ""} flex flex-wrap items-baseline gap-2`}>
        <span className="text-sm font-semibold text-foreground">Price:</span>
        <span className="price-num text-2xl text-forest">{money(price)}</span>
        {mrp && mrp > price && <span className="price-num text-sm font-normal text-muted-foreground line-through">{money(mrp)}</span>}
        {discount > 0 && <span className="rounded-md bg-sale px-2 py-1 text-xs font-bold text-sale-foreground">{discount}% off</span>}
        {settings?.tax_rate !== undefined && <span className="text-xs text-muted-foreground">Inclusive of taxes.</span>}
      </div>

      <div className="mt-4">
        <label className="flex cursor-pointer items-center gap-2 text-xs text-foreground sm:text-sm">
          <Checkbox checked={isGift} onCheckedChange={(checked) => saveGift(checked === true)} className="size-4 rounded-sm" />
          <Gift className="size-4 text-primary" />
          <span>Make this a gift · Add a hand-written note free</span>
        </label>
        {isGift && <Textarea value={giftNote} onChange={(event) => saveNote(event.target.value)} maxLength={300} rows={2} placeholder="Write your gift note" className="mt-3 bg-background" aria-label="Gift note" />}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-semibold text-foreground">Quantity:</span>
        <div className="grid h-10 w-32 grid-cols-3 items-center overflow-hidden rounded-md border border-input bg-background">
          <Button type="button" variant="ghost" size="icon" className="rounded-full" disabled={quantity <= 1} onClick={() => onQuantityChange(quantity - 1)} aria-label="Decrease quantity"><Minus /></Button>
          <span className="price-num text-center text-base" aria-live="polite">{quantity}</span>
          <Button type="button" variant="ghost" size="icon" className="rounded-full" disabled={preview || stock < 1 || quantity >= stock} onClick={() => onQuantityChange(quantity + 1)} aria-label="Increase quantity"><Plus /></Button>
        </div>
      </div>

      {deliveryTitle && <p className="mt-3.5 text-xs font-bold text-forest">Delivery time: {deliveryTitle}</p>}
    </div>
  );
}

type ButtonsProps = {
  stock: number;
  preview?: boolean;
  onAdd: () => void;
  onBuyNow?: (() => void) | undefined;
};

export function PurchaseButtons({ stock, preview = false, onAdd, onBuyNow }: ButtonsProps) {
  return (
    <div className="mt-5 grid gap-2.5 sm:grid-cols-2">
      <Button type="button" className="h-11 rounded-md bg-star text-xs font-bold text-foreground hover:bg-star/90" disabled={stock < 1 && !preview} onClick={onAdd}><ShoppingBag />{preview || stock > 0 ? "Add to cart" : "Notify me"}</Button>
      <Button type="button" className="h-11 rounded-md bg-primary text-xs font-bold text-primary-foreground hover:bg-primary/90" disabled={preview || stock < 1} onClick={onBuyNow ?? onAdd}><CreditCard />Buy it now</Button>
    </div>
  );
}

type ActionsProps = {
  price: number;
  quantity: number;
  stock: number;
  preview?: boolean;
  settings?: Settings | undefined;
};

export function PurchaseActions({ price, quantity, stock, preview = false, settings }: ActionsProps) {
  const supportTitle = settingText(settings?.support?.title);
  const supportDetail = settingText(settings?.support?.note) ?? settingText(settings?.support?.hours);
  const freeAbove = typeof settings?.delivery?.free_above === "number" ? settings.delivery.free_above : undefined;
  const deliveryTitle = settingText(settings?.delivery?.["time"]) ?? settingText(settings?.delivery?.["delivery_time"]) ?? settingText(settings?.delivery?.["title"]) ?? settingText(settings?.delivery?.["label"]);
  const currency = settings?.currency ?? "₹";

  return (
    <div className="mt-5">
      <div className="mt-5"><CouponBox subtotal={price * quantity} preview={preview} /></div>

      {(settings?.plant_guarantee?.enabled || supportTitle || supportDetail || deliveryTitle || freeAbove !== undefined) && (
        <div className="mt-3 space-y-2">
          {settings?.plant_guarantee?.enabled && (
            <div className="flex items-center gap-2.5 rounded-md bg-star px-3 py-2.5 text-foreground">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-background"><ShieldCheck className="size-4" /></span>
              <div className="min-w-0"><p className="text-sm font-bold">{settings.plant_guarantee.label || `${settings.plant_guarantee.days ?? ""}-Day Plant Guarantee`}</p>{settings.plant_guarantee.description && <p className="mt-0.5 text-[11px] leading-4">{settings.plant_guarantee.description}</p>}</div>
            </div>
          )}
          {(supportTitle || supportDetail || deliveryTitle || freeAbove !== undefined) && (
            <div className="grid gap-2.5 rounded-md bg-star/55 px-3 py-2.5 sm:grid-cols-2">
              {(supportTitle || supportDetail) && <div className="flex items-center gap-2.5"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-background"><MessageCircle className="size-4" /></span><div><p className="text-xs font-bold">{supportTitle || "Plant care support"}</p>{supportDetail && <p className="text-[11px] leading-4 text-foreground/70">{supportDetail}</p>}</div></div>}
              {(deliveryTitle || freeAbove !== undefined) && <div className="flex items-center gap-2.5"><span className="grid size-8 shrink-0 place-items-center rounded-full bg-background"><Truck className="size-4" /></span><p className="text-xs font-bold">{deliveryTitle || `Free delivery above ${currency}${freeAbove?.toLocaleString("en-IN")}`}</p></div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
