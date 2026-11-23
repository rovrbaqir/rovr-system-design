import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

export function Slider({ className, ...props }: React.ComponentProps<typeof BaseSlider.Root>) {
  const count = Array.isArray(props.value ?? props.defaultValue) ? ((props.value ?? props.defaultValue) as number[]).length : 1;
  return (
    <BaseSlider.Root className={cn("w-full data-[disabled]:opacity-45", className)} {...props}>
      <BaseSlider.Control className="flex h-6 w-full cursor-pointer touch-none items-center select-none data-[disabled]:cursor-not-allowed">
        <BaseSlider.Track className="h-1.5 w-full rounded-full bg-secondary-hover">
          <BaseSlider.Indicator className="rounded-full bg-primary" />
          {Array.from({ length: count }, (_, i) => (
            <BaseSlider.Thumb
              key={i}
              index={i}
              className={cn(
                "size-5 rounded-full border-2 border-primary bg-surface shadow-raised",
                "transition-[scale,box-shadow] duration-(--dur-fast) ease-out",
                "hover:scale-110 data-[dragging]:scale-110",
                "has-[:focus-visible]:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand)_28%,transparent)]",
                "data-[dragging]:shadow-[0_0_0_6px_color-mix(in_oklab,var(--brand)_18%,transparent)]",
              )}
            />
          ))}
        </BaseSlider.Track>
      </BaseSlider.Control>
    </BaseSlider.Root>
  );
}
