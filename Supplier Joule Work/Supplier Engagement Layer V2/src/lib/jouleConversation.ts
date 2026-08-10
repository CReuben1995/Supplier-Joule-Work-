import { useCallback, useEffect, useState } from "react";
import { detectIntent, buildReply, buildSpaceCard, type SpacePrompt } from "@/lib/jouleIntent";

export type SpaceCardPayload = {
  kind: "space-created";
  spaceId: string;
  name: string;
  subtitle: string;
  route: string;
};

export type SpacePromptPayload = {
  kind: "space-prompt";
  spaceId: string;
  label: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  card?: SpaceCardPayload;
  prompt?: SpacePromptPayload;
  createdAt: number;
};

const STORAGE_KEY = "joule.conversation";

const read = (): ChatMessage[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ChatMessage[]) : [];
  } catch {
    return [];
  }
};

const write = (messages: ChatMessage[]) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
};

const newId = () => `m_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

export const useConversation = () => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => read());
  const [status, setStatus] = useState<"idle" | "typing" | "creating">("idle");

  useEffect(() => {
    write(messages);
  }, [messages]);

  const sendMessage = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = {
      id: newId(),
      role: "user",
      text: trimmed,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setStatus("typing");

    window.setTimeout(() => {
      const intent = detectIntent(trimmed);
      const reply = buildReply(intent);
      const assistantMsg: ChatMessage = {
        id: newId(),
        role: "assistant",
        text: reply.text,
        prompt: reply.prompt,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStatus("idle");
    }, 2500);
  }, []);

  const confirmSpace = useCallback((prompt: SpacePromptPayload) => {
    // Consume the prompt so the CTA can only fire once.
    setMessages((prev) =>
      prev.map((m) => (m.prompt?.spaceId === prompt.spaceId ? { ...m, prompt: undefined } : m)),
    );
    const userMsg: ChatMessage = {
      id: newId(),
      role: "user",
      text: prompt.label,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setStatus("creating");

    window.setTimeout(() => {
      const card = buildSpaceCard(prompt.spaceId as SpacePrompt);
      if (!card) {
        setStatus("idle");
        return;
      }
      const assistantMsg: ChatMessage = {
        id: newId(),
        role: "assistant",
        text: `Done — I've created the **${card.name}** space. Open it below to dive deeper.`,
        card,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
      setStatus("idle");
    }, 1600);
  }, []);

  const reset = useCallback(() => {
    setMessages([]);
    setStatus("idle");
  }, []);

  return { messages, status, sendMessage, confirmSpace, reset };
};
