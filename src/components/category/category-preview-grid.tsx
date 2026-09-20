import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { money } from "@/components/product/product-card";
import { normalizeCategorySlug } from "./category-hero";
import samplePeaceLily from "@/assets/sample-peace-lily.jpg";
import sampleAnthurium from "@/assets/sample-anthurium.jpg";
import sampleJade from "@/assets/sample-jade.jpg";
import sampleArecaPalm from "@/assets/sample-areca-palm.jpg";
import sampleMoneyPlant from "@/assets/sample-money-plant.jpg";
import sampleSnakePlant from "@/assets/sample-snake-plant.jpg";
import potsTerracotta from "@/assets/sample-pots-terracotta.jpg";
import potsCeramic from "@/assets/sample-pots-ceramic.jpg";
import potsWooden from "@/assets/sample-pots-wooden.jpg";
import potsSage from "@/assets/sample-pots-sage.jpg";
import potsWoven from "@/assets/sample-pots-woven.jpg";
import potsTeal from "@/assets/sample-pots-teal.jpg";
import heroSoil from "@/assets/category-hero-soil.jpg";
import heroFertilisers from "@/assets/category-hero-fertilisers.jpg";
import heroSeeds from "@/assets/category-hero-seeds.jpg";
import heroTools from "@/assets/category-hero-tools.jpg";
import heroWatering from "@/assets/category-hero-watering.jpg";
import heroPest from "@/assets/category-hero-pest-control.jpg";
import heroDecor from "@/assets/category-hero-decor.jpg";

type PreviewItem = { title: string; image: string; price: number; mrp: number; bestseller?: boolean };

const plants: PreviewItem[] = [
  { title: "Peace Lily Plant", image: samplePeaceLily, price: 299, mrp: 350 },
  { title: "Anthurium Red Plant", image: sampleAnthurium, price: 699, mrp: 800, bestseller: true },
  { title: "Jade Mini Plant", image: sampleJade, price: 249, mrp: 300 },
  { title: "Areca Palm Plant", image: sampleArecaPalm, price: 599, mrp: 749, bestseller: true },
  { title: "Golden Money Plant", image: sampleMoneyPlant, price: 279, mrp: 349, bestseller: true },
  { title: "Snake Plant", image: sampleSnakePlant, price: 399, mrp: 499 },
];

const pots: PreviewItem[] = [
  { title: "Sienna Terracotta Pots", image: potsTerracotta, price: 999, mrp: 1499 },
  { title: "Roma Ceramic Pot", image: potsCeramic, price: 299, mrp: 499, bestseller: true },
  { title: "Orbit Wooden Planters", image: potsWooden, price: 1399, mrp: 2199 },
  { title: "Sage Ribbed Planter", image: potsSage, price: 799, mrp: 1099, bestseller: true },
  { title: "Woven Basket Planters", image: potsWoven, price: 1199, mrp: 1599, bestseller: true },
  { title: "Teal Faceted Planter", image: potsTeal, price: 899, mrp: 1299 },
];

const generic: Record<string, { image: string; names: string[] }> = {
  soil: { image: heroSoil, names: ["Premium Potting Mix", "Indoor Plant Soil", "Organic Garden Mix"] },
  fertilisers: { image: heroFertilisers, names: ["Plant Growth Tonic", "Organic Plant Food", "Bloom Booster"] },
  seeds: { image: heroSeeds, names: ["Flower Seed Collection", "Kitchen Garden Seeds", "Herb Seed Pack"] },
  "garden-tools": { image: heroTools, names: ["Essential Garden Tools", "Hand Trowel Set", "Garden Care Kit"] },
  "watering-solutions": { image: heroWatering, names: ["Classic Watering Can", "Plant Mister", "Drip Watering Kit"] },
  "pest-control": { image: heroPest, names: ["Plant Protection Spray", "Neem Care Kit", "Sticky Trap Set"] },
  "gardening-decor": { image: heroDecor, names: ["Garden Accent Set", "Decorative Plant Stand", "Garden Ornament"] },
};

function itemsFor(slug: string): PreviewItem[] {
  const key = normalizeCategorySlug(slug);
  if (key === "pots") return pots;
  if (key === "plants") return plants;
  const set = generic[key];
  if (!set) return plants;
  return [...set.names, ...set.names].map((title, index) => ({ title, image: set.image, price: 299 + index * 100, mrp: 399 + index * 150, bestseller: index === 1 || index === 4 }));
}

export function CategoryPreviewGrid({ slug }: { slug: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-x-5 lg:gap-y-8">
      {itemsFor(slug).map((item, index) => (
        <article key={`${item.title}-${index}`} className="group min-w-0 overflow-hidden rounded-xl bg-card">
          <div className="relative aspect-[1.08/1] overflow-hidden bg-muted">
            <img src={item.image} alt={item.title} width={768} height={960} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
            {item.bestseller && <span className="absolute left-2.5 top-2.5 rounded-md bg-star px-2 py-1 text-[9px] font-bold uppercase text-foreground sm:text-[10px]">Bestseller</span>}
          </div>
          <div className="p-3 sm:p-4">
            <h3 className="line-clamp-1 text-base text-forest sm:text-xl">{item.title}</h3>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
              <div className="flex min-w-0 items-baseline gap-1.5">
                <span className="price-num text-sm text-foreground sm:text-base">{money(item.price)}</span>
                <span className="price-num truncate text-[10px] font-medium text-muted-foreground line-through sm:text-sm">{money(item.mrp)}</span>
              </div>
              <Button type="button" className="h-9 w-full rounded-full bg-forest px-3 text-[11px] text-forest-foreground hover:bg-forest/90 sm:w-auto sm:min-w-32 sm:text-sm" onClick={() => toast.info("Preview product — add it in the admin panel to enable shopping.")}>View Product</Button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}