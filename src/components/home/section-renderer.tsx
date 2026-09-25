/* Renders one admin-configured band.

The home route loads every band's data once and hands it in through `ctx`; this
file only decides which component a band's `type` maps to and how the stored
fields become that component's props. A band whose copy or artwork the admin
hasn't touched arrives with the seeded values, and anything still blank falls
through to the component's own defaults — so a half-filled band never renders
an empty box. */

import type { PageSection, PageSectionItem } from "@/types/api";
import type { HomeData } from "@/components/home/home-data";

import { HeroCarousel } from "@/components/home/hero-carousel";
import { CategoryStrip } from "@/components/home/category-strip";
import { TrustStrip } from "@/components/home/trust-strip";
import { VideoGallery, defaultVideos } from "@/components/home/video-gallery";
import { SpotlightSection, defaultSpotlightPromos } from "@/components/home/spotlight-section";
import { BhiduApprovedSection } from "@/components/home/bhidu-approved-section";
import { OffersMarquee, defaultOfferCards } from "@/components/home/offers-marquee";
import { SelfWateringSection } from "@/components/home/self-watering-section";
import { PlantersRedefineSection } from "@/components/home/planters-redefine";
import { StorefrontProductGrid } from "@/components/home/storefront-product-grid";
import { ShopBySpaceSection, spaceCardsFromCategories, defaultSpaceCards } from "@/components/home/shop-by-space";
import { TrustBar } from "@/components/home/trust-bar";
import { ProductRail } from "@/components/home/section-rail";
import { FarmToHomeSection, defaultFarmCards } from "@/components/home/farm-to-home";
import { BrandComparisonSection, type ComparisonRow } from "@/components/home/brand-comparison";
import { GrowGardenBanner } from "@/components/home/grow-garden-banner";
import { StoreLocatorSection, storesFromApi } from "@/components/home/store-locator";
import { GardenServicesBand } from "@/components/home/garden-services";
import { GiftingBand } from "@/components/home/gifting-band";
import { PressMarquee } from "@/components/home/press-marquee";
import {
  CustomBannerSection,
  CustomCardsSection,
  CustomTextSection,
  GoogleReviewsSection,
  JournalSection,
} from "@/components/home/editorial-sections";

/* An empty string is "not set", so it must not beat the component's default. */
const text = (value: string | undefined | null): string | undefined => {
  const trimmed = (value ?? "").trim();
  return trimmed === "" ? undefined : trimmed;
};

const count = (value: number | null | undefined, fallback: number): number =>
  typeof value === "number" && value > 0 ? value : fallback;

const itemsOf = (section: PageSection): PageSectionItem[] =>
  Array.isArray(section.items) ? section.items : [];

const str = (item: PageSectionItem, key: string): string => {
  const value = item[key];
  return typeof value === "string" ? value : "";
};

/** Props only make it through when they carry a value, so a blank admin field
 *  leaves the component's own default in place rather than wiping the copy.
 *  `exactOptionalPropertyTypes` means the result must drop `undefined` from the
 *  value types too, not just the keys. */
type Defined<T> = { [K in keyof T]?: Exclude<T[K], undefined> };

function defined<T extends Record<string, unknown>>(props: T): Defined<T> {
  return Object.fromEntries(Object.entries(props).filter(([, v]) => v !== undefined)) as Defined<T>;
}

/** A comparison cell: omit `title`/`badge` entirely when the admin left them blank. */
function cell(item: PageSectionItem, column: string) {
  const title = str(item, `${column}_title`);
  const badge = str(item, `${column}_badge`);
  return {
    status: status(str(item, `${column}_status`)),
    ...(title ? { title } : {}),
    ...(badge ? { badge } : {}),
  };
}

const STATUSES = new Set(["positive", "negative", "mixed"]);
const status = (value: string): "positive" | "negative" | "mixed" =>
  STATUSES.has(value) ? (value as "positive" | "negative" | "mixed") : "mixed";

function comparisonRows(section: PageSection): ComparisonRow[] {
  return itemsOf(section)
    .filter((item) => str(item, "label"))
    .map((item) => ({
      label: str(item, "label"),
      local: cell(item, "local"),
      brand: cell(item, "brand"),
      others: cell(item, "others"),
    }));
}

