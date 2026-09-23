import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { signInWithPopup } from "firebase/auth";
import { Eye, EyeOff, Leaf, Loader2, ShieldCheck, Sprout, Truck } from "lucide-react";
import { auth, googleProvider } from "@/lib/firebase";
import { authApi } from "@/api/services";
import { useAuth } from "@/contexts/auth-context";
import { normalizeApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/* Plants (in their pots) that drift behind the hero copy. */
const SLIDES = [
  "/images/sample-peace-lily.jpg",
  "/images/sample-snake-plant.jpg",
  "/images/sample-money-plant.jpg",
];

const PERKS = [
  { icon: Sprout, label: "Nursery-fresh plants" },
  { icon: Truck, label: "Safe root-ball delivery" },
  { icon: ShieldCheck, label: "15-day green promise" },
];

function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853" />
      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

function PasswordField({
  name,
  label,
  placeholder = "••••••••",
  autoComplete,
}: {
  name: string;
  label: string;
  placeholder?: string;
  autoComplete?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <Label htmlFor={name} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </Label>
      <div className="relative mt-1.5">
        <Input
          id={name}
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={6}
          required
          className="h-11 rounded-xl border-border/70 bg-secondary/40 pr-11 transition focus-visible:bg-white"
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute right-1 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}

function TextField({
  name,
  label,
  type = "text",
  placeholder,
  autoComplete,
  ...rest
}: React.ComponentProps<typeof Input> & { name: string; label: string }) {
  return (
    <div>
      <Label htmlFor={name} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </Label>
      <Input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        className="mt-1.5 h-11 rounded-xl border-border/70 bg-secondary/40 transition focus-visible:bg-white"
        {...rest}
      />
    </div>
  );
}

function Divider() {
  return (
    <div className="my-5 flex items-center gap-3">
      <span className="h-px flex-1 bg-border" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">or</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}

function PaneHeader({ eyebrow, title, note }: { eyebrow: string; title: string; note: string }) {
  return (
    <div className="mb-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">{eyebrow}</p>
      <h1 className="mt-2 font-display text-[1.75rem] font-extrabold leading-tight text-forest">{title}</h1>
      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{note}</p>
    </div>
  );
}

function Hero({
  variant,
  title,
  text,
  buttonLabel,
  onSwitch,
}: {
  variant: "login" | "register";
  title: string;
  text: string;
  buttonLabel: string;
  onSwitch: () => void;
}) {
  return (
    <div className={`auth-hero is-${variant} flex flex-col items-center justify-center gap-4 px-9 text-center text-white`}>
      <span className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm">
        <Leaf className="size-3.5" />
        Plant Nursery
      </span>
      <h2 className="font-display text-[2.1rem] font-extrabold leading-[1.1] drop-shadow-sm sm:text-[2.4rem]">{title}</h2>
      <p className="max-w-[22rem] text-sm leading-6 text-white/85">{text}</p>
      <button type="button" className="auth-switch mt-1" onClick={onSwitch}>
        {buttonLabel}
      </button>
      <ul className="mt-3 hidden w-full max-w-[19rem] flex-col gap-2 text-left text-[13px] text-white/85 sm:flex">
        {PERKS.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-2.5">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-white/15">
              <Icon className="size-3.5" />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AuthCard({ initialMode = "login" }: { initialMode?: "login" | "register" }) {
  const [isRegister, setIsRegister] = useState(initialMode === "register");

  // Keep the address bar honest while the card slides, without remounting it.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const want = isRegister ? "/signup" : "/login";
    if (window.location.pathname !== want) window.history.replaceState(null, "", want);
  }, [isRegister]);

  return (
    <div className="auth-stage">
      <div className={`auth-card ${isRegister ? "is-register" : ""}`}>
        <div className="auth-visual" aria-hidden="true">
          {SLIDES.map((src) => (
            <div key={src} className="auth-slide" style={{ backgroundImage: `url("${src}")` }} />
          ))}
        </div>

        <Hero
          variant="register"
          title="Welcome back, grower"
          text="Your saved plants, orders and addresses are waiting right where you left them."
          buttonLabel="Login"
          onSwitch={() => setIsRegister(false)}
        />
        <RegisterPane onDone={() => setIsRegister(false)} />

        <Hero
          variant="login"
          title="Begin your green journey"
          text="Create an account to track orders, save plants you love and get care reminders."
          buttonLabel="Sign Up"
          onSwitch={() => setIsRegister(true)}
        />
        <LoginPane />
      </div>
    </div>
  );
}

function useGoogle(successNote: string) {
  const [googleLoading, setGoogleLoading] = useState(false);
  const { acceptAuth } = useAuth();
  const nav = useNavigate();

  async function signIn() {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      acceptAuth(await authApi.firebase(idToken));
      toast.success(successNote);
      await nav({ to: "/account" });
    } catch (err: any) {
      // User closed the popup — don't show an error for that
      if (err?.code === "auth/popup-closed-by-user") return;
      toast.error(normalizeApiError(err).message);
    } finally {
      setGoogleLoading(false);
    }
  }

  return { googleLoading, signIn };
}

function LoginPane() {
  const [loading, setLoading] = useState(false);
  const { googleLoading, signIn } = useGoogle("Welcome back");
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

  const busy = loading || googleLoading;

  return (
    <div className="auth-pane is-login overflow-y-auto px-8 py-9 sm:px-11">
      <PaneHeader eyebrow="Your nursery account" title="Sign in" note="Pick up your cart, orders and saved plants." />

      <form onSubmit={submit} className="space-y-4">
        <TextField name="email" label="Email" type="email" placeholder="you@example.com" autoComplete="email" />
        <PasswordField name="password" label="Password" autoComplete="current-password" />

        <div className="flex items-center justify-between pt-0.5">
          <label className="flex cursor-pointer items-center gap-2 text-[13px] text-muted-foreground">
            <input type="checkbox" name="remember" defaultChecked className="size-4 accent-[var(--primary)]" />
            Keep me signed in
          </label>
          <Link to="/support" className="text-[13px] font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button disabled={busy} size="lg" className="h-11 w-full rounded-xl text-[15px] font-semibold shadow-sm">
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Signing in..." : "Sign in"}
        </Button>
      </form>

      <Divider />

      <Button
        type="button"
        variant="outline"
        size="lg"
        disabled={busy}
        onClick={signIn}
        className="h-11 w-full gap-3 rounded-xl border-border/70 font-medium"
      >
        <GoogleMark />
        {googleLoading ? "Signing in..." : "Continue with Google"}
      </Button>

      <p className="mt-6 text-center text-[13px] text-muted-foreground">
        By continuing you agree to our{" "}
        <Link to="/terms" className="font-semibold text-forest hover:underline">
          terms
        </Link>{" "}
        &{" "}
        <Link to="/privacy" className="font-semibold text-forest hover:underline">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}

function RegisterPane({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const { googleLoading, signIn } = useGoogle("Account created!");
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

  const disabled = busy || googleLoading;

  return (
    <div className="auth-pane is-register overflow-y-auto px-8 py-9 sm:px-11">
      <PaneHeader
        eyebrow={`Step ${step} of 3`}
        title={step === 1 ? "Create account" : step === 2 ? "Check your email" : "Almost there"}
        note={
          step === 1
            ? "One account for orders, wishlist and plant care tips."
            : step === 2
              ? `We sent a 6-digit code to ${email}.`
              : "Set a password and tell us who's growing."
        }
      />

      <div className="mb-6 flex gap-1.5">
        {[1, 2, 3].map((n) => (
          <span
            key={n}
            className={`h-1.5 flex-1 rounded-full transition-colors duration-500 ${n <= step ? "bg-primary" : "bg-muted"}`}
          />
        ))}
      </div>

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
            className="space-y-4"
          >
            <TextField
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button disabled={disabled} size="lg" className="h-11 w-full rounded-xl text-[15px] font-semibold shadow-sm">
              {busy ? <Loader2 className="size-4 animate-spin" /> : null}
              Send verification code
            </Button>
          </form>

          <Divider />

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={disabled}
            onClick={signIn}
            className="h-11 w-full gap-3 rounded-xl border-border/70 font-medium"
          >
            <GoogleMark />
            {googleLoading ? "Signing up..." : "Continue with Google"}
          </Button>

          <p className="mt-6 text-center text-[13px] text-muted-foreground">
            Already growing with us?{" "}
            <button type="button" onClick={onDone} className="font-semibold text-primary hover:underline">
              Sign in
            </button>
          </p>
        </>
      )}

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
          className="space-y-4"
        >
          <TextField
            name="code"
            label="6-digit code"
            inputMode="numeric"
            maxLength={6}
            autoFocus
            placeholder="······"
            className="mt-1.5 h-12 rounded-xl border-border/70 bg-secondary/40 text-center text-xl tracking-[.5em]"
          />
          <Button disabled={busy} size="lg" className="h-11 w-full rounded-xl text-[15px] font-semibold shadow-sm">
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            Verify email
          </Button>
          <div className="flex items-center justify-between text-[13px]">
            <button type="button" onClick={() => setStep(1)} className="font-semibold text-muted-foreground hover:text-foreground">
              Change email
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => void run(async () => { await authApi.requestOtp(email); toast.success("Code sent again"); })}
              className="font-semibold text-primary hover:underline"
            >
              Resend code
            </button>
          </div>
        </form>
      )}

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
              toast.success("Welcome to the nursery!");
              await nav({ to: "/account" });
            });
          }}
          className="space-y-4"
        >
          <TextField name="name" label="Full name" placeholder="Arnab Senapati" autoComplete="name" />
          <TextField name="phone" label="Phone" type="tel" placeholder="98765 43210" autoComplete="tel" />
          <PasswordField name="password" label="Create password" autoComplete="new-password" />
          <Button disabled={busy} size="lg" className="h-11 w-full rounded-xl text-[15px] font-semibold shadow-sm">
            {busy ? <Loader2 className="size-4 animate-spin" /> : null}
            Create account
          </Button>
        </form>
      )}
    </div>
  );
}
