import samplePeaceLily from "@/assets/sample-peace-lily.jpg";
import sampleAnthurium from "@/assets/sample-anthurium.jpg";
import sampleJade from "@/assets/sample-jade.jpg";
import sampleArecaPalm from "@/assets/sample-areca-palm.jpg";
import sampleMoneyPlant from "@/assets/sample-money-plant.jpg";
import sampleSnakePlant from "@/assets/sample-snake-plant.jpg";
import peaceLilyDetailMain from "@/assets/peace-lily-detail-main.jpg";
import peaceLilyDetailLeaves from "@/assets/peace-lily-detail-leaves.jpg";
import peaceLilyDetailRoom from "@/assets/peace-lily-detail-room.jpg";
import myGardenComparisonPlant from "@/assets/mygarden-comparison-plant.jpg";
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
import type { ProductComparison } from "@/types/api";

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
  comparison?: ProductComparison;
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
    comparison: {
      title: "MyGarden vs the Rest",
      brand_label: "MyGarden",
      local_label: "Local Nurseries",
      others_label: "Others",
      image: myGardenComparisonPlant,
      image_alt: "Healthy palm in an ivory self-watering planter",
      image_title: "Every plant is packed",
      image_subtitle: "with care for its journey to your doorstep.",
      rows: [
        { label: "Plant quality", local: { status: "negative", detail: "Quality may vary" }, brand: { status: "positive", title: "Healthy & nursery checked", badge: "Care inspected" }, others: { status: "mixed", detail: "May vary" } },
        { label: "Pest care", local: { status: "negative", detail: "Not always checked" }, brand: { status: "positive", title: "Care checked" }, others: { status: "negative", detail: "May vary" } },
        { label: "Repotting", local: { status: "mixed", detail: "Depends on seller" }, brand: { status: "positive", title: "Ready in its planter" }, others: { status: "mixed", detail: "May vary" } },
        { label: "Soil", local: { status: "mixed", detail: "Standard mix" }, brand: { status: "positive", title: "Plant-suited mix" }, others: { status: "mixed", detail: "Standard mix" } },
        { label: "Growing conditions", local: { status: "mixed", detail: "May vary" }, brand: { status: "positive", title: "Nursery grown" }, others: { status: "mixed", detail: "May vary" } },
        { label: "After-sale help", local: { status: "negative", detail: "Not always available" }, brand: { status: "positive", title: "Plant-care support" }, others: { status: "negative", detail: "Not always available" } },
        { label: "Plant range", local: { status: "mixed", detail: "Store dependent" }, brand: { status: "positive", title: "Curated collection" }, others: { status: "mixed", detail: "May vary" } },
      ],
    },
  },
  {
    id: "preview-plants-1",
    category: "plants",
    title: "Anthurium Red Plant",
    image: sampleAnthurium,
    price: 699,
    mrp: 800,
    bestseller: true,
    subtitle: "Glossy red blooms all year",
    rating: 4.7,
    reviewCount: 212,
    ...plantContent({
      key: "anthurium",
      name: "Anthurium Red",
      image: sampleAnthurium,
      description:
        "A striking flowering plant with waxy red blooms and deep green foliage, shown here as a temporary preview until live catalogue details are added.",
      care: [
        "Water when the top layer of soil feels dry to touch.",
        "Keep in bright indirect light, away from harsh afternoon sun.",
        "Wipe the leaves now and then to keep the glossy finish.",
      ],
      facts: [
        { icon: "water", value: "Twice a week", label: "Water Requirement" },
        { icon: "flower", value: "Red", label: "Flower Color" },
        { icon: "fragrance", value: "Non-fragrant", label: "Fragrance" },
        { icon: "use", value: "Table Top, Gifting", label: "Use" },
        { icon: "size", value: "Medium", label: "Size" },
        { icon: "genus", value: "Anthurium", label: "Genus" },
        { icon: "pot", value: "Yes", label: "With Pots" },
        { icon: "sun", value: "Indoor Bright, Filtered Light", label: "Sunlight Requirement" },
        { icon: "use", value: "Indoor, Low Maintenance, Flowering", label: "Use" },
      ],
      reasons: [
        "Bright red blooms stay on the plant for weeks",
        "Glossy leaves look premium on a desk or side table",
        "Happy in indoor light, so no balcony needed",
        "Compact shape fits small apartments easily",
        "A colourful, gift-ready plant for housewarmings",
      ],
      reviews: [
        { n: "Nikita R.", r: 5, t: "Blooms are stunning", c: "Three flowers when it arrived and two more opened in a month." },
        { n: "Farhan A.", r: 5, t: "Well packed", c: "Not a single bloom bent in transit. Pot looks neat too." },
        { n: "Divya M.", r: 4, c: "Healthy plant, one leaf had a small tear but it is growing fine." },
        { n: "Karthik S.", r: 3, t: "Slow to flower", c: "Took time to settle indoors, support shared a care routine that helped." },
      ],
    }),
  },
  {
    id: "preview-plants-2",
    category: "plants",
    title: "Jade Mini Plant",
    image: sampleJade,
    price: 249,
    mrp: 300,
    subtitle: "Compact succulent for desks",
    rating: 4.6,
    reviewCount: 168,
    ...plantContent({
      key: "jade",
      name: "Jade Mini",
      image: sampleJade,
      description:
        "A hardy mini succulent with plump green leaves, ideal for desks and window sills, shown here as a temporary preview until live catalogue details are added.",
      care: [
        "Water only when the soil is completely dry.",
        "Keep in bright light for thicker, healthier leaves.",
        "Use a pot with a drainage hole to avoid soggy roots.",
      ],
      facts: [
        { icon: "water", value: "Once in 10 days", label: "Water Requirement" },
        { icon: "flower", value: "Rarely flowers", label: "Flower Color" },
        { icon: "fragrance", value: "Non-fragrant", label: "Fragrance" },
        { icon: "use", value: "Table Top, Office Desk", label: "Use" },
        { icon: "size", value: "Small", label: "Size" },
        { icon: "genus", value: "Crassula", label: "Genus" },
        { icon: "pot", value: "Yes", label: "With Pots" },
        { icon: "sun", value: "Bright Indirect, Morning Sun", label: "Sunlight Requirement" },
        { icon: "use", value: "Indoor, Low Maintenance, Succulent", label: "Use" },
      ],
      reasons: [
        "Needs very little water, perfect for busy weeks",
        "Small footprint fits desks, shelves and window sills",
        "Thick green leaves keep their look through the year",
        "Easy to grow new plants from a single cutting",
        "Popular as a small, thoughtful desk gift",
      ],
      reviews: [
        { n: "Sneha P.", r: 5, t: "Cute and healthy", c: "Perfect size for my work desk and needs almost no attention." },
        { n: "Rahul V.", r: 5, c: "Leaves are thick and firm. Exactly like the photos." },
        { n: "Ayesha N.", r: 4, t: "Small but good", c: "Smaller than I expected but very healthy and growing well." },
        { n: "Tanmay G.", r: 4, c: "Nice plant, the pot option is worth adding." },
      ],
    }),
  },
  {
    id: "preview-plants-3",
    category: "plants",
    title: "Areca Palm Plant",
    image: sampleArecaPalm,
    price: 599,
    mrp: 749,
    bestseller: true,
    subtitle: "Tall air-purifying indoor palm",
    rating: 4.8,
    reviewCount: 305,
    ...plantContent({
      key: "areca",
      name: "Areca Palm",
      image: sampleArecaPalm,
      description:
        "A full, feathery indoor palm that fills empty corners with soft greenery, shown here as a temporary preview until live catalogue details are added.",
      care: [
        "Keep the soil lightly moist, never waterlogged.",
        "Place in bright indirect light near a window.",
        "Mist the fronds in dry weather to avoid browning tips.",
      ],
      facts: [
        { icon: "water", value: "Twice a week", label: "Water Requirement" },
        { icon: "flower", value: "Non-flowering", label: "Flower Color" },
        { icon: "fragrance", value: "Non-fragrant", label: "Fragrance" },
        { icon: "use", value: "Floor Corner, Living Room", label: "Use" },
        { icon: "size", value: "Large", label: "Size" },
        { icon: "genus", value: "Dypsis", label: "Genus" },
        { icon: "pot", value: "Yes", label: "With Pots" },
        { icon: "sun", value: "Indoor Bright, Filtered Light", label: "Sunlight Requirement" },
        { icon: "use", value: "Indoor, Air Purifying, Floor Plant", label: "Use" },
      ],
      reasons: [
        "Tall, bushy fronds fill empty corners instantly",
        "A classic air-purifying pick for living rooms",
        "Soft green texture pairs with any interior style",
        "Grows well in indoor light without direct sun",
        "Looks premium in a large floor planter",
      ],
      reviews: [
        { n: "Pooja T.", r: 5, t: "Bushy and tall", c: "Taller than expected and the corner looks completely different now." },
        { n: "Vikram J.", r: 5, t: "Great packing", c: "Fronds were tied properly, nothing broke on the way." },
        { n: "Anusha L.", r: 4, c: "A couple of tips browned in the first week, fine after regular misting." },
        { n: "Deep C.", r: 5, c: "Good value for this size. Buying one more for the bedroom." },
      ],
    }),
  },
  {
    id: "preview-plants-4",
    category: "plants",
    title: "Golden Money Plant",
    image: sampleMoneyPlant,
    price: 279,
    mrp: 349,
    bestseller: true,
    subtitle: "Trailing vine for shelves",
    rating: 4.7,
    reviewCount: 389,
    ...plantContent({
      key: "money",
      name: "Golden Money Plant",
      image: sampleMoneyPlant,
      description:
        "A fast-growing trailing vine with golden-green leaves that drapes beautifully from shelves, shown here as a temporary preview until live catalogue details are added.",
      care: [
        "Water when the top inch of soil feels dry.",
        "Grows in low to bright indirect light.",
        "Trim long vines to keep the plant full and bushy.",
      ],
      facts: [
        { icon: "water", value: "Twice a week", label: "Water Requirement" },
        { icon: "flower", value: "Non-flowering", label: "Flower Color" },
        { icon: "fragrance", value: "Non-fragrant", label: "Fragrance" },
        { icon: "use", value: "Hanging, Shelf, Table Top", label: "Use" },
        { icon: "size", value: "Medium", label: "Size" },
        { icon: "genus", value: "Epipremnum", label: "Genus" },
        { icon: "pot", value: "Yes", label: "With Pots" },
        { icon: "sun", value: "Low Light, Indirect Light", label: "Sunlight Requirement" },
        { icon: "use", value: "Indoor, Low Maintenance, Trailing", label: "Use" },
      ],
      reasons: [
        "Grows happily even in low-light rooms",
        "Trailing vines look great on shelves and ledges",
        "One of the easiest plants for first-time owners",
        "Cuttings root in water, so it is easy to multiply",
        "Golden-green leaves brighten dull corners",
      ],
      reviews: [
        { n: "Ritika S.", r: 5, t: "Very healthy vines", c: "Long vines, thick leaves, and it has already grown since delivery." },
        { n: "Manoj K.", r: 5, c: "Best plant for beginners. Almost no effort needed." },
        { n: "Sana Q.", r: 4, t: "Good, slightly smaller", c: "Slightly smaller than the photo but healthy and filling out." },
        { n: "Jeevan R.", r: 4, c: "Nice colour on the leaves, delivered on time." },
      ],
    }),
  },
  {
    id: "preview-plants-5",
    category: "plants",
    title: "Snake Plant",
    image: sampleSnakePlant,
    price: 399,
    mrp: 499,
    subtitle: "Low-maintenance upright plant",
    rating: 4.9,
    reviewCount: 511,
    ...plantContent({
      key: "snake",
      name: "Snake Plant",
      image: sampleSnakePlant,
      description:
        "An upright, sculptural plant with firm banded leaves that thrives on neglect, shown here as a temporary preview until live catalogue details are added.",
      care: [
        "Water sparingly, only when the soil is fully dry.",
        "Tolerates low light but grows faster in bright light.",
        "Avoid water collecting at the base of the leaves.",
      ],
      facts: [
        { icon: "water", value: "Once in 10 days", label: "Water Requirement" },
        { icon: "flower", value: "Rarely flowers", label: "Flower Color" },
        { icon: "fragrance", value: "Non-fragrant", label: "Fragrance" },
        { icon: "use", value: "Floor Corner, Table Top", label: "Use" },
        { icon: "size", value: "Medium", label: "Size" },
        { icon: "genus", value: "Sansevieria", label: "Genus" },
        { icon: "pot", value: "Yes", label: "With Pots" },
        { icon: "sun", value: "Low Light, Indirect Light", label: "Sunlight Requirement" },
        { icon: "use", value: "Indoor, Air Purifying, Low Maintenance", label: "Use" },
      ],
      reasons: [
        "Survives long gaps between watering",
        "Upright leaves give a clean, sculptural look",
        "Grows in low-light corners other plants dislike",
        "A well-known air-purifying favourite for bedrooms",
        "Sturdy leaves handle travel and moving homes well",
      ],
      reviews: [
        { n: "Ankita B.", r: 5, t: "Zero effort plant", c: "I water it once in ten days and it still looks perfect." },
        { n: "Harsh D.", r: 5, t: "Firm healthy leaves", c: "Leaves are thick with clean banding, exactly as shown." },
        { n: "Neelam C.", r: 5, c: "Great for my bedroom corner. Packing was excellent." },
        { n: "Ravi P.", r: 4, c: "One leaf had a bend, rest of the plant is strong." },
      ],
    }),
  },
];

