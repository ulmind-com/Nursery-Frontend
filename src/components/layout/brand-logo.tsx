import { Link } from "@tanstack/react-router";

/* "MyGarden" reads as two words, so the wordmark splits on the inner capital
   and colours the halves differently. Any other shop name renders in one tone. */
function splitName(name: string): [string, string] {
  const match = /^([A-Z][a-z]*)([A-Z].*)$/.exec(name.replace(/\s+/g, " ").trim());
  return match ? [match[1]!, match[2]!] : [name, ""];
}

export function BrandMark({ className = "size-9" }: { className?: string }) {
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[0.7rem] bg-gradient-to-br from-primary to-forest shadow-[0_6px_16px_-6px_oklch(0.378_0.077_168.94/0.8)] ${className}`}>
      <svg viewBox="0 0 32 32" className="size-[70%] text-white" fill="none" aria-hidden="true">
        {/* stem */}
        <path d="M16 28V14.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
        {/* right leaf */}
        <path d="M16.6 15.2c0-4.6 3.2-8.2 8.4-9-.2 5.4-3.2 9-8.4 9Z" fill="currentColor" />
        {/* left leaf */}
        <path d="M15.4 17.4C11 17.4 7.6 14.3 6.9 9.6c5.1.2 8.5 3 8.5 7.8Z" fill="currentColor" opacity=".78" />
      </svg>
    </span>
  );
}

export function BrandLogo({
  name,
  size = "md",
  tone = "dark",
  asLink = true,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
  asLink?: boolean;
}) {
  const [head, tail] = splitName(name);

  const mark = { sm: "size-8", md: "size-9 lg:size-10", lg: "size-11" }[size];
  const text = {
    sm: "text-lg",
    md: "text-xl sm:text-[1.45rem] lg:text-[1.6rem]",
    lg: "text-2xl sm:text-[1.75rem]",
  }[size];

  const inner = (
    <>
      <BrandMark className={mark} />
      <span className={`whitespace-nowrap font-display font-extrabold leading-none tracking-[-0.02em] ${text}`}>
        <span className={tone === "light" ? "text-white" : "text-forest"}>{head}</span>
        {tail && <span className={tone === "light" ? "text-primary-soft" : "text-primary"}>{tail}</span>}
      </span>
    </>
  );

  const className = "flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90";
  return asLink ? (
    <Link to="/" aria-label={`${name} — home`} className={className}>{inner}</Link>
  ) : (
    <span className={className}>{inner}</span>
  );
}
