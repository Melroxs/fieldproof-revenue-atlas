import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { computeMetrics, evaluateGates, type EventRow } from "./gates";

export const applicationSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid business email").max(254),
  company: z.string().trim().min(2, "Enter your company name").max(160),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  role: z.string().trim().min(1, "Select your role").max(80),
  company_type: z.string().trim().min(1, "Select a company type").max(120),
  claim_volume: z.string().trim().min(1, "Select your claim volume").max(40),
  challenge: z.string().trim().min(20, "Tell us a little more (20+ characters)").max(1800),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
  source_article: z.string().max(120).optional(),
});

export const submitApplication = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => applicationSchema.parse(d))
  .handler(async ({ data }) => {
    // The blog uses Atlas Universal as the system of record. Keep the service-role
    // credential server-side and write only through the validated public RPC;
    // never insert directly into pilot_applications or return applicant PII.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const comments = [
      data.challenge.trim(),
      data.source_article ? `Source article: ${data.source_article}` : null,
      "Application submitted from Atlas Intelligence blog.",
    ].filter(Boolean).join("\n\n");

    const { data: result, error } = await supabaseAdmin.rpc("pilot_interest_submit", {
      p_full_name: data.full_name,
      p_email: data.email,
      p_company_name: data.company,
      p_role: data.role,
      p_website: data.website || null,
      p_company_size: data.claim_volume,
      p_interest_area: data.company_type,
      p_comments: comments,
    });
    if (error) {
      // Preserve the server's validation/throttle message for logs, but avoid
      // leaking database details to the browser.
      console.error("[pilot application] Atlas RPC rejected submission", error.message);
      throw new Error("Could not submit application. Please review your details or try again later.");
    }
    return { ok: true, receivedAt: result?.receivedAt ?? null };
  });

async function assertAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("has_role", { _user_id: userId, _role: "admin" });
  if (!data) throw new Error("Forbidden: admin access required");
}

export const getAdminData = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    await assertAdmin(supabase, userId);
    const since = new Date(Date.now() - 30 * 864e5).toISOString();
    const { data: apps } = await supabase.from("pilot_applications").select("*").order("created_at", { ascending: false });
    const events: EventRow[] = [];
    for (let from = 0; ; from += 1000) {
      const { data } = await supabase.from("analytics_events").select("session_id,event,article,value,created_at").gte("created_at", since).range(from, from + 999);
      if (!data?.length) break;
      events.push(...(data as EventRow[]));
      if (data.length < 1000) break;
    }
    const metrics = computeMetrics(events);
    const perArticle: Record<string, { views: number; downloads: number; cta: number }> = {};
    for (const e of events) {
      if (!e.article) continue;
      const p = (perArticle[e.article] ??= { views: 0, downloads: 0, cta: 0 });
      if (e.event === "article_view") p.views++;
      if (e.event === "download") p.downloads++;
      if (e.event === "cta_click") p.cta++;
    }
    const byDay: Record<string, number> = {};
    for (const e of events) if (e.event === "article_view") { const d = e.created_at.slice(0, 10); byDay[d] = (byDay[d] ?? 0) + 1; }
    return { apps: apps ?? [], metrics, gates: evaluateGates(metrics), perArticle, byDay };
  });

export const updateApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => z.object({ id: z.string().uuid(), status: z.enum(["new", "reviewing", "accepted", "declined"]) }).parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context.supabase, context.userId);
    const { error } = await context.supabase.from("pilot_applications").update({ status: data.status }).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
