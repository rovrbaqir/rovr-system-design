import * as React from "react";
import { Button as BaseButton } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { BlurSwap } from "./blur-swap";
import { Spinner } from "./spinner";

export const buttonVariants = cva(
  [
    "relative inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap select-none",
    "rovr-focus rovr-press cursor-pointer",
    "disabled:cursor-not-allowed data-[disabled]:cursor-not-allowed disabled:opacity-45 data-[disabled]:opacity-45",
    "[&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        /** The lit brand fill. One per view. */
        primary: "rovr-lit bg-primary text-primary-foreground hover:bg-primary-hover hover:brightness-105 data-[disabled]:shadow-none data-[disabled]:[background-image:none]",
        /** White pill with a brand outline, as on the app's secondary actions. */
        outline: "bg-surface text-accent-foreground shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--brand)_45%,transparent)] hover:bg-accent dark:bg-accent",
        /** Quiet neutral fill for actions that sit next to a primary. */
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary-hover",
        ghost: "bg-transparent text-foreground hover:bg-secondary",
        /** Tinted, outlined red: says "careful" without shouting. */
        destructive: "bg-destructive/10 text-destructive-fg shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--destructive)_55%,transparent)] hover:bg-destructive/16",
        /** Solid red, for the confirming button inside a destructive dialog only. */
        "destructive-solid": "bg-destructive-solid text-on-solid hover:brightness-110",
        link: "h-auto! rounded-xs px-0! font-medium text-accent-foreground underline decoration-transparent underline-offset-4 hover:decoration-current",
      },
      size: {
        sm: "h-control-sm px-3.5 text-[0.8125rem]",
        md: "h-control-md px-5 text-sm",
        lg: "h-control-lg px-7 text-[0.9375rem]",
        "icon-sm": "size-control-sm",
        "icon-md": "size-control-md",
        "icon-lg": "size-control-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps extends React.ComponentProps<typeof BaseButton>, VariantProps<typeof buttonVariants> {
  /** Swaps the label for a spinner and blocks further presses. Width does not change. */
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(function Button(
  { className, variant, size, loading = false, disabled, children, onPointerMove, ...props },
  ref,
) {
  const lit = (variant ?? "primary") === "primary";
  return (
    <BaseButton
      ref={ref}
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      focusableWhenDisabled={loading}
      // The light under a primary button follows the pointer.
      onPointerMove={
        lit
          ? (event) => {
              const el = event.currentTarget as HTMLElement;
              const rect = el.getBoundingClientRect();
              el.style.setProperty("--lx", `${((event.clientX - rect.left) / rect.width) * 100}%`);
              onPointerMove?.(event);
            }
          : onPointerMove
      }
      className={cn(buttonVariants({ variant, size }), loading && "opacity-100! data-[disabled]:opacity-100!", className)}
      {...props}
    >
      {/* The label keeps its space while loading so the button never changes width. */}
      <span className={cn("inline-flex items-center gap-2 transition-opacity duration-(--dur-fast)", loading && "opacity-0")}>{children}</span>
      <span className="pointer-events-none absolute inset-0 grid place-items-center">
        <BlurSwap swapKey={loading ? "loading" : "idle"}>{loading ? <Spinner label="Loading" /> : null}</BlurSwap>
      </span>
    </BaseButton>
  );
});
