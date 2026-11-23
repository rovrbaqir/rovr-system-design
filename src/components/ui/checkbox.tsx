import * as React from "react";
import { Checkbox as BaseCheckbox } from "@base-ui/react/checkbox";
import { cn } from "@/lib/utils";

export const Checkbox = React.forwardRef<HTMLElement, React.ComponentProps<typeof BaseCheckbox.Root>>(function Checkbox(
  { className, ...props },
  ref,
) {
  return (
    <BaseCheckbox.Root
      ref={ref}
      className={cn(
        "peer grid size-5 shrink-0 place-items-center rounded-xs border border-input bg-surface text-primary-foreground",
        "rovr-focus cursor-pointer hover:border-border-strong active:scale-95",
        "data-[checked]:border-primary data-[checked]:bg-primary data-[indeterminate]:border-primary data-[indeterminate]:bg-primary",
        "data-[invalid]:border-destructive data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45",
        className,
      )}
      {...props}
    >
      <BaseCheckbox.Indicator
        keepMounted
        className="group/ind grid place-items-center"
        render={(indicatorProps, state) => (
          <span {...indicatorProps}>
            <svg viewBox="0 0 16 16" fill="none" className="size-3.5" aria-hidden>
              {state.indeterminate ? (
                <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path
                  d="M3.5 8.4l2.9 2.9 6.1-6.6"
                  pathLength={1}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={1}
                  style={{
                    strokeDashoffset: state.checked ? 0 : 1,
                    transition: `stroke-dashoffset var(--dur-base) var(--ease-out) ${state.checked ? "60ms" : "0ms"}`,
                  }}
                />
              )}
            </svg>
          </span>
        )}
      />
    </BaseCheckbox.Root>
  );
});
