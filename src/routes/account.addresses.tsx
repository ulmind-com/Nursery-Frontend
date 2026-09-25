import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Home, Loader2, LocateFixed, MapPin, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { authApi, settingsApi } from "@/api/services";
import { AccountShell } from "@/components/account/account-shell";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { INDIAN_STATES, matchState } from "@/lib/india";
import { normalizeApiError } from "@/lib/api";
import type { Address } from "@/types/api";

export const Route = createFileRoute("/account/addresses")({
  head: () => ({
    meta: [
      { title: "Addresses | MyGarden" },
      { name: "description", content: "Manage your saved delivery addresses." },
      { property: "og:title", content: "Addresses | MyGarden" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Addresses,
});

/** `is_default` rides along inside the stored address object. */
type SavedAddress = Address & { is_default?: boolean | undefined };

const TAGS = ["Home", "Work", "Other"] as const;

const blank: SavedAddress = {
  tag: "Home", name: "", house: "", area: "", city: "", state: "West Bengal", pincode: "", phone: "",
};

const isComplete = (a: SavedAddress) =>
  Boolean(a.name.trim() && a.house.trim() && a.city.trim() && a.state.trim()) &&
  /^[1-9][0-9]{5}$/.test(a.pincode.trim()) &&
  /^[6-9][0-9]{9}$/.test(a.phone.replace(/\D/g, "").slice(-10));

function Addresses() {
  const { user, refreshUser } = useAuth();
  const list: SavedAddress[] = (user?.addresses as SavedAddress[] | undefined) ?? [];

  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<SavedAddress>(blank);
  const [saving, setSaving] = useState(false);
  const [locating, setLocating] = useState(false);

  const set = (key: keyof SavedAddress) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  /* One writer for the whole book: the API stores addresses as an array on the
     account, so every change rewrites the list rather than patching one row. */
  const persist = async (next: SavedAddress[], message: string) => {
    setSaving(true);
    try {
      await authApi.update({ addresses: next });
      await refreshUser();
      toast.success(message);
      setOpen(false);
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setSaving(false);
    }
  };

  const startAdd = () => {
    setEditIndex(null);
    setForm({ ...blank, name: user?.name ?? "", phone: user?.phone ?? "" });
    setOpen(true);
  };

  const startEdit = (index: number) => {
    setEditIndex(index);
    setForm({ ...blank, ...list[index] });
    setOpen(true);
  };

  const save = async () => {
    if (!isComplete(form)) {
      toast.error("Fill in the name, address, city, a 6-digit PIN code and a valid mobile number");
      return;
    }
    const next = [...list];
    if (editIndex === null) next.push(form);
    else next[editIndex] = form;
    // The very first address saved is the default, with nothing to choose between.
    const only = next[0];
    if (next.length === 1 && only) next[0] = { ...only, is_default: true };
    await persist(next, editIndex === null ? "Address added" : "Address updated");
  };

  const remove = async (index: number) => {
    const next = list.filter((_, i) => i !== index);
    // Never leave the book without a default while addresses remain.
    const first = next[0];
    if (first && !next.some((a) => a.is_default)) next[0] = { ...first, is_default: true };
    await persist(next, "Address removed");
  };

  const makeDefault = async (index: number) =>
    persist(list.map((a, i) => ({ ...a, is_default: i === index })), "Default delivery address set");

  const useMyLocation = () => {
    if (!("geolocation" in navigator)) {
      toast.error("This browser can't share your location — please type the address.");
      return;
    }
    setLocating(true);

    const fill = async (position: GeolocationPosition) => {
      try {
        const found = await settingsApi.reverseGeocode(position.coords.latitude, position.coords.longitude);
        setForm((prev) => ({
          ...prev,
          house: found.address || prev.house,
          city: found.city || prev.city,
          state: matchState(found.state) ?? prev.state,
          pincode: /^[1-9][0-9]{5}$/.test(found.pincode) ? found.pincode : prev.pincode,
        }));
        toast.success("Filled from your location", { description: found.display_name });
      } catch (error) {
        toast.error(normalizeApiError(error).message);
      } finally {
        setLocating(false);
      }
    };

    const giveUp = () => {
      setLocating(false);
      toast.error("Couldn't get your location", { description: "Please type the address instead." });
    };

    /* High accuracy first; a desktop with Location Services off fails that
       outright, so fall back to the coarse network fix before giving up. */
    navigator.geolocation.getCurrentPosition(
      fill,
      (first) =>
        first.code === first.PERMISSION_DENIED
          ? giveUp()
          : navigator.geolocation.getCurrentPosition(fill, giveUp, { enableHighAccuracy: false, timeout: 20000, maximumAge: 600000 }),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    );
  };

  return (
    <AccountShell
      title="Addresses"
      description="Where your plants should arrive. The default is pre-filled at checkout."
      action={
        <Button onClick={startAdd} className="h-11 rounded-full px-6">
          <Plus className="size-4" aria-hidden="true" /> Add address
        </Button>
      }
    >
      {list.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <MapPin className="mx-auto size-8 text-primary" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-bold text-forest">No saved addresses yet</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
            Save one now and checkout becomes a two-tap affair.
          </p>
          <Button onClick={startAdd} className="mt-5 h-11 rounded-full px-7">
            <Plus className="size-4" aria-hidden="true" /> Add your first address
          </Button>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((address, index) => (
            <article
              key={`${address.pincode}-${index}`}
              className={`surface-card relative p-5 ${address.is_default ? "border-primary ring-1 ring-primary/30" : ""}`}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-tint px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-forest">
                  <Home className="size-3" aria-hidden="true" /> {address.tag || "Home"}
                </span>
                {address.is_default && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-primary">
                    <Star className="size-3 fill-primary" aria-hidden="true" /> Default
                  </span>
                )}
              </div>

              <p className="mt-3 text-sm font-bold text-forest">{address.name}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {address.house}
                {address.area ? `, ${address.area}` : ""}
                <br />
                {address.city}, {address.state} {address.pincode}
                <br />
                {address.phone}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => startEdit(index)}>
                  <Pencil className="size-3.5" aria-hidden="true" /> Edit
                </Button>
                {!address.is_default && (
                  <Button variant="ghost" size="sm" className="rounded-full text-primary" onClick={() => makeDefault(index)} disabled={saving}>
                    <Star className="size-3.5" aria-hidden="true" /> Set default
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-muted-foreground hover:text-destructive"
                  onClick={() => remove(index)}
                  disabled={saving}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" /> Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">
              {editIndex === null ? "Add address" : "Edit address"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="flex gap-2">
              {TAGS.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => set("tag")(tag)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    form.tag === tag
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-forest hover:border-primary/50"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            <Button type="button" variant="outline" className="h-11 w-full rounded-full sm:w-auto" onClick={useMyLocation} disabled={locating}>
              {locating ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : <LocateFixed className="size-4" aria-hidden="true" />}
              {locating ? "Finding your location…" : "Use my current location"}
            </Button>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="a-name">Full name</Label>
                <Input id="a-name" value={form.name} onChange={(e) => set("name")(e.target.value)} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="a-phone">Mobile number</Label>
                <Input
                  id="a-phone"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={(e) => set("phone")(e.target.value.replace(/[^\d+\s-]/g, "").slice(0, 14))}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="a-house">Flat, house no., building, street</Label>
              <Input id="a-house" value={form.house} onChange={(e) => set("house")(e.target.value)} className="mt-2" />
            </div>
            <div>
              <Label htmlFor="a-area">Area, landmark <span className="text-muted-foreground">(optional)</span></Label>
              <Input id="a-area" value={form.area} onChange={(e) => set("area")(e.target.value)} className="mt-2" />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="a-city">City</Label>
                <Input id="a-city" value={form.city} onChange={(e) => set("city")(e.target.value)} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="a-state">State</Label>
                <select
                  id="a-state"
                  value={form.state}
                  onChange={(e) => set("state")(e.target.value)}
                  className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="a-pin">PIN code</Label>
                <Input
                  id="a-pin"
                  inputMode="numeric"
                  value={form.pincode}
                  onChange={(e) => set("pincode")(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="mt-2"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button onClick={save} disabled={saving} className="h-11 flex-1 rounded-full">
                {saving ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                {editIndex === null ? "Save address" : "Save changes"}
              </Button>
              <Button variant="ghost" onClick={() => setOpen(false)} className="h-11 rounded-full">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AccountShell>
  );
}
