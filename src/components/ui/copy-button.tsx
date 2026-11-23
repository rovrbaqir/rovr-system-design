import * as React from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

export interface CopyButtonProps extends Omit<ButtonProps, "children" | "value"> {
  /** The text placed on the clipboard. */
  value: string;
  /** Accessible name, e.g. "Copy MRN". */
  label: string;
}

/** Copies a value and confirms in place: the icon swaps to a check for two seconds. */
export function CopyButton({ value, label, className, variant = "ghost", size = "icon-sm", ...props }: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <Button
      variant={variant}
      size={size}
      aria-label={copied ? "Copied" : label}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
      className={cn("text-muted-foreground", className)}
      {...props}
    >
      <span className="relative grid size-4 place-items-center">
        <Copy className={cn("absolute transition-[opacity,scale] duration-(--dur-base) ease-out", copied && "scale-75 opacity-0")} />
        <Check className={cn("absolute text-success-fg transition-[opacity,scale] duration-(--dur-base) ease-out", !copied && "scale-75 opacity-0")} />
      </span>
    </Button>
  );
}
