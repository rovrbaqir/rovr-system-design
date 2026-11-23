import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `risen` floats on the page. `sunken` groups content inside another card. `outline` is the quietest. */
  variant?: "risen" | "sunken" | "outline";
  /** For a card that is one click target. It lifts under the pointer and presses in. */
  interactive?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card({ className, variant = "risen", interactive, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={cn(
        "flex flex-col gap-4 rounded-xl p-card text-card-foreground",
        variant === "risen" && "rovr-risen",
        variant === "sunken" && "rounded-lg bg-surface-sunken",
        variant === "outline" && "border border-border",
        interactive && "rovr-lift cursor-pointer outline-2 outline-offset-0 outline-transparent focus-visible:outline-ring focus-visible:outline-offset-2",
        className,
      )}
      {...props}
    />
  );
});

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex items-start justify-between gap-4", className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-title-md", className)} {...props} />;
}
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-body-sm text-muted-foreground", className)} {...props} />;
}
export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-3", className)} {...props} />;
}
export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mt-auto flex items-center gap-2 pt-1", className)} {...props} />;
}
