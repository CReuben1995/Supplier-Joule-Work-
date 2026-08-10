import { useState } from "react";
import { AtSign, List, Plus, Send } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import spacesMark from "@/assets/spaces-mark.png.asset.json";

const SUGGESTIONS = [
  "Monitor stalled purchase orders",
  "Auto-approve low-value invoices",
  "Flag suppliers missing certifications",
];

const Jobs = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />

      <div className="relative flex min-w-0 flex-1 flex-col">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_100%_100%,hsl(var(--primary)/0.10),transparent_60%),radial-gradient(80%_50%_at_0%_100%,hsl(var(--primary)/0.06),transparent_55%)]"
        />

        <header className="relative z-10 flex h-14 items-center gap-3 px-6">
          <button
            aria-label="Job list"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <List className="size-[18px]" />
          </button>
          <span className="text-sm font-semibold">Create Jobs</span>
        </header>

        <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-16">
          <img src={spacesMark.url} alt="Jobs" className="size-16 object-contain" />
          <h1 className="mt-6 text-center text-[34px] font-semibold tracking-tight">
            Create a new Job for your work
          </h1>
          <p className="mt-2 text-center text-base text-muted-foreground">
            Generate an intelligent Job that can perform tasks, make decisions, and act on your
            behalf using your business data and processes.
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

          {!showSuggestions ? (
            <button
              type="button"
              onClick={() => setShowSuggestions(true)}
              className="mt-5 text-sm font-semibold text-primary hover:underline"
            >
              Show suggestions
            </button>
          ) : (
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
          )}
        </main>

        <p className="relative z-10 pb-4 text-center text-[11px] text-muted-foreground">
          Joule uses AI, verify results.
        </p>
      </div>
    </div>
  );
};

export default Jobs;
