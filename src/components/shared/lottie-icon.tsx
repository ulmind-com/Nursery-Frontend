/* Lightweight wrapper around DotLottieReact that plays on hover and falls back
   to a static Lucide icon when the file hasn't loaded yet.

   Usage:
     <LottieIcon src="/lottie/search.json" fallback={Search} className="size-5" />
*/

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useCallback, useRef, useState } from "react";
import type { DotLottie } from "@lottiefiles/dotlottie-react";
import type { LucideIcon } from "lucide-react";

interface LottieIconProps {
  /** Path to the .json lottie file in /public */
  src: string;
  /** Static icon shown while the animation is loading or on error */
  fallback: LucideIcon;
  /** Tailwind size classes like "size-5" */
  className?: string;
  /** Whether the icon should loop continuously (default: false — plays on hover) */
  loop?: boolean;
  /** Whether the icon should autoplay on mount */
  autoplay?: boolean;
  /** aria-label for accessibility */
  label?: string;
}

export function LottieIcon({
  src,
  fallback: Icon,
  className = "size-5",
  loop = true,
  autoplay = true,
  label,
}: LottieIconProps) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const dotLottieRef = useRef<DotLottie | null>(null);

  const refCallback = useCallback(
    (player: DotLottie | null) => {
      if (!player) return;
      dotLottieRef.current = player;
      player.addEventListener("loadError", () => setFailed(true));
      player.addEventListener("load", () => setLoaded(true));
    },
    [],
  );

  const handleMouseEnter = useCallback(() => {
    const player = dotLottieRef.current;
    if (!player || loop) return;
    player.play();
  }, [loop]);

  const handleMouseLeave = useCallback(() => {
    const player = dotLottieRef.current;
    if (!player || loop) return;
    player.stop();
  }, [loop]);

  if (failed) {
    return <Icon className={className} aria-label={label} />;
  }

  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={label}
    >
      {/* Show static icon underneath until lottie loads */}
      {!loaded && <Icon className={className} aria-hidden />}
      <DotLottieReact
        src={src}
        loop={loop}
        autoplay={autoplay}
        className={`${className} ${loaded ? "" : "absolute opacity-0"}`}
        dotLottieRefCallback={refCallback}
      />
    </span>
  );
}

/* ── Centralised path registry for every Lottie used across the app ────── */

export const LOTTIE_ICONS = {
  search:         "/lottie/search.json",
  magnifier:      "/lottie/wired-outline-19-magnifier-in-reveal.json",
  heartPinch:     "/lottie/system-solid-20-heart-hover-pinch.json",
  heartBeat:      "/lottie/wired-flat-20-heart-hover-heartbeat.json",
  shoppingBag:    "/lottie/Shoppinh.json",
  airPurifying:   "/lottie/Windblow.json",
  lowMaintenance: "/lottie/Leaf%20Growing.json",
  petSafe:        "/lottie/cat%20paw%20loading.json",
} as const;
