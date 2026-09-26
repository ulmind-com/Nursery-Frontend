import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Clock, Headset, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { queryKeys, settingsApi } from "@/api/services";
import { PageSkeleton } from "@/components/shared/page-state";
import { useAuth } from "@/contexts/auth-context";
import { useSupportChat } from "@/contexts/support-chat-context";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Customer Support | MyGarden" },
      { name: "description", content: "Reach the nursery team for order help, plant care advice, and delivery questions." },
      { property: "og:title", content: "Customer Support | MyGarden" },
      { property: "og:description", content: "Reach the nursery team for order and plant care help." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SupportPage,
});

function SupportPage() {
  const { isAuthenticated } = useAuth();
  const chat = useSupportChat();
  const { data: settings, isLoading } = useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get, staleTime: 300_000 });
  if (isLoading) return <PageSkeleton />;
  const support = settings?.support;
  const shop = settings?.shop;
  const rows = [
    shop?.phone ? { icon: Phone, label: "Phone", value: shop.phone, href: `tel:${shop.phone}` } : null,
    shop?.email ? { icon: Mail, label: "Email", value: shop.email, href: `mailto:${shop.email}` } : null,
    support?.whatsapp ? { icon: MessageCircle, label: "WhatsApp", value: support.whatsapp, href: `https://wa.me/${support.whatsapp.replace(/[^\d]/g, "")}` } : null,
    support?.hours ? { icon: Clock, label: "Support hours", value: support.hours, href: null } : null,
    shop?.address ? { icon: MapPin, label: "Nursery", value: shop.address, href: null } : null,
  ].filter((row): row is { icon: typeof Phone; label: string; value: string; href: string | null } => row !== null);

  return (
    <div>
      <section className="bg-primary-tint px-6 py-16 text-center lg:py-24">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{support?.title || "Here to help"}</p>
        <h1 className="mx-auto mt-4 max-w-2xl text-3xl sm:text-4xl">Customer support</h1>
        <p className="mx-auto mt-5 max-w-xl leading-7 text-muted-foreground">
          {support?.note || "Questions about an order, a delivery, or how to care for a new plant? Our nursery team is happy to help."}
        </p>
        {isAuthenticated && (
          <button
            type="button"
            onClick={() => chat.open()}
            className="mx-auto mt-7 flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform duration-200 hover:scale-[1.03]"
          >
            <Headset className="size-4" /> Start live chat
          </button>
        )}
      </section>
      <section className="mx-auto max-w-3xl px-6 py-14">
        {rows.length ? (
          <ul className="divide-y rounded-xl border bg-card">
            {rows.map(({ icon: Icon, label, value, href }) => (
              <li key={label} className="flex items-center gap-4 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"><Icon className="size-4" /></span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
                  {href ? (
                    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer noopener" className="text-sm font-semibold text-primary break-words">{value}</a>
                  ) : (
                    <p className="text-sm font-semibold break-words">{value}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border bg-card p-6 text-sm leading-7 text-muted-foreground">
            Support contact details are being updated. Please use the plant assistant in the corner of the screen and our team will follow up.
          </p>
        )}
        {support?.socials?.some((s) => s.href) ? (
          <div className="mt-8 flex flex-wrap gap-3">
            {support.socials.filter((s) => s.href).map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer noopener" className="rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-200 hover:border-primary hover:text-primary">{s.label}</a>
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
