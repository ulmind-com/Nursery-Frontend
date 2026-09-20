import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { queryKeys, settingsApi } from "@/api/services";
import { PolicyPage, PolicySection } from "@/components/shared/policy-page";

export const Route = createFileRoute("/returns")({
  head: () => ({
    meta: [
      { title: "Returns & Plant Guarantee | Plant Nursery" },
      { name: "description", content: "Returns, replacements, and the nursery plant guarantee." },
      { property: "og:title", content: "Returns & Plant Guarantee | Plant Nursery" },
      { property: "og:description", content: "Returns, replacements, and the nursery plant guarantee." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { data: settings } = useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get, staleTime: 300_000 });
  const guarantee = settings?.plant_guarantee;
  return (
    <PolicyPage eyebrow="After your order" title="Returns & plant guarantee" intro="Living things need a little grace. Here is how we handle plants that arrive unhappy.">
      {guarantee?.enabled && (
        <PolicySection title={guarantee.label || "Plant guarantee"}>
          <p>{guarantee.description || `If your plant does not settle in, reach out within ${guarantee.days ?? 30} days of delivery and our team will arrange a replacement or refund.`}</p>
        </PolicySection>
      )}
      <PolicySection title="Damaged on arrival">
        <p>Share photos of the plant and packaging on the day of delivery through your order page or support, and we will replace it.</p>
      </PolicySection>
      <PolicySection title="Non-plant items">
        <p>Planters, tools, and care products can be returned unused in their original packaging. Refunds are issued to the original payment method once the item reaches us.</p>
      </PolicySection>
    </PolicyPage>
  );
}
