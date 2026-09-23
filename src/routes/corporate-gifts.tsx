import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BadgeIndianRupee, Building2, Check, Phone, Truck, UserRoundCheck } from "lucide-react";
import { gardenServicesApi, giftingApi, queryKeys } from "@/api/services";
import { defaultGifting } from "@/components/home/gifting-band";

export const Route = createFileRoute("/corporate-gifts")({
  head: () => ({
    meta: [
      { title: "Corporate Gifting | MyGarden" },
      { name: "description", content: "Bulk plant gifting for festivals, onboarding kits and office refreshes — GST invoicing and a dedicated account manager." },
      { property: "og:title", content: "Corporate Gifting | MyGarden" },
      { property: "og:description", content: "Bulk plant gifting with GST invoicing and a dedicated account manager." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const perks = [
  { icon: BadgeIndianRupee, title: "Volume pricing", body: "Tiered rates from 25 units up, quoted before you commit." },
  { icon: Building2, title: "Branded packaging", body: "Your logo on the sleeve, note card and pot, printed in-house." },
  { icon: Truck, title: "Split delivery", body: "One order, many addresses — we handle the despatch list for you." },
  { icon: UserRoundCheck, title: "One point of contact", body: "A named account manager from quote through to the last delivery." },
];

const occasions = ["Diwali and festive hampers", "New-joiner onboarding kits", "Office and lobby refreshes", "Client thank-yous", "Work anniversaries", "Event and conference giveaways"];

function Page() {
  const { data: gift } = useQuery({ queryKey: queryKeys.gifting, queryFn: giftingApi.get, staleTime: 300_000 });
  const [form, setForm] = useState({ name: "", phone: "", company: "", quantity: "" });

  const mutation = useMutation({
    mutationFn: () =>
      gardenServicesApi.enquiry({
        name: form.name,
        phone: form.phone,
        location: form.company,
        service: "Corporate gifting",
        note: form.quantity ? `Approx. ${form.quantity} units` : "",
      }),
    onSuccess: () => setForm({ name: "", phone: "", company: "", quantity: "" }),
  });

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;
    mutation.mutate();
  };

  const field = "w-full rounded-xl border border-border bg-background px-4 py-3.5 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10";
  const image = gift?.image?.trim() || defaultGifting.image;

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden" aria-labelledby="corporate-title">
        <img src={image} alt="" aria-hidden="true" className="h-[320px] w-full object-cover object-[72%_center] sm:h-[400px] lg:h-[440px] lg:object-center" />
        <div aria-hidden="true" className="absolute inset-0 bg-forest/50 sm:hidden" />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_right,oklch(0.30_0.06_169/0.82)_0%,oklch(0.30_0.06_169/0.6)_38%,oklch(0.30_0.06_169/0.22)_62%,transparent_82%)]"
        />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1480px] px-6 sm:px-10 lg:px-16">
            <div className="max-w-[36rem]">
              <span className="inline-flex items-center rounded-full bg-star px-4 py-1.5 font-display text-xs font-bold text-forest sm:text-sm">
                Bulk orders from 25 units
              </span>
              <h1 id="corporate-title" className="mt-4 font-display text-[2rem] font-extrabold leading-[1.05] tracking-tight text-white sm:text-[2.75rem] lg:text-[3.5rem]">
                Corporate gifting,<br />handled end to end
              </h1>
              <p className="mt-4 max-w-[32rem] text-sm leading-7 text-white/90 sm:text-base sm:leading-8">
                {gift?.body?.trim() || defaultGifting.body}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {perks.map((perk) => (
            <div key={perk.title}>
              <span className="flex size-12 items-center justify-center rounded-full bg-primary-tint text-primary">
                <perk.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-base font-bold text-forest sm:text-lg">{perk.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{perk.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-storefront-wash py-14 lg:py-20">
        <div className="mx-auto grid max-w-[1480px] items-start gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
          <div>
            <h2 className="font-display text-[1.75rem] font-extrabold tracking-tight text-forest sm:text-[2.25rem]">
              What we gift for
            </h2>
            <ul className="mt-6 space-y-3.5">
              {occasions.map((occasion) => (
                <li key={occasion} className="flex gap-3 text-sm leading-6 text-foreground/85 sm:text-base">
                  <Check className="mt-0.5 size-4 shrink-0 stroke-[3] text-primary" aria-hidden="true" />
                  {occasion}
                </li>
              ))}
            </ul>
            <p className="mt-8 max-w-[34rem] text-sm leading-7 text-muted-foreground sm:text-base">
              Tell us the headcount, the budget per head and the date you need them by. We come back with two or three
              options and a GST quote, usually within a working day.
            </p>
          </div>

          <form onSubmit={submit} className="rounded-[1.5rem] bg-card p-6 shadow-card-hover sm:p-9 lg:p-10">
            <h2 className="font-display text-2xl font-extrabold tracking-tight text-forest sm:text-[2rem]">
              Request a quote
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
              Leave your number and we will call you back.
            </p>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="font-display text-sm font-semibold text-forest">Name</span>
                <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter your name" className={`mt-2 ${field}`} />
              </label>
              <label className="block">
                <span className="font-display text-sm font-semibold text-forest">Contact number</span>
                <input required inputMode="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Enter number" className={`mt-2 ${field}`} />
              </label>
              <label className="block">
                <span className="font-display text-sm font-semibold text-forest">Company</span>
                <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Company name" className={`mt-2 ${field}`} />
              </label>
              <label className="block">
                <span className="font-display text-sm font-semibold text-forest">Approx. quantity</span>
                <input inputMode="numeric" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder="e.g. 150" className={`mt-2 ${field}`} />
              </label>
            </div>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="mt-7 w-full rounded-xl bg-primary py-4 font-display text-base font-bold text-primary-foreground transition hover:bg-forest disabled:opacity-60"
            >
              {mutation.isPending ? "Sending…" : "Get a call back"}
            </button>

            {mutation.isSuccess && <p className="mt-4 text-center text-sm font-semibold text-primary">Thanks — we'll call you back shortly.</p>}
            {mutation.isError && <p className="mt-4 text-center text-sm font-semibold text-destructive">Something went wrong. Please try again.</p>}

            {gift?.brands_line?.trim() && (
              <p className="mt-6 flex items-center justify-center gap-2 text-center text-sm font-semibold text-forest/75">
                <Phone className="size-4 text-primary" aria-hidden="true" />
                {gift.brands_line}
              </p>
            )}
          </form>
        </div>
      </section>
    </div>
  );
}
