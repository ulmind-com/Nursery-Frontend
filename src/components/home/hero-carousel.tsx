import { useEffect, useState } from "react";
import type { Banner } from "@/types/api";

const fallbackBanners = [
  { id: "f1", image: "/images/home-hero-no-people.jpg", title: "Bring life to your space" },
  { id: "f2", image: "/images/hero-2.jpg", title: "Green your indoor living" },
  { id: "f3", image: "/images/hero-3.jpg", title: "Breathe fresh air everyday" },
];

export function HeroCarousel({ banners, shopName }: { banners: Banner[]; shopName: string }) {
  let slides = banners.filter((b) => b.active !== false && (b.image || b.video));
  if (slides.length === 0) {
    slides = fallbackBanners as Banner[];
  }

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4000);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="bg-storefront-wash px-3 pt-3 sm:px-6 lg:px-9 lg:pt-3">
      <div className="relative mx-auto h-[230px] w-full max-w-[1480px] overflow-hidden rounded-2xl sm:h-[280px] lg:aspect-[4.58/1] lg:h-auto">
        
        <div 
          className="flex h-full w-full transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div key={slide.id || i} className="relative h-full w-full shrink-0">
              {slide.video ? (
                <video src={slide.video} poster={slide.poster} autoPlay muted loop playsInline className="absolute inset-0 size-full object-cover object-center" />
              ) : (
                <img src={slide.image} alt={slide.title || shopName} className="absolute inset-0 size-full object-cover object-center" />
              )}
              <div className="absolute inset-0 bg-gradient-to-l from-white/95 via-white/60 to-transparent sm:w-2/3 sm:left-auto sm:right-0" />
              <div className="relative flex h-full min-w-0 items-center justify-end px-5 sm:px-10 lg:px-[9%]">
                <div className="w-[60%] min-w-0 text-forest sm:w-[45%] lg:w-[42%] flex flex-col items-start drop-shadow-md sm:drop-shadow-none">
                  <h1 className="max-w-[12ch] text-[1.75rem] font-extrabold leading-[1.08] sm:text-[2.6rem] lg:text-[3.35rem] text-forest mix-blend-normal">
                    {slide.title || "Bring life to your space"}
                  </h1>
                  <a 
                    href="/plants" 
                    className="mt-5 inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:scale-105 sm:mt-7 sm:px-8 sm:py-3 sm:text-base"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((slide, i) => (
              <button
                key={slide.id || i}
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
