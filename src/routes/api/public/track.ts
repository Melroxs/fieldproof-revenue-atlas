import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  session_id: z.string().min(8).max(64).regex(/^[a-zA-Z0-9-]+$/),
  event: z.enum(["article_view", "scroll_depth", "engaged_time", "download", "cta_click", "application_submit", "video_play", "video_progress", "video_complete", "product_click"]),
  article: z.string().max(120).nullable().optional(),
  value: z.number().min(0).max(100000).nullable().optional(),
  meta: z.record(z.string().max(40), z.union([z.string().max(200), z.number()])).optional(),
});

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try { body = JSON.parse(await request.text()); } catch { return new Response("bad", { status: 400 }); }
        const parsed = schema.safeParse(body);
        if (!parsed.success) return new Response("bad", { status: 400 });
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const d = parsed.data;
        await supabaseAdmin.from("analytics_events").insert({ session_id: d.session_id, event: d.event, article: d.article ?? null, value: d.value ?? null, meta: d.meta ?? null });
        return new Response(null, { status: 204 });
      },
    },
  },
});
