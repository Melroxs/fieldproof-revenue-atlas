import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getAdminData, updateApplicationStatus } from "@/lib/pilot.functions";
import { articles } from "@/lib/articles";
import { GATE_TARGETS } from "@/lib/gates";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({ meta: [{ title: "Pilot dashboard — Atlas Intelligence" }, { name: "description", content: "Internal pilot dashboard." }, { property: "og:title", content: "Pilot dashboard" }, { property: "og:description", content: "Internal." }, { name: "robots", content: "noindex" }] }),
  component: Admin,
});

const pct = (n: number) => `${(n * 100).toFixed(1)}%`;

function Admin() {
  const fetchData = useServerFn(getAdminData);
  const setStatus = useServerFn(updateApplicationStatus);
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["admin"], queryFn: () => fetchData(), retry: false });
  const [tab, setTab] = useState<"dash" | "apps">("dash");

  if (q.isLoading) return <p className="mx-auto max-w-6xl px-5 py-16 text-muted-foreground">Loading…</p>;
  if (q.error) return <p className="mx-auto max-w-6xl px-5 py-16 text-destructive">{(q.error as Error).message}</p>;
  const { apps, metrics: m, gates, perArticle, byDay } = q.data!;
  const T = GATE_TARGETS;

  const Gate = ({ name, pass, rows }: { name: string; pass: boolean; rows: [string, string, string][] }) => (
    <div className={`rounded-xl border p-5 ${pass ? "border-success/50" : "border-border"} bg-card`}>
      <div className="flex items-center justify-between"><p className="font-display font-semibold">{name}</p><span className={`rounded px-2 py-0.5 font-mono text-xs ${pass ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>{pass ? "PASS" : "NOT YET"}</span></div>
      <table className="mt-4 w-full text-sm"><tbody>{rows.map(([l, v, t]) => <tr key={l} className="border-t border-border"><td className="py-2 text-muted-foreground">{l}</td><td className="py-2 text-right font-mono">{v}</td><td className="py-2 pl-3 text-right font-mono text-xs text-muted-foreground">target {t}</td></tr>)}</tbody></table>
    </div>
  );
  const days = Object.entries(byDay).sort();
  const max = Math.max(1, ...days.map(([, v]) => v));

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="font-mono text-xs uppercase tracking-widest text-cyan">Internal · last 30 days</p><h1 className="mt-1 text-3xl font-semibold">Pilot performance</h1></div>
        <div className="flex gap-2 text-sm">
          <button onClick={() => setTab("dash")} className={`rounded-md px-3 py-1.5 ${tab === "dash" ? "bg-primary text-primary-foreground" : "border border-border"}`}>Dashboard</button>
          <button onClick={() => setTab("apps")} className={`rounded-md px-3 py-1.5 ${tab === "apps" ? "bg-primary text-primary-foreground" : "border border-border"}`}>Applications ({apps.length})</button>
          <button onClick={() => supabase.auth.signOut().then(() => location.assign("/"))} className="rounded-md border border-border px-3 py-1.5">Sign out</button>
        </div>
      </div>

      {tab === "dash" ? (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-6">
            {[["Article views", m.views], ["Avg engaged", `${Math.round(m.avgEngaged)}s`], ["Downloads", m.downloads], ["CTA clicks", m.cta], ["Applications", m.apps], ["Video plays", m.plays]].map(([l, v]) => (
              <div key={String(l)} className="rounded-lg border border-border bg-card p-4"><p className="text-xs text-muted-foreground">{l}</p><p className="mt-1 font-display text-2xl font-semibold">{v}</p></div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <Gate name="Gate 1 · Resonance" pass={gates.resonance} rows={[["Avg engaged time", `${Math.round(m.avgEngaged)}s`, `${T.avgEngagedSeconds}s`], ["Views reaching 75% scroll", pct(m.deepScrollRate), pct(T.deepScrollRate)]]} />
            <Gate name="Gate 2 · Commercial intent" pass={gates.intent} rows={[["CTA click rate", pct(m.ctaClickRate), pct(T.ctaClickRate)], ["Applications", String(m.apps), String(T.applications)], ["Download rate", pct(m.downloadRate), pct(T.downloadRate)]]} />
            <Gate name="Gate 3 · Video ROI" pass={gates.video} rows={[["Play rate (Article 1)", pct(m.videoPlayRate), pct(T.videoPlayRate)], ["Completion rate", pct(m.videoCompletionRate), pct(T.videoCompletionRate)], ["Apply rate: viewers vs not", `${pct(m.viewerConv)} / ${pct(m.nonViewerConv)}`, "viewers ≥"]]} />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="font-semibold">Daily article views</p>
              <div className="mt-4 flex h-32 items-end gap-1">{days.length ? days.map(([d, v]) => <div key={d} title={`${d}: ${v}`} className="flex-1 rounded-t bg-gradient-brand" style={{ height: `${(v / max) * 100}%` }} />) : <p className="text-sm text-muted-foreground">No views yet.</p>}</div>
            </div>
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="font-semibold">By article</p>
              <table className="mt-3 w-full text-sm"><thead><tr className="text-left text-xs text-muted-foreground"><th className="py-1">Article</th><th className="text-right">Views</th><th className="text-right">Downloads</th><th className="text-right">CTA</th></tr></thead>
                <tbody>{articles.map((a) => { const p = perArticle[a.slug] ?? { views: 0, downloads: 0, cta: 0 }; return <tr key={a.slug} className="border-t border-border"><td className="py-2">0{a.n} · {a.kicker}</td><td className="text-right font-mono">{p.views}</td><td className="text-right font-mono">{p.downloads}</td><td className="text-right font-mono">{p.cta}</td></tr>; })}</tbody></table>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-8 space-y-4">
          {apps.length === 0 && <p className="text-muted-foreground">No applications yet.</p>}
          {apps.map((a: any) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div><p className="font-semibold">{a.full_name} · {a.company}</p><p className="text-sm text-muted-foreground">{a.email}{a.website ? ` · ${a.website}` : ""}</p></div>
                <select value={a.status} onChange={async (e) => { await setStatus({ data: { id: a.id, status: e.target.value as any } }); qc.invalidateQueries({ queryKey: ["admin"] }); }} className="rounded-md border border-input bg-background px-2 py-1 text-sm">
                  {["new", "reviewing", "accepted", "declined"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">{a.role} · {a.company_type} · {a.claim_volume} · {new Date(a.created_at).toLocaleString()}{a.source_article ? ` · from ${a.source_article}` : ""}</p>
              <p className="mt-3 text-sm">{a.challenge}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
