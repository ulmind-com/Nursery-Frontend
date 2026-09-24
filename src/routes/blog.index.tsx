import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowUpRight, Leaf, Search, Sparkles } from "lucide-react";
import { blogApi } from "@/api/services";
import {
  PostCard,
  PostMeta,
  TagPill,
  postImage,
  postKey,
  postTag,
} from "@/components/blog/journal";
import { EmptyState, PageSkeleton } from "@/components/shared/page-state";
import { Button } from "@/components/ui/button";
import type { BlogPost } from "@/types/api";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "The Plant Journal | MyGarden" },
      {
        name: "description",
        content:
          "Care guides, growing notes and styling ideas from our nursery — written for real homes and balconies.",
      },
      { property: "og:title", content: "The Plant Journal | MyGarden" },
      {
        property: "og:description",
        content: "Plant care guides and growing notes from our nursery.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Page,
});

const ALL = "All stories";

function Page() {
  const query = useQuery({
    queryKey: ["blog", { limit: 50 }],
    queryFn: () => blogApi.list({ limit: 50 }),
    staleTime: 5 * 60 * 1000,
  });
  const [search, setSearch] = useState("");
  const [tag, setTag] = useState(ALL);

  const posts: BlogPost[] = useMemo(() => {
    const data = query.data;
    return Array.isArray(data) ? data : (data?.items ?? []);
  }, [query.data]);

  const tags = useMemo(() => {
    const seen = new Map<string, number>();
    posts.forEach((post) => {
      const key = postTag(post);
      seen.set(key, (seen.get(key) ?? 0) + 1);
    });
    return [ALL, ...Array.from(seen.keys())];
  }, [posts]);

  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return posts.filter((post) => {
      if (tag !== ALL && postTag(post) !== tag) return false;
      if (!needle) return true;
      return [post.title, post.excerpt, postTag(post), post.author]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(needle));
    });
  }, [posts, search, tag]);

  if (query.isPending) return <PageSkeleton />;

  const untouched = tag === ALL && !search.trim();
  const featured = untouched ? (posts.find((post) => post.featured) ?? posts[0]) : undefined;
  const rest = featured ? filtered.filter((post) => postKey(post) !== postKey(featured)) : filtered;

  return (
    <div className="bg-background">
      <Hero
        count={posts.length}
        search={search}
        onSearch={setSearch}
        tags={tags}
        activeTag={tag}
        onTag={setTag}
      />

      {posts.length === 0 ? (
        <EmptyState
          title="Stories are being cultivated"
          description="Care guides and nursery notes will appear here as soon as they are published."
        />
      ) : (
        <div className="mx-auto max-w-[1480px] px-4 pb-16 sm:px-6 lg:px-10 lg:pb-24">
          {featured && <FeaturedPost post={featured} />}

          {rest.length > 0 ? (
            <>
              <h2 className="mt-14 font-display text-2xl font-extrabold sm:text-3xl lg:mt-20">
                {tag === ALL ? "Latest from the nursery" : tag}
                <span className="ml-2 text-base font-semibold text-muted-foreground">
                  ({rest.length})
                </span>
              </h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <PostCard key={postKey(post)} post={post} />
                ))}
              </div>
            </>
          ) : (
            <div className="mt-14 rounded-2xl border border-dashed border-primary/40 bg-primary-tint/50 px-6 py-16 text-center">
              <p className="font-display text-xl font-bold">Nothing matches that yet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                Try another keyword, or browse all stories.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearch("");
                  setTag(ALL);
                }}
                className="mt-6 rounded-full border-forest/25 px-6 text-sm font-semibold text-forest hover:bg-primary-tint"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      )}

      <JournalCta />
    </div>
  );
}

/* ---------------------------------------------------------------- hero --- */

