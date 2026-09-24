import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ArrowLeft, ArrowUpRight, Check, Link2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { blogApi } from "@/api/services";
import {
  PostCard,
  PostMeta,
  TagPill,
  postImage,
  postKey,
  postTag,
} from "@/components/blog/journal";
import { ErrorState, PageSkeleton } from "@/components/shared/page-state";
import { Button } from "@/components/ui/button";
import type { BlogBlock, BlogPost } from "@/types/api";

/** The post itself supplies the metadata, so shares and search results read properly. */
export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => blogApi.get(params.slug).catch(() => null),
  head: ({ loaderData, params }) => {
    const post = loaderData as BlogPost | null;
    const title = post?.title || params.slug.replace(/-/g, " ");
    const description = post?.excerpt || "Plant care advice from the nursery journal.";
    const image = post ? postImage(post) : "";
    return {
      meta: [
        { title: `${title} | The Plant Journal` },
        { name: "description", content: description },
        { property: "og:title", content: `${title} | The Plant Journal` },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(image ? [{ property: "og:image", content: image }] : []),
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const post = useQuery({ queryKey: ["blog", slug], queryFn: () => blogApi.get(slug) });
  const all = useQuery({
    queryKey: ["blog", { limit: 50 }],
    queryFn: () => blogApi.list({ limit: 50 }),
    staleTime: 5 * 60 * 1000,
  });

  const related = useMemo(() => {
    const data = all.data;
    const posts: BlogPost[] = Array.isArray(data) ? data : (data?.items ?? []);
    const current = post.data;
    if (!current) return [];
    const others = posts.filter((item) => postKey(item) !== postKey(current));
    const sameTag = others.filter((item) => postTag(item) === postTag(current));
    return [...sameTag, ...others.filter((item) => !sameTag.includes(item))].slice(0, 3);
  }, [all.data, post.data]);

  if (post.isPending) return <PageSkeleton />;
  if (post.isError || !post.data) return <ErrorState retry={() => void post.refetch()} />;

  const article = post.data;
  const image = postImage(article);
  const blocks = (article.body ?? []).filter((block) => block.text || block.url);

  return (
    <div className="bg-background pb-4">
      {/* ── header ─────────────────────────────────────────────────────── */}
      <header className="border-b border-border bg-storefront-wash">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:py-14">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors duration-200 hover:text-forest"
          >
            <ArrowLeft className="size-4" aria-hidden />
            The Plant Journal
          </Link>
          <div className="mt-6">
            <TagPill>{postTag(article)}</TagPill>
          </div>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-[1.12] text-forest sm:text-4xl lg:text-[3rem]">
            {article.title}
          </h1>
          {article.excerpt && (
            <p className="mt-5 text-base leading-7 text-muted-foreground">{article.excerpt}</p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <PostMeta post={article} />
            <CopyLink />
          </div>
        </div>
      </header>

      {image && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <img
            src={image}
            alt={article.title}
            className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-card sm:rounded-3xl"
          />
        </div>
      )}

      {/* ── body ───────────────────────────────────────────────────────── */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        {blocks.length > 0 ? (
          blocks.map((block, index) => <Block key={index} block={block} />)
        ) : (
          <p className="whitespace-pre-wrap text-[1.0625rem] leading-8 text-foreground/85">
            {article.content || article.excerpt}
          </p>
        )}

        {article.link && (
          <div className="mt-12 rounded-2xl border border-border bg-primary-tint/60 p-6 text-center sm:p-8">
            <p className="font-display text-xl font-bold text-forest">
              {article.link_label || "Shop the plants in this guide"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Grown at our nursery, hardened for Indian homes, and covered by the 30-day plant
              guarantee.
            </p>
            <Button
              asChild
              className="mt-5 h-11 rounded-full bg-forest px-7 text-sm font-semibold text-forest-foreground hover:bg-forest/90"
            >
              {/^https?:\/\//.test(article.link) ? (
                <a href={article.link} target="_blank" rel="noreferrer">
                  Browse plants
                  <ArrowUpRight className="size-4" aria-hidden />
                </a>
              ) : (
                <Link to="/plants" search={{}}>
                  Browse plants
                  <ArrowUpRight className="size-4" aria-hidden />
                </Link>
              )}
            </Button>
          </div>
        )}
      </article>

      {/* ── read next ──────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-border bg-storefront-wash py-14 lg:py-20">
          <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-2xl font-extrabold sm:text-3xl">Read next</h2>
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-forest hover:text-primary"
              >
                All stories
                <ArrowUpRight className="size-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <PostCard key={postKey(item)} post={item} compact />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

/** Article copy, block by block, exactly as the admin panel authored it. */
function Block({ block }: { block: BlogBlock }) {
  if (block.type === "h2")
    return (
      <h2 className="mt-10 font-display text-2xl font-bold leading-snug text-forest first:mt-0">
        {block.text}
      </h2>
    );

  if (block.type === "quote")
    return (
      <blockquote className="my-9 border-l-[3px] border-primary bg-primary-tint/50 py-5 pl-6 pr-5 font-display text-lg font-semibold leading-8 text-forest">
        {block.text}
      </blockquote>
    );

  if (block.type === "link")
    return (
      <p className="mt-5">
        <a
          href={block.url}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 font-semibold text-primary underline underline-offset-4 hover:text-forest"
        >
          {block.text || block.url}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </p>
    );

  return (
    <p className="mt-5 text-[1.0625rem] leading-8 text-foreground/85 first:mt-0">{block.text}</p>
  );
}

function CopyLink() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    const url = typeof window === "undefined" ? "" : window.location.href;
    void navigator.clipboard?.writeText(url).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
    toast.success("Link copied");
  };
  return (
    <Button
      type="button"
      variant="outline"
      onClick={copy}
      className="h-9 shrink-0 gap-1.5 rounded-full border-forest/25 px-4 text-xs font-semibold text-forest hover:bg-primary-tint"
    >
      {copied ? (
        <Check className="size-3.5" aria-hidden />
      ) : (
        <Link2 className="size-3.5" aria-hidden />
      )}
      {copied ? "Copied" : "Share"}
    </Button>
  );
}
