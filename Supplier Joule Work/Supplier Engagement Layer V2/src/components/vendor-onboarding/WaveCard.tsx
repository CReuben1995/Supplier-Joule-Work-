import { useState, type MouseEvent } from "react";
import { ArrowRight, Building2, CalendarClock, CheckCircle2, ListChecks, Play, User } from "lucide-react";
import { Wave, fmtScheduledDate, priorityMeta, scheduleWave, sendInvites, statusMeta } from "@/data/waves";
import { ScheduleDialog } from "./ScheduleDialog";

type Props = {
  wave: Wave;
  onClick?: () => void;
};

export const WaveCard = ({ wave, onClick }: Props) => {
  const p = priorityMeta[wave.priority];
  const s = statusMeta[wave.status];
  const stepPct = wave.vendorCount > 0 ? Math.round((wave.matched / wave.vendorCount) * 100) : 0;
  const activitiesDone = wave.activities.filter((a) => a.done).length;
  const [scheduleOpen, setScheduleOpen] = useState(false);

  const stop = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const showActions = wave.status !== "completed";

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick?.();
      }}
      className="group relative flex w-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border bg-card text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
    >
      <span aria-hidden className={`absolute inset-y-0 left-0 w-1.5 ${p.bar}`} />
      <div className="flex items-center justify-between px-6 pb-3 pt-5">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ${p.chip}`}>
            <span className={`size-1 rounded-full ${p.dot}`} />
            {p.label}
          </span>
          <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ${s.chip}`}>
            {s.label}
          </span>
        </div>
        <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </div>

      <div className="px-6 pb-6">
        <h3 className="text-xl font-bold leading-tight text-foreground">{wave.name}</h3>
        <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-muted-foreground">{wave.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-y-5 border-y border-border bg-muted/40 px-6 py-5">
        <Stat
          icon={<ListChecks className="size-3.5" />}
          label="Steps"
          value={`${wave.matched}/${wave.vendorCount}`}
          sub={`${stepPct}%`}
          subTone={stepPct === 100 ? "positive" : "muted"}
        />
        <Stat icon={<User className="size-3.5" />} label="Owner" value={wave.owner} />
        <Stat
          icon={<CheckCircle2 className="size-3.5" />}
          label="Sub-tasks"
          value={`${activitiesDone}/${wave.activities.length}`}
        />
        <Stat icon={<Building2 className="size-3.5" />} label="Unlocks" value={wave.geo[0]?.region ?? "—"} />
      </div>

      <div className="space-y-5 px-6 py-6">
        <div className="flex flex-wrap gap-2">
          {wave.geo.map((g) => (
            <span
              key={g.region}
              className="rounded bg-muted px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
            >
              {g.region} • {g.pct}%
            </span>
          ))}
        </div>

        {wave.status === "completed" ? (
          <div className="flex items-center gap-2 text-[13px] font-medium text-emerald-700">
            <CheckCircle2 className="size-4" /> Activity completed
          </div>
        ) : wave.status === "scheduled" ? (
          <div className="flex items-center gap-2 text-[13px] font-medium text-blue-700">
            <CalendarClock className="size-4" />
            Review scheduled for {fmtScheduledDate(wave.scheduledFor)}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-end justify-between">
              <div className="space-y-0.5">
                <div className="text-[11px] font-semibold uppercase tracking-tight text-muted-foreground">Progress</div>
                <div className="text-[13px] font-medium text-foreground">{wave.eta}</div>
              </div>
              <div className="text-lg font-bold tabular-nums text-primary">{stepPct}%</div>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${stepPct}%` }} />
            </div>
          </div>
        )}

        {showActions && (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={(e) => {
                stop(e);
                sendInvites(wave.id);
              }}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-[12px] font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Play className="size-3.5" />
              {wave.status === "in-progress" ? "Continue" : wave.status === "scheduled" ? "Resume now" : "Start activity"}
            </button>
            <button
              onClick={(e) => {
                stop(e);
                setScheduleOpen(true);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-2 text-[12px] font-semibold text-foreground hover:bg-muted"
            >
              <CalendarClock className="size-3.5" />
              {wave.status === "scheduled" ? "Reschedule" : "Schedule review"}
            </button>
          </div>
        )}
      </div>

      <ScheduleDialog
        open={scheduleOpen}
        onOpenChange={setScheduleOpen}
        waveName={wave.name}
        initialDate={wave.scheduledFor}
        onConfirm={(d) => scheduleWave(wave.id, d)}
      />
    </div>
  );
};

const Stat = ({
  icon,
  label,
  value,
  sub,
  subTone = "muted",
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  subTone?: "muted" | "positive";
}) => (
  <div className="min-w-0 space-y-1">
    <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-tight text-muted-foreground">
      {icon}
      <span className="truncate">{label}</span>
    </div>
    <div className="flex items-baseline gap-1.5">
      <span className="truncate text-lg font-bold tabular-nums text-foreground">{value}</span>
      {sub && (
        <span
          className={`text-[12px] font-medium tabular-nums ${
            subTone === "positive" ? "text-emerald-600" : "text-muted-foreground"
          }`}
        >
          {sub}
        </span>
      )}
    </div>
  </div>
);
