import { Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarDays, Clock } from "lucide-react";
import type { BlogPost } from "@/types/api";

/** Shared pieces for the Plant Journal list and article pages. */

export const postKey = (post: BlogPost) => post.slug || post.key || String(post.id ?? "");
export const postImage = (post: BlogPost) => post.hero_image || post.image || "";
export const postTag = (post: BlogPost) => post.tag || post.category || "Journal";

export function postDate(post: BlogPost) {
  const raw = post.published_at || post.date;
  if (!raw) return "";
  const date = new Date(raw);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/** Rough reading time from the excerpt plus every body block. */
export function readingTime(post: BlogPost) {
  const words = [
    post.excerpt ?? "",
    post.content ?? "",
    ...(post.body ?? []).map((b) => b.text ?? ""),
  ]
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function TagPill({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] ${
        tone === "dark"
          ? "bg-forest-foreground/15 text-forest-foreground"
          : "bg-primary-tint text-primary-soft-foreground"
      }`}
    >
      {children}
    </span>
  );
}

export function PostMeta({ post, className = "" }: { post: BlogPost; className?: string }) {
  const date = postDate(post);
  return (
    <p
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground ${className}`}
    >
      {post.author && <span className="font-semibold text-foreground">{post.author}</span>}
      {date && (
        <span className="flex items-center gap-1.5">
          <CalendarDays className="size-3.5" aria-hidden />
          {date}
        </span>
      )}
      <span className="flex items-center gap-1.5">
        <Clock className="size-3.5" aria-hidden />
        {readingTime(post)} min read
      </span>
    </p>
  );
}

/** Standard card used across the journal grid and the "read next" rail. */
export function PostCard({ post, compact = false }: { post: BlogPost; compact?: boolean }) {
  const image = postImage(post);
  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-shadow duration-300 hover:shadow-card-hover">
      <Link
        to="/blog/$slug"
        params={{ slug: postKey(post) }}
        className={`relative block overflow-hidden bg-primary-tint ${compact ? "aspect-[16/10]" : "aspect-[3/2]"}`}
      >
        {image ? (
          <img
            src={image}
            alt={post.title}
            loading="lazy"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="flex size-full items-center justify-center text-sm text-muted-foreground">
            Journal
          </span>
        )}
        <span className="absolute left-3 top-3">
          <TagPill>{postTag(post)}</TagPill>
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-bold leading-snug">
          <Link
            to="/blog/$slug"
            params={{ slug: postKey(post) }}
            className="transition-colors duration-200 hover:text-primary"
          >
            {post.title}
          </Link>
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto pt-4">
          <PostMeta post={post} />
          <Link
            to="/blog/$slug"
            params={{ slug: postKey(post) }}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-forest transition-colors duration-200 hover:text-primary"
          >
            Read article
            <ArrowUpRight
              className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
