import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Check, Clock, IndianRupee, Leaf, MessageCircle, Phone, Sparkles } from "lucide-react";
import { gardenServicesApi, queryKeys } from "@/api/services";
import { defaultGardenSection } from "@/components/home/garden-services";
import type { GardenService } from "@/types/api";

export const Route = createFileRoute("/garden-services")({
  head: () => ({
    meta: [
      { title: "Garden Services | Plant Nursery" },
      { name: "description", content: "Botanical styling, landscape architecture, curated planters and plant care — designed around your space and handled end to end." },
      { property: "og:title", content: "Garden Services | Plant Nursery" },
      { property: "og:description", content: "End-to-end garden services, tailored to your vision and handled with zero hassle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

/* Shown until the admin publishes services of their own */
const fallbackServices: GardenService[] = [
  { id: "d1", title: "Botanical styling", summary: "A curated plant palette chosen for your light, your layout and the way you live.", price_from: "4,999", duration: "2–3 days", features: ["On-site light study", "Plant + planter palette", "Styling and placement"] },
  { id: "d2", title: "Landscape architecture", summary: "Balconies, terraces and courtyards designed end to end, drawings through to planting.", price_from: "24,999", duration: "3–6 weeks", features: ["Concept and 3D layout", "Material and planter selection", "Execution and handover"] },
  { id: "d3", title: "Curated planters", summary: "Statement pots planted to order and delivered ready to place — nothing left for you to do.", price_from: "2,499", duration: "5–7 days", features: ["Pot and plant pairing", "Pre-fertilised soil mix", "Delivered planted"] },
  { id: "d4", title: "Plant care & maintenance", summary: "A gardener on a schedule: pruning, repotting, pest control and seasonal feeding.", price_from: "1,499", duration: "Monthly visits", features: ["Pruning and repotting", "Pest and disease control", "Seasonal feeding"] },
];

const steps = [
  { icon: MessageCircle, title: "Tell us your space", body: "Share a few photos, the light you get and what you want the space to feel like." },
  { icon: Leaf, title: "We design it", body: "Our horticulturists put together a plant and planter plan with a clear quote." },
  { icon: Sparkles, title: "We install it", body: "Our team delivers, plants and styles everything on site — you just walk in." },
  { icon: Check, title: "We keep it alive", body: "Optional maintenance visits so your garden looks as good in month six as on day one." },
];

function ServiceCard({ service, index }: { service: GardenService; index: number }) {
  return (
    <article className="surface-card group flex flex-col overflow-hidden">
      {service.image ? (
        <div className="aspect-[16/10] overflow-hidden bg-primary-soft">
          <img src={service.image} alt={service.title} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        </div>
      ) : (
        <div className="flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-primary-tint to-primary-soft">
          <span className="font-display text-5xl font-extrabold text-primary/25">{String(index + 1).padStart(2, "0")}</span>
        </div>
      )}

      <div className="flex flex-1 flex-col p-6 lg:p-7">
        <h3 className="font-display text-lg font-bold text-forest lg:text-xl">{service.title}</h3>
        {service.summary && <p className="mt-2 text-sm leading-6 text-muted-foreground">{service.summary}</p>}

        {service.features && service.features.length > 0 && (
          <ul className="mt-5 space-y-2.5">
            {service.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2.5 text-sm text-forest/85">
                <Check className="mt-0.5 size-4 shrink-0 stroke-[3] text-primary" aria-hidden="true" />
                {feature}
              </li>
            ))}
          </ul>
        )}

        {(service.price_from || service.duration) && (
          <div className="mt-auto flex flex-wrap items-center gap-2 pt-6">
            {service.price_from && (
              <span className="inline-flex items-center gap-1 rounded-full bg-star px-3 py-1.5 text-xs font-bold text-forest">
                <IndianRupee className="size-3.5" aria-hidden="true" />
                From {service.price_from}
              </span>
            )}
            {service.duration && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-tint px-3 py-1.5 text-xs font-semibold text-forest/80">
                <Clock className="size-3.5" aria-hidden="true" />
                {service.duration}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function Page() {
  const { data } = useQuery({ queryKey: queryKeys.gardenServices, queryFn: gardenServicesApi.get, staleTime: 300_000 });

  const section = data?.section ?? defaultGardenSection;
  const services = data?.items && data.items.length > 0 ? data.items : fallbackServices;
  const heroImage = section.page_image || section.image || defaultGardenSection.image;
  const whatsapp = section.whatsapp?.replace(/\D/g, "");

  return (
    <div className="bg-storefront-wash pb-16 lg:pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden bg-forest">
        {heroImage && (
          <img src={heroImage} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover opacity-30" />
        )}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.30_0.06_169/0.95)_0%,oklch(0.30_0.06_169/0.80)_45%,oklch(0.30_0.06_169/0.45)_100%)]"
        />
        <div className="relative mx-auto max-w-[1480px] px-4 py-16 sm:px-6 sm:py-20 lg:px-10 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-star px-4 py-1.5 font-display text-xs font-bold text-forest sm:text-sm">
            <Leaf className="size-3.5" aria-hidden="true" />
            End-to-end, zero hassle
          </span>
          <h1 className="mt-5 max-w-[20ch] font-display text-[2.25rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-[3.25rem] lg:text-[4rem]">
            {section.page_title || "Garden Services"}
          </h1>
          <p className="mt-5 max-w-[46rem] text-sm leading-7 text-white/85 sm:text-lg sm:leading-8">
            {section.page_subtitle || section.body || defaultGardenSection.body}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 sm:mt-10">
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-star px-7 py-3.5 font-display text-sm font-bold text-forest transition hover:bg-white sm:text-base"
            >
              Book a consultation
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            {whatsapp && (
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-7 py-3.5 font-display text-sm font-bold text-white transition hover:bg-white/10 sm:text-base"
              >
                <Phone className="size-4" aria-hidden="true" />
                WhatsApp us
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-[1480px] px-4 pt-14 sm:px-6 lg:px-10 lg:pt-20" aria-labelledby="services-heading">
        <h2 id="services-heading" className="text-center font-display text-[1.75rem] font-extrabold tracking-tight text-forest sm:text-[2.25rem] lg:text-[2.75rem]">
          What we can do for your space
        </h2>
        <p className="mx-auto mt-3 max-w-[42rem] text-center text-sm leading-7 text-muted-foreground sm:text-base">
          Every service is quoted after we see your space, so you only pay for what your garden actually needs.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.id ?? service.title} service={service} index={index} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto mt-16 max-w-[1480px] px-4 sm:px-6 lg:mt-24 lg:px-10" aria-labelledby="process-heading">
        <div className="rounded-[1.75rem] bg-forest px-6 py-12 sm:px-10 lg:rounded-[2rem] lg:px-14 lg:py-16">
          <h2 id="process-heading" className="text-center font-display text-[1.75rem] font-extrabold tracking-tight text-white sm:text-[2.25rem] lg:text-[2.75rem]">
            How it works
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-10">
            {steps.map((step, index) => (
              <div key={step.title} className="relative">
                <div className="flex size-12 items-center justify-center rounded-full bg-star text-forest">
                  <step.icon className="size-5" aria-hidden="true" />
                </div>
                <p className="mt-4 font-display text-xs font-bold uppercase tracking-[0.18em] text-white/50">
                  Step {index + 1}
                </p>
                <h3 className="mt-1.5 font-display text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/75">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="mx-auto mt-14 max-w-[1480px] px-4 sm:px-6 lg:mt-20 lg:px-10">
        <div className="flex flex-col items-center gap-6 rounded-[1.75rem] bg-star px-6 py-12 text-center sm:px-10 lg:rounded-[2rem] lg:py-16">
          <h2 className="max-w-[24ch] font-display text-[1.75rem] font-extrabold leading-tight tracking-tight text-forest sm:text-[2.25rem] lg:text-[2.75rem]">
            Tell us about your space — we'll take it from there
          </h2>
          <p className="max-w-[42rem] text-sm leading-7 text-forest/80 sm:text-base">
            {section.contact_note || "Share a few photos and the light your space gets. Our horticulturists come back with a plan and a clear quote, usually within two working days."}
          </p>
          <Link
            to="/contact"
            className="group inline-flex items-center gap-2 rounded-full bg-forest px-8 py-4 font-display text-sm font-bold text-forest-foreground transition hover:bg-primary sm:text-base"
          >
            Get in touch
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
