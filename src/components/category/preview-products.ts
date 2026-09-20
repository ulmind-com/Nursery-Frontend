import samplePeaceLily from "@/assets/sample-peace-lily.jpg";
import sampleAnthurium from "@/assets/sample-anthurium.jpg";
import sampleJade from "@/assets/sample-jade.jpg";
import sampleArecaPalm from "@/assets/sample-areca-palm.jpg";
import sampleMoneyPlant from "@/assets/sample-money-plant.jpg";
import sampleSnakePlant from "@/assets/sample-snake-plant.jpg";
import peaceLilyDetailMain from "@/assets/peace-lily-detail-main.jpg";
import peaceLilyDetailLeaves from "@/assets/peace-lily-detail-leaves.jpg";
import peaceLilyDetailRoom from "@/assets/peace-lily-detail-room.jpg";
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
import { normalizeCategorySlug } from "./category-hero";

export type PreviewItem = {
  id: string;
  category: string;
  title: string;
  image: string;
  gallery?: string[];
  subtitle?: string;
  rating?: number;
  reviewCount?: number;
  price: number;
  mrp: number;
  bestseller?: boolean;
};

const plants: PreviewItem[] = [
  {
    id: "preview-plants-0",
    category: "plants",
    title: "Peace Lily Plant",
    image: samplePeaceLily,
    gallery: [peaceLilyDetailMain, samplePeaceLily, peaceLilyDetailLeaves, peaceLilyDetailRoom],
    subtitle: "Stunning air-purifying plant",
    rating: 4.8,
    reviewCount: 440,
    price: 299,
    mrp: 350,
  },
  { id: "preview-plants-1", category: "plants", title: "Anthurium Red Plant", image: sampleAnthurium, price: 699, mrp: 800, bestseller: true },
  { id: "preview-plants-2", category: "plants", title: "Jade Mini Plant", image: sampleJade, price: 249, mrp: 300 },
  { id: "preview-plants-3", category: "plants", title: "Areca Palm Plant", image: sampleArecaPalm, price: 599, mrp: 749, bestseller: true },
  { id: "preview-plants-4", category: "plants", title: "Golden Money Plant", image: sampleMoneyPlant, price: 279, mrp: 349, bestseller: true },
  { id: "preview-plants-5", category: "plants", title: "Snake Plant", image: sampleSnakePlant, price: 399, mrp: 499 },
];

const pots: PreviewItem[] = [
  { id: "preview-pots-0", category: "pots", title: "Sienna Terracotta Pots", image: potsTerracotta, price: 999, mrp: 1499 },
  { id: "preview-pots-1", category: "pots", title: "Roma Ceramic Pot", image: potsCeramic, price: 299, mrp: 499, bestseller: true },
  { id: "preview-pots-2", category: "pots", title: "Orbit Wooden Planters", image: potsWooden, price: 1399, mrp: 2199 },
  { id: "preview-pots-3", category: "pots", title: "Sage Ribbed Planter", image: potsSage, price: 799, mrp: 1099, bestseller: true },
  { id: "preview-pots-4", category: "pots", title: "Woven Basket Planters", image: potsWoven, price: 1199, mrp: 1599, bestseller: true },
  { id: "preview-pots-5", category: "pots", title: "Teal Faceted Planter", image: potsTeal, price: 899, mrp: 1299 },
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

export function previewItemsFor(slug: string): PreviewItem[] {
  const key = normalizeCategorySlug(slug);
  if (key === "pots") return pots;
  if (key === "plants") return plants;
  const set = generic[key];
  if (!set) return plants;
  return [...set.names, ...set.names].map((title, index) => ({
    id: `preview-${key}-${index}`,
    category: key,
    title,
    image: set.image,
    price: 299 + index * 100,
    mrp: 399 + index * 150,
    bestseller: index === 1 || index === 4,
  }));
}

export function findPreviewItem(id: string): PreviewItem | undefined {
  const match = /^preview-(.+)-(\d+)$/.exec(id);
  if (!match) return undefined;
  const category = match[1];
  const index = Number(match[2]);
  if (!category || !Number.isInteger(index)) return undefined;
  return previewItemsFor(category)[index];
}