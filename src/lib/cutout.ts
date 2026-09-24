/**
 * Client-side background removal for product photos.
 *
 * Catalogue shots sit on a plain studio backdrop, so a flood fill that starts
 * at the border and eats every pixel close to the backdrop colour gives a clean
 * cutout in a few milliseconds — no model, no network. Busy photos simply fail
 * the sanity check and the caller falls back to the original image.
 */

const MAX_SIDE = 260; // plenty for a 160px flying thumbnail
const TOLERANCE = 46; // per-channel distance from the sampled backdrop colour
const cache = new Map<string, Promise<string | null>>();

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("image load failed"));
    image.src = src;
  });
}

/** Average colour of the four borders — our best guess at the backdrop. */
function borderColour(data: Uint8ClampedArray, w: number, h: number) {
  let r = 0;
  let g = 0;
  let b = 0;
  let n = 0;
  const sample = (x: number, y: number) => {
    const i = (y * w + x) * 4;
    r += data[i] ?? 0;
    g += data[i + 1] ?? 0;
    b += data[i + 2] ?? 0;
    n += 1;
  };
  for (let x = 0; x < w; x += 1) {
    sample(x, 0);
    sample(x, h - 1);
  }
  for (let y = 0; y < h; y += 1) {
    sample(0, y);
    sample(w - 1, y);
  }
  return [r / n, g / n, b / n] as const;
}

/**
 * Remove the backdrop and return a PNG data URL, or null when the photo has no
 * separable background (busy scene, lifestyle shot, CORS-blocked image).
 */
export function cutout(src: string): Promise<string | null> {
  const cached = cache.get(src);
  if (cached) return cached;

  const job = (async () => {
    const image = await loadImage(src);
    const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
    const w = Math.max(1, Math.round(image.width * scale));
    const h = Math.max(1, Math.round(image.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(image, 0, 0, w, h);

    const frame = ctx.getImageData(0, 0, w, h); // throws if the image tainted the canvas
    const data = frame.data;
    const [br, bg, bb] = borderColour(data, w, h);

    // Flood fill inwards from every border pixel that still looks like backdrop.
    const seen = new Uint8Array(w * h);
    const stack: number[] = [];
    for (let x = 0; x < w; x += 1) {
      stack.push(x, x + (h - 1) * w);
    }
    for (let y = 0; y < h; y += 1) {
      stack.push(y * w, y * w + w - 1);
    }

    let cleared = 0;
    while (stack.length) {
      const p = stack.pop() as number;
      if (seen[p]) continue;
      seen[p] = 1;
      const i = p * 4;
      if (
        Math.abs((data[i] ?? 0) - br) > TOLERANCE ||
        Math.abs((data[i + 1] ?? 0) - bg) > TOLERANCE ||
        Math.abs((data[i + 2] ?? 0) - bb) > TOLERANCE
      )
        continue;
      data[i + 3] = 0;
      cleared += 1;
      const x = p % w;
      const y = (p - x) / w;
      if (x > 0) stack.push(p - 1);
      if (x < w - 1) stack.push(p + 1);
      if (y > 0) stack.push(p - w);
      if (y < h - 1) stack.push(p + w);
    }

    // Too little removed = no backdrop to speak of; too much = we ate the plant.
    const ratio = cleared / (w * h);
    if (ratio < 0.18 || ratio > 0.94) return null;

    // A real studio shot ends up with a free-floating subject. If the border is
    // still mostly opaque the photo is a scene (shelf, room, dark vignette) and
    // a half-cut rectangle looks worse than the untouched photo.
    let borderOpaque = 0;
    let borderTotal = 0;
    const edge = (x: number, y: number) => {
      borderTotal += 1;
      if ((data[(y * w + x) * 4 + 3] ?? 0) > 8) borderOpaque += 1;
    };
    for (let x = 0; x < w; x += 1) {
      edge(x, 0);
      edge(x, h - 1);
    }
    for (let y = 0; y < h; y += 1) {
      edge(0, y);
      edge(w - 1, y);
    }
    if (borderOpaque / borderTotal > 0.2) return null;

    // Soften the cut so the edge doesn't look stamped out.
    const alpha = new Uint8ClampedArray(w * h);
    for (let p = 0; p < w * h; p += 1) alpha[p] = data[p * 4 + 3] ?? 0;
    for (let y = 1; y < h - 1; y += 1) {
      for (let x = 1; x < w - 1; x += 1) {
        const p = y * w + x;
        if (!alpha[p]) continue;
        const ring =
          (alpha[p - 1] ?? 0) + (alpha[p + 1] ?? 0) + (alpha[p - w] ?? 0) + (alpha[p + w] ?? 0);
        if (ring < 1020) data[p * 4 + 3] = Math.round(ring / 4);
      }
    }

    ctx.putImageData(frame, 0, 0);
    return canvas.toDataURL("image/png");
  })().catch(() => null);

  cache.set(src, job);
  return job;
}
