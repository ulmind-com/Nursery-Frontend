import { useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import type { StoreLocation } from "@/types/api";

/* Bundled defaults — used until the admin panel has stores of its own */
export const defaultStores: StoreLocation[] = [
  { id: "kol-1", name: "Park Street", city: "Kolkata", image: "/stores/s1.png", map_url: "https://maps.google.com/?q=Park+Street+Kolkata" },
  { id: "kol-2", name: "Salt Lake (Sector V)", city: "Kolkata", image: "/stores/s2.png", map_url: "https://maps.google.com/?q=Sector+V+Salt+Lake+Kolkata" },
  { id: "kol-3", name: "Ballygunge", city: "Kolkata", image: "/stores/s3.png", map_url: "https://maps.google.com/?q=Ballygunge+Kolkata" },
  { id: "kol-4", name: "New Town", city: "Kolkata", image: "/stores/s4.png", map_url: "https://maps.google.com/?q=New+Town+Kolkata" },
  { id: "mum-1", name: "Bandra West", city: "Mumbai", image: "/stores/s5.png", map_url: "https://maps.google.com/?q=Bandra+West+Mumbai" },
  { id: "mum-2", name: "Powai", city: "Mumbai", image: "/stores/s6.png", map_url: "https://maps.google.com/?q=Powai+Mumbai" },
];

/* The API already sorts by city_order then order, so grouping in encounter
   order is enough to keep the admin's tab sequence. */
export function groupStoresByCity(stores: StoreLocation[]): Array<{ city: string; stores: StoreLocation[] }> {
  const groups: Array<{ city: string; stores: StoreLocation[] }> = [];
  for (const store of stores) {
    if (!store.city || !store.image) continue;
    const bucket = groups.find((g) => g.city === store.city);
    if (bucket) bucket.stores.push(store);
    else groups.push({ city: store.city, stores: [store] });
  }
  return groups;
}

export function storesFromApi(stores: StoreLocation[] | undefined): StoreLocation[] {
  return stores && stores.length > 0 ? stores : defaultStores;
}

function StoreCard({ store }: { store: StoreLocation }) {
  const content = (
    <>
      <div className="aspect-[4/5] overflow-hidden bg-primary-soft">
        <img
          src={store.image}
          alt={`${store.name} store`}
          width={800}
          height={1000}
          loading="lazy"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
      </div>
      <div className="flex items-center justify-between gap-3 bg-star px-4 py-3 sm:px-5">
        <div className="min-w-0 text-left">
          <p className="truncate font-display text-sm font-bold text-forest sm:text-base">{store.name}</p>
          {store.address && <p className="truncate text-[11px] text-forest/70 sm:text-xs">{store.address}</p>}
        </div>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-forest text-white transition group-hover:bg-primary sm:size-10">
          <MapPin className="size-4 sm:size-[1.15rem]" aria-hidden="true" />
        </span>
      </div>
    </>
  );

  const className =
    "group block w-[248px] shrink-0 overflow-hidden rounded-2xl shadow-card transition-shadow hover:shadow-card-hover sm:w-[300px] lg:w-[340px]";

  return store.map_url ? (
    <a href={store.map_url} target="_blank" rel="noreferrer" className={className} aria-label={`Open ${store.name} in maps`}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}

export function StoreLocatorSection({
  stores = defaultStores,
  title = "Find Your Nearest Store",
  subtitle = "Step inside for exotic plants, rare planters, and an experience you can't find online.",
}: {
  stores?: StoreLocation[];
  title?: string;
  subtitle?: string;
}) {
  const groups = useMemo(() => groupStoresByCity(stores), [stores]);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const railRef = useRef<HTMLDivElement>(null);

  const current = groups.find((g) => g.city === activeCity) ?? groups[0];
  if (!current) return null;

  const scrollBy = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.firstElementChild as HTMLElement | null;
    const step = card ? card.offsetWidth + 20 : rail.clientWidth * 0.8;
    rail.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  return (
    <section className="bg-storefront-wash py-14 lg:py-20" aria-labelledby="store-locator-title">
      <div className="mx-auto max-w-[1480px] px-4 text-center sm:px-6 lg:px-10">
        <h2
          id="store-locator-title"
          className="font-display text-[2rem] font-extrabold tracking-tight text-forest sm:text-[2.75rem] lg:text-[3.25rem]"
        >
          {title}
          <span className="text-primary">.</span>
        </h2>
        <p className="mx-auto mt-3 max-w-[640px] text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
          {subtitle}
        </p>

        {groups.length > 1 && (
          <div className="mt-7 flex flex-wrap justify-center gap-2.5 sm:gap-3" role="tablist" aria-label="Cities">
            {groups.map((group) => {
              const isActive = group.city === current.city;
              return (
                <button
                  key={group.city}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveCity(group.city);
                    railRef.current?.scrollTo({ left: 0, behavior: "smooth" });
                  }}
                  className={`rounded-full border px-5 py-2.5 font-display text-sm font-semibold transition sm:px-7 sm:text-base ${
                    isActive
                      ? "border-primary bg-primary text-primary-foreground shadow-[0_10px_26px_-12px_oklch(0.378_0.077_168.94/0.8)] ring-4 ring-primary/15"
                      : "border-border bg-card text-forest hover:border-primary/50 hover:bg-primary-tint"
                  }`}
                >
                  {group.city}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="relative mt-8 lg:mt-10">
        <div
          ref={railRef}
          className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth scroll-px-4 px-4 pb-2 sm:scroll-px-6 sm:px-6 lg:scroll-px-10 lg:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {current.stores.map((store) => (
            <div key={store.id ?? `${store.city}-${store.name}`} className="snap-start">
              <StoreCard store={store} />
            </div>
          ))}
        </div>

        {current.stores.length > 2 && (
          <>
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              aria-label="Show previous stores"
              className="absolute left-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest/80 text-white shadow-lg backdrop-blur-sm transition hover:bg-forest sm:flex lg:left-5"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              aria-label="Show next stores"
              className="absolute right-3 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full bg-forest/80 text-white shadow-lg backdrop-blur-sm transition hover:bg-forest sm:flex lg:right-5"
            >
              <ChevronRight className="size-5" />
            </button>
          </>
        )}
      </div>
    </section>
  );
}
