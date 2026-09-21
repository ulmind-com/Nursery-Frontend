import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Star, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { reviewsApi } from "@/api/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/auth-context";
import { normalizeApiError } from "@/lib/api";
import type { Review } from "@/types/api";

type SortKey = "recent" | "highest" | "lowest";

const reviewSchema = z.object({
  rating: z.number().int().min(1, { message: "Please pick a star rating" }).max(5),
  title: z.string().trim().max(120, { message: "Title must be under 120 characters" }),
  comment: z.string().trim().min(5, { message: "Please write at least a few words" }).max(1000, { message: "Review must be under 1000 characters" }),
});

const dateLabel = (value: string | undefined): string | undefined => {
  if (!value) return undefined;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

function Stars({ value, size = "size-4" }: { value: number; size?: string }) {
  return (
    <span className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star key={index} className={`${size} ${index < Math.round(value) ? "fill-star text-star" : "text-border"}`} />
      ))}
    </span>
  );
}

export function ReviewsSection({ productId, preview = false, fallbackReviews = [], rating, count }: { productId: string; preview?: boolean; fallbackReviews?: Review[]; rating?: number | undefined; count?: number | undefined }) {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();
  const [sort, setSort] = useState<SortKey>("recent");
  const [formOpen, setFormOpen] = useState(false);
  const [stars, setStars] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const listQuery = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewsApi.list({ product_id: productId, limit: 50 }),
    enabled: !preview,
  });
  const canReview = useQuery({
    queryKey: ["reviews", "can-review", productId],
    queryFn: () => reviewsApi.canReview(productId),
    enabled: !preview && isAuthenticated,
  });

  const reviews: Review[] = preview
    ? fallbackReviews
    : listQuery.data
      ? Array.isArray(listQuery.data)
        ? listQuery.data
        : listQuery.data.items
      : [];

  const sorted = useMemo(() => {
    const copy = [...reviews];
    if (sort === "highest") copy.sort((a, b) => b.rating - a.rating);
    else if (sort === "lowest") copy.sort((a, b) => a.rating - b.rating);
    else copy.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime());
    return copy;
  }, [reviews, sort]);

  const breakdown = useMemo(() => {
    const buckets = [5, 4, 3, 2, 1].map((star) => ({ star, total: reviews.filter((review) => Math.round(review.rating) === star).length }));
    return buckets;
  }, [reviews]);

  const total = reviews.length;
  const average = total ? reviews.reduce((sum, review) => sum + review.rating, 0) / total : rating ?? 0;
  const displayCount = total || count || 0;

  const create = useMutation({
    mutationFn: (body: { rating: number; title: string; comment: string }) => reviewsApi.create({ product_id: productId, ...body }),
    onSuccess: () => {
      toast.success("Thanks! Your review is submitted.");
      setFormOpen(false);
      setTitle("");
      setComment("");
      setStars(5);
      void queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      void queryClient.invalidateQueries({ queryKey: ["reviews", "can-review", productId] });
      void queryClient.invalidateQueries({ queryKey: ["product", productId] });
    },
    onError: (error) => toast.error(normalizeApiError(error)),
  });

  const vote = useMutation({
    mutationFn: (id: string) => reviewsApi.vote(id, true),
    onSuccess: () => {
      toast.success("Marked as helpful");
      void queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
    onError: (error) => toast.error(normalizeApiError(error)),
  });

  const submit = () => {
    const parsed = reviewSchema.safeParse({ rating: stars, title, comment });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check your review");
      return;
    }
    create.mutate(parsed.data);
  };

  const canWrite = !preview && isAuthenticated && canReview.data?.can_review !== false;

  return (
    <section className="border-t border-border py-12">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <h2 className="text-center text-2xl text-forest sm:text-3xl">Customer Reviews</h2>

        <div className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)_minmax(0,1fr)] md:items-center">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <Stars value={average} />
              <span className="price-num text-sm font-semibold text-foreground">{average ? average.toFixed(2) : "0.00"} out of 5</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Based on <span className="price-num">{displayCount}</span> {displayCount === 1 ? "review" : "reviews"}</p>
          </div>

          <ul className="space-y-1.5 md:border-x md:border-border md:px-6">
            {breakdown.map(({ star, total: starTotal }) => (
              <li key={star} className="flex items-center gap-3">
                <Stars value={star} size="size-3.5" />
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <span className="block h-full rounded-full bg-primary transition-[width] duration-200 motion-reduce:transition-none" style={{ width: `${total ? (starTotal / total) * 100 : 0}%` }} />
                </span>
                <span className="price-num w-6 text-right text-xs text-muted-foreground">{starTotal}</span>
              </li>
            ))}
          </ul>

          <div className="flex justify-center md:justify-end">
            {preview ? (
              <Button type="button" disabled className="bg-primary text-primary-foreground">Write a review</Button>
            ) : canWrite ? (
              <Button type="button" className="bg-primary text-primary-foreground hover:bg-primary/90" onClick={() => setFormOpen((open) => !open)}>
                {formOpen ? "Cancel" : "Write a review"}
              </Button>
            ) : (
              <p className="max-w-56 text-center text-xs text-muted-foreground md:text-right">
                {isAuthenticated ? "Reviews can be written after you receive this product." : "Sign in after your purchase to write a review."}
              </p>
            )}
          </div>
        </div>

        {preview && <p className="mt-4 text-center text-xs text-muted-foreground">Design preview — sample reviews shown until real customer reviews arrive.</p>}

        {formOpen && canWrite && (
          <form
            className="mx-auto mt-8 max-w-xl rounded-xl border border-border p-5"
            onSubmit={(event) => {
              event.preventDefault();
              submit();
            }}
          >
            <p className="text-sm font-semibold text-foreground">Your rating</p>
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" aria-label={`${star} star`} aria-pressed={stars === star} onClick={() => setStars(star)} className="transition-colors duration-200 motion-reduce:transition-none">
                  <Star className={`size-6 ${star <= stars ? "fill-star text-star" : "text-border"}`} />
                </button>
              ))}
            </div>
            <Input className="mt-4" placeholder="Review title (optional)" value={title} maxLength={120} onChange={(event) => setTitle(event.target.value)} />
            <Textarea className="mt-3" rows={4} placeholder="Tell other plant parents about this product" value={comment} maxLength={1000} onChange={(event) => setComment(event.target.value)} />
            <Button type="submit" className="mt-4 bg-forest text-forest-foreground hover:bg-forest/90" disabled={create.isPending}>
              {create.isPending ? "Submitting…" : "Submit review"}
            </Button>
          </form>
        )}

        <div className="mt-8 border-t border-border pt-5">
          <Select value={sort} onValueChange={(value) => setSort(value as SortKey)}>
            <SelectTrigger className="h-9 w-44 text-sm"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="highest">Highest Rating</SelectItem>
              <SelectItem value="lowest">Lowest Rating</SelectItem>
            </SelectContent>
          </Select>

          {sorted.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">{listQuery.isPending && !preview ? "Loading reviews…" : "No reviews yet. Be the first to review this product."}</p>
          ) : (
            <ul className="divide-y divide-border">
              {sorted.map((review) => (
                <li key={review.id} className="py-6">
                  <Stars value={review.rating} size="size-4" />
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-foreground">{review.user_name || "Verified customer"}</span>
                    {review.verified_buyer && <span className="rounded bg-primary-tint px-1.5 py-0.5 text-[11px] font-semibold text-primary-soft-foreground">Verified</span>}
                    {dateLabel(review.created_at) && <span className="text-xs text-muted-foreground">{dateLabel(review.created_at)}</span>}
                  </div>
                  {review.title && <h3 className="mt-2 text-base font-semibold text-foreground">{review.title}</h3>}
                  {review.comment && <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{review.comment}</p>}
                  {!preview && (
                    <button type="button" onClick={() => vote.mutate(review.id)} className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors duration-200 hover:text-primary motion-reduce:transition-none">
                      <ThumbsUp className="size-3.5" /> Helpful{typeof review.helpful_count === "number" ? ` (${review.helpful_count})` : ""}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
