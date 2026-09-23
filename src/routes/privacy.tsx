import { createFileRoute } from "@tanstack/react-router";
import { PolicyPage, PolicySection } from "@/components/shared/policy-page";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | MyGarden" },
      { name: "description", content: "How the nursery collects, uses, and protects your personal information." },
      { property: "og:title", content: "Privacy Policy | MyGarden" },
      { property: "og:description", content: "How we handle your personal information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  return (
    <PolicyPage eyebrow="Legal" title="Privacy policy" intro="We collect only what is needed to take your order, deliver it, and support you afterwards.">
      <PolicySection title="What we collect">
        <p>Your name, contact details, and delivery address, along with your order and support history.</p>
      </PolicySection>
      <PolicySection title="How it is used">
        <p>To process orders, arrange delivery, respond to support requests, and send order updates. We do not sell your information.</p>
      </PolicySection>
      <PolicySection title="Payments">
        <p>Card and UPI details are handled entirely by our payment provider. We never see or store your full payment credentials.</p>
      </PolicySection>
      <PolicySection title="Your choices">
        <p>You can view and update your profile and addresses in your account at any time, or contact support to request deletion.</p>
      </PolicySection>
    </PolicyPage>
  );
}
