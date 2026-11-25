import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const gradientTextVariants = cva(
  [
    // The gradient is the element's background, cut to the glyphs. The text is
    // real text: it selects, copies and is read as usual.
    "bg-clip-text text-transparent box-decoration-clone",
    "bg-(image:--gradient-text) selection:text-foreground",
    // Forced colours: drop the gradient and let the system paint the text.
    "forced-colors:bg-none forced-colors:text-[CanvasText]",
  ],
  {
    variants: {
      variant: {
        /** Navy opening to brand blue. In dark mode both stops are lightened so the text stays readable on black. */
        brand: [
          "[--gt-from:var(--navy)] [--gt-to:var(--brand)]",
          "dark:[--gt-from:color-mix(in_oklab,var(--brand)_28%,white)] dark:[--gt-to:color-mix(in_oklab,var(--brand)_82%,white)]",
        ],
        /** The Pulse gradient, blue to violet. For Pulse (AI) features only. */
        pulse: [
          "[--gt-from:var(--pulse-from)] [--gt-to:var(--pulse-to)]",
          "dark:[--gt-from:color-mix(in_oklab,var(--pulse-from)_70%,white)] dark:[--gt-to:color-mix(in_oklab,var(--pulse-to)_70%,white)]",
        ],
      },
      shimmer: {
        false: "[--gradient-text:linear-gradient(100deg,var(--gt-from)_0%,var(--gt-to)_65%)]",
        // The band starts and ends on the same colour and repeats, so the loop has no seam.
        true: [
          "[--gradient-text:linear-gradient(100deg,var(--gt-from)_0%,var(--gt-to)_35%,color-mix(in_oklab,var(--gt-to)_45%,white)_50%,var(--gt-to)_65%,var(--gt-from)_100%)]",
          "bg-[length:200%_100%] bg-repeat-x animate-shimmer [animation-duration:5s] [animation-timing-function:linear]",
          "motion-reduce:animate-none motion-reduce:bg-[length:100%_100%]",
        ],
      },
    },
    defaultVariants: { variant: "brand", shimmer: false },
  },
);

const elements = { h1: "text-display-lg", h2: "text-display-md", h3: "text-display-sm", h4: "text-title-lg", p: "", span: "" } as const;

export interface GradientTextProps extends React.HTMLAttributes<HTMLElement>, Omit<VariantProps<typeof gradientTextVariants>, "shimmer"> {
  /** The element to render. Headings get the matching display size; `p` and `span` keep the size around them. */
  as?: keyof typeof elements;
  /** `brand` is navy opening to brand blue. `pulse` is the Pulse gradient, for Pulse features only. */
  variant?: "brand" | "pulse";
  /** A slow band of light crosses the text, for a line that is still being worked on. It stops under reduced motion. */
  shimmer?: boolean;
}

/**
 * Text filled with the brand gradient. For one headline or a few words of
 * emphasis on a page, never for body text, labels or clinical values.
 */
export const GradientText = React.forwardRef<HTMLElement, GradientTextProps>(function GradientText(
  { as = "h2", variant = "brand", shimmer = false, className, ...props },
  ref,
) {
  const Tag = as as React.ElementType;
  return <Tag ref={ref} className={cn(elements[as], gradientTextVariants({ variant, shimmer }), className)} {...props} />;
});
