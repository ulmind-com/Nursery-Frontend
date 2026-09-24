/* "Planters That Redefine Spaces" — centred intro, three outlined benefit
   cards, and a grid of planter products underneath. */

import { LottieIcon } from "@/components/ui/lottie-icon";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/api";

const ICON_DIR = "/Planters";
const ANIM_DIR = "/lottie/planters";

const benefits = [
  {
    icon: `${ANIM_DIR}/strong.json`,
    fallbackIcon: `${ICON_DIR}/Lightweight.png`,
    title: "Lightweight yet strong",
    description: "Made from high-quality, UV & frost resistant Fiberglass.",
  },
  {
    icon: `${ANIM_DIR}/resistant.json`,
    fallbackIcon: `${ICON_DIR}/UV%20&%20moisture%20resistant.png`,
    title: "UV & moisture resistant",
    description: "Perfect for both indoor and outdoor spaces.",
  },
  {
    icon: `${ANIM_DIR}/modern.json`,
    fallbackIcon: `${ICON_DIR}/Designed%20for%20modern%20spaces.png`,
    title: "Designed for modern spaces",
    description: "Clean, minimal design that fits any décor.",
  },
];

export function PlantersRedefineSection({
  title = "Planters That Redefine Spaces",
  subtitle = "Our FRP planters are the perfect balance of style and strength—transforming any corner into a modern green retreat.",
  products = [],
}: {
  title?: string;
  subtitle?: string;
  products?: Product[];
}) {
  return (
    <section className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-3xl font-bold leading-tight text-forest sm:text-4xl lg:text-5xl">{title}</h2>
        <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">{subtitle}</p>
      </div>

      <ul className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-3">
        {benefits.map(({ icon, fallbackIcon, title: heading, description }) => (
          <li
            key={heading}
            className="flex items-start gap-4 rounded-2xl border border-border/70 bg-background p-5 transition-shadow hover:shadow-md sm:p-6"
          >
            <LottieIcon
              src={icon}
              fallback={fallbackIcon}
              alt={heading}
              className="mt-0.5 size-12 shrink-0 object-contain sm:size-14"
            />
            <div>
              <h3 className="text-base font-semibold text-forest sm:text-lg">{heading}</h3>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{description}</p>
            </div>
          </li>
        ))}
      </ul>

      {products.length > 0 && (
        <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
