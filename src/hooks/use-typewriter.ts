import { useEffect, useState } from "react";

/**
 * Types a phrase out one character at a time, holds it, erases it and moves to
 * the next — the rotating placeholder used in the search bars.
 *
 * Returns the first phrase unchanged when the visitor prefers reduced motion,
 * so the field still reads as a normal placeholder.
 */
export function useTypewriter(
  phrases: string[],
  { typeMs = 85, eraseMs = 40, holdMs = 1500, gapMs = 350 } = {},
) {
  const [text, setText] = useState(phrases[0] ?? "");

  useEffect(() => {
    if (phrases.length === 0) return;
    const still =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (still || phrases.length === 1) {
      setText(phrases[0] ?? "");
      return;
    }

    let phrase = 0;
    let char = 0;
    let erasing = false;
    let timer = 0;

    const tick = () => {
      const current = phrases[phrase] ?? "";
      if (!erasing) {
        char += 1;
        setText(current.slice(0, char));
        if (char >= current.length) {
          erasing = true;
          timer = window.setTimeout(tick, holdMs);
          return;
        }
        timer = window.setTimeout(tick, typeMs);
        return;
      }
      char -= 1;
      setText(current.slice(0, Math.max(0, char)));
      if (char <= 0) {
        erasing = false;
        phrase = (phrase + 1) % phrases.length;
        timer = window.setTimeout(tick, gapMs);
        return;
      }
      timer = window.setTimeout(tick, eraseMs);
    };

    setText("");
    timer = window.setTimeout(tick, gapMs);
    return () => window.clearTimeout(timer);
  }, [phrases, typeMs, eraseMs, holdMs, gapMs]);

  return text;
}
