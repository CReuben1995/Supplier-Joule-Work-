import { useState } from "react";
import { CheckCircle2, Eye, Image as ImageIcon, Palette, Sparkles } from "lucide-react";

const COLORS = ["#5B3FE4", "#0F172A", "#0EA5E9", "#10B981", "#F59E0B"];

export const EmailTemplatePreview = () => {
  const [color, setColor] = useState(COLORS[0]);
  const [tone, setTone] = useState<"concise" | "rich">("rich");

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card">
      <header className="flex items-center justify-between border-b border-border px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold">Buyer-facing profile preview</h2>
          <p className="text-[11px] text-muted-foreground">
            This is how Northwind Components will appear to buyers searching the Business Network — refine before you publish.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-md border border-violet-600 bg-white px-3 py-1.5 text-xs font-medium text-purple-800 hover:bg-muted">
            <Eye className="size-3.5" /> Preview as buyer
          </button>
          <button className="rounded-md border border-violet-600 bg-white px-3 py-1.5 text-xs font-medium text-purple-800 hover:bg-muted">
            Publish profile
          </button>
        </div>
      </header>

      <div className="grid gap-0 md:grid-cols-[1.4fr_1fr]">
        <div className="border-b border-border bg-muted/30 p-5 md:border-b-0 md:border-r">
          <div className="mx-auto max-w-md overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div
              className="flex items-center gap-3 px-5 py-4"
              style={{ background: `linear-gradient(135deg, ${color} 0%, #0F172A 120%)` }}
            >
              <div className="grid size-10 place-items-center rounded bg-white/15 text-[11px] font-semibold text-white">
                NW
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">Northwind Components Ltd.</p>
                <p className="truncate text-[11px] text-white/70">Munich, DE · Verified supplier · ANID 1238-4421</p>
              </div>
            </div>
            <div className="space-y-3 px-5 py-5">
              <div className="flex flex-wrap gap-1.5">
                {["Electronic Components", "Connectors", "PCB Assembly", "ISO 9001"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary-soft px-2 py-0.5 text-[11px] font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {tone === "rich" ? (
                <p className="text-[13px] leading-relaxed text-foreground">
                  Tier-1 manufacturer of industrial connectors and cable harnesses serving automotive and industrial OEMs
                  across EMEA. 24-hour quote turnaround, ISO 9001 & IATF 16949 certified, Peppol e-invoicing ready.
                </p>
              ) : (
                <p className="text-[13px] leading-relaxed text-foreground">
                  Industrial connectors & cable harnesses · EMEA · ISO 9001 · Peppol-ready.
                </p>
              )}
              <ul className="space-y-1.5 text-[12px] text-foreground/80">
                {[
                  "8 production lines across Munich & Wrocław",
                  "Avg. on-time delivery 98.2% (last 12 mo.)",
                  "Sustainability: SBTi committed · EcoVadis Silver",
                ].map((line) => (
                  <li key={line} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-emerald-600" />
                    {line}
                  </li>
                ))}
              </ul>
              <button
                className="mt-2 inline-flex items-center rounded-md px-4 py-2 text-[12px] font-semibold text-white shadow-sm"
                style={{ backgroundColor: color }}
              >
                Connect with Northwind
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-5 p-5">
          <div className="rounded-lg bg-primary-soft p-3">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-primary">
              <Sparkles className="size-3.5" /> Joule suggests
            </div>
            <p className="mt-1 text-[12px] leading-relaxed text-foreground/80">
              Add <span className="font-semibold text-foreground">IATF 16949</span> and a sustainability statement to appear in
              <span className="font-semibold text-foreground"> 23 more</span> buyer searches in automotive electronics.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <Palette className="size-3.5" /> Brand color
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  aria-label={`Pick ${c}`}
                  className={`size-7 rounded-full ring-2 ring-offset-2 ring-offset-card transition-all ${
                    c === color ? "ring-foreground" : "ring-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              <ImageIcon className="size-3.5" /> Company logo
            </label>
            <button className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/30 px-3 py-3 text-xs font-medium text-muted-foreground hover:bg-muted">
              <ImageIcon className="size-4" /> Upload logo (PNG, SVG)
            </button>
          </div>

          <div>
            <label className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Description style</label>
            <div className="mt-1.5 inline-flex rounded-md border border-border bg-card p-0.5">
              {(["concise", "rich"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`rounded px-3 py-1 text-xs font-medium capitalize transition-colors ${
                    tone === t ? "bg-primary-soft text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
