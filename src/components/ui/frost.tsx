import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A clear glass pane. Place it on the aurora surface or on imagery; on a
 * plain surface it has nothing to refract, so use a tone step there instead.
 */
export const Frost = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(function Frost({ className, ...props }, ref) {
  return <div ref={ref} className={cn("rounded-lg rovr-frost p-4 text-white", className)} {...props} />;
});

/** A round glass disc for one number or one icon, as on a watch face. */
export function FrostDisc({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("grid size-16 shrink-0 place-items-center rounded-full rovr-frost text-white", className)} {...props} />;
}
