import jouleLogo from "@/assets/joule-logo.png.asset.json";

export const TypingIndicator = () => (
  <div className="flex gap-3">
    <img
      src={jouleLogo.url}
      alt="Joule"
      className="size-7 shrink-0 rounded-full object-contain"
    />
    <div className="flex items-center gap-1 rounded-2xl bg-muted px-3 py-2.5">
      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
    </div>
  </div>
);
