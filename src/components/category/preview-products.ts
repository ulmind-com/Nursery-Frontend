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
  description?: string;
  careInstructions?: string[];
  facts?: Array<{ label: string; value: string; icon: "water" | "flower" | "fragrance" | "use" | "size" | "genus" | "pot" | "sun" }>;
  reviews?: Array<{ id: string; user_name: string; rating: number; title?: string; comment: string; verified_buyer?: boolean; helpful_count?: number; created_at: string }>;
  reasonsToBuy?: string[];
  reasonsImage?: string;
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
    description: "A graceful flowering plant for bright balconies and airy corners, shown here as a temporary preview until live catalogue details are added.",
    careInstructions: ["Keep the soil lightly moist and avoid long dry spells.", "Place in outdoor shade or filtered outdoor sun.", "Trim tired leaves and remove spent blooms to keep the plant tidy."],
    facts: [
      { icon: "water", value: "Daily", label: "Water Requirement" },
      { icon: "flower", value: "Pink", label: "Flower Color" },
      { icon: "fragrance", value: "Fragrant", label: "Fragrance" },
      { icon: "use", value: "Hedge", label: "Use" },
      { icon: "size", value: "Large", label: "Size" },
      { icon: "genus", value: "Nyctanthes", label: "Genus" },
      { icon: "pot", value: "Yes", label: "With Pots" },
      { icon: "sun", value: "Outdoor Shade, Outdoor Sun", label: "Sunlight Requirement" },
      { icon: "use", value: "Hedge, Low Maintenance, Medicinal, Outdoor", label: "Use" },
    ],
    reviews: [
      { id: "preview-review-1", user_name: "Arya .", rating: 5, title: "The plant looks healthy and good condition", comment: "The plant looks healthy and good condition. Packaging was neat and it reached without a single broken leaf.", verified_buyer: true, helpful_count: 12, created_at: "2026-09-12T10:00:00Z" },
      { id: "preview-review-2", user_name: "Rhea S.", rating: 5, title: "Beautiful blooms", comment: "Started flowering within three weeks on my balcony. Very happy with the size I received.", verified_buyer: true, helpful_count: 7, created_at: "2026-08-30T10:00:00Z" },
      { id: "preview-review-3", user_name: "Imran K.", rating: 4, title: "Good plant, slow start", comment: "Took a little time to settle after repotting but it is growing well now. Care card was helpful.", verified_buyer: true, helpful_count: 3, created_at: "2026-08-14T10:00:00Z" },
      { id: "preview-review-4", user_name: "Meera D.", rating: 5, comment: "Lovely fragrance in the evening. Delivery was quick and the pot option looks premium.", verified_buyer: true, created_at: "2026-07-28T10:00:00Z" },
      { id: "preview-review-5", user_name: "Sourav B.", rating: 2, title: "Leaves were damaged", comment: "A few leaves arrived yellowed, but support responded quickly and guided me on recovery.", helpful_count: 1, created_at: "2026-07-02T10:00:00Z" },
    ],
    reasonsImage: peaceLilyDetailRoom,
    reasonsToBuy: [
      "Elegant white blooms make corners feel fresh and calm",
      "Glossy green leaves add a premium indoor look",
      "Easy to style on desks, shelves, and bright balconies",
      "Pairs beautifully with ceramic and textured planters",
      "A graceful gift-ready plant for everyday homes",
    ],
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