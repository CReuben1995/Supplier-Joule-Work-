import type { SpaceCardPayload, SpacePromptPayload } from "@/lib/jouleConversation";

export type Intent = "profile-insights" | null;
export type SpacePrompt = "profile-insights";

export const detectIntent = (text: string): Intent => {
  const t = text.toLowerCase();
  const reachish = /(reach|visibility|insight|insights|discover|buyer|buyers|profile)/.test(t);
  if (reachish) return "profile-insights";
  return null;
};

const SPACES: Record<SpacePrompt, SpaceCardPayload> = {
  "profile-insights": {
    kind: "space-created",
    spaceId: "profile-insights",
    name: "Profile Insights",
    subtitle: "8 insights across 3 categories · 3 require input",
    route: "/spaces/profile-insights",
  },
};

export const buildSpaceCard = (id: SpacePrompt): SpaceCardPayload | null =>
  SPACES[id] ?? null;

export const buildReply = (
  intent: Intent,
): { text: string; prompt?: SpacePromptPayload } => {
  if (intent === "profile-insights") {
    return {
      text:
        "Your company profile is reaching a limited set of buyers today. I see three signals worth acting on — **missing certifications** buyers filter on, **incomplete category coverage** for automotive and industrial buyers, and **peer benchmarks** where your profile trails similar suppliers.\n\nWould you like me to create a dedicated space to dive deeper into these insights?",
      prompt: {
        kind: "space-prompt",
        spaceId: "profile-insights",
        label: "Create Space",
      },
    };
  }
  return {
    text:
      "I can help with that. Try asking me about **how your profile reaches buyers** and I'll surface insights and offer to spin up a dedicated space.",
  };
};
