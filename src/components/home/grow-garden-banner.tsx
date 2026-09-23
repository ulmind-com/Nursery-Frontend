import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function GrowGardenBanner({
  image = "/garden.png",
  imageAlt = "Seed packets, pots and seedling trays on a sunlit garden table",
  title = "Grow your\nown Garden",
  subtitle = "Shop our 300+ Seeds",
  ctaLabel = "Shop Now",
  categorySlug = "seeds",
}: {
  image?: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  categorySlug?: string;
}) {
  return (
    <section className="bg-storefront-wash" aria-labelledby="grow-garden-title">
      <Link
        to="/category/$slug"
        params={{ slug: categorySlug }}
        className="group relative block overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <img
          src={image}
          alt={imageAlt}
          width={2170}
          height={725}
          loading="lazy"
          className="h-[280px] w-full object-cover object-[65%_center] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] sm:h-[320px] lg:h-[400px]"
        />

        {/* Scrim keeps the copy legible over the photograph at every width */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_left,oklch(0.30_0.06_169/0.94)_0%,oklch(0.30_0.06_169/0.80)_20%,oklch(0.30_0.06_169/0.48)_42%,oklch(0.30_0.06_169/0.18)_62%,transparent_82%)]"
        />

        <div className="absolute inset-0 flex items-center justify-end px-6 sm:px-10 lg:px-16">
          <div className="max-w-[24rem] text-right sm:max-w-[30rem]">
            <h2
              id="grow-garden-title"
              className="whitespace-pre-line font-display text-[2.25rem] font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.35)] sm:text-[3rem] lg:text-[3.75rem]"
            >
              {title}
            </h2>
            <p className="mt-3 text-sm font-medium text-white/90 sm:mt-4 sm:text-lg">{subtitle}</p>
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-display text-sm font-bold text-forest shadow-[0_14px_36px_-12px_rgba(0,0,0,0.55)] transition group-hover:bg-star group-hover:shadow-[0_18px_44px_-12px_rgba(0,0,0,0.6)] sm:mt-8 sm:px-9 sm:py-3.5 sm:text-base">
              {ctaLabel}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
