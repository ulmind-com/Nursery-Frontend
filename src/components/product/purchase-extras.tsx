import * as React from "react";
import { Gift, MessageCircle, Minus, Plus, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { CouponBox } from "@/components/commerce/coupon-box";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { money } from "@/components/product/product-card";
import type { Settings } from "@/types/api";

export const GIFT_ORDER_KEY = "plant-nursery-is-gift";
export const GIFT_NOTE_KEY = "plant-nursery-gift-note";

type ColorOption = { label: string; available: boolean };

type PurchaseExtrasProps = {
  colors?: ColorOption[];
  selectedColor?: string | undefined;
  onColorChange?: (color: string) => void;
  price: number;
  mrp?: number | null | undefined;
  quantity: number;
  stock: number;
  onQuantityChange: (quantity: number) => void;
  onAdd: () => void;
  preview?: boolean;
  settings?: Settings | undefined;
};

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

export function PurchaseExtras({ colors = [], selectedColor, onColorChange, price, mrp, quantity, stock, onQuantityChange, onAdd, preview = false, settings }: PurchaseExtrasProps) {
  const [isGift, setIsGift] = React.useState(false);
  const [giftNote, setGiftNote] = React.useState("");
  React.useEffect(() => {
    try {
      setIsGift(window.localStorage.getItem(GIFT_ORDER_KEY) === "true");
      setGiftNote(window.localStorage.getItem(GIFT_NOTE_KEY) ?? "");
    } catch { /* storage unavailable */ }
  }, []);
  const discount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const deliveryTitle = settingText(settings?.delivery?.["title"]) ?? settingText(settings?.delivery?.["label"]);
  const supportTitle = settingText(settings?.support?.title);
  const supportDetail = settingText(settings?.support?.note) ?? settingText(settings?.support?.hours);
  const freeAbove = typeof settings?.delivery?.free_above === "number" ? settings.delivery.free_above : undefined;
  const currency = settings?.currency ?? "₹";

  const saveGift = (checked: boolean) => {
    setIsGift(checked);
    try { window.localStorage.setItem(GIFT_ORDER_KEY, String(checked)); } catch { /* storage unavailable */ }
  };
  const saveNote = (note: string) => {
    setGiftNote(note);
    try { window.localStorage.setItem(GIFT_NOTE_KEY, note); } catch { /* storage unavailable */ }
  };

  return (
    <div className="mt-8">
      {colors.length > 0 && (
        <section aria-labelledby="color-title">
          <h2 id="color-title" className="text-xl text-forest">Color <span className="font-normal">– {selectedColor}</span></h2>
          <div className="mt-4 flex flex-wrap gap-2.5">
            {colors.map((color) => (
              <Button key={color.label} type="button" variant="ghost" size="icon" disabled={!color.available} aria-label={`Select ${color.label}`} aria-pressed={selectedColor === color.label} onClick={() => onColorChange?.(color.label)} className={`size-12 rounded-full border bg-background p-1.5 ${selectedColor === color.label ? "border-primary ring-1 ring-primary" : "border-border"}`}>
                <span className={`size-full rounded-full ${swatchClass(color.label)}`} aria-hidden="true" />
              </Button>
            ))}
          </div>
        </section>
      )}

      <div className={`${colors.length > 0 ? "mt-7" : ""} flex flex-wrap items-baseline gap-3`}>
        <span className="price-num text-4xl text-forest">{money(price)}</span>
        {mrp && mrp > price && <span className="price-num text-lg font-normal text-muted-foreground line-through">{money(mrp)}</span>}
        {discount > 0 && <span className="rounded-md bg-sale px-2 py-1 text-xs font-bold text-sale-foreground">{discount}% off</span>}
        {settings?.tax_rate !== undefined && <span className="text-sm text-muted-foreground">Tax confirmed at checkout.</span>}
      </div>

      <div className="mt-8">
        <label className="flex cursor-pointer items-center gap-3 text-base text-foreground sm:text-lg">
          <Checkbox checked={isGift} onCheckedChange={(checked) => saveGift(checked === true)} className="size-6 rounded-sm" />
          <Gift className="size-5 text-primary" />
          <span>Make this a gift · Add a handwritten note</span>
        </label>
        {isGift && <Textarea value={giftNote} onChange={(event) => saveNote(event.target.value)} maxLength={300} rows={2} placeholder="Write your gift note" className="mt-3 bg-background" aria-label="Gift note" />}
      </div>

      <div className="mt-7 grid grid-cols-[132px_minmax(0,1fr)] gap-3 sm:grid-cols-[180px_minmax(0,1fr)]">
        <div className="grid h-14 grid-cols-3 items-center rounded-full border border-input bg-background px-2">
          <Button type="button" variant="ghost" size="icon" className="rounded-full" disabled={quantity <= 1} onClick={() => onQuantityChange(quantity - 1)} aria-label="Decrease quantity"><Minus /></Button>
          <span className="price-num text-center text-base" aria-live="polite">{quantity}</span>
          <Button type="button" variant="ghost" size="icon" className="rounded-full" disabled={preview || stock < 1 || quantity >= stock} onClick={() => onQuantityChange(quantity + 1)} aria-label="Increase quantity"><Plus /></Button>
        </div>
        <Button type="button" className="h-14 rounded-full bg-forest text-base text-forest-foreground hover:bg-forest/90" disabled={stock < 1 && !preview} onClick={onAdd}><ShoppingBag />{preview ? "Preview only" : stock > 0 ? "Add To Cart" : "Out of stock"}</Button>
      </div>

      <div className="mt-8"><CouponBox subtotal={price * quantity} preview={preview} /></div>

      {(settings?.plant_guarantee?.enabled || supportTitle || supportDetail || deliveryTitle || freeAbove !== undefined) && (
        <div className="mt-4 space-y-3">
          {settings?.plant_guarantee?.enabled && (
            <div className="flex items-center gap-3 rounded-lg bg-star px-4 py-3 text-foreground">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-background"><ShieldCheck className="size-5" /></span>
              <div className="min-w-0"><p className="font-bold">{settings.plant_guarantee.label || `${settings.plant_guarantee.days ?? ""}-Day Plant Guarantee`}</p>{settings.plant_guarantee.description && <p className="mt-0.5 text-xs">{settings.plant_guarantee.description}</p>}</div>
            </div>
          )}
          {(supportTitle || supportDetail || deliveryTitle || freeAbove !== undefined) && (
            <div className="grid gap-3 rounded-lg bg-star/55 px-4 py-3 sm:grid-cols-2">
              {(supportTitle || supportDetail) && <div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-background"><MessageCircle className="size-5" /></span><div><p className="font-bold">{supportTitle || "Plant care support"}</p>{supportDetail && <p className="text-xs text-foreground/70">{supportDetail}</p>}</div></div>}
              {(deliveryTitle || freeAbove !== undefined) && <div className="flex items-center gap-3"><span className="grid size-9 shrink-0 place-items-center rounded-full bg-background"><Truck className="size-5" /></span><p className="font-bold">{deliveryTitle || `Free delivery above ${currency}${freeAbove?.toLocaleString("en-IN")}`}</p></div>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}