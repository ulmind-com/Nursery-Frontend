/* The frame every account screen sits in.
 *
 * Desktop gets a sticky rail: an identity card on top, then the sections.
 * A phone gets the same list as a horizontally scrolling tab strip, so the
 * whole account is one thumb-swipe away without stacking a menu above every
 * page. Signed-out visitors never reach the frame — they get one clear
 * invitation to sign in instead.
 */

import { Link, useLocation } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
  Heart,
  LayoutGrid,
  LogOut,
  MapPin,
  Package,
  ShieldCheck,
  Star,
  Ticket,
  UserRound,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { EmptyState, PageSkeleton } from "@/components/shared/page-state";
import { cn } from "@/lib/utils";

export interface AccountLink {
  to: string;
  label: string;
  icon: LucideIcon;
  hint: string;
}

export const ACCOUNT_LINKS: AccountLink[] = [
  { to: "/account", label: "Overview", icon: LayoutGrid, hint: "Everything at a glance" },
  { to: "/account/profile", label: "Profile", icon: UserRound, hint: "Photo, name and phone" },
  { to: "/account/addresses", label: "Addresses", icon: MapPin, hint: "Where your plants arrive" },
  { to: "/account/orders", label: "Orders", icon: Package, hint: "Track, cancel and reorder" },
  { to: "/wishlist", label: "Wishlist", icon: Heart, hint: "Plants you're saving for" },
  { to: "/account/reviews", label: "Reviews", icon: Star, hint: "What you've written" },
  { to: "/account/coupons", label: "Coupons", icon: Ticket, hint: "Offers you can use today" },
  { to: "/account/security", label: "Security", icon: ShieldCheck, hint: "Password and sign-out" },
];

/** Initials are the fallback avatar — always better than an empty circle. */
export function initials(name: string | undefined): string {
  const parts = (name ?? "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "🌱";
  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({ src, name, size = 56 }: { src?: string | null | undefined; name?: string | undefined; size?: number }) {
  return (
    <span
      className="relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-primary-tint ring-2 ring-primary/25"
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt={name ?? ""} className="size-full object-cover" />
      ) : (
        <span className="font-display font-bold text-primary" style={{ fontSize: size * 0.36 }}>
          {initials(name)}
        </span>
      )}
    </span>
  );
}

function isCurrent(pathname: string, to: string): boolean {
  // "/account" must not light up for every child route beneath it.
  return to === "/account" ? pathname === "/account" : pathname.startsWith(to);
}

export function AccountShell({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description?: string | undefined;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const { pathname } = useLocation();

  if (loading) return <PageSkeleton />;

  if (!user)
    return (
      <div className="mx-auto max-w-2xl px-5 py-16 sm:px-6">
        <EmptyState
          title="Sign in to your account"
          description="See your orders, manage addresses, and keep your wishlist close."
          action={
            <Button asChild>
              <Link to="/login">Sign in</Link>
            </Button>
          }
        />
      </div>
    );

  return (
    <div className="bg-storefront-wash">
      <div className="mx-auto max-w-[1280px] px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="lg:grid lg:grid-cols-[264px_minmax(0,1fr)] lg:gap-8">
          {/* ── Rail ── */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="surface-card flex items-center gap-3 p-4 lg:p-5">
              <Avatar src={user.avatar} name={user.name} size={52} />
              <div className="min-w-0">
                <p className="truncate font-display text-base font-bold text-forest">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>

            {/* Phone: one swipeable strip. Desktop: a stacked list. */}
            <nav
              aria-label="Account sections"
              className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] lg:mt-4 lg:flex-col lg:gap-1 lg:overflow-visible lg:pb-0 [&::-webkit-scrollbar]:hidden"
            >
              {ACCOUNT_LINKS.map(({ to, label, icon: Icon }) => {
                const active = isCurrent(pathname, to);
                return (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      "flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition lg:w-full lg:rounded-xl lg:px-3.5",
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-card text-forest hover:border-primary/50 hover:bg-primary-tint",
                    )}
                  >
                    <Icon className="size-4 shrink-0" aria-hidden="true" />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <Button
              variant="ghost"
              onClick={logout}
              className="mt-3 hidden w-full justify-start gap-2 text-sm text-muted-foreground hover:text-destructive lg:flex"
            >
              <LogOut className="size-4" aria-hidden="true" /> Sign out
            </Button>
          </aside>

          {/* ── Screen ── */}
          <main className="mt-6 min-w-0 lg:mt-0">
            <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <h1 className="font-display text-[1.75rem] font-extrabold leading-tight text-forest sm:text-4xl">
                  {title}
                </h1>
                {description && (
                  <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">{description}</p>
                )}
              </div>
              {action}
            </header>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
