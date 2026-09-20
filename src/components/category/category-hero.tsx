import categoryDecorHero from "@/assets/category-hero-decor.jpg";
import categoryFertilisersHero from "@/assets/category-hero-fertilisers.jpg";
import categoryPestControlHero from "@/assets/category-hero-pest-control.jpg";
import categoryPlantsHero from "@/assets/category-hero-plants.jpg";
import categoryPotsHero from "@/assets/category-hero-pots.jpg";
import categorySeedsHero from "@/assets/category-hero-seeds.jpg";
import categorySoilHero from "@/assets/category-hero-soil.jpg";
import categoryToolsHero from "@/assets/category-hero-tools.jpg";
import categoryWateringHero from "@/assets/category-hero-watering.jpg";

type CategoryHeroDetails = {
  image: string;
  title: string;
  description: string;
};

const categoryHeroes: Record<string, CategoryHeroDetails> = {
  plants: {
    image: categoryPlantsHero,
    title: "Bring nature home",
    description: "Healthy plants, thoughtfully grown for every corner.",
  },
  pots: {
    image: categoryPotsHero,
    title: "Beautiful homes for your plants",
    description: "Statement planters crafted to make every plant shine.",
  },
  soil: {
    image: categorySoilHero,
    title: "A healthy start from the soil",
    description: "Balanced growing media for stronger roots and happier plants.",
  },
  fertilisers: {
    image: categoryFertilisersHero,
    title: "Nourishment for every leaf",
    description: "Plant nutrition selected for steady, healthy growth.",
  },
  seeds: {
    image: categorySeedsHero,
    title: "Grow something wonderful",
    description: "Seeds and starters for a garden that begins with you.",
  },
  "garden-tools": {
    image: categoryToolsHero,
    title: "The right tools make it easy",
    description: "Reliable garden essentials made for everyday care.",
  },
  "watering-solutions": {
    image: categoryWateringHero,
    title: "Care in every drop",
    description: "Thoughtful watering tools for thriving plants.",
  },
  "pest-control": {
    image: categoryPestControlHero,
    title: "Gentle care, lasting protection",
    description: "Plant-friendly solutions that help keep your garden healthy.",
  },
  "gardening-decor": {
    image: categoryDecorHero,
    title: "Make your garden feel like home",
    description: "Beautiful details for expressive indoor and outdoor spaces.",
  },
};

const aliases: Record<string, string> = {
  plant: "plants",
  planters: "pots",
  "pots-planters": "pots",
  fertiliser: "fertilisers",
  fertilizer: "fertilisers",
  fertilizers: "fertilisers",
  tools: "garden-tools",
  "garden-tools": "garden-tools",
  watering: "watering-solutions",
  "watering-solution": "watering-solutions",
  decor: "gardening-decor",
  "garden-decor": "gardening-decor",
};

export function normalizeCategorySlug(value: string) {
  const normalized = value.trim().toLowerCase().replaceAll("&", "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return aliases[normalized] ?? normalized;
}

export function getCategoryHero(value: string, fallbackName?: string): CategoryHeroDetails {
  const normalized = normalizeCategorySlug(value);
  const preset = categoryHeroes[normalized];
  if (preset) return preset;

  const displayName = fallbackName || value.replaceAll("-", " ");
  return {
    image: categoryPlantsHero,
    title: `Explore ${displayName}`,
    description: "Thoughtfully selected garden essentials for a greener home.",
  };
}

export function CategoryHero({ slug, name, description, image }: { slug: string; name: string; description?: string | undefined; image?: string | undefined }) {
  const details = getCategoryHero(slug, name);

  return (
    <section className="bg-storefront-wash px-3 pb-5 pt-3 sm:px-6 sm:pb-7 lg:px-9 lg:pb-8 lg:pt-4">
      <div className="relative mx-auto h-[240px] max-w-[1480px] overflow-hidden rounded-2xl bg-background sm:h-[270px] lg:aspect-[4.58/1] lg:h-auto">
        <img
          src={image || details.image}
          alt=""
          width={1600}
          height={560}
          className="absolute inset-x-0 top-0 h-[140px] w-full object-cover object-center sm:inset-0 sm:size-full"
        />
        <div className="absolute inset-x-0 bottom-0 flex h-[100px] items-center bg-storefront-wash px-5 sm:inset-y-0 sm:left-auto sm:right-0 sm:h-auto sm:w-[46%] sm:bg-transparent sm:px-8 lg:w-[43%] lg:px-12">
          <div className="max-w-[19rem] lg:max-w-[28rem]">
            <h1 className="font-display text-[1.65rem] leading-[1.04] text-primary-dark sm:text-[2.45rem] lg:text-[3.5rem]">
              {details.title}
            </h1>
          </div>
        </div>
      </div>
    </section>
  );
}