import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CalendarClock, Check, ChevronDown, Hand, MapPin, Phone, Shovel, UserRound } from "lucide-react";
import { gardenServicesApi, queryKeys } from "@/api/services";
import { defaultGardenSection } from "@/components/home/garden-services";
import type { GardenBlock, GardenBlocks, GardenService, GardenServiceSection } from "@/types/api";

export const Route = createFileRoute("/garden-services")({
  head: () => ({
    meta: [
      { title: "Garden Services | Plant Nursery" },
      { name: "description", content: "Year round care for your garden and office space — landscaping, vertical gardens, corporate plant rentals and indoor styling." },
      { property: "og:title", content: "Garden Services | Plant Nursery" },
      { property: "og:description", content: "End-to-end garden services, tailored to your space and handled with zero hassle." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

/* ---------- Bundled content, shown until the admin publishes their own ---------- */

const fallbackServices: GardenService[] = [
  { id: "d1", title: "Potted-Exotic Garden Care", summary: "Add a touch of lush sophistication to your spaces with rare and exotic potted plants.", image: "/images/sample-areca-palm.jpg", features: ["Annual Maintenance Packages (Corporate & Hospitality).", "Flexible Subscription-Based Plant Care Plans."] },
  { id: "d2", title: "Vertical Gardens", summary: "Turn plain walls into stunning green features.", image: "/places/balcony.jpg", features: ["Installation of Bio-Wall & Felt-Wall Systems", "Annual Maintenance Packages (Corporate & Hospitality).", "Subscription-Based Care Plans."] },
  { id: "d3", title: "Corporate Plant Rentals", summary: "Elevate your workspace with thoughtfully curated, low-maintenance greenery that inspires productivity and style.", image: "/places/office.jpg", features: ["Premium Pots, Planters & Plants.", "Customized & Portable Vertical Garden Systems."] },
  { id: "d4", title: "Indoor Plant Styling", summary: "Styling that brings nature indoors, effortlessly.", image: "/places/living-room.jpg", features: ["Personalized Plant Recommendations.", "Interior Styling for Homes & Offices.", "Curated Pots & Planters for Your Aesthetic."] },
];

const fallbackProcess: GardenBlock[] = [
  { id: "p1", title: "Site Visit & Evaluation", body: "We assess lighting, drainage, water pressure, aesthetics, and more to understand your space." },
  { id: "p2", title: "Design & Planning", body: "Our experts create a customized plan aligned with your interiors or project scope." },
  { id: "p3", title: "Client Approval", body: "You review and approve the plan — we only move forward once you're happy." },
  { id: "p4", title: "Installation & Ongoing Care", body: "We bring your garden to life and keep it thriving with our maintenance packages." },
];

const fallbackSteps: GardenBlock[] = [
  { id: "s1", title: "Pick Your Service" },
  { id: "s2", title: "Get a Call from Our Team" },
  { id: "s3", title: "Schedule a Site Visit" },
  { id: "s4", title: "We Deliver & Maintain with Expertise" },
];

const stepIcons = [Hand, UserRound, CalendarClock, Shovel];

const fallbackProjects: GardenBlock[] = [
  { id: "pr1", image: "/places/living-room.jpg", title: "Café greening" },
  { id: "pr2", image: "/farm/farm-1.jpg", title: "Shelf garden" },
  { id: "pr3", image: "/places/bedroom.jpg", title: "Bedroom corner" },
  { id: "pr4", image: "/places/balcony.jpg", title: "Balcony garden" },
  { id: "pr5", image: "/images/botanical-hero.jpg", title: "Terrace lounge" },
  { id: "pr6", image: "/farm/farm-2.jpg", title: "Landscaped edge" },
  { id: "pr7", image: "/images/home-hero-no-people.jpg", title: "Indoor jungle" },
  { id: "pr8", image: "/places/office.jpg", title: "Office green wall" },
  { id: "pr9", image: "/farm/farm-3.jpg", title: "Lobby styling" },
];

const fallbackTestimonials: GardenBlock[] = [
  { id: "t1", body: "We are very happy with your services. The plants are keeping our office fresh and vibrant, and the newly added plants are also very healthy and lively. Your staff visits regularly as per schedule, maintaining everything in a proper manner. Thank you so much to the entire team for your dedicated efforts.", author: "Bhagyeshri. Office Manager, GetVantage Tech Pvt. Ltd." },
  { id: "t2", body: "We've been associated with the team for the past three years and are extremely pleased with their exceptional plant management services. The staff is professional, proactive, and always open to feedback. Their commitment to sustainability perfectly aligns with our environmental goals.", author: "Sanket Yenpure. Facility Manager" },
  { id: "t3", body: "We are happy to have your greens in our premises. It surely brings a lot of freshness to our space. Appreciate your services and prompt action to our requests from time to time.", author: "Anita. Cravatex Ltd, Mumbai" },
];

const fallbackFaqs: GardenBlock[] = [
  { id: "f1", title: "What kind of garden services do you provide?", body: "Landscaping and garden development, garden maintenance, vertical gardens and green walls, corporate plant rentals and indoor plant styling — for homes, offices, hospitality and public projects." },
  { id: "f2", title: "Do you provide garden maintenance services for homes and apartments?", body: "Yes. We maintain balcony gardens, terrace gardens, bungalow lawns and society gardens on monthly and annual plans." },
  { id: "f3", title: "Which cities do you currently serve?", body: "We currently serve Kolkata and Mumbai, and we have executed large-scale projects in several other cities. Tell us where you are and we will let you know what we can do." },
  { id: "f4", title: "Do you offer corporate plant rentals and office greenery solutions?", body: "Yes. Indoor plant rentals for offices, events and hospitality spaces, with routine maintenance and bi-weekly health checks by our team." },
  { id: "f5", title: "How often will you maintain my garden?", body: "Most plans are fortnightly or monthly. Larger corporate sites are usually weekly. We agree the schedule with you before the first visit." },
  { id: "f6", title: "Can you design a vertical garden for my apartment or office?", body: "Yes — bio-wall and felt-wall systems, plus portable modular frames when the wall cannot be drilled." },
  { id: "f7", title: "Are your garden services eco-friendly?", body: "We use compost-based nutrition, local materials and efficient irrigation, and keep artificial inputs to a minimum." },
  { id: "f8", title: "How do I book a consultation?", body: "Fill in the call-back form on this page or call us during working hours. We will arrange a site visit at a time that suits you." },
];

const fallbackWhyPoints = [
  "100% Premium Quality & Service Standards.",
  "End-to-End Green Solutions Under One Roof.",
  "Timely Execution, Every Time.",
  "Guaranteed Maintenance & Plant Health.",
];

const fallbackAbout = `Our mission is simple — to make green living accessible and sustainable. Whether it's a balcony garden in a Kolkata apartment, a corporate office in Mumbai, or a large landscape project, we bring the same dedication and expertise.

- We are not just gardeners; we are growers with our own farms.
- Every plant is nurtured, tested, and cared for before it reaches your space.
- From soil health to pruning schedules, we handle the details so you don't have to.
- Our services are trusted across residential, corporate, hospitality, and public projects.

When you choose us, you're choosing a partner who ensures your garden looks fresh, vibrant, and alive — season after season.`;

const fallbackSeo = `**From balcony gardens to corporate landscapes — we design, maintain, and care for green spaces that thrive all year round.**

## Our Gardening & Maintenance Services

We provide end-to-end solutions to keep your gardens, lawns, and green walls healthy and beautiful.

### Landscaping & Garden Development
- Custom landscape design and development for residences, offices, and large campuses.
- Bungalow and lawn maintenance with regular pruning, soil enrichment, and seasonal care.
- Expertise in terrace gardens and balcony gardens that maximise small spaces.

### Garden Maintenance Services
- Lawn care, pruning and upkeep to maintain a neat and vibrant look.
- Soil treatment — composting, pH balancing, and amendment for better growth.
- Fertigation and pest control using eco-friendly methods.
- Irrigation system checks and water schedules to prevent waste.

### Vertical Gardens & Green Walls
- Innovative vertical gardening solutions for homes, corporates, and public spaces.
- Modular green wall systems designed for easy installation and low maintenance.

### Corporate Plant Rentals
- Indoor plant rental services for offices, events, and hospitality spaces.
- Wide variety of plants with planters to match your interiors.
- Routine maintenance and bi-weekly health checks by our expert team.`;

const fallbackLocations = ["Kolkata", "Mumbai", "Other city"];

/* ---------- Tiny rich-text renderer for the admin's long-form copy ---------- */

function bold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i} className="font-bold text-forest">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

function RichText({ body }: { body: string }) {
  const lines = body.split("\n");
  const out: React.ReactNode[] = [];
  let bullets: string[] = [];

  const flush = () => {
    if (bullets.length === 0) return;
    out.push(
      <ul key={`ul-${out.length}`} className="my-4 space-y-2 pl-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2.5 text-sm leading-7 text-foreground/80 sm:text-base">
            <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
            <span>{bold(b)}</span>
          </li>
        ))}
      </ul>
    );
    bullets = [];
  };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flush(); continue; }
    if (line.startsWith("- ")) { bullets.push(line.slice(2)); continue; }
    flush();
    if (line.startsWith("### ")) {
      out.push(<h4 key={out.length} className="mt-8 font-display text-lg font-bold text-forest sm:text-xl">{line.slice(4)}</h4>);
    } else if (line.startsWith("## ")) {
      out.push(<h3 key={out.length} className="mt-10 font-display text-xl font-extrabold text-forest sm:text-2xl">{line.slice(3)}</h3>);
    } else {
      out.push(<p key={out.length} className="mt-4 text-sm leading-7 text-foreground/80 sm:text-base sm:leading-8">{bold(line)}</p>);
    }
  }
  flush();
  return <>{out}</>;
}

