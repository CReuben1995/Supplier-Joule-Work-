import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppSidebar } from "@/components/AppSidebar";
import { VendorOnboardingCard } from "@/components/home/VendorOnboardingCard";
import { NewsCards } from "@/components/home/NewsCards";
import { SelectableCard } from "@/components/cards/SelectableCard";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import jouleLogo from "@/assets/joule-logo.png.asset.json";
import spacesMark from "@/assets/vendor-onboarding-icon.png.asset.json";
import samAvatar from "@/assets/sam-avatar.jpg";
import { useWaves } from "@/data/waves";
import {
  AtSign,
  Bot,
  Box,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ImageIcon,
  LayoutGrid,
  Lightbulb,
  ListChecks,
  MessagesSquare,
  Microscope,
  MoreHorizontal,
  Package,
  Paperclip,
  Plus,
  RotateCcw,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Tag,
  ThumbsDown,
  ThumbsUp,
  TrendingDown,
  Volume2,
  X,
} from "lucide-react";

const attentionItems = [
  {
    eyebrow: "Buyer invitation",
    title: "Acme Manufacturing invited you to transact",
    body: "Acme sent a connection request on Jun 3 and expects to issue its first PO once you're transaction-ready. You're currently 42% there — finishing tax & banking and the Peppol e-invoicing setup will unlock the first PO worth an estimated $1.8M in annual spend.",
    sources: 3,
  },
];

