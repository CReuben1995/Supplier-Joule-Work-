import { useState } from "react";
import { AlertTriangle, ChevronDown, FileWarning, Landmark, Globe2 } from "lucide-react";

type IssueGroup = {
  id: string;
  icon: React.ReactNode;
  label: string;
  tone: "rose" | "amber" | "blue";
  total: number;
  rows: { vendor: string; detail: string; updated: string }[];
};

const GROUPS: IssueGroup[] = [
  {
    id: "missing-cert",
    icon: <FileWarning className="size-4" />,
    label: "Missing e-invoicing certificate",
    tone: "rose",
    total: 1,
    rows: [
      {
        vendor: "Peppol access point (DE)",
        detail: "Acme requires a Peppol-signed cert — upload .p12 or generate via SAP",
        updated: "Detected today",
      },
    ],
  },
  {
    id: "bank-mismatch",
    icon: <Landmark className="size-4" />,
    label: "Bank account currency mismatch",
    tone: "amber",
    total: 2,
    rows: [
      {
        vendor: "Remit-to IBAN (DE89…)",
        detail: "Account is EUR but 2 buyers will invoice in USD — add a USD remit-to",
        updated: "1d ago",
      },
      {
        vendor: "Withholding tax form",
        detail: "Form W-8BEN-E missing for US buyer payments",
        updated: "3d ago",
      },
    ],
  },
  {
    id: "catalog-codes",
    icon: <Globe2 className="size-4" />,
    label: "Catalog missing UNSPSC codes",
    tone: "blue",
    total: 14,
    rows: [
      { vendor: "SKU NW-44102 (Connector kit)", detail: "Suggest UNSPSC 39121710", updated: "2h ago" },
      { vendor: "SKU NW-71093 (Cable harness)", detail: "Suggest UNSPSC 26121636", updated: "2h ago" },
      { vendor: "SKU NW-22041 (PCB assembly)", detail: "Suggest UNSPSC 32101502", updated: "2h ago" },
    ],
  },
];

const toneChip: Record<IssueGroup["tone"], string> = {
  rose: "bg-rose-50 text-rose-700 ring-rose-200",
  amber: "bg-amber-50 text-amber-700 ring-amber-200",
  blue: "bg-blue-50 text-blue-700 ring-blue-200",
};

export const DataQualityCallouts = () => {
  const [open, setOpen] = useState<string | null>("missing-cert");
  const total = GROUPS.reduce((acc, g) => acc + g.total, 0);

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          <AlertTriangle className="size-4 text-amber-500" />
          <h2 className="text-sm font-semibold">Needs your attention before going live</h2>
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 ring-1 ring-amber-200">
            {total} items
          </span>
        </div>
        <button className="text-xs font-medium text-link hover:underline">Ask Joule to fix</button>
      </header>

      <ul className="divide-y divide-border">
        {GROUPS.map((g) => {
          const isOpen = open === g.id;
          return (
            <li key={g.id}>
              <button
                onClick={() => setOpen(isOpen ? null : g.id)}
                className="flex w-full items-center gap-3 px-5 py-3 text-left transition-colors hover:bg-muted/40"
              >
                <span className={`grid size-8 place-items-center rounded-lg ring-1 ${toneChip[g.tone]}`}>{g.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{g.label}</p>
                  <p className="text-[11px] text-muted-foreground">{g.total} item{g.total === 1 ? "" : "s"} affected</p>
                </div>
                <ChevronDown className={`size-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              {isOpen && (
                <div className="bg-muted/20 px-5 pb-4">
                  <ul className="overflow-hidden rounded-lg border border-border bg-card">
                    {g.rows.map((r) => (
                      <li key={r.vendor} className="flex items-center gap-3 border-b border-border px-4 py-2.5 last:border-0">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium text-foreground">{r.vendor}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{r.detail}</p>
                        </div>
                        <span className="text-[11px] text-muted-foreground">{r.updated}</span>
                        <button className="rounded-md border border-border bg-card px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted">
                          Fix
                        </button>
                      </li>
                    ))}
                  </ul>
                  {g.total > g.rows.length && (
                    <button className="mt-2 text-xs font-medium text-link hover:underline">
                      View all {g.total} →
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
};
