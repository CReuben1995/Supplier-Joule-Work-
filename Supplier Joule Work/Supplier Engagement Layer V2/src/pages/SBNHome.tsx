import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  ChevronDown,
  Gem,
  HelpCircle,
  MessageSquare,
  Megaphone,
  Search,
  ArrowUpRight,
  Settings2,
  Truck,
  CreditCard,
  Sparkles,
  Loader2,
  Check,
  ArrowRight,
  Building2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import sapLogo from "@/assets/sap-logo.png.asset.json";
import jouleIcon from "@/assets/joule-icon.png.asset.json";

const navItems = [
  { label: "Home", active: true },
  { label: "Planning", caret: true },
  { label: "Orders", caret: true },
  { label: "Fulfillment", caret: true },
  { label: "Quality", caret: true },
  { label: "Invoices", caret: true },
  { label: "Payments", caret: true },
  { label: "Catalogs" },
  { label: "Supplier Enablement", caret: true },
  { label: "More", caret: true },
];

const tiles = [
  { label: "Orders", value: "39" },
  { label: "Invoices", value: "12" },
  { label: "Order change request", value: "15" },
  { label: "Return items", value: "1" },
  { label: "Scheduled Payments", value: "21.99", prefix: "$", suffix: "K" },
  { label: "Payment batch", value: "87" },
  { label: "Open posting", value: "21" },
];

const actions = [
  "Update company profile",
  "Upload vendors",
  "Manage active relationships",
  "Configure transaction rules",
  "Configure email notifications",
  "Add roles and users",
  "Configure supplier groups",
];

function SapLogo({ className = "" }: { className?: string }) {
  return <img src={sapLogo.url} alt="SAP" className={`h-8 w-auto ${className}`} />;
}

