import { Link } from "@tanstack/react-router";
import type { Category, SiteMedia } from "@/types/api";

export interface SpaceCard {
  id: string;
  title: string;
  image: string;
  link: string;
}

/* Local defaults — used until the admin panel supplies "spaces" media */
export const defaultSpaceCards: SpaceCard[] = [
  { id: "living-room", title: "Living Room", image: "/places/living-room.jpg", link: "/search?q=living%20room" },
  { id: "bedroom", title: "Bedroom", image: "/places/bedroom.jpg", link: "/search?q=bedroom" },
  { id: "balcony", title: "Balcony", image: "/places/balcony.jpg", link: "/search?q=balcony" },
  { id: "office", title: "Office", image: "/places/office.jpg", link: "/search?q=office" },
];

/* Parent category that holds the space sub-categories, by slug. The admin panel
   can name it any of these; the first match wins. */
const SPACE_PARENT_SLUGS = ["shop-by-space", "shop-by-spaces", "spaces", "transform-your-home"];

/* Fallback artwork per space, used until the category has its own image */
const FALLBACK_IMAGES: Record<string, string> = {
  "living-room": "/places/living-room.jpg",
  bedroom: "/places/bedroom.jpg",
  balcony: "/places/balcony.jpg",
  office: "/places/office.jpg",
};

/* Map the admin category tree onto space cards — each sub-category of the
   "Shop by Space" parent becomes a tile linking to its category page, so the
   products shown there are whatever admin filed under that category. */
export function spaceCardsFromCategories(tree: Category[] | undefined): SpaceCard[] {
  const parent = (tree ?? []).find((cat) =>
    SPACE_PARENT_SLUGS.includes((cat.slug || "").toLowerCase()),
  );
  return (parent?.children ?? [])
    .filter((child) => child.slug)
    .map((child) => ({
      id: child.id,
      title: child.name,
      image: child.image || FALLBACK_IMAGES[child.slug as string] || "/places/living-room.jpg",
      link: `/category/${child.slug}`,
    }));
}

/* Map admin-managed site media (section: "spaces") onto space cards */
export function spaceCardsFromMedia(media: SiteMedia[] | undefined): SpaceCard[] {
  const mapped = (media ?? [])
    .filter((item) => item.image)
    .map((item, index) => ({
      id: item.id ?? `space-media-${index}`,
      title: item.title || "Shop now",
      image: item.image as string,
      link: item.cta_url || "/plants",
    }));
  return mapped.length > 0 ? mapped : defaultSpaceCards;
}

function SpaceTile({ space }: { space: SpaceCard }) {
  const external = /^https?:\/\//.test(space.link);
  const inner = (
    <>
      <img
        src={space.image}
        alt={space.title}
        width={760}
        height={1010}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      {/* Legibility wash behind the title and the button */}
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/45 to-transparent"
      />
      <h3 className="relative z-10 px-4 pt-6 text-center font-display text-2xl font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.45)] sm:text-[28px] lg:pt-8 lg:text-[32px]">
        {space.title}
      </h3>
      <span className="relative z-10 mt-auto mb-6 inline-flex items-center justify-center self-center rounded-full bg-white px-7 py-2.5 text-sm font-semibold text-forest shadow-md transition-transform duration-300 group-hover:scale-105 lg:mb-8">
        Shop Now
      </span>
    </>
  );

  const className =
    "group relative flex aspect-[3/5] flex-col overflow-hidden rounded-2xl bg-primary-soft shadow-[0_2px_14px_rgba(0,0,0,0.08)]";

  return external ? (
    <a href={space.link} target="_blank" rel="noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link to={space.link} className={className}>
      {inner}
    </Link>
  );
}

export function ShopBySpaceSection({
  spaces = defaultSpaceCards,
  title = "Transform Your Home.",
}: {
  spaces?: SpaceCard[];
  title?: string;
}) {
  if (spaces.length === 0) return null;

  return (
    <section className="bg-[#fbe4ed] py-12 lg:py-16">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <h2 className="mb-8 text-center font-display text-[2rem] font-extrabold text-foreground sm:text-[2.75rem] lg:mb-10 lg:text-[3.25rem]">
          {title}
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {spaces.map((space) => (
            <SpaceTile key={space.id} space={space} />
          ))}
        </div>
      </div>
    </section>
  );
}