function Hero({
  count,
  search,
  onSearch,
  tags,
  activeTag,
  onTag,
}: {
  count: number;
  search: string;
  onSearch: (value: string) => void;
  tags: string[];
  activeTag: string;
  onTag: (value: string) => void;
}) {
  return (
    <section className="border-b border-border bg-storefront-wash">
      <div className="mx-auto max-w-[1480px] px-4 py-14 text-center sm:px-6 lg:px-10 lg:py-20">
        <span className="inline-flex items-center gap-2 rounded-full border border-forest/15 bg-background px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-forest">
          <Sparkles className="size-3.5" aria-hidden />
          Notes from the nursery
        </span>
        <h1 className="mx-auto mt-6 max-w-4xl font-display text-4xl font-extrabold leading-[1.08] text-forest sm:text-5xl lg:text-[3.5rem]">
          Simpler, happier, greener home gardening
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
          {count > 0 ? `${count} guides` : "Guides"} written by the people who actually grow these
          plants — what works, what fails, and what to do this week.
        </p>

        <div className="mx-auto mt-9 flex max-w-xl items-center gap-2 rounded-full border border-border bg-background p-1.5 pl-5 shadow-card focus-within:border-primary/50">
          <Search className="size-4 shrink-0 text-muted-foreground" aria-hidden />
          <input
            value={search}
            onChange={(event) => onSearch(event.target.value)}
            placeholder="Search the journal"
            aria-label="Search the journal"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <span className="hidden shrink-0 rounded-full bg-forest px-5 py-2.5 text-xs font-bold text-forest-foreground sm:block">
            Search
          </span>
        </div>

        <ul className="mt-7 flex flex-wrap justify-center gap-2">
          {tags.map((item) => {
            const active = item === activeTag;
            return (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => onTag(item)}
                  aria-pressed={active}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition-colors duration-200 ${
                    active
                      ? "border-forest bg-forest text-forest-foreground"
                      : "border-border bg-background text-foreground hover:border-forest/40 hover:bg-primary-tint"
                  }`}
                >
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ featured --- */

function FeaturedPost({ post }: { post: BlogPost }) {
  const image = postImage(post);
  return (
    <article className="mt-12 grid overflow-hidden rounded-3xl border border-border bg-card shadow-card lg:grid-cols-2">
      <Link
        to="/blog/$slug"
        params={{ slug: postKey(post) }}
        className="group relative block aspect-[16/11] overflow-hidden bg-primary-tint lg:aspect-auto lg:h-full"
      >
        {image && (
          <img
            src={image}
            alt={post.title}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        )}
      </Link>
      <div className="flex flex-col justify-center gap-4 p-7 sm:p-10 lg:p-12">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-forest px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-forest-foreground">
            <Leaf className="size-3.5" aria-hidden />
            Editor&apos;s pick
          </span>
          <TagPill>{postTag(post)}</TagPill>
        </div>
        <h2 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl lg:text-[2.35rem]">
          <Link
            to="/blog/$slug"
            params={{ slug: postKey(post) }}
            className="transition-colors duration-200 hover:text-primary"
          >
            {post.title}
          </Link>
        </h2>
        {post.excerpt && (
          <p className="text-sm leading-7 text-muted-foreground sm:text-base">{post.excerpt}</p>
        )}
        <PostMeta post={post} />
        <Button
          asChild
          className="mt-2 h-11 w-fit rounded-full bg-forest px-7 text-sm font-semibold text-forest-foreground hover:bg-forest/90"
        >
          <Link to="/blog/$slug" params={{ slug: postKey(post) }}>
            Read the guide
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </Button>
      </div>
    </article>
  );
}

/* ----------------------------------------------------------------- cta --- */

function JournalCta() {
  return (
    <section className="mx-auto max-w-[1480px] px-4 pb-16 sm:px-6 lg:px-10">
      <div className="relative overflow-hidden rounded-3xl bg-forest px-6 py-14 text-center text-forest-foreground sm:px-10 lg:py-20">
        <div
          aria-hidden
          className="absolute -left-24 -top-24 size-72 rounded-full bg-primary/25 blur-3xl"
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Read it here, grow it at home
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-forest-foreground/80">
            Every plant in these guides is one we grow and ship ourselves — hardened, healthy and
            covered by our 30-day guarantee.
          </p>
          <Button
            asChild
            className="mt-8 h-12 rounded-full bg-background px-8 text-sm font-bold text-forest hover:bg-background/90"
          >
            <Link to="/plants" search={{}}>
              Shop the nursery
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
