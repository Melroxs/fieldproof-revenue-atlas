import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { z } from "zod";
import { applicationSchema, submitApplication } from "@/lib/pilot.functions";
import { images } from "@/lib/articles";
import { EditorialImage } from "@/components/site";
import { track } from "@/lib/track";

export const Route = createFileRoute("/apply")({
  validateSearch: z.object({ from: z.string().max(120).optional() }),
  head: () => ({
    meta: [
      { title: "Apply for the Atlas Revenue Recovery Pilot" },
      { name: "description", content: "Run 5 of your past or in-progress claim files through the Atlas evidence review framework to identify potential missed scope and unbilled line items." },
      { property: "og:title", content: "Apply for the Atlas Revenue Recovery Pilot" },
      { property: "og:description", content: "Five claim files. One evidence review. Find potential missed scope." },
    ],
  }),
  component: Apply,
});

const roles = ["Owner / Executive", "Operations Manager", "Project Manager", "Estimator", "Supplement Specialist", "Field Supervisor", "Other"];
const types = ["Water / fire mitigation", "Reconstruction / general contractor", "Roofing", "Full-service restoration", "Other"];
const volumes = ["Under 10 claims / month", "10–25 / month", "26–50 / month", "51–100 / month", "100+ / month"];

const field = "mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm outline-none focus:border-primary";

function Apply() {
  const { from } = Route.useSearch();
  const submit = useServerFn(submitApplication);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = { ...Object.fromEntries(f.entries()), consent: f.get("consent") === "on", source_article: from };
    const parsed = applicationSchema.safeParse(data);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      for (const i of parsed.error.issues) errs[String(i.path[0])] ??= i.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setState("sending");
    try {
      await submit({ data: parsed.data });
      track("application_submit", { article: from ?? null });
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-success">Application received</p>
        <h1 className="mt-4 text-3xl font-semibold">Thank you. Your application is in.</h1>
        <p className="mt-4 text-muted-foreground">Our team will review it and reply to your business email with next steps for sharing your five files.</p>
        <Link to="/" className="mt-8 inline-block text-primary">← Back to Field Notes</Link>
      </div>
    );
  }

  const E = ({ n }: { n: string }) => (errors[n] ? <p className="mt-1 text-xs text-destructive">{errors[n]}</p> : null);

  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 md:grid-cols-[1fr_1.2fr]">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan">Atlas Revenue Recovery Pilot</p>
        <h1 className="mt-4 text-3xl font-semibold leading-tight md:text-4xl">Apply for the Atlas Revenue Recovery Pilot</h1>
        <p className="mt-5 text-muted-foreground">Run 5 of your past or in-progress claim files through our evidence review framework to identify potential missed scope and unbilled line items.</p>
        <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
          <li>→ Built on the same framework as the Field Notes series</li>
          <li>→ Findings separate documented discrepancies from assumptions</li>
          <li>→ Limited pilot spots; applications reviewed by our team</li>
        </ul>
        <EditorialImage src={images.reco} alt="Claim file reconciliation" className="mt-8 aspect-[16/10]" />
      </div>
      <form onSubmit={onSubmit} noValidate className="rounded-xl border border-border bg-card p-6 md:p-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="text-sm">Full name<input name="full_name" className={field} maxLength={100} /><E n="full_name" /></label>
          <label className="text-sm">Business email<input name="email" type="email" className={field} maxLength={255} /><E n="email" /></label>
          <label className="text-sm">Company name<input name="company" className={field} maxLength={150} /><E n="company" /></label>
          <label className="text-sm">Website <span className="text-muted-foreground">(optional)</span><input name="website" className={field} maxLength={255} placeholder="example.com" /><E n="website" /></label>
          <label className="text-sm">Role<select name="role" className={field} defaultValue=""><option value="" disabled>Select…</option>{roles.map((r) => <option key={r}>{r}</option>)}</select><E n="role" /></label>
          <label className="text-sm">Company type<select name="company_type" className={field} defaultValue=""><option value="" disabled>Select…</option>{types.map((r) => <option key={r}>{r}</option>)}</select><E n="company_type" /></label>
          <label className="text-sm sm:col-span-2">Claim volume<select name="claim_volume" className={field} defaultValue=""><option value="" disabled>Select…</option>{volumes.map((r) => <option key={r}>{r}</option>)}</select><E n="claim_volume" /></label>
          <label className="text-sm sm:col-span-2">Primary documentation or revenue recovery challenge<textarea name="challenge" rows={4} maxLength={2000} className={field} placeholder="e.g. Supplements for concealed conditions keep getting reduced…" /><E n="challenge" /></label>
          <label className="flex gap-3 text-sm sm:col-span-2"><input type="checkbox" name="consent" className="mt-1" /><span className="text-muted-foreground">I agree that Atlas Intelligence may store this information and contact me about the pilot.</span></label>
          <div className="sm:col-span-2"><E n="consent" /></div>
        </div>
        {state === "error" && <p className="mt-4 text-sm text-destructive">Something went wrong. Please try again.</p>}
        <button disabled={state === "sending"} className="mt-6 w-full rounded-md bg-gradient-brand px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-60">
          {state === "sending" ? "Submitting…" : "Submit application"}
        </button>
      </form>
    </div>
  );
}
