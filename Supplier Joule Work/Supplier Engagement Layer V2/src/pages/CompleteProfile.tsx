import { useEffect, useRef, useState } from "react";
import {
  AtSign,
  Briefcase,
  Check,
  ClipboardList,
  Copy,
  CreditCard,
  Database,
  FileText,
  Globe,
  Lightbulb,
  List,
  ListChecks,
  MapPin,
  MessagesSquare,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Send,
  Shield,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Users,
  X,
} from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SelectableCard } from "@/components/cards/SelectableCard";
import { SpacesListPanel } from "@/components/SpacesListPanel";
import { useSpacesListOpen } from "@/hooks/useSpacesListOpen";
import jouleLogo from "@/assets/joule-logo.png.asset.json";
import samAvatar from "@/assets/sam-avatar.jpg";

type ReviewField = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  source: string;
};

type ManualField = {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  helper: string;
  action: "Add" | "Upload";
  attention?: boolean;
};

type CompletedField = {
  id: string;
  label: string;
  value: string;
  source: string;
};

const REVIEW_FIELDS: ReviewField[] = [
  { id: "certifications", icon: FileText, label: "2 Certifications", value: "ISO 14000 Certified, ISO 45001", source: "Supplier Website" },
  { id: "categories", icon: List, label: "5 Product & Service Categories", value: "Electronic Components, Circuit Board Assemblies, Industrial Connectors, Power Supply Units, Sensor Modules", source: "Supplier Website" },
  { id: "website", icon: Globe, label: "Company Website", value: "www.northwindcomponents.de", source: "Web scraping" },
  { id: "employees", icon: Users, label: "Number of Employees", value: "250 - 500", source: "D&B" },
  { id: "revenue", icon: Database, label: "Annual Revenue", value: "€18M - €25M", source: "D&B" },
];

const MANUAL_FIELDS: ManualField[] = [
  { id: "bank", icon: CreditCard, label: "Bank Account Details", helper: "Not provided — required to receive payments", action: "Add" },
  { id: "iso", icon: FileText, label: "ISO 9001 Certification Document", helper: "Upload required — expiring in 12 days", action: "Upload", attention: true },
  { id: "esg", icon: Shield, label: "ESG Rating", helper: "Not provided — high demand from European buyers", action: "Add" },
];

const COMPLETED_FIELDS: CompletedField[] = [
  { id: "duns", label: "DUNS Number", value: "44-123-4567", source: "D&B" },
  { id: "vat", label: "VAT Number", value: "DE 123456789", source: "CDQ" },
  { id: "industry", label: "Industry Category", value: "Automotive · Precision Manufacturing", source: "Registration data" },
  { id: "desc", label: "Company Description", value: "Manufacturer of precision components for the automotive and aerospace industries…", source: "Web scraping" },
  { id: "contact", label: "Primary Contact", value: "Sam Park · s.park@northwindcomponents.de", source: "Registration data" },
  { id: "unspsc", label: "UNSPSC Codes", value: "31161500, 31161600, 31162000 · +5 more", source: "Catalog data" },
];

const MORE_COMPLETED: CompletedField[] = [
  { id: "founded", label: "Year Founded", value: "1998", source: "D&B" },
  { id: "duns-branch", label: "Global Ultimate DUNS", value: "44-123-0001", source: "D&B" },
  { id: "legal-form", label: "Legal Form", value: "GmbH", source: "Registration data" },
  { id: "trade", label: "Trade Register No.", value: "HRB 154829 B", source: "Registration data" },
  { id: "currency", label: "Operating Currency", value: "EUR", source: "Registration data" },
  { id: "language", label: "Preferred Language", value: "German, English", source: "Registration data" },
  { id: "iban-country", label: "Bank Country", value: "Germany", source: "Registration data" },
  { id: "ownership", label: "Ownership Type", value: "Privately held", source: "D&B" },
];

const TABS = ["Overview", "Review & Confirm", "Add Manually", "Completed by Joule"] as const;
type Tab = (typeof TABS)[number];

const SectionHeader = ({ label, subtitle }: { label: string; subtitle?: string }) => (
  <div className="mb-3 mt-8">
    <h2 className="text-base font-semibold tracking-tight">{label}</h2>
    {subtitle && <p className="mt-0.5 text-[12.5px] text-muted-foreground">{subtitle}</p>}
  </div>
);

const ReviewRow = ({ f }: { f: ReviewField }) => {
  const Icon = f.icon;
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5">
      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
        <Icon className="size-[18px]" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-semibold text-foreground">{f.label}</p>
        <p className="mt-0.5 truncate text-[13px] text-foreground/80">{f.value}</p>
        <p className="mt-1 flex items-center gap-1.5 text-[11.5px] text-primary">
          <Sparkles className="size-3" />
          <span className="font-medium">Suggested by Joule</span>
          <span className="text-muted-foreground">· Source: {f.source}</span>
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button className="rounded-md border border-[#5D36FF] bg-background px-3 py-1.5 text-[12px] font-semibold text-[#5D36FF] hover:bg-[#5D36FF]/10">
          Confirm
        </button>
        <button className="px-2 text-[12px] font-medium text-muted-foreground hover:text-foreground">Edit</button>
      </div>
    </div>
  );
};

