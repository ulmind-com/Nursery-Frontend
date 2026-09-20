import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, PolicySection } from "@/components/shared/policy-page";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Plant Nursery" },
      { name: "description", content: "The terms that apply when you shop with the nursery." },
      { property: "og:title", content: "Terms of Service | Plant Nursery" },
      { property: "og:description", content: "The terms that apply when you shop with us." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PolicyPage eyebrow="Legal" title="Terms of service" intro="By placing an order you agree to the terms below.">
      <PolicySection title="Orders and pricing">
        <p>Prices, taxes, delivery charges, and payment options shown at checkout are confirmed by the nursery at the time of order and are final.</p>
      </PolicySection>
      <PolicySection title="Availability">
        <p>Plants are living stock. If an item becomes unavailable after you order, we will contact you with a replacement or a refund.</p>
      </PolicySection>
      <PolicySection title="Plant variation">
        <p>Photographs are representative. Leaf shape, height, and colour vary naturally between individual plants.</p>
      </PolicySection>
      <PolicySection title="Accounts">
        <p>Keep your account credentials confidential. You are responsible for activity carried out through your account.</p>
      </PolicySection>
    </PolicyPage>
  );
}
