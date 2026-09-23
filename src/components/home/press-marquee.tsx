import type { PressLogo, PressSection } from "@/types/api";

/* Placeholder wordmarks, not real publications — they hold the layout until the
   shop uploads the outlets that have actually covered it. */
export const defaultPressLogos: PressLogo[] = [
  { id: "p1", name: "Urban Green Weekly", image: "/press/urban-green-weekly.svg" },
  { id: "p2", name: "The Plant Post", image: "/press/the-plant-post.svg" },
  { id: "p3", name: "Homestyle India", image: "/press/homestyle-india.svg" },
  { id: "p4", name: "Grow Magazine", image: "/press/grow-magazine.svg" },
  { id: "p5", name: "City Living", image: "/press/city-living.svg" },
];

function Logo({ logo, hidden }: { logo: PressLogo; hidden?: boolean }) {
  const image = (
    <img
      src={logo.image}
      alt={hidden ? "" : logo.name}
      loading="lazy"
      className="h-9 w-auto max-w-[190px] object-contain opacity-65 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0 sm:h-11 lg:h-12"
    />
  );
  const wrapper = "flex shrink-0 items-center px-7 sm:px-10 lg:px-12";

  return logo.url && !hidden ? (
    <a href={logo.url} target="_blank" rel="noreferrer" className={wrapper}>{image}</a>
  ) : (
    <span className={wrapper} aria-hidden={hidden || undefined}>{image}</span>
  );
}

export function PressMarquee({
  section,
  logos = defaultPressLogos,
}: {
  section?: PressSection | undefined;
  logos?: PressLogo[];
}) {
  const items = logos.length > 0 ? logos : defaultPressLogos;
  if (section?.active === false) return null;

  /* Short sets repeat before doubling, so the track always outruns the viewport */
  const base = items.length < 6 ? [...items, ...items] : items;

  return (
    <section className="bg-storefront-wash py-12 lg:py-16" aria-labelledby="press-title">
      <h2
        id="press-title"
        className="text-center font-display text-2xl font-semibold italic tracking-tight text-forest sm:text-[2rem] lg:text-[2.25rem]"
      >
        {section?.title?.trim() || "As featured in"}
      </h2>

      <div className="group/marquee relative mt-8 flex overflow-hidden lg:mt-10">
        {/* Soft edges so logos fade in and out rather than being cut */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-storefront-wash to-transparent sm:w-28" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-storefront-wash to-transparent sm:w-28" />

        {[0, 1].map((pass) => (
          <div
            key={pass}
            aria-hidden={pass === 1}
            className="flex shrink-0 animate-press-marquee items-center group-hover/marquee:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]"
          >
            {base.map((logo, index) => (
              <Logo key={`${logo.id ?? logo.name}-${pass}-${index}`} logo={logo} hidden={pass === 1} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
