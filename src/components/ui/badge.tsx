import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tones = {
  neutral: "[--tone:var(--subtle-foreground)] [--tone-fg:var(--foreground)]",
  info: "[--tone:var(--brand)] [--tone-fg:var(--info-fg)]",
  success: "[--tone:var(--success)] [--tone-fg:var(--success-fg)]",
  warning: "[--tone:var(--warning)] [--tone-fg:var(--warning-fg)]",
  danger: "[--tone:var(--destructive)] [--tone-fg:var(--destructive-fg)]",
} as const;

export const badgeVariants = cva("inline-flex w-fit shrink-0 items-center whitespace-nowrap [&_svg]:size-3", {
  variants: {
    tone: tones,
    variant: {
      /**
       * A small pill: a soft tone wash with a half-pixel hairline, as the app tints
       * its status surfaces. Round, like every other control. The default.
       */
      tag: "h-6 gap-1 rounded-full bg-[color-mix(in_oklab,var(--tone)_9%,transparent)] px-2.5 text-[0.75rem] leading-none font-medium text-(--tone-fg) shadow-[inset_0_0_0_0.5px_color-mix(in_oklab,var(--tone)_32%,transparent)]",
      /** A dot and plain text, no container. For table cells and dense lists. */
      status: "gap-2 text-[0.8125rem] font-medium text-foreground",
      /** A count, e.g. unread messages. */
      count: "h-[1.125rem] min-w-[1.125rem] justify-center rounded-full bg-(--tone) px-1 text-[0.6875rem] leading-none font-semibold text-white tabular-nums",
    },
  },
  compoundVariants: [
    { tone: "neutral", variant: "tag", className: "bg-secondary shadow-[inset_0_0_0_0.5px_var(--border-strong)]" },
    { tone: "neutral", variant: "count", className: "bg-foreground text-background" },
  ],
  defaultVariants: { tone: "neutral", variant: "tag" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  /** Pulses the status dot for something happening now, such as "In call". */
  live?: boolean;
}

export function Badge({ className, tone, variant, live, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, variant }), className)} {...props}>
      {variant === "status" && (
        <span className="relative grid size-2 shrink-0 place-items-center">
          {live && <span className="absolute size-2 animate-ping rounded-full bg-(--tone) opacity-50 motion-reduce:hidden" />}
          <span className="size-1.5 rounded-full bg-(--tone)" />
        </span>
      )}
      {children}
    </span>
  );
}
