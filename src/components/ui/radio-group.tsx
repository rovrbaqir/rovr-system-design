import * as React from "react";
import { Radio as BaseRadio } from "@base-ui/react/radio";
import { RadioGroup as BaseRadioGroup } from "@base-ui/react/radio-group";
import { cn } from "@/lib/utils";

export function RadioGroup({ className, ...props }: React.ComponentProps<typeof BaseRadioGroup>) {
  return <BaseRadioGroup className={cn("flex flex-col gap-3", className)} {...props} />;
}

export const Radio = React.forwardRef<HTMLElement, React.ComponentProps<typeof BaseRadio.Root>>(function Radio(
  { className, ...props },
  ref,
) {
  return (
    <BaseRadio.Root
      ref={ref}
      className={cn(
        "grid size-5 shrink-0 place-items-center rounded-full border border-input bg-surface",
        "rovr-focus rovr-press cursor-pointer hover:border-border-strong",
        "data-[checked]:border-primary data-[checked]:bg-primary",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45",
        className,
      )}
      {...props}
    >
      <BaseRadio.Indicator
        keepMounted
        className={cn(
          "size-2 rounded-full bg-primary-foreground transition-[scale,opacity] duration-(--dur-snappy) ease-snappy",
          "data-[unchecked]:scale-50 data-[unchecked]:opacity-0",
        )}
      />
    </BaseRadio.Root>
  );
});
