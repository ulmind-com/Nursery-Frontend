import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import type { ProductFaq } from "@/types/api";

export function ProductFaqSection({ faq, fallbackImage }: { faq?: ProductFaq; fallbackImage?: string }) {
  const items = faq?.items.filter((item) => item.question.trim() && item.answer.trim()) ?? [];
  const image = faq?.image || fallbackImage;

  if (items.length === 0 || !image) return null;

  return (
    <section className="bg-storefront-wash py-12 sm:py-16 lg:py-20" aria-labelledby="product-faq-title">
      <div className="mx-auto grid max-w-[1480px] items-center gap-9 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:px-10">
        <div className="aspect-[1.22/1] overflow-hidden rounded-xl bg-primary-tint">
          <img
            src={image}
            alt={faq?.image_alt || "Product details"}
            loading="lazy"
            className="size-full object-cover"
          />
        </div>

        <div className="min-w-0">
          <h2 id="product-faq-title" className="text-4xl text-foreground sm:text-5xl lg:text-6xl">
            {faq?.title || "FAQs"}
          </h2>
          <Accordion type="single" collapsible defaultValue="faq-0" className="mt-6 sm:mt-8">
            {items.map((item, index) => (
              <AccordionItem key={`${item.question}-${index}`} value={`faq-${index}`} className="border-border">
                <AccordionTrigger className="py-5 text-left text-base font-bold leading-6 text-forest hover:no-underline sm:text-lg">
                  <span className="pr-4">{item.question}</span>
                </AccordionTrigger>
                <AccordionContent className="max-w-2xl pb-5 pr-8 text-sm leading-6 text-muted-foreground sm:text-base sm:leading-7">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}