export function SectionRenderer({ section, ctx }: { section: PageSection; ctx: HomeData }) {
  const items = itemsOf(section);
  const withImage = items.filter((item) => str(item, "image"));

  switch (section.type) {
    case "hero":
      return <HeroCarousel banners={ctx.banners} shopName={ctx.shopName} />;

    case "category_strip":
      return (
        <CategoryStrip
          categories={ctx.categories}
          {...defined({ title: text(section.title), limit: section.limit ?? undefined })}
        />
      );

    case "trust_strip":
      return (
        <TrustStrip
          {...defined({ bgColor: text(section.bg_color) })}
          {...(items.length > 0
            ? {
                items: items.map((item, index) => ({
                  id: str(item, "id") || `trust-${index}`,
                  lottie: str(item, "lottie"),
                  title: str(item, "title"),
                })),
              }
            : {})}
        />
      );

    case "video_reel": {
      const videos = items
        .filter((item) => str(item, "video"))
        .map((item, index) => ({
          id: str(item, "id") || `reel-${index}`,
          src: str(item, "video"),
          title: str(item, "title"),
          ...(str(item, "poster") ? { poster: str(item, "poster") } : {}),
        }));
      return <VideoGallery videos={videos.length > 0 ? videos : defaultVideos} {...defined({ title: text(section.title), subtitle: text(section.subtitle) })} />;
    }

    case "spotlight": {
      const promos = withImage.map((item, index) => ({
        id: str(item, "id") || `spotlight-${index}`,
        image: str(item, "image"),
        link: str(item, "link") || "/plants",
        alt: str(item, "title"),
      }));
      return <SpotlightSection promos={promos.length > 0 ? promos : defaultSpotlightPromos} {...defined({ title: text(section.title), subtitle: text(section.subtitle) })} />;
    }

    case "bhidu":
      return (
        <BhiduApprovedSection
          products={ctx.products}
          {...defined({
            badgeLabel: text(section.badge_label),
            badgeLabel2: text(section.badge_label_2),
            title: text(section.title),
            ctaLabel: text(section.cta_label),
            ctaLink: text(section.cta_link),
            personImage: text(section.image),
            limit: section.limit ?? undefined,
          })}
        />
      );

    case "offers": {
      const offers = withImage.map((item, index) => ({
        id: str(item, "id") || `offer-${index}`,
        image: str(item, "image"),
        link: str(item, "link") || "/offers",
        alt: str(item, "title") || "Offer",
      }));
      return <OffersMarquee offers={offers.length > 0 ? offers : defaultOfferCards} {...defined({ title: text(section.title) })} />;
    }

    case "self_watering": {
      const steps = withImage.map((item, index) => ({
        id: str(item, "id") || `step-${index}`,
        image: str(item, "image"),
        caption: str(item, "title"),
      }));
      return (
        <SelfWateringSection
          {...defined({
            title: text(section.title),
            description: text(section.description),
            image: text(section.image),
            stepsTitle: text(section.subtitle),
          })}
          {...(steps.length > 0 ? { steps } : {})}
        />
      );
    }

    case "planters": {
      const benefits = items
        .filter((item) => str(item, "title"))
        .map((item) => ({ icon: str(item, "image"), title: str(item, "title"), description: str(item, "subtitle") }));
      return (
        <PlantersRedefineSection
          products={ctx.products}
          limit={count(section.limit, 4)}
          {...defined({ title: text(section.title), subtitle: text(section.subtitle) })}
          {...(benefits.length > 0 ? { benefits } : {})}
        />
      );
    }

    case "product_grid":
      return <StorefrontProductGrid products={ctx.products} limit={count(section.limit, 6)} />;

    case "shop_by_space": {
      /* The category tree wins when it exists, so the tiles and the products
         behind them stay in step; the stored tiles are the fallback. */
      const fromTree = spaceCardsFromCategories(ctx.categoryTree);
      const stored = withImage.map((item, index) => ({
        id: str(item, "id") || `space-${index}`,
        title: str(item, "title"),
        image: str(item, "image"),
        link: str(item, "link") || "/plants",
      }));
      const spaces = fromTree.length > 0 ? fromTree : stored.length > 0 ? stored : defaultSpaceCards;
      return <ShopBySpaceSection spaces={spaces} {...defined({ title: text(section.title) })} />;
    }

    case "trust_bar":
      return <TrustBar settings={ctx.settings} />;

    case "product_rails":
      return (
        <>
          {ctx.rails.map((rail) => (
            <div key={rail.key} className={rail.featured ? "bg-primary-tint" : ""}>
              <ProductRail {...(rail.eyebrow ? { eyebrow: rail.eyebrow } : {})} title={rail.title} products={rail.products} />
            </div>
          ))}
        </>
      );

    case "google_reviews":
      return (
        <GoogleReviewsSection
          reviews={ctx.reviews}
          limit={count(section.limit, 6)}
          {...defined({ eyebrow: text(section.eyebrow), title: text(section.title) })}
        />
      );

    case "blog":
      return (
        <JournalSection
          posts={ctx.blogPosts}
          limit={count(section.limit, 3)}
          {...defined({ eyebrow: text(section.eyebrow), title: text(section.title) })}
        />
      );

    case "farm_to_home": {
      const cards = withImage.map((item, index) => ({
        id: str(item, "id") || `farm-${index}`,
        image: str(item, "image"),
        alt: str(item, "title") || "From our farm to your home",
      }));
      return (
        <FarmToHomeSection
          cards={cards.length > 0 ? cards : defaultFarmCards}
          {...defined({ title: text(section.title), subtitle: text(section.subtitle) })}
        />
      );
    }

    case "comparison": {
      const rows = comparisonRows(section);
      return (
        <BrandComparisonSection
          {...(rows.length > 0 ? { rows } : {})}
          {...defined({
            title: text(section.title),
            brandLabel: text(section.brand_label),
            localLabel: text(section.local_label),
            othersLabel: text(section.others_label),
          })}
        />
      );
    }

    case "grow_banner": {
      /* The stock banner links to a category page; a full path means the admin
         pointed it somewhere else, so render it as a free-form banner. */
      const link = text(section.cta_link) ?? "/category/seeds";
      const slug = link.startsWith("/category/") ? link.slice("/category/".length) : null;
      if (!slug) {
        return (
          <CustomBannerSection
            {...defined({
              image: text(section.image),
              imageAlt: text(section.image_alt),
              title: text(section.title),
              subtitle: text(section.subtitle),
              ctaLabel: text(section.cta_label),
              ctaLink: link,
              bgColor: text(section.bg_color),
            })}
          />
        );
      }
      return (
        <GrowGardenBanner
          {...defined({
            image: text(section.image),
            imageAlt: text(section.image_alt),
            title: text(section.title),
            subtitle: text(section.subtitle),
            ctaLabel: text(section.cta_label),
            categorySlug: slug,
          })}
        />
      );
    }

    case "store_locator":
      return (
        <StoreLocatorSection
          stores={storesFromApi(ctx.stores)}
          {...defined({ title: text(section.title), subtitle: text(section.subtitle) })}
        />
      );

    case "garden_services":
      return <GardenServicesBand section={ctx.gardenServices} />;

    case "gifting":
      return <GiftingBand section={ctx.gifting} />;

    case "press":
      return <PressMarquee section={ctx.press.section} logos={ctx.press.items} />;

    case "custom_banner":
      return (
        <CustomBannerSection
          {...defined({
            image: text(section.image),
            imageAlt: text(section.image_alt),
            title: text(section.title),
            subtitle: text(section.subtitle),
            ctaLabel: text(section.cta_label),
            ctaLink: text(section.cta_link),
            bgColor: text(section.bg_color),
          })}
        />
      );

    case "custom_cards":
      return (
        <CustomCardsSection
          cards={items.map((item, index) => ({
            id: str(item, "id") || `card-${index}`,
            image: str(item, "image"),
            title: str(item, "title"),
            subtitle: str(item, "subtitle"),
            link: str(item, "link"),
          }))}
          {...defined({
            eyebrow: text(section.eyebrow),
            title: text(section.title),
            subtitle: text(section.subtitle),
            bgColor: text(section.bg_color),
          })}
        />
      );

    case "custom_text":
      return (
        <CustomTextSection
          {...defined({
            eyebrow: text(section.eyebrow),
            title: text(section.title),
            description: text(section.description),
            ctaLabel: text(section.cta_label),
            ctaLink: text(section.cta_link),
            bgColor: text(section.bg_color),
          })}
        />
      );

    default:
      /* An unknown type means the API is ahead of this build — skip it quietly
         rather than blanking the page. */
      return null;
  }
}
