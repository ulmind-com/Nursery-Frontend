/* "Bringing Nature to Homes Across India" — the closing band above the footer:
   the delivery map on one side, the planting illustration and the reach figure
   on the other. The markers drop onto the map once the band scrolls into view,
   so the animation is not spent while the section is still far below. */

import { useEffect, useRef, useState } from "react";

import { INDIA_PINS, INDIA_STATE_PATHS, INDIA_VIEWBOX } from "@/components/home/india-map-data";

export function NatureAcrossIndiaSection({
  title = "Bringing Nature to Homes Across India",
  subtitle = "Hand picked from our nurseries and delivered fresh to your homes",
  statValue = "4000+",
  statLabel = "Cities covered with secure packaging and timely dispatch in pan india.",
  image = "/cta design.png",
}: {
  title?: string;
  subtitle?: string;
  statValue?: string;
  statLabel?: string;
  image?: string;
}) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [dropped, setDropped] = useState(false);

  useEffect(() => {
    const node = mapRef.current;
    /* Without the observer the markers would sit invisible forever, so an
       environment that has no IntersectionObserver just skips the animation. */
    if (!node || typeof IntersectionObserver === "undefined") {
      setDropped(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setDropped(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white pt-14 lg:pt-20">
      <style>{`
        @keyframes mygarden-pin-drop {
          0%   { opacity: 0; transform: translateY(-30px) scale(0.6); }
          55%  { opacity: 1; transform: translateY(0) scale(1); }
          72%  { transform: translateY(-7px) scale(1); }
          88%  { transform: translateY(0) scale(1); }
          94%  { transform: translateY(-2px) scale(1); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        .mygarden-pin {
          opacity: 0;
          transform-box: fill-box;
          transform-origin: center;
        }
        @keyframes mygarden-pin-bob {
          0%, 100% { opacity: 1; transform: translateY(0) scale(1); }
          50%      { opacity: 1; transform: translateY(-5px) scale(1.06); }
        }
        [data-pins-dropped="true"] .mygarden-pin {
          animation:
            mygarden-pin-drop 900ms cubic-bezier(0.22, 1, 0.36, 1) both,
            mygarden-pin-bob 2200ms ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .mygarden-pin { opacity: 1; }
          [data-pins-dropped="true"] .mygarden-pin { animation: none; }
        }
      `}</style>

      {/* The copy, the map and the illustration are siblings rather than two
          stacked columns, so the illustration can be the last thing in the grid
          and sit flush on the footer while the rest keeps its bottom spacing. */}
      <div className="mx-auto grid max-w-[1280px] gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-0 lg:px-10">
        <div className="lg:col-start-1 lg:row-start-1">
          <h2 className="max-w-[460px] text-3xl font-bold leading-tight text-[#12100e] sm:text-4xl lg:text-[2.75rem]">
            {title}
          </h2>
          <p className="mt-4 max-w-[420px] text-base leading-7 text-[#4a4a46] sm:text-lg">{subtitle}</p>
        </div>

        <div
          ref={mapRef}
          data-pins-dropped={dropped}
          className="flex flex-col items-center pb-12 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pb-16"
        >
          <svg
            viewBox={INDIA_VIEWBOX}
            role="img"
            aria-label={`Delivery reach across India — ${statValue} cities covered`}
            className="h-auto w-full max-w-[520px]"
          >
            <g fill="#ffffff" stroke="#d8d4cb" strokeWidth="1" strokeLinejoin="round">
              {INDIA_STATE_PATHS.map((d, index) => (
                <path key={index} d={d} />
              ))}
            </g>
            {INDIA_PINS.map((pin, index) => (
              <g key={pin.id} transform={`translate(${pin.x} ${pin.y})`}>
                {/* Two delays: when this marker drops, then when it starts to
                    bob — the second waits out the drop so they never overlap. */}
                <g className="mygarden-pin" style={{ animationDelay: `${index * 60}ms, ${index * 60 + 900}ms` }}>
                  <circle r="10" fill="#e8f3df" stroke="#5a9e2f" strokeWidth="1.5" />
                  {/* A leaf, matching the mark the brand uses elsewhere. */}
                  <path
                    d="M-4.2 3.4c-1.4-3.6 0.6-7 4.9-7.8 1.9-0.35 3.1-0.1 3.5 0.3 0.4 0.4 0.3 1.7-0.2 3.5-1.2 4.2-4.6 5.9-8.2 4z"
                    fill="#5a9e2f"
                  />
                  <path d="M2.6-2.6L-3.2 3.1" stroke="#e8f3df" strokeWidth="0.9" strokeLinecap="round" />
                </g>
              </g>
            ))}
          </svg>

          <div className="mt-2 w-full max-w-[520px] text-left lg:-mt-24 lg:self-end lg:text-right">
            <p className="text-5xl font-bold leading-none text-[#0f7a3d] sm:text-6xl lg:text-7xl">{statValue}</p>
            <p className="mt-3 max-w-[360px] text-sm leading-6 text-[#4a4a46] sm:text-base lg:ml-auto">{statLabel}</p>
          </div>
        </div>

        <img
          src={image}
          alt="Two people planting a sapling together"
          loading="lazy"
          className="block w-full max-w-[560px] self-end object-contain lg:col-start-1 lg:row-start-2"
        />
      </div>
    </section>
  );
}
