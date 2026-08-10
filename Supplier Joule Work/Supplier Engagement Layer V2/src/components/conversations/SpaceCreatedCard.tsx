import { Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { SpaceCardPayload } from "@/lib/jouleConversation";

export const SpaceCreatedCard = ({ card }: { card: SpaceCardPayload }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-xl rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary-soft text-primary">
          <Layers className="size-5" strokeWidth={1.75} />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-snug text-foreground">{card.name}</h3>
          <p className="mt-1 text-sm leading-snug text-muted-foreground">{card.subtitle}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          Space created
        </span>
        <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Profile
        </span>
        <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
          Buyer Reach
        </span>
        <button
          onClick={() => navigate(card.route, { state: { spacesListOpen: true } })}
          className="ml-auto inline-flex items-center justify-center rounded-lg bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          View Space
        </button>
      </div>
    </div>
  );
};
