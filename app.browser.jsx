const { useState, useCallback, useRef, useEffect } = React;
// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = `
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
--bg: #0a0c0f;
--surface: #111318;
--surface2: #181c22;
--border: #252a33;
--border2: #2e3540;
--accent: #f4a000;
--accent2: #e05c00;
--danger: #e03e3e;
--warn: #d97706;
--ok: #22c55e;
--text: #e8eaed;
--text2: #8a9ab0;
--text3: #4a5568;
--mono: 'IBM Plex Mono', monospace;
--sans: 'IBM Plex Sans', sans-serif;
--display: 'Bebas Neue', sans-serif;
}
body { background: var(--bg); color: var(--text); font-family: var(--sans); }
.app {
min-height: 100vh;
display: grid;
grid-template-rows: auto 1fr;
}
/* ── Header ── */
.header {
background: var(--surface);
border-bottom: 1px solid var(--border);
padding: 0 2rem;
display: flex;
align-items: center;
justify-content: space-between;
height: 64px;

position: sticky;
top: 0;
z-index: 100;
}
.header-brand {
display: flex;
align-items: center;
gap: 12px;
}
.header-icon {
width: 36px; height: 36px;
background: var(--accent);
border-radius: 6px;
display: flex; align-items: center; justify-content: center;
font-size: 18px;
}
.header-title {
font-family: var(--display);
font-size: 1.5rem;
letter-spacing: 2px;
color: var(--text);
}
.header-title span { color: var(--accent); }
.header-badge {
font-family: var(--mono);
font-size: 0.65rem;
background: var(--surface2);
border: 1px solid var(--border2);
color: var(--text2);
padding: 3px 8px;
border-radius: 4px;
letter-spacing: 1px;
text-transform: uppercase;
}
/* ── Tab Nav ── */
.tab-nav {
display: flex;
gap: 0;
border-bottom: 1px solid var(--border);
background: var(--surface);
padding: 0 2rem;
}
.tab-btn {
font-family: var(--mono);
font-size: 0.75rem;
letter-spacing: 1px;

text-transform: uppercase;
padding: 14px 20px;
border: none;
background: none;
color: var(--text3);
cursor: pointer;
border-bottom: 2px solid transparent;
transition: all 0.15s;
display: flex;
align-items: center;
gap: 8px;
}
.tab-btn:hover { color: var(--text2); }
.tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); }
.tab-btn .badge {
background: var(--accent);
color: #000;
font-size: 0.6rem;
padding: 1px 5px;
border-radius: 10px;
font-weight: 600;
}
/* ── Main Layout ── */
.main { padding: 2rem; max-width: 1400px; margin: 0 auto; width: 100%; }
/* ── Cards ── */
.card {
background: var(--surface);
border: 1px solid var(--border);
border-radius: 8px;
padding: 1.5rem;
margin-bottom: 1.5rem;
}
.card-header {
display: flex;
align-items: center;
justify-content: space-between;
margin-bottom: 1.25rem;
padding-bottom: 1rem;
border-bottom: 1px solid var(--border);
}
.card-title {
font-family: var(--mono);
font-size: 0.7rem;
text-transform: uppercase;
letter-spacing: 2px;

color: var(--accent);
display: flex;
align-items: center;
gap: 8px;
}
/* ── Drop Zone ── */
.drop-zone {
border: 2px dashed var(--border2);
border-radius: 8px;
padding: 3rem 2rem;
text-align: center;
cursor: pointer;
transition: all 0.2s;
background: var(--surface2);
}
.drop-zone:hover, .drop-zone.dragover {
border-color: var(--accent);
background: rgba(244, 160, 0, 0.04);
}
.drop-zone-icon { font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.6; }
.drop-zone-title {
font-family: var(--display);
font-size: 1.25rem;
letter-spacing: 2px;
color: var(--text);
margin-bottom: 0.5rem;
}
.drop-zone-sub {
font-size: 0.8rem;
color: var(--text2);
font-family: var(--mono);
margin-bottom: 1.5rem;
}
/* ── File List ── */
.file-list { display: flex; flex-direction: column; gap: 8px; margin-top: 1rem; }
.file-item {
display: flex;
align-items: center;
gap: 12px;
padding: 10px 14px;
background: var(--surface2);
border: 1px solid var(--border);
border-radius: 6px;
font-family: var(--mono);
font-size: 0.75rem;

}
.file-item-icon { font-size: 1rem; }
.file-item-name { flex: 1; color: var(--text); }
.file-item-size { color: var(--text3); }
.file-item-status { font-size: 0.65rem; padding: 2px 8px; border-radius: 4px; text-transform: uppercase; letter-spacing: 1px; }
.status-ready { background: rgba(34,197,94,0.1); color: var(--ok); border: 1px solid rgba(34,197,94,0.2); }
.status-processing { background: rgba(244,160,0,0.1); color: var(--accent); border: 1px solid rgba(244,160,0,0.2); }
.status-indexed { background: rgba(34,197,94,0.15); color: var(--ok); border: 1px solid rgba(34,197,94,0.3); }
/* ── Form ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group.full { grid-column: 1 / -1; }
.form-label {
font-family: var(--mono);
font-size: 0.65rem;
text-transform: uppercase;
letter-spacing: 1.5px;
color: var(--text2);
}
.form-label span { color: var(--danger); margin-left: 2px; }
.form-input, .form-select, .form-textarea {
background: var(--surface2);
border: 1px solid var(--border2);
border-radius: 6px;
padding: 10px 12px;
color: var(--text);
font-family: var(--sans);
font-size: 0.875rem;
transition: border-color 0.15s;
outline: none;
width: 100%;
}
.form-input:focus, .form-select:focus, .form-textarea:focus {
border-color: var(--accent);
box-shadow: 0 0 0 3px rgba(244,160,0,0.08);
}
.form-select option { background: var(--surface2); }
.form-textarea { resize: vertical; min-height: 90px; }
/* ── Checkbox Multi-select ── */
.checkbox-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.checkbox-item {
display: flex;
align-items: center;
gap: 8px;
padding: 8px 12px;

background: var(--surface2);
border: 1px solid var(--border);
border-radius: 6px;
cursor: pointer;
transition: all 0.15s;
font-size: 0.8rem;
}
.checkbox-item:hover { border-color: var(--border2); }
.checkbox-item.checked {
border-color: var(--accent);
background: rgba(244,160,0,0.06);
color: var(--accent);
}
.checkbox-item input { display: none; }
.checkbox-box {
width: 14px; height: 14px;
border: 1.5px solid var(--border2);
border-radius: 3px;
display: flex; align-items: center; justify-content: center;
font-size: 9px;
flex-shrink: 0;
transition: all 0.15s;
}
.checkbox-item.checked .checkbox-box {
background: var(--accent);
border-color: var(--accent);
color: #000;
}
/* ── Buttons ── */
.btn {
display: inline-flex;
align-items: center;
gap: 8px;
padding: 10px 20px;
border-radius: 6px;
border: none;
cursor: pointer;
font-family: var(--mono);
font-size: 0.75rem;
text-transform: uppercase;
letter-spacing: 1px;
transition: all 0.15s;
font-weight: 500;
}
.btn-primary {
background: var(--accent);

color: #000;
}
.btn-primary:hover { background: #ffb800; }
.btn-primary:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-outline {
background: transparent;
color: var(--text2);
border: 1px solid var(--border2);
}
.btn-outline:hover { border-color: var(--accent); color: var(--accent); }
.btn-danger {
background: rgba(224,62,62,0.1);
color: var(--danger);
border: 1px solid rgba(224,62,62,0.2);
}
.btn-danger:hover { background: rgba(224,62,62,0.2); }
.btn-lg { padding: 14px 32px; font-size: 0.85rem; }
/* ── Risk Report ── */
.risk-header {
background: linear-gradient(135deg, var(--surface) 0%, rgba(224,62,62,0.05) 100%);
border: 1px solid var(--border);
border-left: 4px solid var(--danger);
border-radius: 8px;
padding: 1.5rem;
margin-bottom: 1.5rem;
}
.risk-level-badge {
display: inline-flex;
align-items: center;
gap: 6px;
padding: 4px 12px;
border-radius: 20px;
font-family: var(--mono);
font-size: 0.7rem;
font-weight: 600;
letter-spacing: 1px;
text-transform: uppercase;
margin-bottom: 0.75rem;
}
.risk-critical { background: rgba(224,62,62,0.15); color: var(--danger); border: 1px solid rgba(224,62,62,0.3); }
.risk-high { background: rgba(217,119,6,0.15); color: var(--warn); border: 1px solid rgba(217,119,6,0.3); }
.risk-medium { background: rgba(244,160,0,0.15); color: var(--accent); border: 1px solid rgba(244,160,0,0.3); }
.risk-low { background: rgba(34,197,94,0.15); color: var(--ok); border: 1px solid rgba(34,197,94,0.3); }
.risk-title {
font-family: var(--display);
font-size: 2rem;

letter-spacing: 3px;
margin-bottom: 0.25rem;
}
.risk-meta {
font-family: var(--mono);
font-size: 0.7rem;
color: var(--text2);
display: flex;
gap: 1.5rem;
flex-wrap: wrap;
}
/* ── Impact Table ── */
.impact-section { margin-bottom: 1.5rem; }
.impact-section-title {
font-family: var(--mono);
font-size: 0.65rem;
text-transform: uppercase;
letter-spacing: 2px;
color: var(--text2);
margin-bottom: 0.75rem;
display: flex;
align-items: center;
gap: 8px;
}
.impact-section-title::after {
content: '';
flex: 1;
height: 1px;
background: var(--border);
}
.impact-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 10px; }
.impact-card {
padding: 12px 14px;
background: var(--surface2);
border: 1px solid var(--border);
border-radius: 6px;
border-left: 3px solid var(--border2);
transition: border-color 0.15s;
}
.impact-card.critical { border-left-color: var(--danger); }
.impact-card.high { border-left-color: var(--warn); }
.impact-card.medium { border-left-color: var(--accent); }
.impact-card.low { border-left-color: var(--ok); }
.impact-card-name {
font-weight: 600;

font-size: 0.875rem;
margin-bottom: 4px;
}
.impact-card-detail {
font-family: var(--mono);
font-size: 0.7rem;
color: var(--text2);
line-height: 1.6;
}
.impact-tag {
display: inline-block;
font-family: var(--mono);
font-size: 0.6rem;
padding: 1px 6px;
border-radius: 3px;
margin-right: 4px;
margin-top: 4px;
background: var(--surface);
border: 1px solid var(--border2);
color: var(--text3);
text-transform: uppercase;
letter-spacing: 0.5px;
}
/* ── Recommendations ── */
.rec-list { display: flex; flex-direction: column; gap: 10px; }
.rec-item {
display: flex;
gap: 14px;
padding: 14px;
background: var(--surface2);
border: 1px solid var(--border);
border-radius: 6px;
}
.rec-num {
font-family: var(--display);
font-size: 1.5rem;
color: var(--accent);
line-height: 1;
min-width: 28px;
}
.rec-body { flex: 1; }
.rec-title { font-weight: 600; font-size: 0.875rem; margin-bottom: 3px; }
.rec-desc { font-size: 0.8rem; color: var(--text2); line-height: 1.5; }
/* ── Loading ── */
.loading-overlay {

position: fixed; inset: 0;
background: rgba(10,12,15,0.85);
display: flex; align-items: center; justify-content: center;
z-index: 999;
backdrop-filter: blur(4px);
}
.loading-box {
background: var(--surface);
border: 1px solid var(--border2);
border-radius: 12px;
padding: 2.5rem 3rem;
text-align: center;
max-width: 400px;
width: 90%;
}
.loading-spinner {
width: 48px; height: 48px;
border: 3px solid var(--border2);
border-top-color: var(--accent);
border-radius: 50%;
margin: 0 auto 1.25rem;
animation: spin 0.8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.loading-title {
font-family: var(--display);
font-size: 1.25rem;
letter-spacing: 2px;
margin-bottom: 0.5rem;
}
.loading-sub {
font-family: var(--mono);
font-size: 0.7rem;
color: var(--text2);
letter-spacing: 1px;
}
.loading-steps { margin-top: 1.25rem; text-align: left; display: flex; flex-direction: column; gap: 6px; }
.loading-step {
font-family: var(--mono);
font-size: 0.7rem;
display: flex;
align-items: center;
gap: 8px;
color: var(--text3);
}
.loading-step.done { color: var(--ok); }
.loading-step.active { color: var(--accent); }

/* ── Misc ── */
.divider { height: 1px; background: var(--border); margin: 1.5rem 0; }
.text-center { text-align: center; }
.flex { display: flex; }
.gap-2 { gap: 8px; }
.gap-3 { gap: 12px; }
.mt-1 { margin-top: 6px; }
.mt-2 { margin-top: 12px; }
.mt-3 { margin-top: 1rem; }
.mb-2 { margin-bottom: 12px; }
.summary-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.5rem; }
.stat-card {
background: var(--surface);
border: 1px solid var(--border);
border-radius: 8px;
padding: 1rem;
text-align: center;
}
.stat-val {
font-family: var(--display);
font-size: 2rem;
letter-spacing: 2px;
}
.stat-val.red { color: var(--danger); }
.stat-val.orange { color: var(--warn); }
.stat-val.yellow { color: var(--accent); }
.stat-val.green { color: var(--ok); }
.stat-label { font-family: var(--mono); font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1px; color: var(--text3); margin-top: 4px; }
.empty-state {
text-align: center;
padding: 4rem 2rem;
color: var(--text3);
font-family: var(--mono);
font-size: 0.8rem;
}
.empty-state-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.3; }
.print-btn { display: none; }
@media print { .print-btn { display: inline-flex; } }
.toggle-group { display: flex; gap: 8px; flex-wrap: wrap; }
.toggle-pill {
padding: 6px 14px;
border: 1px solid var(--border2);
border-radius: 20px;
font-family: var(--mono);

font-size: 0.7rem;
cursor: pointer;
background: var(--surface2);
color: var(--text2);
transition: all 0.15s;
letter-spacing: 0.5px;
text-transform: uppercase;
}
.toggle-pill.active { background: var(--accent); color: #000; border-color: var(--accent); font-weight: 600; }
.info-box {
background: rgba(244,160,0,0.05);
border: 1px solid rgba(244,160,0,0.15);
border-radius: 6px;
padding: 12px 14px;
font-size: 0.8rem;
color: var(--text2);
line-height: 1.6;
display: flex;
gap: 10px;
align-items: flex-start;
}
.info-box-icon { font-size: 1rem; flex-shrink: 0; }
pre.ai-raw {
background: var(--surface2);
border: 1px solid var(--border);
border-radius: 6px;
padding: 1rem;
font-family: var(--mono);
font-size: 0.72rem;
line-height: 1.7;
color: var(--text2);
white-space: pre-wrap;
word-break: break-word;
margin-top: 1rem;
max-height: 500px;
overflow-y: auto;
}
.demo-banner {
max-width: 1400px;
margin: 0 auto 1rem;
padding: 12px 16px;
background: rgba(11,31,58,0.85);
border: 1px solid var(--accent);
border-radius: 8px;
color: var(--text2);
font-size: 0.8rem;
line-height: 1.5;
}
.demo-banner strong { color: var(--accent); }
.form-error {
background: rgba(224,62,62,0.1);
border: 1px solid rgba(224,62,62,0.2);
border-radius: 8px;
padding: 12px 14px;
color: var(--danger);
font-size: 0.85rem;
margin-bottom: 1rem;
}
@media (max-width: 900px) {
.checkbox-grid { grid-template-columns: repeat(2, 1fr); }
.form-grid { grid-template-columns: 1fr; }
.summary-stats { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
.header { padding: 0 1rem; flex-wrap: wrap; height: auto; min-height: 64px; }
.tab-nav { padding: 0 1rem; overflow-x: auto; }
.checkbox-grid { grid-template-columns: 1fr; }
.main { padding: 1rem; }
}
`;
// ─── Constants ────────────────────────────────────────────────────────────────
const MEP_SYSTEMS = [
  "Chilled Water",
  "Condenser Water",
  "Hot Water Heating",
  "Steam",
  "Domestic Cold Water",
  "Domestic Hot Water",
  "Sanitary/Drainage",
  "Natural Gas",
  "Compressed Air",
  "Medical Gas",
  "Normal Power (Utility)",
  "Emergency Power (Generator)",
  "UPS Power",

  "Fire Alarm",
  "Fire Suppression/Sprinkler",
  "Building Automation (BAS)",
  "HVAC / Air Handling",
  "Exhaust / Ventilation",
  "IT / Data Network",
  "Security / Access Control",
];
const SCOPE_OPTIONS = [
  "Planned Maintenance",
  "Emergency Repair",
  "Capital Project",
  "Testing & Commissioning",
  "Regulatory Inspection",
];
const PRIORITY_OPTIONS = ["Critical", "High", "Medium", "Low"];
const DURATION_OPTIONS = [
  "<1 Hour",
  "1–4 Hours",
  "4–8 Hours",
  "8–24 Hours",
  "1–3 Days",
  "3–7 Days",
  ">1 Week",
];
// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmtBytes(b) {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / (1024 * 1024)).toFixed(1) + " MB";
}
function today() {
  return new Date().toISOString().split("T")[0];
}
function genId() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}
// ─── Main App ────────────────────────────────────────────────────────────────
function App() {
  const [tab, setTab] = useState("drawings");
  const [drawings, setDrawings] = useState([]);
  const [drawingContext, setDrawingContext] = useState(""); // extracted text context
  const [form, setForm] = useState({
    workOrderId: genId(),
    shutdownTitle: "",
    requestedBy: "",
    date: today(),

    startTime: "",
    duration: "",
    priority: "",
    scope: "",
    systems: [],
    affectedFloors: "",
    affectedZones: "",
    description: "",
    equipmentToIsolate: "",
    coordinationNeeded: "",
    safetyConsiderations: "",
  });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [genError, setGenError] = useState("");
  const fileInputRef = useRef();

  useEffect(() => {
    fetch("/api/config")
      .then((r) => r.json())
      .then((d) => setDemoMode(!!d.demoMode))
      .catch(() => {});
  }, []);
  // ── Tab counts
  const tabs = [
    { id: "drawings", label: "MEP Library", icon: " ", count: drawings.length },
    { id: "form", label: "Shutdown Form", icon: " ", count: null },
    { id: "report", label: "Risk Report", icon: " ", count: report ? 1 : null },
  ];
  // ── File Handling
  const handleFiles = useCallback((files) => {
    const newFiles = Array.from(files).filter(
      (f) =>
        f.type === "application/pdf" ||
        f.name.match(/\.(pdf|png|jpg|jpeg|dwg|tif|tiff)$/i)
    );
    if (!newFiles.length) return;
    const entries = newFiles.map((f) => ({
      id: genId(),
      name: f.name,
      size: f.size,
      type: f.type,
      status: "ready",
    }));
    setDrawings((prev) => {
      const next = [...prev, ...entries];
      const ctx = next
        .map(
          (d) =>
            `=== DRAWING: ${d.name} ===\n(File referenced for shutdown scope. Full drawing extraction can be enabled server-side.)`
        )
        .join("\n\n");
      setDrawingContext(ctx);
      return next;
    });
  }, []);
  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );
  // ── Form helpers

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const toggleSystem = (sys) => {
    setForm((f) => ({
      ...f,
      systems: f.systems.includes(sys) ? f.systems.filter((s) => s !== sys) : [...f.systems, sys],
    }));
  };
  // ── Generate Risk Report
  const generateReport = async () => {
    setGenError("");
    setLoading(true);
    setLoadingStep(0);
    try {
      // Step 1 — Analyze shutdown scope
      setLoadingStep(1);
      await new Promise((r) => setTimeout(r, 400));
      const systemPrompt = `You are a senior MEP engineer and facility risk manager with 25+ years of experience.
You specialize in analyzing shutdown risk assessments for complex facilities including hospitals, data centers, laboratories, and commercial buildings.
You have deep knowledge of interdependencies between mechanical, electrical, and plumbing systems.
Respond ONLY with a valid JSON object. No markdown, no preamble, no explanation outside the JSON.`;
      const hasDrawings = drawingContext.trim().length > 0;
      const drawingSection = hasDrawings
        ? `\n\nFACILITY MEP DRAWING INTELLIGENCE:\n${drawingContext.slice(0, 6000)}`
        : "\n\n(No facility drawings uploaded — perform analysis based on shutdown details and MEP best practices.)";
      const prompt = `Analyze the following planned shutdown and produce a comprehensive risk assessment.
${drawingSection}
SHUTDOWN FORM:
- Work Order ID: ${form.workOrderId}
- Title: ${form.shutdownTitle || "N/A"}
- Requested By: ${form.requestedBy || "N/A"}
- Date/Time: ${form.date} at ${form.startTime || "TBD"}
- Duration: ${form.duration || "TBD"}
- Priority: ${form.priority || "N/A"}
- Scope: ${form.scope || "N/A"}
- Systems Being Shut Down: ${form.systems.join(", ") || "None specified"}
- Affected Floors/Areas: ${form.affectedFloors || "N/A"}
- Affected Zones: ${form.affectedZones || "N/A"}
- Description: ${form.description || "N/A"}
- Equipment to Isolate: ${form.equipmentToIsolate || "N/A"}
- Required Coordination: ${form.coordinationNeeded || "N/A"}
- Safety Considerations: ${form.safetyConsiderations || "N/A"}
Return a JSON object with this exact schema:

{
"overallRisk": "CRITICAL" | "HIGH" | "MEDIUM" | "LOW",
"riskScore": number (1-100),
"executiveSummary": string (2-3 sentences),
"primaryConcerns": [string, string, string],
"impactedEquipment": [
{
"name": string,
"id": string (equipment tag or "TBD"),
"system": string,
"severity": "critical" | "high" | "medium" | "low",
"impact": string,
"mitigation": string,
"tags": [string]
}
],
"impactedSpaces": [
{
"name": string,
"floor": string,
"severity": "critical" | "high" | "medium" | "low",
"impact": string,
"affectedSystems": [string]
}
],
"downstreamSystems": [
{
"system": string,
"dependency": string,
"impact": string,
"severity": "critical" | "high" | "medium" | "low"
}
],
"recommendations": [
{
"title": string,
"description": string,
"priority": "immediate" | "before-shutdown" | "during" | "after"
}
],
"requiredNotifications": [string],
"sequenceOfOperations": [string],
"estimatedRecoveryTime": string,
"drawingGapsIdentified": [string]
}
Be thorough, specific, and practical. Identify ALL plausible interdependencies. If drawings were provided, reference specific equipment and zones from them.`;

      setLoadingStep(2);
      await new Promise((r) => setTimeout(r, 300));
      const res = await fetch("/api/claude", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemPrompt,
          messages: [{ role: "user", content: prompt }],
          maxTokens: 4000,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
      }
      if (data.demo) setDemoMode(true);
      const raw = data.text || "";
      setLoadingStep(3);
      await new Promise((r) => setTimeout(r, 300));
      let parsed;
      try {
        const clean = raw.replace(/```json|```/g, "").trim();
        parsed = JSON.parse(clean);
      } catch {
        // fallback if JSON parse fails
        parsed = {
          overallRisk: "HIGH",
          riskScore: 70,
          executiveSummary: "Risk analysis completed. Review details below.",
          primaryConcerns: [
            "Review shutdown scope carefully",
            "Coordinate with all affected departments",
            "Verify backup systems",
          ],
          impactedEquipment: [],
          impactedSpaces: [],
          downstreamSystems: [],
          recommendations: [
            { title: "Full Review Required", description: raw, priority: "before-shutdown" },
          ],
          requiredNotifications: [],
          sequenceOfOperations: [],
          estimatedRecoveryTime: "TBD",
          drawingGapsIdentified: [],
          _rawResponse: raw,
        };
      }
      setReport({ ...parsed, generatedAt: new Date().toLocaleString(), form: { ...form } });
      setLoadingStep(4);
      setTab("report");
    } catch (e) {
      setGenError(e.message || "Could not generate report.");
    } finally {
      setLoading(false);
      setLoadingStep(0);
    }
  };
  // ── Risk color helpers

  const riskColor = (r) => ({ CRITICAL: "red", HIGH: "orange", MEDIUM: "yellow", LOW: "green" }[r] || "yellow");
  const sevClass = (s) => s || "medium";

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Header */}
        <div>
          <header className="header">
            <div className="header-brand">
              <div className="header-icon" style={{ fontFamily: "var(--display)", fontSize: "0.85rem", color: "#000" }}>
                VF
              </div>
              <span className="header-title">
                MEP <span>SHUTDOWN</span> RISK
              </span>
            </div>
            <span className="header-badge">Vantage FM · AI-Powered</span>
          </header>
          <nav className="tab-nav">
            {tabs.map((t) => (
              <button
                key={t.id}
                className={`tab-btn${tab === t.id ? " active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.icon} {t.label}
                {t.count > 0 && <span className="badge">{t.count}</span>}
              </button>
            ))}
          </nav>
        </div>
        {/* Content */}
        <main className="main">
          {demoMode && (
            <div className="demo-banner">
              <strong>Demo mode</strong> — Sample risk report (no API credits). Set{" "}
              <span style={{ fontFamily: "var(--mono)", color: "var(--accent)" }}>DEMO_MODE=false</span> in{" "}
              <span style={{ fontFamily: "var(--mono)" }}>.env</span> for live Claude.
            </div>
          )}
          {/* ── TAB: DRAWINGS ── */}
          {tab === "drawings" && (
            <>
              <div className="card">
                <div className="card-header">
                  <div className="card-title"> Upload MEP Drawings</div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text3)" }}>
                    PDF · PNG · JPG · DWG
                  </span>
                </div>
                <div
                  className={`drop-zone${dragging ? " dragover" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                >
                  <div className="drop-zone-icon"> </div>
                  <div className="drop-zone-title">DROP DRAWINGS HERE</div>
                  <div className="drop-zone-sub">or click to browse files</div>
                  <button
                    className="btn btn-outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Browse Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.png,.jpg,.jpeg,.dwg,.tif,.tiff"
                    style={{ display: "none" }}
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>
                <div className="info-box mt-3">
                  <span className="info-box-icon"> </span>
                  <span>
                    Upload MEP drawings (PDF, PNG, JPG, DWG). File names are included in your shutdown risk
                    prompt. Full automated extraction from drawings runs on the server when you enable API
                    access and Phase 2 ingestion.
                  </span>
                </div>
              </div>
              {drawings.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <div className="card-title"> Drawing Library ({drawings.length})</div>
                    <button
                      className="btn btn-outline"
                      style={{ fontSize: "0.65rem" }}
                      onClick={() => {
                        setDrawings([]);
                        setDrawingContext("");
                      }}
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="info-box mb-2">
                    <span className="info-box-icon"> </span>
                    <span>
                      These files are referenced in your assessment. Status shows they are ready to include in
                      the risk prompt.
                    </span>
                  </div>
                  <div className="file-list">
                    {drawings.map((d) => (
                      <div className="file-item" key={d.id}>
                        <span className="file-item-icon">
                          {d.name.endsWith(".pdf")
                            ? " "
                            : d.name.match(/\.(png|jpg|jpeg|tif)$/i)
                              ? " "
                              : " "}
                        </span>
                        <span className="file-item-name">{d.name}</span>
                        <span className="file-item-size">{fmtBytes(d.size)}</span>
                        <span className={`file-item-status status-${d.status}`}>
                          {d.status === "processing"
                            ? "Analyzing..."
                            : d.status === "indexed"
                              ? "✓ Indexed"
                              : "Ready"}
                        </span>
                      </div>
                    ))}
                  </div>
                  {drawingContext && (
                    <details style={{ marginTop: "1rem" }}>
                      <summary
                        style={{
                          fontFamily: "var(--mono)",
                          fontSize: "0.7rem",
                          color: "var(--text2)",
                          cursor: "pointer",
                          userSelect: "none",
                        }}
                      >
                        View prompt context ({Math.round(drawingContext.length / 100) / 10}k chars)
                      </summary>
                      <pre className="ai-raw">
                        {drawingContext.slice(0, 3000)}
                        {drawingContext.length > 3000 ? "\n\n... [truncated for display]" : ""}
                      </pre>
                    </details>
                  )}
                </div>
              )}
              <div style={{ textAlign: "center", marginTop: "2rem" }}>
                <button className="btn btn-primary btn-lg" onClick={() => setTab("form")}>
                  Continue to Shutdown Form →
                </button>
              </div>
            </>
          )}
          {/* ── TAB: FORM ── */}
          {tab === "form" && (
            <>
              {genError && <div className="form-error">{genError}</div>}
              {/* Identification */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title"> Work Order Identification</div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.75rem", color: "var(--accent)" }}>
                    WO# {form.workOrderId}
                  </span>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Shutdown Title <span>*</span>
                    </label>
                    <input
                      className="form-input"
                      placeholder="e.g. AHU-3 Annual Maintenance Shutdown"
                      value={form.shutdownTitle}
                      onChange={(e) => setField("shutdownTitle", e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      Requested By <span>*</span>
                    </label>
                    <input
                      className="form-input"
                      placeholder="Name / Department"
                      value={form.requestedBy}
                      onChange={(e) => setField("requestedBy", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Shutdown Date <span>*</span>
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={form.date}
                      onChange={(e) => setField("date", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Start Time</label>
                    <input
                      type="time"
                      className="form-input"
                      value={form.startTime}
                      onChange={(e) => setField("startTime", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Estimated Duration <span>*</span>
                    </label>
                    <select
                      className="form-select"
                      value={form.duration}
                      onChange={(e) => setField("duration", e.target.value)}
                    >
                      <option value="">Select duration...</option>
                      {DURATION_OPTIONS.map((d) => (
                        <option key={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Priority Level <span>*</span>
                    </label>
                    <select
                      className="form-select"
                      value={form.priority}
                      onChange={(e) => setField("priority", e.target.value)}
                    >
                      <option value="">Select priority...</option>
                      {PRIORITY_OPTIONS.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group full">
                    <label className="form-label">
                      Scope / Reason <span>*</span>
                    </label>
                    <div className="toggle-group">
                      {SCOPE_OPTIONS.map((s) => (
                        <button
                          key={s}
                          className={`toggle-pill${form.scope === s ? " active" : ""}`}
                          onClick={() => setField("scope", form.scope === s ? "" : s)}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Systems */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title">
                    {" "}
                    Systems Being Shut Down <span style={{ color: "var(--danger)" }}>*</span>
                  </div>
                  <span style={{ fontFamily: "var(--mono)", fontSize: "0.7rem", color: "var(--text2)" }}>
                    {form.systems.length} selected
                  </span>
                </div>
                <div className="checkbox-grid">
                  {MEP_SYSTEMS.map((sys) => (
                    <label
                      key={sys}
                      className={`checkbox-item${form.systems.includes(sys) ? " checked" : ""}`}
                      onClick={() => toggleSystem(sys)}
                    >
                      <div className="checkbox-box">{form.systems.includes(sys) ? "✓" : ""}</div>
                      {sys}
                    </label>
                  ))}
                </div>
              </div>
              {/* Scope Details */}
              <div className="card">
                <div className="card-header">
                  <div className="card-title"> Scope & Location Details</div>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Affected Floors / Levels</label>
                    <input
                      className="form-input"
                      placeholder="e.g. B1, L1, L2, Penthouse"
                      value={form.affectedFloors}
                      onChange={(e) => setField("affectedFloors", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Affected Zones / Areas</label>
                    <input
                      className="form-input"
                      placeholder="e.g. East Wing, Server Room, ICU"
                      value={form.affectedZones}
                      onChange={(e) => setField("affectedZones", e.target.value)}
                    />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">
                      Shutdown Description <span>*</span>
                    </label>
                    <textarea
                      className="form-textarea"
                      placeholder="Describe the work being performed, what systems will be isolated, and the expected sequence of operations..."
                      value={form.description}
                      onChange={(e) => setField("description", e.target.value)}
                    />
                  </div>
                  <div className="form-group full">
                    <label className="form-label">Equipment to Isolate / Lockout-Tagout</label>
                    <textarea
                      className="form-textarea"
                      style={{ minHeight: 70 }}
                      placeholder="List all equipment tags, valve numbers, breakers, or disconnect points to be isolated (e.g. AHU-3, CWV-12, MDB-B Panel)..."
                      value={form.equipmentToIsolate}
                      onChange={(e) => setField("equipmentToIsolate", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Coordination Required</label>
                    <textarea
                      className="form-textarea"
                      style={{ minHeight: 70 }}
                      placeholder="Departments, vendors, or authorities that must be notified or coordinated with..."
                      value={form.coordinationNeeded}
                      onChange={(e) => setField("coordinationNeeded", e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Known Safety Considerations</label>
                    <textarea
                      className="form-textarea"
                      style={{ minHeight: 70 }}
                      placeholder="Hazardous materials, confined spaces, energized equipment, life safety concerns..."
                      value={form.safetyConsiderations}
                      onChange={(e) => setField("safetyConsiderations", e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
                <button className="btn btn-outline" onClick={() => setTab("drawings")}>
                  ← Back
                </button>
                <button
                  className="btn btn-primary btn-lg"
                  disabled={!form.shutdownTitle || !form.systems.length || !form.description}
                  onClick={generateReport}
                >
                  Generate Risk Assessment
                </button>
              </div>
            </>
          )}
          {/* ── TAB: REPORT ── */}
          {tab === "report" && (
            <>
              {!report ? (
                <div className="empty-state">
                  <div className="empty-state-icon"> </div>
                  <div>No report generated yet.</div>
                  <div style={{ marginTop: 12 }}>
                    <button className="btn btn-primary" onClick={() => setTab("form")}>
                      Complete Shutdown Form →
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Risk Header */}
                  <div className="risk-header">
                    <div className={`risk-level-badge risk-${report.overallRisk?.toLowerCase()}`}>
                      ● {report.overallRisk} RISK — Score: {report.riskScore}/100
                    </div>

                    <div className="risk-title">
                      {report.form?.shutdownTitle || "VANTAGE FM | SHUTDOWN RISK ASSESSMENT"}
                    </div>
                    <div className="risk-meta">
                      <span> WO# {report.form?.workOrderId}</span>
                      <span>
                        {" "}
                        {report.form?.date} {report.form?.startTime}
                      </span>
                      <span> {report.form?.duration}</span>
                      <span> {report.form?.requestedBy}</span>
                      <span> Generated: {report.generatedAt}</span>
                    </div>
                  </div>
                  {/* Stats */}
                  <div className="summary-stats">
                    <div className="stat-card">
                      <div className={`stat-val ${riskColor(report.overallRisk)}`}>{report.riskScore}</div>
                      <div className="stat-label">Risk Score</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-val red">
                        {report.impactedEquipment?.filter((e) => e.severity === "critical").length || 0}
                      </div>
                      <div className="stat-label">Critical Items</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-val yellow">
                        {(report.impactedEquipment?.length || 0) + (report.impactedSpaces?.length || 0)}
                      </div>
                      <div className="stat-label">Total Impacts</div>
                    </div>
                    <div className="stat-card">
                      <div className="stat-val green">{report.recommendations?.length || 0}</div>
                      <div className="stat-label">Recommendations</div>
                    </div>
                  </div>
                  {/* Executive Summary */}
                  <div className="card">
                    <div className="card-header">
                      <div className="card-title"> Executive Summary</div>
                    </div>
                    <p style={{ lineHeight: 1.7, color: "var(--text2)", fontSize: "0.9rem" }}>
                      {report.executiveSummary}
                    </p>
                    {report.primaryConcerns?.length > 0 && (
                      <div style={{ marginTop: "1rem" }}>
                        <div
                          style={{
                            fontFamily: "var(--mono)",
                            fontSize: "0.65rem",
                            textTransform: "uppercase",
                            letterSpacing: "1.5px",
                            color: "var(--text3)",
                            marginBottom: "8px",
                          }}
                        >
                          Primary Concerns
                        </div>
                        {report.primaryConcerns.map((c, i) => (
                          <div
                            key={i}
                            style={{ display: "flex", gap: "10px", alignItems: "flex-start", marginBottom: "6px" }}
                          >
                            <span style={{ color: "var(--danger)", fontWeight: "bold" }}>!</span>
                            <span style={{ fontSize: "0.85rem", color: "var(--text2)" }}>{c}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Impacted Equipment */}
                  {report.impactedEquipment?.length > 0 && (
                    <div className="impact-section">
                      <div className="impact-section-title"> Impacted Equipment ({report.impactedEquipment.length})</div>
                      <div className="impact-grid">
                        {report.impactedEquipment.map((eq, i) => (
                          <div className={`impact-card ${sevClass(eq.severity)}`} key={i}>
                            <div className="impact-card-name">{eq.name}</div>
                            <div className="impact-card-detail">
                              <div>
                                {" "}
                                {eq.id} &nbsp;|&nbsp; {eq.system}
                              </div>
                              <div style={{ marginTop: 4 }}>Impact: {eq.impact}</div>
                              <div style={{ marginTop: 4, color: "var(--ok)" }}>↳ {eq.mitigation}</div>
                              <div>
                                {eq.tags?.map((t) => (
                                  <span key={t} className="impact-tag">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Impacted Spaces */}
                  {report.impactedSpaces?.length > 0 && (
                    <div className="impact-section">
                      <div className="impact-section-title"> Impacted Spaces ({report.impactedSpaces.length})</div>
                      <div className="impact-grid">
                        {report.impactedSpaces.map((sp, i) => (
                          <div className={`impact-card ${sevClass(sp.severity)}`} key={i}>
                            <div className="impact-card-name">{sp.name}</div>
                            <div className="impact-card-detail">
                              <div> Floor: {sp.floor}</div>
                              <div style={{ marginTop: 4 }}>{sp.impact}</div>
                              <div>
                                {sp.affectedSystems?.map((s) => (
                                  <span key={s} className="impact-tag">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Downstream Systems */}
                  {report.downstreamSystems?.length > 0 && (
                    <div className="impact-section">
                      <div className="impact-section-title"> Downstream System Dependencies</div>
                      <div className="impact-grid">
                        {report.downstreamSystems.map((ds, i) => (
                          <div className={`impact-card ${sevClass(ds.severity)}`} key={i}>
                            <div className="impact-card-name">{ds.system}</div>
                            <div className="impact-card-detail">
                              <div>Dependency: {ds.dependency}</div>
                              <div style={{ marginTop: 4 }}>{ds.impact}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Recommendations */}
                  {report.recommendations?.length > 0 && (
                    <div className="card">
                      <div className="card-header">
                        <div className="card-title"> Recommendations</div>
                      </div>
                      <div className="rec-list">
                        {report.recommendations.map((r, i) => (
                          <div className="rec-item" key={i}>
                            <div className="rec-num">{String(i + 1).padStart(2, "0")}</div>
                            <div className="rec-body">
                              <div className="rec-title">{r.title}</div>
                              <div className="rec-desc">{r.description}</div>
                              <span className="impact-tag">{r.priority}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {/* Sequence & Notifications */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                    {report.sequenceOfOperations?.length > 0 && (
                      <div className="card">
                        <div className="card-header">
                          <div className="card-title"> Sequence of Operations</div>
                        </div>
                        {report.sequenceOfOperations.map((s, i) => (
                          <div
                            key={i}
                            style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: "0.82rem" }}
                          >
                            <span style={{ fontFamily: "var(--mono)", color: "var(--accent)", minWidth: 22 }}>
                              {i + 1}.
                            </span>
                            <span style={{ color: "var(--text2)" }}>{s}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {report.requiredNotifications?.length > 0 && (
                      <div className="card">
                        <div className="card-header">
                          <div className="card-title"> Required Notifications</div>
                        </div>
                        {report.requiredNotifications.map((n, i) => (
                          <div
                            key={i}
                            style={{ display: "flex", gap: 10, marginBottom: 8, fontSize: "0.82rem" }}
                          >
                            <span style={{ color: "var(--ok)" }}>●</span>
                            <span style={{ color: "var(--text2)" }}>{n}</span>
                          </div>
                        ))}
                        {report.estimatedRecoveryTime && (
                          <div
                            style={{
                              marginTop: "1rem",
                              fontFamily: "var(--mono)",
                              fontSize: "0.7rem",
                              color: "var(--text3)",
                            }}
                          >
                            EST. RECOVERY TIME:{" "}
                            <span style={{ color: "var(--accent)" }}>{report.estimatedRecoveryTime}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {/* Drawing Gaps */}
                  {report.drawingGapsIdentified?.length > 0 && (
                    <div className="card">
                      <div className="card-header">
                        <div className="card-title"> Drawing Gaps Identified</div>
                      </div>
                      <div className="info-box">
                        <span className="info-box-icon"> </span>
                        <div>
                          {report.drawingGapsIdentified.map((g, i) => (
                            <div key={i} style={{ marginBottom: 4, fontSize: "0.8rem" }}>
                              • {g}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: 12, marginTop: "1rem" }}>
                    <button className="btn btn-outline" onClick={() => setTab("form")}>
                      ← Edit Form
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => {
                        setReport(null);
                        setTab("form");
                      }}
                    >
                      Clear Report
                    </button>
                    <button className="btn btn-primary" onClick={() => window.print()}>
                      {" "}
                      Print Report
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </main>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-box">
            <div className="loading-spinner" />
            <div className="loading-title">ANALYZING RISK</div>
            <div className="loading-sub">AI Processing Shutdown Scope</div>
            <div className="loading-steps">
              {["Parsing shutdown parameters", "Cross-referencing MEP drawings", "Identifying system interdependencies", "Generating risk assessment",].map(
                (step, i) => (
                  <div
                    key={i}
                    className={`loading-step${
                      loadingStep > i + 1 ? " done" : loadingStep === i + 1 ? " active" : ""
                    }`}
                  >
                    <span>{loadingStep > i + 1 ? "✓" : loadingStep === i + 1 ? "▶" : "○"}</span>
                    {step}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

