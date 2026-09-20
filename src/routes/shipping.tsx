import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { queryKeys, settingsApi } from "@/api/services";
import { PolicyPage, PolicySection } from "@/components/shared/policy-page";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Shipping & Delivery | Plant Nursery" },
      { name: "description", content: "How plants are packed, dispatched, and delivered, including delivery charges." },
      { property: "og:title", content: "Shipping & Delivery | Plant Nursery" },
      { property: "og:description", content: "Packing, dispatch, and delivery details for nursery orders." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: settings } = useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get, staleTime: 300_000 });
  const freeAbove = settings?.delivery?.free_above;
  return (
    <PolicyPage eyebrow="Delivery" title="Shipping & delivery" intro="Every plant is packed by hand so it travels upright, hydrated, and protected.">
      <PolicySection title="Delivery charges">
        <p>
          {typeof freeAbove === "number"
            ? `Delivery is free on orders above ${settings?.currency ?? "₹"}${freeAbove.toLocaleString("en-IN")}. Below that, the exact delivery charge for your pincode is calculated and shown at checkout before you pay.`
            : "The exact delivery charge for your pincode is calculated and shown at checkout before you pay."}
        </p>
      </PolicySection>
      <PolicySection title="Dispatch time">
        <p>Orders are prepared at the nursery and dispatched once the plants are inspected. You will receive tracking details on your order page as soon as the shipment is handed over.</p>
      </PolicySection>
      <PolicySection title="On arrival">
        <p>Unbox your plant the same day, remove packing material gently, and place it in indirect light for a few days before moving it to its final spot.</p>
      </PolicySection>
    </PolicyPage>
  );
}
