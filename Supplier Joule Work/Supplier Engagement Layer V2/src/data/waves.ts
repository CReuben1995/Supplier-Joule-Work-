import { useSyncExternalStore } from "react";

// ---------------------------------------------------------------------------
// Supplier onboarding data model
// ---------------------------------------------------------------------------
// We keep the historical "Wave" type name + exports so the rest of the app
// (cards, detail pages, store helpers) continues to compile while the surface
// is reframed for the supplier (Sam) experience. Each "wave" is now an
// **activity or task** the supplier must complete to become
// transaction-ready on SAP Business Network.

export type WavePriority = "high" | "medium" | "low";
// Status reuse, semantically:
//   ready       → Not started (action awaiting Sam)
//   scheduled   → Scheduled review / draft saved
//   in-progress → In progress
//   completed   → Completed
export type WaveStatus = "ready" | "scheduled" | "in-progress" | "completed";

export type WaveTaskStatus = "enabled" | "disabled";
export type WaveTaskOwner = "Buyer" | "Supplier";

export type WaveTask = {
  name: string;
  status: WaveTaskStatus;
  owner: WaveTaskOwner;
  daysToComplete: number;
  escalateOnDay: number;
  firstReminder: number;
  secondReminder: number;
};

export type Wave = {
  id: string;
  name: string;
  description: string;
  priority: WavePriority;
  status: WaveStatus;
  /** Number of sub-steps in this task. */
  vendorCount: number;
  /** Annual buyer spend unlocked once the task is complete. */
  spend: number;
  /** Sub-steps already validated. */
  matched: number;
  activities: { name: string; done: boolean }[];
  /** Detailed tasks required for this activity (shown as table). */
  tasks: WaveTask[];
  /** Used here as "Unlocks for" segments (buyer categories/regions). */
  geo: { region: string; pct: number }[];
  /** Sub-steps Sam has submitted (analogue of invited). */
  invited: number;
  /** Sub-steps approved by SAP Business Network (analogue of accepted). */
  accepted: number;
  scheduledFor?: string;
  updatedAt: string;
  /** Who in Sam's org owns this track. */
  owner: string;
  eta: string;
};

