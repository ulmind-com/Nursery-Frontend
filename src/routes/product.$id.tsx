import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { BellRing, Check, Droplets, Heart, Leaf, PawPrint, Ruler, ShieldCheck, ShoppingBag, Sparkles, Star, Sun, Wind } from "lucide-react";
import { toast } from "sonner";
import { productsApi, queryKeys, recommendationApi, settingsApi, miscApi } from "@/api/services";
import { PageSkeleton, ErrorState } from "@/components/shared/page-state";
import { Button } from "@/components/ui/button";
import { ProductRail } from "@/components/home/section-rail";
import { money } from "@/components/product/product-card";
import { useCart } from "@/contexts/cart-context";
import { normalizeApiError } from "@/lib/api";
import type { Product } from "@/types/api";

export const Route = createFileRoute("/product/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Product ${params.id} | Plant Nursery` },
      { name: "description", content: "Plant details, care guidance, sizes, and availability." },
      { property: "og:title", content: "Shop this plant | Plant Nursery" },
      { property: "og:description", content: "Plant details, care guidance, sizes, and availability." },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductPage,
});

const toList = (value: string | string[] | undefined): string[] =>
  Array.isArray(value) ? value : value ? value.split(/\r?\n|•/).map((s) => s.trim()).filter(Boolean) : [];

