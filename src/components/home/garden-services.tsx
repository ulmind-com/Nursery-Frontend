import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { GardenServiceSection } from "@/types/api";

export const defaultGardenSection: GardenServiceSection = {
  title: "Garden services by MyGarden",
  body: "Our end-to-end Garden Services cover everything from botanical styling and landscape architecture to curated planters and more, all tailored to your vision and handled with zero hassle.",
  image: "/care.png",
  cta_label: "View all Garden Service",
  active: true,
};

export function GardenServicesBand({ section = defaultGardenSection }: { section?: GardenServiceSection | undefined }) {
  if (section.active === false) return null;
  const image = section.image || defaultGardenSection.image;

  return (
    <section className="bg-storefront-wash py-10 lg:py-16" aria-labelledby="garden-services-title">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <div className="grid overflow-hidden rounded-[1.75rem] shadow-card-hover lg:grid-cols-2 lg:rounded-[2rem]">
          {/* Copy panel — first in the DOM so it stays on the left on desktop */}
          <div className="order-2 flex flex-col justify-center bg-star px-6 py-10 sm:px-10 sm:py-14 lg:order-1 lg:px-14 lg:py-16 xl:px-20">
            <h2
              id="garden-services-title"
              className="font-display text-[1.875rem] font-extrabold leading-[1.1] tracking-tight text-forest sm:text-[2.5rem] lg:text-[3rem]"
            >
              {section.title || defaultGardenSection.title}
            </h2>
            {(section.body || defaultGardenSection.body) && (
              <p className="mt-5 max-w-[34rem] text-sm leading-7 text-forest/85 sm:text-base sm:leading-8">
                {section.body || defaultGardenSection.body}
              </p>
            )}
            <Link
              to="/garden-services"
              className="group mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-forest px-7 py-3.5 font-display text-sm font-bold text-forest-foreground shadow-[0_16px_34px_-16px_oklch(0.30_0.06_169/0.9)] transition hover:bg-primary sm:mt-10 sm:px-9 sm:py-4 sm:text-base"
            >
              {section.cta_label || defaultGardenSection.cta_label}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>

          <div className="order-1 min-h-[260px] overflow-hidden bg-primary-soft sm:min-h-[340px] lg:order-2 lg:min-h-[520px]">
            <img
              src={image}
              alt={section.title || "Our garden care specialists at work"}
              width={1400}
              height={1120}
              loading="lazy"
              className="size-full object-cover transition-transform duration-[1200ms] ease-out hover:scale-[1.04]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
