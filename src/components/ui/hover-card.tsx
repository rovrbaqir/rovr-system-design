import * as React from "react";
import { PreviewCard as BasePreviewCard } from "@base-ui/react/preview-card";
import { cn } from "@/lib/utils";

/** A preview shown on hover or focus of a link: a clinician, a patient, a code. Never the only way to reach the information. */
export const HoverCard = BasePreviewCard.Root;
export const HoverCardTrigger = BasePreviewCard.Trigger;

export function HoverCardContent({ className, side = "bottom", align = "start", ...props }: React.ComponentProps<typeof BasePreviewCard.Popup> & Pick<React.ComponentProps<typeof BasePreviewCard.Positioner>, "side" | "align">) {
  return (
    <BasePreviewCard.Portal>
      <BasePreviewCard.Positioner side={side} align={align} sideOffset={8} className="z-50">
        <BasePreviewCard.Popup className={cn("rovr-pop w-72 rounded-xl rovr-glass p-4 text-sm outline-none", className)} {...props} />
      </BasePreviewCard.Positioner>
    </BasePreviewCard.Portal>
  );
}