const Pill = ({ tone = "neutral", children }: { tone?: "neutral" | "critical" | "good"; children: React.ReactNode }) => {
  const map = {
    neutral: "bg-muted text-foreground",
    critical: "bg-rose-50 text-rose-700",
    good: "bg-emerald-50 text-emerald-700",
  } as const;
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ${map[tone]}`}>
      {children}
    </span>
  );
};

const SourcesPopover = ({ sources }: { sources: { title: string; meta: string; icon: string }[] }) => (
  <Popover>
    <PopoverTrigger asChild>
      <button className="flex items-center gap-2 rounded text-xs hover:opacity-80">
        <span className="text-muted-foreground">Sources</span>
        <span className="grid size-5 place-items-center rounded-full bg-link/10 text-[10px] font-semibold text-link">
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
      placeholder="Message New Conversation..."
      className="w-full bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
    />
    <div className="mt-2 flex items-center justify-between">
      <div className="flex items-center gap-1 text-muted-foreground">
        <Popover>
          <PopoverTrigger asChild>
            <button type="button" className="grid size-7 place-items-center rounded hover:bg-muted">
              <Plus className="size-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" side="top" className="w-60 p-1.5">
            <ul className="text-sm">
              {[
                { icon: LayoutGrid, label: "Create Space" },
                { icon: Bot, label: "Agent Mode" },
                { icon: Microscope, label: "Deep Research" },
                { icon: Search, label: "Search" },
                { icon: Paperclip, label: "Add Attachment" },
              ].map(({ icon: Icon, label }) => (
                <li key={label}>
                  <button
                    type="button"
                    className="flex w-full items-center gap-3 rounded-md px-2.5 py-2 text-left font-medium text-foreground hover:bg-muted"
                  >
                    <Icon className="size-4 text-muted-foreground" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>

        <button type="button" className="grid size-7 place-items-center rounded hover:bg-muted">
          <AtSign className="size-4" />
        </button>
      </div>
      <button
        type="submit"
        className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary transition-colors hover:bg-primary/15"
        aria-label="Send"
      >
        <Send className="size-4" />
      </button>
    </div>
    {variant === "floating" && (
      <p className="mt-2 text-center text-[10px] text-muted-foreground">New Conversation uses AI, verify results.</p>
    )}
  </form>
);

const Index = () => {
  const navigate = useNavigate();
  const waves = useWaves();
  const readinessSubTotal = waves.reduce((s, w) => s + w.vendorCount, 0);
  const readinessSubDone = waves.reduce((s, w) => s + w.matched, 0);
  const readinessPct = readinessSubTotal > 0 ? Math.round((readinessSubDone / readinessSubTotal) * 100) : 0;
  const PROFILE_PCT = 68;
  const CATALOG_TOTAL = 12;
  const CATALOG_OPEN_GAPS = 7 + 4 + 1;
  const catalogPct = Math.max(0, Math.round(((CATALOG_TOTAL - CATALOG_OPEN_GAPS) / CATALOG_TOTAL) * 100));
  const phases = [
    { id: "readiness", name: "Transaction readiness", pct: readinessPct },
    { id: "profile", name: "Profile completion", pct: PROFILE_PCT },
    { id: "catalog", name: "Catalog gaps", pct: catalogPct },
  ];
  const firstIncomplete = phases.findIndex((p) => p.pct < 100);
  const activeIndex = firstIncomplete === -1 ? phases.length - 1 : firstIncomplete;
  const completedCount = phases.filter((p) => p.pct === 100).length;
  const remainingCount = phases.length - completedCount - (firstIncomplete === -1 ? 0 : 1);
  const percentComplete = Math.round(phases.reduce((s, p) => s + p.pct, 0) / phases.length);
  const currentPhase = phases[activeIndex];
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"smart" | "news">("smart");
  const [chatOpen, setChatOpen] = useState(false);
  const [seededBatch, setSeededBatch] = useState(false);
  const [jouleReplyVisible, setJouleReplyVisible] = useState(false);

  type RiskMsg = { role: "user" | "assistant"; text: string; typing?: boolean };
  const [riskSeeded, setRiskSeeded] = useState(false);
  const [riskMessages, setRiskMessages] = useState<RiskMsg[]>([]);
  const [riskTimestamp, setRiskTimestamp] = useState<number | null>(null);
  const [quickRepliesUsed, setQuickRepliesUsed] = useState(false);

  useEffect(() => {
    if (seededBatch) {
      setJouleReplyVisible(false);
      const t = setTimeout(() => setJouleReplyVisible(true), 650);
      return () => clearTimeout(t);
    }
  }, [seededBatch]);

  const openRiskChat = () => {
    setSeededBatch(false);
    setChatOpen(true);
    setRiskSeeded(true);
    setQuickRepliesUsed(false);
    setRiskTimestamp(Date.now());
    setRiskMessages([
      { role: "user", text: "View risk detail" },
      { role: "assistant", text: "", typing: true },
    ]);
    window.setTimeout(() => {
      setRiskMessages([
        { role: "user", text: "View risk detail" },
        {
          role: "assistant",
          text:
            "Prewave raised Northwind's risk score after detecting a **Labor Unrest** signal near your Tier-1 facility in Monterrey. Local news and social sources reported walkouts at two nearby plants over the past 72 hours, which historically correlates with a 3–5 day production slowdown.\n\nFor Acme Manufacturing, this pushes your supplier risk band from **Low** to **Moderate** — they typically flag Moderate suppliers for a secondary review before releasing new POs, which could delay your first order by up to a week if left unaddressed.",
        },
      ]);
    }, 1200);
  };

  const askFollowUp = (question: string, answer: string) => {
    setQuickRepliesUsed(true);
    setRiskMessages((prev) => [
      ...prev,
      { role: "user", text: question },
      { role: "assistant", text: "", typing: true },
    ]);
    window.setTimeout(() => {
      setRiskMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", text: answer };
        return next;
      });
    }, 1100);
  };


  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />

      <div className="flex min-w-0 flex-1 flex-col bg-[#FDFEFF] shadow-[inset_8px_0_12px_-8px_rgba(15,23,42,0.08)]">
        <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-border bg-background/80 px-8 backdrop-blur bg-white">
          <span className="text-sm text-muted-foreground">Discover</span>
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
        </header>

        <main className="mx-auto w-full max-w-5xl px-8 pb-40 pt-6">
          <section className="animate-fade-in-up">
            <h1 className="text-[40px] font-semibold leading-tight tracking-tight">Welcome, Sam.</h1>
            <p className="mt-2 text-base text-muted-foreground">Northwind Components is 42% transaction-ready — let's finish the next step.</p>
          </section>

          <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="grid size-7 place-items-center rounded hover:bg-muted"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className={`tabular-nums ${page === 1 ? "text-foreground" : ""}`}>{page}</span>
            <span className="text-border">|</span>
            <span className="tabular-nums">5</span>
            <button
              onClick={() => setPage((p) => Math.min(5, p + 1))}
              className="grid size-7 place-items-center rounded hover:bg-muted"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>

          <SelectableCard
            className="mt-4 block"
            title={attentionItems[0].title}
            insight={{
              subtitle: "Account setup status for Acme Manufacturing.",
              summary:
                "This card tracks your account setup with Acme Manufacturing across transaction readiness, profile completion and catalog gaps. Joule updates each phase automatically as records sync from SAP Business Network, and highlights the phase you are currently in.",
              steps: [
                "Complete the current phase's outstanding items.",
                "Let Joule pre-fill records from your existing SAP Business Network data.",
                "Submit for buyer validation to move to the next phase.",
              ],
              sources: [
                { title: "Supplier Account Record", meta: "SAP Business Network" },
                { title: "Acme Buyer Requirements", meta: "SBN Buyer Profile · Live" },
                { title: "Onboarding Activities", meta: "Acme Onboarding space" },
              ],
            }}
          >
          <article className="rounded-2xl border border-border bg-card p-5 shadow-[0_1px_2px_rgba(15,15,15,0.04)]">
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-[17px] font-semibold">{attentionItems[0].title}</h2>
                  <button className="text-link hover:opacity-80" aria-label="Read aloud">
                    <Volume2 className="size-4" />
                  </button>
                </div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
                  {attentionItems[0].body}
                </p>
                <div className="mt-3 flex items-center gap-1 text-muted-foreground">
                  {[Copy, ThumbsUp, ThumbsDown, RotateCcw, MoreHorizontal].map((Ic, i) => (
                    <button key={i} className="grid size-7 place-items-center rounded hover:bg-muted">
                      <Ic className="size-[15px]" />
                    </button>
                  ))}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="ml-3 flex items-center gap-2 rounded text-xs hover:opacity-80">
                        <span className="text-muted-foreground">Sources</span>
                        <span className="grid size-5 place-items-center rounded-full bg-link/10 text-[10px] font-semibold text-link">
                          {attentionItems[0].sources}
                        </span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent align="start" className="w-80 p-0">
                      <div className="border-b border-border px-4 py-3">
                        <p className="text-sm font-semibold">Sources</p>
                        <p className="text-[11px] text-muted-foreground">
                          {attentionItems[0].sources} references used in this insight
                        </p>
                      </div>
                      <ul className="max-h-72 overflow-y-auto p-2">
                        {[
                          { title: "Acme Invitation Letter", meta: "SAP Business Network · Received Jun 3", icon: "📨" },
                          { title: "Northwind ERP Master Data", meta: "SAP S/4HANA · Live", icon: "🏢" },
                          { title: "Acme Spend Forecast", meta: "Procurement Intelligence · Q3 2026", icon: "📈" },
                        ].map((s, i) => (
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
                </div>
              </div>

              <div className="min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">Account setup progress</h3>
                    <p className="text-[11px] text-muted-foreground">
                      Phase {activeIndex + 1} of {phases.length} · {completedCount} completed · {Math.max(0, remainingCount)} remaining
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-[20px] font-semibold tabular-nums leading-none">{percentComplete}%</div>
                    <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Complete</div>
                  </div>
                </div>

                <ol className="mt-4 flex items-start justify-between gap-4">
                  {phases.map((p, i) => {
                    const isDone = p.pct === 100;
                    const isCurrent = !isDone && i === activeIndex;
                    const connectorFilled = i <= activeIndex;
                    const barActive = isDone || isCurrent;
                    return (
                      <li key={p.id} className="relative flex min-w-0 flex-1 flex-col items-center">
                        {i > 0 && (
                          <span
                            className={`absolute right-1/2 top-4 -z-0 h-0.5 w-full ${
                              connectorFilled ? "bg-primary" : "bg-muted"
                            }`}
                            aria-hidden
                          />
                        )}
                        <span
                          className={`relative z-10 grid size-8 place-items-center rounded-full text-[11px] font-semibold ring-4 ring-card ${
                            isDone
                              ? "bg-primary text-primary-foreground"
                              : isCurrent
                              ? "border-2 border-primary bg-card text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {isDone ? <Check className="size-4" /> : i + 1}
                        </span>
                        <span
                          className={`mt-2 line-clamp-2 text-center text-[11px] leading-tight ${
                            isDone || isCurrent ? "font-medium text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {p.name}
                        </span>
                        <span className={`mt-1 text-[10px] font-semibold tabular-nums ${barActive ? "text-foreground" : "text-muted-foreground"}`}>
                          {p.pct}%
                        </span>
                        <div className="mt-1 h-0.5 w-full max-w-[120px] overflow-hidden rounded-full bg-muted">
                          <div
                            className={`h-full rounded-full ${barActive ? "bg-primary" : "bg-muted-foreground/40"}`}
                            style={{ width: `${p.pct}%` }}
                          />
                        </div>
                      </li>
                    );
                  })}
                </ol>

                {currentPhase && (
                  <div className="mt-4 rounded-lg bg-primary-soft px-3 py-2">
                    <p className="text-[11px] font-semibold text-primary">Next up</p>
                    <p className="mt-0.5 text-[12px] leading-relaxed text-foreground/80">
                      <span className="font-semibold text-foreground">{currentPhase.name}</span> — Joule can pre-fill most fields from your ERP.
                    </p>
                  </div>
                )}
              </div>
            </div>

          </article>
          </SelectableCard>

          <div className="mt-10 border-b border-border">
            <div className="flex gap-6 text-sm">
              {[
                { id: "smart", label: "Smart Hub" },
                { id: "news", label: "News" },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as "smart" | "news")}
                  className={`relative -mb-px border-b-2 px-1 py-3 font-medium transition-colors ${
                    tab === t.id ? "border-link text-link" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {tab === "news" ? (
            <NewsCards />
          ) : (
          <section className="mt-6 grid items-start gap-5 md:grid-cols-2">
            <SelectableCard
              className="md:col-span-2"
              title="Acme Onboarding"
              insight={{
                subtitle: "Activity progress from the Acme Onboarding space.",
                summary:
                  "Onboarding with Acme Manufacturing is in progress. Joule tracks each activity, its owner and days remaining, and flags the ones blocking your first purchase order. Tax & banking and e-invoicing are the two activities on the critical path.",
                steps: [
                  "Open the Acme Onboarding space to see all activities.",
                  "Clear the blocking activities first (tax & banking, e-invoicing).",
                  "Submit completed activities for buyer validation.",
                ],
                sources: [
                  { title: "Onboarding Activities", meta: "SAP Business Network" },
                  { title: "Acme Buyer Requirements", meta: "SBN Buyer Profile · Live" },
                  { title: "Supplier Account Record", meta: "SAP Business Network" },
                ],
              }}
            >
              <VendorOnboardingCard onOpenSpace={() => navigate("/spaces/vendor-onboarding")} />
            </SelectableCard>


            <SelectableCard
              className="md:col-span-2"
              title="Profile Completeness"
              insight={{
                subtitle: "Profile health calculated from your SAP Business Network supplier record.",
                summary:
                  "Your supplier profile is 68% complete. Three high-value items are holding it back — buyers filter on these fields, so completing them directly increases how often your profile appears in buyer searches and RFQ shortlists.",
                steps: [
                  "Complete the flagged high-value profile fields.",
                  "Upload or renew the certifications buyers filter on.",
                  "Re-publish the profile so buyer search picks up the changes.",
                ],
                sources: [
                  { title: "Supplier Profile", meta: "SAP Business Network" },
                  { title: "Buyer Filter Requirements", meta: "SBN Buyer Profile · Live" },
                  { title: "ISO Certification Registry", meta: "External · Verified" },
                ],
              }}
            >
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-[17px] font-semibold tracking-tight">Profile Completeness</h3>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">3 high-value items need attention.</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-semibold tabular-nums tracking-tight">68%</div>
                  <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Profile complete</div>
                </div>
              </div>

              <div className="mt-4 grid gap-6 md:grid-cols-2">
                <div className="flex flex-col">
                  <p className="text-[12.5px] leading-relaxed text-foreground/80">
                    We've auto-filled 12 fields using D&amp;B and your registration data. Completing the remaining items can increase your buyer visibility by up to <span className="font-semibold text-foreground">31%</span>.
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">
                      <ShieldCheck className="size-3" /> Verified
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary ring-1 ring-primary/20">
                      Performance <span className="font-semibold">82%</span>
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 ring-1 ring-amber-200">
                      Prewave · <span className="font-semibold">Moderate</span>
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Profile Completion</span>
                      <span className="tabular-nums font-medium text-foreground">68%</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full bg-primary" style={{ width: "68%" }} />
                    </div>
                  </div>

                  <div className="mt-4 rounded-lg bg-primary-soft p-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Joule auto-filled</p>
                    <p className="mt-1 text-[12px] leading-relaxed text-foreground/80">
                      12 fields auto-filled from D&amp;B, CDQ, and your registration — bank details and certifications require manual action.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Attention required</p>
                  <ul className="mt-2 space-y-2">
                    <li className="rounded-lg border border-rose-200 bg-rose-50/60 p-3">
                      <p className="text-[12.5px] font-semibold text-foreground">Bank info missing</p>
                      <p className="mt-0.5 text-[11.5px] text-foreground/70">Required to receive payments from connected buyers.</p>
                      <a href="#" className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-medium text-primary hover:underline">Add bank details →</a>
                    </li>
                    <li className="rounded-lg border border-rose-200 bg-rose-50/60 p-3">
                      <p className="text-[12.5px] font-semibold text-foreground">ISO 9001 expires in 12 days</p>
                      <p className="mt-0.5 text-[11.5px] text-foreground/70">3 buyers require this certification to remain active.</p>
                      <a href="#" className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-medium text-primary hover:underline">Renew certification →</a>
                    </li>
                    <li className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
                      <p className="text-[12.5px] font-semibold text-foreground">Risk score increased</p>
                      <p className="mt-0.5 text-[11.5px] text-foreground/70">Prewave flagged Labor Unrest.</p>
                      <button type="button" onClick={openRiskChat} className="mt-1 inline-flex items-center gap-1 text-[11.5px] font-medium text-primary hover:underline">View risk detail →</button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between gap-2 border-t border-border pt-3">
                <SourcesPopover
                  sources={[
                    { title: "D&B Registration Data", meta: "External · Verified", icon: "🏛️" },
                    { title: "CDQ Master Data", meta: "External · Live sync", icon: "🗂️" },
                    { title: "Prewave Risk Signals", meta: "External · Live", icon: "⚠️" },
                    { title: "Acme Buyer Requirements", meta: "SBN Buyer Profile · Live", icon: "🏭" },
                    { title: "ISO Certification Registry", meta: "External · Verified", icon: "🛡️" },
                  ]}
                />
                <div className="flex items-center gap-2">
                  <button onClick={() => navigate("/spaces/complete-profile")} className="rounded-md bg-primary px-2.5 py-1.5 text-[11.5px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">View Space</button>
                </div>
              </div>
            </div>
            </SelectableCard>

            <SelectableCard
              title="Catalog gaps to close"
              insight={{
                subtitle: "Catalog quality signals for your MRO category.",
                summary:
                  "12 SKUs in your MRO catalog are incomplete: 7 are missing product images, 4 have no UNSPSC code and 1 has outdated pricing. Incomplete items are excluded from buyer category filters, so they never surface in search results.",
                steps: [
                  "Let Joule auto-fill UNSPSC codes from the current taxonomy.",
                  "Pull missing product images from your existing PIM.",
                  "Refresh outdated pricing and re-publish the catalog.",
                ],
                sources: [
                  { title: "Catalog Template Repository", meta: "SAP Ariba Catalog · Internal" },
                  { title: "UNSPSC Taxonomy", meta: "External · v25.0801" },
                  { title: "Acme Category Requirements", meta: "SBN Buyer Profile · Live" },
                ],
              }}
            >
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <h3 className="text-[15px] font-semibold">Catalog gaps to close</h3>
                <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="size-4" /></button>
              </div>
              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm font-medium">12 SKUs need enrichment</span>
                <Pill tone="neutral">MRO</Pill>
              </div>
              <ul className="mt-3 space-y-2.5">
                {[
                  { icon: ImageIcon, label: "Missing product images", count: 7 },
                  { icon: Tag, label: "Missing UNSPSC codes", count: 4 },
                  { icon: Package, label: "Outdated pricing", count: 1 },
                ].map((it) => (
                  <li key={it.label} className="flex items-center justify-between rounded-md bg-muted/40 px-3 py-2">
                    <div className="flex items-center gap-2 text-[12.5px] text-foreground/80">
                      <it.icon className="size-3.5 text-muted-foreground" />
                      {it.label}
                    </div>
                    <span className="text-[11px] font-semibold tabular-nums text-foreground">{it.count}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-lg bg-primary-soft p-3">
                <p className="text-[11px] font-semibold text-primary">Resolution Proposal</p>
                <p className="mt-1 text-[12px] leading-relaxed text-foreground/80">
                  Enrich 12 SKUs in MRO category — Joule can auto-fill UNSPSC codes and pull images from your existing PIM.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-start">
                <SourcesPopover
                  sources={[
                    { title: "Catalog Template Repository", meta: "SAP Ariba Catalog · Internal", icon: "📦" },
                    { title: "UNSPSC Taxonomy", meta: "External · v25.0801", icon: "🏷️" },
                    { title: "Acme Category Requirements", meta: "SBN Buyer Profile · Live", icon: "📋" },
                  ]}
                />
              </div>
            </div>
            </SelectableCard>

            <SelectableCard
              title="Recommended buyers to pitch"
              insight={{
                subtitle: "Buyer match signals from SAP Business Network Discovery.",
                summary:
                  "Three buyers currently show sourcing activity that matches your catalog. Acme Manufacturing is the strongest match at 92% against their RFQ history for precision components, followed by Northwind Industrial (MRO supplies) and Helix Aerospace (tooling & fixtures).",
                steps: [
                  "Review each buyer's category demand and match score.",
                  "Publish or enrich the catalog items they are sourcing.",
                  "Send a pitch or respond to their open RFQs from SAP Business Network.",
                ],
                sources: [
                  { title: "SBN Discovery", meta: "Buyer demand signals · Live" },
                  { title: "Buyer Category Match Index", meta: "SBN Discovery · Live" },
                  { title: "RFQ Signal Feed", meta: "External · Last 90 days" },
                ],
              }}
            >
            <div className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <h3 className="text-[15px] font-semibold">Recommended buyers to pitch</h3>
                <button className="text-muted-foreground hover:text-foreground"><MoreHorizontal className="size-4" /></button>
              </div>
              <ul className="mt-5 space-y-2.5">
                {[
                  { label: "Acme Manufacturing", sub: "Precision components", score: "92%" },
                  { label: "Northwind Industrial", sub: "MRO supplies", score: "78%" },
                  { label: "Helix Aerospace", sub: "Tooling & fixtures", score: "64%" },
                ].map((it) => (
                  <li key={it.label} className="flex items-center justify-between gap-3 rounded-md bg-muted/40 px-3 py-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="grid size-7 shrink-0 place-items-center rounded-md bg-muted">
                        <Building2 className="size-3.5 text-muted-foreground" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium">{it.label}</p>
                        <p className="truncate text-[11px] text-muted-foreground">{it.sub}</p>
                      </div>
                    </div>
                    <span className="shrink-0 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 ring-1 ring-emerald-100">
                      {it.score}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 rounded-lg bg-primary-soft p-3">
                <p className="text-[11px] font-semibold text-primary">Resolution Proposal</p>
                <p className="mt-1 text-[12px] leading-relaxed text-foreground/80">
                  Acme Manufacturing is sourcing precision components this quarter — your catalog matches 92% of their RFQ history.
                </p>
              </div>
              <div className="mt-4 flex items-center justify-start">
                <SourcesPopover
                  sources={[
                    { title: "SBN Discovery", meta: "Buyer demand signals · Live", icon: "🧭" },
                    { title: "Buyer Category Match Index", meta: "SBN Discovery · Live", icon: "🎯" },
                    { title: "RFQ Signal Feed", meta: "External · Last 90 days", icon: "📨" },
                  ]}
                />
              </div>
            </div>
            </SelectableCard>
          </section>
          )}

        </main>

        {!chatOpen && (
          <>
            <div
              aria-hidden
              className="pointer-events-none fixed inset-x-0 bottom-0 left-14 z-20 h-48 bg-gradient-to-t from-background/80 via-background/60 to-transparent [backdrop-filter:blur(6px)] [mask-image:linear-gradient(to_top,black_40%,transparent)]"
            />
            <div className="pointer-events-none fixed inset-y-auto bottom-6 left-14 right-0 z-30 flex animate-fade-in-up justify-center px-8">
              <Composer variant="floating" />
            </div>
          </>
        )}
      </div>

      {chatOpen && (
        <aside className="sticky top-0 z-20 flex h-screen w-[400px] shrink-0 animate-slide-in-right flex-col border-l border-border bg-[#F8F9FA]">
          <header className="flex h-14 items-center justify-between border-b border-border px-5">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">New Conversation</span>
            </div>
            <button
              onClick={() => setChatOpen(false)}
              aria-label="Close chat"
              className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </header>

          {riskSeeded ? (
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              <div className="text-center text-[11px] text-muted-foreground">
                {new Date(riskTimestamp ?? Date.now()).toLocaleString(undefined, {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                })}
              </div>
              {riskMessages.map((m, idx) => {
                if (m.role === "user") {
                  return (
                    <div key={idx} className="flex justify-end animate-fade-in-up">
                      <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#D6E1F0] px-4 py-2.5 text-sm text-foreground shadow-sm">
                        {m.text}
                      </div>
                    </div>
                  );
                }
                if (m.typing) {
                  return (
                    <div key={idx} className="flex items-center gap-1 rounded-2xl bg-muted px-3 py-2.5 w-fit">
                      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
                    </div>
                  );
                }
                const isLastAssistant =
                  idx === riskMessages.length - 1 && !riskMessages[idx].typing;
                return (
                  <div key={idx} className="space-y-2 animate-fade-in-up">
                    <div className="text-sm leading-relaxed text-foreground">
                      {m.text.split("\n").map((line, li) => {
                        const parts = line.split(/(\*\*[^*]+\*\*)/g);
                        return (
                          <p key={li} className={li > 0 ? "mt-2" : undefined}>
                            {parts.map((part, i) =>
                              part.startsWith("**") && part.endsWith("**") ? (
                                <strong key={i} className="font-semibold text-foreground">
                                  {part.slice(2, -2)}
                                </strong>
                              ) : (
                                <span key={i}>{part}</span>
                              ),
                            )}
                          </p>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap items-center gap-1 pt-1 text-muted-foreground">
                      <button aria-label="Copy" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground">
                        <Copy className="size-3.5" />
                      </button>
                      <button aria-label="Good response" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground">
                        <ThumbsUp className="size-3.5" />
                      </button>
                      <button aria-label="Bad response" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground">
                        <ThumbsDown className="size-3.5" />
                      </button>
                      <button aria-label="Regenerate" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground">
                        <RotateCcw className="size-3.5" />
                      </button>
                      <button aria-label="Details" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground">
                        <ListChecks className="size-3.5" />
                      </button>
                      <button aria-label="Suggestions" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground">
                        <Lightbulb className="size-3.5" />
                      </button>
                      <button className="ml-0.5 inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs hover:bg-muted hover:text-foreground">
                        Sources
                        <span className="grid size-4 place-items-center rounded-full bg-primary-soft text-[10px] font-semibold text-primary">3</span>
                      </button>
                      <button aria-label="More" className="grid size-7 place-items-center rounded-md hover:bg-muted hover:text-foreground">
                        <MoreHorizontal className="size-3.5" />
                      </button>
                    </div>
                    {isLastAssistant && idx === 1 && !quickRepliesUsed && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {[
                          {
                            q: "What triggered this alert?",
                            a: "The alert was triggered by three signals feeding Prewave over the past 72 hours: local news mentions of walkouts at two nearby manufacturing plants, a spike in labor-related social media posts within a 25km radius, and an ILO advisory covering the Monterrey industrial corridor. Individually each is low-severity — combined they crossed the **Moderate** threshold.",
                          },
                          {
                            q: "How does it affect Acme?",
                            a: "Acme's supplier policy auto-holds new POs from Moderate-risk suppliers for a **48-hour secondary review**. Your first PO ($1.8M annual spend) is currently queued behind this review. Clearing the risk — or attaching a mitigation plan — removes the hold and lets the PO release on schedule.",
                          },
                          {
                            q: "Show mitigation steps",
                            a: "Three quick actions can bring the score back to Low: **(1)** upload a contingency-sourcing statement for the Monterrey site, **(2)** confirm current on-site staffing levels via your HR system, **(3)** attach your business-continuity plan. I can pre-draft the statement and pull the staffing numbers if you'd like.",
                          },
                        ].map((r) => (
                          <button
                            key={r.q}
                            onClick={() => askFollowUp(r.q, r.a)}
                            className="inline-flex items-center rounded-full border border-primary/50 bg-transparent px-3.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/5"
                          >
                            {r.q}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : seededBatch ? (
            <div className="flex-1 space-y-4 overflow-y-auto px-4 py-5">
              <div className="flex items-start justify-end gap-2 animate-fade-in-up">
                <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#D6E1F0] px-4 py-2.5 text-sm text-foreground">
                  Help me get transaction-ready with Acme Manufacturing.
                </div>
                <img src={samAvatar} alt="Sam" className="mt-0.5 size-6 shrink-0 rounded-full object-cover" />
              </div>

              {!jouleReplyVisible ? (
                <div className="flex items-center gap-2 px-1 text-xs text-muted-foreground animate-fade-in-up">
                  <img src={jouleLogo.url} alt="" className="size-6 object-contain" />
                  <span className="flex gap-1">
                    <span className="size-1.5 animate-pulse rounded-full bg-primary/60 [animation-delay:0ms]" />
                    <span className="size-1.5 animate-pulse rounded-full bg-primary/60 [animation-delay:150ms]" />
                    <span className="size-1.5 animate-pulse rounded-full bg-primary/60 [animation-delay:300ms]" />
                  </span>
                  <span>New Conversation is preparing your onboarding cockpit…</span>
                </div>
              ) : (
                <div className="space-y-3 animate-fade-in-up">
                  <div className="flex items-start gap-2">
                    <img src={jouleLogo.url} alt="New Conversation" className="mt-0.5 size-6 object-contain" />
                    <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-transparent px-4 py-2.5 text-sm text-foreground">
                      I've assembled your supplier onboarding cockpit. Tax & banking and e-invoicing are the two activities blocking your first PO — start there to unlock the rest.
                    </div>
                  </div>

                  <div className="ml-8 rounded-xl border border-primary/30 bg-card p-4 shadow-sm">
                    <div className="flex items-start gap-3">
                      <img src={spacesMark.url} alt="" className="size-10 shrink-0 object-contain" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[13px] font-semibold">Supplier Onboarding</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">6 activities & tasks · 42% transaction-ready</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigate("/spaces/vendor-onboarding")}
                      className="mt-3 w-full rounded-md bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-transform hover:opacity-95 active:scale-95"
                    >
                      View space
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <img src={jouleLogo.url} alt="New Conversation" className="size-12 object-contain" />
              <h2 className="mt-4 text-lg font-semibold tracking-tight">How can I help?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Ask about tax, e-invoicing, catalogs, or anything in your onboarding cockpit.</p>
            </div>
          )}

          <div className="animate-composer-dock border-t border-border p-4">
            <Composer variant="panel" />
            <p className="mt-2 text-center text-[10px] text-muted-foreground">New Conversation uses AI, verify results.</p>
          </div>
        </aside>
      )}
    </div>
  );
};

export default Index;
