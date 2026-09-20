import { Link, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { categoriesApi, queryKeys, settingsApi } from "@/api/services";
import { brand } from "@/config/brand";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PlantAssistant } from "@/components/layout/plant-assistant";

const primaryLinks = [
  { label: "Plants", to: "/plants" }, { label: "Pots & Planters", to: "/plants", search: { q: "pots" } },
  { label: "Plant Care", to: "/plants", search: { q: "plant care" } }, { label: "Seeds", to: "/plants", search: { q: "seeds" } },
  { label: "Combos", to: "/combos" }, { label: "Offers", to: "/offers" }, { label: "Journal", to: "/blog" },
] as const;

export function SiteLayout({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count } = useCart();
  const { data: settings } = useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get, staleTime: 300_000 });
  const { data: categories = [] } = useQuery({ queryKey: queryKeys.categories, queryFn: categoriesApi.list, staleTime: 300_000 });
  const announcement = settings?.announcements?.[0];
  return <div className="min-h-screen bg-background text-foreground">
    {announcement && <div className="bg-primary px-4 py-2 text-center text-xs font-semibold text-primary-foreground">{announcement}</div>}
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-4 sm:px-6 lg:h-[72px] lg:px-10">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu /></Button></SheetTrigger>
          <SheetContent side="left" className="w-[88%] p-0"><SheetHeader className="border-b p-5 text-left"><SheetTitle className="font-display text-2xl">{settings?.shop.name || brand.brandName}</SheetTitle></SheetHeader>
            <nav className="flex flex-col p-3">{primaryLinks.map((item) => <Link key={item.label} to={item.to} search={"search" in item ? item.search : undefined} onClick={() => setMobileOpen(false)} className="border-b border-border px-3 py-4 text-sm font-semibold">{item.label}</Link>)}</nav>
            {categories.length > 0 && <div className="px-6 py-4"><p className="mb-3 text-xs font-bold uppercase text-muted-foreground">Popular categories</p>{categories.slice(0, 6).map((cat) => <Link key={cat.id} to="/category/$slug" params={{ slug: cat.slug || cat.id }} onClick={() => setMobileOpen(false)} className="block py-2 text-sm">{cat.name}</Link>)}</div>}
          </SheetContent>
        </Sheet>
        <Link to="/" className="font-display text-[1.65rem] text-primary lg:text-3xl">{settings?.shop.name || brand.brandName}</Link>
        <nav className="hidden items-center gap-7 lg:flex">{primaryLinks.map((item) => <Link key={item.label} to={item.to} search={"search" in item ? item.search : undefined} className="text-[13px] font-semibold text-foreground/80 transition-colors hover:text-primary" activeProps={{ className: "text-primary" }}>{item.label}</Link>)}</nav>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" asChild><Link to="/search" aria-label="Search"><Search /></Link></Button>
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex"><Link to="/account" aria-label="Account"><UserRound /></Link></Button>
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex"><Link to="/wishlist" aria-label="Wishlist"><Heart /></Link></Button>
          <Button variant="ghost" size="icon" asChild className="relative"><Link to="/cart" aria-label={`Cart with ${count} items`}><ShoppingBag />{count > 0 && <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{count}</span>}</Link></Button>
        </div>
      </div>
    </header>
    <main>{children}</main>
    {!path.startsWith("/checkout") && <Footer settings={settings} />}
    <PlantAssistant />
  </div>;
}

function Footer({ settings }: { settings?: import("@/types/api").Settings }) {
  return <footer className="border-t bg-secondary"><div className="mx-auto grid max-w-[1480px] gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:px-10">
    <div className="sm:col-span-2"><p className="font-display text-3xl text-primary">{settings?.shop.name || brand.brandName}</p><p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">Plants selected with care, packed securely, and delivered from our nursery to your home.</p>{settings?.plant_guarantee?.enabled && <p className="mt-5 text-sm font-semibold text-primary">{settings.plant_guarantee.label}</p>}</div>
    <FooterColumn title="Shop" links={[['Plants','/plants'],['Combos','/combos'],['Offers','/offers'],['Wishlist','/wishlist']]} />
    <FooterColumn title="Help" links={[['Contact','/contact'],['My orders','/account/orders'],['Plant guarantee','/about'],['Cart','/cart']]} />
    <FooterColumn title="Company" links={[['About','/about'],['Journal','/blog'],['Account','/account'],['Search','/search']]} />
  </div><div className="border-t border-border px-6 py-5 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} {settings?.shop.name || brand.brandName}. Grown thoughtfully.</div></footer>;
}
function FooterColumn({ title, links }: { title: string; links: Array<[string, string]> }) { return <div><h2 className="mb-4 text-sm font-bold">{title}</h2><div className="space-y-3">{links.map(([label, to]) => <Link key={to} to={to} className="block text-sm text-muted-foreground hover:text-primary">{label}</Link>)}</div></div>; }