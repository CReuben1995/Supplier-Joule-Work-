import { ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  fmtScheduledDate,
  priorityMeta,
  statusMeta,
  useWaves,
  type Wave,
} from "@/data/waves";

const ONBOARDING_SOURCES = [
  { title: "Acme Manufacturing — Invitation", meta: "SAP Business Network · Received Jun 3", icon: "📨" },
  { title: "Northwind ERP Master Data", meta: "SAP S/4HANA · Live sync", icon: "🏢" },
  { title: "Country Mandate Library", meta: "SBN Compliance · Refreshed daily", icon: "📚" },
  { title: "Catalog Template Repository", meta: "SAP Ariba Catalog · Internal", icon: "📦" },
  { title: "Buyer Category Match Index", meta: "SBN Discovery · Live", icon: "🧭" },
];

type Props = {
  onOpenSpace: () => void;
};

export const VendorOnboardingCard = ({ onOpenSpace }: Props) => {
  const tasks = useWaves();

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const subStepsDone = tasks.reduce((s, t) => s + t.matched, 0);
  const subStepsTotal = tasks.reduce((s, t) => s + t.vendorCount, 0);
  const readinessPct = subStepsTotal > 0 ? Math.round((subStepsDone / subStepsTotal) * 100) : 0;

  const recommended =
    [...tasks]
      .filter((t) => t.priority === "high" && t.status !== "completed")
      .sort((a, b) => b.vendorCount - b.matched - (a.vendorCount - a.matched))[0] ?? tasks[0];

  return (
    <div className="md:col-span-3 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[17px] font-semibold tracking-tight">Transaction readiness</h3>
            <span className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide bg-violet-50 text-violet-700 ring-1 ring-violet-100">
              Acme · invited
            </span>
          </div>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            {completed} of {total} activities complete · {inProgress} in progress · finish to receive your first PO
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-semibold tabular-nums tracking-tight">{readinessPct}%</div>
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Ready to transact</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              <th className="px-6 py-3">Activity</th>
              <th className="px-4 py-3">Status</th>
              
              <th className="px-4 py-3">Progress</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tasks.map((t) => (
              <TaskRow key={t.id} task={t} onOpen={onOpenSpace} />
            ))}
          </tbody>
        </table>
      </div>

      {recommended && (
        <div className="px-6 py-4">
          <div className="rounded-lg bg-primary-soft p-3">
            <p className="text-[11px] font-semibold text-primary">Joule recommends next</p>
            <p className="mt-1 text-[12px] leading-relaxed text-foreground/80">
              Complete <span className="font-semibold text-foreground">{recommended.name}</span> next —{" "}
              {recommended.eta.toLowerCase()}. Joule can pre-fill most fields from your ERP.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 border-t border-border bg-muted/30 px-6 py-3">
        {(() => {
          const sources = ONBOARDING_SOURCES;
          return (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2 rounded text-[11px] uppercase tracking-wider text-muted-foreground hover:opacity-80">
                  <span className="font-medium">Sources</span>
                  <span className="grid min-w-[20px] place-items-center rounded-full bg-link/10 px-1.5 text-[10px] font-semibold leading-[18px] text-link">
                    {sources.length}
                  </span>
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-80 p-0">
                <div className="border-b border-border px-4 py-3">
                  <p className="text-sm font-semibold">Sources</p>
                  <p className="text-[11px] text-muted-foreground">
                    {sources.length} references used in this insight
                  </p>
                </div>
                <ul className="max-h-72 overflow-y-auto p-2">
                  {sources.map((s, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        className="flex items-start gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-muted"
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-link/10 text-sm">
                          {s.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium">{s.title}</p>
                          <p className="truncate text-[11px] text-muted-foreground">{s.meta}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </PopoverContent>
            </Popover>
          );
        })()}
        <button
          onClick={onOpenSpace}
          className="rounded-md bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
        >
          View Space
        </button>
      </div>
    </div>
  );
};

const TaskRow = ({ task, onOpen }: { task: Wave; onOpen: () => void }) => {
  const p = priorityMeta[task.priority];
  const s = statusMeta[task.status];
  const pct = task.vendorCount > 0 ? Math.round((task.matched / task.vendorCount) * 100) : 0;

  return (
    <tr className="group transition-colors hover:bg-muted/40">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <span className={`size-2 shrink-0 rounded-full ${p.dot}`} aria-hidden />
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-medium text-foreground">{task.name}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {p.label} · {task.eta}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${s.chip}`}>
          {s.label}
        </span>
      </td>
      
      <td className="px-4 py-4">
        {task.status === "scheduled" ? (
          <span className="text-[11px] text-muted-foreground">Resumes {fmtScheduledDate(task.scheduledFor)}</span>
        ) : (
          <div className="flex w-40 flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>
                {task.matched} / {task.vendorCount} steps
              </span>
              <span className="tabular-nums">{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${task.status === "completed" ? "bg-emerald-500" : "bg-primary"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-right" />

    </tr>
  );
};
