import { Headset, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import type { Settings } from "@/types/api";

export function TrustBar({ settings }: { settings: Settings | undefined }) {
  const freeAbove = settings?.delivery?.free_above;
  const guarantee = settings?.plant_guarantee;
  const currency = settings?.currency ?? "₹";
  const items = [
    guarantee?.enabled ? { icon: ShieldCheck, title: guarantee.label || `${guarantee.days ?? 30}-day plant guarantee`, text: guarantee.description || "Healthy arrival, backed by our team." } : null,
    typeof freeAbove === "number" ? { icon: Truck, title: `Free delivery above ${currency}${freeAbove.toLocaleString("en-IN")}`, text: "Exact charges confirmed at checkout." } : null,
    { icon: PackageCheck, title: "Secure packaging", text: "Hand-packed so plants travel upright." },
    settings?.support?.hours ? { icon: Headset, title: "Expert support", text: settings.support.hours } : { icon: Headset, title: "Expert support", text: "Care guidance from real growers." },
  ].filter((item): item is { icon: typeof Truck; title: string; text: string } => item !== null);

  return (
    <section className="border-y bg-primary-tint">
      <div className="mx-auto grid max-w-[1480px] gap-6 px-5 py-10 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-10">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-start gap-3">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-primary"><Icon className="size-4" /></span>
            <div>
              <h3 className="text-sm font-bold text-forest">{title}</h3>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
