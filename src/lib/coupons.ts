import type { Coupon } from "@/types/api";

/** Coupons come straight from the admin panel, so every field is optional —
 *  these helpers give the UI one shape to render from. */

export const inr = (value: number) => `₹${Math.round(value).toLocaleString("en-IN")}`;

/** Minimum cart value that unlocks the coupon (0 = always usable). */
export const couponMinOrder = (coupon: Coupon) => coupon.min_order ?? 0;

/** Short badge shown on the coupon card: "10% OFF", "₹200 OFF", "FREE SHIPPING". */
export function couponBadge(coupon: Coupon) {
  const value = coupon.value ?? 0;
  if (value > 0) return coupon.type === "flat" ? `${inr(value)} OFF` : `${value}% OFF`;
  if (coupon.free_shipping) return "FREE SHIPPING";
  return "OFFER";
}

/** Headline for the coupon card. */
export function couponTitle(coupon: Coupon) {
  const value = coupon.value ?? 0;
  if (value > 0) return coupon.type === "flat" ? `Flat ${inr(value)} off` : `Get ${value}% off`;
  if (coupon.free_shipping) return "Free shipping";
  return coupon.code;
}

/** Fallback description when the admin left the description empty. */
export function couponSubtitle(coupon: Coupon) {
  if (coupon.description) return coupon.description;
  const min = couponMinOrder(coupon);
  const parts: string[] = [];
  if (min > 0) parts.push(`on orders above ${inr(min)}`);
  if (coupon.max_discount) parts.push(`up to ${inr(coupon.max_discount)} off`);
  return parts.length ? `Applies ${parts.join(", ")}.` : "Applies to every order.";
}

/** Extra conditions rendered as small pills under the description. */
export function couponTerms(coupon: Coupon) {
  const terms: string[] = [];
  const min = couponMinOrder(coupon);
  terms.push(min > 0 ? `Min. order ${inr(min)}` : "No minimum order");
  if (coupon.max_discount) terms.push(`Max ${inr(coupon.max_discount)} off`);
  if (coupon.free_shipping) terms.push("Free delivery");
  if (coupon.first_order_only) terms.push("First order only");
  if (coupon.valid_until) {
    const until = new Date(coupon.valid_until);
    if (!Number.isNaN(until.getTime()))
      terms.push(`Till ${until.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`);
  }
  return terms;
}

/** A coupon with no code to type (pure free shipping / auto rule) applies itself. */
export const isAutoApplied = (coupon: Coupon) => !coupon.value && Boolean(coupon.free_shipping);