function ProductPage() {
  const { id } = Route.useParams();
  const q = useQuery({ queryKey: queryKeys.product(id), queryFn: () => productsApi.get(id) });
  const similar = useQuery({ queryKey: ["recommendations", "similar", id], queryFn: () => recommendationApi.similar(id) });
  const settings = useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get, staleTime: 300_000 });
  const [selected, setSelected] = useState(0);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem } = useCart();

  if (q.isLoading) return <PageSkeleton />;
  if (q.isError || !q.data) return <ErrorState retry={() => void q.refetch()} />;

  const p: Product = q.data;
  const v = p.sizes?.[selected];
  const price = v?.price ?? p.price ?? 0;
  const mrp = v?.mrp ?? p.mrp;
  const stock = v?.stock ?? p.stock ?? 0;
  const imgs = (v?.images?.length ? v.images : p.images) || [];
  const hero = imgs[Math.min(activeImage, imgs.length - 1)];
  const discount = mrp && mrp > price ? Math.round(((mrp - price) / mrp) * 100) : 0;
  const spec = p.plant_spec;
  const guarantee = settings.data?.plant_guarantee;

  const specRows = [
    spec?.plant_type ? { icon: Leaf, label: "Plant type", value: String(spec.plant_type) } : null,
    spec?.sunlight ? { icon: Sun, label: "Sunlight", value: String(spec.sunlight) } : null,
    spec?.watering || spec?.water_schedule ? { icon: Droplets, label: "Watering", value: String(spec.watering ?? spec.water_schedule) } : null,
    spec?.difficulty || spec?.difficulty_level ? { icon: Sparkles, label: "Care level", value: String(spec.difficulty ?? spec.difficulty_level) } : null,
    v?.height ? { icon: Ruler, label: "Height", value: String(v.height) } : null,
  ].filter((row): row is { icon: typeof Leaf; label: string; value: string } => row !== null);

  const traits = [
    spec?.pet_safe ? { icon: PawPrint, label: "Pet safe" } : null,
    spec?.air_purifying ? { icon: Wind, label: "Air purifying" } : null,
    spec?.flowering ? { icon: Sparkles, label: "Flowering" } : null,
    spec?.medicinal ? { icon: Leaf, label: "Medicinal" } : null,
    spec?.fragrant ? { icon: Sparkles, label: "Fragrant" } : null,
  ].filter((t): t is { icon: typeof Leaf; label: string } => t !== null);

  const includes = toList(p.includes);
  const care = toList(p.care_instructions);
  const tips = toList(p.care_tips);

  const add = () => {
    addItem({
      product_id: p.id,
      title: p.title,
      ...(imgs[0] ? { image: imgs[0] } : {}),
      qty: 1,
      ...(v?.name ? { size_variant: v.name } : {}),
      ...(v?.pot_type ? { pot_type: v.pot_type } : {}),
      unit_price: price,
      ...(mrp ? { mrp } : {}),
      stock,
    });
    toast.success(`${p.title} added to cart`);
  };

  const notifyMe = async () => {
    try {
      await miscApi.waitlist({ product_id: p.id, ...(v?.name ? { size_variant: v.name } : {}) });
      toast.success("We'll let you know when this plant is back.");
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="pb-24 lg:pb-0">
      <div className="mx-auto grid max-w-[1480px] gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-10 lg:py-12">
        <div>
          <div className="aspect-square overflow-hidden rounded-xl bg-primary-tint">
            {hero ? (
              <img src={hero} alt={p.title} className="size-full object-cover" />
            ) : (
              <span className="flex size-full items-center justify-center text-muted-foreground">Image coming soon</span>
            )}
          </div>
          {imgs.length > 1 && (
            <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
              {imgs.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                  className={`size-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors duration-200 ${i === activeImage ? "border-primary" : "border-transparent"}`}
                >
                  <img src={src} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{typeof p.brand === "string" ? p.brand : p.brand?.name}</p>
          <h1 className="mt-2 text-3xl lg:text-4xl">{p.title}</h1>
          {Boolean(p.rating) && (
            <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Star className="size-4 fill-star text-star" />
              <span className="font-semibold text-foreground">{p.rating?.toFixed(1)}</span>
              <span>· {p.review_count || 0} reviews</span>
            </p>
          )}
          <div className="mt-5 flex flex-wrap items-baseline gap-3">
            <span className="price-num text-3xl text-forest">{money(price)}</span>
            {mrp && mrp > price && <span className="price-num text-base font-medium text-muted-foreground line-through">{money(mrp)}</span>}
            {discount > 0 && <span className="rounded-md bg-sale px-2 py-1 text-xs font-bold text-sale-foreground">{discount}% off</span>}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Inclusive of taxes. Delivery calculated at checkout.</p>

          {p.sizes?.length ? (
            <div className="mt-7">
              <p className="mb-3 text-sm font-bold">Choose a size</p>
              <div className="flex flex-wrap gap-2">
                {p.sizes.map((s, i) => (
                  <button
                    key={s.name}
                    type="button"
                    aria-pressed={i === selected}
                    onClick={() => { setSelected(i); setActiveImage(0); }}
                    className={`rounded-lg border px-4 py-2.5 text-xs font-semibold transition-colors duration-200 ${i === selected ? "border-primary bg-primary-soft text-primary-soft-foreground" : "hover:border-primary"} ${s.stock < 1 ? "opacity-50" : ""}`}
                  >
                    {s.name}{s.pot_size ? ` · ${s.pot_size}` : ""}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {traits.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {traits.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-1.5 rounded-full bg-primary-tint px-3 py-1.5 text-xs font-medium text-primary-soft-foreground">
                  <Icon className="size-3.5" />{label}
                </li>
              ))}
            </ul>
          )}

          <p className="mt-6 text-sm leading-7 text-muted-foreground">{p.short_description || p.description}</p>

          <div className="mt-8 hidden grid-cols-[auto_1fr] gap-3 lg:grid">
            <Button variant="outline" size="lg" aria-label="Add to wishlist"><Heart /></Button>
            {stock > 0 ? (
              <Button size="lg" onClick={add}><ShoppingBag />Add to cart</Button>
            ) : (
              <Button size="lg" variant="secondary" onClick={() => void notifyMe()}><BellRing />Notify me when available</Button>
            )}
          </div>

          {guarantee?.enabled && (
            <div className="mt-8 flex items-start gap-3 rounded-xl bg-primary-tint p-4">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-bold text-forest">{guarantee.label || `${guarantee.days ?? 30}-day plant guarantee`}</p>
                {guarantee.description && <p className="mt-1 text-xs leading-5 text-muted-foreground">{guarantee.description}</p>}
              </div>
            </div>
          )}

          {specRows.length > 0 && (
            <div className="mt-10 border-t pt-8">
              <h2 className="text-xl">Plant details</h2>
              <dl className="mt-4 grid grid-cols-2 gap-5">
                {specRows.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary"><Icon className="size-4" /></span>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
                      <dd className="mt-0.5 text-sm font-semibold">{value}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {includes.length > 0 && (
            <div className="mt-10 border-t pt-8">
              <h2 className="text-xl">What's included</h2>
              <ul className="mt-4 space-y-2.5">
                {includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />{item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(care.length > 0 || tips.length > 0) && (
            <div className="mt-10 border-t pt-8">
              <h2 className="text-xl">Care guide</h2>
              <ul className="mt-4 space-y-2.5">
                {[...care, ...tips].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm leading-6 text-muted-foreground">
                    <Leaf className="mt-0.5 size-4 shrink-0 text-primary" />{item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {p.description && p.short_description && (
            <div className="mt-10 border-t pt-8">
              <h2 className="text-xl">About this plant</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{p.description}</p>
            </div>
          )}
        </div>
      </div>

      {similar.data && similar.data.length > 0 && (
        <div className="bg-primary-tint">
          <ProductRail eyebrow="You may also like" title="Similar plants" products={similar.data} />
        </div>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t bg-background p-3 lg:hidden">
        <Button variant="outline" size="icon" className="size-11 shrink-0" aria-label="Add to wishlist"><Heart /></Button>
        {stock > 0 ? (
          <Button className="flex-1" size="lg" onClick={add}><ShoppingBag />Add to cart — {money(price)}</Button>
        ) : (
          <Button className="flex-1" size="lg" variant="secondary" onClick={() => void notifyMe()}><BellRing />Notify me</Button>
        )}
      </div>
    </div>
  );
}
