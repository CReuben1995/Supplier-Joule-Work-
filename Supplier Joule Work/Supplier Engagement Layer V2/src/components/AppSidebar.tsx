import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import jouleLogo from "@/assets/joule-logo.png.asset.json";
import discoverActiveIcon from "@/assets/discover-active.svg.asset.json";
import conversationsActiveIcon from "@/assets/conversations-active.png.asset.json";
import jobsActiveIcon from "@/assets/jobs-active.svg.asset.json";
import developActiveIcon from "@/assets/develop-active.svg.asset.json";
import spacesActiveIcon from "@/assets/spaces-active.png.asset.json";
import samAvatar from "@/assets/sam-avatar.jpg";
import {
  Bell,
  Box,
  ChevronDown,
  Code2,
  Hexagon,
  Layers,
  MessagesSquare,
  Network,
  PanelLeft,
  Plus,
  Settings,
  Sparkles,
  Info,
  Compass,
  Route,
  Power,
  ChevronRight,
  X,
} from "lucide-react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type SidebarIconProps = {
  Icon?: typeof Box;
  iconSrc?: string;
  activeIconSrc?: string;
  label: string;
  to?: string;
  active?: boolean;
  expanded?: boolean;
  trailing?: React.ReactNode;
  onClick?: () => void;
};

const SidebarIcon = ({ Icon, iconSrc, activeIconSrc, label, to, active, expanded, trailing, onClick }: SidebarIconProps) => {
  const base = `group/icon relative z-10 flex h-10 items-center rounded-xl transition-all duration-200 ease-out ${
    active
      ? "bg-primary-soft text-primary"
      : "text-muted-foreground hover:bg-primary-soft hover:text-primary"
  }`;
  const className = expanded ? `${base} w-full pr-2` : base;
  const hasSwap = !!activeIconSrc && !!Icon && !active;
  const inner = (
    <>
      <span className="grid size-10 shrink-0 place-items-center">
        {hasSwap ? (
          <>
            <Icon className="size-[18px] group-hover/icon:hidden" />
            <img src={activeIconSrc} alt="" className="hidden size-6 object-contain group-hover/icon:block" />
          </>
        ) : iconSrc ? (
          <img src={iconSrc} alt="" className="size-6 object-contain" />
        ) : Icon ? (
          <Icon className="size-[18px]" />
        ) : null}
      </span>
      {expanded ? (
        <>
          <span className="flex-1 truncate whitespace-nowrap text-left text-sm font-semibold text-foreground">
            {label}
          </span>
          {trailing}
        </>
      ) : (
        <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-200 ease-out group-hover/icon:max-w-[160px] group-hover/icon:pr-3 group-hover/icon:opacity-100">
          {label}
        </span>
      )}
    </>
  );
  return (
    <div className={expanded ? "relative w-full" : "relative grid size-10 place-items-center"}>
      {to ? (
        <Link to={to} className={className} aria-label={label}>
          {inner}
        </Link>
      ) : (
        <button type="button" onClick={onClick} className={className} aria-label={label}>
          {inner}
        </button>
      )}
    </div>
  );
};


type NotificationItem = {
  id: string;
  title: string;
  description: string;
  product: string;
  feature: string;
  time: string;
  tone: "violet" | "blue" | "emerald" | "amber";
};

type NotificationGroup = { label: string; items: NotificationItem[] };

const initialNotifications: NotificationGroup[] = [
  {
    label: "Today",
    items: [
      {
        id: "n1",
        title: "Acme Manufacturing invited you",
        description: "Finish your transaction-readiness checklist to receive your first PO from Acme.",
        product: "SAP Business Network",
        feature: "Buyer Invitations",
        time: "09:12",
        tone: "violet",
      },
      {
        id: "n2",
        title: "Missing Peppol certificate",
        description: "Joule detected Germany requires a Peppol-signed cert to invoice Acme — upload yours.",
        product: "Compliance Radar",
        feature: "E-invoicing",
        time: "08:47",
        tone: "amber",
      },
    ],
  },
  {
    label: "Yesterday",
    items: [
      {
        id: "n3",
        title: "12 new buyers match your categories",
        description: "Suppliers like Northwind win 2.3× more RFQs after completing profile polish.",
        product: "SAP Business Network",
        feature: "Discovery Match",
        time: "17:08",
        tone: "emerald",
      },
    ],
  },
];

