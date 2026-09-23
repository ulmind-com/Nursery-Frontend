import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Gift, Leaf, PackageCheck, Sparkles } from "lucide-react";
import { giftingApi, miscApi, queryKeys } from "@/api/services";
import { defaultGifting } from "@/components/home/gifting-band";

export const Route = createFileRoute("/gifting")({
  head: () => ({
    meta: [
      { title: "Plant Gifting | MyGarden" },
      { name: "description", content: "Ready-to-gift plant hampers for festivals, housewarmings and thank-yous — packed to arrive looking their best." },
      { property: "og:title", content: "Plant Gifting | MyGarden" },
      { property: "og:description", content: "Plant hampers, gift-wrapped and delivered." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const reasons = [
  { icon: Gift, title: "Wrapped and ready", body: "Every hamper ships gift-wrapped with a handwritten note card — nothing to assemble at your end." },
  { icon: Leaf, title: "Plants that last", body: "We pick hardy, low-maintenance varieties, so the gift is still alive months after the occasion." },
  { icon: PackageCheck, title: "Packed to survive the trip", body: "Soil is locked in and pots are cradled, so hampers arrive upright and undamaged." },
  { icon: Sparkles, title: "Personalise it", body: "Swap the pot, add seeds or a watering can, and write your own message at checkout." },
];

function Page() {
  const { data: gift } = useQuery({ queryKey: queryKeys.gifting, queryFn: giftingApi.get, staleTime: 300_000 });
  const { data: combos = [] } = useQuery({ queryKey: ["combos"], queryFn: miscApi.combos, staleTime: 300_000 });

  const image = gift?.image?.trim() || defaultGifting.image;

  return (
    <div className="bg-background">
      {/* Hero reuses the home band's artwork and copy */}
      <section className="relative overflow-hidden" aria-labelledby="gifting-page-title">
        <img src={image} alt="" aria-hidden="true" className="h-[340px] w-full object-cover object-[72%_center] sm:h-[420px] lg:h-[480px] lg:object-center" />
        <div aria-hidden="true" className="absolute inset-0 bg-forest/45 sm:hidden" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.30_0.06_169/0.78)_0%,oklch(0.30_0.06_169/0.55)_36%,oklch(0.30_0.06_169/0.2)_60%,transparent_80%)]"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1480px] px-6 sm:px-10 lg:px-16">
            <div className="max-w-[34rem]">
              <h1
                id="gifting-page-title"
                className="whitespace-pre-line font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-[2.75rem] lg:text-[3.5rem]"
              >
                {gift?.title?.trim() || defaultGifting.title}
              </h1>
              <p className="mt-4 max-w-[30rem] text-sm leading-7 text-white/90 sm:mt-5 sm:text-base sm:leading-8">
                {gift?.body?.trim() || defaultGifting.body}
              </p>
              <Link
                to="/corporate-gifts"
                className="group mt-7 inline-flex items-center gap-2 rounded-full bg-star px-7 py-3.5 font-display text-sm font-bold text-forest transition hover:bg-white sm:mt-9 sm:px-9 sm:py-4 sm:text-base"
              >
                Gifting in bulk?
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why gift a plant */}
      <section className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {reasons.map((reason) => (
            <div key={reason.title}>
              <span className="flex size-12 items-center justify-center rounded-full bg-primary-tint text-primary">
                <reason.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-base font-bold text-forest sm:text-lg">{reason.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{reason.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Hampers — the combos catalogue doubles as the gift range */}
      <section className="bg-storefront-wash py-14 lg:py-20" aria-labelledby="hampers-title">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
          <h2 id="hampers-title" className="text-center font-display text-[1.75rem] font-extrabold tracking-tight text-forest sm:text-[2.25rem] lg:text-[2.75rem]">
            Ready-to-gift hampers
          </h2>
          <p className="mx-auto mt-3 max-w-[42rem] text-center text-sm leading-7 text-muted-foreground sm:text-base">
            Curated sets of plants, pots and care essentials — pick one and we will wrap it for you.
          </p>

          {combos.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {combos.map((combo) => (
                <Link key={combo.id} to="/combos" className="surface-card group overflow-hidden">
                  <div className="aspect-[16/10] overflow-hidden bg-primary-soft">
                    {combo.image && (
                      <img src={combo.image} alt={combo.name} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-lg font-bold text-forest">{combo.name}</h3>
                    {combo.description && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{combo.description}</p>}
                    {combo.price != null && (
                      <p className="mt-4 font-display text-lg font-extrabold text-forest">₹{combo.price}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-sm text-muted-foreground">
              Hampers are being restocked. <Link to="/plants" search={{}} className="font-semibold text-primary hover:underline">Browse plants</Link> in the meantime.
            </p>
          )}

          <div className="mt-12 flex justify-center">
            <Link
              to="/combos"
              className="group inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 font-display text-sm font-bold text-forest-foreground transition hover:bg-primary sm:text-base"
            >
              See all hampers
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
