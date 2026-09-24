import { Link } from "@tanstack/react-router";
import { money } from "@/components/product/product-card";
import { CartActions } from "@/components/product/cart-actions";
import { previewItemsFor } from "./preview-products";

export function CategoryPreviewGrid({ slug }: { slug: string }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:gap-x-5 lg:gap-y-8">
      {previewItemsFor(slug).map((item, index) => (
        <article
          key={`${item.title}-${index}`}
          className="group min-w-0 overflow-hidden rounded-xl bg-card"
        >
          <Link
            to="/product/$id"
            params={{ id: item.id }}
            className="relative block aspect-[1.08/1] overflow-hidden bg-muted"
          >
            <img
              src={item.image}
              alt={item.title}
              width={768}
              height={960}
              loading="lazy"
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.025]"
            />
            {item.bestseller && (
              <span className="absolute left-2.5 top-2.5 rounded-md bg-star px-2 py-1 text-[9px] font-bold uppercase text-foreground sm:text-[10px]">
                Bestseller
              </span>
            )}
          </Link>
          <div className="p-3 sm:p-4">
            <h3 className="line-clamp-1 text-base text-forest sm:text-xl">
              <Link to="/product/$id" params={{ id: item.id }}>
                {item.title}
              </Link>
            </h3>
            <div className="mt-3 flex min-w-0 items-baseline gap-1.5">
              <span className="price-num text-sm text-foreground sm:text-base">
                {money(item.price)}
              </span>
              <span className="price-num truncate text-[10px] font-medium text-muted-foreground line-through sm:text-sm">
                {money(item.mrp)}
              </span>
            </div>
            <CartActions
              item={{
                id: item.id,
                title: item.title,
                image: item.image,
                price: item.price,
                mrp: item.mrp,
                stock: 99,
              }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}
