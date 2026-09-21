import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
import { authApi } from "@/api/services";
import { useAuth } from "@/contexts/auth-context";
import { normalizeApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign In | Plant Nursery" },
      { name: "description", content: "Sign in to manage your orders, addresses, and wishlist." },
      { property: "og:title", content: "Sign In | Plant Nursery" },
      { property: "og:description", content: "Access your Plant Nursery account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { acceptAuth } = useAuth();
  const nav = useNavigate();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const f = new FormData(e.currentTarget);
    try {
      acceptAuth(
        await authApi.login({
          email: String(f.get("email")),
          password: String(f.get("password")),
        }),
      );
      toast.success("Welcome back");
      await nav({ to: "/account" });
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      acceptAuth(await authApi.firebase(idToken));
      toast.success("Welcome back!");
      await nav({ to: "/account" });
    } catch (err: any) {
      // User closed the popup — don't show an error for that
      if (err?.code === "auth/popup-closed-by-user") return;
      toast.error(normalizeApiError(err).message);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" note="Sign in to see your orders, saved plants, and addresses.">
      <form onSubmit={submit} className="space-y-5">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" required className="mt-2" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" required minLength={6} className="mt-2" />
        </div>
        <Button disabled={loading || googleLoading} className="w-full" size="lg">
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-border" />
        <span className="text-xs uppercase text-muted-foreground">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      {/* Google Sign-In */}
      <Button
        type="button"
        variant="outline"
        className="w-full gap-3"
        size="lg"
        disabled={loading || googleLoading}
        onClick={handleGoogleSignIn}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
          <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
        </svg>
        {googleLoading ? "Signing in..." : "Continue with Google"}
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link to="/signup" className="font-semibold text-primary">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}

export function AuthShell({
  title,
  note,
  children,
}: {
  title: string;
  note: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-5xl place-items-center px-6 py-14">
      <div className="w-full max-w-md">
        <p className="text-xs font-bold uppercase text-primary">Your nursery account</p>
        <h1 className="mt-2 font-display text-4xl">{title}</h1>
        <p className="mb-8 mt-3 text-sm leading-6 text-muted-foreground">{note}</p>
        {children}
      </div>
    </div>
  );
}
