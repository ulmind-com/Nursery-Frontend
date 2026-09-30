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

/* The arrow is supplied as artwork; the right-hand column mirrors it. */
function Arrow({ flip = false }: { flip?: boolean }) {
  return (
    <img
      src={`${ART_DIR}/arrow sign.png`}
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`hidden w-[150px] shrink-0 select-none lg:block ${flip ? "rotate-180" : ""}`}
    />
  );
}

function Tip({ tip, side }: { tip: BeginnerGuideTip; side: "left" | "right" }) {
  /* The arrow floats in the space between the note and the plant rather than
     hanging off the text, so both gaps stay even however the note wraps. */
  const arrow = (
    <span className="hidden flex-1 justify-center lg:flex">
      <Arrow flip={side === "right"} />
    </span>
  );
  return (
    <li className="flex items-center">
      {side === "right" ? arrow : null}
      <p className="w-full text-base font-medium leading-7 text-[#12100e] sm:text-lg lg:w-[340px] lg:flex-none lg:text-xl lg:leading-8">
        {tip.text}
      </p>
      {side === "left" ? arrow : null}
    </li>
  );
}

export function BeginnersGuideSection({
  title = "A Beginners Guide",
  leftTips = defaultLeftTips,
  rightTips = defaultRightTips,
  bottomTip = "Water when the top soil feels dry",
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
        className="pointer-events-none absolute left-0 top-0 w-24 select-none sm:w-36 lg:w-52"
      />
      <img
        src={`${ART_DIR}/bottom leaves image.png`}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute bottom-0 right-0 w-24 select-none sm:w-36 lg:w-52"
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