const INITIAL_WAVES: Wave[] = [
  {
    id: "company-profile",
    name: "Account",
    description:
      "This activity contains tasks related to account and trading relationship requests.",
    priority: "high",
    status: "in-progress",
    vendorCount: 5,
    spend: 0,
    matched: 4,
    activities: [
      { name: "Legal entity name & DUNS", done: true },
      { name: "Registered & remit-to addresses", done: true },
      { name: "Primary contacts (AR, sales, support)", done: true },
      { name: "Categories & UNSPSC codes", done: true },
      { name: "Served regions & currencies", done: false },
      { name: "Company description & website", done: false },
    ],
    tasks: [
      { name: "Approve the activity", status: "enabled", owner: "Buyer", daysToComplete: 2, escalateOnDay: 5, firstReminder: 1, secondReminder: 3 },
      { name: "Provided Email or Fax for the Trading Relationship Request", status: "enabled", owner: "Buyer", daysToComplete: 2, escalateOnDay: 5, firstReminder: 0, secondReminder: 0 },
      { name: "Relationship Request", status: "enabled", owner: "Buyer", daysToComplete: 0, escalateOnDay: 0, firstReminder: 0, secondReminder: 0 },
      { name: "Accept Terms of Use of the SAP Business Network", status: "enabled", owner: "Supplier", daysToComplete: 2, escalateOnDay: 9, firstReminder: 1, secondReminder: 3 },
      { name: "Accept Trading Relationship", status: "enabled", owner: "Supplier", daysToComplete: 2, escalateOnDay: 5, firstReminder: 1, secondReminder: 3 },
    ],
    geo: [
      { region: "North America", pct: 38 },
      { region: "EMEA", pct: 32 },
      { region: "APAC", pct: 20 },
      { region: "LATAM", pct: 10 },
    ],
    invited: 4,
    accepted: 4,
    updatedAt: "1h ago",
    owner: "Sam Park",
    eta: "≈ 15 min remaining",
  },
  {
    id: "po-routing",
    name: "Purchase Order",
    description:
      "This activity tracks all purchase order related tasks. You may have already completed some of these tasks in an earlier activity.",
    priority: "medium",
    status: "scheduled",
    vendorCount: 4,
    spend: 21_400_000,
    matched: 2,
    activities: [
      { name: "Inbound channel (cXML / email / portal)", done: true },
      { name: "Order confirmation SLA", done: true },
      { name: "Ship-notice automation", done: false },
      { name: "Backorder & substitution rules", done: false },
    ],
    geo: [
      { region: "Acme Manufacturing", pct: 65 },
      { region: "Other invited buyers", pct: 35 },
    ],
    tasks: [
      { name: "Configure Purchase Order Routing and Notifications", status: "enabled", owner: "Supplier", daysToComplete: 3, escalateOnDay: 5, firstReminder: 1, secondReminder: 3 },
      { name: "Ready to Receive Purchase Orders", status: "disabled", owner: "Supplier", daysToComplete: 2, escalateOnDay: 5, firstReminder: 1, secondReminder: 3 },
      { name: "Buying Organization is Ready to Send Orders", status: "disabled", owner: "Buyer", daysToComplete: 2, escalateOnDay: 5, firstReminder: 0, secondReminder: 0 },
      { name: "Purchase Order Sent", status: "enabled", owner: "Buyer", daysToComplete: 2, escalateOnDay: 0, firstReminder: 0, secondReminder: 0 },
    ],
    invited: 2,
    accepted: 2,
    scheduledFor: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: "4h ago",
    owner: "Linh Tran",
    eta: "Resumes in 3 days",
  },
  {
    id: "einvoicing-config",
    name: "Invoice",
    description:
      "This activity tracks all invoice related tasks. You may have already completed some of these tasks in an earlier activity.",
    priority: "high",
    status: "ready",
    vendorCount: 7,
    spend: 96_200_000,
    matched: 0,
    activities: [
      { name: "Upload e-invoicing certificate", done: false },
      { name: "Connect Peppol access point", done: false },
      { name: "Map invoice fields to UBL 2.1", done: false },
      { name: "Validate test invoice with Acme", done: false },
    ],
    geo: [
      { region: "DE · Peppol", pct: 45 },
      { region: "FR · Chorus Pro", pct: 30 },
      { region: "IT · SDI", pct: 25 },
    ],
    tasks: [
      { name: "Configure Invoice Routing and Notifications", status: "enabled", owner: "Supplier", daysToComplete: 2, escalateOnDay: 5, firstReminder: 1, secondReminder: 3 },
      { name: "Configure Bank Details", status: "disabled", owner: "Supplier", daysToComplete: 1, escalateOnDay: 5, firstReminder: 1, secondReminder: 3 },
      { name: "Configure Remit To", status: "enabled", owner: "Supplier", daysToComplete: 1, escalateOnDay: 5, firstReminder: 1, secondReminder: 3 },
      { name: "Configure Customer Remit To ID", status: "enabled", owner: "Supplier", daysToComplete: 1, escalateOnDay: 5, firstReminder: 1, secondReminder: 3 },
      { name: "Ready to Send Invoices", status: "disabled", owner: "Supplier", daysToComplete: 1, escalateOnDay: 5, firstReminder: 1, secondReminder: 3 },
      { name: "Buying Organization is Ready to Receive Invoices", status: "disabled", owner: "Buyer", daysToComplete: 1, escalateOnDay: 5, firstReminder: 0, secondReminder: 0 },
      { name: "Invoice Sent", status: "enabled", owner: "Buyer", daysToComplete: 2, escalateOnDay: 0, firstReminder: 0, secondReminder: 0 },
    ],
    invited: 0,
    accepted: 0,
    updatedAt: "2d ago",
    owner: "Anika Vogel",
    eta: "Blocked — missing certificate",
  },
  {
    id: "catalog-publishing",
    name: "Catalog",
    description:
      "This activity contains tasks to track when your customer requests for an electronic catalog. The content and pricing of the catalog should be agreed upfront with your customer.",
    priority: "medium",
    status: "ready",
    vendorCount: 2,
    spend: 8_600_000,
    matched: 1,
    activities: [
      { name: "Choose catalog format", done: true },
      { name: "Map UNSPSC codes (14 SKUs missing)", done: false },
      { name: "Add product images & descriptions", done: false },
      { name: "Set buyer-specific pricing tiers", done: false },
      { name: "Submit for SAP validation", done: false },
    ],
    geo: [
      { region: "Electronic Components", pct: 70 },
      { region: "Industrial MRO", pct: 30 },
    ],
    tasks: [
      { name: "Create test account", status: "enabled", owner: "Supplier", daysToComplete: 3, escalateOnDay: 5, firstReminder: 1, secondReminder: 3 },
      { name: "Published Private Catalog", status: "enabled", owner: "Supplier", daysToComplete: 5, escalateOnDay: 11, firstReminder: 1, secondReminder: 3 },
    ],
    invited: 1,
    accepted: 1,
    updatedAt: "1d ago",
    owner: "Sam Park",
    eta: "Joule can pre-fill 80%",
  },
  {
    id: "test-transaction",
    name: "Taulia Virtual Card Payment",
    description:
      "This activity tracks all tasks related to receiving virtual card payments routed through SAP Business Network. Your customer will use Taulia Virtual Card method to pay you after the payment is configured.",
    priority: "low",
    status: "ready",
    vendorCount: 1,
    spend: 0,
    matched: 0,
    activities: [
      { name: "Receive test PO from Acme", done: false },
      { name: "Submit confirmation + ship notice", done: false },
      { name: "Issue test e-invoice", done: false },
    ],
    geo: [
      { region: "Acme Manufacturing", pct: 100 },
    ],
    tasks: [
      { name: "Enable Taulia Virtual Card", status: "enabled", owner: "Supplier", daysToComplete: 5, escalateOnDay: 7, firstReminder: 1, secondReminder: 2 },
    ],
    invited: 0,
    accepted: 0,
    updatedAt: "—",
    owner: "Sam Park",
    eta: "Locked until prerequisites complete",
  },
];

