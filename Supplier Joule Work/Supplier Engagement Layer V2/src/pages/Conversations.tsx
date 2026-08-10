import { useEffect, useRef, useState } from "react";
import { AtSign, List, Plus, Send } from "lucide-react";
import { AppSidebar } from "@/components/AppSidebar";
import jouleLogo from "@/assets/joule-logo.png.asset.json";
import { useConversation } from "@/lib/jouleConversation";
import { MessageBubble } from "@/components/conversations/MessageBubble";
import { TypingIndicator } from "@/components/conversations/TypingIndicator";

const Conversations = () => {
  const { messages, status, sendMessage, confirmSpace, reset } = useConversation();
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [status, hasMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || status === "typing") return;
    sendMessage(input);
    setInput("");
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar />

      <div className="relative flex min-w-0 flex-1 flex-col shadow-[inset_8px_0_12px_-8px_rgba(15,23,42,0.08)]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_100%_100%,hsl(var(--primary)/0.10),transparent_60%),radial-gradient(80%_50%_at_0%_100%,hsl(var(--primary)/0.06),transparent_55%)]"
        />

        <header className="relative z-10 flex h-14 items-center gap-3 px-6">
          <button
            className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Conversation list"
          >
            <List className="size-[18px]" />
          </button>
          <span className="flex-1 text-sm font-semibold">
            {hasMessages ? "Conversation" : "New Conversation"}
          </span>
        </header>

        {hasMessages ? (
          <main className="relative z-10 flex min-h-0 flex-1 flex-col">
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6">
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-5">
                <div className="text-center text-xs text-muted-foreground">
                  {new Date(messages[0]?.createdAt ?? Date.now()).toLocaleString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
                {messages.map((m) => (
                  <MessageBubble
                    key={m.id}
                    message={m}
                    onConfirmPrompt={confirmSpace}
                    promptDisabled={status !== "idle"}
                  />
                ))}
                {(status === "typing" || status === "creating") && <TypingIndicator />}
              </div>
            </div>

            <div className="relative z-10 px-6 pb-6">
              <form
                onSubmit={handleSubmit}
                className="mx-auto w-full max-w-3xl rounded-2xl border border-primary/40 bg-card/95 p-3 shadow-[0_8px_30px_-12px_rgba(91,63,228,0.35)] backdrop-blur"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
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
                    disabled={!input.trim() || status === "typing"}
                    aria-label="Send"
                    className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary transition-colors hover:bg-primary/15 disabled:opacity-50"
                  >
                    <Send className="size-4" />
                  </button>
                </div>
              </form>
              <p className="mt-2 text-center text-[11px] text-muted-foreground">
                Joule uses AI, verify results.
              </p>
            </div>
          </main>
        ) : (
          <main className="relative z-10 mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 pb-16">
            <img src={jouleLogo.url} alt="Joule" className="size-16 object-contain" />
            <h1 className="mt-6 text-center text-[34px] font-semibold tracking-tight">
              One more thing before the day wraps up?
            </h1>
            <p className="mt-2 text-center text-base text-muted-foreground">
              Helping you compile resources and edit along the way.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 w-full rounded-2xl border border-primary/40 bg-card/95 p-3 shadow-[0_8px_30px_-12px_rgba(91,63,228,0.35)] backdrop-blur"
            >
              <input
                ref={inputRef}
                type="text"
                autoFocus
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Joule about onboarding, your profile, catalogs, or buyer invitations…"
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
                  disabled={!input.trim()}
                  aria-label="Send"
                  className="grid size-8 place-items-center rounded-lg bg-primary-soft text-primary transition-colors hover:bg-primary/15 disabled:opacity-50"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </form>
          </main>
        )}

        {!hasMessages && (
          <p className="relative z-10 pb-4 text-center text-[11px] text-muted-foreground">
            Joule uses AI, verify results.
          </p>
        )}
      </div>
    </div>
  );
};

export default Conversations;
