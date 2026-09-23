import { createFileRoute } from "@tanstack/react-router";
import { AuthCard } from "@/components/auth/auth-card";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create Account | Plant Nursery" },
      { name: "description", content: "Create an account for saved plants and easier checkout." },
      { property: "og:title", content: "Create Account | Plant Nursery" },
      { property: "og:description", content: "Join Plant Nursery." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => <AuthCard initialMode="register" />,
});
