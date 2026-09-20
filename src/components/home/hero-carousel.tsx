import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/home-hero-no-people.jpg";
import type { Banner } from "@/types/api";

export function HeroCarousel({ banners, shopName }: { banners: Banner[]; shopName: string }) {
  const slides = banners.filter((b) => b.active !== false && (b.image || b.video));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const active = slides[index % (slides.length || 1)];

  return (
    <section className="bg-storefront-wash px-3 pt-3 sm:px-6 lg:px-9 lg:pt-3">
      <div className="relative mx-auto h-[230px] w-full max-w-[1480px] overflow-hidden rounded-xl sm:h-[280px] lg:aspect-[4.55/1] lg:h-auto">
        {active ? (
          active.video ? (
            <video key={active.id} src={active.video} poster={active.poster} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" />
          ) : (
            <img key={active.id} src={active.image} alt={active.title || shopName} className="absolute inset-0 size-full object-cover" />
          )
        ) : (
          <img src={heroImage} alt="Sunlit collection of thriving indoor plants" width={1920} height={640} fetchPriority="high" className="absolute inset-0 size-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/90" />
        <div className="relative flex h-full min-w-0 items-center justify-end px-4 py-6 sm:px-10 lg:px-[8%]">
          <div className="w-[52%] min-w-0 max-w-xl text-forest sm:w-[46%]">
            <h1 className="text-[1.65rem] leading-[1.05] sm:text-4xl lg:text-[3.25rem]">{active?.title || "Bring life to your space"}</h1>
            <p className="mt-2 line-clamp-2 max-w-md text-[11px] leading-4 text-foreground/70 sm:mt-3 sm:text-sm sm:leading-6">
              {active?.subtitle || "Healthy plants, considered planters, and honest care guidance — packed by people who know plants."}
            </p>
            {active?.promo_code && (
              <p className="mt-3 inline-block rounded-full border border-primary/30 px-3 py-1 text-[10px] font-bold">
                Use code {active.promo_code}
              </p>
            )}
            <div className="mt-3 sm:mt-5">
              {active?.cta_url ? (
                <Button asChild size="sm"><a href={active.cta_url}>{active.cta_label || "Shop now"} <ArrowRight /></a></Button>
              ) : (
                <Button asChild size="sm"><Link to="/plants" search={{}}>Shop plants <ArrowRight /></Link></Button>
              )}
            </div>
          </div>
        </div>
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-200 ${i === index ? "w-7 bg-primary" : "w-3 bg-foreground/30"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
