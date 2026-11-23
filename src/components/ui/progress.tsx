import * as React from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cn } from "@/lib/utils";

const tones = { primary: "bg-primary", success: "bg-success", warning: "bg-warning", danger: "bg-destructive" } as const;

export interface ProgressProps extends React.ComponentProps<typeof BaseProgress.Root> {
  tone?: keyof typeof tones;
  size?: "sm" | "md";
}

/** Pass `value={null}` while the amount of work is unknown. */
export function Progress({ className, tone = "primary", size = "md", ...props }: ProgressProps) {
  return (
    <BaseProgress.Root className={cn("w-full", className)} {...props}>
      <BaseProgress.Track className={cn("w-full overflow-hidden rounded-full bg-secondary-hover", size === "sm" ? "h-1" : "h-2")}>
        <BaseProgress.Indicator
          className={cn(
            "h-full rounded-full transition-[width] duration-(--dur-slower) ease-out",
            "data-[indeterminate]:w-2/5! data-[indeterminate]:animate-indeterminate",
            tones[tone],
          )}
        />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}

export interface ProgressRingProps extends React.SVGAttributes<SVGSVGElement> {
  /** 0 to 100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  tone?: keyof typeof ringTones;
  label: string;
}

const ringTones = { primary: "text-primary", success: "text-success-fg", warning: "text-warning-fg", danger: "text-destructive-fg" } as const;

export function ProgressRing({ value, size = 56, strokeWidth = 5, tone = "primary", label, className, children, ...props }: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <span className={cn("relative inline-grid place-items-center", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        className={cn("-rotate-90", ringTones[tone])}
        {...props}
      >
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" strokeWidth={strokeWidth} className="stroke-secondary-hover" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray={100}
          strokeDashoffset={100 - clamped}
          style={{ transition: "stroke-dashoffset var(--dur-slower) var(--ease-out)" }}
        />
      </svg>
      <span className="absolute text-caption font-medium text-data">{children}</span>
    </span>
  );
}
