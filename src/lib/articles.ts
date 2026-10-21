import technician from "@/assets/img/technician_repairing_exposed.json";
import estimatorComparing from "@/assets/img/estimator_comparing_property.json";
import estimatorReviewing from "@/assets/img/restoration_estimator_reviewing.json";
import contractorAi from "@/assets/img/contractor_reviewing_ai.json";
import professional from "@/assets/img/restoration_professional_working.json";
import editor from "@/assets/img/editor_reviewing_documents.json";
import fragmented from "@/assets/img/insurance_claim_fragmented.json";
import journey from "@/assets/img/insurance_restoration_claim.json";
import reco from "@/assets/img/claim_reco.json";

export const images = {
  technician: technician.url,
  estimatorComparing: estimatorComparing.url,
  estimatorReviewing: estimatorReviewing.url,
  contractorAi: contractorAi.url,
  professional: professional.url,
  editor: editor.url,
  fragmented: fragmented.url,
  journey: journey.url,
  reco: reco.url,
};

export type Block =
  | { t: "p"; text: string }
  | { t: "h2"; text: string }
  | { t: "h3"; text: string }
  | { t: "list"; items: string[] }
  | { t: "callout"; label: string; text: string }
  | { t: "gap"; n: number; title: string; why: string; weak: string; strong: string; steps: string[]; mistake: string }
  | { t: "compare"; leftTitle: string; left: string[]; rightTitle: string; right: string[] }
  | { t: "table"; head: string[]; rows: string[][] }
  | { t: "video" }
  | { t: "figure"; src: string; caption: string }
  | { t: "resource" }
  | { t: "cta" };

export type Resource = {
  slug: string;
  title: string;
  subtitle: string;
  howToUse: string[];
  sections: { heading: string; note?: string; items: string[] }[];
};

export type Article = {
  slug: string;
  n: number;
  kicker: string;
  title: string;
  dek: string;
  audience: string;
  readMins: number;
  image: string;
  imageAlt: string;
  resource: Resource;
  body: Block[];
};

