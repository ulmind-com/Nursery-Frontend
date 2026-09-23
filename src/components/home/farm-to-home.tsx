import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";
import type { SiteMedia } from "@/types/api";

export interface FarmCard {
  id: string;
  image: string;
  alt: string;
}

/* Local defaults — used until the admin panel supplies "farm" media */
export const defaultFarmCards: FarmCard[] = [
  { id: "farm-1", image: "/farm/farm-1.jpg", alt: "Grown with care in our nursery" },
  { id: "farm-2", image: "/farm/farm-2.jpg", alt: "Quality you can trust" },
  { id: "farm-3", image: "/farm/farm-3.jpg", alt: "Packed for a greener tomorrow" },
  { id: "farm-4", image: "/farm/farm-4.jpg", alt: "Brings nature home" },
];

/* Map admin-managed site media (section: "farm") onto farm cards */
export function farmCardsFromMedia(media: SiteMedia[] | undefined): FarmCard[] {
  const mapped = (media ?? [])
    .filter((item) => item.image)
    .map((item, index) => ({
      id: item.id ?? `farm-media-${index}`,
      image: item.image as string,
      alt: item.title || "From our farm to your home",
    }));
  return mapped.length > 0 ? mapped : defaultFarmCards;
}

const AUTO_SPEED = 32; // px per second — slow, continuous drift
const RESUME_DELAY = 2000; // ms of quiet after an arrow click before auto-scroll resumes

export function FarmToHomeSection({
  cards = defaultFarmCards,
  title = "From Our Farm to Your Home",
  subtitle = "Every plant is nursed in our farms, hand-picked, and packed to survive the journey — not just reach your doorstep.",
}: {
  cards?: FarmCard[];
  title?: string;
  subtitle?: string;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const pausedUntil = useRef(0);
  const hovering = useRef(false);
  /* Distance still owed to an arrow click; the animation loop is the only writer of scrollLeft */
  const nudgeRemaining = useRef(0);

  /* Continuous right-to-left drift that loops seamlessly over the duplicated track */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last = performance.now();

    const step = (now: number) => {
      const elapsed = now - last;
      last = now;

      if (nudgeRemaining.current !== 0) {
        /* Ease out the arrow jump, ~450ms to cover the remaining distance */
        const move = nudgeRemaining.current * Math.min(1, elapsed / 160);
        rail.scrollLeft += move;
        nudgeRemaining.current -= move;
        if (Math.abs(nudgeRemaining.current) < 0.5) nudgeRemaining.current = 0;
      } else if (!hovering.current && now >= pausedUntil.current) {
        rail.scrollLeft += (AUTO_SPEED * elapsed) / 1000;
      }
      const half = rail.scrollWidth / 2;
      if (half > 0) {
        if (rail.scrollLeft >= half) rail.scrollLeft -= half;
        else if (rail.scrollLeft <= 0) rail.scrollLeft += half;
      }
      frame = requestAnimationFrame(step);
    };

    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [cards.length]);

  const nudge = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    pausedUntil.current = performance.now() + RESUME_DELAY;
    const card = rail.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : rail.clientWidth * 0.6;
    nudgeRemaining.current = direction * step;
  };

  if (cards.length === 0) return null;

  /* Each pass must be wider than the viewport, so short sets repeat before doubling */
  const base = cards.length < 5 ? [...cards, ...cards] : cards;
  /* Two identical passes keep the loop seamless in both directions */
  const track = [...base, ...base];

  return (
    <section className="bg-forest py-12 lg:py-16">
      <div className="mx-auto max-w-[1480px] px-4 text-center sm:px-6 lg:px-10">
        <h2 className="font-display text-[2rem] font-extrabold text-white sm:text-[2.75rem] lg:text-[3.25rem]">
          {title}
        </h2>
        <p className="mx-auto mt-4 max-w-[640px] text-sm leading-6 text-white/85 sm:text-base sm:leading-7">
          {subtitle}
        </p>
      </div>

      <div
        className="relative mt-8 lg:mt-10"
        onMouseEnter={() => { hovering.current = true; }}
        onMouseLeave={() => { hovering.current = false; }}
      >
        <div
          ref={railRef}
          className="flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {track.map((card, index) => (
            <div
              key={`${card.id}-${index}`}
              className="aspect-[5/7] w-[250px] shrink-0 overflow-hidden rounded-2xl bg-black/20 sm:w-[300px] lg:w-[340px]"
            >
              <img
                src={card.image}
                alt={index < cards.length ? card.alt : ""}
                aria-hidden={index >= cards.length}
                width={900}
                height={1260}
                loading="lazy"
                className="size-full object-cover"
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Show previous"
          className="absolute left-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:flex lg:left-4"
        >
          <ChevronLeft className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Show next"
          className="absolute right-2 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/55 sm:flex lg:right-4"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>
    </section>
  );
}
