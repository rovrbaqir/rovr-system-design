import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface ClampTextProps extends React.HTMLAttributes<HTMLDivElement> {
  /** How many lines to show before the rest is cut off. */
  lines?: number;
  /** Start with the whole text shown. */
  defaultExpanded?: boolean;
  /** Called when the person shows or hides the rest of the text. */
  onExpandedChange?: (expanded: boolean) => void;
  /** The button's words while the text is cut off. */
  moreLabel?: string;
  /** The button's words while the whole text is shown. */
  lessLabel?: string;
}

/**
 * Cuts long text to a few lines and offers "Show more". The button only
 * appears when the text really is cut off, and is re-checked when the width
 * changes. For notes, messages and descriptions inside cards and table rows.
 */
export const ClampText = React.forwardRef<HTMLDivElement, ClampTextProps>(function ClampText(
  { lines = 3, defaultExpanded = false, onExpandedChange, moreLabel = "Show more", lessLabel = "Show less", className, children, ...props },
  ref,
) {
  const id = React.useId();
  const content = React.useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const [clamped, setClamped] = React.useState(false);

  React.useLayoutEffect(() => {
    const el = content.current;
    if (!el || expanded) return;
    // One pixel of slack: fractional line heights round differently for the two measures.
    const measure = () => setClamped(el.scrollHeight > el.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children, lines, expanded]);

  return (
    <div ref={ref} className={cn("flex min-w-0 flex-col items-start gap-1", className)} {...props}>
      <div
        ref={content}
        id={id}
        className="w-full min-w-0 [overflow-wrap:anywhere]"
        style={expanded ? undefined : { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: lines, overflow: "hidden" }}
      >
        {children}
      </div>
      {(expanded || clamped) && (
        <Button
          variant="ghost"
          size="sm"
          aria-expanded={expanded}
          aria-controls={id}
          // Lines the label up with the text above it.
          className="-ml-3.5 text-accent-foreground"
          onClick={(event) => {
            // Often sits in a row or card that is itself a click target.
            event.stopPropagation();
            setExpanded(!expanded);
            onExpandedChange?.(!expanded);
          }}
        >
          {expanded ? lessLabel : moreLabel}
        </Button>
      )}
    </div>
  );
});
