import { useEffect, useRef, useState } from "react";
import {
  Award,
  AtSign,
  BarChart3,
  ClipboardList,
  Copy,
  Globe,
  Lightbulb,
  List,
  ListChecks,
  MessagesSquare,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Send,
  ThumbsDown,
  ThumbsUp,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SpacesListPanel } from "@/components/SpacesListPanel";
import { useSpacesListOpen } from "@/hooks/useSpacesListOpen";
import { SelectableCard } from "@/components/cards/SelectableCard";
import jouleLogo from "@/assets/joule-logo.png.asset.json";
import samAvatar from "@/assets/sam-avatar.jpg";

type Stat = {
  label: string;
  value: string;
  hint: string;
  highlight?: boolean;
};

const STATS: Stat[] = [
  { label: "Total Insights", value: "8", hint: "Across 3 categories" },
  { label: "New This Week", value: "4", hint: "Updated by Joule" },
  { label: "Actions Taken", value: "2", hint: "Of 8 recommendations" },
  { label: "High Priority", value: "3", hint: "Require your input", highlight: true },
];

type Insight = {
  id: string;
  category: "Benchmark" | "Buyer Demand Signal" | "Peer Comparison" | "Buyer Demand";
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  chip: { label: string; tone: "green" };
  cta: string;
  proposal: string;
};

const BENCHMARKS: Insight[] = [
  {
    id: "iso",
    category: "Benchmark",
    icon: Award,
    title: "ISO 14001 is widely held in Automotive — you don't have it yet",
    description:
      "84% of suppliers in your industry carry ISO 14001. Buyers sourcing in Automotive often apply this as a filter, which means your profile may not appear in a significant portion of RFQs. Adding this certification would immediately expand your discoverability.",
    chip: { label: "+18% estimated buyer reach", tone: "green" },
    cta: "Add Certification",
    proposal:
      "Joule can initiate the ISO 14001 certification request on your behalf and pre-fill the application using your existing compliance records from D&B.",
  },
  {
    id: "eori",
    category: "Benchmark",
    icon: Globe,
    title: "Suppliers in Germany typically provide an EORI number",
    description:
      "An EORI (Economic Operators Registration and Identification) number is required for customs procedures in the EU. Most German suppliers include this in their profile to streamline cross-border transactions and reduce delays in customs clearance. Without it, EU buyers may deprioritize your profile for logistics efficiency.",
    chip: { label: "Unlocks EU buyer categories", tone: "green" },
    cta: "Add EORI",
    proposal:
      "Joule can pre-fill your EORI registration details using your existing company data, VAT number, and registered address from your business profile.",
  },
];

const BUYER_DEMAND: Insight[] = [
  {
    id: "esg",
    category: "Buyer Demand Signal",
    icon: TrendingUp,
    title: "ESG ratings filter is rising among European buyers",
    description:
      "Over the past 90 days, European buyers have significantly increased their use of ESG rating filters when sourcing suppliers. Profiles with a verified ESG score receive 40% more RFQ invitations from DACH and Nordic regions. Your current profile does not include an ESG rating, which may cause you to be excluded from filtered searches.",
    chip: { label: "High demand signal · Affects 40+ active buyers", tone: "green" },
    cta: "Add ESG Data",
    proposal:
      "Joule can help you add your ESG score by connecting to your existing sustainability reports and third-party ESG assessment providers like EcoVadis or CDP.",
  },
  {
    id: "precision",
    category: "Buyer Demand",
    icon: BarChart3,
    title: "Precision components demand is up 22% this quarter",
    description:
      "Buyer sourcing activity for precision-engineered components has increased 22% this quarter, driven by demand in Aerospace and Medical Devices sectors. Your catalog includes products that match this category, but they are not tagged with the correct UNSPSC codes, making them invisible to buyers using category-based filters.",
    chip: { label: "Trending category · 8 products ready to add", tone: "green" },
    cta: "Update Catalog",
    proposal:
      "Joule has identified 8 products in your catalog that match the precision components category. It can automatically apply the correct UNSPSC codes and publish these to your public profile.",
  },
];

const PEER: Insight[] = [
  {
    id: "top10",
    category: "Peer Comparison",
    icon: Users,
    title: "You're ahead — but top 10% of suppliers hold 2+ certifications",
    description:
      "Your profile completeness ranks above 72% of suppliers in APAC, which is a strong position. However, analysis of the top 10% in your category shows that they hold at least 2 active certifications. You currently hold 1. Closing this gap would move you into the elite tier and significantly increase your RFQ visibility and win rate.",
    chip: { label: "1 certification away from top 10%", tone: "green" },
    cta: "Add Certification",
    proposal:
      "Joule recommends adding ISO 14001 as your second certification. It can initiate the request on your behalf and pre-fill the application using your existing compliance records, getting you into the top tier faster.",
  },
];