let waves: Wave[] = INITIAL_WAVES;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((l) => l());

export const getWaves = () => waves;

export const subscribeWaves = (cb: () => void) => {
  listeners.add(cb);
  return () => listeners.delete(cb);
};

export const useWaves = (): Wave[] =>
  useSyncExternalStore(subscribeWaves, getWaves, getWaves);

const updateWave = (id: string, patch: Partial<Wave>) => {
  waves = waves.map((w) => (w.id === id ? { ...w, ...patch, updatedAt: "just now" } : w));
  emit();
};

/** Repurposed: mark a task as actively in-progress (Sam started working on it). */
export const sendInvites = (id: string) => {
  const w = waves.find((x) => x.id === id);
  if (!w) return;
  updateWave(id, {
    status: "in-progress",
    invited: Math.max(w.invited, 1),
    accepted: w.accepted,
    scheduledFor: undefined,
    eta: "In progress",
  });
};

const formatEta = (iso: string) => {
  const d = new Date(iso);
  return `Resumes ${d.toLocaleDateString(undefined, { month: "short", day: "numeric" })}`;
};

/** Repurposed: schedule a readiness review / draft save for a task. */
export const scheduleWave = (id: string, isoDate: string) => {
  updateWave(id, {
    status: "scheduled",
    scheduledFor: isoDate,
    eta: formatEta(isoDate),
  });
};

export const WAVES = waves;

export const priorityMeta: Record<WavePriority, { label: string; dot: string; bar: string; chip: string }> = {
  high: {
    label: "REQUIRED",
    dot: "bg-rose-500",
    bar: "bg-rose-500",
    chip: "bg-rose-50 text-rose-700 ring-rose-200",
  },
  medium: {
    label: "RECOMMENDED",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  low: {
    label: "OPTIONAL",
    dot: "bg-slate-400",
    bar: "bg-slate-300",
    chip: "bg-slate-100 text-slate-600 ring-slate-200",
  },
};

export const statusMeta: Record<WaveStatus, { label: string; chip: string }> = {
  ready: { label: "Action needed", chip: "bg-amber-50 text-amber-700 ring-amber-200" },
  scheduled: { label: "Draft saved", chip: "bg-blue-50 text-blue-700 ring-blue-200" },
  "in-progress": { label: "In progress", chip: "bg-violet-50 text-violet-700 ring-violet-200" },
  completed: { label: "Completed", chip: "bg-emerald-50 text-emerald-700 ring-emerald-200" },
};

export const fmtSpend = (n: number) => {
  if (n === 0) return "—";
  if (n >= 1_000_000_000) return `$${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
};

export const fmtScheduledDate = (iso?: string) => {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
};
