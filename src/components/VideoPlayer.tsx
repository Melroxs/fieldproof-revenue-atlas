import { useEffect, useRef, useState } from "react";
import { images } from "@/lib/articles";
import { track } from "@/lib/track";

// Set to an MP4 URL to swap the built-in chapter explainer for a filmed companion video.
const VIDEO_SRC: string | null = null;

const chapters = [
  { title: "Gap 1 — Overall context", line: "Start every room with a wide shot before anything moves.", img: images.journey },
  { title: "Gap 2 — Close-ups of damage & cause", line: "Wide → mid → close for every damaged material.", img: images.technician },
  { title: "Gap 3 — Scale & measurement", line: "If you'll bill the extent, put a tape in the frame.", img: images.professional },
  { title: "Gap 4 — Before/after & concealed conditions", line: "Stop and capture each layer the moment it's exposed.", img: images.fragmented },
  { title: "Gap 5 — Links to line items", line: "Every line item points to the photos that prove it.", img: images.estimatorComparing },
];
const CH = 8; // seconds per chapter
const TOTAL = CH * chapters.length;

export function VideoPlayer({ article }: { article: string }) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const started = useRef(false);
  const marks = useRef(new Set<number>());

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setT((x) => Math.min(TOTAL, x + 0.1)), 100);
    return () => clearInterval(id);
  }, [playing]);

  useEffect(() => {
    const pct = (t / TOTAL) * 100;
    for (const m of [25, 50, 75]) if (pct >= m && !marks.current.has(m)) { marks.current.add(m); track("video_progress", { article, value: m }); }
    if (t >= TOTAL && playing) { setPlaying(false); if (!marks.current.has(100)) { marks.current.add(100); track("video_complete", { article }); } }
  }, [t, playing, article]);

  const play = () => {
    if (t >= TOTAL) { setT(0); marks.current.clear(); }
    if (!started.current) { started.current = true; track("video_play", { article }); }
    setPlaying((p) => !p);
  };
  const idx = Math.min(chapters.length - 1, Math.floor(t / CH));
  const c = chapters[idx]!;

  if (VIDEO_SRC) {
    return (
      <video controls className="aspect-video w-full rounded-lg border border-border" src={VIDEO_SRC}
        onPlay={() => { if (!started.current) { started.current = true; track("video_play", { article }); } }}
        onEnded={() => track("video_complete", { article })} />
    );
  }

  return (
    <figure className="no-print my-10">
      <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-border bg-card">
        {chapters.map((ch, i) => (
          <img key={i} src={ch.img} alt="" className={`absolute inset-0 h-full w-full object-cover saturate-[0.75] transition-all duration-[1500ms] ${i === idx ? "scale-105 opacity-100" : "scale-100 opacity-0"}`} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-widest text-cyan">Atlas Field Notes · Companion video</div>
        <div className="absolute inset-x-0 bottom-14 px-6 md:px-10">
          <p className="font-mono text-xs text-cyan">{String(idx + 1).padStart(2, "0")} / 05</p>
          <h3 className="mt-1 text-xl font-semibold md:text-3xl">{c.title}</h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">{c.line}</p>
        </div>
        {!playing && (
          <button onClick={play} aria-label="Play video" className="absolute inset-0 m-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-brand text-2xl text-primary-foreground shadow-lg">▶</button>
        )}
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-background/80 px-4 py-2.5 backdrop-blur">
          <button onClick={play} className="w-8 text-sm" aria-label={playing ? "Pause" : "Play"}>{playing ? "❚❚" : "▶"}</button>
          <div className="relative flex h-1.5 flex-1 gap-1">
            {chapters.map((_, i) => (
              <button key={i} onClick={() => { setT(i * CH); }} className="h-full flex-1 overflow-hidden rounded bg-muted" aria-label={`Chapter ${i + 1}`}>
                <span className="block h-full bg-gradient-brand" style={{ width: `${Math.max(0, Math.min(1, (t - i * CH) / CH)) * 100}%` }} />
              </button>
            ))}
          </div>
          <span className="font-mono text-xs text-muted-foreground">{Math.floor(t)}s / {TOTAL}s</span>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-muted-foreground">The 5 gaps in 40 seconds. Use the chapter bar to jump to any gap.</figcaption>
    </figure>
  );
}
