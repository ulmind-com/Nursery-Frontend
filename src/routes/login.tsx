import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth/auth-card";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In | MyGarden" },
      { name: "description", content: "Sign in to manage your orders, addresses, and wishlist." },
      { property: "og:title", content: "Sign In | MyGarden" },
      { property: "og:description", content: "Access your MyGarden account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <AuthCard initialMode="login" />,
});
