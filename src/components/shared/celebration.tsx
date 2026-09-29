/* The two celebratory moments in the buying flow: the confetti that fires when
   an offer lands on its own, and the full-screen mark that confirms a payment.

   Both are decoration. Neither is allowed to hold up the thing it decorates —
   the order still completes, and the discount still applies, if the animation
   never loads — and both step aside for `prefers-reduced-motion`. */

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useCallback, useEffect, useRef, useState } from "react";

/* The filenames carry spaces, so they have to be encoded to survive a URL. */
export const LOTTIE = {
  success: "/lottie/Add%20To%20Cart%20Success.json",
  confetti: "/lottie/Confetti.json",
} as const;

function usesReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Confetti over whatever it is placed in — the parent needs `relative`.
 *  Remount it with a changing `key` to fire it again. */
/* The artwork runs a shade over five seconds; cutting it short drops the
   confetti out of the air mid-fall. */
export function ConfettiBurst({ durationMs = 5200 }: { durationMs?: number }) {
  const [done, setDone] = useState(() => usesReducedMotion());

  useEffect(() => {
    if (done) return;
    const timer = window.setTimeout(() => setDone(true), durationMs);
    return () => window.clearTimeout(timer);
  }, [done, durationMs]);

  if (done) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20 overflow-visible">
      <DotLottieReact
        src={LOTTIE.confetti}
        autoplay
        loop={false}
        className="absolute left-1/2 top-1/2 size-[420px] -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
}

/** The moment after a payment clears. Plays once, then hands back with
 *  `onDone` so the caller can move on; a click skips ahead. */
export function OrderSuccessOverlay({
  amount,
  method,
  onDone,
  holdMs = 3000,
}: {
  amount?: string;
  method?: "razorpay" | "cod";
  onDone: () => void;
  holdMs?: number;
}) {
  /* The timer and a click race each other, and handing over twice would push
     two entries onto history. */
  const handedOver = useRef(false);
  const handOver = useCallback(() => {
    if (handedOver.current) return;
    handedOver.current = true;
    onDone();
  }, [onDone]);

  useEffect(() => {
    const timer = window.setTimeout(handOver, usesReducedMotion() ? 600 : holdMs);
    return () => window.clearTimeout(timer);
  }, [handOver, holdMs]);

  const paid = method === "cod";

  return (
    <div
      role="status"
      aria-live="polite"
      onClick={handOver}
      className="fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-forest/70 p-6 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-sm overflow-hidden rounded-2xl bg-background px-8 pb-9 pt-6 text-center shadow-2xl">
        <ConfettiBurst />
        <div className="relative z-10">
          <DotLottieReact src={LOTTIE.success} autoplay loop={false} className="mx-auto size-40" />
          <h2 className="font-display text-2xl font-extrabold text-forest sm:text-3xl">
            {paid ? "Order confirmed" : "Payment successful"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {amount ? (
              <>
                {paid ? <>{amount} due on delivery.</> : <>{amount} paid.</>} We're packing your plants.
              </>
            ) : (
              <>We're packing your plants.</>
            )}
          </p>
          <p className="mt-5 text-xs text-muted-foreground">Taking you to your order…</p>
        </div>
      </div>
    </div>
  );
}
