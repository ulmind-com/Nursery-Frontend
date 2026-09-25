import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { authApi, uploadApi } from "@/api/services";
import { AccountShell, Avatar } from "@/components/account/account-shell";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { normalizeApiError } from "@/lib/api";

export const Route = createFileRoute("/account/profile")({
  head: () => ({
    meta: [
      { title: "Profile | MyGarden" },
      { name: "description", content: "Update your name, photo and phone number." },
      { property: "og:title", content: "Profile | MyGarden" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Profile,
});

const MAX_MB = 5;

function Profile() {
  const { user, refreshUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const pickPhoto = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Pick an image file");
      return;
    }
    if (file.size > MAX_MB * 1024 * 1024) {
      toast.error(`Photos need to be under ${MAX_MB}MB`);
      return;
    }
    setUploading(true);
    try {
      const { url } = await uploadApi.userImage(file);
      await authApi.update({ avatar: url });
      await refreshUser();
      toast.success("Photo updated");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removePhoto = async () => {
    setUploading(true);
    try {
      /* The API reads "" as "clear it" — null would be ignored as "unchanged". */
      await authApi.update({ avatar: "" });
      await refreshUser();
      toast.success("Photo removed");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setUploading(false);
    }
  };

  const save = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const phone = String(form.get("phone") ?? "").trim();

    if (!name) {
      toast.error("Your name can't be empty");
      return;
    }
    if (phone && !/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10))) {
      toast.error("Enter a valid 10-digit Indian mobile number");
      return;
    }

    setSaving(true);
    try {
      await authApi.update({ name, phone });
      await refreshUser();
      toast.success("Profile saved");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AccountShell title="Profile" description="How we address you, and how we reach you about a delivery.">
      <div className="surface-card p-5 sm:p-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <div className="relative">
            <Avatar src={user?.avatar} name={user?.name} size={96} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              aria-label="Change profile photo"
              className="absolute -bottom-1 -right-1 grid size-9 place-items-center rounded-full bg-forest text-forest-foreground shadow-lg transition hover:bg-primary disabled:opacity-70"
            >
              {uploading ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Camera className="size-4" aria-hidden="true" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => void pickPhoto(event.target.files?.[0])}
            />
          </div>

          <div className="text-center sm:text-left">
            <p className="font-display text-xl font-bold text-forest">{user?.name}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <Button type="button" variant="outline" size="sm" className="rounded-full" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {user?.avatar ? "Change photo" : "Add photo"}
              </Button>
              {user?.avatar && (
                <Button type="button" variant="ghost" size="sm" className="rounded-full text-muted-foreground hover:text-destructive" onClick={removePhoto} disabled={uploading}>
                  <Trash2 className="size-3.5" aria-hidden="true" /> Remove
                </Button>
              )}
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">JPG or PNG, up to {MAX_MB}MB.</p>
          </div>
        </div>

        <form onSubmit={save} className="mt-7 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" name="name" defaultValue={user?.name} autoComplete="name" className="mt-2" />
          </div>
          <div>
            <Label htmlFor="phone">Mobile number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              defaultValue={user?.phone ?? ""}
              placeholder="9876543210"
              autoComplete="tel"
              className="mt-2"
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground">Used only for delivery updates.</p>
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email ?? ""} disabled className="mt-2" />
            <p className="mt-1.5 text-[11px] text-muted-foreground">
              Your email is your sign-in — contact support to change it.
            </p>
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={saving} className="h-11 rounded-full px-8">
              {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </div>
    </AccountShell>
  );
}
