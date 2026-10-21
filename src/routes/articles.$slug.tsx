import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect } from "react";
import { articles, getArticle, type Article, type Block } from "@/lib/articles";
import { pathways } from "@/lib/pathways";
import { ApplyButton, EditorialImage } from "@/components/site";
import { VideoPlayer } from "@/components/VideoPlayer";
import { track } from "@/lib/track";

export const Route = createFileRoute("/articles/$slug")({
  loader: ({ params }) => {
    const a = getArticle(params.slug);
    if (!a) throw notFound();
    return { slug: a.slug, title: a.title, dek: a.dek };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.title} | Atlas Intelligence` },
          { name: "description", content: loaderData.dek },
          { property: "og:title", content: loaderData.title },
          { property: "og:description", content: loaderData.dek },
          { property: "og:type", content: "article" },
        ]
      : [{ title: "Article not found | Atlas Intelligence" }, { name: "robots", content: "noindex" }],
  }),
  component: ArticlePage,
});

function useReadingTracking(slug: string) {
  useEffect(() => {
    track("article_view", { article: slug });
    const sent = new Set<number>();
    let engaged = 0, lastActive = Date.now(), reported = false;
    const onScroll = () => {
      lastActive = Date.now();
      const h = document.documentElement;
      const pct = ((h.scrollTop + window.innerHeight) / h.scrollHeight) * 100;
      for (const m of [25, 50, 75, 100]) if (pct >= m - 1 && !sent.has(m)) { sent.add(m); track("scroll_depth", { article: slug, value: m }); }
    };
    const act = () => { lastActive = Date.now(); };
    const tick = setInterval(() => { if (document.visibilityState === "visible" && Date.now() - lastActive < 30000) engaged++; }, 1000);
    const report = () => { if (!reported && engaged > 0) { reported = true; track("engaged_time", { article: slug, value: engaged }); } };
    const onVis = () => { if (document.visibilityState === "hidden") report(); };
    window.addEventListener("scroll", onScroll, { passive: true });
    ["mousemove", "keydown", "touchstart"].forEach((e) => window.addEventListener(e, act, { passive: true }));
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("pagehide", report);
    return () => {
      report(); clearInterval(tick);
      window.removeEventListener("scroll", onScroll);
      ["mousemove", "keydown", "touchstart"].forEach((e) => window.removeEventListener(e, act));
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pagehide", report);
    };
  }, [slug]);
}

function ArticlePage() {
  const { slug } = Route.useLoaderData();
  const a = getArticle(slug)!;
  useReadingTracking(slug);
  const next = articles.filter((x) => x.slug !== slug);
  return (
    <article>
      <header className="mx-auto max-w-4xl px-5 pt-14">
        <Link to="/" className="font-mono text-xs uppercase tracking-widest text-muted-foreground hover:text-primary">← Field Notes</Link>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.25em] text-cyan">Part {a.n} of 4 · {a.kicker}</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-5xl">{a.title}</h1>
        <p className="mt-5 text-lg text-muted-foreground">{a.dek}</p>
        <p className="mt-5 text-sm text-muted-foreground">{a.readMins} min read · Written for {a.audience.toLowerCase()}</p>
      </header>
      <div className="mx-auto mt-10 max-w-5xl px-5">
        <EditorialImage src={a.image} alt={a.imageAlt} className="aspect-[16/8]" label={`Field Notes 0${a.n}`} />
      </div>
      <div className="prose-atlas mx-auto max-w-3xl px-5 pt-6">
        {a.body.map((b, i) => <BlockView key={i} b={b} a={a} />)}
      </div>
      <section className="mx-auto mt-16 max-w-6xl px-5">
        <h2 className="text-xl font-semibold">Continue the series</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {next.map((x) => (
            <Link key={x.slug} to="/articles/$slug" params={{ slug: x.slug }} className="group rounded-lg border border-border bg-card/50 p-3 hover:border-primary/60">
              <EditorialImage src={x.image} alt={x.imageAlt} className="aspect-[16/9]" />
              <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-cyan">0{x.n} · {x.kicker}</p>
              <p className="mt-1 font-medium leading-snug group-hover:text-primary">{x.title}</p>
            </Link>
          ))}
        </div>
      </section>
    </article>
  );
}

function BlockView({ b, a }: { b: Block; a: Article }) {
  switch (b.t) {
    case "p": return <p>{b.text}</p>;
    case "h2": return <h2>{b.text}</h2>;
    case "h3": return <h3>{b.text}</h3>;
    case "list": return <ul>{b.items.map((x, i) => <li key={i}>{x}</li>)}</ul>;
    case "callout":
      return <aside className="my-8 rounded-lg border-l-2 border-cyan bg-card p-5"><p className="!m-0 font-mono text-xs uppercase tracking-widest !text-cyan">{b.label}</p><p className="!mb-0 !mt-2 !text-base">{b.text}</p></aside>;
    case "video": return <VideoPlayer article={a.slug} />;
    case "figure":
      return <figure className="my-10"><EditorialImage src={b.src} alt={b.caption} className="aspect-[16/9]" /><figcaption className="mt-3 text-sm text-muted-foreground">{b.caption}</figcaption></figure>;
    case "gap":
      return (
        <section className="my-12 rounded-xl border border-border bg-card/40 p-6">
          <div className="flex items-baseline gap-4">
            <span className="font-display text-5xl font-semibold text-gradient">{b.n}</span>
            <h3 className="!m-0">{b.title}</h3>
          </div>
          <p>{b.why}</p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4"><p className="!m-0 font-mono text-xs uppercase tracking-widest !text-destructive">Weak</p><p className="!mb-0 !mt-2 !text-sm">{b.weak}</p></div>
            <div className="rounded-lg border border-success/40 bg-success/5 p-4"><p className="!m-0 font-mono text-xs uppercase tracking-widest !text-success">Strong</p><p className="!mb-0 !mt-2 !text-sm">{b.strong}</p></div>
          </div>
          <p className="!mb-1 font-semibold">How to close it</p>
          <ul className="!mt-1">{b.steps.map((s, i) => <li key={i}>{s}</li>)}</ul>
          <p className="!mb-0 !text-sm"><span className="font-semibold text-violet">Common mistake: </span>{b.mistake}</p>
        </section>
      );
    case "compare":
      return (
        <div className="my-8 grid gap-4 md:grid-cols-2">
          {[{ t: b.leftTitle, i: b.left, c: "destructive" }, { t: b.rightTitle, i: b.right, c: "success" }].map((col) => (
            <div key={col.t} className={`rounded-lg border p-5 ${col.c === "success" ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5"}`}>
              <p className={`!m-0 text-sm font-semibold ${col.c === "success" ? "text-success" : "text-destructive"}`}>{col.t}</p>
              <ul className="!mb-0">{col.i.map((x, k) => <li key={k} className="!text-sm">{x}</li>)}</ul>
            </div>
          ))}
        </div>
      );
    case "table":
      return (
        <div className="my-8 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-card"><tr>{b.head.map((h) => <th key={h} className="px-4 py-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">{h}</th>)}</tr></thead>
            <tbody>{b.rows.map((r, i) => <tr key={i} className="border-t border-border">{r.map((c, j) => <td key={j} className="px-4 py-3 align-top">{c}</td>)}</tr>)}</tbody>
          </table>
        </div>
      );
    case "resource":
      return (
        <div className="not-prose my-12 flex flex-col gap-5 rounded-xl border border-primary/40 bg-gradient-to-br from-card to-background p-6 md:flex-row md:items-center">
          <div className="flex-1">
            <p className="font-mono text-xs uppercase tracking-widest text-cyan">Free resource</p>
            <p className="mt-2 font-display text-xl font-semibold">Atlas Intelligence: {a.resource.title}</p>
            <p className="mt-2 text-sm text-muted-foreground">{a.resource.subtitle}</p>
          </div>
          <Link to="/resources/$slug" params={{ slug: a.resource.slug }} onClick={() => track("download", { article: a.slug, meta: { resource: a.resource.slug } })} className="rounded-md border border-primary px-4 py-2.5 text-center text-sm font-semibold text-primary hover:bg-primary/10">Get the printable ↓</Link>
        </div>
      );
    case "cta": {
      const p = pathways[a.n];
      return (
        <div className="not-prose my-12 rounded-xl border border-border bg-card p-6 md:p-8">
          <p className="font-mono text-xs uppercase tracking-widest text-violet">Where Atlas fits</p>
          <p className="mt-3 text-base text-foreground/90">{p.problem}</p>
          <p className="mt-3 text-base text-muted-foreground">{p.atlas}</p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ApplyButton article={a.slug} location="article_end" />
            <Link to="/atlas" onClick={() => track("product_click", { article: a.slug, meta: { location: "article_end" } })} className="text-sm text-muted-foreground hover:text-foreground">How Atlas works →</Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">5 files. Evidence review framework. No commitment beyond the pilot.</p>
        </div>
      );
    }
  }
}
