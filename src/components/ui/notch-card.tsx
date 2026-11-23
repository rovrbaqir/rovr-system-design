import { ArrowUpRight } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

export interface RoundActionProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /**
   * What the action does. Shown as the button's words when `children` is
   * absent and `iconOnly` is not set; always used as the accessible name.
   */
  label: string;
  /** Hides the words. Only for places where the card around it already says what it does. */
  iconOnly?: boolean;
  tone?: "primary" | "ink" | "surface";
  size?: "md" | "lg";
  icon?: React.ReactNode;
}

/**
 * The action that sits in a card's notch: a pill that says what it does,
 * ending in an arrow that leans toward where it goes on hover.
 */
export const RoundAction = React.forwardRef<HTMLAnchorElement, RoundActionProps>(function RoundAction(
  { label, iconOnly = false, tone = "primary", size = "lg", icon, className, ...props },
  ref,
) {
  return (
    <a
      ref={ref}
      aria-label={iconOnly ? label : undefined}
      className={cn(
        "group/round inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap rovr-focus rovr-press",
        "transition-[background-color,color] duration-(--dur-base)",
        size === "lg" ? "h-12 text-sm [&_svg]:size-4.5" : "h-10 text-[0.8125rem] [&_svg]:size-4",
        iconOnly ? (size === "lg" ? "w-12" : "w-10") : size === "lg" ? "pr-4 pl-5" : "pr-3 pl-4",
        tone === "primary" && "bg-primary text-primary-foreground hover:bg-primary-hover",
        tone === "ink" && "bg-foreground text-background hover:bg-primary hover:text-primary-foreground",
        tone === "surface" && "bg-surface text-foreground shadow-raised hover:bg-primary hover:text-primary-foreground",
        className,
      )}
      {...props}
    >
      {!iconOnly && label}
      <span className="transition-transform duration-(--dur-gentle) ease-(--spring-gentle) group-hover/round:translate-x-0.5 group-hover/round:-translate-y-0.5">
        {icon ?? <ArrowUpRight aria-hidden />}
      </span>
    </a>
  );
});

export interface NotchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Sits in a notch cut from the bottom-right corner; the notch grows to fit
   * it. Use a `RoundAction`. The notch is drawn in the colour behind the
   * card: the page canvas by default. Inside another surface, set
   * `--notch-bg` to that surface.
   */
  action?: React.ReactNode;
  /** `surface` is the default white. `aurora` is the rich brand surface. `tint` is a quiet brand wash. */
  tone?: "surface" | "sunken" | "aurora" | "tint" | "ink";
}

const notchCorner =
  "pointer-events-none absolute size-[calc(1.25rem+1px)] bg-[radial-gradient(circle_at_0_0,transparent_1.25rem,var(--notch-bg,var(--background))_calc(1.25rem+0.5px))]";

/**
 * The system's signature form: a generously curved card with one corner cut
 * away in a concave curve, and the card's single action resting in the cut.
 * Leave room for the notch at the end of the content (bottom padding, or
 * right padding on the last line).
 */
export const NotchCard = React.forwardRef<HTMLDivElement, NotchCardProps>(function NotchCard(
  { action, tone = "surface", className, children, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={cn(
        "relative flex min-w-0 flex-col rounded-xl p-card",
        tone === "surface" && "bg-surface",
        tone === "sunken" && "bg-surface-sunken",
        tone === "aurora" && "rovr-aurora",
        tone === "tint" && "bg-accent",
        tone === "ink" && "bg-surface-inverse text-inverse-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {action && (
        // One pixel past the card edge on both sides, so no sliver of the card shows at fractional positions.
        <div className="absolute -right-px -bottom-px flex rounded-tl-[1.75rem] bg-(--notch-bg,var(--background)) pt-2 pr-px pb-px pl-2">
          <span aria-hidden className={cn(notchCorner, "right-0 bottom-[calc(100%-1px)]")} />
          <span aria-hidden className={cn(notchCorner, "right-[calc(100%-1px)] bottom-0")} />
          {action}
        </div>
      )}
    </div>
  );
});
