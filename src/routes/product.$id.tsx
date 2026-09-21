import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { BellRing, ChevronDown, ChevronRight, Droplets, Flower2, Heart, Leaf, PackageOpen, Palette, PawPrint, Ruler, ScanSearch, ShoppingBag, Sparkles, Sprout, Star, Sun, Wind, X } from "lucide-react";
import { toast } from "sonner";
import { productsApi, queryKeys, recommendationApi, settingsApi, miscApi, reviewsApi } from "@/api/services";
import { PageSkeleton, ErrorState } from "@/components/shared/page-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductRail } from "@/components/home/section-rail";
import { money } from "@/components/product/product-card";
import { findPreviewItem } from "@/components/category/preview-products";
import { PurchaseInfo, PurchaseButtons, PurchaseActions } from "@/components/product/purchase-extras";
import { useCart } from "@/contexts/cart-context";
import { normalizeApiError } from "@/lib/api";
import type { Product, ProductSize, Review } from "@/types/api";

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

type FactIcon = "water" | "flower" | "fragrance" | "use" | "size" | "genus" | "pot" | "sun";
type ProductFact = { label: string; value: string; icon: FactIcon };

const factIcons: Record<FactIcon, typeof Droplets> = {
  water: Droplets,
  flower: Palette,
  fragrance: Flower2,
  use: Sprout,
  size: Ruler,
  genus: ScanSearch,
  pot: PackageOpen,
  sun: Sun,
};

const textFromUnknown = (value: unknown): string | undefined => {
  if (typeof value === "string") return value.trim() || undefined;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "Yes" : undefined;
  if (Array.isArray(value)) {
    const values = value.map((item) => textFromUnknown(item)).filter((item): item is string => Boolean(item));
    return values.length ? values.join(", ") : undefined;
  }
  return undefined;
};

const fact = (icon: FactIcon, value: unknown, label: string): ProductFact | null => {
  const text = textFromUnknown(value);
  return text ? { icon, value: text, label } : null;
};

function productFacts(product: Product, variant: ProductSize | undefined, selectedSize: string | undefined, selectedPlanter: string | undefined): ProductFact[] {
  const spec = product.plant_spec;
  const primaryUse = textFromUnknown(spec?.["use"]) ?? textFromUnknown(spec?.["usage"]) ?? textFromUnknown(spec?.plant_type);
  const tagUse = product.tags && product.tags.length ? product.tags.join(", ") : undefined;
  return [
    fact("water", spec?.["water_requirement"] ?? spec?.watering ?? spec?.water_schedule, "Water Requirement"),
    fact("flower", spec?.["flower_color"] ?? spec?.["flower_colour"], "Flower Color"),
    fact("fragrance", spec?.["fragrance"] ?? (spec?.fragrant ? "Fragrant" : undefined), "Fragrance"),
    fact("use", primaryUse, "Use"),
    fact("size", variant?.height ?? selectedSize ?? spec?.["size"], "Size"),
    fact("genus", spec?.["genus"] ?? spec?.["scientific_name"] ?? spec?.["botanical_name"], "Genus"),
    fact("pot", selectedPlanter ? "Yes" : undefined, "With Pots"),
    fact("sun", spec?.sunlight ?? spec?.["sunlight_requirement"], "Sunlight Requirement"),
    tagUse && tagUse !== primaryUse ? fact("use", tagUse, "Use") : null,
  ].filter((item): item is ProductFact => item !== null).slice(0, 9);
}

function ProductPage() {
  const { id } = Route.useParams();
  const preview = findPreviewItem(id);
  const q = useQuery({ queryKey: queryKeys.product(id), queryFn: () => productsApi.get(id), enabled: !preview });

  if (preview) return <PreviewProductPage preview={preview} />;
  if (q.isLoading) return <PageSkeleton />;
  if (q.isError || !q.data) return <ErrorState retry={() => void q.refetch()} />;
  return <LiveProductPage product={q.data} />;
}

