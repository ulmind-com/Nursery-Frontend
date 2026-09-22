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
            <div className="absolute inset-0 -left-3 -right-3 top-1.5 bottom-1.5 -z-10 bg-[#eaff00]" />
            <h2 className="font-display text-3xl font-extrabold text-black sm:text-4xl lg:text-5xl">
              In the Spotlight
            </h2>
          </div>
          <p className="mt-4 text-base font-medium text-black sm:text-lg">
            One for the Tadka, One for the Drama
          </p>
        </div>

        {/* Promo Grid */}
        <div className="grid grid-cols-1 overflow-hidden shadow-md md:grid-cols-2">
          {promos.map((promo, index) => {
            const isLeft = index === 0;
            return (
              <div key={promo.id} className="group relative flex aspect-[4/5] md:aspect-auto md:h-[550px] w-full flex-col overflow-hidden">
                
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img 
                    src={promo.image} 
                    alt={promo.titleTop} 
                    className="size-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  {/* Subtle top-left gradient ONLY for text readability without darkening whole image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/10 to-transparent opacity-80" />
                </div>

                {/* Content Overlay */}
                <div className="relative flex h-full w-full flex-col p-8 sm:p-10">
                  
                  {/* Text Section (Top Left) */}
                  <div className="relative z-10 max-w-[80%]">
                    {/* Decorative Sparkles for Left Card */}
                    {isLeft && (
                      <>
                        <svg className="absolute -left-6 top-6 h-6 w-6 text-[#eaff00] drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
                        <svg className="absolute right-0 -top-4 h-5 w-5 text-[#eaff00] drop-shadow-md" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M2 12h20"/></svg>
                      </>
                    )}
                    
                    <h3 className={`font-display font-black uppercase leading-[1.1] tracking-tight text-white drop-shadow-lg ${isLeft ? 'text-4xl sm:text-5xl lg:text-[4rem]' : 'text-4xl sm:text-5xl lg:text-[4.5rem]'}`}>
                      {promo.titleTop}
                    </h3>
                    {promo.titleBottom && (
                      <h4 
                        className="mt-1 font-display text-2xl font-bold uppercase tracking-widest drop-shadow-lg sm:text-3xl lg:text-[2rem]"
                        style={{ color: promo.titleBottomColor || "#eaff00" }}
                      >
                        {promo.titleBottom}
                      </h4>
                    )}
                  </div>

                  {/* Badges and Buttons */}
                  {promo.badge && (
                    <div className="absolute bottom-20 left-1/2 -translate-x-1/2 md:bottom-12 md:left-auto md:right-[40%] md:translate-x-0">
                      <div className="relative flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-[100px] h-[100px] drop-shadow-xl drop-shadow-black/20">
                          <polygon 
                            points="50,0 62,25 90,15 75,40 100,60 70,70 75,98 50,80 25,98 30,70 0,60 25,40 10,15 38,25" 
                            fill="white" 
                          />
                        </svg>
                        <div className="absolute text-center font-bold leading-none text-forest">
                          <span className="block text-[15px]">New</span>
                          <span className="block text-[15px]">Launch</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <Link
                    to={promo.link}
                    className={`absolute bottom-8 z-20 inline-flex items-center justify-center rounded-full px-8 py-3 text-[15px] font-extrabold uppercase tracking-wide shadow-lg transition-transform hover:scale-105 ${
                      promo.buttonTheme === "yellow" 
                        ? "bg-[#eaff00] text-black hover:bg-[#d7f000]" 
                        : "bg-[#0b291a] text-white hover:bg-black"
                    } ${isLeft ? 'left-1/2 -translate-x-1/2' : 'right-8'}`}
                  >
                    {promo.buttonText}
                  </Link>

                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
