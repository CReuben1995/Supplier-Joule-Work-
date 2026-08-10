import { Copy, ThumbsUp, ThumbsDown, RotateCw, ListChecks, Lightbulb, MoreHorizontal } from "lucide-react";
import type { ChatMessage, SpacePromptPayload } from "@/lib/jouleConversation";
import { SpaceCreatedCard } from "@/components/conversations/SpaceCreatedCard";

const renderText = (text: string) => {
  const lines = text.split("\n");
  return lines.map((line, li) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <p key={li} className={li > 0 ? "mt-2" : undefined}>
        {parts.map((part, i) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            return (
              <strong key={i} className="font-semibold text-foreground">
                {part.slice(2, -2)}
              </strong>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </p>
    );
  });
};

type Props = {
  message: ChatMessage;
  onConfirmPrompt?: (prompt: SpacePromptPayload) => void;
  promptDisabled?: boolean;
};

export const MessageBubble = ({ message, onConfirmPrompt, promptDisabled }: Props) => {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-2xl rounded-tr-sm bg-[#D6E1F0] px-4 py-2.5 text-sm text-foreground shadow-sm">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="min-w-0 flex-1 space-y-3">
        <div className="text-sm leading-relaxed text-foreground">
          {renderText(message.text)}
        </div>
        {message.prompt && onConfirmPrompt && (
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onConfirmPrompt(message.prompt!)}
              disabled={promptDisabled}
              className="inline-flex items-center rounded-lg border-2 border-primary bg-transparent px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 disabled:opacity-50"
            >
              {message.prompt.label}
            </button>
            <button
              disabled={promptDisabled}
              className="inline-flex items-center rounded-lg border-2 border-primary/30 bg-transparent px-5 py-2.5 text-sm font-semibold text-primary/70 transition-colors hover:bg-primary/5 disabled:opacity-50"
            >
              Not now
            </button>
          </div>
        )}
        {message.card?.kind === "space-created" && (
          <SpaceCreatedCard card={message.card} />
        )}
        {!message.prompt && (
          <div className="flex items-center gap-1 pt-1 text-muted-foreground">
            <button aria-label="Copy" className="grid size-8 place-items-center rounded-md hover:bg-muted hover:text-foreground">
              <Copy className="size-4" />
            </button>
            <button aria-label="Good response" className="grid size-8 place-items-center rounded-md hover:bg-muted hover:text-foreground">
              <ThumbsUp className="size-4" />
            </button>
            <button aria-label="Bad response" className="grid size-8 place-items-center rounded-md hover:bg-muted hover:text-foreground">
              <ThumbsDown className="size-4" />
            </button>
            <button aria-label="Regenerate" className="grid size-8 place-items-center rounded-md hover:bg-muted hover:text-foreground">
              <RotateCw className="size-4" />
            </button>
            <button aria-label="Details" className="grid size-8 place-items-center rounded-md hover:bg-muted hover:text-foreground">
              <ListChecks className="size-4" />
            </button>
            <button aria-label="Suggestions" className="grid size-8 place-items-center rounded-md hover:bg-muted hover:text-foreground">
              <Lightbulb className="size-4" />
            </button>
            <button className="ml-1 inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm hover:bg-muted hover:text-foreground">
              Sources
              <span className="grid size-5 place-items-center rounded-full bg-primary-soft text-[11px] font-semibold text-primary">3</span>
            </button>
            <button aria-label="More" className="grid size-8 place-items-center rounded-md hover:bg-muted hover:text-foreground">
              <MoreHorizontal className="size-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