function Gallery({ images, title, activeImage, onChange }: { images: string[]; title: string; activeImage: number; onChange: (index: number) => void }) {
  const hero = images[Math.min(activeImage, Math.max(images.length - 1, 0))];
  const hasThumbnails = images.length > 1;
  return (
    <div className={`grid min-w-0 self-start p-0 ${hasThumbnails ? "gap-4 lg:grid-cols-[76px_minmax(0,1fr)]" : "grid-cols-1"}`}>
      {hasThumbnails && (
        <div className="order-2 flex gap-3 overflow-x-auto pb-1 lg:order-1 lg:max-h-[610px] lg:flex-col lg:overflow-y-auto lg:pr-1">
          {images.map((src, index) => (
            <Button key={`${src}-${index}`} type="button" variant="ghost" onClick={() => onChange(index)} aria-label={`View image ${index + 1}`} aria-pressed={index === activeImage} className={`size-[72px] shrink-0 overflow-hidden rounded-sm border-2 bg-card p-0 transition-colors duration-200 ${index === activeImage ? "border-primary" : "border-border hover:border-primary"}`}>
              <img src={src} alt="" width={1024} height={1280} loading="lazy" className="size-full object-cover" />
            </Button>
          ))}
        </div>
      )}
      <div className="order-1 aspect-[1.04/1] overflow-hidden rounded-sm bg-primary-tint lg:order-2">
        {hero ? <img src={hero} alt={title} width={1024} height={1280} className="size-full object-cover" /> : <span className="flex size-full items-center justify-center text-sm text-muted-foreground">Image coming soon</span>}
      </div>
      <p className="order-3 hidden items-center justify-center gap-3 text-xs text-muted-foreground sm:flex lg:col-start-2"><ScanSearch className="size-3.5" /> Roll over image to zoom in</p>
    </div>
  );
}

