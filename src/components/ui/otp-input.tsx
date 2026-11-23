import * as React from "react";
import { OTPField } from "@base-ui/react/otp-field";
import { cn } from "@/lib/utils";

export interface OtpInputProps extends Omit<React.ComponentProps<typeof OTPField.Root>, "children" | "length"> {
  length?: number;
  invalid?: boolean;
}

/** One-time code entry for sign-in and kiosk check-in. Paste fills every box. */
export function OtpInput({ length = 6, invalid, className, ...props }: OtpInputProps) {
  return (
    <OTPField.Root length={length} className={cn("flex gap-2", className)} {...props}>
      {Array.from({ length }, (_, i) => (
        <OTPField.Input
          key={i}
          aria-invalid={invalid}
          aria-label={`Digit ${i + 1} of ${length}`}
          className={cn(
            "h-12 w-10 rounded-md border border-input bg-surface text-center text-lg font-medium text-data outline-none",
            "transition-[border-color,box-shadow] duration-(--dur-fast) ease-out",
            "focus:border-primary focus:shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_22%,transparent)]",
            "aria-invalid:border-destructive disabled:bg-surface-sunken",
            i === length / 2 && "ml-2",
          )}
        />
      ))}
    </OTPField.Root>
  );
}
