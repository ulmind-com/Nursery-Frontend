/* The identity control in the header.
 *
 * Signed out it's a plain icon that leads to sign-in. Once someone has an
 * account — and especially when they came in through Google, which hands us a
 * photo — their face belongs in the corner of the site: it's the fastest
 * confirmation that they're signed in as themselves, and it turns the account
 * area into one tap instead of a hunt through a menu.
 */
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, LogOut, Package, Ticket, UserRound } from "lucide-react";
import { toast } from "sonner";
import { Avatar } from "@/components/account/account-shell";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth-context";

const LINKS = [
  { to: "/account", label: "My account", icon: UserRound },
  { to: "/account/orders", label: "My orders", icon: Package },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
  { to: "/account/coupons", label: "Coupons", icon: Ticket },
] as const;

export function AccountMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <Button variant="ghost" size="icon" asChild aria-label="Sign in">
        <Link to="/login">
          <UserRound />
        </Link>
      </Button>
    );
  }

  const firstName = (user.name || "there").split(" ")[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={`Account — signed in as ${user.name}`}
          className="group relative ml-0.5 flex size-9 shrink-0 items-center justify-center rounded-full outline-none transition-transform duration-200 hover:scale-105 focus-visible:ring-2 focus-visible:ring-primary/50 lg:size-10"
        >
          {/* A soft ring rather than a hard border — it reads as a portrait,
              not a button with a photo stuffed inside it. */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/70 to-forest opacity-90 transition-opacity duration-200 group-hover:opacity-100" />
          <Avatar
            src={user.avatar}
            name={user.name}
            size={32}
            className="relative ring-2 ring-background lg:size-9"
          />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={10} className="w-64 rounded-2xl p-2">
        <div className="flex items-center gap-3 rounded-xl bg-primary-tint px-3 py-3">
          <Avatar src={user.avatar} name={user.name} size={40} />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-forest">Hi {firstName} 👋</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="mt-1.5">
          {LINKS.map(({ to, label, icon: Icon }) => (
            <DropdownMenuItem key={to} asChild className="rounded-xl px-3 py-2.5">
              <Link to={to}>
                <Icon className="size-4 text-primary" />
                <span className="text-sm font-semibold">{label}</span>
              </Link>
            </DropdownMenuItem>
          ))}
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="rounded-xl px-3 py-2.5 text-destructive focus:text-destructive"
          onSelect={() => {
            logout();
            toast.success("Signed out");
            void navigate({ to: "/" });
          }}
        >
          <LogOut className="size-4" />
          <span className="text-sm font-semibold">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
