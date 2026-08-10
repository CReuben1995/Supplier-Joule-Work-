import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AtSign, BellRing, CalendarClock, CheckCircle2, CheckCircle, ChevronRight, Circle, ClipboardList, Copy, Download, Info, Lightbulb, ListChecks, MessagesSquare, MoreHorizontal, Plus, RotateCcw, Send, Settings2, ThumbsDown, ThumbsUp, X } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/AppSidebar";
import { SelectableCard } from "@/components/cards/SelectableCard";
import jouleLogo from "@/assets/joule-logo.png.asset.json";
import { ScheduleDialog } from "@/components/vendor-onboarding/ScheduleDialog";
import { fmtScheduledDate, fmtSpend, priorityMeta, scheduleWave, sendInvites, statusMeta, useWaves } from "@/data/waves";

const Composer = ({ variant = "floating" }: { variant?: "floating" | "panel" }) => (
  <form
    onSubmit={(e) => e.preventDefault()}
    className={
      variant === "floating"
        ? "pointer-events-auto w-full max-w-2xl rounded-2xl border border-primary/40 bg-card/95 p-3 shadow-[0_8px_30px_-12px_rgba(91,63,228,0.35)] backdrop-blur"
        : "w-full rounded-2xl border border-primary/40 bg-card p-3 shadow-[0_8px_30px_-12px_rgba(91,63,228,0.25)]"
    }
  >
    <input
      type="text"
      placeholder="Message Joule..."
      className="w-full bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
    />
    <div className="mt-2 flex items-center justify-between">
      <div className="flex items-center gap-1 text-muted-foreground">
        <button type="button" className="grid size-7 place-items-center rounded hover:bg-muted">
          <Plus className="size-4" />
        </button>
        <button type="button" className="grid size-7 place-items-center rounded hover:bg-muted">
          <AtSign className="size-4" />
        </button>
      </div>
      <button
        type="submit"
        aria-label="Send"
        className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary hover:bg-primary/15"
      >
        <Send className="size-4" />
      </button>
    </div>
    {variant === "floating" && (
      <p className="mt-2 text-center text-[10px] text-muted-foreground">Joule uses AI, verify results.</p>
    )}
  </form>
);

const BUYERS_BY_REGION_HINT = [
  "Acme Manufacturing",
  "Bluewave Retail Group",
  "Corex Aerospace",
  "Delta Foods & Beverage",
  "Evergreen Energy",
  "Forge Heavy Industries",
  "Globex Public Sector",
  "Helix Healthcare Systems",
];

const Stat = ({ label, value, sub, info }: { label: string; value: string; sub?: string; info?: string }) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <div className="flex items-center gap-1.5">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      {info && (
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              aria-label={`About ${label}`}
              className="grid size-4 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Info className="size-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs text-xs">{info}</TooltipContent>
        </Tooltip>
      )}
    </div>
    <p className="mt-1 text-2xl font-semibold tabular-nums">{value}</p>
    {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
  </div>
);

