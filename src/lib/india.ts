/* Shared between checkout and the account's address book, so the two screens
   can never drift into offering different states. */

export const INDIAN_STATES = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

/** Nominatim's state name vs. our list: exact match first, then a loose one so
 *  "NCT of Delhi" still lands on "Delhi". */
export function matchState(name: string): string | null {
  const wanted = name.trim().toLowerCase();
  if (!wanted) return null;
  const exact = INDIAN_STATES.find((state) => state.toLowerCase() === wanted);
  if (exact) return exact;
  return (
    INDIAN_STATES.find((state) => {
      const option = state.toLowerCase();
      return wanted.includes(option) || option.includes(wanted);
    }) ?? null
  );
}
