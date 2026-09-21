import { useEffect, useState } from "react";
const heroImage = "/images/home-hero-no-people.jpg";
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
      <div className="relative mx-auto h-[230px] w-full max-w-[1480px] overflow-hidden rounded-2xl sm:h-[280px] lg:aspect-[4.58/1] lg:h-auto">
        {active ? (
          active.video ? (
            <video key={active.id} src={active.video} poster={active.poster} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover object-center" />
          ) : (
            <img key={active.id} src={active.image} alt={active.title || shopName} className="absolute inset-0 size-full object-cover object-center" />
          )
        ) : (
          <img src={heroImage} alt="Sunlit collection of thriving indoor plants" width={1920} height={640} fetchPriority="high" className="absolute inset-0 size-full object-cover object-center" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-background/35" />
        <div className="relative flex h-full min-w-0 items-center justify-end px-5 sm:px-10 lg:px-[9%]">
          <div className="w-[48%] min-w-0 text-forest sm:w-[45%] lg:w-[42%]">
            <h1 className="max-w-[12ch] text-[1.75rem] leading-[1.08] sm:text-[2.6rem] lg:text-[3.35rem]">{active?.title || "Bring life to your space"}</h1>
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