export default function SBNHome() {
  const [open, setOpen] = useState(false);
  const [loadingJoule, setLoadingJoule] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setOpen(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-sbn-surface text-foreground">
      {/* Top bar */}
      <header className="bg-card border-b border-border">
        <div className="flex items-center justify-between px-6 h-14">
          <div className="flex items-center gap-3">
            <SapLogo />
            <div className="flex items-center gap-1 text-[15px] font-semibold text-foreground">
              Business Network
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-sm text-muted-foreground">Enterprise</span>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={() => setOpen(true)}
                  className="rounded-md p-1.5 text-muted-foreground hover:text-sbn hover:bg-sbn/5 transition-colors"
                  aria-label="Open Joule"
                >
                  <Gem className="h-5 w-5" />
                </button>
              </TooltipTrigger>
              <TooltipContent>Joule</TooltipContent>
            </Tooltip>
            <button className="text-muted-foreground hover:text-foreground"><Bell className="h-5 w-5" /></button>
            <button className="text-muted-foreground hover:text-foreground"><Megaphone className="h-5 w-5" /></button>
            <button className="text-muted-foreground hover:text-foreground"><MessageSquare className="h-5 w-5" /></button>
            <button className="text-muted-foreground hover:text-foreground"><HelpCircle className="h-5 w-5" /></button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sbn/15 text-sbn text-xs font-semibold">
              SD
            </div>
          </div>
        </div>
        {/* Nav */}
        <nav className="px-6 flex items-center justify-between border-t border-border/60">
          <ul className="flex items-center gap-6 text-[14px]">
            {navItems.map((item) => (
              <li key={item.label}>
                <button
                  className={`flex items-center gap-1 py-3 border-b-2 transition-colors ${
                    item.active
                      ? "border-sbn text-sbn font-medium"
                      : "border-transparent text-foreground/80 hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {item.caret && <ChevronDown className="h-3.5 w-3.5" />}
                </button>
              </li>
            ))}
          </ul>
          <button className="flex items-center gap-1.5 text-sm text-sbn-link hover:underline">
            <ArrowUpRight className="h-4 w-4" />
            Quick links
          </button>
        </nav>
      </header>

      <main className="px-6 py-6 space-y-8">
        {/* Welcome banner */}
        <section
          className="relative overflow-hidden rounded-md bg-sbn text-sbn-foreground px-8 py-7"
        >
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-30deg, transparent 0 32px, hsl(var(--sbn-primary-foreground)/0.4) 32px 33px, transparent 33px 80px)",
            }}
          />
          <div className="relative flex flex-nowrap items-center justify-between gap-6">
            <div className="shrink-0">
              <h1 className="text-[22px] font-semibold leading-tight">Good Morning!</h1>
              <p className="text-[22px] font-semibold leading-tight">Welcome to SAP Business Network</p>
            </div>
            <div className="ml-auto flex items-stretch h-10 bg-card text-foreground rounded-sm overflow-hidden text-sm shadow-sm shrink-0 whitespace-nowrap">
              <button className="flex items-center gap-2 px-3 border-r border-border justify-between">
                Order and Releases <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <button className="flex items-center gap-2 px-3 border-r border-border justify-between">
                All customers <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <button className="flex items-center gap-2 px-3 border-r border-border justify-between">
                Exact Match <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
              <input
                placeholder="Order Numbers"
                className="px-3 w-[160px] outline-none placeholder:text-muted-foreground"
              />
              <button className="px-3 text-muted-foreground hover:text-foreground border-l border-border">
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

        </section>

        {/* Workbench Overview */}
        <section>
          <h2 className="text-[15px] font-semibold mb-3">Workbench Overview</h2>
          <div className="grid grid-cols-7 gap-3">
            {tiles.map((t) => (
              <div key={t.label} className="rounded-md bg-card border border-border p-4 min-h-[120px] flex flex-col">
                <div className="text-[13px] font-medium text-foreground leading-tight">{t.label}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">Last 31 days</div>
                <div className="mt-auto text-[28px] font-light text-foreground flex items-baseline gap-0.5">
                  {t.prefix && <span className="text-sm font-normal text-muted-foreground">{t.prefix}</span>}
                  {t.value}
                  {t.suffix && <span className="text-sm font-normal text-muted-foreground ml-0.5">{t.suffix}</span>}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-2">
            <button className="flex items-center gap-1.5 text-sm text-sbn-link hover:underline">
              <ArrowUpRight className="h-4 w-4" />
              Workbench
            </button>
          </div>
        </section>

        {/* Suggested Actions */}
        <section>
          <h2 className="text-[15px] font-semibold mb-3">Suggested Actions</h2>
          <div className="flex flex-wrap gap-3">
            {actions.map((a) => (
              <button
                key={a}
                className="px-4 py-2 rounded-full border border-border bg-card text-[13px] hover:border-sbn hover:text-sbn transition-colors"
              >
                {a}
              </button>
            ))}
          </div>
          <div className="flex justify-end mt-2">
            <button className="flex items-center gap-1.5 text-sm text-sbn-link hover:underline">
              <ArrowUpRight className="h-4 w-4" />
              View all tasks
            </button>
          </div>
        </section>

        {/* Highlights */}
        <section>
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-[15px] font-semibold">Highlights</h2>
            <button className="flex items-center gap-1 text-[13px] text-sbn-link border border-border rounded px-2.5 py-1 bg-card">
              All Customers <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button className="flex items-center gap-1.5 text-[13px] text-sbn-link border border-border rounded px-2.5 py-1 bg-card">
              <Settings2 className="h-3.5 w-3.5" />
              Customize
            </button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            <div className="rounded-md bg-card border border-border p-5 min-h-[220px]">
              <div className="flex items-center gap-2 mb-4">
                <Truck className="h-4 w-4 text-sbn" />
                <span className="font-semibold text-sm">Track your shipments</span>
              </div>
              <div className="text-xs text-muted-foreground mb-1">Purchase Order Shipment :</div>
              <input className="w-full h-9 border border-border rounded px-2 text-sm" />
            </div>
            <div className="rounded-md bg-card border border-border p-5 min-h-[220px]">
              <div className="font-semibold text-sm">Purchase orders</div>
              <div className="text-xs text-muted-foreground mt-1">USD</div>
              <div className="mt-3 text-3xl font-semibold text-success">$79.7<span className="text-lg align-top">M</span></div>
              <div className="text-xs text-muted-foreground mt-1">Bi-weekly Volume</div>
              <div className="mt-6 h-14 flex items-end gap-1">
                {[30, 50, 35, 70, 45, 60, 80, 55, 65, 75, 50, 90].map((h, i) => (
                  <div key={i} className="flex-1 bg-sbn/30 rounded-sm" style={{ height: `${h}%` }} />
                ))}
              </div>
            </div>
            <div className="rounded-md bg-card border border-border p-5 min-h-[220px]">
              <div className="flex items-center gap-2 mb-3">
                <CreditCard className="h-4 w-4 text-sbn" />
                <span className="font-semibold text-sm">Early Payments by Taulia</span>
              </div>
              <div className="text-xs text-muted-foreground">Accelerate cash flow on approved invoices.</div>
              <button className="mt-4 text-[13px] text-sbn-link hover:underline">Learn more</button>
            </div>
            <div className="rounded-md bg-card border border-border p-5 min-h-[220px]">
              <div className="font-semibold text-sm">Activity Log</div>
              <div className="text-xs text-muted-foreground mt-0.5 mb-4">By date and time</div>
              <div className="flex items-start justify-between text-sm">
                <div>
                  <div className="font-medium">Order received</div>
                  <div className="text-xs text-sbn-link mt-0.5">100035264</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Aug 31, 12:05PM</div>
                  <div className="text-xs mt-0.5">1.1K USD</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Joule launch dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[760px] p-0 overflow-hidden gap-0">
          <DialogHeader className="h-10 px-6 border-b border-border space-y-0 flex flex-row items-center">
            <DialogTitle className="text-[14px] font-semibold">
              Welcome to SAP Business Network
            </DialogTitle>
          </DialogHeader>

          <div className="px-10 pt-8 pb-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">Ready to get started?</h1>
            <p className="mt-3 text-[14px] text-muted-foreground max-w-lg mx-auto">
              Choose how you'd like to set up your account for Acme Corp. You can change
              this later in settings.
            </p>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              {/* Joule Work — recommended */}
              <button
                type="button"
                onClick={() => {
                  setLoadingJoule(true);
                  setTimeout(() => navigate("/joule"), 1200);
                }}
                disabled={loadingJoule}
                className="group relative flex flex-col p-7 rounded-2xl border-2 border-[#5D36FF] bg-[#5D36FF]/[0.04] ring-1 ring-[#5D36FF]/20 transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-80 disabled:cursor-wait text-left"
              >
                <span className="absolute -top-3 right-4 bg-[#5D36FF] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">
                  Recommended
                </span>

                <div className="flex items-center gap-3 mb-4">
                  <img src={jouleIcon.url} alt="Joule" className="w-10 h-10 rounded-lg" />
                  <h3 className="text-xl font-bold text-foreground">Joule Work</h3>
                </div>

                <p className="text-[13px] text-foreground/80 font-medium mb-5">
                  Accelerate your setup with AI-driven guidance and automated assistance.
                </p>

                <ul className="space-y-3 flex-grow">
                  {[
                    "Intelligent task prioritization",
                    "Automated company profile mapping",
                    "Real-time AI support assistant",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-sbn mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span className="text-[13px] text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-center text-sbn-link font-bold text-[13px]">
                  {loadingJoule ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Opening…
                    </>
                  ) : (
                    <>
                      Start with Joule
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </div>
              </button>

              {/* Classic Portal */}
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loadingJoule}
                className="group flex flex-col p-7 rounded-2xl border-2 border-border bg-card transition-all hover:-translate-y-0.5 hover:border-muted-foreground/40 hover:shadow-lg disabled:opacity-60 text-left"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-muted rounded-lg group-hover:bg-muted/80 transition-colors">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground">Classic Portal</h3>
                </div>

                <p className="text-[13px] text-foreground/80 font-medium mb-5">
                  Directly manage your configuration using the standard network interface.
                </p>

                <ul className="space-y-3 flex-grow">
                  {[
                    "Complete manual control",
                    "Standard business workflows",
                    "Traditional form-based entry",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-muted-foreground/60 mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span className="text-[13px] text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-center text-muted-foreground font-bold text-[13px] group-hover:text-foreground transition-colors">
                  Go to Application
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            </div>
          </div>

          <div className="px-6 py-3 bg-muted/40 border-t border-border flex justify-center">
            <p className="text-[11px] text-muted-foreground uppercase tracking-widest font-semibold">
              Secure SAP Enterprise Connection
            </p>
          </div>
        </DialogContent>
      </Dialog>


    </div>
  );
}
