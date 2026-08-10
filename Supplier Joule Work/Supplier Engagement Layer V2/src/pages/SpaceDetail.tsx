import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowDownAZ,
  AtSign,
  Bot,
  ChevronRight,
  ClipboardList,
  Copy,
  Folder,
  Lightbulb,
  List,
  ListChecks,
  MessagesSquare,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Send,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SelectableCard } from "@/components/cards/SelectableCard";
import { SpacesListPanel } from "@/components/SpacesListPanel";
import jouleLogo from "@/assets/joule-logo.png.asset.json";
import samAvatar from "@/assets/sam-avatar.jpg";
import { WaveListRow } from "@/components/vendor-onboarding/WaveListRow";
import { SegmentationStrategy } from "@/components/vendor-onboarding/SegmentationStrategy";

import { DataQualityCallouts } from "@/components/vendor-onboarding/DataQualityCallouts";
import { useWaves, WaveStatus } from "@/data/waves";
import { useSpacesListOpen } from "@/hooks/useSpacesListOpen";

type SortKey = "recent" | "name" | "count";
type SpaceStatus = "alert" | "chevron" | "ai" | "automation" | "none";
type SpaceItem = {
  id: string;
  name: string;
  subtitle: string;
  meta: string;
  count?: number;
  countTone?: "rose" | "amber" | "blue";
  liveDot?: "green";
  status: SpaceStatus;
  updatedRank: number;
  route?: string;
};

const MOCK_SPACES: SpaceItem[] = [
  { id: "vendor-onboarding", name: "Acme Onboarding", subtitle: "6 activities & tasks · Get transaction-ready", meta: "Auto-synced", count: 5, countTone: "amber", status: "chevron", updatedRank: 1, route: "/spaces/vendor-onboarding" },
];

const Stat = ({
  label,
  value,
  sub,
  tone = "default",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "attention";
}) => (
  <div>
    <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
      {tone === "attention" && <AlertCircle className="size-3.5 text-amber-600" />}
      {label}:
    </p>
    <p
      className={`mt-1 text-[22px] font-normal tracking-tight ${
        tone === "attention" ? "text-amber-700" : "text-foreground"
      }`}
    >
      {value}
    </p>
    {sub && <p className="mt-0.5 text-[11.5px] text-muted-foreground">{sub}</p>}
  </div>
);

type WaveFilter = "all" | "ready" | "scheduled" | "active" | "completed";

