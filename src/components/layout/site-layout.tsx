import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, Home, LayoutGrid, Leaf, Menu, MessageCircle, Search, ShoppingBag, UserRound } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { categoriesApi, queryKeys, settingsApi } from "@/api/services";
import { brand } from "@/config/brand";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { PlantAssistant } from "@/components/layout/plant-assistant";
import { CartDrawer } from "@/components/commerce/cart-drawer";
import type { Settings } from "@/types/api";

function NavLinks({ className, activeClassName, onNavigate }: { className: string; activeClassName?: string; onNavigate?: () => void }) {
  const props = { className, onClick: onNavigate, ...(activeClassName ? { activeProps: { className: activeClassName } } : {}) };
  return (
    <>
      <Link to="/plants" search={{}} {...props}>Plants</Link>
      <Link to="/category/$slug" params={{ slug: "pots" }} {...props}>Pots</Link>
      <Link to="/plants" search={{ q: "plant care" }} {...props}>Plant Care</Link>
      <Link to="/plants" search={{ q: "seeds" }} {...props}>Seeds</Link>
      <Link to="/combos" {...props}>Combos</Link>
      <Link to="/offers" {...props}>Offers</Link>
      <Link to="/blog" {...props}>Journal</Link>
    </>
  );
}

function useRotatingAnnouncement(announcements: string[] | undefined) {
  const [index, setIndex] = useState(0);
  const total = announcements?.length ?? 0;
  useEffect(() => {
    if (total < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % total), 4000);
    return () => clearInterval(id);
  }, [total]);
  return total ? announcements?.[index % total] : undefined;
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { count, openCart } = useCart();
  const { data: settings } = useQuery({ queryKey: queryKeys.settings, queryFn: settingsApi.get, staleTime: 300_000 });
  const { data: categories = [] } = useQuery({ queryKey: queryKeys.categories, queryFn: categoriesApi.list, staleTime: 300_000 });
  const announcement = useRotatingAnnouncement(settings?.announcements);
  const whatsapp = settings?.support?.whatsapp;
  const isCheckout = path.startsWith("/checkout");

  if (isCheckout) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-background">
          <div className="mx-auto grid h-[74px] max-w-[1180px] grid-cols-3 items-center px-4 sm:h-[86px] sm:px-6">
            <span aria-hidden="true" />
            <Link to="/" className="flex items-center justify-center gap-2 font-display text-xl font-extrabold text-forest sm:text-2xl">
              <Leaf className="size-7 fill-primary-soft text-primary" />
              <span>{settings?.shop.name || brand.brandName}</span>
            </Link>
            <Button variant="ghost" size="icon" className="relative justify-self-end" onClick={openCart} aria-label={`Cart with ${count} items`}>
              <ShoppingBag />
              {count > 0 && <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{count}</span>}
            </Button>
          </div>
        </header>
        <main>{children}</main>
        <CartDrawer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {announcement && (
        <div className="bg-forest px-4 py-2 text-center text-[11px] font-semibold text-forest-foreground sm:text-xs">
          <span key={announcement} className="rise-in inline-block">{announcement}</span>
        </div>
      )}
      <header className="sticky top-0 z-40 border-b border-border bg-background/98 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-[1480px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 lg:h-[68px] lg:grid-cols-[220px_minmax(360px,1fr)_220px] lg:gap-8 lg:px-9">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu"><Menu /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88%] p-0">
              <SheetHeader className="border-b p-5 text-left">
                <SheetTitle className="text-2xl text-forest">{settings?.shop.name || brand.brandName}</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-3">
                <NavLinks className="border-b border-border px-3 py-4 text-sm font-semibold" onNavigate={() => setMobileOpen(false)} />
              </nav>
              {categories.length > 0 && (
                <div className="px-6 py-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">Popular categories</p>
                  {categories.slice(0, 6).map((cat) => (
                    <Link key={cat.id} to="/category/$slug" params={{ slug: cat.slug || cat.id }} onClick={() => setMobileOpen(false)} className="block py-2 text-sm">{cat.name}</Link>
                  ))}
                </div>
              )}
            </SheetContent>
          </Sheet>
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold text-forest sm:text-[1.4rem] lg:text-[1.75rem]">
            <Leaf className="hidden size-8 fill-primary-soft text-primary sm:block" />
            <span className="truncate">{settings?.shop.name || brand.brandName}</span>
          </Link>
          <form
            className="relative hidden min-w-0 lg:block"
            onSubmit={(event) => { event.preventDefault(); const q = search.trim(); if (q) void navigate({ to: "/search", search: { q } }); }}
          >
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-forest" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search products" placeholder="Search plants, pots and more" className="h-11 w-full rounded-lg bg-search-surface pl-11 pr-4 text-sm outline-none ring-primary transition-shadow duration-200 placeholder:text-muted-foreground focus:ring-1" />
          </form>
          <div className="flex items-center justify-end gap-0.5">
            <Button variant="ghost" size="icon" asChild className="lg:hidden"><Link to="/search" search={{}} aria-label="Search"><Search /></Link></Button>
            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex"><Link to="/account" aria-label="Account"><UserRound /></Link></Button>
            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex"><Link to="/wishlist" aria-label="Wishlist"><Heart /></Link></Button>
            <Button variant="ghost" size="icon" className="relative" onClick={openCart} aria-label={`Cart with ${count} items`}>
              <ShoppingBag />
              {count > 0 && <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{count}</span>}
            </Button>
          </div>
        </div>
        <nav className="mx-auto hidden h-11 max-w-[1480px] items-center justify-center gap-8 overflow-hidden px-9 lg:flex">
          {categories.slice(0, 7).map((category) => (
            <Link key={category.id} to="/category/$slug" params={{ slug: category.slug || category.id }} className="shrink-0 border-b border-transparent py-3 text-[13px] font-medium text-foreground/80 transition-colors duration-200 hover:text-primary" activeProps={{ className: "border-primary text-primary" }}>{category.name}</Link>
          ))}
          {categories.length === 0 && <NavLinks className="shrink-0 text-[13px] font-medium text-foreground/80 transition-colors duration-200 hover:text-primary" activeClassName="text-primary" />}
        </nav>
      </header>
      <main className="pb-16 lg:pb-0">{children}</main>
      <Footer settings={settings} />
      <MobileTabBar />
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-20 left-4 z-40 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-200 hover:scale-105 lg:bottom-6"
        >
          <MessageCircle className="size-5" />
        </a>
      )}
      <CartDrawer />
      <PlantAssistant />
    </div>
  );
}

