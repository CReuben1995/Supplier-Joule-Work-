import { ChevronRight } from "lucide-react";
import { Wave, fmtScheduledDate, priorityMeta, statusMeta } from "@/data/waves";

type Props = {
  wave: Wave;
  onClick?: () => void;
};

export const WaveListRow = ({ wave, onClick }: Props) => {
  const p = priorityMeta[wave.priority];
  const s = statusMeta[wave.status];
  const pct = wave.vendorCount > 0 ? Math.round((wave.matched / wave.vendorCount) * 100) : 0;

  return (
    <tr
      onClick={onClick}
      className="group cursor-pointer transition-colors hover:bg-muted/40"
    >
      <td className="px-6 py-4">
        <div className="flex items-start gap-3">
          <span className={`mt-1.5 size-2 shrink-0 rounded-full ${p.dot}`} aria-hidden />
          <div className="min-w-0">
            <div className="truncate text-[13.5px] font-medium text-foreground">{wave.name}</div>
            <div className="truncate text-[11px] text-muted-foreground">
              {p.label} · {wave.eta}
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
        {wave.status === "scheduled" ? (
          <span className="text-[11px] text-muted-foreground">Resumes {fmtScheduledDate(wave.scheduledFor)}</span>
        ) : (
          <div className="flex w-40 flex-col gap-1">
            <div className="flex items-center justify-between text-[10px] text-muted-foreground">
              <span>
                {wave.matched} / {wave.vendorCount} steps
              </span>
              <span className="tabular-nums">{pct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full rounded-full ${wave.status === "completed" ? "bg-emerald-500" : "bg-primary"}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
      </td>
      <td className="px-6 py-4 text-right">
        <ChevronRight className="ml-auto size-4 text-muted-foreground transition-colors group-hover:text-primary" />
      </td>
    </tr>
  );
};
