import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

/** Shared field chrome, reused by Input, Textarea and the Select trigger. */
export const fieldChrome = [
  "w-full rounded-md border border-input bg-surface text-foreground text-sm max-md:text-base",
  "placeholder:text-muted-foreground",
  "outline-none transition-[border-color,box-shadow,background-color] duration-(--dur-fast) ease-out",
  "hover:border-border-strong",
  "focus-visible:border-primary focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_22%,transparent)]",
  "aria-invalid:border-destructive aria-invalid:focus-visible:shadow-[0_0_0_3px_color-mix(in_oklab,var(--destructive)_22%,transparent)]",
  "data-[invalid]:border-destructive",
  "disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-muted-foreground disabled:hover:border-input",
].join(" ");

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
  /** Icon or short text shown inside the field, before the value. */
  leading?: React.ReactNode;
  /** Icon, unit or button shown inside the field, after the value. */
  trailing?: React.ReactNode;
}

const heights = { sm: "h-control-sm", md: "h-control-md", lg: "h-control-lg" } as const;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, size = "md", leading, trailing, ...props },
  ref,
) {
  const input = (
    <input
      ref={ref}
      className={cn(fieldChrome, heights[size], "px-3", leading && "pl-9", trailing && "pr-9", !leading && !trailing && className)}
      {...props}
    />
  );
  if (!leading && !trailing) return input;
  return (
    <div className={cn("relative w-full", className)}>
      {leading && (
        <span className="pointer-events-none absolute inset-y-0 left-3 grid place-items-center text-muted-foreground [&_svg]:size-4">
          {leading}
        </span>
      )}
      {input}
      {trailing && (
        <span className="absolute inset-y-0 right-3 grid place-items-center text-muted-foreground text-caption [&_svg]:size-4">
          {trailing}
        </span>
      )}
    </div>
  );
});

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, rows = 4, ...props }, ref) {
    return <textarea ref={ref} rows={rows} className={cn(fieldChrome, "min-h-20 resize-y px-3 py-2.5 leading-relaxed", className)} {...props} />;
  },
);

export interface SearchInputProps extends Omit<InputProps, "leading" | "trailing" | "onChange" | "value" | "type"> {
  value: string;
  onValueChange: (value: string) => void;
  /** Shows a spinner in place of the search icon while results load. */
  loading?: boolean;
}

/** A search field with a clear button that appears once there is text, and a loading state. */
export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput({ value, onValueChange, loading, className, size = "md", ...props }, ref) {
  return (
    <div className={cn("relative w-full", className)}>
      <span className="pointer-events-none absolute inset-y-0 left-3 grid w-4 place-items-center text-muted-foreground">
        <Search className={cn("absolute size-4 transition-[opacity,scale] duration-(--dur-fast) ease-out", loading && "scale-75 opacity-0")} aria-hidden />
        <Spinner label="" className={cn("absolute size-4 transition-[opacity,scale] duration-(--dur-fast) ease-out", !loading && "scale-75 opacity-0")} />
      </span>
      <input
        ref={ref}
        type="text"
        role="searchbox"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Escape" && value) {
            e.stopPropagation();
            onValueChange("");
          }
        }}
        className={cn(fieldChrome, heights[size], "rounded-full pr-9 pl-9")}
        {...props}
      />
      <button
        type="button"
        aria-label="Clear search"
        tabIndex={value ? 0 : -1}
        onClick={() => onValueChange("")}
        className={cn(
          "absolute top-1/2 right-2 grid size-6 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-muted-foreground rovr-focus hover:bg-secondary-hover hover:text-foreground",
          !value && "pointer-events-none scale-75 opacity-0",
        )}
      >
        <X className="size-3.5" />
      </button>
    </div>
  );
});
