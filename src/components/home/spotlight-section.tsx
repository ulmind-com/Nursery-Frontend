import { Link } from "@tanstack/react-router";

export interface SpotlightPromo {
  id: string;
  image: string;
  link: string;
  alt: string;
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
        <div className="grid grid-cols-1 overflow-hidden shadow-md md:grid-cols-2 border-r border-storefront-wash">
          {promos.map((promo) => (
            <Link key={promo.id} to={promo.link} className="group relative flex aspect-square md:aspect-[4/3] lg:aspect-auto lg:h-[550px] w-full overflow-hidden bg-background">
              <img 
                src={promo.image} 
                alt={promo.alt} 
                className="size-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
