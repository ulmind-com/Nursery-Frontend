/* Animated badge for the trust strip: plays a Lottie from public/lottie and
   falls back to the static icon while the file is missing or still loading. */

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

export function TrustLottie({ src, icon: Icon, label }: { src: string; icon: LucideIcon; label: string }) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="flex size-14 items-center justify-center overflow-hidden rounded-full border-2 border-black bg-white">
      {failed ? (
        <Icon className="size-6 text-black" aria-hidden="true" />
      ) : (
        <DotLottieReact
          src={src}
          loop
          autoplay
          aria-label={label}
          className="size-9"
          onLoadError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
