import type { ReactNode } from "react";

export function PolicyPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children?: ReactNode }) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 lg:py-24">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{eyebrow}</p>
      <h1 className="mt-4 text-3xl sm:text-4xl">{title}</h1>
      <p className="mt-5 leading-7 text-muted-foreground">{intro}</p>
      <div className="mt-10 space-y-8 text-sm leading-7 text-muted-foreground">{children}</div>
    </div>
  );
}

export function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg text-foreground">{title}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}
