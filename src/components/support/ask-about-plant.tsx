/* "Still deciding?" strip on a product page. It opens Help & Support with this
   plant already attached, so a handoff lands in the admin queue naming the
   exact product the customer was looking at. */
import { Link } from "@tanstack/react-router";
import { Headset, Leaf } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useSupportChat } from "@/contexts/support-chat-context";
import { Button } from "@/components/ui/button";

export function AskAboutPlant({ productId, title }: { productId: string; title: string }) {
  const { isAuthenticated } = useAuth();
  const support = useSupportChat();

  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-primary/15 bg-primary-tint p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Leaf className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-bold text-forest">Not sure if {title} suits your space?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Ask our nursery team about light, watering or pot size — we reply in minutes.
            </p>
          </div>
        </div>
        {isAuthenticated ? (
          <Button className="h-11 shrink-0 rounded-full px-6" onClick={() => support.open({ productId })}>
            <Headset className="size-4" aria-hidden="true" /> Ask the nursery
          </Button>
        ) : (
          <Button asChild className="h-11 shrink-0 rounded-full px-6">
            <Link to="/login"><Headset className="size-4" aria-hidden="true" /> Ask the nursery</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
