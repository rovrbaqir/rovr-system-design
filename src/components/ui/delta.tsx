import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const deltaVariants = cva("inline-flex w-fit shrink-0 items-center gap-0.5 font-medium whitespace-nowrap text-data", {
  variants: {
    size: {
      sm: "text-caption [&_svg]:size-3",
      md: "text-body-sm [&_svg]:size-3.5",
      lg: "text-body [&_svg]:size-4",
    },
    tone: {
      neutral: "text-muted-foreground",
      success: "text-success-fg",
      danger: "text-destructive-fg",
    },
  },
  defaultVariants: { size: "md", tone: "neutral" },
});

const icons = { up: ArrowUpRight, down: ArrowDownRight, flat: Minus } as const;
const words = { up: "Up", down: "Down", flat: "No change" } as const;

export interface DeltaProps extends Omit<React.HTMLAttributes<HTMLSpanElement>, "title">, Pick<VariantProps<typeof deltaVariants>, "size"> {
  /** Which way the figure moved. The arrow and the screen-reader text come from this. */
  direction: "up" | "down" | "flat";
  /** The amount of change: "4.2%". */
  children: React.ReactNode;
  /**
   * The direction that is good news. A change that way reads as success, the other way as destructive.
   * Leave it out for a neutral change, so a cost going down and a rate going up never read the same by accident.
   */
  good?: "up" | "down";
  /** What the change is measured against: "vs prior period". Shown on hover and read by screen readers. */
  title?: string;
}

/** A change next to a figure: an arrow and the amount. The direction is said in words to screen readers, so it never rests on the arrow or the colour. */
export const Delta = React.forwardRef<HTMLSpanElement, DeltaProps>(function Delta({ direction, good, title, size, className, children, ...props }, ref) {
  const Icon = icons[direction];
  const tone = !good || direction === "flat" ? "neutral" : good === direction ? "success" : "danger";
  return (
    <span ref={ref} title={title} data-direction={direction} className={cn(deltaVariants({ size, tone }), className)} {...props}>
      <Icon aria-hidden />
      <span className="sr-only">{words[direction]} </span>
      {children}
      {title && <span className="sr-only">, {title}</span>}
    </span>
  );
});
