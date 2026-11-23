import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface StepperProps extends React.HTMLAttributes<HTMLOListElement> {
  steps: { label: string; description?: string }[];
  /** Zero-based index of the step in progress. */
  current: number;
}

/** Shows where someone is in a multi-step flow such as intake or booking. */
export function Stepper({ steps, current, className, ...props }: StepperProps) {
  return (
    <ol className={cn("flex w-full items-start", className)} {...props}>
      {steps.map((step, i) => {
        const state = i < current ? "done" : i === current ? "current" : "upcoming";
        return (
          <li key={step.label} aria-current={state === "current" ? "step" : undefined} className="flex flex-1 flex-col gap-2 last:flex-none last:items-end">
            <div className="flex items-center">
              <span
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full border text-caption font-medium text-data",
                  "transition-[background-color,border-color,color] duration-(--dur-slow) ease-out",
                  state === "done" && "border-primary bg-primary text-primary-foreground",
                  state === "current" && "border-primary bg-accent text-accent-foreground",
                  state === "upcoming" && "border-border-strong text-muted-foreground",
                )}
              >
                {state === "done" ? <Check className="size-3.5" aria-label="Completed" /> : i + 1}
              </span>
              {i < steps.length - 1 && (
                <span className="mx-2 h-px flex-1 overflow-hidden bg-border-strong">
                  <span
                    className={cn(
                      "block h-full origin-left bg-primary transition-[scale] duration-(--dur-slower) ease-out",
                      state === "done" ? "scale-x-100" : "scale-x-0",
                    )}
                  />
                </span>
              )}
            </div>
            <div className={cn(i < steps.length - 1 ? "pr-4" : "text-right")}>
              <p className={cn("text-label", state === "upcoming" && "text-muted-foreground")}>{step.label}</p>
              {step.description && <p className="text-caption text-muted-foreground">{step.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
