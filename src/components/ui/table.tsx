import * as React from "react";
import { cn } from "@/lib/utils";

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full caption-bottom border-collapse text-sm", className)} {...props} />
    </div>
  );
}
export function TableHeader(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead {...props} />;
}
export function TableBody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}
export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        "border-b border-border transition-colors duration-(--dur-instant) last:border-0",
        "[tbody>&]:hover:bg-secondary data-[selected]:bg-accent",
        className,
      )}
      {...props}
    />
  );
}
export function TableHead({ className, numeric, ...props }: React.ThHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return (
    <th
      scope="col"
      className={cn("h-9 px-3 text-left text-overline whitespace-nowrap text-muted-foreground first:pl-0 last:pr-0", numeric && "text-right", className)}
      {...props}
    />
  );
}
export function TableCell({ className, numeric, ...props }: React.TdHTMLAttributes<HTMLTableCellElement> & { numeric?: boolean }) {
  return <td className={cn("h-row px-3 first:pl-0 last:pr-0", numeric && "text-right text-data", className)} {...props} />;
}
