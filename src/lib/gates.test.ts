import { describe, expect, it } from "vitest";
import { computeMetrics, evaluateGates, FLAGSHIP, type EventRow } from "./gates";

const ev = (session_id: string, event: string, value: number | null = null, article: string | null = FLAGSHIP): EventRow => ({ session_id, event, article, value, created_at: "" });

describe("pilot gates", () => {
  it("resonance passes at 120s average engagement and 40% deep scroll", () => {
    const rows = [ev("a", "article_view"), ev("b", "article_view"), ev("a", "engaged_time", 120), ev("a", "scroll_depth", 75)];
    const m = computeMetrics(rows);
    expect(m.deepScrollRate).toBe(0.5);
    expect(evaluateGates(m).resonance).toBe(true);
  });
  it("resonance fails below 120s engagement", () => {
    const m = computeMetrics([ev("a", "article_view"), ev("a", "engaged_time", 119), ev("a", "scroll_depth", 100)]);
    expect(evaluateGates(m).resonance).toBe(false);
  });
  it("commercial intent needs at least 5 applications", () => {
    const base = [...Array(10)].map((_, i) => ev(`s${i}`, "article_view"));
    const extra = [ev("s0", "cta_click"), ev("s0", "download")];
    const apps4 = [...Array(4)].map((_, i) => ev(`s${i}`, "application_submit", null, null));
    expect(evaluateGates(computeMetrics([...base, ...extra, ...apps4])).intent).toBe(false);
    expect(evaluateGates(computeMetrics([...base, ...extra, ...apps4, ev("s9", "application_submit", null, null)])).intent).toBe(true);
  });
});
