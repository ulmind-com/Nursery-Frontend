import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart, Home, LayoutGrid, Menu, Search, ShoppingBag, UserRound } from "lucide-react";
import { memo, type ReactNode, useEffect, useState } from "react";
import { categoriesApi, queryKeys, settingsApi } from "@/api/services";
import { navCategories } from "@/lib/nav-categories";
import { displayName } from "@/config/brand";
import { BrandLogo } from "@/components/layout/brand-logo";
import { useTypewriter } from "@/hooks/use-typewriter";
import { SEARCH_PHRASES } from "@/lib/search-phrases";
import { useAuth } from "@/contexts/auth-context";
import { useCart } from "@/contexts/cart-context";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Avatar } from "@/components/account/account-shell";
import { AccountMenu } from "@/components/layout/account-menu";
import { SupportChat } from "@/components/support/support-chat";

import { CartDrawer } from "@/components/commerce/cart-drawer";
import type { Settings } from "@/types/api";

function NavLinks({
  className,
  activeClassName,
  onNavigate,
}: {
  className: string;
  activeClassName?: string;
  onNavigate?: () => void;
}) {
  const props = {
    className,
    onClick: onNavigate,
    ...(activeClassName ? { activeProps: { className: activeClassName } } : {}),
  };
  return (
    <>
      <Link to="/plants" search={{}} {...props}>
        Plants
      </Link>
      <Link to="/category/$slug" params={{ slug: "pots" }} {...props}>
        Pots
      </Link>
      <Link to="/plants" search={{ q: "plant care" }} {...props}>
        Plant Care
      </Link>
      <Link to="/plants" search={{ q: "seeds" }} {...props}>
        Seeds
      </Link>
      <Link to="/combos" {...props}>
        Combos
      </Link>
      <Link to="/gifting" {...props}>
        Gifting
      </Link>
      <Link to="/corporate-gifts" {...props}>
        Corporate Gifts
      </Link>
      <Link to="/garden-services" {...props}>
        Garden Services
      </Link>
      <Link to="/offers" {...props}>
        Offers
      </Link>
      <Link to="/blog" {...props}>
        Journal
      </Link>
      <Link to="/locate-store" {...props}>
        Locate Store
      </Link>
    </>
  );
}

/**
 * Announcement strip — every live offer drifting right to left on a loop.
 *
 * Two identical tracks sit side by side so the loop never shows a seam, and the
 * drift pauses on hover (and for anyone who prefers reduced motion).
 */
const AnnounceRow = ({ items, hidden = false }: { items: string[]; hidden?: boolean }) => (
  <div
    aria-hidden={hidden || undefined}
    className="flex shrink-0 animate-announce-marquee items-center group-hover/announce:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]"
  >
    {items.map((line, index) => (
      <span key={`${line}-${index}`} className="flex items-center whitespace-nowrap">
        {line}
        <span aria-hidden className="px-5 text-forest-foreground/45 sm:px-7">
          •
        </span>
      </span>
    ))}
  </div>
);

/**
 * Announcement strip — every live offer drifting right to left on a loop.
 *
 * Memoised, and the rows live outside the component: a re-render from anywhere
 * else in the layout would otherwise remount the track and restart the
 * animation mid-scroll, which reads as a judder.
 */
const AnnouncementBar = memo(function AnnouncementBar({
  announcements,
}: {
  announcements: string[] | undefined;
}) {
  const items = (announcements ?? []).filter((line) => line.trim());
  if (items.length === 0) return null;

  // Short lists are repeated so the track is always wider than the viewport.
  const track = items.length < 4 ? [...items, ...items, ...items] : [...items, ...items];

  return (
    <div className="group/announce flex overflow-hidden bg-forest py-2 text-[11px] font-semibold text-forest-foreground sm:text-xs">
      <AnnounceRow items={track} />
      <AnnounceRow items={track} hidden />
    </div>
  );
});

/**
 * Header search — kept separate so the typing placeholder re-renders this field
 * alone instead of the whole site shell several times a second.
 */
function HeaderSearch() {
  const [search, setSearch] = useState("");
  const placeholder = useTypewriter(SEARCH_PHRASES);
  const navigate = useNavigate();
  return (
    <form
      className="relative hidden min-w-0 lg:block"
      onSubmit={(event) => {
        event.preventDefault();
        const q = search.trim();
        if (q) void navigate({ to: "/search", search: { q } });
      }}
    >
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-forest" />
      <input
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        aria-label="Search products"
        placeholder={placeholder}
        className="h-11 w-full rounded-lg bg-search-surface pl-11 pr-4 text-sm outline-none ring-primary transition-shadow duration-200 placeholder:text-muted-foreground focus:ring-1"
      />
    </form>
  );
}

