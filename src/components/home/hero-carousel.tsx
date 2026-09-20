import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/nursery-banner-reference.jpg";
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
    <section className="bg-storefront-wash px-3 pt-3 sm:px-6 sm:pt-4 lg:px-9">
      <div className="relative mx-auto aspect-[16/7] min-h-[250px] max-w-[1480px] overflow-hidden rounded-xl sm:aspect-[16/5] sm:min-h-[290px]">
        {active ? (
          active.video ? (
            <video key={active.id} src={active.video} poster={active.poster} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" />
          ) : (
            <img key={active.id} src={active.image} alt={active.title || shopName} className="absolute inset-0 size-full object-cover" />
          )
        ) : (
          <img src={heroImage} alt="Sunlit collection of thriving indoor plants" width={1920} height={720} className="absolute inset-0 size-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-background/5 to-background/92" />
        <div className="relative flex h-full items-center justify-end px-5 py-8 sm:px-10 lg:px-16">
          <div className="w-[54%] max-w-xl text-forest sm:w-[48%]">
            <p className="mb-2 hidden text-[11px] font-bold uppercase text-primary sm:block">Grown for Indian homes</p>
            <h1 className="text-2xl leading-[1.08] sm:text-4xl lg:text-5xl">{active?.title || "Bring life to your space"}</h1>
            <p className="mt-3 line-clamp-2 max-w-md text-xs leading-5 text-foreground/70 sm:text-sm sm:leading-6">
              {active?.subtitle || "Healthy plants, considered planters, and honest care guidance — packed by people who know plants."}
            </p>
            {active?.promo_code && (
              <p className="mt-3 inline-block rounded-full border border-primary/30 px-3 py-1 text-[10px] font-bold">
                Use code {active.promo_code}
              </p>
            )}
            <div className="mt-4 sm:mt-5">
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
