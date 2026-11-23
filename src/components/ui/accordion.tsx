import * as React from "react";
import { Accordion as BaseAccordion } from "@base-ui/react/accordion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function Accordion({ className, ...props }: React.ComponentProps<typeof BaseAccordion.Root>) {
  return <BaseAccordion.Root className={cn("flex w-full flex-col", className)} {...props} />;
}

export function AccordionItem({ className, ...props }: React.ComponentProps<typeof BaseAccordion.Item>) {
  return <BaseAccordion.Item className={cn("border-b border-border", className)} {...props} />;
}

export function AccordionTrigger({ className, children, ...props }: React.ComponentProps<typeof BaseAccordion.Trigger>) {
  return (
    <BaseAccordion.Header>
      <BaseAccordion.Trigger
        className={cn(
          "group flex w-full cursor-pointer items-center justify-between gap-4 rounded-xs py-4 text-left text-title-sm rovr-focus",
          "hover:text-accent-foreground",
          className,
        )}
        {...props}
      >
        {children}
        <Plus className="size-4 shrink-0 text-muted-foreground transition-[rotate] duration-(--dur-snappy) ease-snappy group-data-[panel-open]:rotate-45" />
      </BaseAccordion.Trigger>
    </BaseAccordion.Header>
  );
}

export function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof BaseAccordion.Panel>) {
  return (
    <BaseAccordion.Panel
      className={cn(
        "h-(--accordion-panel-height) overflow-hidden text-body text-muted-foreground",
        "transition-[height,opacity] duration-(--dur-expand) ease-panel",
        "data-[starting-style]:h-0 data-[starting-style]:opacity-0 data-[ending-style]:h-0 data-[ending-style]:opacity-0",
      )}
      {...props}
    >
      <div className={cn("max-w-[68ch] pb-5", className)}>{children}</div>
    </BaseAccordion.Panel>
  );
}