export function SiteLayout({ children }: { children: ReactNode }) {
  const path = useRouterState({ select: (state) => state.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { count, openCart } = useCart();
  const { data: settings } = useQuery({
    queryKey: queryKeys.settings,
    queryFn: settingsApi.get,
    staleTime: 300_000,
  });
  const { data: allCategories = [] } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.list,
    staleTime: 300_000,
  });
  /* Home-section trees (Shop by Space) stay out of the shop navigation */
  const categories = navCategories(allCategories);

  const whatsapp = settings?.support?.whatsapp || "918537861040";
  const isCheckout = path.startsWith("/checkout");

  if (isCheckout) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <header className="border-b border-border bg-background">
          <div className="mx-auto grid h-[74px] max-w-[1180px] grid-cols-3 items-center px-4 sm:h-[86px] sm:px-6">
            <span aria-hidden="true" />
            <div className="flex justify-center">
              <BrandLogo name={displayName(settings?.shop.name)} />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="relative justify-self-end"
              data-cart-target
              onClick={openCart}
              aria-label={`Cart with ${count} items`}
            >
              <ShoppingBag />
              {count > 0 && (
                <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
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
      <AnnouncementBar announcements={settings?.announcements} />
      <header className="sticky top-0 z-40 border-b border-border bg-background/98 backdrop-blur-md">
        <div className="mx-auto grid h-16 max-w-[1480px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6 lg:h-[68px] lg:grid-cols-[220px_minmax(360px,1fr)_220px] lg:gap-8 lg:px-9">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[88%] p-0">
              <SheetHeader className="border-b p-5 text-left">
                <SheetTitle asChild>
                  <BrandLogo name={displayName(settings?.shop.name)} asLink={false} />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col p-3">
                <NavLinks
                  className="border-b border-border px-3 py-4 text-sm font-semibold"
                  onNavigate={() => setMobileOpen(false)}
                />
              </nav>
              {categories.length > 0 && (
                <div className="px-6 py-4">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                    Popular categories
                  </p>
                  {categories.slice(0, 6).map((cat) => (
                    <Link
                      key={cat.id}
                      to="/category/$slug"
                      params={{ slug: cat.slug || cat.id }}
                      onClick={() => setMobileOpen(false)}
                      className="block py-2 text-sm"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              )}
            </SheetContent>
          </Sheet>
          <BrandLogo name={displayName(settings?.shop.name)} />
          <HeaderSearch />
          <div className="flex items-center justify-end gap-0.5">
            <Button variant="ghost" size="icon" asChild className="lg:hidden">
              <Link to="/search" search={{}} aria-label="Search">
                <Search />
              </Link>
            </Button>
            <AccountMenu />
            <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
              <Link to="/wishlist" aria-label="Wishlist">
                <Heart />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              data-cart-target
              onClick={openCart}
              aria-label={`Cart with ${count} items`}
            >
              <ShoppingBag />
              {count > 0 && (
                <span className="absolute right-0 top-0 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                  {count}
                </span>
              )}
            </Button>
          </div>
        </div>
        <nav className="mx-auto hidden h-11 max-w-[1480px] items-center justify-center gap-8 overflow-hidden px-9 lg:flex">
          {categories.slice(0, 7).map((category) => (
            <Link
              key={category.id}
              to="/category/$slug"
              params={{ slug: category.slug || category.id }}
              className="shrink-0 border-b border-transparent py-3 text-[13px] font-medium text-foreground/80 transition-colors duration-200 hover:text-primary"
              activeProps={{ className: "border-primary text-primary" }}
            >
              {category.name}
            </Link>
          ))}
          {categories.length === 0 && (
            <NavLinks
              className="shrink-0 text-[13px] font-medium text-foreground/80 transition-colors duration-200 hover:text-primary"
              activeClassName="text-primary"
            />
          )}
        </nav>
      </header>
      <main>{children}</main>
      {/* Clears the fixed mobile tab bar so the footer is never cut off. */}
      <div className="pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))] lg:pb-0">
        <Footer settings={settings} />
      </div>
      <MobileTabBar />
      <SupportChat />
      {whatsapp && (
        <a
          href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-[calc(8rem+env(safe-area-inset-bottom,0px))] right-3 z-40 transition-transform duration-200 hover:scale-110 sm:right-4 lg:bottom-24"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 175.216 175.552"
            className="size-14 drop-shadow-xl sm:size-16 lg:size-[4.5rem]"
          >
            <defs>
              <linearGradient
                id="wa-bg"
                x1="85.915"
                x2="86.535"
                y1="32.567"
                y2="137.092"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0" stopColor="#57d163" />
                <stop offset="1" stopColor="#23b33a" />
              </linearGradient>
            </defs>
            <path
              fill="url(#wa-bg)"
              d="M87.184 25.227c-33.733 0-61.166 27.423-61.178 61.13a60.98 60.98 0 0 0 9.349 32.535l1.455 2.313-6.179 22.558 23.146-6.069 2.235 1.324a61.22 61.22 0 0 0 31.129 8.481h.032c33.707 0 61.14-27.426 61.153-61.135a60.75 60.75 0 0 0-17.895-43.251 60.75 60.75 0 0 0-43.247-17.886z"
            />
            <path
              fill="#fff"
              fillRule="evenodd"
              d="M68.772 55.603c-1.378-3.061-2.828-3.123-4.137-3.176l-3.524-.043c-1.226 0-3.218.46-4.902 2.3s-6.435 6.287-6.435 15.332 6.588 17.785 7.506 19.013 12.718 20.381 31.405 27.75c15.529 6.124 18.689 4.906 22.061 4.6s10.877-4.447 12.408-8.74 1.532-7.971 1.073-8.74-1.685-1.226-3.525-2.146-10.877-5.367-12.562-5.981-2.91-.919-4.137.921-4.746 5.979-5.819 7.206-2.144 1.381-3.984.462-7.76-2.861-14.784-9.124c-5.465-4.873-9.154-10.891-10.228-12.73s-.114-2.835.808-3.751c.825-.824 1.838-2.147 2.759-3.22s1.224-1.84 1.836-3.065.307-2.301-.153-3.22-4.032-10.011-5.666-13.647"
            />
          </svg>
        </a>
      )}
      <CartDrawer />
    </div>
  );
}

function MobileTabBar() {
  const { count, openCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  /* Six thumb targets across a 375px phone: no side padding on the items and a
     tight label, so nothing wraps on the narrowest screens we support. */
  const item =
    "flex min-w-0 flex-1 flex-col items-center gap-1 px-0.5 py-2 text-[10px] font-semibold text-muted-foreground";
  const active = { className: `${item} text-primary` };
  return (
    <nav
      aria-label="Primary"
      className="safe-bottom fixed inset-x-0 bottom-0 z-40 flex border-t border-border bg-background/98 backdrop-blur lg:hidden"
    >
      <Link to="/" className={item} activeProps={active} activeOptions={{ exact: true }}>
        <Home className="size-5" />
        Home
      </Link>
      <Link to="/plants" search={{}} className={item} activeProps={active}>
        <LayoutGrid className="size-5" />
        Shop
      </Link>
      <Link to="/search" search={{}} className={item} activeProps={active}>
        <Search className="size-5" />
        Search
      </Link>
      <Link to="/wishlist" className={item} activeProps={active}>
        <Heart className="size-5" />
        Wishlist
      </Link>
      <button type="button" data-cart-target onClick={openCart} className={item}>
        {/* The badge hangs off the icon, not the tab — the tabs got narrower
            when Profile joined them, and a tab-anchored badge drifts. */}
        <span className="relative">
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <span className="absolute -right-2 -top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
              {count}
            </span>
          )}
        </span>
        Cart
      </button>
      {/* Signed in, the tab shows the customer's own photo — the account is
          where they left it, not a generic icon to go looking for. */}
      <Link to={isAuthenticated ? "/account" : "/login"} className={item} activeProps={active}>
        {isAuthenticated ? (
          <Avatar src={user?.avatar} name={user?.name} size={20} className="ring-1" />
        ) : (
          <UserRound className="size-5" />
        )}
        {isAuthenticated ? "Profile" : "Sign in"}
      </Link>
    </nav>
  );
}

import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Youtube,
  Truck,
  HandCoins,
  Headphones,
  PackageOpen,
} from "lucide-react";

function Footer({ settings }: { settings: Settings | undefined }) {
  const shopName = displayName(settings?.shop.name);

  return (
    <footer className="mt-10 border-t bg-forest text-forest-foreground">
      {/* Feature Strip */}
      <div className="border-b border-forest-foreground/15">
        <div className="mx-auto grid max-w-[1480px] grid-cols-1 gap-6 px-6 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
          <div className="flex items-start gap-4">
            <PackageOpen className="size-8 shrink-0 text-primary-soft" />
            <div>
              <h3 className="font-bold text-sm tracking-wide">100,000+ Plants Delivered</h3>
              <p className="mt-1 text-xs text-forest-foreground/75">Found great new homes!</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <HandCoins className="size-8 shrink-0 text-primary-soft" />
            <div>
              <h3 className="font-bold text-sm tracking-wide">Cash on Delivery</h3>
              <p className="mt-1 text-xs text-forest-foreground/75">Available across India!</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Truck className="size-8 shrink-0 text-primary-soft" />
            <div>
              <h3 className="font-bold text-sm tracking-wide">Fast & Safe Delivery</h3>
              <p className="mt-1 text-xs text-forest-foreground/75">Packaged with Care and Love!</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Headphones className="size-8 shrink-0 text-primary-soft" />
            <div>
              <h3 className="font-bold text-sm tracking-wide">Help & Support</h3>
              <p className="mt-1 text-xs text-forest-foreground/75">Friendly & Quick!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto grid max-w-[1480px] gap-12 px-6 py-16 lg:grid-cols-[2fr_1fr_1.5fr] lg:gap-16 lg:px-10">
        {/* About Section */}
        <div>
          <div className="mb-5">
            <BrandLogo name={shopName} tone="light" asLink={false} />
          </div>
          <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-forest-foreground/70">
            About {shopName}
          </h2>
          <p className="text-sm leading-relaxed text-forest-foreground/75">
            {shopName} is a platform for Urban India to stay close to nature. Every city turning
            into a concrete jungle now, {shopName} offers unique solutions for every person with
            beautiful plants, pots & decorative knick-knacks to create your green patch. We strive
            to be the perfect Urban solution with our unique products developed keeping you in mind.
          </p>
        </div>

        {/* Quick Links */}
        <FooterColumn
          title="Quick Links"
          links={[
            ["Contact Us", "/support"],
            ["Search", "/search"],
            ["FAQ", "/support"],
            ["Blog", "/blog"],
            ["About Us", "/about"],
            ["Terms & Conditions", "/terms"],
            ["Cancellation & Return Policy", "/returns"],
            ["Terms of Service", "/terms"],
            ["Refund policy", "/returns"],
          ]}
        />

        {/* Newsletter Section */}
        <div>
          <h2 className="mb-6 text-xs font-bold uppercase tracking-wider">Newsletter</h2>
          <p className="mb-4 text-sm leading-relaxed text-forest-foreground/75">
            Subscribe to our newsletter to get the latest updates about new launches and discounts!
          </p>
          <form
            className="mt-4 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Your email"
              className="h-11 w-full rounded-md bg-white/10 px-4 text-sm text-forest-foreground placeholder:text-forest-foreground/50 outline-none ring-primary focus:ring-1"
              required
            />
            <button
              type="submit"
              className="h-11 whitespace-nowrap rounded-md bg-primary px-6 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-forest-foreground/15 px-6 py-6">
        <div className="mx-auto flex max-w-[1480px] flex-col items-center justify-between gap-6 sm:flex-row sm:items-center">
          {/* Copyright (Left) */}
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs text-forest-foreground/70">
              © {new Date().getFullYear()} {shopName}. Grown thoughtfully.
            </p>
          </div>

          {/* Developer Credit (Center) */}
          <div className="flex-1 flex justify-center">
            <a
              href="https://www.ulmind.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-1.5 text-[13px] font-medium text-forest-foreground/90"
            >
              <span className="opacity-80 transition-opacity group-hover:opacity-100">
                Designed and Developed by
              </span>
              <img
                src="/assets/ulmind.png"
                alt="Ulmind"
                className="h-11 w-auto object-contain transition-all group-hover:scale-105 sm:h-12"
              />
            </a>
          </div>

          {/* Socials (Right) */}
          <div className="flex-1 flex flex-col items-center gap-3 sm:items-end">
            <p className="text-xs font-semibold text-forest-foreground/80">Follow Us</p>
            <div className="flex gap-3">
              <a
                href="#"
                className="flex size-8 items-center justify-center rounded-full bg-forest-foreground/10 text-forest-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Facebook className="size-4" />
              </a>
              <a
                href="#"
                className="flex size-8 items-center justify-center rounded-full bg-forest-foreground/10 text-forest-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Twitter className="size-4" />
              </a>
              <a
                href="#"
                className="flex size-8 items-center justify-center rounded-full bg-forest-foreground/10 text-forest-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Instagram className="size-4" />
              </a>
              <a
                href="#"
                className="flex size-8 items-center justify-center rounded-full bg-forest-foreground/10 text-forest-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Youtube className="size-4" />
              </a>
              <a
                href="#"
                className="flex size-8 items-center justify-center rounded-full bg-forest-foreground/10 text-forest-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                <Linkedin className="size-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: Array<[string, string]> }) {
  return (
    <div>
      <h2 className="mb-6 text-xs font-bold uppercase tracking-wider">{title}</h2>
      <div className="space-y-3.5">
        {links.map(([label, to]) => (
          <a
            key={label}
            href={to}
            className="block text-sm text-forest-foreground/75 transition-colors duration-200 hover:text-primary-foreground"
          >
            {label}
          </a>
        ))}
      </div>
    </div>
  );
}
