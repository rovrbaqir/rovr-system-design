import * as React from "react";
import { motion } from "motion/react";
import { springSnappy } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface SegmentedControlProps<T extends string> {
  value: T;
  onValueChange: (value: T) => void;
  options: { value: T; label: React.ReactNode }[];
  size?: "sm" | "md";
  "aria-label": string;
  className?: string;
}

/** A compact single choice between two to five views, such as Day / Week / Month. */
export function SegmentedControl<T extends string>({
  value,
  onValueChange,
  options,
  size = "md",
  className,
  ...props
}: SegmentedControlProps<T>) {
  const id = React.useId();
  return (
    <div role="radiogroup" className={cn("inline-flex w-fit gap-0.5 rounded-full bg-secondary p-0.5", className)} {...props}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onValueChange(option.value)}
            onKeyDown={(event) => {
              const i = options.findIndex((o) => o.value === value);
              const next = event.key === "ArrowRight" ? i + 1 : event.key === "ArrowLeft" ? i - 1 : null;
              if (next === null) return;
              event.preventDefault();
              const target = options[(next + options.length) % options.length];
              onValueChange(target.value);
              const buttons = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>("[role=radio]");
              buttons?.[(next + options.length) % options.length]?.focus();
            }}
            className={cn(
              "relative cursor-pointer rounded-full font-medium whitespace-nowrap select-none rovr-focus",
              size === "sm" ? "h-7 px-3 text-[0.8125rem]" : "h-control-sm px-3.5 text-sm",
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {selected && (
              <motion.span
                layoutId={`${id}-pill`}
                transition={springSnappy}
                className="absolute inset-0 rounded-full bg-surface shadow-raised"
              />
            )}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
