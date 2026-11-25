import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  /** Accessible name. Pass an empty string when a parent already announces the loading state. */
  label?: string;
}

/** Indeterminate progress for a short wait. Prefer Skeleton when content is loading. */
export function Spinner({ className, label = "Loading", ...props }: SpinnerProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      role={label ? "status" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={cn("size-4 animate-spin-smooth", className)}
      {...props}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" opacity="0.2" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export interface TypingDotsProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Accessible name. Pass an empty string when visible text next to the dots already says who is typing. */
  label?: string;
}

/** Three dots that rise one after the other, for "is typing" and "thinking". The dots stay still under reduced motion. */
export function TypingDots({ className, label = "Typing", ...props }: TypingDotsProps) {
  return (
    <span
      role={label ? "status" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={cn("inline-flex h-4 items-center gap-1 text-muted-foreground", className)}
      {...props}
    >
      {[0, 160, 320].map((delay) => (
        <span
          key={delay}
          aria-hidden
          style={{ animationDelay: `${delay}ms` }}
          className="size-1.5 animate-typing rounded-full bg-current opacity-35 motion-reduce:animate-none motion-reduce:opacity-70 forced-colors:bg-[CanvasText]"
        />
      ))}
    </span>
  );
}