const pots: PreviewItem[] = [
  {
    id: "preview-pots-0",
    category: "pots",
    title: "Sienna Terracotta Pots",
    image: potsTerracotta,
    price: 999,
    mrp: 1499,
    subtitle: "Breathable clay planters",
    rating: 4.6,
    reviewCount: 96,
    ...goodsContent({
      key: "pots-terracotta",
      name: "Sienna Terracotta Pots",
      image: potsTerracotta,
      description:
        "Classic hand-finished terracotta planters that let roots breathe, shown here as a temporary preview until live catalogue details are added.",
      usage: [
        "Soak new terracotta in water before the first planting.",
        "Wipe off white salt marks with a dry brush.",
        "Use a saucer indoors as clay lets moisture pass through.",
      ],
      facts: [
        { icon: "pot", value: "Terracotta clay", label: "Material" },
        { icon: "use", value: "Matte natural", label: "Finish" },
        { icon: "water", value: "Yes", label: "Drainage Hole" },
        { icon: "size", value: "Set of pots", label: "Pack" },
        { icon: "genus", value: "Indoor & outdoor", label: "Placement" },
        { icon: "sun", value: "Sun safe", label: "Weather" },
        { icon: "flower", value: "Not included", label: "Plant" },
        { icon: "fragrance", value: "Wipe clean", label: "Care" },
        { icon: "use", value: "Table Top, Balcony", label: "Use" },
      ],
      reasons: [
        "Porous clay lets roots breathe and dry evenly",
        "Warm earthy tone suits every plant and interior",
        "Drainage hole helps avoid overwatered roots",
        "Sturdy walls hold shape outdoors through seasons",
        "A timeless set that works on balconies and shelves",
      ],
      reviews: [
        { n: "Shreya M.", r: 5, t: "Lovely finish", c: "The clay texture feels premium and the size is just right." },
        { n: "Abhay T.", r: 4, t: "Well packed", c: "Bubble wrapped properly, arrived without a single chip." },
        { n: "Nandini V.", r: 5, c: "My plants look far better in these than plastic pots." },
        { n: "Gaurav S.", r: 4, c: "Good quality, just remember to use a saucer indoors." },
      ],
    }),
  },
  {
    id: "preview-pots-1",
    category: "pots",
    title: "Roma Ceramic Pot",
    image: potsCeramic,
    price: 299,
    mrp: 499,
    bestseller: true,
    subtitle: "Glazed ceramic table planter",
    rating: 4.7,
    reviewCount: 143,
    ...goodsContent({
      key: "pots-ceramic",
      name: "Roma Ceramic Pot",
      image: potsCeramic,
      description:
        "A smooth glazed ceramic planter that dresses up desks and side tables, shown here as a temporary preview until live catalogue details are added.",
      usage: [
        "Wipe the glaze with a damp cloth to keep the shine.",
        "Use a saucer or liner to protect wooden surfaces.",
        "Avoid dropping on hard floors; ceramic can chip.",
      ],
      facts: [
        { icon: "pot", value: "Glazed ceramic", label: "Material" },
        { icon: "use", value: "Glossy", label: "Finish" },
        { icon: "water", value: "Yes", label: "Drainage Hole" },
        { icon: "size", value: "Small to medium", label: "Size" },
        { icon: "genus", value: "Indoor", label: "Placement" },
        { icon: "sun", value: "Indoor use", label: "Weather" },
        { icon: "flower", value: "Not included", label: "Plant" },
        { icon: "fragrance", value: "Wipe clean", label: "Care" },
        { icon: "use", value: "Table Top, Office Desk", label: "Use" },
      ],
      reasons: [
        "Glossy glaze looks polished on desks and tables",
        "Neutral shape works with flowering and foliage plants",
        "Easy to wipe clean, no staining over time",
        "Drainage hole keeps roots from sitting in water",
        "Affordable way to upgrade a plain nursery pot",
      ],
      reviews: [
        { n: "Ipsita R.", r: 5, t: "Looks expensive", c: "Finish is smooth and even, looks costlier than the price." },
        { n: "Sameer H.", r: 5, c: "Perfect size for my money plant. Very happy." },
        { n: "Lakshmi N.", r: 4, t: "Nice but small", c: "Slightly smaller than I imagined, still a great pot." },
        { n: "Arnab D.", r: 4, c: "Good packing, reached safely." },
      ],
    }),
  },
  {
    id: "preview-pots-2",
    category: "pots",
    title: "Orbit Wooden Planters",
    image: potsWooden,
    price: 1399,
    mrp: 2199,
    subtitle: "Warm wood-finish planter set",
    rating: 4.5,
    reviewCount: 74,
    ...goodsContent({
      key: "pots-wooden",
      name: "Orbit Wooden Planters",
      image: potsWooden,
      description:
        "Wood-finish planters with a warm, modern look for living rooms and study corners, shown here as a temporary preview until live catalogue details are added.",
      usage: [
        "Keep an inner liner or nursery pot inside before watering.",
        "Dust with a dry cloth; avoid soaking the surface.",
        "Place away from continuous rain to protect the finish.",
      ],
      facts: [
        { icon: "pot", value: "Wood finish", label: "Material" },
        { icon: "use", value: "Matte", label: "Finish" },
        { icon: "water", value: "Use inner liner", label: "Drainage" },
        { icon: "size", value: "Set of planters", label: "Pack" },
        { icon: "genus", value: "Indoor", label: "Placement" },
        { icon: "sun", value: "Keep dry", label: "Weather" },
        { icon: "flower", value: "Not included", label: "Plant" },
        { icon: "fragrance", value: "Dust clean", label: "Care" },
        { icon: "use", value: "Living Room, Study", label: "Use" },
      ],
      reasons: [
        "Warm wood tone softens modern interiors",
        "Raised design lifts plants off the floor",
        "Set gives a coordinated look in one buy",
        "Lightweight, so rearranging is effortless",
        "Hides plain nursery pots neatly",
      ],
      reviews: [
        { n: "Ruchi A.", r: 5, t: "Beautiful set", c: "The three sizes together look great next to my sofa." },
        { n: "Prateek M.", r: 4, t: "Sturdy", c: "Feels solid and the finish is even on all sides." },
        { n: "Bhavna S.", r: 4, c: "Need to use a liner inside, otherwise very good." },
        { n: "Ismail F.", r: 5, c: "Delivery was quick and packing was thick." },
      ],
    }),
  },
  {
    id: "preview-pots-3",
    category: "pots",
    title: "Sage Ribbed Planter",
    image: potsSage,
    price: 799,
    mrp: 1099,
    bestseller: true,
    subtitle: "Ribbed planter in soft sage",
    rating: 4.6,
    reviewCount: 88,
    ...goodsContent({
      key: "pots-sage",
      name: "Sage Ribbed Planter",
      image: potsSage,
      description:
        "A ribbed planter in a soft sage tone that adds quiet texture to any shelf, shown here as a temporary preview until live catalogue details are added.",
      usage: [
        "Clean the ribbed surface with a soft brush.",
        "Use a saucer indoors to catch drained water.",
        "Rotate the planter now and then for even plant growth.",
      ],
      facts: [
        { icon: "pot", value: "Ceramic", label: "Material" },
        { icon: "use", value: "Ribbed matte", label: "Finish" },
        { icon: "water", value: "Yes", label: "Drainage Hole" },
        { icon: "size", value: "Medium", label: "Size" },
        { icon: "genus", value: "Indoor", label: "Placement" },
        { icon: "sun", value: "Indoor use", label: "Weather" },
        { icon: "flower", value: "Not included", label: "Plant" },
        { icon: "fragrance", value: "Wipe clean", label: "Care" },
        { icon: "use", value: "Shelf, Table Top", label: "Use" },
      ],
      reasons: [
        "Ribbed texture adds depth without loud colour",
        "Soft sage shade pairs with green foliage",
        "Matte finish hides fingerprints and dust",
        "Balanced height suits medium indoor plants",
        "Looks styled even before the plant goes in",
      ],
      reviews: [
        { n: "Tanya K.", r: 5, t: "Exact colour", c: "The sage shade is exactly like the picture, very calming." },
        { n: "Vivek N.", r: 5, c: "Ribbing looks premium in person." },
        { n: "Ipshita G.", r: 4, t: "Good weight", c: "Heavy enough not to topple with a tall plant." },
        { n: "Mohit L.", r: 4, c: "Happy with it, wish it came in a bigger size too." },
      ],
    }),
  },
  {
    id: "preview-pots-4",
    category: "pots",
    title: "Woven Basket Planters",
    image: potsWoven,
    price: 1199,
    mrp: 1599,
    bestseller: true,
    subtitle: "Natural woven plant baskets",
    rating: 4.5,
    reviewCount: 112,
    ...goodsContent({
      key: "pots-woven",
      name: "Woven Basket Planters",
      image: potsWoven,
      description:
        "Hand-woven baskets that turn plain nursery pots into a warm, natural display, shown here as a temporary preview until live catalogue details are added.",
      usage: [
        "Always keep the nursery pot inside the basket.",
        "Place a waterproof tray at the base before watering.",
        "Keep away from constant damp to protect the weave.",
      ],
      facts: [
        { icon: "pot", value: "Woven fibre", label: "Material" },
        { icon: "use", value: "Natural weave", label: "Finish" },
        { icon: "water", value: "Use inner pot", label: "Drainage" },
        { icon: "size", value: "Set of baskets", label: "Pack" },
        { icon: "genus", value: "Indoor", label: "Placement" },
        { icon: "sun", value: "Keep dry", label: "Weather" },
        { icon: "flower", value: "Not included", label: "Plant" },
        { icon: "fragrance", value: "Dust clean", label: "Care" },
        { icon: "use", value: "Living Room, Corner", label: "Use" },
      ],
      reasons: [
        "Instantly hides plain black nursery pots",
        "Natural weave adds warmth to floors and corners",
        "Very light, so large plants stay easy to move",
        "Works with tall palms and bushy foliage alike",
        "Set covers more than one plant size",
      ],
      reviews: [
        { n: "Maya S.", r: 5, t: "Transformed my corner", c: "My palm looks like a styled photo now." },
        { n: "Rohit B.", r: 4, t: "Light and neat", c: "Very light but the weave feels tight and strong." },
        { n: "Sarita J.", r: 5, c: "Both sizes are useful. Good buy." },
        { n: "Amit W.", r: 4, c: "Remember to use a tray inside before watering." },
      ],
    }),
  },
  {
    id: "preview-pots-5",
    category: "pots",
    title: "Teal Faceted Planter",
    image: potsTeal,
    price: 899,
    mrp: 1299,
    subtitle: "Faceted planter in deep teal",
    rating: 4.6,
    reviewCount: 67,
    ...goodsContent({
      key: "pots-teal",
      name: "Teal Faceted Planter",
      image: potsTeal,
      description:
        "A faceted planter in a deep teal glaze that works as a standalone accent piece, shown here as a temporary preview until live catalogue details are added.",
      usage: [
        "Wipe the glaze with a damp cloth to keep the colour rich.",
        "Use a saucer to protect furniture from drained water.",
        "Handle the edges carefully while repotting.",
      ],
      facts: [
        { icon: "pot", value: "Glazed ceramic", label: "Material" },
        { icon: "use", value: "Faceted gloss", label: "Finish" },
        { icon: "water", value: "Yes", label: "Drainage Hole" },
        { icon: "size", value: "Medium", label: "Size" },
        { icon: "genus", value: "Indoor", label: "Placement" },
        { icon: "sun", value: "Indoor use", label: "Weather" },
        { icon: "flower", value: "Not included", label: "Plant" },
        { icon: "fragrance", value: "Wipe clean", label: "Care" },
        { icon: "use", value: "Table Top, Shelf", label: "Use" },
      ],
      reasons: [
        "Deep teal glaze stands out against green leaves",
        "Faceted sides catch light from every angle",
        "Sturdy base keeps taller plants steady",
        "Easy-clean glossy surface stays looking new",
        "A single planter that works as a decor accent",
      ],
      reviews: [
        { n: "Debolina R.", r: 5, t: "Gorgeous colour", c: "The teal is rich and deep, photos do not do it justice." },
        { n: "Nikhil A.", r: 4, t: "Solid build", c: "Thick ceramic, feels durable." },
        { n: "Priya U.", r: 5, c: "Looks like a decor piece even with a small plant." },
        { n: "Sagar T.", r: 4, c: "Arrived safely with good padding." },
      ],
    }),
  },
];

