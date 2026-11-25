import * as React from "react";
import { Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Input } from "./input";
import { MaskedInput, formatMask } from "./masked-input";
import { PasswordInput } from "./password-input";

export interface EditableFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** The saved value. */
  value: string;
  /**
   * Called with the new value on Save or Enter. Return a promise to show a
   * pending state while it runs. If it rejects, the field stays open and
   * shows the error's message.
   */
  onSave: (value: string) => void | Promise<void>;
  /** What the value is, e.g. "Phone number". Names the input and the edit button for screen readers. */
  label: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  /** The kind of input shown while editing. A password is shown as dots when not editing. */
  type?: "text" | "password" | "email" | "tel";
  /** A digit pattern such as `"(___) ___-____"`. The value is edited in a MaskedInput and shown masked. */
  mask?: string;
  /** Shows the value without the edit button. */
  disabled?: boolean;
  /** Shown in place of an empty value. */
  emptyText?: string;
  /** Shown when `onSave` rejects with something that has no message. */
  errorText?: string;
  /** Starts in edit mode, without taking focus. */
  defaultEditing?: boolean;
}

const sizes = {
  sm: { row: "min-h-control-sm", text: "text-body-sm" },
  md: { row: "min-h-control-md", text: "text-body" },
  lg: { row: "min-h-control-lg", text: "text-body-lg" },
} as const;

/**
 * A value shown as text that can be edited in place. Use it on profile and
 * settings pages where each value saves on its own, not inside a form with
 * one submit button.
 */
export const EditableField = React.forwardRef<HTMLDivElement, EditableFieldProps>(function EditableField(
  {
    value,
    onSave,
    label,
    placeholder,
    size = "md",
    type = "text",
    mask,
    disabled = false,
    emptyText = "Not set",
    errorText = "We couldn't save this. Try again.",
    defaultEditing = false,
    className,
    ...props
  },
  ref,
) {
  const [editing, setEditing] = React.useState(defaultEditing);
  const [draft, setDraft] = React.useState(() => (mask ? formatMask(mask, value) : value));
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const errorId = React.useId();

  const input = React.useRef<HTMLInputElement>(null);
  const trigger = React.useRef<HTMLElement>(null);
  const alive = React.useRef(true);
  React.useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // Focus follows the swap: into the input when editing starts, back to the edit button when it ends.
  const wasEditing = React.useRef(defaultEditing);
  React.useLayoutEffect(() => {
    if (editing === wasEditing.current) return;
    wasEditing.current = editing;
    if (editing) {
      input.current?.focus();
      input.current?.select();
    } else {
      trigger.current?.focus();
    }
  }, [editing]);

  const shown = mask ? formatMask(mask, value) : value;

  const open = () => {
    setDraft(shown);
    setError(null);
    setEditing(true);
  };
  const cancel = () => {
    if (pending) return;
    setError(null);
    setEditing(false);
  };
  const save = async () => {
    if (pending) return;
    if (draft === shown) {
      setEditing(false);
      return;
    }
    setError(null);
    try {
      const result = onSave(draft);
      if (result instanceof Promise) {
        setPending(true);
        await result;
      }
      if (alive.current) setEditing(false);
    } catch (reason) {
      if (!alive.current) return;
      setError(reason instanceof Error && reason.message ? reason.message : errorText);
      // Back to the input, so the value can be corrected straight away.
      input.current?.focus();
    } finally {
      if (alive.current) setPending(false);
    }
  };

  if (!editing) {
    const display = shown === "" ? emptyText : type === "password" ? "•".repeat(8) : shown;
    return (
      <div ref={ref} className={cn("flex min-w-0 items-center gap-1", sizes[size].row, sizes[size].text, className)} {...props}>
        <span className={cn("min-w-0 truncate", (mask || type === "tel") && "text-data", (shown === "" || disabled) && "text-muted-foreground")}>
          {type === "password" && shown !== "" ? (
            <>
              <span aria-hidden>{display}</span>
              <span className="sr-only">Hidden</span>
            </>
          ) : (
            display
          )}
        </span>
        {!disabled && (
          <Button ref={trigger} variant="ghost" size="icon-sm" aria-label={`Edit ${label}`} onClick={open} className="shrink-0 text-muted-foreground hover:text-foreground">
            <Pencil aria-hidden />
          </Button>
        )}
      </div>
    );
  }

  const field = {
    ref: input,
    size,
    value: draft,
    placeholder,
    readOnly: pending,
    "aria-label": label,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? errorId : undefined,
    className: "min-w-40 flex-1",
  } as const;

  return (
    <div ref={ref} className={cn("flex min-w-0 flex-col gap-1.5", className)} {...props}>
      <form
        noValidate
        aria-busy={pending || undefined}
        className="flex min-w-0 flex-wrap items-center gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void save();
        }}
        onKeyDown={(event) => {
          if (event.key !== "Escape") return;
          // Kept from a dialog or sheet around the field, which would close on Escape.
          event.stopPropagation();
          cancel();
        }}
      >
        {mask ? (
          <MaskedInput {...field} mask={mask} type={type === "tel" ? "tel" : "text"} onValueChange={(masked) => setDraft(masked)} />
        ) : type === "password" ? (
          <PasswordInput {...field} autoComplete="new-password" onChange={(event) => setDraft(event.target.value)} />
        ) : (
          <Input {...field} type={type} onChange={(event) => setDraft(event.target.value)} />
        )}
        <div className="flex shrink-0 items-center gap-2">
          <Button type="submit" size={size} loading={pending}>
            Save
          </Button>
          <Button type="button" variant="ghost" size={size} disabled={pending} onClick={cancel}>
            Cancel
          </Button>
        </div>
      </form>
      {error && (
        <p id={errorId} role="alert" className="text-body-sm text-destructive-fg">
          {error}
        </p>
      )}
    </div>
  );
});
