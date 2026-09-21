import { createFileRoute, useNavigate } from "@tanstack/react-router";
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
import { AuthShell } from "./login";

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
  component: Signup,
});

function Signup() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { acceptAuth } = useAuth();
  const nav = useNavigate();

  async function run(job: () => Promise<void>) {
    setBusy(true);
    try {
      await job();
    } catch (e) {
      toast.error(normalizeApiError(e).message);
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogleSignIn() {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      acceptAuth(await authApi.firebase(idToken));
      toast.success("Account created!");
      await nav({ to: "/account" });
    } catch (err: any) {
      if (err?.code === "auth/popup-closed-by-user") return;
      toast.error(normalizeApiError(err).message);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <AuthShell
      title={step === 1 ? "Create your account" : step === 2 ? "Check your email" : "Tell us about you"}
      note={`Step ${step} of 3`}
    >
      {/* Progress bar */}
      <div className="mb-7 flex gap-2">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`h-1 flex-1 ${n <= step ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>

      {/* Step 1: Email */}
      {step === 1 && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void run(async () => {
                await authApi.requestOtp(email);
                setStep(2);
              });
            }}
          >
            <Label>Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="my-2"
            />
            <Button className="mt-4 w-full" disabled={busy || googleLoading}>
              Send verification code
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Google Sign-Up */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-3"
            size="lg"
            disabled={busy || googleLoading}
            onClick={handleGoogleSignIn}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
              <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
            </svg>
            {googleLoading ? "Signing up..." : "Continue with Google"}
          </Button>
        </>
      )}

      {/* Step 2: OTP verification */}
      {step === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const code = String(new FormData(e.currentTarget).get("code"));
            void run(async () => {
              const r = await authApi.verifyOtp(email, code);
              const signupToken = r.signup_token || r.token;
              if (!signupToken) throw new Error("Verification token missing");
              setToken(signupToken);
              setStep(3);
            });
          }}
        >
          <Label>6-digit code</Label>
          <Input
            name="code"
            inputMode="numeric"
            maxLength={6}
            autoFocus
            required
            className="my-2 text-center text-xl tracking-[.4em]"
          />
          <Button className="mt-4 w-full" disabled={busy}>
            Verify email
          </Button>
        </form>
      )}

      {/* Step 3: Profile details */}
      {step === 3 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            void run(async () => {
              acceptAuth(
                await authApi.register({
                  signup_token: token,
                  name: String(f.get("name")),
                  phone: String(f.get("phone")),
                  password: String(f.get("password")),
                }),
              );
              await nav({ to: "/account" });
            });
          }}
          className="space-y-4"
        >
          <Input name="name" placeholder="Full name" required />
          <Input name="phone" placeholder="Phone" required />
          <Input name="password" type="password" placeholder="Create password" minLength={6} required />
          <Button className="w-full" disabled={busy}>
            Create account
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
