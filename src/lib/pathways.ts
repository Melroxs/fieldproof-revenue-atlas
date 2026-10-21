// Reader pathway from practical guidance to Atlas. Each article ends with a short, non-salesy
// "Where Atlas fits" note tied to the article's own problem. Claims are limited to the pilot's
// evidence review framework; broader product capabilities should be verified before adding.
export const pathways: Record<number, { problem: string; atlas: string }> = {
  1: {
    problem: "Running the 5-point check by hand works for one job. Across dozens of open files, it's hard to see which ones have gaps before they reach a reviewer.",
    atlas: "Atlas is building operational intelligence for restoration teams around exactly this connection between field evidence and the estimate. In the pilot, we apply this same 5-gap framework to your own files.",
  },
  2: {
    problem: "Evidence mapping is the slowest part of a supplement because photos, notes, and estimate lines live in different places.",
    atlas: "Atlas focuses on structuring the link between photos and line items so the evidence package is easier to assemble and review. The pilot shows what that mapping looks like on five of your files.",
  },
  3: {
    problem: "A closeout audit is only as useful as the number of files you can run it on, and manual audits rarely scale past a few a month.",
    atlas: "The Atlas Revenue Recovery Pilot runs an evidence review on five of your past or in-progress files and separates documented discrepancies from assumptions, using the same discipline described here.",
  },
  4: {
    problem: "Standards only stick when the office can see, per job, whether the handoff met them.",
    atlas: "Atlas is designed to make evidence requirements visible across the field-to-desk handoff. The pilot is a low-commitment way to see where your current handoffs leave gaps.",
  },
};