const matchesFilter = (status: WaveStatus, filter: WaveFilter) => {
  if (filter === "all") return true;
  if (filter === "ready") return status === "ready";
  if (filter === "scheduled") return status === "scheduled";
  if (filter === "active") return status === "in-progress";
  return status === "completed";
};

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

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "waves", label: "Activities & Tasks" },
  
  { id: "data-quality", label: "Attention required" },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const SpaceDetail = () => {
  const navigate = useNavigate();
  const [chatOpen, setChatOpen] = useState(false);
  const [listOpen, setListOpen] = useSpacesListOpen();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");

  const [searchOpen, setSearchOpen] = useState(false);
  const [waveFilter, setWaveFilter] = useState<WaveFilter>("all");
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [sectionMenuOpen, setSectionMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = mainRef.current;
    if (!root) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.id as SectionId);
      },
      { root, rootMargin: "-80px 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] },
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: SectionId) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const waves = useWaves();
  const filteredWaves = useMemo(() => waves.filter((w) => matchesFilter(w.status, waveFilter)), [waves, waveFilter]);

  const visibleSpaces = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q ? MOCK_SPACES.filter((s) => s.name.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)) : MOCK_SPACES;
    const sorted = [...filtered];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "count") sorted.sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
    else sorted.sort((a, b) => a.updatedRank - b.updatedRank);
    return sorted;
  }, [search, sort]);

  const countToneClass = (tone?: SpaceItem["countTone"]) => {
    switch (tone) {
      case "rose": return "bg-rose-100 text-rose-700";
      case "amber": return "bg-amber-100 text-amber-700";
      case "blue": return "bg-blue-100 text-blue-700";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const StatusIcon = ({ status }: { status: SpaceStatus }) => {
    switch (status) {
      case "alert": return <AlertCircle className="size-4 text-muted-foreground" />;
      case "chevron": return <ChevronRight className="size-4 text-muted-foreground" />;
      case "ai": return <Sparkles className="size-4 text-primary" />;
      case "automation": return <Bot className="size-4 text-muted-foreground" />;
      default: return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />

      {listOpen && <SpacesListPanel activeRoute="/spaces/vendor-onboarding" />}

      <div className="sticky top-0 z-10 flex h-screen min-w-0 flex-1 flex-col overflow-hidden relative bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_100%_100%,hsl(var(--primary)/0.08),transparent_60%),radial-gradient(80%_50%_at_0%_100%,hsl(var(--primary)/0.05),transparent_55%)]"
        />

        <header className="relative z-40 flex h-14 items-center justify-between bg-background/80 px-6 backdrop-blur bg-white">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setListOpen((o) => !o)}
              aria-label="Spaces list"
              className={`grid size-9 place-items-center rounded-lg transition-colors ${
                listOpen
                  ? "bg-primary-soft text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <List className="size-[18px]" />
            </button>
            
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <button
                type="button"
                onClick={() => setSectionMenuOpen((o) => !o)}
                aria-haspopup="menu"
                aria-expanded={sectionMenuOpen}
                className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted ${
                  sectionMenuOpen ? "bg-muted" : "bg-transparent"
                }`}
              >
                <ClipboardList className="size-[18px] text-muted-foreground" strokeWidth={1.75} />
                <span>Overview</span>
              </button>
              {sectionMenuOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setSectionMenuOpen(false)} />
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-30 mt-2 w-56 overflow-hidden rounded-xl border border-border bg-card p-1 shadow-lg"
                  >
                    <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Sections
                    </p>
                    {SECTIONS.map((s) => (
                      <button
                        key={s.id}
                        role="menuitem"
                        onClick={() => {
                          scrollToSection(s.id);
                          setSectionMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                          activeSection === s.id ? "font-medium text-primary" : "text-foreground"
                        }`}
                      >
                        <span>{s.label}</span>
                        {activeSection === s.id && <span className="size-1.5 rounded-full bg-primary" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
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


        <main ref={mainRef} className={`relative z-10 flex-1 overflow-y-auto bg-white ${chatOpen ? "pb-16" : "pb-40"}`}>
          <div className="mx-auto w-full max-w-6xl px-8 pt-8">
            <section id="overview" className="scroll-mt-24">
              <h1 className="mb-6 text-[40px] font-normal leading-tight tracking-tight text-foreground">
                Acme Onboarding
              </h1>
              {(() => {
                const totalSteps = waves.reduce((sum, w) => sum + w.vendorCount, 0);
                const totalCompleted = waves.reduce((sum, w) => sum + w.invited, 0);
                const counts = waves.reduce(
                  (acc, w) => {
                    acc[w.status] = (acc[w.status] ?? 0) + 1;
                    return acc;
                  },
                  {} as Record<WaveStatus, number>,
                );
                const activeTracks = waves.filter(
                  (w) => w.status === "ready" || w.status === "scheduled",
                );
                const blockingSteps = activeTracks.reduce(
                  (sum, w) => sum + Math.max(0, w.vendorCount - w.matched),
                  0,
                );
                const blockingTracks = activeTracks.filter(
                  (w) => w.vendorCount - w.matched > 0,
                ).length;
                return (
                  <div className="grid grid-cols-4 gap-3">
                    <Stat label="Sub-steps in scope" value={totalSteps.toLocaleString()} sub={`Across ${waves.length} activities & tasks`} />
                    <Stat
                      label="Activities & Tasks planned"
                      value={String(waves.length)}
                      sub={`${counts.ready ?? 0} ready · ${counts.scheduled ?? 0} scheduled`}
                    />
                    <Stat
                      label="Steps completed"
                      value={totalCompleted.toLocaleString()}
                      sub={totalSteps > 0 ? `${Math.round((totalCompleted / totalSteps) * 100)}% of scope` : undefined}
                    />
                    <Stat
                      tone="attention"
                      label="Action needed to unblock"
                      value={blockingSteps.toLocaleString()}
                      sub={
                        blockingSteps > 0
                          ? `Open items across ${blockingTracks} activit${blockingTracks === 1 ? "y" : "ies"}`
                          : "All steps validated — ready to submit"
                      }
                    />
                  </div>
                );
              })()}

              <div className="mt-6">
                <SegmentationStrategy />
              </div>
            </section>

            <section id="waves" className="scroll-mt-24 mt-8">
              <div className="mb-3 flex items-end justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold tracking-tight">Activities & Tasks</h2>
                  <p className="text-[12px] text-muted-foreground">Steps grouped by readiness milestone</p>
                </div>
              </div>
              <SelectableCard
                title="Activities & Tasks"
                insight={{
                  subtitle: "Onboarding activities tracked in this space.",
                  summary:
                    "Each row is an onboarding activity grouped by readiness milestone, with its own set of tasks. Joule keeps status and progress in sync with your SAP Business Network records and surfaces the activity that is currently blocking your first purchase order.",
                  steps: [
                    "Open an activity to see its full task list.",
                    "Complete the required tasks — Joule can pre-fill most fields.",
                    "Submit the activity for buyer validation.",
                  ],
                  sources: [
                    { title: "Onboarding Activities", meta: "SAP Business Network" },
                    { title: "Acme Buyer Requirements", meta: "SBN Buyer Profile · Live" },
                    { title: "Supplier Account Record", meta: "SAP Business Network" },
                  ],
                }}
              >
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                {filteredWaves.length === 0 ? (
                  <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                    No activities or tasks in this view.
                  </div>
                ) : (
                  <table className="w-full border-collapse text-left">
                    <thead>
                      <tr className="bg-muted/40 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        <th className="px-6 py-3">ACTIVITY NAME</th>
                        <th className="px-4 py-3">Status</th>
                        
                        <th className="px-4 py-3">Progress</th>
                        <th className="px-6 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredWaves.map((w) => (
                        <WaveListRow
                          key={w.id}
                          wave={w}
                          onClick={() => navigate(`/spaces/vendor-onboarding/waves/${w.id}`)}
                        />
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              </SelectableCard>
            </section>


            <section id="data-quality" className="scroll-mt-24 mt-6">
              <DataQualityCallouts />
            </section>
          </div>
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
            <div className="flex justify-end animate-fade-in-up">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#D6E1F0] px-4 py-2.5 text-sm text-foreground shadow-sm">
                Walk me through the fastest path to transaction-ready.
              </div>
            </div>
            <div className="space-y-2 animate-fade-in-up">
              <div className="text-sm leading-relaxed text-foreground">
                <p>You're 42% transaction-ready. Tax & banking and e-invoicing are the two activities blocking your first PO with Acme Manufacturing.</p>
                <p className="mt-2">Want me to pre-fill tax & banking from your D-U-N-S record, or jump into the e-invoicing setup first?</p>
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
    </div>
  );
};

export default SpaceDetail;
