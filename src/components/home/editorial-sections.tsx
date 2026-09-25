/* Sections whose content lives in other collections (Google reviews, the blog)
   plus the free-form bands an admin can add to a page from the builder. */

import { Link } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { SectionHeader } from "@/components/home/section-rail";
import type { BlogPost, GoogleReview } from "@/types/api";

export interface CustomCard {
  id?: string;
  image?: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

/** Internal routes go through the router; anything with a scheme opens as a link. */
function MaybeLink({ to, className, children }: { to: string | undefined; className: string; children: React.ReactNode }) {
  if (!to) return <div className={className}>{children}</div>;
  if (/^(https?:)?\/\//.test(to) || to.startsWith("mailto:") || to.startsWith("tel:")) {
    return (
      <a href={to} target="_blank" rel="noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  );
}

export function GoogleReviewsSection({
  reviews,
  eyebrow = "Google reviews",
  title = "What our customers say",
  limit = 6,
}: {
  reviews: GoogleReview[];
  eyebrow?: string;
  title?: string;
  limit?: number;
}) {
  if (reviews.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
      <SectionHeader {...(eyebrow ? { eyebrow } : {})} title={title} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.slice(0, limit).map((review, i) => (
          <figure key={review.id ?? i} className="surface-card p-5">
            <div className="flex gap-0.5" aria-label={`Rated ${review.rating} out of 5`}>
              {Array.from({ length: 5 }, (_, s) => (
                <Star key={s} className={`size-3.5 ${s < review.rating ? "fill-star text-star" : "text-border"}`} />
              ))}
            </div>
            {review.text && (
              <blockquote className="mt-3 line-clamp-5 text-sm leading-6 text-muted-foreground">{review.text}</blockquote>
            )}
            <figcaption className="mt-4 text-xs font-semibold">{review.author_name || "Google user"}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

export function JournalSection({
  posts,
  eyebrow = "Journal",
  title = "Plant care stories",
  limit = 3,
}: {
  posts: BlogPost[];
  eyebrow?: string;
  title?: string;
  limit?: number;
}) {
  if (posts.length === 0) return null;
  return (
    <section className="mx-auto max-w-[1480px] px-4 pb-16 sm:px-6 lg:px-10">
      <SectionHeader {...(eyebrow ? { eyebrow } : {})} title={title} />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, limit).map((post) => (
          <Link
            key={post.slug ?? post.key ?? post.title}
            to="/blog/$slug"
            params={{ slug: post.slug || post.key || "" }}
            className="surface-card group overflow-hidden"
          >
            <div className="aspect-[16/10] overflow-hidden bg-primary-soft">
              {(post.hero_image || post.image) && (
                <img
                  src={post.hero_image || post.image}
                  alt={post.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              )}
            </div>
            <div className="p-5">
              <h3 className="text-base">{post.title}</h3>
              {post.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{post.excerpt}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ── Free-form bands ─────────────────────────────────────────────────────── */

export function CustomBannerSection({
  image,
  imageAlt = "",
  title,
  subtitle,
  ctaLabel,
  ctaLink,
  bgColor,
}: {
  image?: string;
  imageAlt?: string;
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaLink?: string;
  bgColor?: string;
}) {
  if (!image && !title) return null;
  const body = (
    <>
      {image && (
        <img
          src={image}
          alt={imageAlt}
          loading="lazy"
          className="h-[240px] w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04] sm:h-[320px] lg:h-[400px]"
        />
      )}
      {(title || subtitle || ctaLabel) && (
        <div className={image ? "absolute inset-0 flex items-center px-6 sm:px-10 lg:px-16" : "px-6 py-14 sm:px-10 lg:px-16"}>
          <div className="max-w-[34rem]">
            {title && (
              <h2
                className={`whitespace-pre-line font-display text-[2rem] font-extrabold leading-[1.08] tracking-tight sm:text-[2.75rem] lg:text-[3.25rem] ${
                  image ? "text-white drop-shadow-[0_2px_14px_rgba(0,0,0,0.45)]" : "text-forest"
                }`}
              >
                {title}
              </h2>
            )}
            {subtitle && (
              <p className={`mt-3 text-sm sm:mt-4 sm:text-lg ${image ? "text-white/90" : "text-muted-foreground"}`}>{subtitle}</p>
            )}
            {ctaLabel && (
              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 font-display text-sm font-bold text-forest shadow-[0_14px_36px_-12px_rgba(0,0,0,0.45)] transition group-hover:bg-star sm:mt-8 sm:px-9 sm:text-base">
                {ctaLabel}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );

  return (
    <section style={bgColor ? { backgroundColor: bgColor } : undefined} className={bgColor ? "" : "bg-storefront-wash"}>
      {/* Scrim keeps the copy legible over a photograph at every width */}
      <MaybeLink to={ctaLink} className="group relative block overflow-hidden">
        {image && (title || subtitle) && (
          <div
            aria-hidden="true"
            className="absolute inset-0 z-[1] bg-[linear-gradient(to_right,oklch(0.30_0.06_169/0.92)_0%,oklch(0.30_0.06_169/0.62)_38%,transparent_78%)]"
          />
        )}
        <div className="relative [&>div]:z-[2]">{body}</div>
      </MaybeLink>
    </section>
  );
}

export function CustomCardsSection({
  cards,
  eyebrow,
  title,
  subtitle,
  bgColor,
}: {
  cards: CustomCard[];
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  bgColor?: string;
}) {
  const visible = cards.filter((card) => card.image || card.title);
  if (visible.length === 0) return null;

  return (
    <section
      style={bgColor ? { backgroundColor: bgColor } : undefined}
      className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 lg:px-10 lg:py-16"
    >
      {(title || eyebrow) && (
        <div className="mb-10 text-center">
          {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
          {title && (
            <h2 className="mt-2 font-display text-3xl font-extrabold text-forest sm:text-4xl lg:text-[2.75rem]">{title}</h2>
          )}
          {subtitle && <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">{subtitle}</p>}
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {visible.map((card, index) => (
          <MaybeLink key={card.id ?? index} to={card.link} className="surface-card group overflow-hidden">
            {card.image && (
              <div className="aspect-[4/3] overflow-hidden bg-primary-soft">
                <img
                  src={card.image}
                  alt={card.title || ""}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            {(card.title || card.subtitle) && (
              <div className="p-5">
                {card.title && <h3 className="text-base text-forest">{card.title}</h3>}
                {card.subtitle && <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.subtitle}</p>}
              </div>
            )}
          </MaybeLink>
        ))}
      </div>
    </section>
  );
}

export function CustomTextSection({
  eyebrow,
  title,
  description,
  ctaLabel,
  ctaLink,
  bgColor,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaLink?: string;
  bgColor?: string;
}) {
  if (!title && !description) return null;
  return (
    <section style={bgColor ? { backgroundColor: bgColor } : undefined} className={bgColor ? "" : "bg-storefront-wash"}>
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:py-20">
        {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>}
        {title && (
          <h2 className="mt-2 font-display text-3xl font-extrabold text-forest sm:text-4xl lg:text-[2.75rem]">{title}</h2>
        )}
        {description && (
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-muted-foreground sm:text-base">{description}</p>
        )}
        {ctaLabel && ctaLink && (
          <MaybeLink
            to={ctaLink}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-forest px-8 py-3 font-display text-sm font-bold text-forest-foreground transition hover:bg-primary sm:text-base"
          >
            {ctaLabel}
            <ArrowRight className="size-4" aria-hidden="true" />
          </MaybeLink>
        )}
      </div>
    </section>
  );
}