const toneMap = {
  violet: "bg-violet-100 text-violet-600",
  blue: "bg-sky-100 text-sky-600",
  emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
} as const;

const NotificationPanel = ({
  groups,
  onClear,
  onDismiss,
}: {
  groups: NotificationGroup[];
  onClear: () => void;
  onDismiss: (id: string) => void;
}) => {
  const [open, setOpen] = useState<Record<string, boolean>>({ Today: true, Yesterday: true });
  return (
    <div className="w-[380px] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_24px_60px_-20px_rgba(15,15,15,0.25)]">
      <div className="flex items-center justify-between px-5 pb-3 pt-4">
        <h3 className="text-base font-semibold">Notifications</h3>
        <button onClick={onClear} className="text-sm font-medium text-foreground hover:text-link">
          Clear All
        </button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto px-3 pb-3">
        {groups.length === 0 && (
          <p className="px-4 py-6 text-center text-xs text-muted-foreground">You're all caught up.</p>
        )}
        {groups.map((group) => (
          <div key={group.label} className="mb-2">
            <button
              onClick={() => setOpen((s) => ({ ...s, [group.label]: !s[group.label] }))}
              className="flex w-full items-center gap-2 px-2 py-2 text-sm font-semibold"
            >
              <ChevronDown
                className={`size-3.5 text-muted-foreground transition-transform ${
                  open[group.label] ? "" : "-rotate-90"
                }`}
              />
              {group.label}
            </button>
            {open[group.label] && (
              <ul className="space-y-2">
                {group.items.map((n) => (
                  <li
                    key={n.id}
                    className="relative rounded-xl border border-border bg-background p-3 transition-colors hover:bg-muted/40"
                  >
                    <div className="flex gap-3">
                      <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${toneMap[n.tone]}`}>
                        <Hexagon className="size-4" strokeWidth={1.75} />
                      </span>
                      <div className="min-w-0 flex-1 pr-5">
                        <p className="text-[13.5px] font-semibold leading-tight">{n.title}</p>
                        <p className="mt-0.5 text-[12px] leading-snug text-foreground/70">{n.description}</p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-1.5 text-[11px] text-muted-foreground">
                          <span>{n.product}</span>
                          <span>·</span>
                          <span>{n.feature}</span>
                          <span>·</span>
                          <span>{n.time}</span>
                          <button className="ml-auto text-[11px] font-medium text-link hover:underline">More</button>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDismiss(n.id)}
                      className="absolute right-2 top-2 grid size-6 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Dismiss notification"
                    >
                      <X className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Persist across page navigations (component remounts on every route).
let expandedMemory: boolean | null = null;
const readExpanded = () => {
  if (expandedMemory !== null) return expandedMemory;
  if (typeof window === "undefined") return false;
  expandedMemory = window.localStorage.getItem("appSidebarExpanded") === "true";
  return expandedMemory;
};
const writeExpanded = (value: boolean) => {
  expandedMemory = value;
  if (typeof window !== "undefined") {
    window.localStorage.setItem("appSidebarExpanded", String(value));
  }
};

export const AppSidebar = () => {
  const { pathname } = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const [expanded, setExpandedState] = useState(readExpanded);
  const setExpanded = (value: boolean | ((prev: boolean) => boolean)) => {
    setExpandedState((prev) => {
      const next = typeof value === "function" ? value(prev) : value;
      writeExpanded(next);
      return next;
    });
  };
  const [groups, setGroups] = useState(initialNotifications);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!notifOpen) return;
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [notifOpen]);

  const total = groups.reduce((acc, g) => acc + g.items.length, 0);
  const isActive = (route: string) => pathname === route;
  const discoverActive = pathname.startsWith("/joule");

  const AddBtn = (
    <span className="grid size-6 place-items-center rounded text-muted-foreground">
      <Plus className="size-4" />
    </span>
  );

  return (
    <aside
      className={`sticky top-0 z-40 flex h-screen flex-col border-r border-border bg-[#F8F9FA] py-4 transition-[width] duration-200 ease-out ${
        expanded ? "w-64 items-stretch px-3" : "w-14 items-center"
      }`}
    >
      <div className={expanded ? "flex h-10 items-center gap-2 px-1" : "grid size-10 place-items-center"}>
        <img src={jouleLogo.url} alt="Joule" className="size-9 object-contain" />
        {expanded && (
          <span className="text-lg font-semibold">
            <span className="text-primary">Joule</span> <span className="text-foreground">Work</span>
          </span>
        )}
      </div>
      <div className={`flex flex-1 flex-col justify-center ${expanded ? "items-stretch gap-1" : "items-center gap-2"}`}>
        <SidebarIcon expanded={expanded} Icon={MessagesSquare} activeIconSrc={conversationsActiveIcon.url} iconSrc={isActive("/conversations") ? conversationsActiveIcon.url : undefined} label="Conversations" to="/conversations" active={isActive("/conversations")} trailing={expanded ? AddBtn : undefined} />
        <SidebarIcon expanded={expanded} Icon={Compass} activeIconSrc={discoverActiveIcon.url} iconSrc={discoverActive ? discoverActiveIcon.url : undefined} label="Discover" to="/joule" active={discoverActive} />
        <SidebarIcon expanded={expanded} Icon={Layers} activeIconSrc={spacesActiveIcon.url} iconSrc={pathname.startsWith("/spaces") ? spacesActiveIcon.url : undefined} label="Spaces" to="/spaces" active={pathname.startsWith("/spaces")} trailing={expanded ? AddBtn : undefined} />
        <SidebarIcon expanded={expanded} Icon={Network} activeIconSrc={jobsActiveIcon.url} iconSrc={isActive("/jobs") ? jobsActiveIcon.url : undefined} label="Jobs" to="/jobs" active={isActive("/jobs")} />
        <SidebarIcon expanded={expanded} Icon={Code2} activeIconSrc={developActiveIcon.url} iconSrc={isActive("/develop") ? developActiveIcon.url : undefined} label="Develop" to="/develop" active={isActive("/develop")} />
      </div>
      <div className={`flex flex-col ${expanded ? "items-stretch gap-2" : "items-center gap-3"}`}>
        <div ref={notifRef} className={expanded ? "relative w-full" : "relative grid size-10 place-items-center"}>
          <button
            type="button"
            onClick={() => setNotifOpen((o) => !o)}
            aria-label="Notifications"
            className={`group/icon relative z-10 flex h-10 items-center rounded-xl transition-all duration-200 ease-out ${
              expanded ? "w-full pr-2" : ""
            } ${
              notifOpen ? "bg-primary-soft text-primary" : "text-muted-foreground hover:bg-primary-soft hover:text-primary"
            }`}
          >
            <span className="grid size-10 shrink-0 place-items-center">
              <Bell className="size-[18px]" />
              {!expanded && total > 0 && !notifOpen && (
                <span className="absolute right-1 top-1 grid min-w-[16px] h-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold leading-none text-white group-hover/icon:hidden">
                  {total}
                </span>
              )}
            </span>
            {expanded ? (
              <>
                <span className="flex-1 text-left text-sm font-semibold text-foreground">Notifications</span>
                {total > 0 && (
                  <span className="grid min-w-[18px] h-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold leading-none text-white">
                    {total}
                  </span>
                )}
              </>
            ) : (
              <span className="flex max-w-0 items-center gap-2 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-200 ease-out group-hover/icon:max-w-[200px] group-hover/icon:pr-3 group-hover/icon:opacity-100">
                Notifications
                {total > 0 && (
                  <span className="grid min-w-[18px] h-[18px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold leading-none text-white">
                    {total}
                  </span>
                )}
              </span>
            )}
          </button>
          {notifOpen && (
            <div className={`absolute bottom-0 z-50 animate-fade-in-up ${expanded ? "left-[calc(100%+8px)]" : "left-[calc(100%+12px)]"}`}>
              <NotificationPanel
                groups={groups}
                onClear={() => setGroups([])}
                onDismiss={(id) =>
                  setGroups((gs) =>
                    gs
                      .map((g) => ({ ...g, items: g.items.filter((i) => i.id !== id) }))
                      .filter((g) => g.items.length),
                  )
                }
              />
            </div>
          )}
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="Account"
              className={expanded ? "flex h-10 w-full items-center gap-2 rounded-xl pr-2 hover:bg-primary-soft" : ""}
            >
              <span className={expanded ? "grid size-10 shrink-0 place-items-center" : ""}>
                <img
                  src={samAvatar}
                  alt="Sam Park"
                  width={32}
                  height={32}
                  loading="lazy"
                  className="size-8 rounded-full object-cover ring-2 ring-background transition hover:ring-primary"
                />
              </span>
              {expanded && (
                <span className="flex-1 truncate text-left text-sm font-semibold text-foreground">Sam Park</span>
              )}
            </button>
          </PopoverTrigger>
          <PopoverContent
            side="right"
            align="end"
            sideOffset={12}
            className="w-[340px] rounded-2xl border border-border bg-card p-0 shadow-[0_24px_60px_-20px_rgba(15,15,15,0.25)]"
          >
            <div className="relative flex flex-col items-center px-6 pb-5 pt-6">
              <PopoverPrimitive.Close
                className="absolute right-3 top-3 grid size-7 place-items-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="Close"
              >
                <X className="size-4" />
              </PopoverPrimitive.Close>
              <img
                src={samAvatar}
                alt="Sam Park"
                className="size-20 rounded-full object-cover"
              />
              <p className="mt-3 text-lg font-semibold">Sam Park</p>
              <p className="text-sm text-muted-foreground">sam.park@northwind-components.com</p>
              <p className="text-sm text-muted-foreground">Onboarding & AR Lead</p>
              <p className="text-sm text-muted-foreground">Northwind Components Ltd.</p>
            </div>
            <button className="flex w-full items-center justify-between border-t border-border px-6 py-4 text-left hover:bg-muted/40">
              <span className="text-sm font-semibold">Trading partners (3)</span>
              <ChevronRight className="size-4 text-muted-foreground" />
            </button>
            <div className="border-t border-border py-2">
              {[
                { icon: Settings, label: "Settings" },
                { icon: Compass, label: "Explore Skills" },
                { icon: Route, label: "Onboarding Tours" },
                { icon: Sparkles, label: "AI Notice" },
                { icon: Info, label: "About" },
              ].map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  className="flex w-full items-center gap-3 px-6 py-2.5 text-left text-sm font-medium hover:bg-muted/40"
                >
                  <Icon className="size-[18px] text-muted-foreground" />
                  {label}
                </button>
              ))}
            </div>
            <div className="flex justify-end border-t border-border px-6 py-3">
              <button className="flex items-center gap-2 text-sm font-semibold text-link">
                <Power className="size-4" />
                Sign Out
              </button>
            </div>
          </PopoverContent>
        </Popover>
        <SidebarIcon
          expanded={expanded}
          Icon={PanelLeft}
          label={expanded ? "Collapse" : "Expand"}
          onClick={() => setExpanded((e) => !e)}
        />
      </div>
    </aside>
  );
};

export default AppSidebar;