/* ---------- Lead form ---------- */

function EnquiryForm({ section, services }: { section: GardenServiceSection; services: GardenService[] }) {
  const [form, setForm] = useState({ name: "", phone: "", location: "", service: "" });
  const locations = section.locations?.length ? section.locations : fallbackLocations;

  const mutation = useMutation({
    mutationFn: gardenServicesApi.enquiry,
    onSuccess: () => setForm({ name: "", phone: "", location: "", service: "" }),
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    mutation.mutate(form);
  };

  const field = "w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10";

  return (
    <form onSubmit={submit} id="enquiry" className="rounded-[1.5rem] bg-card p-6 shadow-card-hover sm:p-9 lg:rounded-[1.75rem] lg:p-10">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-forest sm:text-[2rem]">
        {section.form_title || "Get in touch with us."}
      </h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
        {section.form_note || "Choose from our range of garden services for a perfectly manicured garden experience."}
      </p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="font-display text-sm font-semibold text-forest">Name</span>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter Your Name" className={`mt-2 ${field}`} />
        </label>
        <label className="block">
          <span className="font-display text-sm font-semibold text-forest">Contact Number</span>
          <div className="relative mt-2">
            <Phone className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary" aria-hidden="true" />
            <input required inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Enter Number" className={`${field} pl-11`} />
          </div>
        </label>
        <label className="block">
          <span className="font-display text-sm font-semibold text-forest">Location</span>
          <div className="relative mt-2">
            <MapPin className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-primary" aria-hidden="true" />
            <select value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={`${field} appearance-none pl-11 pr-10`}>
              <option value="">Select Location</option>
              {locations.map((city) => <option key={city} value={city}>{city}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          </div>
        </label>
        <label className="block">
          <span className="font-display text-sm font-semibold text-forest">Service Type</span>
          <div className="relative mt-2">
            <select value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className={`${field} appearance-none pr-10`}>
              <option value="">Select Service</option>
              {services.map((s) => <option key={s.id ?? s.title} value={s.title}>{s.title}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          </div>
        </label>
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="mt-7 w-full rounded-xl bg-primary py-4 font-display text-base font-bold text-primary-foreground transition hover:bg-forest disabled:opacity-60"
      >
        {mutation.isPending ? "Sending…" : section.form_cta_label || "Get a Call Back"}
      </button>

      {mutation.isSuccess && <p className="mt-4 text-center text-sm font-semibold text-primary">Thanks — we'll call you back shortly.</p>}
      {mutation.isError && <p className="mt-4 text-center text-sm font-semibold text-destructive">Something went wrong. Please try again.</p>}

      {(section.phone || section.hours) && (
        <p className="mt-6 flex flex-wrap items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <Phone className="size-4 text-primary" aria-hidden="true" />
          {section.phone && <>Reach us at <a href={`tel:${section.phone.replace(/\s/g, "")}`} className="font-semibold text-forest hover:underline">{section.phone}</a></>}
          {section.phone && section.hours && <span aria-hidden="true">·</span>}
          {section.hours && <span>{section.hours}</span>}
        </p>
      )}
    </form>
  );
}

/* ---------- Page ---------- */

function Page() {
  const { data } = useQuery({ queryKey: queryKeys.gardenServices, queryFn: gardenServicesApi.get, staleTime: 300_000 });
  const [openFaq, setOpenFaq] = useState<string | null>(null);

  const section = { ...defaultGardenSection, ...(data?.section ?? {}) } as GardenServiceSection;
  const blocks: GardenBlocks = data?.blocks ?? {};
  const pick = (kind: string, fallback: GardenBlock[]) => (blocks[kind]?.length ? blocks[kind] : fallback);

  const services = data?.items?.length ? data.items : fallbackServices;
  const process = pick("process", fallbackProcess);
  const steps = pick("step", fallbackSteps);
  const projects = pick("project", fallbackProjects);
  const testimonials = pick("testimonial", fallbackTestimonials);
  const faqs = pick("faq", fallbackFaqs);
  const clients = blocks["client"] ?? [];
  const whyPoints = section.why_points?.length ? section.why_points : fallbackWhyPoints;
  const heroImage = section.hero_image || "/garden-service.png";

  return (
    <div className="bg-background">
      {/* Hero — the artwork already carries the headline and button, so the
          painted panel only renders when the admin swaps in a plain photo. */}
      <section className="relative overflow-hidden" aria-labelledby="gs-hero-title">
        <a href="#enquiry" className="block" aria-label={section.hero_cta_label || "Book service"}>
          <img
            src={heroImage}
            alt={`${section.hero_title || "Year round care"} — ${section.hero_subtitle ?? "for your garden & office space"}`}
            width={2161}
            height={728}
            className="h-[300px] w-full object-cover object-[28%_center] sm:h-[380px] sm:object-[20%_center] lg:h-auto lg:aspect-[2161/728] lg:object-center"
          />
        </a>
        <h1 id="gs-hero-title" className="sr-only">
          {section.hero_title || "Year round care"} {section.hero_subtitle ?? "for your garden & office space"}
        </h1>

        {section.hero_overlay && (
          <>
            <div aria-hidden="true" className="absolute inset-0 bg-forest/15" />
            <svg aria-hidden="true" viewBox="0 0 240 800" preserveAspectRatio="none" className="pointer-events-none absolute -left-10 top-0 h-full w-[20%] text-star sm:-left-8 sm:w-[13%]">
              <path d="M168 -60C36 170 26 430 132 880" fill="none" stroke="currentColor" strokeWidth="26" strokeLinecap="round" />
            </svg>
            <svg aria-hidden="true" viewBox="0 0 240 800" preserveAspectRatio="none" className="pointer-events-none absolute -right-10 top-0 h-full w-[20%] -scale-x-100 text-star sm:-right-8 sm:w-[13%]">
              <path d="M168 -60C36 170 26 430 132 880" fill="none" stroke="currentColor" strokeWidth="26" strokeLinecap="round" />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
              <div className="relative w-full max-w-[min(92vw,56rem)] px-6 py-7 sm:px-14 sm:py-10 lg:px-20 lg:py-12">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 1000 260"
                  preserveAspectRatio="none"
                  className="absolute inset-0 size-full text-primary drop-shadow-[0_18px_40px_rgba(0,0,0,0.35)]"
                >
                  <path d="M11 62C4 27 33 11 80 7c186-12 646-9 858 3 45 3 66 25 59 62-8 41 4 106-4 145-7 33-30 42-73 44-217 10-612 8-824 0-47-2-70-16-73-51-3-37 4-111-12-148Z" fill="currentColor" />
                </svg>
                <div className="relative">
                  <p className="font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-[3.25rem] lg:text-[4.25rem]">
                    {section.hero_title || "Year round care"}
                  </p>
                  <p className="mt-1 font-display text-lg font-semibold text-white/95 sm:text-2xl lg:text-[2.25rem]">
                    {section.hero_subtitle ?? "for your garden & office space"}
                  </p>
                </div>
              </div>

              <a
                href="#enquiry"
                className="mt-6 rounded-[1.1rem] bg-card px-8 py-3.5 font-display text-base font-bold text-forest shadow-[0_18px_40px_-18px_rgba(0,0,0,0.65)] transition hover:bg-star sm:mt-8 sm:px-10 sm:py-4 sm:text-xl"
              >
                {section.hero_cta_label || "Book service"}
              </a>
            </div>
          </>
        )}
      </section>

      {/* Services */}
      <section className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="gs-services-title">
        <h2 id="gs-services-title" className="text-center font-display text-[1.75rem] font-extrabold tracking-tight text-forest sm:text-[2.25rem] lg:text-[2.75rem]">
          {section.services_title || "What are you looking for ?"}
        </h2>
        <p className="mt-4 text-center text-sm text-muted-foreground sm:text-base">
          {section.services_note || "(Currently providing services in Kolkata and Mumbai)"}
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <article key={service.id ?? service.title} className="group flex flex-col overflow-hidden rounded-[1.25rem] border border-border/70 bg-card p-4 shadow-card transition-shadow hover:shadow-card-hover">
              <div className="overflow-hidden rounded-xl bg-primary-soft">
                {service.image ? (
                  <img src={service.image} alt={service.title} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                ) : (
                  <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-primary-tint to-primary-soft">
                    <span className="font-display text-5xl font-extrabold text-primary/25">{String(index + 1).padStart(2, "0")}</span>
                  </div>
                )}
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-forest">{service.title}</h3>
              {service.summary && <p className="mt-2 text-sm font-semibold leading-6 text-foreground/85">{service.summary}</p>}
              {service.features && service.features.length > 0 && (
                <ul className="mt-4 space-y-2.5">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5 text-sm leading-6 text-muted-foreground">
                      <Check className="mt-0.5 size-4 shrink-0 stroke-[3] text-primary" aria-hidden="true" />
                      {feature}
                    </li>
                  ))}
                </ul>
              )}
              {(service.price_from || service.duration) && (
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  {service.price_from && <span className="rounded-full bg-star px-3 py-1.5 text-xs font-bold text-forest">From ₹{service.price_from}</span>}
                  {service.duration && <span className="rounded-full bg-primary-tint px-3 py-1.5 text-xs font-semibold text-forest/80">{service.duration}</span>}
                </div>
              )}
            </article>
          ))}
        </div>
      </section>

      {/* Why us + lead form */}
      <section className="bg-storefront-wash py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1480px] items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div>
            <div className="relative pb-16 sm:pb-24">
              <div className="w-[78%] overflow-hidden rounded-xl shadow-card">
                <img src={section.split_image_1 || "/garden.png"} alt="" aria-hidden="true" loading="lazy" className="aspect-[16/9] w-full object-cover" />
              </div>
              <div className="absolute bottom-0 right-0 w-[72%] overflow-hidden rounded-xl border-4 border-storefront-wash shadow-card-hover">
                <img src={section.split_image_2 || "/care.png"} alt="" aria-hidden="true" loading="lazy" className="aspect-[16/10] w-full object-cover" />
              </div>
            </div>

            <h2 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-forest sm:text-[2rem]">
              {section.why_title || "Why Choose MyGarden?"}
            </h2>
            <ul className="mt-5 space-y-3.5">
              {whyPoints.map((point) => (
                <li key={point} className="flex gap-3 text-sm leading-6 text-foreground/85 sm:text-base">
                  <Check className="mt-0.5 size-4 shrink-0 stroke-[3] text-primary" aria-hidden="true" />
                  {point}
                </li>
              ))}
            </ul>
          </div>

          <EnquiryForm section={section} services={services} />
        </div>
      </section>

      {/* Our Process */}
      {process.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="gs-process-title">
          <h2 id="gs-process-title" className="text-center font-display text-[1.75rem] font-extrabold tracking-tight text-forest sm:text-[2.25rem] lg:text-[2.75rem]">
            {section.process_title || "Our Process"}
          </h2>
          <p className="mt-3 text-center text-sm text-muted-foreground sm:text-base">
            {section.process_note || "Greenifying your space, made easy."}
          </p>
          <div className="mt-12 grid gap-x-8 gap-y-12 lg:grid-cols-2">
            {process.map((step, index) => (
              <div key={step.id ?? step.title} className="relative rounded-[1.25rem] border-t-2 border-primary bg-card px-7 py-7 pl-12 shadow-card sm:pl-14">
                <span className="absolute -left-1 -top-6 flex size-12 items-center justify-center rounded-full bg-primary font-display text-lg font-extrabold text-primary-foreground shadow-card-hover sm:size-14 sm:text-xl">
                  {index + 1}
                </span>
                <h3 className="font-display text-lg font-bold text-forest sm:text-xl">{step.title}</h3>
                {step.body && <p className="mt-2.5 text-sm leading-7 text-muted-foreground sm:text-base">{step.body}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Clients */}
      {clients.length > 0 && (
        <section className="overflow-hidden py-12 lg:py-16" aria-labelledby="gs-clients-title">
          <div className="mx-auto max-w-[1480px] px-4 text-center sm:px-6 lg:px-10">
            <h2 id="gs-clients-title" className="font-display text-[1.75rem] font-extrabold tracking-tight text-forest sm:text-[2.25rem] lg:text-[2.5rem]">
              {section.clients_title || "Our Esteemed Clients"}
            </h2>
            {section.clients_note && <p className="mx-auto mt-3 max-w-[70ch] text-sm text-muted-foreground sm:text-base">{section.clients_note}</p>}
          </div>
          <div className="mt-10 flex gap-12 overflow-x-auto px-4 sm:px-6 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {clients.map((client) => (
              <img
                key={client.id ?? client.title}
                src={client.image}
                alt={client.title || "Client logo"}
                loading="lazy"
                className="h-12 w-auto shrink-0 object-contain opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0 sm:h-14"
              />
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <section className="bg-storefront-wash py-14 lg:py-20" aria-labelledby="gs-projects-title">
          <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
            <h2 id="gs-projects-title" className="text-center font-display text-[1.75rem] font-extrabold tracking-tight text-forest sm:text-[2.25rem] lg:text-[2.75rem]">
              {section.projects_title || "Our Projects"}
            </h2>
            <div className="mt-10 grid auto-rows-[180px] grid-cols-2 gap-4 sm:auto-rows-[220px] lg:auto-rows-[260px] lg:grid-cols-3">
              {projects.map((project, index) => (
                <figure
                  key={project.id ?? index}
                  className={`group overflow-hidden rounded-xl bg-primary-soft ${index % 5 === 0 ? "col-span-2 lg:col-span-2" : ""}`}
                >
                  <img src={project.image} alt={project.title || "Completed project"} loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      {steps.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="gs-steps-title">
          <h2 id="gs-steps-title" className="text-center font-display text-[1.75rem] font-extrabold tracking-tight text-forest sm:text-[2.25rem] lg:text-[2.75rem]">
            {section.steps_title || "How it works?"}
          </h2>
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => {
              const Icon = stepIcons[index % stepIcons.length]!;
              return (
                <div key={step.id ?? step.title} className="flex flex-col items-center text-center">
                  <span className="flex size-16 items-center justify-center rounded-full bg-primary-tint text-primary sm:size-[4.5rem]">
                    {step.image ? <img src={step.image} alt="" aria-hidden="true" className="size-8 object-contain" /> : <Icon className="size-7" aria-hidden="true" />}
                  </span>
                  <h3 className="mt-5 max-w-[22ch] font-display text-base font-semibold text-forest sm:text-lg">{step.title}</h3>
                  {step.body && <p className="mt-2 max-w-[28ch] text-sm leading-6 text-muted-foreground">{step.body}</p>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-4 pb-14 sm:px-6 lg:px-10 lg:pb-20" aria-labelledby="gs-testimonials-title">
          <h2 id="gs-testimonials-title" className="font-display text-[1.75rem] font-extrabold tracking-tight text-forest sm:text-[2.25rem] lg:text-[2.5rem]">
            {section.testimonials_title || "What our customers say"}
          </h2>
          <div className="mt-8 grid items-start gap-6 lg:grid-cols-3">
            {testimonials.map((item, index) => (
              <blockquote key={item.id ?? index} className="rounded-[1.25rem] border border-border/70 bg-card p-6 shadow-card sm:p-7">
                <span aria-hidden="true" className="font-display text-4xl leading-none text-primary">&ldquo;</span>
                <p className="mt-3 text-sm leading-7 text-foreground/80">{item.body}</p>
                {item.author && <footer className="mt-5 font-display text-sm font-bold text-forest">{item.author}</footer>}
              </blockquote>
            ))}
          </div>
        </section>
      )}

      {/* About */}
      <section className="bg-storefront-wash py-14 lg:py-20" aria-labelledby="gs-about-title">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
          <h2 id="gs-about-title" className="font-display text-[1.75rem] font-extrabold tracking-tight text-forest sm:text-[2.25rem] lg:text-[2.5rem]">
            {section.about_title || "More About Our Garden Services"}
          </h2>
          <div className="mt-2 max-w-[90ch]">
            <RichText body={section.about_body || fallbackAbout} />
          </div>
        </div>
      </section>

      {/* FAQs */}
      {faqs.length > 0 && (
        <section className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20" aria-labelledby="gs-faq-title">
          <h2 id="gs-faq-title" className="text-center font-display text-[1.75rem] font-extrabold tracking-tight text-forest sm:text-[2.25rem] lg:text-[2.75rem]">
            {section.faq_title || "FAQs"}
          </h2>
          <div className="mx-auto mt-10 max-w-[70rem] divide-y divide-border/70">
            {faqs.map((faq, index) => {
              const key = faq.id ?? String(index);
              const open = openFaq === key;
              return (
                <div key={key}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(open ? null : key)}
                    aria-expanded={open}
                    className="flex w-full items-center gap-4 py-5 text-left"
                  >
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-full border transition ${open ? "border-primary bg-primary text-primary-foreground" : "border-border text-forest"}`}>
                      <span className="text-lg leading-none">{open ? "–" : "+"}</span>
                    </span>
                    <span className="font-display text-xs font-semibold uppercase tracking-[0.12em] text-forest sm:text-sm">
                      {index + 1}. {faq.title}
                    </span>
                  </button>
                  {open && faq.body && (
                    <p className="pb-6 pl-13 text-sm leading-7 text-muted-foreground sm:text-base">{faq.body}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Long-form SEO copy */}
      {(section.seo_body || fallbackSeo) && (
        <section className="bg-storefront-wash py-14 lg:py-20">
          <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
            <div className="max-w-[90ch]">
              <RichText body={section.seo_body || fallbackSeo} />
              {section.contact_note && (
                <p className="mt-8 rounded-2xl bg-card p-6 text-sm leading-7 text-foreground/80 shadow-card sm:text-base">{section.contact_note}</p>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
