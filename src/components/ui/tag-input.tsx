import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TagInputProps {
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  /** Return an error message to reject a tag, e.g. an invalid ICD-10 code. */
  validate?: (tag: string) => string | null;
  className?: string;
  "aria-label": string;
}

/** Free-text entries as chips: allergies, diagnosis codes, email recipients. Enter or comma adds, Backspace removes. */
export function TagInput({ value, onValueChange, placeholder, validate, className, ...props }: TagInputProps) {
  const [draft, setDraft] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const errorId = React.useId();

  const commit = () => {
    const tag = draft.trim();
    if (!tag) return;
    const problem = value.includes(tag) ? `${tag} is already added.` : (validate?.(tag) ?? null);
    setError(problem);
    if (problem) return;
    onValueChange([...value, tag]);
    setDraft("");
  };

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      <div
        className={cn(
          "flex min-h-control-md w-full flex-wrap items-center gap-1 rounded-md border border-input bg-surface py-1 pr-3 pl-1.5 text-sm",
          "transition-[border-color,box-shadow] duration-(--dur-fast) ease-out hover:border-border-strong",
          "focus-within:border-primary focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_22%,transparent)]",
          error && "border-destructive",
        )}
      >
        {value.map((tag) => (
          <span key={tag} className="flex h-6 items-center gap-1 rounded-sm bg-secondary pr-0.5 pl-2 text-caption font-medium">
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => onValueChange(value.filter((t) => t !== tag))}
              className="grid size-5 cursor-pointer place-items-center rounded-xs text-muted-foreground rovr-focus hover:bg-secondary-hover hover:text-foreground"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          aria-label={props["aria-label"]}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          placeholder={value.length ? "" : placeholder}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              commit();
            } else if (e.key === "Backspace" && !draft && value.length) onValueChange(value.slice(0, -1));
          }}
          onBlur={commit}
          className="h-6 min-w-20 flex-1 bg-transparent pl-1.5 outline-none placeholder:text-muted-foreground"
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-body-sm text-destructive-fg">
          {error}
        </p>
      )}
    </div>
  );
}
