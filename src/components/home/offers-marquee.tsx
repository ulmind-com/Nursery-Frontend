import { Link } from "@tanstack/react-router";
import type { SiteMedia } from "@/types/api";

export interface OfferCard {
  id: string;
  image: string;
  link: string;
  alt: string;
}

/* Local defaults — used until the admin panel supplies offer media */
export const defaultOfferCards: OfferCard[] = [
  { id: "offer-1", image: "/card/offer-1.jpg", link: "/offers", alt: "Buy any 4 plants bundle offer" },
  { id: "offer-2", image: "/card/offer-2.jpg", link: "/offers", alt: "Build your own plant bundle" },
  { id: "offer-3", image: "/card/offer-3.jpg", link: "/offers", alt: "Plant and pot combo offer" },
  { id: "offer-4", image: "/card/offer-4.jpg", link: "/offers", alt: "Seasonal plant offer" },
  { id: "offer-5", image: "/card/offer-5.jpg", link: "/offers", alt: "Indoor plant bundle offer" },
  { id: "offer-6", image: "/card/offer-6.jpg", link: "/offers", alt: "Gardening essentials offer" },
];

/* Map admin-managed site media (section: "offers") onto offer cards */
export function offerCardsFromMedia(media: SiteMedia[] | undefined): OfferCard[] {
  const mapped = (media ?? [])
    .filter((item) => item.image)
    .map((item, index) => ({
      id: item.id ?? `offer-media-${index}`,
      image: item.image as string,
      link: item.cta_url || "/offers",
      alt: item.title || item.subtitle || "Offer",
    }));
  return mapped.length > 0 ? mapped : defaultOfferCards;
}

function OfferTile({ offer }: { offer: OfferCard }) {
  const external = /^https?:\/\//.test(offer.link);
  const inner = (
    <img
      src={offer.image}
      alt={offer.alt}
      width={1000}
      height={667}
      loading="lazy"
      className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
  const className =
    "group block aspect-[3/2] w-[290px] shrink-0 overflow-hidden rounded-2xl bg-primary-soft shadow-[0_2px_14px_rgba(0,0,0,0.07)] sm:w-[380px] lg:w-[470px]";

  return external ? (
    <a href={offer.link} target="_blank" rel="noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link to={offer.link} className={className}>
      {inner}
    </Link>
  );
}

export function OffersMarquee({
  offers = defaultOfferCards,
  title = "Offers for You",
}: {
  offers?: OfferCard[];
  title?: string;
}) {
  if (offers.length === 0) return null;

  /* Two identical tracks side by side make the right-to-left loop seamless */
  const track = offers.length < 4 ? [...offers, ...offers] : offers;

  return (
    <section className="overflow-hidden bg-storefront-wash py-12 lg:py-16">
      <div className="mx-auto mb-8 max-w-[1480px] px-4 sm:px-6 lg:mb-10 lg:px-10">
        <h2 className="font-display text-3xl font-extrabold text-foreground sm:text-4xl lg:text-[3rem]">
          {title}
        </h2>
      </div>

      <div className="group/marquee relative flex overflow-hidden">
        <div className="flex shrink-0 animate-offers-marquee gap-4 pr-4 sm:gap-5 sm:pr-5 group-hover/marquee:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]">
          {track.map((offer, index) => (
            <OfferTile key={`${offer.id}-a-${index}`} offer={offer} />
          ))}
        </div>
        <div
          aria-hidden
          className="flex shrink-0 animate-offers-marquee gap-4 pr-4 sm:gap-5 sm:pr-5 group-hover/marquee:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]"
        >
          {track.map((offer, index) => (
            <OfferTile key={`${offer.id}-b-${index}`} offer={offer} />
          ))}
        </div>
      </div>
    </section>
  );
}