const TABS = ["Overview", "Joule's Summary", "Benchmarks", "Buyer Demand", "Peer Comparison"] as const;
type Tab = (typeof TABS)[number];

const SECTION_IDS: Record<Tab, string> = {
  Overview: "section-overview",
  "Joule's Summary": "section-summary",
  Benchmarks: "section-benchmarks",
  "Buyer Demand": "section-buyer-demand",
  "Peer Comparison": "section-peer",
};

const StatCard = ({ s }: { s: Stat }) => (
  <div>
    <p className="text-[13px] text-muted-foreground">{s.label}:</p>
    <p
      className={`mt-1 text-[22px] font-normal tracking-tight ${
        s.highlight ? "text-amber-700" : "text-foreground"
      }`}
    >
      {s.value}
    </p>
    <p className="mt-0.5 text-[11.5px] text-muted-foreground">{s.hint}</p>
  </div>
);

const InsightCard = ({ i }: { i: Insight }) => {
  const Icon = i.icon;
  return (
    <SelectableCard
      title={i.title}
      insight={{
        subtitle: `${i.category} · generated by Joule from your SAP Business Network profile.`,
        summary: `${i.description}\n\n${i.proposal}`,
        steps: [
          "Joule analyses your profile against buyer filters and peer benchmarks.",
          i.proposal,
          `Apply the recommendation via "${i.cta}" and re-publish your profile.`,
        ],
        sources: [
          { title: "Supplier Profile", meta: "SAP Business Network" },
          { title: "Buyer Search Analytics", meta: "SAP Business Network" },
          { title: "Peer Benchmark Dataset", meta: "SAP One" },
        ],
      }}
    >
    <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="grid size-7 place-items-center rounded-md bg-primary-soft text-primary">
            <Icon className="size-4" />
          </div>
          <span className="rounded bg-primary-soft px-2 py-0.5 text-[10.5px] font-semibold uppercase tracking-wider text-primary">
            {i.category}
          </span>
        </div>
      </div>
      <h3 className="mt-3 text-[15px] font-semibold tracking-tight text-foreground">{i.title}</h3>
      <p className="mt-2 text-[13px] leading-relaxed text-foreground/80">{i.description}</p>
      <div className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-1 text-[11.5px] font-medium text-emerald-700">
        <TrendingUp className="size-3.5" />
        {i.chip.label}
      </div>
      <div className="mt-4 rounded-lg bg-primary-soft/60 p-3">
        <p className="text-[10.5px] font-semibold uppercase tracking-wider text-primary">
          Resolution Proposal
        </p>
        <p className="mt-1.5 text-[12.5px] leading-relaxed text-foreground/85">{i.proposal}</p>
      </div>
      <div className="mt-auto flex items-center justify-end gap-2 pt-4">
        <button className="rounded-md border border-border px-3 py-1.5 text-[12px] font-medium text-foreground hover:bg-muted">
          Learn More
        </button>
        <button className="rounded-md border border-[#5D36FF] bg-background px-3 py-1.5 text-[12px] font-semibold text-[#5D36FF] hover:bg-[#5D36FF]/10">
          {i.cta}
        </button>
      </div>
    </div>
    </SelectableCard>
  );
};

