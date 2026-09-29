import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Check, Lock } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/* A checkout that has to be dragged, not tapped. The extra beat of intent is
   the point: nobody reaches the payment page by brushing a button on the way
   past the cart. Pointer events drive it, so one code path covers mouse, pen
   and touch; the keyboard gets a plain activation instead, since asking
   someone to "drag" with a keyboard would be nonsense. */

const KNOB = 48; // px
const PAD = 4; // track inset around the knob
const COMMIT = 0.9; // how far along counts as "slid"

export function SlideToCheckout({
  onDone,
  className,
}: {
  onDone?: () => void;
  className?: string;
}) {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);
  const grabbedAt = useRef(0);
  const [offset, setOffset] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [done, setDone] = useState(false);

  const travel = () => Math.max(1, (trackRef.current?.clientWidth ?? 0) - KNOB - PAD * 2);

  const go = useCallback(() => {
    if (done) return;
    setDone(true);
    setOffset(travel());
    // Let the knob land and the tick register before the page changes under it.
    window.setTimeout(() => {
      onDone?.();
      void navigate({ to: "/checkout" });
    }, 280);
  }, [done, navigate, onDone]);

  const start = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (done) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    grabbedAt.current = event.clientX - offset;
    setDragging(true);
  };

  const move = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging || done) return;
    const max = travel();
    setOffset(Math.min(max, Math.max(0, event.clientX - grabbedAt.current)));
  };

  const end = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (!dragging || done) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    setDragging(false);
    // A tap that never travelled is not a slide — it springs back, so a stray
    // click on the knob can't buy anything.
    if (offset >= travel() * COMMIT) go();
    else setOffset(0);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (!["Enter", " ", "Spacebar", "ArrowRight", "End"].includes(event.key)) return;
    event.preventDefault();
    go();
  };

  const progress = offset / travel();

  return (
    <div
      ref={trackRef}
      className={cn(
        "relative flex h-[56px] w-full select-none items-center overflow-hidden rounded-full bg-[#14261C]",
        className,
      )}
    >
      {/* What has been dragged so far, in the same green-to-lime the reward rail uses. */}
      <div
        className="absolute inset-y-1 left-1 rounded-full transition-[width] duration-200 ease-out"
        style={{
          width: `${offset + KNOB}px`,
          background: "linear-gradient(90deg,#178a46 0%,#3FBA53 55%,#9BD62F 100%)",
          transitionDuration: dragging ? "0ms" : "260ms",
        }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center gap-2 text-[15px] font-bold tracking-tight transition-opacity duration-200"
        style={{ opacity: done ? 0 : Math.max(0, 1 - progress * 1.6) }}
      >
        <span className="slide-hint">Slide to checkout</span>
        <Lock className="size-[15px] text-white/70" />
      </span>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-[15px] font-bold tracking-tight text-white transition-opacity duration-200"
        style={{ opacity: done ? 1 : 0 }}
      >
        Taking you to checkout…
      </span>

      <button
        type="button"
        aria-label="Slide to checkout"
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerCancel={end}
        onKeyDown={onKeyDown}
        className={cn(
          "absolute left-1 flex size-12 touch-none items-center justify-center rounded-full bg-white text-[#14261C] shadow-[0_2px_10px_rgba(0,0,0,0.28)] outline-none transition-transform duration-200 ease-out focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#14261C]",
          dragging ? "cursor-grabbing scale-[1.04]" : "cursor-grab",
        )}
        style={{
          transform: `translateX(${offset}px)`,
          transitionDuration: dragging ? "0ms" : "260ms",
        }}
      >
        {done ? <Check className="size-5 text-[#178a46]" /> : <ArrowRight className="size-5" />}
      </button>
    </div>
  );
}