const WaveDetail = () => {
  const { waveId } = useParams();
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const waves = useWaves();
  const wave = useMemo(() => waves.find((w) => w.id === waveId), [waves, waveId]);

  if (!wave) {
    return (
      <div className="flex min-h-screen bg-background text-foreground">
        <AppSidebar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Activity or Task not found.</p>
            <button onClick={() => navigate("/spaces/vendor-onboarding")} className="mt-3 text-sm font-medium text-link hover:underline">
              Back to Supplier Onboarding
            </button>
          </div>
        </div>
      </div>
    );
  }

  const p = priorityMeta[wave.priority];
  const s = statusMeta[wave.status];
  const acceptedPct = wave.invited > 0 ? Math.round((wave.accepted / wave.invited) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />

      <div className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-white">
        <header className="relative z-10 flex h-14 items-center gap-3 border-b border-border bg-white px-6">
          <button
            onClick={() => navigate("/spaces/vendor-onboarding")}
            aria-label="Back"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ArrowLeft className="size-[18px]" />
          </button>
          <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-1.5 text-sm">
            <button
              onClick={() => navigate("/spaces/vendor-onboarding")}
              className="font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Supplier Onboarding
            </button>
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="truncate font-semibold text-foreground">{wave.name}</span>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground">
              <ClipboardList className="size-[18px] text-muted-foreground" strokeWidth={1.75} />
              <span>Overview</span>
            </div>
            <button
              aria-label="More options"
              className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <MoreHorizontal className="size-[18px]" />
            </button>
            <button
              onClick={() => setChatOpen((o) => !o)}
              aria-label="Toggle chat"
              className={`grid size-9 place-items-center rounded-lg transition-colors ${
                chatOpen
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <MessagesSquare className="size-[18px]" />
            </button>
          </div>
        </header>

        <main className={`relative z-10 mx-auto w-full max-w-6xl flex-1 overflow-y-auto px-8 pt-8 ${chatOpen ? "pb-16" : "pb-40"}`}>
          <section className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-medium ring-1 ${p.chip}`}>
                  <span className={`size-1.5 rounded-full ${p.dot}`} />
                  {p.label}
                </span>
                <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ring-1 ${s.chip}`}>
                  {s.label}
                </span>
              </div>
              <h1 className="mt-2 text-2xl font-semibold tracking-tight">{wave.name}</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{wave.description}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted">
                  <Settings2 className="size-4" /> Edit activity
                </button>
                <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted">
                  <Download className="size-4" /> Export
                </button>

                {wave.status === "ready" && (
                  <>
                    <button
                      onClick={() => setScheduleOpen(true)}
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      <CalendarClock className="size-4" /> Schedule
                    </button>
                    <button
                      onClick={() => sendInvites(wave.id)}
                      className="inline-flex items-center gap-2 rounded-md border border-[#5D36FF] bg-background px-4 py-2 text-sm font-medium text-[#5D36FF] hover:bg-[#5D36FF]/10"
                    >
                      <Send className="size-4" /> Submit for review
                    </button>
                  </>
                )}

                {wave.status === "scheduled" && (
                  <>
                    <button
                      onClick={() => setScheduleOpen(true)}
                      className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-medium hover:bg-muted"
                    >
                      <CalendarClock className="size-4" /> Reschedule
                    </button>
                    <button
                      onClick={() => sendInvites(wave.id)}
                      className="inline-flex items-center gap-2 rounded-md border border-[#5D36FF] bg-background px-4 py-2 text-sm font-medium text-[#5D36FF] hover:bg-[#5D36FF]/10"
                    >
                      <Send className="size-4" /> Submit now
                    </button>
                  </>
                )}

                {wave.status === "in-progress" && (
                  <button
                    disabled={wave.invited - wave.accepted === 0}
                    className="inline-flex items-center gap-2 rounded-md border border-[#5D36FF] bg-background px-4 py-2 text-sm font-medium text-[#5D36FF] hover:bg-[#5D36FF]/10 disabled:opacity-50"
                  >
                    <BellRing className="size-4" />
                    {wave.invited - wave.accepted > 0
                      ? `Nudge reviewer (${wave.invited - wave.accepted})`
                      : "All steps acknowledged"}
                  </button>
                )}

                {wave.status === "completed" && (
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-2 text-sm font-medium text-muted-foreground">
                    <CheckCircle className="size-4" /> Activity completed
                  </span>
                )}
              </div>
              {wave.status === "scheduled" && wave.scheduledFor && (
                <p className="text-[11px] text-muted-foreground">
                  Scheduled for {fmtScheduledDate(wave.scheduledFor)}
                </p>
              )}
            </div>
          </section>

          <section className="mt-6 grid grid-cols-5 gap-3">
            <Stat label="Sub-steps" value={wave.vendorCount.toLocaleString()} />
            <Stat
              label="Buyer reach"
              value={fmtSpend(wave.spend)}
              info="Estimated annual buyer spend unlocked for Northwind once this activity is fully configured. Completing it opens this volume of PO business with Acme and other invited buyers on SAP Business Network."
            />
            <Stat label="Validated" value={`${wave.matched}/${wave.vendorCount}`} sub={`${Math.round((wave.matched / wave.vendorCount) * 100)}% validated`} />
            <Stat
              label="Adoption"
              value={wave.invited > 0 ? `${acceptedPct}%` : "—"}
              sub={wave.invited > 0 ? `${wave.accepted} of ${wave.invited} acknowledged` : "Not yet submitted"}
            />
            {(() => {
              const daysLeft = wave.tasks.reduce((sum, t) => sum + t.daysToComplete, 0);
              return (
                <Stat
                  label="Days to complete the activity"
                  value={`${daysLeft} ${daysLeft === 1 ? "day" : "days"}`}
                  sub="Assigned by Buyer"
                />
              );
            })()}
          </section>

          <SelectableCard
            className="mt-6 block"
            title="Onboarding Tasks"
            insight={{
              subtitle: "Task-level breakdown for this activity.",
              summary:
                "These are all the tasks required to complete this activity. Progress is tracked per task, and the activity only counts as complete once every required task reaches 100%. Joule can pre-fill most fields directly from your existing SAP Business Network and ERP records.",
              steps: [
                "Start with tasks showing Pending status.",
                "Let Joule pre-fill fields it can source automatically.",
                "Confirm each task so the activity progress updates.",
              ],
              sources: [
                { title: "Onboarding Activities", meta: "SAP Business Network" },
                { title: "Supplier Account Record", meta: "SAP Business Network" },
                { title: "Acme Buyer Requirements", meta: "SBN Buyer Profile · Live" },
              ],
            }}
          >
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Onboarding Tasks <span className="text-muted-foreground font-normal">({wave.tasks.length})</span></h2>
              <span className="text-[11px] text-muted-foreground">All tasks required for {wave.name}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="px-5 py-2.5 font-medium">Task</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium">Task owner</th>
                  </tr>
                </thead>
                <tbody>
                  {wave.tasks.map((t) => (
                    <tr key={t.name} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-5 py-3 font-medium text-foreground">{t.name}</td>
                      <td className="px-3 py-3">
                        {(() => {
                          // Deterministic pseudo-random progress per task name so some rows show partial completion.
                          const seed = Array.from(t.name).reduce((a, c) => a + c.charCodeAt(0), 0);
                          const partials = [25, 40, 55, 70, 85];
                          let pct: number;
                          if (t.status === "enabled") {
                            pct = seed % 3 === 0 ? partials[seed % partials.length] : 100;
                          } else {
                            pct = seed % 4 === 0 ? partials[seed % partials.length] : 0;
                          }
                          const complete = pct === 100;
                          const label = complete ? "Complete" : pct === 0 ? "Pending" : "In progress";
                          return (
                            <div className="flex w-32 flex-col gap-1">
                              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                                <div
                                  className={`h-full rounded-full ${complete ? "bg-emerald-500" : "bg-primary"}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-[10px] text-muted-foreground">
                                {label}{pct > 0 && !complete ? ` · ${pct}%` : ""}
                              </span>
                            </div>
                          );
                        })()}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{t.owner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
          </SelectableCard>

          <SelectableCard
            className="mt-6 block"
            title="Buyers unlocked by this activity"
            insight={{
              subtitle: "Buyer visibility gained once this activity is complete.",
              summary:
                "Completing this activity makes your profile visible to the buyers listed here. Match status reflects how well your published categories align with each buyer's sourcing requirements, and connection status shows where each buyer relationship currently stands.",
              steps: [
                "Complete the activity's required tasks.",
                "Publish the updated profile and catalog data.",
                "Respond to buyer review requests to move from pending to connected.",
              ],
              sources: [
                { title: "SBN Discovery", meta: "Buyer demand signals · Live" },
                { title: "Buyer Category Match Index", meta: "SBN Discovery · Live" },
                { title: "Supplier Account Record", meta: "SAP Business Network" },
              ],
            }}
          >
          <section className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <h2 className="text-sm font-semibold">Buyers unlocked by this activity</h2>
              <span className="text-[11px] text-muted-foreground">Showing {Math.min(8, wave.vendorCount)} of {wave.vendorCount}</span>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                  <th className="px-5 py-2 font-medium">Buyer</th>
                  <th className="px-3 py-2 font-medium">Region</th>
                  <th className="px-3 py-2 text-right font-medium">Category fit</th>
                  <th className="px-3 py-2 font-medium">PROFILE MATCH</th>
                  <th className="px-3 py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {BUYERS_BY_REGION_HINT.slice(0, Math.min(8, wave.vendorCount)).map((v, i) => {
                  const isMatched = i < Math.min(wave.matched, Math.min(8, wave.vendorCount));
                  return (
                  <tr key={v} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-5 py-3 font-medium">{v}</td>
                    <td className="px-3 py-3 text-muted-foreground">{wave.geo[i % wave.geo.length].region}</td>
                    <td className="px-3 py-3 text-right tabular-nums">{(12 - i).toFixed(1)}%</td>
                    <td className="px-3 py-3">
                      {isMatched ? (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700 ring-1 ring-emerald-200">
                          <CheckCircle2 className="size-3" />
                          Matched
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                          Not matched
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                        {wave.invited === 0
                          ? "Not visible"
                          : i < wave.accepted
                            ? "Connected"
                            : i < wave.invited
                              ? "Pending review"
                              : "Awaiting profile"}
                      </span>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </section>
          </SelectableCard>
        </main>

        {!chatOpen && (
          <>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-48 bg-gradient-to-t from-background/80 via-background/60 to-transparent [backdrop-filter:blur(6px)] [mask-image:linear-gradient(to_top,black_40%,transparent)]"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-6 z-30 flex animate-fade-in-up justify-center px-8">
              <Composer variant="floating" />
            </div>
          </>
        )}
      </div>

      {chatOpen && (
        <aside className="sticky top-0 z-20 flex h-screen w-[380px] shrink-0 animate-slide-in-right flex-col border-l border-border bg-[#F8F9FA]">
          <header className="flex h-14 items-center justify-between border-b border-border px-5">
            <span className="text-sm font-semibold">Joule</span>
            <button
              onClick={() => setChatOpen(false)}
              aria-label="Close chat"
              className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </header>

          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
            <div className="text-center text-[11px] text-muted-foreground">
              {new Date().toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </div>
            <div className="space-y-2 animate-fade-in-up">
              <div className="text-sm leading-relaxed text-foreground">
                You're viewing the <strong>{wave.name}</strong> activity. I can pre-fill required fields, validate your data, or explain country-specific mandates.
              </div>
              <div className="flex flex-wrap items-center gap-1 pt-1 text-muted-foreground">
                <button aria-label="Copy" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground"><Copy className="size-3.5" /></button>
                <button aria-label="Good response" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground"><ThumbsUp className="size-3.5" /></button>
                <button aria-label="Bad response" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground"><ThumbsDown className="size-3.5" /></button>
                <button aria-label="Regenerate" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground"><RotateCcw className="size-3.5" /></button>
                <button aria-label="Details" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground"><ListChecks className="size-3.5" /></button>
                <button aria-label="Suggestions" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground"><Lightbulb className="size-3.5" /></button>
                <button className="ml-0.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs hover:bg-muted hover:text-foreground">
                  Sources
                  <span className="grid size-4 place-items-center rounded-full bg-primary-soft text-[10px] font-semibold text-primary">3</span>
                </button>
                <button aria-label="More" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground"><MoreHorizontal className="size-3.5" /></button>
              </div>
            </div>
          </div>

          <div className="border-t border-border p-4">
            <Composer variant="panel" />
            <p className="mt-2 text-center text-[10px] text-muted-foreground">Joule uses AI, verify results.</p>
          </div>
        </aside>
      )}

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

export default WaveDetail;
