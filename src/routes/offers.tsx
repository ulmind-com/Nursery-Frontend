import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BadgePercent,
  Check,
  Copy,
  Leaf,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  Tag,
  Truck,
} from "lucide-react";
import { couponApi, productsApi, queryKeys } from "@/api/services";
import { COUPON_STORAGE_KEY } from "@/components/commerce/coupon-box";
import { ProductCard } from "@/components/product/product-card";
import { PageSkeleton } from "@/components/shared/page-state";
import { Button } from "@/components/ui/button";
import {
  couponBadge,
  couponMinOrder,
  couponSubtitle,
  couponTerms,
  couponTitle,
  inr,
  isAutoApplied,
} from "@/lib/coupons";
import type { Coupon, Pagination, Product } from "@/types/api";
import { toast } from "sonner";

export const Route = createFileRoute("/offers")({
  head: () => ({
    meta: [
      { title: "Offers & Coupons | MyGarden" },
      {
        name: "description",
        content:
          "Live coupons, free shipping deals and the biggest savings on plants, pots and garden care.",
      },
      { property: "og:title", content: "Offers & Coupons | MyGarden" },
      { property: "og:description", content: "Live coupons and the biggest savings on plants." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

const list = (data: Product[] | Pagination<Product> | undefined): Product[] =>
  Array.isArray(data) ? data : (data?.items ?? []);

const discountOf = (product: Product) => {
  const variant = product.sizes?.find((size) => size.stock > 0) ?? product.sizes?.[0];
  const price = variant?.price ?? product.price ?? 0;
  const mrp = variant?.mrp ?? product.mrp ?? 0;
  return mrp > price && mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
};

function Page() {
  const coupons = useQuery({
    queryKey: ["coupons", "active"],
    queryFn: couponApi.active,
    staleTime: 5 * 60 * 1000,
  });
  const products = useQuery({
    queryKey: queryKeys.products({ limit: 60, sort_by: "popularity" }),
    queryFn: () => productsApi.list({ limit: 60, sort_by: "popularity" }),
    staleTime: 5 * 60 * 1000,
  });

  const offers: Coupon[] = coupons.data ?? [];
  const onSale = useMemo(
    () =>
      list(products.data)
        .map((product) => ({ product, discount: discountOf(product) }))
        .filter((entry) => entry.discount > 0)
        .sort((a, b) => b.discount - a.discount),
    [products.data],
  );

  if (coupons.isPending && products.isPending) return <PageSkeleton />;

  const topDiscount = onSale[0]?.discount ?? 0;
  const freeShipFrom = offers.find((offer) => offer.free_shipping);

  return (
    <div className="bg-background pb-4">
      <Hero offers={offers} topDiscount={topDiscount} freeShipFrom={freeShipFrom} />
      <CouponRail offers={offers} />
      <SaleGrid entries={onSale} loading={products.isPending} />
      <ValueStrip />
      <HelpBand />
    </div>
  );
}

/* ---------------------------------------------------------------- hero --- */

function Hero({
  offers,
  topDiscount,
  freeShipFrom,
}: {
  offers: Coupon[];
  topDiscount: number;
  freeShipFrom: Coupon | undefined;
}) {
  const stats = [
    {
      value: offers.length ? `${offers.length}` : "—",
      label: offers.length === 1 ? "Live coupon" : "Live coupons",
    },
    { value: topDiscount ? `${topDiscount}%` : "—", label: "Top saving today" },
    {
      value: freeShipFrom ? inr(couponMinOrder(freeShipFrom)) : "—",
      label: "Free shipping above",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-forest text-forest-foreground">
      <div
        aria-hidden
        className="absolute -right-24 -top-28 size-[26rem] rounded-full bg-primary/30 blur-3xl sm:size-[34rem]"
      />
      <div
        aria-hidden
        className="absolute -bottom-32 -left-24 size-[22rem] rounded-full bg-primary/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-[1480px] px-4 py-16 text-center sm:px-6 lg:px-10 lg:py-24">
        <span className="inline-flex items-center gap-2 rounded-full border border-forest-foreground/25 bg-forest-foreground/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em]">
          <Sparkles className="size-3.5" aria-hidden />
          Offer zone
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-[3.75rem]">
          Special offers &amp; discounts
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-forest-foreground/80 sm:text-base">
          Every live coupon in one place — copy a code, and we keep it ready at checkout on plants,
          pots and garden care.
        </p>

        <dl className="mx-auto mt-10 grid max-w-2xl grid-cols-3 gap-3 sm:gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-forest-foreground/15 bg-forest-foreground/10 px-3 py-4 backdrop-blur-sm sm:px-5"
            >
              <dt className="sr-only">{stat.label}</dt>
              <dd className="font-display text-2xl font-extrabold sm:text-3xl">{stat.value}</dd>
              <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-forest-foreground/70 sm:text-xs">
                {stat.label}
              </p>
            </div>
          ))}
        </dl>
      </div>

      {offers.length > 0 && <CodeMarquee offers={offers} />}
    </section>
  );
}

function CodeMarquee({ offers }: { offers: Coupon[] }) {
  const track = offers.length < 4 ? [...offers, ...offers, ...offers] : [...offers, ...offers];
  const Row = ({ hidden = false }: { hidden?: boolean }) => (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 animate-offers-marquee items-center gap-10 pr-10 motion-reduce:[animation-play-state:paused]"
    >
      {track.map((offer, index) => (
        <span
          key={`${offer.code}-${index}`}
          className="flex items-center gap-2 whitespace-nowrap text-xs font-bold uppercase tracking-[0.14em]"
        >
          <Tag className="size-3.5" aria-hidden />
          {couponBadge(offer)} · {offer.code}
        </span>
      ))}
    </div>
  );
  return (
    <div className="relative flex overflow-hidden border-t border-forest-foreground/15 bg-forest-foreground/10 py-3">
      <Row />
      <Row hidden />
    </div>
  );
}

/* ------------------------------------------------------------- coupons --- */

function CouponRail({ offers }: { offers: Coupon[] }) {
  return (
    <section className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
      <header className="max-w-2xl">
        <h2 className="font-display text-3xl font-extrabold sm:text-4xl">Coupons for you</h2>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          Managed live from our store — tap a code to copy it, and it is applied automatically on
          your next order.
        </p>
      </header>

      {offers.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-primary/40 bg-primary-tint/60 px-6 py-14 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary-soft-foreground">
            <BadgePercent className="size-5" aria-hidden />
          </span>
          <p className="mt-4 font-display text-xl font-bold">No coupons running right now</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            New offers go live here the moment they are published. Meanwhile, the sale prices below
            are still yours to grab.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {offers.map((offer) => (
            <CouponCard key={offer.code} offer={offer} />
          ))}
        </div>
      )}
    </section>
  );
}

function CouponCard({ offer }: { offer: Coupon }) {
  const [copied, setCopied] = useState(false);
  const auto = isAutoApplied(offer);

  const copy = () => {
    try {
      window.localStorage.setItem(COUPON_STORAGE_KEY, offer.code);
    } catch {
      /* storage unavailable — the code still works when typed at checkout */
    }
    void navigator.clipboard?.writeText(offer.code).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2400);
    toast.success(`${offer.code} copied — we'll apply it at checkout.`);
  };

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover">
      {/* ticket notches */}
      <span aria-hidden className="absolute -left-3 top-[54%] size-6 rounded-full bg-background" />
      <span aria-hidden className="absolute -right-3 top-[54%] size-6 rounded-full bg-background" />

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-forest px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide text-forest-foreground">
            <BadgePercent className="size-3.5" aria-hidden />
            {couponBadge(offer)}
          </span>
          {offer.first_order_only && (
            <span className="rounded-full bg-sale/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-sale">
              First order
            </span>
          )}
        </div>

        <h3 className="mt-4 font-display text-xl font-bold">{couponTitle(offer)}</h3>
        <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{couponSubtitle(offer)}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {couponTerms(offer).map((term) => (
            <li
              key={term}
              className="rounded-full bg-primary-tint px-2.5 py-1 text-[11px] font-medium text-primary-soft-foreground"
            >
              {term}
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-dashed border-border px-6 pb-6 pt-5">
        {auto ? (
          <p className="flex items-center justify-center gap-2 rounded-xl bg-primary-tint py-3 text-sm font-semibold text-forest">
            <Check className="size-4" aria-hidden />
            Applied automatically at checkout
          </p>
        ) : (
          <div className="flex items-center gap-2 rounded-xl border border-dashed border-primary/50 bg-primary-tint/70 p-2 pl-4">
            <span className="flex-1 truncate font-mono text-base font-bold tracking-[0.12em] text-forest">
              {offer.code}
            </span>
            <Button
              type="button"
              onClick={copy}
              size="sm"
              className="h-9 shrink-0 gap-1.5 rounded-lg bg-forest text-xs font-semibold text-forest-foreground hover:bg-forest/90"
            >
              {copied ? (
                <Check className="size-3.5" aria-hidden />
              ) : (
                <Copy className="size-3.5" aria-hidden />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
        )}
        <Button
          asChild
          variant="outline"
          className="mt-3 h-11 w-full rounded-xl border-forest/25 text-sm font-semibold text-forest hover:bg-primary-tint"
        >
          <Link to="/plants">
            Shop now
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </article>
  );
}

/* ---------------------------------------------------------------- sale --- */

function SaleGrid({
  entries,
  loading,
}: {
  entries: Array<{ product: Product; discount: number }>;
  loading: boolean;
}) {
  if (loading)
    return (
      <section className="bg-storefront-wash py-14 lg:py-20">
        <div className="mx-auto max-w-[1480px] animate-pulse px-4 sm:px-6 lg:px-10">
          <div className="h-9 w-72 rounded bg-muted" />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="aspect-[3/4] rounded-xl bg-muted" />
            ))}
          </div>
        </div>
      </section>
    );

  if (entries.length === 0) return null;

  return (
    <section className="bg-storefront-wash py-14 lg:py-20">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sale/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-sale">
              <Leaf className="size-3.5" aria-hidden />
              On sale now
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
              Grow more, save more
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Bestsellers at their lowest — stack these with a coupon above for the deepest saving.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-full border-forest/25 px-6 text-sm font-semibold text-forest hover:bg-primary-tint"
          >
            <Link to="/plants">
              View all plants
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </header>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {entries.slice(0, 12).map(({ product }) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- trust --- */

const VALUES = [
  {
    icon: Truck,
    title: "Fast, tracked delivery",
    copy: "Dispatched within 24 hours in nursery-safe packaging.",
  },
  {
    icon: PackageCheck,
    title: "Secure & recyclable packing",
    copy: "Plants travel upright, cushioned and plastic-light.",
  },
  {
    icon: ShieldCheck,
    title: "Free replacement if damaged",
    copy: "Covered by our 30-day plant guarantee — no questions.",
  },
  {
    icon: BadgePercent,
    title: "Best price, always",
    copy: "Coupons stack on top of sale prices at checkout.",
  },
];

function ValueStrip() {
  return (
    <section className="mx-auto max-w-[1480px] px-4 py-14 sm:px-6 lg:px-10 lg:py-20">
      <h2 className="text-center font-display text-3xl font-extrabold sm:text-4xl">
        Why shop with us
      </h2>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map(({ icon: Icon, title, copy }) => (
          <div
            key={title}
            className="rounded-2xl border border-border bg-card p-6 transition-shadow duration-300 hover:shadow-card-hover"
          >
            <span className="flex size-11 items-center justify-center rounded-xl bg-primary-tint text-forest">
              <Icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-4 text-sm font-bold">{title}</h3>
            <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function HelpBand() {
  return (
    <section className="mx-auto max-w-[1480px] px-4 pb-16 sm:px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-3xl bg-forest px-6 py-14 text-center text-forest-foreground sm:px-10 lg:py-20">
        <div
          aria-hidden
          className="absolute -right-20 -top-20 size-72 rounded-full bg-primary/25 blur-3xl"
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-4xl lg:text-[2.75rem]">
            Not sure which plant to pick?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-forest-foreground/80">
            Our plant experts help you choose, and tell you exactly how to keep it thriving.
          </p>
          <Button
            asChild
            className="mt-8 h-12 rounded-full bg-background px-8 text-sm font-bold text-forest hover:bg-background/90"
          >
            <Link to="/support">
              <MessageCircle className="size-4" aria-hidden />
              Chat with us
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
