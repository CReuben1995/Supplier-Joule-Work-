import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowDownAZ,
  Bot,
  ChevronRight,
  Folder,
  Plus,
  Search,
  Sparkles,
  X,
} from "lucide-react";

type SortKey = "recent" | "name" | "count";
type SpaceStatus = "alert" | "chevron" | "ai" | "automation" | "none";
export type SpaceItem = {
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

export const MOCK_SPACES: SpaceItem[] = [
  { id: "supplier-onboarding", name: "Acme Onboarding", subtitle: "6 activities & tasks · 42% transaction-ready", meta: "Auto-synced", count: 3, countTone: "amber", status: "chevron", updatedRank: 1, route: "/spaces/vendor-onboarding" },
  { id: "complete-profile", name: "Complete Profile", subtitle: "68% complete · 8 fields need attention", meta: "Auto-synced", count: 8, countTone: "blue", status: "chevron", updatedRank: 2, route: "/spaces/complete-profile" },
  { id: "profile-insights", name: "Profile Insights", subtitle: "8 insights across 3 categories · 3 require input", meta: "Updated by Joule", count: 3, countTone: "amber", status: "chevron", updatedRank: 3, route: "/spaces/profile-insights" },
];

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

type Props = {
  activeRoute?: string;
  onClose?: () => void;
};

export const SpacesListPanel = ({ activeRoute }: Props) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [searchOpen, setSearchOpen] = useState(false);

  const visibleSpaces = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = q
      ? MOCK_SPACES.filter((s) => s.name.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q))
      : MOCK_SPACES;
    const sorted = [...filtered];
    if (sort === "name") sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "count") sorted.sort((a, b) => (b.count ?? 0) - (a.count ?? 0));
    else sorted.sort((a, b) => a.updatedRank - b.updatedRank);
    return sorted;
  }, [search, sort]);

  return (
    <aside className="sticky top-0 z-30 flex h-screen w-[380px] shrink-0 animate-slide-in-right flex-col border-r border-border bg-[#F8F9FA]">
      <header className="flex items-center gap-2 px-5 pb-3 pt-5 bg-gray-50">
        <h2 className="flex-1 text-xl font-semibold tracking-tight">Spaces</h2>
        <button
          onClick={() => setSearchOpen((o) => !o)}
          aria-label="Search spaces"
          className={`grid size-9 place-items-center rounded-lg transition-colors ${
            searchOpen ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Search className="size-[18px]" />
        </button>
        <button
          onClick={() => setSort((s) => (s === "name" ? "recent" : "name"))}
          aria-label="Sort spaces"
          title={sort === "name" ? "Sorted A–Z" : sort === "count" ? "Sorted by count" : "Sorted by recent"}
          className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowDownAZ className="size-[18px]" />
        </button>
        <button
          onClick={() => {
            navigate("/spaces");
          }}
          className="ml-1 inline-flex items-center gap-1.5 rounded-lg border border-primary/50 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
        >
          <Plus className="size-4" /> New Space
        </button>
      </header>

      {searchOpen && (
        <div className="px-5 pb-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-2.5 py-1.5">
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search spaces"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="grid size-5 place-items-center rounded text-muted-foreground hover:bg-muted"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      )}

      <ul className="flex-1 space-y-1 overflow-y-auto bg-card px-3 py-3 bg-gray-50">
        {visibleSpaces.map((s) => {
          const isActive = !!activeRoute && s.route === activeRoute;
          return (
            <li key={s.id}>
              <button
                onClick={() => {
                  if (s.route) navigate(s.route, { state: { spacesListOpen: true } });
                }}
                className={`relative flex w-full items-center gap-3 px-3 py-3 text-left transition-colors ${
                  isActive ? "bg-primary-soft" : "hover:bg-muted/60"
                }`}
              >
                {isActive && (
                  <span className="absolute inset-y-2 left-0 w-0.5 rounded-r bg-primary" aria-hidden />
                )}
                <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-card shadow-sm ring-1 ring-border">
                  <Folder className="size-[18px] text-muted-foreground" strokeWidth={1.75} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[14px] font-semibold text-foreground">{s.name}</p>
                    {s.liveDot && <span className="size-1.5 shrink-0 rounded-full bg-emerald-500" />}
                  </div>
                  <p className="mt-0.5 truncate text-[12px] text-muted-foreground">{s.subtitle}</p>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{s.meta}</span>
                    {s.count !== undefined && (
                      <span className={`grid min-w-[18px] place-items-center rounded-full px-1.5 text-[10px] font-semibold leading-[18px] ${countToneClass(s.countTone)}`}>
                        {s.count}
                      </span>
                    )}
                  </div>
                </div>
                <span className="shrink-0">
                  <StatusIcon status={s.status} />
                </span>
              </button>
            </li>
          );
        })}
        {visibleSpaces.length === 0 && (
          <li className="px-3 py-6 text-center text-xs text-muted-foreground">No spaces match "{search}"</li>
        )}
      </ul>
    </aside>
  );
};
