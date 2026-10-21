import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getResource } from "@/lib/articles";
import { track } from "@/lib/track";
import logo from "@/assets/img/logo.json";

export const Route = createFileRoute("/resources/$slug")({
  loader: ({ params }) => {
    const r = getResource(params.slug);
    if (!r) throw notFound();
    return { slug: params.slug, title: r.resource.title, subtitle: r.resource.subtitle };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `Atlas Intelligence: ${loaderData.title}` },
          { name: "description", content: loaderData.subtitle },
          { property: "og:title", content: `Atlas Intelligence: ${loaderData.title}` },
          { property: "og:description", content: loaderData.subtitle },
        ]
      : [{ title: "Resource not found" }, { name: "robots", content: "noindex" }],
  }),
  component: ResourcePage,
});

function ResourcePage() {
  const { slug } = Route.useLoaderData();
  const { article, resource } = getResource(slug)!;
  const print = () => { track("download", { article: article.slug, meta: { resource: slug, action: "print" } }); window.print(); };
  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link to="/articles/$slug" params={{ slug: article.slug }} className="text-sm text-muted-foreground hover:text-primary">← Back to the article</Link>
        <button onClick={print} className="rounded-md bg-gradient-brand px-4 py-2 text-sm font-semibold text-primary-foreground">Print / Save as PDF</button>
      </div>
      <div className="rounded-xl border border-border bg-card p-8 print:border-0 print:p-0">
        <div className="flex items-center justify-between border-b border-border pb-5">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-primary">Atlas Intelligence</p>
            <h1 className="mt-1 text-2xl font-semibold">{resource.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{resource.subtitle}</p>
          </div>
          <img src={logo.url} alt="Project Atlas" className="h-16 w-16 rounded-md object-cover object-[50%_32%]" />
        </div>
        <div className="mt-5 rounded-md bg-muted/40 p-4 text-sm print-avoid">
          <p className="font-semibold">How to use</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground">{resource.howToUse.map((h) => <li key={h}>{h}</li>)}</ol>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-muted-foreground print-avoid">
          <p>Job / claim #: ____________________</p><p>Date: ____________________</p>
          <p>Completed by: ____________________</p><p>Reviewed by: ____________________</p>
        </div>
        {resource.sections.map((s) => (
          <section key={s.heading} className="mt-6 print-avoid">
            <h2 className="text-base font-semibold">{s.heading}</h2>
            {s.note && <p className="mt-1 font-mono text-xs text-primary">{s.note}</p>}
            <ul className="mt-2 space-y-2">
              {s.items.map((it) => (
                <li key={it} className="flex gap-3 text-sm"><span className="mt-0.5 inline-block h-4 w-4 shrink-0 rounded-sm border border-foreground/40" />{it}</li>
              ))}
            </ul>
          </section>
        ))}
        <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">From "{article.title}" · Atlas Intelligence Field Notes · atlas-ai-os.com</p>
      </div>
    </div>
  );
}
