/* The yellow promise bar under the category strip. Each badge plays a Lottie
   from the admin-supplied URL and falls back to a leaf while it loads. */

import { Leaf } from "lucide-react";
import { TrustLottie } from "@/components/home/trust-lottie";

export interface TrustStripItem {
  id?: string;
  lottie?: string;
  title?: string;
}

const defaultItems: TrustStripItem[] = [
  { id: "soil", lottie: "/lottie/soil.json", title: "90-Day Pre Fertilised Soil" },
  { id: "healthy", lottie: "/lottie/healthy.json", title: "Arrives Healthy" },
  { id: "replacement", lottie: "/lottie/replacement.json", title: "Free Replacement" },
  { id: "support", lottie: "/lottie/support.json", title: "Free Plant Care Support" },
];

export function TrustStrip({
  items = defaultItems,
  bgColor = "#facc15",
}: {
  items?: TrustStripItem[];
  bgColor?: string;
}) {
  const badges = items.filter((item) => item.title || item.lottie);
  if (badges.length === 0) return null;

  return (
    <div className="bg-storefront-wash px-3 pb-10 pt-6 sm:px-6 lg:px-9 lg:pb-12 lg:pt-8">
      <div
        className="mx-auto flex max-w-[1480px] flex-col items-center justify-between rounded-[2rem] px-6 py-5 shadow-sm sm:flex-row lg:px-10"
        style={{ backgroundColor: bgColor || "#facc15" }}
      >
        {badges.map((item, index) => (
          <div
            key={item.id ?? `${item.title}-${index}`}
            className={`flex w-full flex-1 flex-col items-center justify-center gap-3 py-4 text-center ${
              index < badges.length - 1 ? "sm:border-r sm:border-black/10" : ""
            }`}
          >
            <TrustLottie src={item.lottie || ""} icon={Leaf} label={item.title || ""} />
            <p className="text-sm font-semibold text-black">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
