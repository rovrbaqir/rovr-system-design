import * as React from "react";
import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const step = "grid w-9 cursor-pointer place-items-center text-muted-foreground transition-colors duration-(--dur-instant) hover:bg-secondary hover:text-foreground data-[disabled]:cursor-not-allowed data-[disabled]:opacity-40 [&_svg]:size-3.5";

/** A number with stepper buttons: quantity, dose count, days supply. */
export function NumberField({ className, ...props }: React.ComponentProps<typeof BaseNumberField.Root>) {
  return (
    <BaseNumberField.Root className={cn("w-32", className)} {...props}>
      <BaseNumberField.Group className="flex h-control-md overflow-hidden rounded-md border border-input bg-surface transition-[border-color,box-shadow] duration-(--dur-fast) ease-out focus-within:border-primary focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_22%,transparent)]">
        <BaseNumberField.Decrement aria-label="Decrease" className={cn(step, "border-r border-border")}>
          <Minus />
        </BaseNumberField.Decrement>
        <BaseNumberField.Input className="w-full min-w-0 bg-transparent text-center text-sm text-data outline-none" />
        <BaseNumberField.Increment aria-label="Increase" className={cn(step, "border-l border-border")}>
          <Plus />
        </BaseNumberField.Increment>
      </BaseNumberField.Group>
    </BaseNumberField.Root>
  );
}
