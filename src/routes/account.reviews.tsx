import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Loader2, Pencil, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { queryKeys, reviewsApi } from "@/api/services";
import { AccountShell } from "@/components/account/account-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageSkeleton } from "@/components/shared/page-state";
import { normalizeApiError } from "@/lib/api";
import type { MyReview } from "@/types/api";

export const Route = createFileRoute("/account/reviews")({
  head: () => ({
    meta: [
      { title: "My Reviews | MyGarden" },
      { name: "description", content: "Reviews you've written, and how to change them." },
      { property: "og:title", content: "My Reviews | MyGarden" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Reviews,
});

function Stars({ value, onChange }: { value: number; onChange?: (next: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        const cls = `size-4 ${filled ? "fill-star text-star" : "text-border"}`;
        return onChange ? (
          <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} star${n === 1 ? "" : "s"}`}>
            <Star className={`${cls} transition hover:scale-110`} />
          </button>
        ) : (
          <Star key={n} className={cls} aria-hidden="true" />
        );
      })}
    </div>
  );
}

function Reviews() {
  const queryClient = useQueryClient();
  const q = useQuery({ queryKey: queryKeys.myReviews, queryFn: reviewsApi.mine });

  const [editing, setEditing] = useState<MyReview | null>(null);
  const [draft, setDraft] = useState({ rating: 5, title: "", text: "" });
  const [busy, setBusy] = useState(false);

  if (q.isLoading) return <PageSkeleton />;
  const list = q.data ?? [];

  const refresh = () => queryClient.invalidateQueries({ queryKey: queryKeys.myReviews });

  const startEdit = (review: MyReview) => {
    setDraft({ rating: review.rating, title: review.title ?? "", text: review.text ?? "" });
    setEditing(review);
  };

  const save = async () => {
    if (!editing) return;
    setBusy(true);
    try {
      await reviewsApi.update(editing.id, draft);
      await refresh();
      setEditing(null);
      toast.success("Review updated");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (review: MyReview) => {
    if (!window.confirm("Delete this review? The product's rating will be recalculated.")) return;
    try {
      await reviewsApi.remove(review.id);
      await refresh();
      toast.success("Review deleted");
    } catch (error) {
      toast.error(normalizeApiError(error).message);
    }
  };

  return (
    <AccountShell title="Reviews" description="What you've said about the plants you've grown with us.">
      {list.length === 0 ? (
        <div className="surface-card p-8 text-center">
          <Star className="mx-auto size-8 text-primary" aria-hidden="true" />
          <p className="mt-3 font-display text-lg font-bold text-forest">No reviews yet</p>
          <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted-foreground">
            Once a plant is delivered you can rate it — other gardeners will thank you.
          </p>
          <Button asChild className="mt-5 h-11 rounded-full px-7">
            <Link to="/account/orders">View my orders</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((review) => (
            <article key={review.id} className="surface-card p-5">
              <div className="flex items-start gap-3">
                <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-primary-soft">
                  {review.product?.image ? (
                    <img src={review.product.image} alt="" className="size-full object-cover" />
                  ) : (
                    <Star className="size-5 text-primary" aria-hidden="true" />
                  )}
                </span>

                <div className="min-w-0 flex-1">
                  {review.product ? (
                    <Link
                      to="/product/$id"
                      params={{ id: review.product.id }}
                      className="line-clamp-1 text-sm font-bold text-forest hover:text-primary"
                    >
                      {review.product.title}
                    </Link>
                  ) : (
                    <p className="text-sm font-bold text-muted-foreground">Product no longer available</p>
                  )}
                  <div className="mt-1.5 flex items-center gap-2">
                    <Stars value={review.rating} />
                    <span className="text-[11px] text-muted-foreground">
                      {review.created_at ? new Date(review.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : ""}
                      {review.edited_at ? " · edited" : ""}
                    </span>
                  </div>
                </div>
              </div>

              {review.title && <p className="mt-3 text-sm font-semibold text-forest">{review.title}</p>}
              {review.text && <p className="mt-1 text-sm leading-6 text-muted-foreground">{review.text}</p>}

              <div className="mt-4 flex gap-2">
                <Button variant="outline" size="sm" className="rounded-full" onClick={() => startEdit(review)}>
                  <Pencil className="size-3.5" aria-hidden="true" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full text-muted-foreground hover:text-destructive"
                  onClick={() => remove(review)}
                >
                  <Trash2 className="size-3.5" aria-hidden="true" /> Delete
                </Button>
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Edit your review</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <Label>Rating</Label>
              <div className="mt-2">
                <Stars value={draft.rating} onChange={(rating) => setDraft((d) => ({ ...d, rating }))} />
              </div>
            </div>
            <div>
              <Label htmlFor="r-title">Headline</Label>
              <Input
                id="r-title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                placeholder="Arrived green and bushy"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="r-text">Your review</Label>
              <Textarea
                id="r-text"
                rows={4}
                value={draft.text}
                onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
                className="mt-2"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={save} disabled={busy} className="h-11 flex-1 rounded-full">
                {busy ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : null}
                Save review
              </Button>
              <Button variant="ghost" onClick={() => setEditing(null)} className="h-11 rounded-full">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AccountShell>
  );
}
