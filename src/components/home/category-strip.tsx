/* The green band of round category tiles under the hero. Tiles come from the
   admin's category tree; the bundled artwork below is only used while the
   catalogue is still empty. */

import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { navCategories } from "@/lib/nav-categories";
import type { Category } from "@/types/api";

const fallbackShortcuts = [
  { name: "Plants", slug: "plants", image: "/images/category-plants.png" },
  { name: "Pots", slug: "pots", image: "/images/category-pots.png" },
  { name: "Soil", slug: "soil", image: "/images/category-soil.png" },
  { name: "Fertilisers", slug: "fertilisers", image: "/images/category-fertilisers.png" },
  { name: "Seeds", slug: "seeds", image: "/images/category-seeds.png" },
  { name: "Garden Tools", slug: "garden-tools", image: "/images/category-tools.png" },
  { name: "Watering Solutions", slug: "watering-solutions", image: "/images/category-watering.png" },
  { name: "Pest Control", slug: "pest-control", image: "/images/category-pest-control.png" },
  { name: "Gardening Decor", slug: "gardening-decor", image: "/images/category-decor.png" },
] as const;

const TILE = "group w-[96px] shrink-0 text-center sm:w-[110px] lg:w-[116px]";
const TILE_IMG =
  "mx-auto flex aspect-square items-center justify-center overflow-hidden rounded-full bg-white p-3 shadow-sm transition-transform duration-300 group-hover:-translate-y-2 sm:p-4";
const TILE_LABEL = "mt-4 line-clamp-2 text-sm font-medium leading-5 text-white sm:text-[15px]";

export function CategoryStrip({
  categories,
  title = "Our Categories",
  limit = 9,
}: {
  categories: Category[] | undefined;
  title?: string;
  limit?: number;
}) {
  const live = navCategories(categories).slice(0, limit);

  return (
    <section className="mt-6 min-w-0 overflow-hidden bg-forest px-3 py-5 sm:px-6 sm:py-7 lg:mt-8 lg:px-9 lg:py-8">
      {title && (
        <h2 className="mb-6 text-center font-display text-[2rem] font-bold text-white sm:mb-8 sm:text-[2.75rem] lg:text-[3.25rem]">
          {title}
        </h2>
      )}
      <div className="mx-auto w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] lg:max-w-[1480px] [&::-webkit-scrollbar]:hidden">
        <div className="flex w-max min-w-full justify-start gap-4 px-2 sm:gap-6 lg:justify-center lg:gap-6">
          {live.map((cat) => (
            <Link key={cat.id} to="/category/$slug" params={{ slug: cat.slug || cat.id }} className={TILE}>
              <div className={TILE_IMG}>
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} loading="lazy" className="size-full object-contain" />
                ) : (
                  <span className="flex size-full items-center justify-center rounded-full bg-primary-tint">
                    <Leaf className="size-8 text-primary" />
                  </span>
                )}
              </div>
              <h3 className={TILE_LABEL}>{cat.name}</h3>
            </Link>
          ))}

          {live.length === 0 &&
            fallbackShortcuts.slice(0, limit).map(({ name, slug, image }) => (
              <Link key={name} to="/category/$slug" params={{ slug }} className={TILE}>
                <div className={TILE_IMG}>
                  <img src={image} alt="" width={816} height={816} loading="lazy" className="size-full object-contain" />
                </div>
                <h3 className={`${TILE_LABEL} lg:min-h-10`}>{name}</h3>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
