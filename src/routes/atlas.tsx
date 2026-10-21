import { createFileRoute, Link } from "@tanstack/react-router";
import { articles, images } from "@/lib/articles";
import { ApplyButton, EditorialImage } from "@/components/site";
import { track } from "@/lib/track";

export const Route = createFileRoute("/atlas")({
  head: () => ({
    meta: [
      { title: "How Atlas works — Atlas Intelligence" },
      { name: "description", content: "Atlas AI OS is operational intelligence for insurance restoration, connecting field evidence, estimating, supplements, and closeout." },
      { property: "og:title", content: "How Atlas works — Atlas Intelligence" },
      { property: "og:description", content: "Operational intelligence connecting field evidence to the estimate and closeout." },
    ],
  }),
  component: AtlasPage,
});

const stages = [
  { n: "01", t: "Field evidence", d: "Capture that follows a consistent standard: context, detail, scale, concealed conditions.", a: 0 },
  { n: "02", t: "Estimate & supplement", d: "Each line item connected to the photos and measurements that support it.", a: 1 },
  { n: "03", t: "Closeout", d: "Completed work reconciled against billing, with discrepancies separated from assumptions.", a: 2 },
  { n: "04", t: "Handoffs", d: "Clear criteria for what moves from field to desk, and when.", a: 3 },
];

function AtlasPage() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-20">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">Atlas AI OS</p>
          <h1 className="mt-4 text-4xl font-semibold leading-tight md:text-5xl">An operating system for <span className="text-gradient">restoration intelligence.</span></h1>
          <p className="mt-5 text-lg text-muted-foreground">Atlas is built around one connection: the link between what was documented in the field and what is estimated, supplemented, and billed. The Field Notes series describes the practices. Atlas is how we help teams apply them across every file.</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ApplyButton location="atlas_page" />
            <a href="https://atlas-ai-os.com" target="_blank" rel="noreferrer" onClick={() => track("product_click", { meta: { location: "atlas_page" } })} className="text-sm text-muted-foreground hover:text-foreground">Visit atlas-ai-os.com ↗</a>
          </div>
        </div>
        <EditorialImage src={images.contractorAi} alt="Contractor reviewing Atlas analysis on a tablet" className="aspect-[4/3]" label="Evidence review" />
      </section>
      <section className="mx-auto max-w-6xl px-5">
        <h2 className="text-2xl font-semibold">Where evidence breaks down, and where Atlas focuses</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {stages.map((s) => (
            <div key={s.n} className="rounded-xl border border-border bg-card/50 p-5">
              <p className="font-mono text-xs text-cyan">{s.n}</p>
              <p className="mt-2 font-display text-lg font-semibold">{s.t}</p>
              <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              <Link to="/articles/$slug" params={{ slug: articles[s.a].slug }} className="mt-4 inline-block text-sm text-primary">Read the guide →</Link>
            </div>
          ))}
        </div>
      </section>
      <section className="mx-auto mt-16 max-w-6xl px-5">
        <div className="rounded-xl border border-border bg-card p-8 md:p-12">
          <p className="font-mono text-xs uppercase tracking-widest text-violet">The Revenue Recovery Pilot</p>
          <h2 className="mt-3 text-2xl font-semibold">Five files. One evidence review.</h2>
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            {["Apply and share 5 past or in-progress claim files.", "We run them through the evidence review framework from this series.", "You get a findings summary: potential missed scope and unbilled line items, each marked documented or needing evidence."].map((x, i) => (
              <li key={i} className="rounded-lg border border-border p-4 text-sm"><span className="font-mono text-cyan">Step {i + 1}</span><p className="mt-2 text-muted-foreground">{x}</p></li>
            ))}
          </ol>
          <div className="mt-8"><ApplyButton location="atlas_page_bottom" /></div>
        </div>
      </section>
    </div>
  );
}
