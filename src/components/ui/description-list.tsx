import * as React from "react";
import { cn } from "@/lib/utils";

/** Label and value pairs: demographics, order details, claim fields. */
export function DescriptionList({ className, columns = 1, ...props }: React.HTMLAttributes<HTMLDListElement> & { columns?: 1 | 2 | 3 }) {
  return <dl className={cn("grid gap-x-8 gap-y-4", { 1: "", 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" }[columns], className)} {...props} />;
}

export function DescriptionItem({ label, className, children, ...props }: React.HTMLAttributes<HTMLDivElement> & { label: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1", className)} {...props}>
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="text-body font-medium">{children}</dd>
    </div>
  );
}
