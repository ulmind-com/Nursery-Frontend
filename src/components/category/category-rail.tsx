import { Link } from "@tanstack/react-router";
import categoryDecor from "@/assets/category-decor.png";
import categoryFertilisers from "@/assets/category-fertilisers.png";
import categoryPestControl from "@/assets/category-pest-control.png";
import categoryPlants from "@/assets/category-plants.png";
import categoryPots from "@/assets/category-pots.png";
import categorySeeds from "@/assets/category-seeds.png";
import categorySoil from "@/assets/category-soil.png";
import categoryTools from "@/assets/category-tools.png";
import categoryWatering from "@/assets/category-watering.png";
import { normalizeCategorySlug } from "./category-hero";

export const categoryShortcuts = [
  { name: "Plants", slug: "plants", image: categoryPlants },
  { name: "Pots", slug: "pots", image: categoryPots },
  { name: "Soil", slug: "soil", image: categorySoil },
  { name: "Fertilisers", slug: "fertilisers", image: categoryFertilisers },
  { name: "Seeds", slug: "seeds", image: categorySeeds },
  { name: "Garden Tools", slug: "garden-tools", image: categoryTools },
  { name: "Watering Solutions", slug: "watering-solutions", image: categoryWatering },
  { name: "Pest Control", slug: "pest-control", image: categoryPestControl },
  { name: "Gardening Decor", slug: "gardening-decor", image: categoryDecor },
] as const;

export function CategoryRail({ activeSlug }: { activeSlug: string }) {
  const selected = normalizeCategorySlug(activeSlug);

  return (
    <section className="min-w-0 overflow-hidden bg-storefront-wash px-3 pb-8 sm:px-6 sm:pb-9 lg:px-9 lg:pb-10">
      <div className="mx-auto w-full min-w-0 max-w-[1480px] overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex min-w-max gap-3 sm:gap-5 lg:w-full lg:justify-between lg:gap-4">
          {categoryShortcuts.map(({ name, slug, image }) => {
            const active = normalizeCategorySlug(slug) === selected;
            return (
              <Link key={slug} to="/category/$slug" params={{ slug }} aria-current={active ? "page" : undefined} className="group w-[88px] shrink-0 text-center sm:w-[108px] lg:w-[118px]">
                <div className={`mx-auto flex aspect-square items-center justify-center overflow-hidden rounded-full bg-background p-2 transition-colors duration-200 sm:p-2.5 ${active ? "ring-1 ring-primary" : "group-hover:ring-1 group-hover:ring-primary"}`}>
                  <img src={image} alt="" width={512} height={512} loading="lazy" className="size-full object-contain transition-transform duration-300 group-hover:scale-105" />
                </div>
                <h2 className="mt-2.5 line-clamp-2 text-xs font-medium leading-4 sm:text-sm lg:min-h-10">{name}</h2>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}