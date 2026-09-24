/* "About Self-Watering Planters" — explainer band with a cutaway hero shot
   and a three-step "How it works" row. Artwork lives in public/Watering Planters. */

const ART_DIR = "/Watering%20Planters";

export interface SelfWateringStep {
  id: string;
  image: string;
  caption: string;
}

const defaultSteps: SelfWateringStep[] = [
  { id: "fill", image: `${ART_DIR}/1.png`, caption: "Fill the Water Reservoir" },
  { id: "wick", image: `${ART_DIR}/2.png`, caption: "Water reaches the soil as needed" },
  { id: "grow", image: `${ART_DIR}/3.png`, caption: "Healthy and Happy Plant" },
];

export function SelfWateringSection({
  title = "About Self-Watering Planters",
  description = "Self-watering planters provide consistent moisture, prevent overwatering, and simplify care for healthy plant growth.",
  image = `${ART_DIR}/care_plant.png`,
  steps = defaultSteps,
}: {
  title?: string;
  description?: string;
  image?: string;
  steps?: SelfWateringStep[];
}) {
  return (
    <section className="bg-[radial-gradient(120%_120%_at_20%_0%,#127a8c_0%,#0b5560_55%,#08424c_100%)] py-14 lg:py-20">
      <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:px-10">
        <div className="mx-auto w-full max-w-[420px] overflow-hidden rounded-3xl bg-white shadow-2xl lg:max-w-none">
          <img
            src={image}
            alt="Cutaway of a self-watering planter showing the water reservoir feeding the roots"
            loading="lazy"
            className="aspect-square w-full object-cover"
          />
        </div>

        <div className="text-white">
          <h2 className="text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 max-w-lg text-sm leading-6 text-white/85 sm:text-base">{description}</p>

          <h3 className="mt-7 text-xl font-semibold sm:text-2xl">How it works</h3>
          <ol className="mt-9 grid max-w-[640px] grid-cols-3 gap-3 sm:gap-6">
            {steps.slice(0, 3).map((step, index) => (
              <li key={step.id} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -top-5 left-1/2 z-10 flex size-9 -translate-x-1/2 items-center justify-center rounded-full bg-[#c8794f] text-sm font-semibold text-white shadow-lg sm:size-11 sm:text-base"
                >
                  {index + 1}
                </span>
                <div className="overflow-hidden rounded-2xl bg-white shadow-lg">
                  <img
                    src={step.image}
                    alt={step.caption}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                </div>
                <p className="mt-3 text-center text-xs font-medium leading-5 text-white sm:text-sm">{step.caption}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
