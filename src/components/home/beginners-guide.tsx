/* "A Beginners Guide" — the care-basics band that sits under the recommended
   rail: a potted plant in the middle, four care notes arrowed in from either
   side, and a fifth note below. Artwork lives in public/Beginner Guid Section. */

const ART_DIR = "/Beginner%20Guid%20Section";

export interface BeginnerGuideTip {
  id: string;
  text: string;
}

const defaultLeftTips: BeginnerGuideTip[] = [
  { id: "care-guidance", text: "Receive Clear care guidance with every order" },
  { id: "compost", text: "Feed regularly with organic compost" },
];

const defaultRightTips: BeginnerGuideTip[] = [
  { id: "wipe", text: "Wipe leaves gently with a damp cloth" },
  { id: "soil", text: "Use well-drained soil and the right pot" },
];

/* One flat arrow, drawn once and mirrored for the right-hand column. */
function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 140 16"
      className={`hidden h-4 shrink-0 text-[#0f7a5a] lg:block lg:w-[124px] ${flip ? "rotate-180" : ""}`}
      fill="none"
    >
      <path d="M0 8h126" stroke="currentColor" strokeWidth="2" />
      <path d="M126 2l12 6-12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Tip({ tip, side }: { tip: BeginnerGuideTip; side: "left" | "right" }) {
  return (
    <li className="flex items-center gap-3 lg:gap-5">
      {side === "right" ? <Arrow flip /> : null}
      <p className="flex-1 text-base font-medium leading-7 text-[#12100e] sm:text-lg lg:text-xl lg:leading-8">{tip.text}</p>
      {side === "left" ? <Arrow /> : null}
    </li>
  );
}

export function BeginnersGuideSection({
  title = "A Beginners Guide",
  leftTips = defaultLeftTips,
  rightTips = defaultRightTips,
  bottomTip = "Water only when the top soil feels dry",
  image = `${ART_DIR}/tree.png`,
}: {
  title?: string;
  leftTips?: BeginnerGuideTip[];
  rightTips?: BeginnerGuideTip[];
  bottomTip?: string;
  image?: string;
}) {
  return (
    <section className="relative overflow-hidden bg-[#faf7ef] py-10 lg:py-12">
      {/* Decorative foliage — purely ornamental, so it never takes pointer events. */}
      <img
        src={`${ART_DIR}/top leaves image.png`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute -left-8 top-0 w-28 select-none opacity-90 sm:w-56 lg:-left-6 lg:w-80"
      />
      <img
        src={`${ART_DIR}/bottom leaves image.png`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute -right-8 -bottom-2 w-28 select-none opacity-90 sm:w-56 lg:-right-6 lg:w-80"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-3xl font-bold leading-tight text-[#12100e] sm:text-4xl lg:text-5xl">{title}</h2>

        <div className="mt-6 grid items-center gap-6 lg:mt-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,300px)_minmax(0,1fr)] lg:gap-6">
          <ul className="order-2 flex flex-col gap-8 lg:order-1 lg:gap-24">
            {leftTips.map((tip) => (
              <Tip key={tip.id} tip={tip} side="left" />
            ))}
          </ul>

          <div className="order-1 mx-auto w-full max-w-[240px] lg:order-2 lg:max-w-none">
            <img
              src={image}
              alt="Potted indoor plant in a white ceramic pot"
              loading="lazy"
              className="mx-auto h-auto w-full object-contain"
            />
          </div>

          <ul className="order-3 flex flex-col gap-8 lg:gap-24">
            {rightTips.map((tip) => (
              <Tip key={tip.id} tip={tip} side="right" />
            ))}
          </ul>
        </div>

        <p className="mt-6 text-center text-base font-medium leading-7 text-[#12100e] sm:text-lg lg:-mt-2 lg:text-xl">{bottomTip}</p>
      </div>
    </section>
  );
}
