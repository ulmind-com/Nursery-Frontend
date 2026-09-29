import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { queryKeys, settingsApi } from "@/api/services";
import { useCart } from "@/contexts/cart-context";
import { cn } from "@/lib/utils";
import type { RewardMilestone } from "@/types/api";

/* The rail every cart screen shares: the customer's subtotal walking along a
   green-to-yellow track, with a stop for each reward the nursery is offering.
   Every stop — how much it costs, what it is called, which PNG sits on it —
   comes from the admin panel, so the rail changes without a deploy. */

const GIFT_ART = "/rewards/gift.png";
const FALLBACK_ART: Record<string, string> = {
  shipping: "/rewards/shipping.png",
  gift: GIFT_ART,
  discount: "/rewards/discount.png",
};

const artFor = (stop: RewardMilestone) =>
  stop.icon?.trim() || FALLBACK_ART[stop.kind ?? "gift"] || GIFT_ART;

const inr = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

/* Stops sit at even steps between these two ends rather than at their true
   value: a ₹150 stop next to a ₹899 one would otherwise crowd the left edge. */
const FIRST = 10;
const LAST = 90;

interface Stop extends RewardMilestone {
  x: number;
  unlocked: boolean;
  isNext: boolean;
}

interface Rail {
  enabled: boolean;
  stops: Stop[];
  fill: number;
  next: RewardMilestone | null;
  remaining: number;
  headline: string;
  showInCart: boolean;
  showStickyBar: boolean;
}

/** Reads the admin's reward setup and works out where this cart stands on it. */
function useRewardRail(subtotal: number): Rail {
  const { data: settings } = useQuery({
    queryKey: queryKeys.settings,
    queryFn: settingsApi.get,
    staleTime: 300_000,
  });
  const rewards = settings?.rewards;

  return useMemo<Rail>(() => {
    const milestones = (rewards?.milestones ?? [])
      .filter((stop) => (stop.amount ?? 0) > 0)
      .sort((a, b) => a.amount - b.amount);

    const idle: Rail = {
      enabled: false,
      stops: [],
      fill: 0,
      next: null,
      remaining: 0,
      headline: "",
      showInCart: false,
      showStickyBar: false,
    };
    if (rewards?.enabled === false || milestones.length === 0) return idle;

    const count = milestones.length;
    const at = (index: number) =>
      count === 1 ? LAST : FIRST + ((LAST - FIRST) * index) / (count - 1);

    const cleared = milestones.filter((stop) => subtotal >= stop.amount).length;
    const nextIndex = cleared < count ? cleared : -1;
    const next = nextIndex === -1 ? null : (milestones[nextIndex] ?? null);

    /* The fill doesn't jump from stop to stop — it creeps along the segment the
       customer is currently in, which is what makes the bar feel alive. */
    let fill = 100;
    if (next) {
      const fromAmount = cleared > 0 ? (milestones[cleared - 1]?.amount ?? 0) : 0;
      const fromX = cleared > 0 ? at(cleared - 1) : 0;
      const span = next.amount - fromAmount;
      const walked = span > 0 ? Math.min(1, Math.max(0, (subtotal - fromAmount) / span)) : 1;
      fill = fromX + (at(nextIndex) - fromX) * walked;
    }

    const remaining = next ? Math.max(0, next.amount - subtotal) : 0;
    const headline = next
      ? (rewards?.teaser || "Add {amount} more to unlock {reward}")
          .replace("{amount}", inr(remaining))
          .replace("{reward}", next.label || "your next reward")
      : rewards?.unlocked || "All rewards unlocked";

    return {
      enabled: true,
      stops: milestones.map((stop, index) => ({
        ...stop,
        x: at(index),
        unlocked: subtotal >= stop.amount,
        isNext: index === nextIndex,
      })),
      fill,
      next,
      remaining,
      headline,
      showInCart: rewards?.show_in_cart !== false,
      showStickyBar: rewards?.show_sticky_bar !== false,
    };
  }, [rewards, subtotal]);
}

/** The lit part of the track — green at the start, yellow where it has reached. */
function Track({ fill, dark }: { fill: number; dark: boolean }) {
  return (
    <div
      className={cn("relative h-[9px] w-full rounded-full", dark ? "bg-white/12" : "bg-[#ececec]")}
    >
      <div
        className="reward-fill absolute inset-y-0 left-0 overflow-hidden rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${fill}%` }}
      >
        <span
          aria-hidden="true"
          className="reward-sheen absolute inset-y-0 left-0 w-1/3 rounded-full"
          style={{
            background:
              "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.85) 50%,transparent 100%)",
          }}
        />
      </div>
    </div>
  );
}

function StopArt({ stop, size }: { stop: Stop; size: number }) {
  return (
    <img
      src={artFor(stop)}
      alt=""
      aria-hidden="true"
      loading="lazy"
      width={size}
      height={size}
      className={cn(
        "object-contain transition-[filter,opacity] duration-300",
        !stop.unlocked && !stop.isNext && "opacity-45 grayscale",
        stop.isNext && "opacity-90",
      )}
      style={{ width: size, height: size }}
    />
  );
}

/* ── Full rail: the cart drawer version, with a label under every stop ─────── */

