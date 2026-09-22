import { Link } from "@tanstack/react-router";

export interface SpotlightPromo {
  id: string;
  titleTop: string;
  titleBottom?: string;
  titleBottomColor?: string;
  image: string;
  link: string;
  buttonText: string;
  buttonTheme: "yellow" | "dark";
  badge?: string;
}

export function SpotlightSection({ promos }: { promos: SpotlightPromo[] }) {
  if (!promos || promos.length === 0) return null;

  return (
    <section className="bg-storefront-wash px-3 py-12 sm:px-6 lg:px-9 lg:py-16">
      <div className="mx-auto max-w-[1480px]">
        
        {/* Header */}
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="relative inline-block">
            <div className="absolute inset-0 -left-2 -right-2 top-1 bottom-1 -z-10 bg-[#e4ff00]" />
            <h2 className="font-display text-3xl font-extrabold text-black sm:text-4xl lg:text-[2.75rem]">
              In the Spotlight
            </h2>
          </div>
          <p className="mt-4 text-base font-medium text-black sm:text-lg lg:text-xl">
            One for the Tadka, One for the Drama
          </p>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-2">
          {promos.map((promo, index) => (
            <div key={promo.id} className="group relative flex aspect-square md:aspect-auto md:h-[500px] w-full flex-col overflow-hidden">
              
              {/* Background Image */}
              <div className="absolute inset-0">
                <img 
                  src={promo.image} 
                  alt={promo.titleTop} 
                  className="size-full object-cover transition-transform duration-700 group-hover:scale-105" 
                />
                {/* Gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Content Overlay */}
              <div className="relative flex h-full flex-col justify-between p-8 sm:p-12">
                
                {/* Text Section */}
                <div className="mt-4">
                  <h3 className="font-display text-4xl font-black uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-6xl drop-shadow-md">
                    {promo.titleTop}
                  </h3>
                  {promo.titleBottom && (
                    <h4 
                      className="mt-1 font-display text-2xl font-bold uppercase tracking-wide drop-shadow-md sm:text-3xl lg:text-4xl"
                      style={{ color: promo.titleBottomColor || "#e4ff00" }}
                    >
                      {promo.titleBottom}
                    </h4>
                  )}
                </div>

                {/* Bottom Section (Badge & Button) */}
                <div className="flex flex-col items-start gap-6">
                  {promo.badge && (
                    <div className="relative flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-lg">
                        <polygon 
                          points="50,0 60,30 95,15 75,45 100,70 70,75 75,100 50,85 25,100 30,75 0,70 25,45 5,15 40,30" 
                          fill="white" 
                        />
                      </svg>
                      <div className="absolute text-center font-bold leading-tight text-forest">
                        <span className="block text-sm">New</span>
                        <span className="block text-sm">Launch</span>
                      </div>
                    </div>
                  )}

                  <Link
                    to={promo.link}
                    className={`inline-flex items-center justify-center rounded-full px-8 py-3.5 text-sm font-bold uppercase tracking-wider transition-transform hover:scale-105 ${
                      promo.buttonTheme === "yellow" 
                        ? "bg-[#e4ff00] text-black hover:bg-[#d7f000]" 
                        : "bg-forest text-white hover:bg-forest/90"
                    }`}
                  >
                    {promo.buttonText}
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
