// Privacy-conscious analytics: anonymous per-tab session id (sessionStorage), no cookies, no PII, no third parties.
function sid() {
  try {
    let s = sessionStorage.getItem("atlas_sid");
    if (!s) { s = crypto.randomUUID(); sessionStorage.setItem("atlas_sid", s); }
    return s;
  } catch { return "anon-session"; }
}

export function track(event: string, data: { article?: string | null; value?: number; meta?: Record<string, string | number> } = {}) {
  if (typeof window === "undefined") return;
  if (navigator.doNotTrack === "1") return;
  const payload = JSON.stringify({ session_id: sid(), event, article: data.article ?? null, value: data.value ?? null, meta: data.meta });
  const blob = new Blob([payload], { type: "text/plain" });
  if (!navigator.sendBeacon?.("/api/public/track", blob)) {
    fetch("/api/public/track", { method: "POST", body: payload, keepalive: true }).catch(() => {});
  }
}