export function RewardRail({ subtotal, className }: { subtotal: number; className?: string }) {
  const rail = useRewardRail(subtotal);
  if (!rail.enabled || !rail.showInCart) return null;

  return (
    <div className={cn("select-none", className)}>
      <p className="text-center text-[15px] leading-snug text-[#1f2a24]">
        {rail.next ? (
          <>
            You're <strong className="font-extrabold text-[#d1342f]">{inr(rail.remaining)}</strong>{" "}
            away from <strong className="font-extrabold text-[#d1342f]">{rail.next.label}</strong>
          </>
        ) : (
          <strong className="font-extrabold text-[#00A45B]">{rail.headline}</strong>
        )}
      </p>

      <div className="relative mt-6 px-1 pb-11">
        <Track fill={rail.fill} dark={false} />
        {rail.stops.map((stop, index) => (
          <div
            key={`${stop.amount}-${index}`}
            className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
            style={{ left: `${stop.x}%` }}
          >
            <span
              className={cn(
                "relative flex size-[38px] items-center justify-center rounded-full transition-all duration-300",
                stop.unlocked
                  ? "border-2 border-[#00A45B] bg-white shadow-[0_0_0_4px_rgba(0,164,91,0.14)]"
                  : stop.isNext
                    ? "border-2 border-dashed border-[#00A45B] bg-white shadow-[0_0_0_4px_rgba(237,239,53,0.25)]"
                    : "border border-[#dcdcdc] bg-[#f4f4f4]",
              )}
            >
              <StopArt stop={stop} size={21} />
              {stop.unlocked && (
                <span className="absolute -bottom-0.5 -right-0.5 flex size-[15px] items-center justify-center rounded-full border-2 border-white bg-[#00A45B]">
                  <svg viewBox="0 0 24 24" className="size-2.5" aria-hidden="true">
                    <path
                      d="M5 13l4 4L19 7"
                      fill="none"
                      stroke="#fff"
                      strokeWidth="4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              )}
            </span>

            <span
              className={cn(
                "mt-2 whitespace-nowrap text-[12px] font-extrabold tabular-nums",
                stop.unlocked ? "text-[#00A45B]" : "text-[#3a3a3a]",
              )}
            >
              {inr(stop.amount)}
            </span>
            <span className="max-w-[82px] text-center text-[10px] font-medium leading-tight text-[#7a7a7a]">
              {stop.label}
            </span>
            {stop.caption && (
              <span className="max-w-[82px] text-center text-[9px] leading-tight text-[#9a9a9a]">
                {stop.caption}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Sticky bar: the same rail, compressed, floating above the page ───────── */

export function RewardBar() {
  const { subtotal, count, isOpen, openCart } = useCart();
  const rail = useRewardRail(subtotal);
  if (!rail.enabled || !rail.showStickyBar || count === 0 || isOpen) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[74px] z-40 px-3 lg:bottom-6">
      <div className="pointer-events-auto mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-white/10 bg-[#1b2129]/95 p-2.5 pl-3 shadow-[0_10px_34px_rgba(0,0,0,0.32)] backdrop-blur-md sm:gap-5 sm:p-3 sm:pl-4">
        <button
          type="button"
          onClick={openCart}
          aria-label={`Open cart, ${count} item${count > 1 ? "s" : ""}`}
          className="relative flex size-11 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/15"
        >
          <svg viewBox="0 0 24 24" className="size-5 text-white/85" aria-hidden="true">
            <path
              d="M3 5h2l2.4 10.4a2 2 0 002 1.6h7.5a2 2 0 002-1.6L20.5 8H6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="10" cy="20" r="1.4" fill="currentColor" />
            <circle cx="17" cy="20" r="1.4" fill="currentColor" />
          </svg>
          <span className="absolute -right-1 -top-1 flex size-[19px] items-center justify-center rounded-full bg-[#00A45B] text-[10px] font-bold text-white">
            {count}
          </span>
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13px] font-semibold text-white/90 sm:text-sm">
            {rail.next ? (
              <>
                Add <span className="font-extrabold text-[#EDEF35]">{inr(rail.remaining)}</span>{" "}
                more to unlock{" "}
                <span className="font-extrabold text-[#EDEF35]">{rail.next.label}</span>
              </>
            ) : (
              <span className="font-extrabold text-[#EDEF35]">{rail.headline}</span>
            )}
          </p>

          <div className="relative mt-2.5 h-[22px]">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2">
              <Track fill={rail.fill} dark />
            </div>
            {rail.stops.map((stop, index) => (
              <span
                key={`${stop.amount}-${index}`}
                title={`${inr(stop.amount)} · ${stop.label}`}
                className={cn(
                  "absolute top-1/2 flex size-[22px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full transition-all duration-300",
                  stop.unlocked
                    ? "bg-[#1b2129] shadow-[0_0_0_2px_#EDEF35,0_0_10px_rgba(237,239,53,0.65)]"
                    : stop.isNext
                      ? "bg-[#1b2129] shadow-[0_0_0_2px_rgba(237,239,53,0.5)]"
                      : "bg-[#39414c]",
                )}
                style={{ left: `${stop.x}%` }}
              >
                <StopArt stop={stop} size={13} />
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={openCart}
          className="shrink-0 rounded-xl bg-[#00A45B] px-4 py-3 text-[12px] font-extrabold uppercase tracking-wide text-white transition-colors hover:bg-[#009250] sm:px-6 sm:text-[13px]"
        >
          View cart
        </button>
      </div>
    </div>
  );
}
