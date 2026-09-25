/* Shared order furniture: the status pill and the delivery progress track. */

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Mirrors the backend's STAGES, in the order a parcel actually moves. */
export const ORDER_STAGES = [
  { key: "placed", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "shipped", label: "Shipped" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
] as const;

/** Statuses a customer may still pull out of — matches CANCELLABLE on the API. */
export const CANCELLABLE = new Set(["placed", "confirmed"]);

const TONE: Record<string, string> = {
  placed: "bg-primary-tint text-forest",
  confirmed: "bg-primary-tint text-forest",
  shipped: "bg-sky-100 text-sky-800",
  out_for_delivery: "bg-amber-100 text-amber-900",
  delivered: "bg-primary text-primary-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

export function statusLabel(status: string): string {
  const stage = ORDER_STAGES.find((s) => s.key === status);
  if (stage) return stage.label;
  return status.replace(/_/g, " ").replace(/^./, (c) => c.toUpperCase());
}

export function OrderStatusPill({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
        TONE[status] ?? "bg-muted text-muted-foreground",
        className,
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

export function OrderProgress({ status }: { status: string }) {
  if (status === "cancelled") {
    return (
      <div className="rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm text-destructive">
        This order was cancelled. Any payment made is refunded to the original method.
      </div>
    );
  }

  const current = ORDER_STAGES.findIndex((stage) => stage.key === status);
  // An unknown status shouldn't blank the track — treat it as just placed.
  const reached = current < 0 ? 0 : current;

  return (
    <ol className="flex items-start">
      {ORDER_STAGES.map((stage, index) => {
        const done = index <= reached;
        const last = index === ORDER_STAGES.length - 1;
        return (
          <li key={stage.key} className={cn("relative flex-1", last && "flex-none")}>
            <div className="flex items-center">
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border-2 text-[11px] font-bold transition",
                  done ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3.5" aria-hidden="true" /> : index + 1}
              </span>
              {!last && (
                <span className={cn("h-0.5 flex-1", index < reached ? "bg-primary" : "bg-border")} aria-hidden="true" />
              )}
            </div>
            <p
              className={cn(
                "mt-2 max-w-[5.5rem] pr-2 text-[10px] font-semibold leading-3 sm:text-[11px] sm:leading-4",
                done ? "text-forest" : "text-muted-foreground",
              )}
            >
              {stage.label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
