/* One icon slot for both worlds: a .json / .lottie source plays as an
   animation, anything else renders as a plain image. If the animation cannot
   load (missing file, bad JSON) it falls back to `fallback`, so a card never
   ends up empty. Admin can therefore upload a Lottie as a category image and
   it starts moving with no code change. */

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState } from "react";

export const isLottie = (src?: string) => /\.(json|lottie)(\?.*)?$/i.test(src ?? "");

export function LottieIcon({
  src,
  fallback,
  alt,
  className = "size-full object-contain",
}: {
  src?: string;
  fallback?: string;
  alt: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const animated = isLottie(src) && !failed;

  if (animated)
    return (
      <DotLottieReact
        src={src as string}
        loop
        autoplay
        aria-label={alt}
        className={className}
        dotLottieRefCallback={(player) => player?.addEventListener("loadError", () => setFailed(true))}
      />
    );

  const image = failed ? fallback : (src ?? fallback);
  if (!image) return null;
  return <img src={image} alt={alt} loading="lazy" className={className} />;
}
