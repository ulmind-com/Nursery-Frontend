import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { queryKeys, storesApi } from "@/api/services";
import { StoreLocatorSection, storesFromApi } from "@/components/home/store-locator";

export const Route = createFileRoute("/locate-store")({
  head: () => ({
    meta: [
      { title: "Locate a Store | MyGarden" },
      { name: "description", content: "Find your nearest MyGarden store — addresses, directions and opening hours, city by city." },
      { property: "og:title", content: "Locate a Store | MyGarden" },
      { property: "og:description", content: "Every MyGarden store, city by city." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { data } = useQuery({ queryKey: queryKeys.stores, queryFn: storesApi.list, staleTime: 300_000 });
  const stores = storesFromApi(data);

  return (
    <div className="bg-storefront-wash">
      <section className="bg-forest py-14 text-center lg:py-20">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-star px-4 py-1.5 font-display text-xs font-bold text-forest sm:text-sm">
            <MapPin className="size-3.5" aria-hidden="true" />
            Walk in, look around, take one home
          </span>
          <h1 className="mt-5 font-display text-[2rem] font-extrabold tracking-tight text-white sm:text-[2.75rem] lg:text-[3.25rem]">
            Locate a store
          </h1>
          <p className="mx-auto mt-4 max-w-[46rem] text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
            Pick your city to see every MyGarden store, with directions one tap away. Our teams can help with plant
            choice, repotting and after-care in person.
          </p>
        </div>
      </section>

      {/* The home page strip does the city tabs and cards, so the page reuses it whole */}
      <StoreLocatorSection
        stores={stores}
        title="Find your nearest store"
        subtitle="Tap a store to open it in maps. Hours and phone numbers are listed on each card where we have them."
      />
    </div>
  );
}
