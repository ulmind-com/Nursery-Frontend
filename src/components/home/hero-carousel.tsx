import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/botanical-hero.jpg";
import type { Banner } from "@/types/api";

export function HeroCarousel({ banners, shopName }: { banners: Banner[]; shopName: string }) {
  const slides = banners.filter((b) => b.active !== false && (b.image || b.video));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(id);
  }, [slides.length]);

  const active = slides[index % (slides.length || 1)];

  return (
    <section className="relative overflow-hidden bg-primary-tint">
      <div className="relative min-h-[66vh] sm:min-h-[70vh]">
        {active ? (
          active.video ? (
            <video key={active.id} src={active.video} poster={active.poster} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover" />
          ) : (
            <img key={active.id} src={active.image} alt={active.title || shopName} className="absolute inset-0 size-full object-cover" />
          )
        ) : (
          <img src={heroImage} alt="Sunlit collection of thriving indoor plants" className="absolute inset-0 size-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-forest/85 via-forest/45 to-transparent" />
        <div className="relative mx-auto flex min-h-[66vh] max-w-[1480px] items-center px-5 py-20 sm:min-h-[70vh] sm:px-6 lg:px-10">
          <div className="max-w-xl text-forest-foreground">
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em]">Grown for Indian homes</p>
            <h1 className="text-4xl leading-[1.08] sm:text-5xl lg:text-6xl">{active?.title || "Bring home something living."}</h1>
            <p className="mt-5 max-w-md text-sm leading-7 text-forest-foreground/85 sm:text-base">
              {active?.subtitle || "Healthy plants, considered planters, and honest care guidance — packed by people who know plants."}
            </p>
            {active?.promo_code && (
              <p className="mt-5 inline-block rounded-full border border-forest-foreground/30 px-4 py-1.5 text-xs font-bold tracking-wide">
                Use code {active.promo_code}
              </p>
            )}
            <div className="mt-8">
              {active?.cta_url ? (
                <Button asChild size="lg"><a href={active.cta_url}>{active.cta_label || "Shop now"} <ArrowRight /></a></Button>
              ) : (
                <Button asChild size="lg"><Link to="/plants" search={{}}>Shop plants <ArrowRight /></Link></Button>
              )}
            </div>
          </div>
        </div>
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === index}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-200 ${i === index ? "w-7 bg-primary" : "w-3 bg-forest-foreground/50"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
