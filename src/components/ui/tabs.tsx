import * as React from "react";
import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { cn } from "@/lib/utils";

type Variant = "underline" | "boxed" | "segmented";
const VariantContext = React.createContext<Variant>("underline");

export function Tabs({ className, ...props }: React.ComponentProps<typeof BaseTabs.Root>) {
  return <BaseTabs.Root className={cn("flex flex-col gap-4", className)} {...props} />;
}

/**
 * `underline` for page sections, `boxed` for the equal-width stage tabs used
 * on rovrstack.ai, `segmented` for switching views inside a toolbar.
 * In every variant one indicator element glides between tabs.
 */
export function TabsList({
  className,
  variant = "underline",
  children,
  ...props
}: React.ComponentProps<typeof BaseTabs.List> & { variant?: Variant }) {
  return (
    <VariantContext.Provider value={variant}>
      <BaseTabs.List
        className={cn(
          "relative z-0 flex items-center",
          variant === "underline" && "gap-6 border-b border-border",
          variant === "boxed" && "border-y border-l border-border",
          variant === "segmented" && "w-fit gap-0.5 rounded-full bg-secondary p-0.5",
          className,
        )}
        {...props}
      >
        {children}
        <BaseTabs.Indicator
          className={cn(
            "absolute left-0 w-(--active-tab-width) translate-x-(--active-tab-left)",
            "transition-[translate,width] duration-(--dur-slow) ease-out",
            variant === "underline" && "-bottom-px h-0.5 bg-primary",
            variant === "boxed" && "-top-px h-0.5 bg-primary",
            variant === "segmented" && "top-1/2 -z-10 h-(--active-tab-height) -translate-y-1/2 rounded-full bg-surface shadow-raised ease-spring",
          )}
        />
      </BaseTabs.List>
    </VariantContext.Provider>
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof BaseTabs.Tab>) {
  const variant = React.useContext(VariantContext);
  return (
    <BaseTabs.Tab
      className={cn(
        "inline-flex cursor-pointer items-center gap-2 text-sm font-medium whitespace-nowrap text-muted-foreground select-none",
        "rovr-focus hover:text-foreground data-[active]:text-foreground",
        "data-[disabled]:cursor-not-allowed data-[disabled]:opacity-45 [&_svg]:size-4",
        variant === "underline" && "h-10 rounded-xs",
        variant === "boxed" && "h-12 flex-1 border-r border-border px-4 data-[active]:bg-accent/60",
        variant === "segmented" && "h-control-sm rounded-full px-3.5",
        className,
      )}
      {...props}
    />
  );
}

export function TabsContent({ className, ...props }: React.ComponentProps<typeof BaseTabs.Panel>) {
  return (
    <BaseTabs.Panel
      className={cn(
        "outline-none transition-[opacity,translate] duration-(--dur-slow) ease-out",
        "data-[starting-style]:translate-y-(--motion-shift) data-[starting-style]:opacity-0",
        className,
      )}
      {...props}
    />
  );
}
