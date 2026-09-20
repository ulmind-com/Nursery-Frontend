import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart-context";
import type { Product, ProductSize } from "@/types/api";

const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
export function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart(); const variant: ProductSize | undefined = product.sizes?.find((size) => size.stock > 0) || product.sizes?.[0];
  const price = variant?.price ?? product.price ?? 0; const mrp = variant?.mrp ?? product.mrp; const stock = variant?.stock ?? product.stock ?? 0; const image = variant?.images?.[0] || product.images?.[0];
  const add = () => { if (stock < 1) return; addItem({ product_id: product.id, title: product.title, ...(image ? { image } : {}), qty: 1, ...(variant?.name ? { size_variant: variant.name } : {}), ...(variant?.pot_type ? { pot_type: variant.pot_type } : {}), unit_price: price, ...(mrp ? { mrp } : {}), stock }); toast.success(`${product.title} added to cart`); };
  return <article className="group relative min-w-0">
    <Link to="/product/$id" params={{ id: product.id }} className="block overflow-hidden rounded-md bg-secondary"><div className="relative aspect-[4/5] overflow-hidden">{image ? <img src={image} alt={product.title} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-[1.035]"/> : <div className="flex size-full items-center justify-center bg-accent text-sm text-muted-foreground">Image coming soon</div>}
      <div className="absolute left-2 top-2 flex flex-wrap gap-1">{product.is_bestseller && <span className="rounded-sm bg-primary px-2 py-1 text-[10px] font-bold uppercase text-primary-foreground">Bestseller</span>}{product.is_new_arrival && <span className="rounded-sm bg-background px-2 py-1 text-[10px] font-bold uppercase">New</span>}</div></div></Link>
    <Button variant="secondary" size="icon" className="absolute right-2 top-2 size-8 rounded-full" aria-label={`Add ${product.title} to wishlist`}><Heart className="size-4" /></Button>
    <div className="pt-3"><div className="mb-1 flex items-center gap-1 text-xs text-muted-foreground">{Boolean(product.rating) && <><Star className="size-3 fill-current text-primary"/><span>{product.rating?.toFixed(1)}</span><span>({product.review_count || 0})</span></>}</div><Link to="/product/$id" params={{ id: product.id }} className="line-clamp-2 min-h-10 text-sm font-semibold leading-5 hover:text-primary">{product.title}</Link><div className="mt-1.5 flex items-baseline gap-2"><span className="font-bold">{money(price)}</span>{mrp && mrp > price && <span className="text-xs text-muted-foreground line-through">{money(mrp)}</span>}</div>
      <Button onClick={add} disabled={stock < 1} variant={stock > 0 ? "outline" : "secondary"} className="mt-3 w-full text-xs"><ShoppingBag />{stock > 0 ? "Quick add" : "Out of stock"}</Button></div>
  </article>;
}
export function ProductGrid({ products }: { products: Product[] }) { return <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>; }