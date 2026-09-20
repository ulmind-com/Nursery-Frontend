import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { categoriesApi, queryKeys } from "@/api/services";
import { CategoryHero, normalizeCategorySlug } from "@/components/category/category-hero";
import { CategoryRail } from "@/components/category/category-rail";
import { CataloguePage, type CatalogueFilters } from "@/components/product/catalogue-page";

const titleCase = (value: string) => value.replaceAll("-", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => {
    const name = titleCase(params.slug);
    const description = `Shop the ${name} collection from Plant Nursery.`;
    return {
      meta: [
        { title: `${name} | Plant Nursery` },
        { name: "description", content: description },
        { property: "og:title", content: `${name} | Plant Nursery` },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const [filters, setFilters] = useState<CatalogueFilters>({});
  const categories = useQuery({ queryKey: queryKeys.categories, queryFn: categoriesApi.list });
  const normalizedSlug = normalizeCategorySlug(slug);
  const category = (categories.data ?? []).find((item) =>
    normalizeCategorySlug(item.slug || item.name) === normalizedSlug || item.id === slug,
  );
  const name = category?.name || titleCase(slug);

  return (
    <div className="bg-storefront-wash">
      <CategoryHero slug={slug} name={name} image={category?.image} />
      <CategoryRail activeSlug={slug} />
      <CataloguePage
        title={name}
        params={{ category_id: category?.id || slug }}
        filters={filters}
        onFiltersChange={setFilters}
        hideHeader
        previewCategory={slug}
      />
    </div>
  );
}