const SectionHeader = ({ label, subtitle }: { label: string; subtitle?: string }) => (
  <div className="mb-3 mt-8">
    <h2 className="text-base font-semibold tracking-tight">{label}</h2>
    {subtitle && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{subtitle}</p>}
  </div>
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

const ProfileInsights = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [listOpen, setListOpen] = useSpacesListOpen();
  const [chatOpen, setChatOpen] = useState(false);
  const [sectionMenuOpen, setSectionMenuOpen] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);
  const isScrollingRef = useRef(false);

  const handleTabClick = (t: Tab) => {
    const el = document.getElementById(SECTION_IDS[t]);
    const scroller = mainRef.current;
    if (!el || !scroller) return;
    setActiveTab(t);
    isScrollingRef.current = true;
    const top = el.offsetTop - 12;
    scroller.scrollTo({ top, behavior: "smooth" });
    window.setTimeout(() => {
      isScrollingRef.current = false;
    }, 700);
  };

  useEffect(() => {
    const scroller = mainRef.current;
    if (!scroller) return;
    const onScroll = () => {
      if (isScrollingRef.current) return;
      const scrollTop = scroller.scrollTop + 80;
      let current: Tab = "Overview";
      (Object.keys(SECTION_IDS) as Tab[]).forEach((t) => {
        const el = document.getElementById(SECTION_IDS[t]);
        if (el && el.offsetTop <= scrollTop) current = t;
      });
      setActiveTab(current);
    };
    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />

      {listOpen && <SpacesListPanel activeRoute="/spaces/profile-insights" />}

      <div className="sticky top-0 z-10 flex h-screen min-w-0 flex-1 flex-col overflow-hidden relative bg-white shadow-[inset_8px_0_12px_-8px_rgba(15,23,42,0.08)]">
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
                    {TABS.map((t) => (
                      <button
                        key={t}
                        role="menuitem"
                        onClick={() => {
                          handleTabClick(t);
                          setSectionMenuOpen(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                          activeTab === t ? "font-medium text-primary" : "text-foreground"
                        }`}
                      >
                        <span>{t}</span>
                        {activeTab === t && <span className="size-1.5 rounded-full bg-primary" />}
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
            <section id="section-overview" className="scroll-mt-4">
              <h1 className="mb-6 text-[40px] font-normal leading-tight tracking-tight text-foreground">
                Profile Insights
              </h1>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {STATS.map((s) => (
                  <StatCard key={s.label} s={s} />
                ))}
              </div>
            </section>

            <section id="section-summary" className="mt-8 scroll-mt-4">
              <section className="grid grid-cols-1 gap-10 md:grid-cols-2">
                <div>
                  <p className="text-[13px] text-muted-foreground">Profile Summary:</p>
                  <div className="mt-3 space-y-4 text-[13.5px] leading-relaxed text-foreground/85">
                    <p>
                      Your profile is well-positioned — but 3 gaps are limiting your buyer reach in
                      Europe and Automotive. Joule continuously monitors buyer activity, regional
                      compliance trends, and peer performance in your industry. This week, two signals
                      stand out: buyers in Europe are increasingly filtering by{" "}
                      <span className="font-semibold text-foreground">ESG ratings</span>, and{" "}
                      <span className="font-semibold text-foreground">ISO 14001</span> has become a
                      near-standard credential in Automotive — 84% of peers already hold it.
                    </p>
                    <p>
                      On peer comparison, you're ahead of the curve — your profile completeness ranks
                      above 72% of suppliers in APAC. However, the top 10% of suppliers in your
                      category hold at least 2 active certifications. Adding one more would move you
                      into that tier and significantly expand your RFQ visibility.
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[13px] text-muted-foreground">Signal Summary:</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-[13.5px] leading-relaxed text-foreground/85">
                    <li>
                      <span className="font-semibold text-foreground">ISO 14001 certification</span>
                      <span> — highest-impact action; closes the benchmark gap and buyer demand signal at once.</span>
                    </li>
                    <li>
                      <span className="font-semibold text-foreground">ESG ratings in Europe</span>
                      <span> — buyers increasingly filter by ESG scores before issuing RFQs.</span>
                    </li>
                    <li>
                      <span className="font-semibold text-foreground">Automotive credentials</span>
                      <span> — 84% of peers already hold the near-standard credential set.</span>
                    </li>
                    <li>
                      <span className="font-semibold text-foreground">Peer benchmark</span>
                      <span> — completeness ranks above 72% of APAC suppliers; top tier holds 2+ certifications.</span>
                    </li>
                  </ul>
                </div>
              </section>
            </section>

            <section id="section-benchmarks" className="scroll-mt-4">
              <SectionHeader
                label="Industry & Region Benchmarks"
                subtitle="How your profile compares against industry standards and regional expectations."
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {BENCHMARKS.map((i) => (
                  <InsightCard key={i.id} i={i} />
                ))}
              </div>
            </section>

            <section id="section-buyer-demand" className="scroll-mt-4">
              <SectionHeader
                label="Buyer Demand Signals"
                subtitle="Emerging patterns in what buyers are searching for and filtering by right now."
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {BUYER_DEMAND.map((i) => (
                  <InsightCard key={i.id} i={i} />
                ))}
              </div>
            </section>

            <section id="section-peer" className="scroll-mt-4">
              <SectionHeader
                label="Peer Comparison"
                subtitle="How you stack up against similar suppliers in your industry and region."
              />
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {PEER.map((i) => (
                  <InsightCard key={i.id} i={i} />
                ))}
              </div>
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
                What should I focus on this week?
              </div>
            </div>
            <div className="space-y-2 animate-fade-in-up">
              <div className="text-sm leading-relaxed text-foreground">
                I've surfaced 8 insights — 3 are high priority. Adding ISO 14001 would close both a
                benchmark gap and a peer-comparison gap in one move.
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

export default ProfileInsights;