const generic: Record<string, { image: string; names: string[]; kind: string; usage: string[]; facts: PreviewFacts; reasons: string[] }> = {
  soil: {
    image: heroSoil,
    kind: "potting mix",
    names: ["Premium Potting Mix", "Indoor Plant Soil", "Organic Garden Mix"],
    usage: [
      "Loosen the mix before filling the pot.",
      "Leave a finger gap below the rim for watering.",
      "Store the leftover pack sealed in a dry place.",
    ],
    facts: [
      { icon: "pot", value: "Ready to use", label: "Form" },
      { icon: "water", value: "Well draining", label: "Drainage" },
      { icon: "use", value: "Pots & planters", label: "Use" },
      { icon: "size", value: "Pack", label: "Packaging" },
      { icon: "genus", value: "Indoor & outdoor", label: "Suitable For" },
      { icon: "sun", value: "Store in shade", label: "Storage" },
      { icon: "flower", value: "All plants", label: "Plant Type" },
      { icon: "fragrance", value: "Earthy", label: "Odour" },
      { icon: "use", value: "Repotting, Top-up", label: "Best For" },
    ],
    reasons: [
      "Light, airy mix that drains instead of turning soggy",
      "Ready to use straight from the pack",
      "Works for both indoor pots and balcony planters",
      "Helps young roots settle faster after repotting",
      "Easy to store and top up whenever needed",
    ],
  },
  fertilisers: {
    image: heroFertilisers,
    kind: "plant food",
    names: ["Plant Growth Tonic", "Organic Plant Food", "Bloom Booster"],
    usage: [
      "Follow the dosage on the pack; more is not better.",
      "Apply on moist soil, never on a bone-dry pot.",
      "Keep out of reach of children and pets.",
    ],
    facts: [
      { icon: "pot", value: "Plant food", label: "Type" },
      { icon: "water", value: "With watering", label: "Application" },
      { icon: "use", value: "Potted plants", label: "Use" },
      { icon: "size", value: "Pack", label: "Packaging" },
      { icon: "genus", value: "Indoor & outdoor", label: "Suitable For" },
      { icon: "sun", value: "Store in shade", label: "Storage" },
      { icon: "flower", value: "Foliage & flowering", label: "Plant Type" },
      { icon: "fragrance", value: "Mild", label: "Odour" },
      { icon: "use", value: "Growth, Blooming", label: "Best For" },
    ],
    reasons: [
      "Simple routine feed for everyday potted plants",
      "Measured dosage keeps feeding safe and easy",
      "Supports fresh leaves and steady new growth",
      "Suits both indoor plants and balcony pots",
      "Compact pack lasts across many feedings",
    ],
  },
  seeds: {
    image: heroSeeds,
    kind: "seed pack",
    names: ["Flower Seed Collection", "Kitchen Garden Seeds", "Herb Seed Pack"],
    usage: [
      "Sow at the depth mentioned on the pack.",
      "Keep the soil lightly moist until sprouting.",
      "Move seedlings to brighter light once they appear.",
    ],
    facts: [
      { icon: "pot", value: "Seed pack", label: "Type" },
      { icon: "water", value: "Keep moist", label: "Water" },
      { icon: "use", value: "Pots, Beds", label: "Use" },
      { icon: "size", value: "Multi-pack", label: "Packaging" },
      { icon: "genus", value: "Home garden", label: "Suitable For" },
      { icon: "sun", value: "Bright light", label: "Sunlight" },
      { icon: "flower", value: "Season based", label: "Plant Type" },
      { icon: "fragrance", value: "Store dry", label: "Storage" },
      { icon: "use", value: "Sowing, Gifting", label: "Best For" },
    ],
    reasons: [
      "Start your own plants from scratch at home",
      "Multi-pack gives variety in a single buy",
      "Sowing instructions printed on the pack",
      "Grows in pots, grow bags or garden beds",
      "A fun, low-cost way to begin gardening",
    ],
  },
  "garden-tools": {
    image: heroTools,
    kind: "garden tool",
    names: ["Essential Garden Tools", "Hand Trowel Set", "Garden Care Kit"],
    usage: [
      "Wipe the blades dry after each use.",
      "Store indoors to avoid rust in damp weather.",
      "Keep sharp edges away from children.",
    ],
    facts: [
      { icon: "pot", value: "Metal & grip handle", label: "Material" },
      { icon: "use", value: "Everyday gardening", label: "Use" },
      { icon: "water", value: "Wipe dry", label: "Care" },
      { icon: "size", value: "Set", label: "Pack" },
      { icon: "genus", value: "Indoor & outdoor", label: "Suitable For" },
      { icon: "sun", value: "Store indoors", label: "Storage" },
      { icon: "flower", value: "Not included", label: "Plant" },
      { icon: "fragrance", value: "Low maintenance", label: "Upkeep" },
      { icon: "use", value: "Potting, Pruning", label: "Best For" },
    ],
    reasons: [
      "Covers the basic jobs of repotting and trimming",
      "Comfortable grips make longer sessions easier",
      "Compact set stores neatly on a balcony shelf",
      "Useful for both indoor pots and garden beds",
      "One kit instead of buying tools one by one",
    ],
  },
  "watering-solutions": {
    image: heroWatering,
    kind: "watering accessory",
    names: ["Classic Watering Can", "Plant Mister", "Drip Watering Kit"],
    usage: [
      "Rinse before first use.",
      "Empty fully after watering to avoid deposits.",
      "Store away from direct sun to protect the material.",
    ],
    facts: [
      { icon: "pot", value: "Durable body", label: "Material" },
      { icon: "water", value: "Controlled flow", label: "Flow" },
      { icon: "use", value: "Indoor & balcony", label: "Use" },
      { icon: "size", value: "Single unit", label: "Pack" },
      { icon: "genus", value: "All plants", label: "Suitable For" },
      { icon: "sun", value: "Store in shade", label: "Storage" },
      { icon: "flower", value: "Not included", label: "Plant" },
      { icon: "fragrance", value: "Rinse clean", label: "Care" },
      { icon: "use", value: "Daily Watering", label: "Best For" },
    ],
    reasons: [
      "Controlled flow avoids spilling on floors",
      "Easy to reach hanging and shelf plants",
      "Light to hold even when filled",
      "Simple to rinse and store after use",
      "Makes a daily watering routine quicker",
    ],
  },
  "pest-control": {
    image: heroPest,
    kind: "plant protection",
    names: ["Plant Protection Spray", "Neem Care Kit", "Sticky Trap Set"],
    usage: [
      "Test on a few leaves before treating the whole plant.",
      "Apply in the evening, not under harsh sun.",
      "Repeat as mentioned on the pack until pests clear.",
    ],
    facts: [
      { icon: "pot", value: "Plant protection", label: "Type" },
      { icon: "water", value: "Spray on leaves", label: "Application" },
      { icon: "use", value: "Indoor & outdoor", label: "Use" },
      { icon: "size", value: "Pack", label: "Packaging" },
      { icon: "genus", value: "Common pests", label: "Targets" },
      { icon: "sun", value: "Evening use", label: "Timing" },
      { icon: "flower", value: "Not included", label: "Plant" },
      { icon: "fragrance", value: "Store sealed", label: "Storage" },
      { icon: "use", value: "Prevention, Treatment", label: "Best For" },
    ],
    reasons: [
      "Helps tackle common houseplant pests early",
      "Simple application routine on leaves",
      "Usable for indoor pots and balcony plants",
      "Handy pack size for home gardens",
      "Keeps new plants protected after repotting",
    ],
  },
  "gardening-decor": {
    image: heroDecor,
    kind: "garden decor",
    names: ["Garden Accent Set", "Decorative Plant Stand", "Garden Ornament"],
    usage: [
      "Place on a level surface for stability.",
      "Dust regularly to keep the finish clean.",
      "Shift indoors during heavy rain if it is not weatherproof.",
    ],
    facts: [
      { icon: "pot", value: "Decor piece", label: "Type" },
      { icon: "use", value: "Styling", label: "Use" },
      { icon: "water", value: "Dust clean", label: "Care" },
      { icon: "size", value: "As shown", label: "Size" },
      { icon: "genus", value: "Indoor & balcony", label: "Placement" },
      { icon: "sun", value: "Keep dry", label: "Weather" },
      { icon: "flower", value: "Not included", label: "Plant" },
      { icon: "fragrance", value: "Low maintenance", label: "Upkeep" },
      { icon: "use", value: "Corners, Balcony", label: "Best For" },
    ],
    reasons: [
      "Finishes a plant corner with one accent piece",
      "Lifts and frames plants for a styled look",
      "Works indoors and on covered balconies",
      "Easy to move while rearranging",
      "Pairs with pots you already own",
    ],
  },
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
    rating: 4.5,
    reviewCount: 48 + index * 7,
    ...goodsContent({
      key: `${key}-${index}`,
      name: title,
      image: set.image,
      description: `A dependable ${set.kind} for everyday home gardening, shown here as a temporary preview until live catalogue details are added.`,
      usage: set.usage,
      facts: set.facts,
      reasons: set.reasons,
      reviews: [
        { n: "Ananya P.", r: 5, t: "Does the job", c: `Simple to use and exactly what I needed for my plants.` },
        { n: "Vinay K.", r: 4, t: "Good quality", c: "Packaging was neat and the quality feels reliable." },
        { n: "Shalini R.", r: 5, c: "Delivered quickly and works well for my balcony setup." },
        { n: "Imtiaz S.", r: 4, c: "Happy with the purchase, would order again." },
      ],
    }),
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