import { createFileRoute, Link } from "@tanstack/react-router";
import { articles, images } from "@/lib/articles";
import { ApplyButton, EditorialImage } from "@/components/site";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Atlas Intelligence Field Notes — Evidence to Supplement" },
      { name: "description", content: "Four practical guides on closing documentation gaps, building defensible supplements, auditing closeouts, and standardizing field-to-desk handoffs." },
      { property: "og:title", content: "Atlas Intelligence Field Notes — Evidence to Supplement" },
      { property: "og:description", content: "Practical guidance for restoration teams on connecting field evidence to the estimate." },
    ],
  }),
  component: Home,
});

function Home() {
  const [lead, ...rest] = articles;
  return (
    <div>
      <section className="relative overflow-hidden border-b border-border/60">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute -right-40 -top-40 h-[480px] w-[480px] rounded-full bg-violet/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-[1.1fr_1fr] md:py-24">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">Field Notes · Evidence-to-Supplement series</p>
            <h1 className="mt-5 text-4xl font-semibold leading-[1.08] md:text-6xl">
              Legitimate work deserves <span className="text-gradient">evidence that holds up.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Restoration work gets harder to justify, bill, or recover when field documentation doesn't support the estimate. Four practical guides on closing that gap, from the field to closeout.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/articles/$slug" params={{ slug: lead.slug }} className="rounded-md border border-border bg-card px-5 py-3 text-sm font-medium hover:border-primary">Start with the flagship guide</Link>
              <Link to="/atlas" className="px-2 py-3 text-sm text-muted-foreground hover:text-foreground">How Atlas works →</Link>
            </div>
          </div>
          <EditorialImage src={images.journey} alt="Insurance restoration claim journey" className="aspect-[4/3] md:aspect-auto" label="Field → Desk → Closeout" />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold">The pilot series</h2>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">4 guides · 4 free resources</p>
        </div>
        <Link to="/articles/$slug" params={{ slug: lead.slug }} className="group mt-8 grid gap-8 rounded-xl border border-border bg-card/50 p-4 transition hover:border-primary/60 md:grid-cols-2 md:p-6">
          <EditorialImage src={lead.image} alt={lead.imageAlt} className="aspect-[16/10]" label={`01 · ${lead.kicker}`} />
          <div className="flex flex-col justify-center">
            <p className="font-mono text-xs uppercase tracking-widest text-cyan">Includes companion video + checklist</p>
            <h3 className="mt-3 text-2xl font-semibold leading-snug group-hover:text-primary md:text-3xl">{lead.title}</h3>
            <p className="mt-4 text-muted-foreground">{lead.dek}</p>
            <p className="mt-6 text-sm text-muted-foreground">{lead.readMins} min read · For {lead.audience.toLowerCase()}</p>
          </div>
        </Link>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {rest.map((a) => (
            <Link key={a.slug} to="/articles/$slug" params={{ slug: a.slug }} className="group flex flex-col rounded-xl border border-border bg-card/50 p-4 transition hover:border-primary/60">
              <EditorialImage src={a.image} alt={a.imageAlt} className="aspect-[16/10]" label={`0${a.n} · ${a.kicker}`} />
              <h3 className="mt-5 text-lg font-semibold leading-snug group-hover:text-primary">{a.title}</h3>
              <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">{a.dek}</p>
              <p className="mt-auto pt-5 text-xs text-muted-foreground">{a.readMins} min read · Free: {a.resource.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-8 overflow-hidden rounded-xl border border-border bg-card p-8 md:grid-cols-[1fr_auto] md:p-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-cyan">Atlas Revenue Recovery Pilot</p>
            <h2 className="mt-3 text-2xl font-semibold md:text-3xl">See what your own files show.</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">Run 5 of your past or in-progress claim files through our evidence review framework to identify potential missed scope and unbilled line items.</p>
          </div>
          <ApplyButton location="home_band" />
        </div>
      </section>
    </div>
  );
}
