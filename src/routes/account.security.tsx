import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, LogOut, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { authApi } from "@/api/services";
import { AccountShell } from "@/components/account/account-shell";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeApiError } from "@/lib/api";

export const Route = createFileRoute("/account/security")({
  head: () => ({
    meta: [
      { title: "Security | MyGarden" },
      { name: "description", content: "Change your password and sign out." },
      { property: "og:title", content: "Security | MyGarden" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Security,
});

const MIN = 6;

function Security() {
  const { user, logout } = useAuth();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ current: "", next: "", confirm: "" });

  const set = (key: keyof typeof form) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.next.length < MIN) {
      toast.error(`Your new password needs at least ${MIN} characters`);
      return;
    }
    if (form.next !== form.confirm) {
      toast.error("The two new passwords don't match");
      return;
    }
    setBusy(true);
    try {
      const result = await authApi.changePassword(form.current, form.next);
      setForm({ current: "", next: "", confirm: "" });
      toast.success(result.had_password ? "Password changed" : "Password set");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AccountShell title="Security" description="Keep your account yours.">
      <div className="surface-card p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-forest">
          <KeyRound className="size-4 text-primary" aria-hidden="true" /> Change password
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Signed in with Google or a phone number? Leave the current password blank to set one for the first time.
        </p>

        <form onSubmit={submit} className="mt-5 grid gap-4 sm:max-w-md">
          <div>
            <Label htmlFor="current">Current password</Label>
            <Input
              id="current"
              type={show ? "text" : "password"}
              value={form.current}
              onChange={(e) => set("current")(e.target.value)}
              autoComplete="current-password"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="next">New password</Label>
            <div className="relative mt-2">
              <Input
                id="next"
                type={show ? "text" : "password"}
                value={form.next}
                onChange={(e) => set("next")(e.target.value)}
                autoComplete="new-password"
                className="pr-11"
              />
              <button
                type="button"
                onClick={() => setShow((v) => !v)}
                aria-label={show ? "Hide passwords" : "Show passwords"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-forest"
              >
                {show ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-muted-foreground">At least {MIN} characters.</p>
          </div>
          <div>
            <Label htmlFor="confirm">Confirm new password</Label>
            <Input
              id="confirm"
              type={show ? "text" : "password"}
              value={form.confirm}
              onChange={(e) => set("confirm")(e.target.value)}
              autoComplete="new-password"
              className="mt-2"
            />
          </div>
          <Button type="submit" disabled={busy} className="h-11 w-fit rounded-full px-8">
            {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
            {busy ? "Saving…" : "Update password"}
          </Button>
        </form>
      </div>

      <div className="surface-card mt-4 p-5 sm:p-6">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-forest">
          <ShieldCheck className="size-4 text-primary" aria-hidden="true" /> This device
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Signed in as <strong className="text-forest">{user?.email}</strong>. Signing out clears this browser only.
        </p>
        <Button variant="outline" onClick={logout} className="mt-4 h-11 rounded-full px-7">
          <LogOut className="size-4" aria-hidden="true" /> Sign out
        </Button>
      </div>
    </AccountShell>
  );
}