const ManualRow = ({ f }: { f: ManualField }) => {
  const Icon = f.icon;
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5">
      <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-muted text-muted-foreground">
        <Icon className="size-[18px]" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-[13px] font-semibold text-foreground">{f.label}</p>
          {f.attention && (
            <span className="rounded border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
              Action Needed
            </span>
          )}
        </div>
        <p className="mt-0.5 text-[12.5px] text-muted-foreground">{f.helper}</p>
      </div>
      <button className="shrink-0 rounded-md border border-[#5D36FF] bg-background px-4 py-1.5 text-[12px] font-semibold text-[#5D36FF] hover:bg-[#5D36FF]/10">
        {f.action}
      </button>
    </div>
  );
};

const CompletedRow = ({ f }: { f: CompletedField }) => (
  <div className="flex items-center gap-4 rounded-xl border border-border bg-card px-4 py-3.5">
    <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-emerald-100 text-emerald-700">
      <Check className="size-[18px]" strokeWidth={2.5} />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-[13px] font-semibold text-foreground">{f.label}</p>
      <p className="mt-0.5 truncate text-[13px] text-foreground/80">{f.value}</p>
      <p className="mt-0.5 text-[11.5px] text-muted-foreground">Source: {f.source}</p>
    </div>
    <div className="flex shrink-0 items-center gap-2">
      <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700">
        Completed by Joule
      </span>
      <button className="px-2 text-[12px] font-medium text-muted-foreground hover:text-foreground">Edit</button>
    </div>
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

const SECTION_IDS: Record<Tab, string> = {
  Overview: "section-overview",
  "Review & Confirm": "section-review",
  "Add Manually": "section-manual",
  "Completed by Joule": "section-completed",
};

const CompleteProfile = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Overview");
  const [showMore, setShowMore] = useState(false);
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

      {listOpen && <SpacesListPanel activeRoute="/spaces/complete-profile" />}

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
            {/* Progress card */}
            <section id="section-overview" className="scroll-mt-4">
              <h1 className="mb-6 text-[40px] font-normal leading-tight tracking-tight text-foreground">
                Complete Profile
              </h1>
              <SelectableCard
                title="Profile completion overview"
                insight={{
                  subtitle: "How your 68% profile score is calculated.",
                  summary:
                    "Your profile is 68% complete. Joule has already filled a large share of fields from verified sources, a smaller share is waiting for you to review and confirm, and the rest must be added manually because no trusted source exists for them.",
                  steps: [
                    "Confirm the fields Joule has suggested.",
                    "Add the manual fields Joule could not source.",
                    "Re-publish the profile so buyer search picks up the changes.",
                  ],
                  sources: [
                    { title: "Supplier Profile", meta: "SAP Business Network" },
                    { title: "D&B Company Record", meta: "External · Verified" },
                    { title: "Registration Data", meta: "SAP Business Network" },
                  ],
                }}
              >
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-8">
                  <div className="shrink-0 text-center">
                    <p className="text-[36px] font-semibold leading-none tabular-nums">68%</p>
                    <p className="mt-1.5 text-[11.5px] text-muted-foreground">Profile complete</p>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mt-2 flex h-2.5 w-full overflow-hidden rounded-full bg-muted">

                      <div className="h-full bg-emerald-500" style={{ width: "63.6%" }} />
                      <div className="h-full bg-primary" style={{ width: "22.7%" }} />
                    </div>
                    <div className="mt-3 flex items-center gap-5 text-[11.5px] text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-emerald-500" /> Completed by Joule
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-primary" /> Review & Confirm
                      </span>
                      <span className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-muted-foreground/30" /> Add Manually
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              </SelectableCard>
            </section>

            <section id="section-review" className="scroll-mt-4">
              <SectionHeader
                label="Review & Confirm"
                subtitle="Fields Joule has suggested from trusted sources — verify accuracy and confirm."
              />
              <div className="space-y-2.5">
                {REVIEW_FIELDS.map((f) => (
                  <ReviewRow key={f.id} f={f} />
                ))}
              </div>
            </section>

            <section id="section-manual" className="scroll-mt-4">
              <SectionHeader
                label="Add Manually"
                subtitle="Details Joule couldn't source automatically — provide these to unlock buyer opportunities."
              />
              <div className="space-y-2.5">
                {MANUAL_FIELDS.map((f) => (
                  <ManualRow key={f.id} f={f} />
                ))}
              </div>
            </section>

            <section id="section-completed" className="scroll-mt-4">
              <SectionHeader
                label="Completed by Joule"
                subtitle="Fields already filled in from verified data sources — no action needed."
              />
              <div className="space-y-2.5">
                {COMPLETED_FIELDS.map((f) => (
                  <CompletedRow key={f.id} f={f} />
                ))}
                {showMore && MORE_COMPLETED.map((f) => <CompletedRow key={f.id} f={f} />)}
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={() => setShowMore((v) => !v)}
                  className="text-[12.5px] font-medium text-primary hover:underline"
                >
                  {showMore
                    ? "Show less"
                    : `+ ${MORE_COMPLETED.length} more fields completed by Joule`}
                </button>
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
                Help me finish my company profile.
              </div>
            </div>
            <div className="space-y-2 animate-fade-in-up">
              <div className="text-sm leading-relaxed text-foreground">
                You're 68% complete. I've pre-filled 14 fields — 5 need your quick review and 3 require manual input.
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

export default CompleteProfile;
