import { ChevronDown, Code2, List, Plus, Send, Sparkles } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import agentImg from "@/assets/develop-agent.png.asset.json";
import n8nImg from "@/assets/develop-n8n.png.asset.json";
import applicationImg from "@/assets/develop-application.png.asset.json";
import extensionImg from "@/assets/develop-extension.png.asset.json";

const CARDS = [
  {
    title: "Agent",
    description:
      "Create and deploy Joule-powered or n8n agents tailored to your SAP landscape and business processes.",
    image: agentImg.url,
  },
  {
    title: "n8n Workflow",
    description:
      "Automate repetitive tasks with agentic workflows connected to your SAP system, without writing code.",
    image: n8nImg.url,
  },
  {
    title: "Application",
    description:
      "Build a CAP application with frontend UI where users can manage business data from SAP systems.",
    image: applicationImg.url,
  },
  {
    title: "Extension",
    description:
      "Develop custom solutions such as agent extensions, data model extensions, and agent skills.",
    image: extensionImg.url,
  },
];

const Develop = () => {
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
            aria-label="Solutions list"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <List className="size-[18px]" />
          </button>
          <span className="text-sm font-semibold">Develop</span>
        </header>

        <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 pb-16 pt-8">
          <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-primary to-[hsl(258,80%,55%)] text-white shadow-[0_10px_30px_-12px_rgba(91,63,228,0.55)]">
            <Code2 className="size-7" strokeWidth={2.25} />
          </div>
          <h1 className="mt-4 text-center text-[26px] font-semibold tracking-tight">
            Create a new solution
          </h1>
          <p className="mt-1.5 max-w-xl text-center text-sm text-muted-foreground">
            Create, test, and deploy solutions instantly in a ready-to-use environment designed to keep
            you building.
          </p>

          <div className="mt-6 grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map((c) => (
              <div
                key={c.title}
                className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
              >
                <div className="flex h-28 items-center justify-center bg-[#DBF1FF]">
                  <img src={c.image} alt={c.title} className="h-full w-full object-contain p-2" />
                </div>
                <div className="flex flex-1 flex-col gap-2 p-4">
                  <h3 className="text-sm font-semibold">{c.title}</h3>
                  <p className="flex-1 text-xs leading-relaxed text-muted-foreground">
                    {c.description}
                  </p>
                  <button
                    type="button"
                    className="mt-1 w-fit rounded-md border border-link px-3 py-1 text-xs font-medium text-link transition-colors hover:bg-link/5"
                  >
                    Create
                  </button>
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-12 w-full max-w-3xl rounded-2xl border border-primary/40 bg-card/95 p-3 shadow-[0_8px_30px_-12px_rgba(91,63,228,0.35)] backdrop-blur"
          >
            <input
              type="text"
              placeholder="Describe the solution you want to build with Joule Studio"
              className="w-full bg-transparent px-2 py-2 text-sm italic outline-none placeholder:text-muted-foreground"
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2 text-muted-foreground">
                <button type="button" className="grid size-7 place-items-center rounded hover:bg-muted">
                  <Plus className="size-4" />
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 rounded-md bg-primary-soft px-2.5 py-1 text-sm font-medium text-primary"
                >
                  <Sparkles className="size-3.5" />
                  Quick Create
                  <ChevronDown className="size-3.5" />
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
        </main>

        <p className="relative z-10 pb-4 text-center text-[11px] text-muted-foreground">
          Joule uses AI, verify results.
        </p>
      </div>
    </div>
  );
};

export default Develop;
