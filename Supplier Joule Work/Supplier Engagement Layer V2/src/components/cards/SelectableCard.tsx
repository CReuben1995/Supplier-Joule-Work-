import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronsUpDown, ExternalLink, Lightbulb, Move, Trash2, X } from "lucide-react";

export type CardInsight = {
  subtitle?: string;
  summary: string;
  steps?: string[];
  sources?: { title: string; meta: string }[];
};

const SBN_URL = "https://www.sap.com/products/business-network.html";

type Props = {
  title: string;
  insight: CardInsight;
  children: ReactNode;
  className?: string;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
};

type InsightTab = "Summary" | "Steps" | "Sources";

export const SelectableCard = ({
  title,
  insight,
  children,
  className = "",
  onMoveUp,
  onMoveDown,
  onDelete,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(false);
  const [insightOpen, setInsightOpen] = useState(false);
  const [tab, setTab] = useState<InsightTab>("Summary");
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (!selected) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setSelected(false);
        setInsightOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelected(false);
        setInsightOpen(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [selected]);

  if (removed) return null;

  const toolbarBtn =
    "grid size-8 place-items-center rounded-lg text-foreground/80 transition-colors hover:bg-primary-soft hover:text-primary";

  return (
    <div ref={ref} className={`relative ${className}`}>
      {selected && (
        <div className="absolute -top-5 left-1/2 z-40 -translate-x-1/2">
          <div className="flex items-center gap-0.5 rounded-xl border border-primary/50 bg-card p-1 shadow-[0_8px_24px_-10px_rgba(91,63,228,0.5)]">
            <button
              type="button"
              aria-label="Drag card"
              className={`${toolbarBtn} cursor-grab active:cursor-grabbing`}
            >
              <Move className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Move card up or down"
              onClick={() => (onMoveDown ? onMoveDown() : onMoveUp?.())}
              className={toolbarBtn}
            >
              <ChevronsUpDown className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Delete card"
              onClick={() => (onDelete ? onDelete() : setRemoved(true))}
              className={toolbarBtn}
            >
              <Trash2 className="size-4" />
            </button>
            <button
              type="button"
              aria-label="Show insights"
              onClick={() => setInsightOpen((o) => !o)}
              className={`${toolbarBtn} ${insightOpen ? "bg-primary-soft text-primary ring-1 ring-primary/50" : ""}`}
            >
              <Lightbulb className="size-4" />
            </button>
          </div>
        </div>
      )}

      {insightOpen && selected && (
        <div className="absolute left-1/2 top-4 z-50 w-[420px] max-w-[90vw] rounded-xl border border-border bg-card p-5 shadow-[0_20px_60px_-20px_rgba(15,23,42,0.4)]">
          <button
            type="button"
            aria-label="Close insights"
            onClick={() => setInsightOpen(false)}
            className="absolute right-4 top-4 grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
          <h3 className="pr-8 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
          {insight.subtitle && (
            <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{insight.subtitle}</p>
          )}

          <div className="mt-4 flex items-center gap-1">
            {(["Summary", "Steps", "Sources"] as InsightTab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors ${
                  tab === t
                    ? "border border-primary/60 text-primary"
                    : "border border-transparent text-foreground hover:bg-muted"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-4 max-h-[280px] overflow-y-auto">
            {tab === "Summary" && (
              <p className="text-[13px] leading-relaxed text-foreground/85">{insight.summary}</p>
            )}
            {tab === "Steps" && (
              <ol className="space-y-2">
                {(insight.steps ?? []).map((s, idx) => (
                  <li key={s} className="flex gap-2.5 text-[13px] leading-relaxed text-foreground/85">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">
                      {idx + 1}
                    </span>
                    {s}
                  </li>
                ))}
                {!insight.steps?.length && (
                  <li className="text-[13px] text-muted-foreground">No steps for this insight.</li>
                )}
              </ol>
            )}
            {tab === "Sources" && (
              <div>
                <p className="text-[13px] font-semibold text-foreground">
                  Sources ({insight.sources?.length ?? 0})
                </p>
                <ul className="mt-3 space-y-2">
                  {(insight.sources ?? []).map((s) => (
                    <li
                      key={s.title + s.meta}
                      className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-medium text-link">{s.title}</p>
                        <p className="truncate text-[11.5px] text-muted-foreground">{s.meta}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="mt-4 border-t border-border pt-3">
            <a
              href={SBN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[13px] font-medium text-link hover:underline"
            >
              View in SAP Business Network
              <ExternalLink className="size-3.5" />
            </a>
          </div>
        </div>
      )}

      <div
        role="button"
        tabIndex={0}
        onClick={() => setSelected(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setSelected((s) => !s);
        }}
        className={`rounded-2xl transition-shadow ${
          selected ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
        }`}
      >
        {children}
      </div>
    </div>
  );
};