function MobileTabBar() {
  const { count, openCart } = useCart();
  const item = "flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-semibold text-muted-foreground";
  const active = { className: `${item} text-primary` };
  return (
    <nav aria-label="Primary" className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background/98 backdrop-blur lg:hidden">
      <Link to="/" className={item} activeProps={active} activeOptions={{ exact: true }}><Home className="size-5" />Home</Link>
      <Link to="/plants" search={{}} className={item} activeProps={active}><LayoutGrid className="size-5" />Shop</Link>
      <Link to="/search" search={{}} className={item} activeProps={active}><Search className="size-5" />Search</Link>
      <Link to="/wishlist" className={item} activeProps={active}><Heart className="size-5" />Wishlist</Link>
      <button type="button" onClick={openCart} className={`${item} relative`}>
        <ShoppingBag className="size-5" />
        {count > 0 && <span className="absolute right-4 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">{count}</span>}
        Cart
      </button>
    </nav>
  );
}

function Footer({ settings }: { settings: Settings | undefined }) {
  const shopName = settings?.shop.name || brand.brandName;
  return (
    <footer className="mt-10 border-t bg-forest text-forest-foreground">
      <div className="mx-auto grid max-w-[1480px] gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-5 lg:px-10">
        <div className="sm:col-span-2">
          <p className="font-display text-2xl font-extrabold">{shopName}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-forest-foreground/75">
            Plants selected with care, packed securely, and delivered from our nursery to your home.
          </p>
          {settings?.plant_guarantee?.enabled && (
            <p className="mt-6 inline-block rounded-full bg-primary px-4 py-1.5 text-xs font-bold text-primary-foreground">{settings.plant_guarantee.label}</p>
          )}
          {settings?.shop.email && <p className="mt-5 text-sm text-forest-foreground/75">{settings.shop.email}</p>}
          {settings?.shop.phone && <p className="text-sm text-forest-foreground/75">{settings.shop.phone}</p>}
        </div>
        <FooterColumn title="Shop" links={[["Plants", "/plants"], ["Combos", "/combos"], ["Offers", "/offers"], ["Wishlist", "/wishlist"]]} />
        <FooterColumn title="Help" links={[["Support", "/support"], ["Shipping", "/shipping"], ["Returns", "/returns"], ["My orders", "/account/orders"]]} />
        <FooterColumn title="Company" links={[["About", "/about"], ["Journal", "/blog"], ["Privacy", "/privacy"], ["Terms", "/terms"]]} />
      </div>
      <div className="border-t border-forest-foreground/15 px-6 py-5">
        <div className="mx-auto flex max-w-[1480px] flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-forest-foreground/70">
            © {new Date().getFullYear()} {shopName}. Grown thoughtfully.
          </p>
          <a
            href="https://www.ulmind.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2.5 text-[13px] font-medium text-forest-foreground/90"
          >
            <span className="opacity-80 transition-opacity group-hover:opacity-100">
              Designed and Developed by
            </span>
            <img
              src="/assets/ulmind.png"
              alt="Ulmind"
              className="h-10 w-auto object-contain transition-all group-hover:scale-105 sm:h-12"
            />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-bold">{title}</h2>
      <div className="space-y-3">
        {links.map(([label, to]) => (
          <a key={to} href={to} className="block text-sm text-forest-foreground/75 transition-colors duration-200 hover:text-primary-foreground">{label}</a>
        ))}
      </div>
    </div>
  );
}