export const articles: Article[] = [
  {
    slug: "5-photographic-gaps-adjusters-look-for",
    n: 1,
    kicker: "Flagship Guide",
    title: "The 5 Photographic Gaps That Slashing Adjusters Look For (And How to Close Them)",
    dek: "Legitimate work gets cut when the photos don't carry the estimate. Here are the five documentation gaps that most often weaken a line item, and the field habits that close them.",
    audience: "Restoration owners, project managers, estimators, and supplement specialists",
    readMins: 12,
    image: images.technician,
    imageAlt: "Restoration technician documenting exposed wall damage",
    resource: {
      slug: "5-point-field-photo-checklist",
      title: "The 5-Point Field Photo Checklist",
      subtitle: "A one-page, field-friendly capture checklist for every loss location.",
      howToUse: [
        "Print and keep in the truck, or save to the tech's phone.",
        "Run through all five points for each room or elevation before leaving the site.",
        "Initial each point. Anything unchecked is flagged in the handoff to the estimator.",
      ],
      sections: [
        { heading: "1. Overall context", items: ["Wide shot from the doorway or corner showing the full room/elevation", "Exterior or address shot linking the location to the claim", "Wide shot taken before anything is moved, removed, or demoed"] },
        { heading: "2. Close-up detail", items: ["Close-up of each damaged material (drywall, flooring, trim, cabinetry, roofing)", "Close-up of the cause or path of loss where visible", "Each close-up preceded by a mid-range shot showing where it sits in the room"] },
        { heading: "3. Scale & measurement", items: ["Tape measure or ruler visible in frame for damage extents", "Moisture meter readings photographed with the meter and material both in frame", "Room dimensions captured (photo of laser distance reading or sketch)"] },
        { heading: "4. Before / after & concealed conditions", items: ["Pre-demo condition of every surface you will remove", "Conditions found after opening walls, floors, or ceilings", "Each additional layer, material, or code-related item discovered during work"] },
        { heading: "5. Link to line items", items: ["Every photo tagged with room + line item or trade", "At least one supporting photo for every line item you expect to bill", "Notes for anything the photo cannot show (odor, sound, hidden layers)"] },
      ],
    },
    body: [
      { t: "p", text: "Most disputed line items are not disputed because the work wasn't needed. They're disputed because the file doesn't prove it was needed. An adjuster or desk reviewer looking at a claim file is asking a narrow question for every line: does the evidence in front of me support this quantity, this material, and this action?" },
      { t: "p", text: "When the answer is unclear, the safe move for the reviewer is to reduce, defer, or request more information. Each of those outcomes costs the restoration company time, cash flow, or both. The good news: the gaps that create this uncertainty are predictable, and they can be closed with field habits rather than extra headcount." },
      { t: "callout", label: "A note on numbers", text: "We don't publish industry-wide reduction percentages here. Published figures vary widely and are rarely sourced well. The more useful number is your own: how many line items on your last 20 closed files were reduced, and how many of those had weak photo support. The Revenue Recovery Pilot is built to find exactly that." },
      { t: "video" },
      { t: "h2", text: "The five gaps" },
      {
        t: "gap", n: 1, title: "Missing overall context",
        why: "A close-up of wet drywall proves that some drywall is wet. It doesn't prove which room, how much of the wall, or that it relates to this loss. Without context, quantities can't be verified.",
        weak: "Four tight shots of stained drywall with no room reference. The reviewer can't tell if they show one wall or four.",
        strong: "Doorway wide shot of the room, then each wall elevation, then the close-ups. The sequence lets anyone reconstruct the space.",
        steps: ["Start every room with a wide shot from the entry point before touching anything.", "Shoot each affected wall elevation straight-on.", "Capture an exterior or address photo at the start of each visit to anchor the date and location."],
        mistake: "Taking context shots after demo has started. The 'before' context is the one that can't be recreated.",
      },
      {
        t: "gap", n: 2, title: "Missing close-ups of damage and cause",
        why: "Wide shots establish the space but rarely show material condition clearly enough to justify replacement over repair.",
        weak: "A room-wide shot where the swollen baseboard is a few pixels across.",
        strong: "A mid-range shot locating the baseboard, followed by a close-up showing swelling, delamination, and the water line.",
        steps: ["Follow the wide → mid → close sequence for every damaged material.", "Photograph the cause or path of loss (supply line, roof penetration, failed seal) where visible.", "Hold the camera steady and use the flash in dark cavities rather than relying on ambient light."],
        mistake: "Close-ups with no mid-range shot, so the reviewer can't tell where in the room they were taken.",
      },
      {
        t: "gap", n: 3, title: "Missing scale and measurements",
        why: "Quantities drive dollars. If the extent of damage is estimated from a photo with no reference, it's a negotiation rather than a verification.",
        weak: "A photo of a water line on drywall with no reference. Is it 6 inches or 26?",
        strong: "A tape measure extended from the floor to the top of the wicking line, readable in frame, plus a moisture meter reading photographed against the material.",
        steps: ["Put a tape or ruler in frame for every extent you will bill against (flood cut height, affected flooring area, roof slope).", "Photograph moisture readings with both the meter display and the material visible.", "Record room dimensions, either a photo of the laser measure or a sketch photographed on site."],
        mistake: "Readings written in notes but never photographed. Notes are useful; photographed readings are evidence.",
      },
      {
        t: "gap", n: 4, title: "Missing before/after and concealed conditions",
        why: "Much of the legitimate scope on a restoration job is only discovered after work begins: a second layer of flooring, wet insulation, a damaged subfloor. If the discovery isn't photographed at the moment of discovery, it's very hard to support later.",
        weak: "An estimate that includes subfloor replacement with only photos of the finished new floor.",
        strong: "Photos of the original floor, the second layer revealed during tear-out, the damaged subfloor with moisture readings, and the replacement installed.",
        steps: ["Photograph every surface before removal, even if it looks obviously damaged.", "Stop and capture each newly exposed layer or condition before continuing.", "Flag concealed conditions to the office the same day so supplements can be prepared while evidence is fresh."],
        mistake: "Treating 'during' photos as optional. They are often the only proof of the most commonly disputed items.",
      },
      {
        t: "gap", n: 5, title: "Missing links between photos and estimate line items",
        why: "A file can contain 300 good photos and still fail if the reviewer has to hunt for the ones that support a specific line. Unlinked evidence often reads as no evidence.",
        weak: "A single photo dump of 300 images in capture order, attached to the estimate.",
        strong: "Each line item references the specific photos that support it, organized by room and trade, with a short note where the photo needs explaining.",
        steps: ["Tag photos by room and trade at capture or immediately after.", "Before submitting, walk the estimate line-by-line and confirm each item has at least one supporting photo.", "Add one-sentence captions for photos that need context (\"second layer of vinyl found beneath LVP\")."],
        mistake: "Assuming the adjuster will review every photo. Make the connection explicit.",
      },
      { t: "h2", text: "Common mistakes that undermine good photos" },
      { t: "list", items: ["Inconsistent capture between techs, so file quality depends on who was on site.", "Photos stored across personal phones, texts, and multiple apps, with no single source of truth.", "Deleting 'bad' photos that were the only record of a condition.", "Waiting until closeout to review documentation, when gaps can no longer be fixed.", "Captions that describe the photo ('wall') instead of the evidence ('wicking to 24\" on north wall, bedroom 2')."] },
      { t: "h2", text: "Putting it into practice" },
      { t: "p", text: "Start with one change: make the 5-point checklist a required step before a tech leaves any loss location. Then, for 30 days, have your estimator note every line item they couldn't support with an existing photo. That list is your clearest view of where documentation is costing you." },
      { t: "resource" },
      { t: "cta" },
    ],
  },
  {
    slug: "connecting-photos-to-scope-supplement-justifications",
    n: 2,
    kicker: "Tactical Walkthrough",
    title: "Connecting Photos to Scope: How to Build Defensible Supplement Justifications",
    dek: "Photo volume isn't evidence quality. A line-by-line method for mapping field documentation to estimate items, measurements, codes, and specs, so a reviewer can verify each line quickly.",
    audience: "Estimators and supplement coordinators",
    readMins: 10,
    image: images.estimatorComparing,
    imageAlt: "Estimator comparing property damage photos against an estimate",
    resource: {
      slug: "photo-to-line-item-evidence-mapping-template",
      title: "Photo-to-Line-Item Evidence Mapping Template",
      subtitle: "Map each estimate line to the photos, measurements, and references that support it.",
      howToUse: [
        "Create one row per line item you're adding or defending in a supplement.",
        "Reference photos by their file name or ID, not by description alone.",
        "Any row with an empty Evidence or Measurement column is a gap to resolve before submitting.",
      ],
      sections: [
        { heading: "Header (complete once per file)", items: ["Claim / file number", "Property address & date of loss", "Estimator & date prepared", "Carrier / reviewer (if known)"] },
        { heading: "Per line item: columns", items: ["Line # and description (as written in the estimate)", "Room / area", "Quantity & unit", "Supporting photo IDs (context, detail, scale)", "Measurement evidence (photo ID or note)", "Code or manufacturer reference (source, section, edition/date)", "Reviewer-facing justification (1–2 sentences)", "Status: Supported / Partial / Gap"] },
        { heading: "Pre-submission check", items: ["Every line has at least one context and one detail photo", "Every quantity has a measurement source", "Every code/spec reference has been verified against the current, applicable source", "Package ordered by room, then trade, matching the estimate order"] },
      ],
    },
    body: [
      { t: "p", text: "A supplement is an argument. Each line is a claim (this work was necessary, in this quantity) and the photos, measurements, and references are the support. The fastest way to strengthen a supplement isn't to add more photos; it's to make the connection between each line and its evidence impossible to miss." },
      { t: "h2", text: "Photo quantity vs. evidence quality" },
      { t: "p", text: "Large photo counts can work against you. A reviewer facing hundreds of unlabeled images has to choose between spending an hour hunting and making a judgment call. Neither outcome is good for you. Evidence quality means a small number of the right photos, clearly tied to the line they support." },
      { t: "compare", leftTitle: "Poorly organized evidence package", left: ["Single ZIP of 287 photos in capture order", "File names like IMG_4471.jpg", "Estimate and photos sent separately", "Code requirement asserted with no citation", "Measurements mentioned in notes only"], rightTitle: "Structured evidence mapping", right: ["Photos grouped by room, then trade", "File names include room, trade, and sequence", "Each line item lists its supporting photo IDs", "Code or spec cited with source and section", "Measurements shown in-frame and referenced per line"] },
      { t: "figure", src: images.editor, caption: "Mapping evidence to scope is desk work. It goes fastest when the field capture is already structured." },
      { t: "h2", text: "Step 1: Connect every line to its photos" },
      { t: "p", text: "Walk the estimate top to bottom. For each line, identify the minimum set of photos a reviewer needs: usually one context shot (where), one detail shot (what), and one scale shot (how much). Record the photo IDs against the line. If you can't find them, mark the line as a gap; don't submit hoping it goes unnoticed." },
      { t: "h2", text: "Step 2: Document measurements explicitly" },
      { t: "list", items: ["Flood cuts: tape in frame from floor to cut line, per wall.", "Flooring: room dimensions plus photos showing the affected area boundary.", "Roofing: pitch gauge reading and photographed measurements or a report from a measurement tool.", "Drying: moisture readings photographed at consistent points over time."] },
      { t: "h2", text: "Step 3: Reference verified codes and manufacturer specs" },
      { t: "p", text: "Code and manufacturer requirements can legitimately expand scope, but only when they're cited accurately. Reference the specific source, section, and edition or publication date, and confirm it's the version adopted in the jurisdiction or applicable to the installed product. A vague 'per code' note is easy to dismiss; a precise, verifiable citation is not." },
      { t: "callout", label: "Verify before you cite", text: "Code adoption varies by jurisdiction, and manufacturer installation instructions change. Confirm the current applicable version for each file rather than reusing citations from older supplements." },
      { t: "h2", text: "Step 4: Organize the package for professional review" },
      { t: "list", items: ["Lead with a one-page summary: what's being added or disputed, and the total.", "Order line items the same way the estimate is ordered.", "Place supporting photos directly beside or beneath the line they support.", "Keep justifications short and factual. Describe the condition, the measurement, and the requirement.", "Close with a list of open items you're still documenting, if any."] },
      { t: "h2", text: "A worked example" },
      { t: "table", head: ["Line item", "Evidence", "Measurement", "Reference", "Status"], rows: [["Remove & replace drywall, 4' flood cut, Bedroom 2", "BR2-CTX-01, BR2-DRY-03, -04", "Tape in frame, wicking to 22\"", "n/a", "Supported"], ["Detach & reset base cabinets, Kitchen", "KIT-CTX-01, KIT-CAB-02", "Toe-kick moisture readings, photo KIT-MST-01", "n/a", "Supported"], ["Remove second layer of vinyl flooring", "KIT-FLR-05 (found during tear-out)", "Area sketch, photo KIT-SK-01", "n/a", "Partial: needs close-up of layer edge"], ["Drip edge at eaves", "RF-CTX-02", "Linear footage from measurement report", "Local adopted code section (verify)", "Gap: citation not verified"]] },
      { t: "resource" },
      { t: "cta" },
    ],
  },
  {
    slug: "45-minute-job-closeout-audit",
    n: 3,
    kicker: "Financial & Closeout Review",
    title: "The 45-Minute Job Closeout Audit: Finding Revenue Hiding in Completed Work",
    dek: "A timed, repeatable review for reconciling what was done against what was billed, and for separating documented discrepancies from assumptions before you chase them.",
    audience: "Restoration executives, owners, operations leaders, and revenue recovery managers",
    readMins: 9,
    image: images.estimatorReviewing,
    imageAlt: "Restoration estimator reviewing completed job documentation",
    resource: {
      slug: "45-minute-job-closeout-audit-checklist",
      title: "45-Minute Job Closeout Audit Checklist",
      subtitle: "A timed, six-stage protocol for reviewing one completed file.",
      howToUse: [
        "Set a timer. Stay within each stage's time box; note open questions rather than resolving them mid-audit.",
        "Audit files in batches of 3–5, starting with recently closed jobs.",
        "Only items in the 'Documented discrepancy' column move forward to a supplement or billing correction.",
      ],
      sections: [
        { heading: "Stage 1: File assembly (5 min)", items: ["Final estimate, all supplements, and invoice in one place", "Photo set, moisture logs, and field notes collected", "Change orders and customer sign-offs located"] },
        { heading: "Stage 2: Scope reconciliation (12 min)", items: ["Compare work shown in photos and notes against billed line items, room by room", "List work performed but not billed", "List billed items lacking supporting evidence"] },
        { heading: "Stage 3: Equipment & drying (8 min)", items: ["Equipment days on logs vs. days billed", "Monitoring visits documented vs. billed", "Drying goals and readings support the duration"] },
        { heading: "Stage 4: Materials & concealed conditions (8 min)", items: ["Concealed conditions found during work reflected in the final estimate", "Material quantities on invoices/receipts vs. billed quantities", "Code or manufacturer-required items considered"] },
        { heading: "Stage 5: Classify findings (7 min)", items: ["Documented discrepancy: evidence exists in the file", "Probable: evidence likely exists, needs retrieval", "Assumption: no evidence; do not pursue without new documentation"] },
        { heading: "Stage 6: Action & root cause (5 min)", items: ["Assign owner and next step for each documented discrepancy", "Note the process gap that caused each miss", "Record findings in a running audit log"] },
      ],
    },
    body: [
      { t: "p", text: "Most restoration businesses review files when something goes wrong: a short payment, a dispute, a slow AR report. Fewer review files that closed without incident, which is where quiet, unbilled work tends to sit. A short, timed audit applied consistently to closed jobs turns that blind spot into a measurable process." },
      { t: "h2", text: "Why reconcile completed work against billing" },
      { t: "p", text: "Between the first estimate and final invoice, scope changes. Concealed conditions are found, drying takes longer, equipment is added, and items are completed in the field that never make it back into the estimate. The closeout audit asks one question: does the bill reflect what the file shows was done?" },
      { t: "h2", text: "The 45-minute protocol" },
      { t: "table", head: ["Stage", "Time", "Focus"], rows: [["1. File assembly", "5 min", "Gather estimate, supplements, invoice, photos, logs, notes"], ["2. Scope reconciliation", "12 min", "Room-by-room: work shown vs. work billed"], ["3. Equipment & drying", "8 min", "Logged days and visits vs. billed"], ["4. Materials & concealed conditions", "8 min", "Discoveries and quantities reflected in final"], ["5. Classify findings", "7 min", "Documented vs. probable vs. assumption"], ["6. Action & root cause", "5 min", "Owners, next steps, process gaps"], ["Total", "45 min", ""]] },
      { t: "p", text: "The time boxes matter. The audit is a screening tool, not a full re-estimate. When a question can't be answered within its stage, write it down and move on. A consistent 45 minutes across many files gives you better information than three hours on one." },
      { t: "figure", src: images.reco, caption: "Reconciling a closed file: photos, logs, and the final invoice side by side." },
      { t: "h2", text: "Separate documented discrepancies from assumptions" },
      { t: "p", text: "This is the discipline that keeps an audit credible. A finding only counts as recoverable if the evidence is already in the file. Everything else is a hypothesis." },
      { t: "compare", leftTitle: "Assumption (don't pursue as-is)", left: ["\"We probably ran more dehus than that.\"", "\"There was likely a second layer of flooring.\"", "\"Jobs like this usually need more days.\""], rightTitle: "Documented discrepancy (actionable)", right: ["Equipment log shows 4 dehus for 5 days; invoice bills 3 for 4.", "Photo KIT-FLR-05 shows second vinyl layer; not on final estimate.", "Moisture log shows goal met on day 5; billed 4 monitoring visits for 5 performed."] },
      { t: "h2", text: "Avoid unsupported statistics" },
      { t: "p", text: "You'll see claims that a fixed percentage of every job goes unbilled. Treat them with caution. Leakage varies with job type, team, carrier mix, and process maturity. Instead, audit 10–20 of your own closed files and measure your rate. It's the only number that should drive your decisions, and it gives you a baseline to improve against." },
      { t: "h2", text: "Turning findings into process change" },
      { t: "list", items: ["Track the root cause for each documented discrepancy (capture gap, handoff gap, estimating gap).", "Review root causes monthly; the most frequent one is your next process fix.", "Feed recurring gaps back into field checklists and handoff criteria."] },
      { t: "resource" },
      { t: "cta" },
    ],
  },
  {
    slug: "field-to-desk-evidence-handoffs",
    n: 4,
    kicker: "Operational Workflow",
    title: "Field-to-Desk Handoffs: Standardizing Evidence Without Burdening Field Techs",
    dek: "Clear capture rules, simple naming and tagging, and defined handoff criteria get the office what it needs, without turning your techs into administrators.",
    audience: "Restoration operations managers, production managers, and field supervisors",
    readMins: 9,
    image: images.contractorAi,
    imageAlt: "Contractor reviewing restoration documentation on a tablet",
    resource: {
      slug: "field-to-desk-evidence-handoff-sop",
      title: "Field-to-Desk Evidence Handoff SOP",
      subtitle: "A standard operating procedure for capture, tagging, escalation, and handoff.",
      howToUse: [
        "Adapt the naming convention and escalation contacts to your team, then distribute.",
        "Train in the field with a real job, not in a meeting.",
        "Review handoff rejections weekly for the first month to refine the rules.",
      ],
      sections: [
        { heading: "1. Purpose & scope", items: ["Ensure every loss location produces evidence sufficient to support the estimate", "Applies to all field personnel on mitigation, reconstruction, and roofing jobs"] },
        { heading: "2. Capture rules", items: ["Follow the 5-point checklist at every room / elevation", "Wide → mid → close sequence for every damaged material", "Measurement in frame for any extent that will be billed", "Never delete photos; mark unusable ones instead", "Capture concealed conditions before continuing work"] },
        { heading: "3. Naming & tagging", note: "Format: ROOM-TRADE-SEQ (e.g., BR2-DRY-03)", items: ["Room codes: KIT, BR1, BR2, BATH1, LIV, HALL, BSMT, EXT, RF", "Trade codes: CTX (context), DRY, FLR, CAB, INS, MST (moisture), RF, SK (sketch)", "Tag at capture where the app supports it; otherwise within the same day"] },
        { heading: "4. Escalation protocol", items: ["Concealed condition affecting scope → notify estimator same day with photos", "Customer refuses access or work → photograph conditions, notify PM immediately", "Safety or code concern → stop, photograph, notify supervisor before proceeding"] },
        { heading: "5. Handoff criteria (Definition of Done)", items: ["All affected rooms have the 5 points captured", "Photos uploaded to the single system of record", "Tags complete; notes added for anything a photo can't show", "Readings logged and photographed", "Open items listed for the estimator"] },
        { heading: "6. Roles & review", items: ["Field tech: capture, tag, upload, flag", "Field supervisor: spot-check one job per tech per week", "Estimator: reject incomplete handoffs with specific missing items", "Ops manager: review rejection trends monthly"] },
      ],
    },
    body: [
      { t: "p", text: "Every gap in the first three articles traces back to a moment in the field. But adding requirements to field techs has a cost: more steps, more screens, more time on site. The goal of a standardized handoff is the opposite: fewer decisions in the field, because the rules are simple and the same every time." },
      { t: "h2", text: "Standardize requirements, not effort" },
      { t: "p", text: "Techs don't resist documentation; they resist ambiguity and rework. A short, fixed set of capture rules is easier to follow than 'take good photos.' Keep the list to what the estimator actually needs to support the scope, and remove everything else." },
      { t: "compare", leftTitle: "Administrative overload", left: ["20-field forms on every room", "Different requirements per estimator", "Re-visits to capture missed photos", "Feedback only when something goes wrong"], rightTitle: "Standardized evidence", right: ["5 capture points per room, same for everyone", "One naming convention, short codes", "Same-day flags for concealed conditions", "Weekly spot-checks with specific feedback"] },
      { t: "h2", text: "Photo naming and tagging conventions" },
      { t: "p", text: "Use a short, structured format: ROOM-TRADE-SEQUENCE. BR2-DRY-03 is the third drywall photo in bedroom 2. Short codes are faster to apply than free text and make it trivial for the estimator to pull every photo for a line item." },
      { t: "table", head: ["Code type", "Examples"], rows: [["Room", "KIT, BR1, BR2, BATH1, LIV, BSMT, EXT, RF"], ["Trade / evidence", "CTX (context), DRY, FLR, CAB, INS, MST (moisture), SK (sketch)"], ["Sequence", "01, 02, 03…"]] },
      { t: "h2", text: "Capture rules" },
      { t: "list", items: ["Five points per room: context, close-up, scale, before/during, and tags.", "Wide → mid → close for each damaged material.", "Measurement in frame for every billable extent.", "Never delete; mark unusable photos so the record is intact.", "Stop and capture any newly exposed condition before continuing."] },
      { t: "figure", src: images.professional, caption: "Capture rules should be simple enough to follow on a ladder." },
      { t: "h2", text: "Escalation protocols" },
      { t: "p", text: "The most valuable evidence is often time-sensitive. Define exactly what triggers a same-day notification (concealed conditions, access refusals, safety or code concerns) and who receives it. The tech's job is to photograph and flag; the estimator's job is to decide what it means for scope." },
      { t: "h2", text: "Handoff criteria" },
      { t: "p", text: "Agree on a definition of done for the field visit. If the handoff doesn't meet it, the estimator returns it with the specific missing items, not a general complaint. Track those rejections: they show you exactly which rule needs better training or simplification." },
      { t: "h2", text: "Rolling it out" },
      { t: "list", items: ["Pilot with one crew for two weeks before rolling out company-wide.", "Train on a live job; show the estimator's view so techs see why it matters.", "Celebrate clean handoffs as visibly as you correct incomplete ones."] },
      { t: "resource" },
      { t: "cta" },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const getResource = (slug: string) => {
  const a = articles.find((x) => x.resource.slug === slug);
  return a ? { article: a, resource: a.resource } : undefined;
};
