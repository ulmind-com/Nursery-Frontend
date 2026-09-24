import { cutout } from "@/lib/cutout";

/**
 * The "add to cart" flight: the product photo lifts off the card, loses its
 * background mid-air and arcs into the cart icon, which bounces on landing.
 *
 * Pure DOM + Web Animations API so it survives React re-renders and never
 * blocks the cart update.
 */

const FLIGHT_MS = 780;
const CUTOUT_RACE_MS = 220; // how long we wait for a cutout before taking off

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** The cart button currently on screen (header on desktop, tab bar on mobile). */
function cartTarget(): HTMLElement | null {
  const candidates = Array.from(
    document.querySelectorAll<HTMLElement>("[data-cart-target]"),
  ).filter((node) => {
    const rect = node.getBoundingClientRect();
    return (
      rect.width > 0 &&
      rect.height > 0 &&
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      getComputedStyle(node).visibility !== "hidden"
    );
  });
  return candidates[candidates.length - 1] ?? null;
}

export function bumpCart() {
  const target = cartTarget();
  if (!target || reducedMotion()) return;
  target.animate(
    [
      { transform: "scale(1)" },
      { transform: "scale(1.32) rotate(-7deg)", offset: 0.35 },
      { transform: "scale(0.94) rotate(3deg)", offset: 0.65 },
      { transform: "scale(1)" },
    ],
    { duration: 520, easing: "cubic-bezier(.34,1.56,.64,1)" },
  );
}

const timeout = (ms: number) =>
  new Promise<null>((resolve) => window.setTimeout(resolve, ms, null));

/**
 * @param image   product photo to fly (the one already rendered in the card)
 * @param origin  where it starts — usually the card image's bounding rect
 */
export async function flyToCart(image: string | undefined, origin: DOMRect | undefined) {
  const target = cartTarget();
  if (!image || !origin || !target || reducedMotion() || origin.width < 1) {
    bumpCart();
    return;
  }

  // Give the cutout a short head start; if it isn't ready we take off with the
  // original photo and swap it in mid-flight.
  const pending = cutout(image);
  const early = await Promise.race([pending, timeout(CUTOUT_RACE_MS)]);

  const size = Math.min(170, Math.max(96, origin.width * 0.62));
  const startX = origin.left + origin.width / 2;
  const startY = origin.top + origin.height / 2;
  const endRect = target.getBoundingClientRect();
  const endX = endRect.left + endRect.width / 2;
  const endY = endRect.top + endRect.height / 2;

  // Outer element carries the horizontal travel, inner the vertical drop — two
  // eases on two axes is what makes the path read as an arc.
  const outer = document.createElement("div");
  outer.setAttribute("aria-hidden", "true");
  outer.style.cssText = `position:fixed;left:${startX - size / 2}px;top:${startY - size / 2}px;width:${size}px;height:${size}px;z-index:9999;pointer-events:none;will-change:transform;`;

  const inner = document.createElement("div");
  inner.style.cssText =
    "width:100%;height:100%;will-change:transform,opacity;transform-origin:50% 50%;";

  const shot = document.createElement("div");
  const paint = (src: string, cut: boolean) => {
    shot.style.cssText = cut
      ? `width:100%;height:100%;background:center/contain no-repeat url("${src}");filter:drop-shadow(0 18px 22px rgba(15,60,40,.28));`
      : `width:100%;height:100%;border-radius:50%;overflow:hidden;background:center/cover no-repeat url("${src}");box-shadow:0 18px 30px -10px rgba(15,60,40,.45);`;
  };
  paint(early ?? image, Boolean(early));

  inner.appendChild(shot);
  outer.appendChild(inner);
  document.body.appendChild(outer);

  if (!early) {
    // Swap to the cutout the moment it lands, while the photo is still in the air.
    void pending.then((late) => {
      if (late && outer.isConnected) paint(late, true);
    });
  }

  const horizontal = outer.animate(
    [{ transform: "translateX(0)" }, { transform: `translateX(${endX - startX}px)` }],
    { duration: FLIGHT_MS, easing: "cubic-bezier(.36,.04,.56,.72)", fill: "forwards" },
  );

  inner.animate(
    [
      { transform: "translateY(0) scale(1) rotate(0deg)", opacity: 1, offset: 0 },
      {
        transform: `translateY(${(endY - startY) * 0.26}px) scale(1.08) rotate(-8deg)`,
        opacity: 1,
        offset: 0.22,
      },
      {
        transform: `translateY(${(endY - startY) * 0.72}px) scale(.62) rotate(6deg)`,
        opacity: 0.95,
        offset: 0.68,
      },
      {
        transform: `translateY(${endY - startY}px) scale(.16) rotate(14deg)`,
        opacity: 0.25,
        offset: 1,
      },
    ],
    { duration: FLIGHT_MS, easing: "cubic-bezier(.55,.06,.68,.19)", fill: "forwards" },
  );

  try {
    await horizontal.finished;
  } catch {
    /* animation cancelled — clean up below regardless */
  }
  outer.remove();
  bumpCart();
}
