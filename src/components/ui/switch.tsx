import * as React from "react";
import { Switch as BaseSwitch } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";

export const Switch = React.forwardRef<HTMLElement, React.ComponentProps<typeof BaseSwitch.Root>>(function Switch(
  { className, ...props },
  ref,
) {
  return (
    <BaseSwitch.Root
      ref={ref}
      className={cn(
        "group relative inline-flex h-6 w-10.5 shrink-0 items-center rounded-full bg-border-strong p-0.5",
        "rovr-focus cursor-pointer data-[checked]:bg-primary",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45",
        className,
      )}
      {...props}
    >
      {/* The thumb stretches while pressed, then springs to the other side. */}
      <BaseSwitch.Thumb
        className={cn(
          "block h-5 w-5 rounded-full bg-white shadow-raised",
          "transition-[translate,width,margin] duration-(--dur-snappy) ease-snappy",
          "group-active:w-6 group-data-[disabled]:group-active:w-5",
          "data-[checked]:translate-x-4.5 data-[checked]:group-active:-ml-1 group-data-[disabled]:group-active:ml-0",
        )}
      />
    </BaseSwitch.Root>
  );
});
