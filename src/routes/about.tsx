import { createFileRoute } from "@tanstack/react-router";
import { Leaf, ShieldCheck, Truck, type LucideIcon } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About | Plant Nursery" },
      { name: "description", content: "How we select, pack, and support plants for Indian homes." },
      { property: "og:title", content: "About | Plant Nursery" },
      { property: "og:description", content: "Meet the nursery behind your plants." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const pillars: Array<{ icon: LucideIcon; title: string; body: string }> = [
  { icon: Leaf, title: "Selected with care", body: "Plants are grown and hardened at the nursery before they are ever listed for sale." },
  { icon: Truck, title: "Packed for the journey", body: "Root balls are secured and foliage is cushioned so plants arrive upright and intact." },
  { icon: ShieldCheck, title: "Supported after delivery", body: "Care guidance and after-sales support continue long after the plant reaches your home." },
];

function Page() {
  return (
    <div>
      <section className="bg-primary-tint px-6 py-24 text-center">
        <p className="text-xs font-bold tracking-[0.18em] uppercase text-primary">Our nursery</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl sm:text-5xl">Good plants begin with patient care.</h1>
        <p className="mx-auto mt-6 max-w-2xl leading-7 text-muted-foreground">
          We believe buying a plant should feel as thoughtful as growing one — from careful selection to secure packing and practical support.
        </p>
      </section>
      <section className="mx-auto grid max-w-5xl gap-10 px-6 py-20 md:grid-cols-3">
        {pillars.map(({ icon: Icon, title, body }) => (
          <div key={title}>
            <span className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-primary"><Icon className="size-5" /></span>
            <h2 className="mt-5 text-xl">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
