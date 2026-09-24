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
    <section className="bg-storefront-wash py-12 lg:py-16">
      {/* Header */}
      <div className="mx-auto mb-10 flex max-w-[1480px] flex-col items-center px-3 text-center sm:px-6 lg:px-9">
        <div className="relative inline-block">
          <div className="absolute bottom-1.5 left-[-12px] right-[-12px] top-1.5 -z-10 bg-[#eaff00]" />
          <h2 className="font-display text-3xl font-extrabold text-black sm:text-4xl lg:text-5xl">
            In the Spotlight
          </h2>
        </div>
        <p className="mt-4 text-base font-medium text-black sm:text-lg">
          One for the Tadka, One for the Drama
        </p>
      </div>

      {/* Promo Grid - Full Width */}
      <div className="grid w-full grid-cols-1 md:grid-cols-2">
        {promos.map((promo) => (
          /* Promo artwork is square and carries its own CTA, so the tile stays
             square at every width — a wider box crops the button off. */
          <Link key={promo.id} to={promo.link} className="group relative flex aspect-square w-full overflow-hidden bg-background">
            <img 
              src={promo.image} 
              alt={promo.alt} 
              className="size-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          </Link>
        ))}
      </div>
    </section>
  );
}
