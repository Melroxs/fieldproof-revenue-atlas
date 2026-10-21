import { Link } from "@tanstack/react-router";
import logo from "@/assets/img/logo.json";
import { track } from "@/lib/track";

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="overflow-hidden rounded-md" style={{ width: size, height: size }}>
        <img src={logo.url} alt="Project Atlas" className="h-full w-full scale-[1.5] object-cover object-[50%_32%]" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-sm font-semibold tracking-[0.18em]">ATLAS</span>
        <span className="block font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Intelligence</span>
      </span>
    </Link>
  );
}

export function ApplyButton({ article, location, className = "" }: { article?: string; location: string; className?: string }) {
  return (
    <Link
      to="/apply"
      search={article ? { from: article } : {}}
      onClick={() => track("cta_click", { article, meta: { location } })}
      className={`inline-flex items-center justify-center gap-2 rounded-md bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_8px_30px_-8px_var(--cyan)] transition hover:brightness-110 ${className}`}
    >
      Apply for the Atlas Revenue Recovery Pilot <span aria-hidden>→</span>
    </Link>
  );
}

export function SiteHeader() {
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <Logo />
        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className="hidden text-muted-foreground hover:text-foreground sm:block" activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>Field Notes</Link>
          <Link to="/atlas" className="hidden text-muted-foreground hover:text-foreground sm:block" activeProps={{ className: "text-foreground" }}>How Atlas works</Link>
          <Link to="/apply" onClick={() => track("cta_click", { meta: { location: "header" } })} className="rounded-md border border-primary/50 px-3 py-1.5 font-medium text-primary hover:bg-primary/10">Apply for the pilot</Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="no-print mt-24 border-t border-border/60">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        <div><Logo /><p className="mt-4 max-w-xs text-sm text-muted-foreground">Field Notes from Atlas Intelligence: practical guidance on evidence, estimating, and closeout for insurance restoration teams.</p></div>
        <div className="text-sm">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Explore</p>
          <ul className="mt-3 space-y-2">
            <li><Link to="/" className="hover:text-primary">All articles</Link></li>
            <li><Link to="/atlas" className="hover:text-primary">How Atlas works</Link></li>
            <li><Link to="/apply" className="hover:text-primary">Revenue Recovery Pilot</Link></li>
            <li><a href="https://atlas-ai-os.com" target="_blank" rel="noreferrer" onClick={() => track("product_click", { meta: { location: "footer" } })} className="hover:text-primary">atlas-ai-os.com ↗</a></li>
          </ul>
        </div>
        <div className="text-sm text-muted-foreground">
          <p className="font-mono text-xs uppercase tracking-widest">Privacy</p>
          <p className="mt-3">We measure reading with anonymous, cookie-free events and honor Do Not Track. No ad trackers.</p>
          <p className="mt-4 text-xs">© {new Date().getFullYear()} Atlas Intelligence</p>
        </div>
      </div>
    </footer>
  );
}

/** Consistent editorial image treatment: cool duotone wash, grid overlay, brand edge. */
export function EditorialImage({ src, alt, className = "", label }: { src: string; alt: string; className?: string; label?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-lg border border-border/70 bg-card ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover saturate-[0.8] contrast-[1.05]" loading="lazy" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/70 via-transparent to-violet/20 mix-blend-multiply" />
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 bg-gradient-brand" />
      {label && <span className="absolute left-3 top-3 rounded bg-background/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-cyan">{label}</span>}
    </div>
  );
}
