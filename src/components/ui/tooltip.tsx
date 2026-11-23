import * as React from "react";
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import { cn } from "@/lib/utils";

/** Wrap the app once. Neighbouring tooltips then open without the hover delay. */
export const TooltipProvider = BaseTooltip.Provider;

export interface TooltipProps extends Omit<React.ComponentProps<typeof BaseTooltip.Root>, "children"> {
  /** Short, non-essential hint. Never the only place a piece of information lives. */
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  children: React.ReactElement<Record<string, unknown>>;
  className?: string;
}

export function Tooltip({ content, side = "top", children, className, ...props }: TooltipProps) {
  return (
    <BaseTooltip.Root {...props}>
      <BaseTooltip.Trigger render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={8} className="z-50">
          <BaseTooltip.Popup
            className={cn(
              "rovr-pop max-w-64 rounded-md bg-surface-inverse/92 px-2.5 py-1.5 text-caption font-medium text-inverse-foreground shadow-overlay backdrop-blur-md",
              className,
            )}
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