function RatingLine({ rating, count, suffix }: { rating?: number | undefined; count?: number | undefined; suffix?: string | undefined }) {
  if (!rating && !count && !suffix) return null;
  return (
    <p className="flex flex-wrap items-center gap-1.5 text-sm text-foreground/80">
      {rating ? Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-4 ${index < Math.round(rating) ? "fill-star text-star" : "text-border"}`} />) : null}
      {rating ? <span className="font-semibold">{rating.toFixed(1)}</span> : null}
      {count ? <span>({count} reviews)</span> : null}
      {suffix ? <><span aria-hidden="true">|</span><span>{suffix}</span></> : null}
    </p>
  );
}

function ProductFactsGrid({ facts }: { facts: ProductFact[] }) {
  if (!facts.length) return null;
  return (
    <section aria-label="Product facts" className="border-y border-foreground/75 py-4">
      <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:gap-x-5 lg:grid-cols-3 lg:gap-x-4">
        {facts.map(({ icon, label, value }, index) => {
          const Icon = factIcons[icon];
          return (
            <div key={`${label}-${value}-${index}`} className="flex min-w-0 items-start gap-2.5">
              <Icon className="mt-0.5 size-8 shrink-0 stroke-[1.5] text-primary" />
              <div className="min-w-0">
                <p className={`break-words font-bold leading-snug text-foreground/65 ${value.length > 26 ? "text-xs" : "text-sm"}`}>{value}</p>
                <p className="mt-0.5 break-words text-[11px] leading-snug text-muted-foreground">{label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DetailAccordion({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <section className="rounded-md">
      <Button type="button" variant="ghost" onClick={() => setOpen((value) => !value)} aria-expanded={open} className="flex h-auto w-full justify-between rounded-md px-6 py-6 text-left text-xl font-bold text-foreground hover:bg-card">
        <span>{title}</span>
        <ChevronDown className={`size-5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </Button>
      {open && <div className="px-6 pb-6 text-sm leading-7 text-muted-foreground">{children}</div>}
    </section>
  );
}

function ShippingEstimator({ deliveryLabel }: { deliveryLabel?: string | undefined }) {
  const [zip, setZip] = useState("");
  const [estimated, setEstimated] = useState(false);
  return (
    <section className="rounded-md p-0">
      <h2 className="text-xl text-foreground">Estimate shipping</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <label className="text-sm font-semibold text-foreground">Country
          <Select defaultValue="India"><SelectTrigger className="mt-2 h-12 rounded-sm bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="India">India</SelectItem></SelectContent></Select>
        </label>
        <label className="text-sm font-semibold text-foreground">Province
          <Select defaultValue="West Bengal"><SelectTrigger className="mt-2 h-12 rounded-sm bg-background"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="West Bengal">West Bengal</SelectItem><SelectItem value="Andaman and Nicobar">Andaman and Nicobar</SelectItem><SelectItem value="Delhi">Delhi</SelectItem><SelectItem value="Maharashtra">Maharashtra</SelectItem></SelectContent></Select>
        </label>
        <label className="text-sm font-semibold text-foreground">Zip code
          <Input value={zip} onChange={(event) => { setZip(event.target.value); setEstimated(false); }} inputMode="numeric" className="mt-2 h-12 rounded-sm bg-background" />
        </label>
      </div>
      <Button type="button" onClick={() => setEstimated(Boolean(zip.trim()))} className="mt-5 rounded-sm bg-star px-8 text-foreground hover:bg-star/90">Estimate</Button>
      {estimated && <p className="mt-4 text-sm font-semibold text-forest">{deliveryLabel ? `Estimated delivery: ${deliveryLabel}` : "Delivery availability will be confirmed at checkout."}</p>}
    </section>
  );
}

function BelowImageInfo({ description, care, deliveryLabel, actions }: { description?: string | undefined; care: string[]; deliveryLabel?: string | undefined; actions?: ReactNode }) {
  if (!description && care.length === 0 && !actions) {
    return (
      <div className="mt-8 space-y-6">
        <ShippingEstimator deliveryLabel={deliveryLabel} />
      </div>
    );
  }
  return (
    <div className="mt-8 space-y-6">
      {description && <DetailAccordion title="Description"><p>{description}</p></DetailAccordion>}
      {care.length > 0 && <DetailAccordion title="Care Instruction"><ul className="space-y-2">{care.map((item) => <li key={item}>{item}</li>)}</ul></DetailAccordion>}
      <ShippingEstimator deliveryLabel={deliveryLabel} />
      {actions}
    </div>
  );
}

function ProductDescriptionSection({ description }: { description?: string | undefined }) {
  if (!description) return null;
  return (
    <div className="mt-8">
      <h2 className="text-base font-bold text-foreground">Product Description</h2>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{description}</p>
    </div>
  );
}

function Breadcrumbs({ title, category }: { title: string; category?: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground sm:text-sm">
      <Link to="/" className="hover:text-primary">Home</Link><ChevronRight className="size-3.5" />
      <Link to="/plants" search={{}} className="hover:text-primary">{category || "Products"}</Link><ChevronRight className="size-3.5" />
      <span className="truncate text-foreground">{title}</span>
    </nav>
  );
}

function PreviewProductPage({ preview }: { preview: NonNullable<ReturnType<typeof findPreviewItem>> }) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<"Small" | "Medium">("Small");
  const [selectedPlanter, setSelectedPlanter] = useState("Yoda");
  const [selectedColor, setSelectedColor] = useState("Ivory");
  const [quantity, setQuantity] = useState(1);
  const settings = useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get, staleTime: 300_000 });
  const previewPlanters = [
    { name: "GroPot", prices: { Small: 249, Medium: 349 }, shape: "plain" },
    { name: "Krish", prices: { Small: 299, Medium: 399 }, shape: "rim" },
    { name: "Kyoto", prices: { Small: 299, Medium: 449 }, shape: "ribbed" },
    { name: "Yoda", prices: { Small: 299, Medium: 449 }, shape: "round" },
    { name: "Lagos", prices: { Small: 349, Medium: 499 }, shape: "legs" },
    { name: "Roma", prices: { Small: 549, Medium: 699 }, shape: "ribbed" },
    { name: "Diamond", prices: { Small: 549, Medium: 699 }, shape: "diamond" },
    { name: "Table Top", prices: { Small: 549, Medium: 699 }, shape: "plain" },
    { name: "Spiro", prices: { Small: 549, Medium: 699 }, shape: "rim" },
  ] as const;
  const selectedPreviewPlanter = previewPlanters.find((item) => item.name === selectedPlanter) ?? previewPlanters[0];
  const planterPrice = selectedPreviewPlanter.prices[selectedSize];
  const gallery = preview.gallery?.length ? preview.gallery : [preview.image];
  const previewFacts = preview.facts ?? [];
  const previewCare = preview.careInstructions ?? [];
  const deliveryLabel = textFromUnknown(settings.data?.delivery?.["time"]) ?? textFromUnknown(settings.data?.delivery?.["delivery_time"]);
  const chooseSize = (size: "Small" | "Medium") => {
    setSelectedSize(size);
    setActiveImage(size === "Medium" && gallery.length > 1 ? gallery.length - 1 : 0);
  };
  return (
    <div className="bg-storefront-wash pb-24 lg:pb-16">
      <div className="mx-auto max-w-[1480px] px-4 py-7 sm:px-6 lg:px-10 lg:py-8">
        <Breadcrumbs title={preview.title} category={preview.category} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(400px,.82fr)] lg:gap-7">
          <div className="min-w-0">
            <Gallery images={gallery} title={preview.title} activeImage={activeImage} onChange={setActiveImage} />
            <BelowImageInfo description={preview.description} care={previewCare} deliveryLabel={deliveryLabel} actions={<PurchaseActions price={preview.price + planterPrice} quantity={quantity} stock={0} preview settings={settings.data} />} />
          </div>
          <section className="min-w-0 rounded-md p-5 sm:p-6">
            <RatingLine rating={preview.rating} count={preview.reviewCount} suffix="Design preview" />
            <h1 className="mt-2.5 text-3xl leading-tight text-foreground">{preview.title}</h1>
            <p className="mt-2 text-sm text-foreground/85">{preview.subtitle ?? "Premium nursery product preview"}</p>

            <div className="mt-6">
              <div className="mb-2.5 flex items-center justify-between gap-4">
                <h2 className="text-sm font-bold text-foreground">Select Plant Size</h2>
                <span className="text-xs font-semibold text-forest underline underline-offset-4">Size Guide</span>
              </div>
              <div className="grid max-w-[250px] grid-cols-2 gap-2">
                {(["Small", "Medium"] as const).map((size) => (
                  <Button key={size} type="button" variant="outline" aria-pressed={selectedSize === size} onClick={() => chooseSize(size)} className={`h-12 rounded-md px-4 text-sm font-semibold ${selectedSize === size ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "border-input bg-background text-foreground hover:border-primary hover:bg-background"}`}>{size}</Button>
                ))}
              </div>
            </div>

            <PurchaseInfo
              colors={[{ label: "Stone", available: true }, { label: "Ivory", available: true }, { label: "Terracotta", available: true }]}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              price={preview.price + planterPrice}
              mrp={preview.mrp + planterPrice}
              quantity={quantity}
              stock={0}
              onQuantityChange={setQuantity}
              preview
              settings={settings.data}
              sku="PREVIEW-PLANT"
              sizeLabel={selectedSize}
            />

            <PurchaseButtons
              stock={0}
              preview
              onAdd={() => toast.info("Add this product in the admin panel to enable shopping.")}
              onBuyNow={() => toast.info("Add this product in the admin panel to enable checkout.")}
            />

            <div className="mt-6">
              <h2 className="mb-2.5 text-sm font-bold text-foreground">Select Planter</h2>
              <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                {previewPlanters.map((planter) => {
                  const active = planter.name === selectedPlanter;
                  return (
                    <Button key={planter.name} type="button" variant="outline" aria-pressed={active} onClick={() => setSelectedPlanter(planter.name)} className={`h-24 min-w-0 flex-col gap-0.5 rounded-md px-1.5 py-2 ${active ? "border-primary bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : "border-input bg-background text-foreground hover:border-primary hover:bg-background"}`}>
                      <span aria-hidden="true" data-pot-shape={planter.shape} className="preview-pot-icon"><span /></span>
                      <span className="max-w-full truncate text-xs font-semibold">{planter.name}</span>
                      <span className="price-num text-xs">{money(planter.prices[selectedSize])}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

          </section>
        </div>
        <FactsAndDescription facts={previewFacts} description={preview.description} />
      </div>
    </div>
  );
}

function LiveProductPage({ product: p }: { product: Product }) {
  const nav = useNavigate();
  const similar = useQuery({ queryKey: ["recommendations", "similar", p.id], queryFn: () => recommendationApi.similar(p.id) });
  const settings = useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get, staleTime: 300_000 });
  const reviews = useQuery({ queryKey: ["reviews", p.id], queryFn: () => reviewsApi.list({ product_id: p.id, limit: 6 }) });
  const [selected, setSelected] = useState(() => Math.max(0, p.sizes?.findIndex((size) => size.stock > 0) ?? 0));
  const [activeImage, setActiveImage] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const variants = p.sizes ?? [];
  const v = variants[selected] ?? variants[0];
  const price = v?.price ?? p.price ?? 0;
  const mrp = v?.mrp ?? p.mrp;
  const stock = v?.stock ?? p.stock ?? 0;
  const imgs = (v?.images?.length ? v.images : p.images) || [];
  const spec = p.plant_spec;
  const sizeNames = [...new Set(variants.map((item) => item.name).filter(Boolean))];
  const selectedSize = v?.name ?? sizeNames[0];
  const sizeVariants = variants.map((item, index) => ({ item, index })).filter(({ item }) => item.name === selectedSize);
  const planterNames = [...new Set(sizeVariants.map(({ item }) => item.pot_type).filter((name): name is string => Boolean(name)))];
  const selectedPlanter = v?.pot_type ?? planterNames[0];
  const colorVariants = sizeVariants.filter(({ item }) => selectedPlanter ? item.pot_type === selectedPlanter : true);
  const colorNames = [...new Set(colorVariants.map(({ item }) => item.pot_color).filter((name): name is string => Boolean(name)))];
  const heights = variants.filter((item) => item.height).map((item) => ({ name: item.name, height: item.height }));
  const reviewItems = reviews.data ? (Array.isArray(reviews.data) ? reviews.data : reviews.data.items) : [];

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
  ].filter((item): item is { icon: typeof Leaf; label: string } => item !== null);
  const includes = toList(p.includes);
  const care = toList(p.care_instructions);
  const tips = toList(p.care_tips);
  const deliveryLabel = textFromUnknown(settings.data?.delivery?.["time"]) ?? textFromUnknown(settings.data?.delivery?.["delivery_time"]);
  const facts = productFacts(p, v, selectedSize, selectedPlanter);
  const description = p.description || p.short_description;

  const selectVariant = (index: number) => { setSelected(index); setActiveImage(0); setQuantity(1); };
  const selectSize = (name: string) => {
    const available = variants.findIndex((item) => item.name === name && item.stock > 0);
    const fallback = variants.findIndex((item) => item.name === name);
    selectVariant(available >= 0 ? available : fallback);
  };
  const selectPlanter = (name: string) => {
    const matching = sizeVariants.filter(({ item }) => item.pot_type === name);
    const preferred = matching.find(({ item }) => item.pot_color === v?.pot_color && item.stock > 0) ?? matching.find(({ item }) => item.stock > 0) ?? matching[0];
    if (preferred) selectVariant(preferred.index);
  };
  const selectColor = (name: string) => {
    const matching = colorVariants.find(({ item }) => item.pot_color === name && item.stock > 0) ?? colorVariants.find(({ item }) => item.pot_color === name);
    if (matching) selectVariant(matching.index);
  };
  const add = () => {
    addItem({ product_id: p.id, title: p.title, ...(imgs[0] ? { image: imgs[0] } : {}), qty: quantity, ...(v?.name ? { size_variant: v.name } : {}), ...(v?.pot_type ? { pot_type: v.pot_type } : {}), unit_price: price, ...(mrp ? { mrp } : {}), stock, ...(v?.sku ? { sku: v.sku } : {}) });
    toast.success(`${quantity} × ${p.title} added to cart`);
  };
  const buyNow = async () => {
    add();
    await nav({ to: "/checkout" });
  };
  const notifyMe = async () => {
    try {
      await miscApi.waitlist({ product_id: p.id, ...(v?.name ? { size_variant: v.name } : {}) });
      toast.success("We'll let you know when this item is back.");
    } catch (err) { toast.error(normalizeApiError(err).message); }
  };

  return (
    <div className="bg-storefront-wash pb-24 lg:pb-0">
      <div className="mx-auto max-w-[1480px] px-4 py-7 sm:px-6 lg:px-10 lg:py-8">
        <Breadcrumbs title={p.title} />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.18fr)_minmax(400px,.82fr)] lg:gap-7">
          <div className="min-w-0">
            <Gallery images={imgs} title={p.title} activeImage={activeImage} onChange={setActiveImage} />
            <BelowImageInfo description={description} care={[...care, ...tips]} deliveryLabel={deliveryLabel} actions={<PurchaseActions price={price} quantity={quantity} stock={stock} settings={settings.data} />} />
          </div>
          <section className="min-w-0 rounded-md p-5 sm:p-6">
            <RatingLine rating={p.rating} count={p.review_count} suffix={p.sold_count ? `${p.sold_count.toLocaleString("en-IN")} Happy Customers` : undefined} />
            <h1 className="mt-2.5 text-3xl leading-tight text-foreground">{p.title}</h1>
            <p className="mt-2 text-sm text-foreground/85">{p.short_description || p.description}</p>

            {sizeNames.length > 0 && (
              <div className="mt-6">
                <div className="mb-2.5 flex items-center justify-between gap-4">
                  <h2 className="text-sm font-bold text-foreground">Select Plant Size</h2>
                  {heights.length > 0 && <button type="button" onClick={() => setSizeGuideOpen(true)} className="text-xs font-semibold text-forest underline underline-offset-4">Size Guide</button>}
                </div>
                <div className="grid max-w-[360px] grid-cols-2 gap-2 sm:grid-cols-3">
                  {sizeNames.map((name) => {
                    const indices = variants.map((item, index) => ({ item, index })).filter(({ item }) => item.name === name);
                    const unavailable = indices.every(({ item }) => item.stock < 1);
                    return <button key={name} type="button" disabled={unavailable} aria-pressed={name === selectedSize} onClick={() => selectSize(name)} className={`h-12 rounded-md border px-3 text-sm font-semibold transition-colors duration-200 ${name === selectedSize ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background hover:border-primary"} disabled:cursor-not-allowed disabled:opacity-45`}>{name}</button>;
                  })}
                </div>
              </div>
            )}

            <PurchaseInfo
              colors={colorNames.map((name) => ({ label: name, available: colorVariants.some(({ item }) => item.pot_color === name && item.stock > 0) }))}
              selectedColor={v?.pot_color ?? colorNames[0]}
              onColorChange={selectColor}
              price={price}
              mrp={mrp}
              quantity={quantity}
              stock={stock}
              onQuantityChange={setQuantity}
              settings={settings.data}
              sku={v?.sku ?? p.sku}
              sizeLabel={v?.pot_size ?? v?.height ?? selectedSize}
            />

            <PurchaseButtons
              stock={stock}
              onAdd={stock > 0 ? add : () => void notifyMe()}
              onBuyNow={stock > 0 ? () => void buyNow() : undefined}
            />

            {planterNames.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-2.5 text-sm font-bold text-foreground">Select Planter</h2>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
                  {planterNames.map((name) => {
                    const options = sizeVariants.filter(({ item }) => item.pot_type === name);
                    const representative = options.find(({ item }) => item.stock > 0)?.item ?? options[0]?.item;
                    const unavailable = options.every(({ item }) => item.stock < 1);
                    return representative ? <button key={name} type="button" disabled={unavailable} aria-pressed={name === selectedPlanter} onClick={() => selectPlanter(name)} className={`relative flex min-h-20 flex-col items-center justify-center rounded-md border px-1.5 py-1.5 text-center transition-colors duration-200 ${name === selectedPlanter ? "border-primary bg-primary text-primary-foreground" : "border-input bg-background hover:border-primary"} disabled:cursor-not-allowed disabled:opacity-45`}>
                      <PackageOpen className="mb-0.5 size-5 stroke-1" />
                      <span className="line-clamp-1 text-xs font-semibold">{name}</span>
                      <span className="price-num mt-1 text-xs">{money(representative.price)}</span>
                    </button> : null;
                  })}
                </div>
              </div>
            )}

            {traits.length > 0 && <ul className="mt-5 flex flex-wrap gap-2">{traits.map(({ icon: Icon, label }) => <li key={label} className="flex items-center gap-1.5 rounded-full bg-primary-tint px-3 py-1.5 text-xs font-medium text-primary-soft-foreground"><Icon className="size-3.5" />{label}</li>)}</ul>}
          </section>
        </div>

        <FactsAndDescription facts={facts.length ? facts : specRows.map(({ icon: _Icon, label, value }) => ({ icon: "use", label, value }))} description={description} />

        {includes.length > 0 && <section className="mt-8 rounded-md p-0"><h2 className="text-2xl text-forest">What's included</h2><ul className="mt-5 space-y-2.5">{includes.map((item) => <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground"><Leaf className="mt-0.5 size-4 shrink-0 text-primary" />{item}</li>)}</ul></section>}
      </div>

      {reviewItems.length > 0 && <ReviewsSection reviews={reviewItems} rating={p.rating} count={p.review_count} />}
      {similar.data && similar.data.length > 0 && <div className="bg-primary-tint"><ProductRail eyebrow="You may also like" title="Similar products" products={similar.data} /></div>}

      <div className="fixed inset-x-0 bottom-14 z-40 flex items-center gap-2 border-t bg-background p-3 lg:hidden">
        <Button variant="outline" size="icon" className="size-11 shrink-0" aria-label="Add to wishlist"><Heart /></Button>
        {stock > 0 ? <Button className="flex-1 bg-forest text-forest-foreground hover:bg-forest/90" size="lg" onClick={add}><ShoppingBag />Add {quantity} — {money(price * quantity)}</Button> : <Button className="flex-1" size="lg" variant="secondary" onClick={() => void notifyMe()}><BellRing />Notify me</Button>}
      </div>

      {sizeGuideOpen && (
        <div role="dialog" aria-modal="true" aria-labelledby="size-guide-title" className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/35 p-4" onMouseDown={(event) => { if (event.currentTarget === event.target) setSizeGuideOpen(false); }}>
          <div className="w-full max-w-md rounded-xl bg-background p-6 shadow-xl">
            <div className="flex items-center justify-between"><h2 id="size-guide-title" className="text-xl text-forest">Size guide</h2><Button variant="ghost" size="icon" onClick={() => setSizeGuideOpen(false)} aria-label="Close size guide"><X /></Button></div>
            <div className="mt-5 divide-y divide-border">{heights.map((row, index) => <div key={`${row.name}-${index}`} className="flex justify-between gap-4 py-3 text-sm"><span className="font-semibold">{row.name}</span><span className="text-muted-foreground">{row.height}</span></div>)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewsSection({ reviews, rating, count }: { reviews: Review[]; rating: number | undefined; count: number | undefined }) {
  return (
    <section className="border-t border-border bg-background py-12">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <div className="flex items-end justify-between gap-5"><div><p className="text-xs font-bold uppercase text-primary">Customer reviews</p><h2 className="mt-1 text-2xl text-forest">What plant parents say</h2></div>{Boolean(rating) && <p className="price-num text-xl text-forest">{rating?.toFixed(1)} <Star className="inline size-4 fill-star text-star" /> <span className="text-sm font-normal text-muted-foreground">({count || reviews.length})</span></p>}</div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">{reviews.slice(0, 3).map((review) => <article key={review.id} className="rounded-xl border border-border p-5"><p className="flex gap-0.5">{Array.from({ length: 5 }, (_, index) => <Star key={index} className={`size-3.5 ${index < review.rating ? "fill-star text-star" : "text-border"}`} />)}</p>{review.title && <h3 className="mt-3 text-base">{review.title}</h3>}<p className="mt-2 line-clamp-4 text-sm leading-6 text-muted-foreground">{review.comment}</p><p className="mt-4 text-xs font-semibold">{review.user_name || "Verified customer"}</p></article>)}</div>
      </div>
    </section>
  );
}