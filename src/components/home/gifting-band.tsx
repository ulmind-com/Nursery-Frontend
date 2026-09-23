import { ArrowRight } from "lucide-react";
import type { GiftingSection } from "@/types/api";

export const defaultGifting: GiftingSection = {
  active: true,
  title: "Green gifting,\nmade easy.",
  body: "Festive hampers. Onboarding kits. Office refreshes. GST invoicing. A dedicated account manager.",
  brands_line: "Trusted by 50+ brands across India",
  image: "/cta.png",
  primary_label: "Shop Hampers",
  primary_url: "/combos",
  secondary_label: "Bulk Order",
  secondary_url: "/contact",
};

export function GiftingBand({ section }: { section?: GiftingSection | undefined }) {
  const gift = { ...defaultGifting, ...(section ?? {}) };
  if (gift.active === false) return null;

  return (
    <section className="relative overflow-hidden" aria-labelledby="gifting-title">
      <img
        src={gift.image || defaultGifting.image}
        alt=""
        aria-hidden="true"
        width={1908}
        height={806}
        loading="lazy"
        className="h-[560px] w-full object-cover object-[72%_center] sm:h-[600px] lg:h-auto lg:aspect-[1908/806] lg:object-center"
      />

      {/* On phones the copy spans the whole frame, so it needs a flat wash too */}
      <div aria-hidden="true" className="absolute inset-0 bg-forest/45 sm:hidden" />

      {/* Warm scrim so the copy stays legible over the left half of the photo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.30_0.06_169/0.72)_0%,oklch(0.30_0.06_169/0.52)_34%,oklch(0.30_0.06_169/0.18)_58%,transparent_78%)]"
      />

      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-[1480px] px-6 sm:px-10 lg:px-16">
          <div className="max-w-[34rem]">
            <h2
              id="gifting-title"
              className="whitespace-pre-line font-display text-[2.25rem] font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.35)] sm:text-[3rem] lg:text-[3.75rem]"
            >
              {gift.title}
            </h2>

            {gift.body && (
              <p className="mt-5 max-w-[30rem] text-sm leading-7 text-white/90 sm:mt-6 sm:text-base sm:leading-8">
                {gift.body}
              </p>
            )}

            {gift.brands_line && (
              <p className="mt-5 max-w-[26rem] font-display text-sm font-bold leading-6 text-star sm:mt-6 sm:text-lg sm:leading-7">
                {gift.brands_line}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3 sm:mt-10 sm:gap-4">
              <a
                href={gift.primary_url || "/combos"}
                className="group inline-flex items-center gap-2 rounded-full bg-forest px-7 py-3.5 font-display text-sm font-bold text-forest-foreground shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] transition hover:bg-forest/90 sm:px-9 sm:py-4 sm:text-base"
              >
                {gift.primary_label}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </a>
              <a
                href={gift.secondary_url || "/contact"}
                className="inline-flex items-center rounded-full bg-primary px-7 py-3.5 font-display text-sm font-bold text-primary-foreground shadow-[0_18px_40px_-18px_rgba(0,0,0,0.7)] transition hover:bg-primary/90 sm:px-9 sm:py-4 sm:text-base"
              >
                {gift.secondary_label}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
