import * as React from "react";
import { ArrowUp, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export interface ChatMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `self` is the signed-in person; `other` is a clinician, staff member or Pulse. */
  from: "self" | "other";
  author?: string;
  time?: string;
}

/** One message in a secure thread or a Pulse conversation. */
export function ChatMessage({ from, author, time, className, children, ...props }: ChatMessageProps) {
  return (
    <div className={cn("flex flex-col gap-1", from === "self" ? "items-end" : "items-start", className)} {...props}>
      {(author || time) && (
        <p className="px-1 text-caption text-muted-foreground">
          {author}
          {author && time && " · "}
          {time}
        </p>
      )}
      <div
        className={cn(
          "max-w-[min(34rem,85%)] rounded-[1.125rem] px-3.5 py-2.5 text-body leading-snug",
          from === "self" ? "rounded-br-xs bg-primary text-primary-foreground" : "rounded-bl-xs rovr-risen",
        )}
      >
        {children}
      </div>
    </div>
  );
}

/** Three dots while the other side is writing. */
export function ChatTyping({ label = "Pulse is writing" }: { label?: string }) {
  return (
    <div role="status" aria-label={label} className="flex w-fit gap-1 rounded-[1.125rem] rounded-bl-xs rovr-risen px-3.5 py-3.5">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-1.5 animate-typing rounded-full bg-subtle-foreground opacity-35 motion-reduce:animate-none motion-reduce:opacity-70" style={{ animationDelay: `${i * 160}ms` }} />
      ))}
    </div>
  );
}

export interface ChatComposerProps {
  onSend: (text: string) => void;
  onAttach?: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/** The message field. Enter sends, Shift+Enter adds a line. The send button lights when there is something to send. */
export function ChatComposer({ onSend, onAttach, placeholder = "Write a message", disabled, className }: ChatComposerProps) {
  const [text, setText] = React.useState("");
  const send = () => {
    const value = text.trim();
    if (!value) return;
    onSend(value);
    setText("");
  };
  return (
    <div className={cn("flex items-end gap-1.5 rounded-[1.5rem] rovr-risen p-1.5 transition-shadow duration-(--dur-base) focus-within:shadow-risen-hover", className)}>
      {onAttach && (
        <Button variant="ghost" size="icon-md" aria-label="Attach a file" onClick={onAttach} disabled={disabled} className="text-muted-foreground">
          <Paperclip />
        </Button>
      )}
      <textarea
        rows={1}
        value={text}
        disabled={disabled}
        aria-label={placeholder}
        placeholder={placeholder}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }}
        className={cn("max-h-40 min-h-10 flex-1 resize-none bg-transparent py-2.5 text-body outline-none [field-sizing:content] placeholder:text-muted-foreground", !onAttach && "pl-3")}
      />
      <Button size="icon-md" aria-label="Send message" disabled={disabled || !text.trim()} onClick={send}>
        <ArrowUp strokeWidth={2.25} />
      </Button>
    </div>
  );
}
