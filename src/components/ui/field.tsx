import * as React from "react";
import { Field as BaseField } from "@base-ui/react/field";
import { cn } from "@/lib/utils";

/**
 * Field groups a label, a control, help text and an error message, and wires
 * up the ids and aria attributes between them.
 */
export function Field({ className, ...props }: React.ComponentProps<typeof BaseField.Root>) {
  return <BaseField.Root className={cn("flex w-full flex-col gap-1.5", className)} {...props} />;
}

export function FieldLabel({
  className,
  optional,
  children,
  ...props
}: React.ComponentProps<typeof BaseField.Label> & { optional?: boolean }) {
  return (
    <BaseField.Label className={cn("text-label text-foreground data-[disabled]:text-muted-foreground", className)} {...props}>
      {children}
      {optional && <span className="ml-1.5 font-normal text-muted-foreground">Optional</span>}
    </BaseField.Label>
  );
}

export function FieldDescription({ className, ...props }: React.ComponentProps<typeof BaseField.Description>) {
  return <BaseField.Description className={cn("text-body-sm text-muted-foreground", className)} {...props} />;
}

/** Says what is wrong and how to fix it. Slides in under the control. */
export function FieldError({ className, ...props }: React.ComponentProps<typeof BaseField.Error>) {
  return (
    <BaseField.Error
      className={cn(
        "text-body-sm text-destructive-fg transition-[opacity,translate] duration-(--dur-base) ease-out",
        "data-[starting-style]:-translate-y-(--motion-shift) data-[starting-style]:opacity-0",
        "data-[ending-style]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

/** Plain label for controls used outside a Field. */
export const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(function Label(
  { className, ...props },
  ref,
) {
  return <label ref={ref} className={cn("text-label text-foreground", className)} {...props} />;
});
