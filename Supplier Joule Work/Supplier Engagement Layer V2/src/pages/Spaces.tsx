import { AtSign, List, Plus, Send } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import { SpacesListPanel } from "@/components/SpacesListPanel";
import spacesMark from "@/assets/spaces-mark.png.asset.json";
import { useSpacesListOpen } from "@/hooks/useSpacesListOpen";

const SUGGESTIONS = [
  "Onboard a new supplier",
  "Review pending purchase orders",
  "Resolve invoice exceptions",
];

const Spaces = () => {
  const [listOpen, setListOpen] = useSpacesListOpen();

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />

      {listOpen && (
        <SpacesListPanel
          onClose={() => setListOpen(false)}
        />
      )}

      <div className="relative flex min-w-0 flex-1 flex-col shadow-[inset_8px_0_12px_-8px_rgba(15,23,42,0.08)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_100%_100%,hsl(var(--primary)/0.10),transparent_60%),radial-gradient(80%_50%_at_0%_100%,hsl(var(--primary)/0.06),transparent_55%)]"
        />

        <header className="relative z-10 flex h-14 items-center gap-3 px-6">
          <button
            onClick={() => setListOpen((o) => !o)}
            aria-label="Space list"
            className={`grid size-9 place-items-center rounded-lg transition-colors ${
              listOpen
                ? "bg-primary-soft text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <List className="size-[18px]" />
          </button>
          <span className="text-sm font-semibold">Create Space</span>
        </header>

        <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-16">
          <img src={spacesMark.url} alt="Spaces" className="size-16 object-contain" />
          <h1 className="mt-6 text-center text-[34px] font-semibold tracking-tight">
            Create a new space for your work
          </h1>
          <p className="mt-2 text-center text-base text-muted-foreground">
            Generate a smart workspace for any task, and built instantly from your own data.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 w-full rounded-2xl border border-primary/40 bg-card/95 p-3 shadow-[0_8px_30px_-12px_rgba(91,63,228,0.35)] backdrop-blur"
          >
            <input
              type="text"
              autoFocus
              placeholder="Message Joule..."
              className="w-full bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
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
                className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary transition-colors hover:bg-primary/15"
              >
                <Send className="size-4" />
              </button>
            </div>
          </form>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                className="rounded-lg border border-primary/40 bg-card/60 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary-soft"
              >
                {s}
              </button>
            ))}
          </div>
        </main>

        <p className="relative z-10 pb-4 text-center text-[11px] text-muted-foreground">
          Joule uses AI, verify results.
        </p>
      </div>
    </div>
  );
};

export default Spaces;
