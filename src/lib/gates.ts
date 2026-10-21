export type EventRow = { session_id: string; event: string; article: string | null; value: number | null; created_at: string };

// Pilot targets for the 30-day review. Adjust here to change gate thresholds.
export const GATE_TARGETS = {
  avgEngagedSeconds: 120,
  deepScrollRate: 0.4, // share of views reaching 75% scroll
  ctaClickRate: 0.03, // CTA clicks per article view
  applications: 5,
  downloadRate: 0.08,
  videoPlayRate: 0.25, // plays per Article 1 view
  videoCompletionRate: 0.4,
};

export const FLAGSHIP = "5-photographic-gaps-adjusters-look-for";

export function computeMetrics(events: EventRow[]) {
  const count = (e: string, a?: string) => events.filter((x) => x.event === e && (!a || x.article === a)).length;
  const views = count("article_view");
  const engaged = events.filter((e) => e.event === "engaged_time");
  const avgEngaged = engaged.length ? engaged.reduce((s, e) => s + (e.value ?? 0), 0) / engaged.length : 0;
  const deep = events.filter((e) => e.event === "scroll_depth" && (e.value ?? 0) >= 75).length;
  const cta = count("cta_click");
  const downloads = count("download");
  const apps = count("application_submit");
  const flagViews = count("article_view", FLAGSHIP);
  const plays = count("video_play", FLAGSHIP);
  const completes = count("video_complete", FLAGSHIP);

  const flagSessions = new Set(events.filter((e) => e.event === "article_view" && e.article === FLAGSHIP).map((e) => e.session_id));
  const videoSessions = new Set(events.filter((e) => e.event === "video_play").map((e) => e.session_id));
  const appSessions = new Set(events.filter((e) => e.event === "application_submit").map((e) => e.session_id));
  const viewers = [...flagSessions].filter((s) => videoSessions.has(s));
  const nonViewers = [...flagSessions].filter((s) => !videoSessions.has(s));
  const rate = (list: string[]) => (list.length ? list.filter((s) => appSessions.has(s)).length / list.length : 0);

  const r = (a: number, b: number) => (b ? a / b : 0);
  return {
    views, avgEngaged, deepScrollRate: r(deep, views), ctaClickRate: r(cta, views), downloads,
    downloadRate: r(downloads, views), apps, cta, flagViews, plays, completes,
    videoPlayRate: r(plays, flagViews), videoCompletionRate: r(completes, plays),
    viewerConv: rate(viewers), nonViewerConv: rate(nonViewers),
  };
}

export type Metrics = ReturnType<typeof computeMetrics>;

export function evaluateGates(m: Metrics, t = GATE_TARGETS) {
  return {
    resonance: m.avgEngaged >= t.avgEngagedSeconds && m.deepScrollRate >= t.deepScrollRate,
    intent: m.ctaClickRate >= t.ctaClickRate && m.apps >= t.applications && m.downloadRate >= t.downloadRate,
    video: m.videoPlayRate >= t.videoPlayRate && m.videoCompletionRate >= t.videoCompletionRate && m.viewerConv >= m.nonViewerConv && m.plays > 0,
  };
}
