import * as React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: { label: string; href?: string }[];
}

export function Breadcrumbs({ items, className, ...props }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5 text-body-sm text-muted-foreground">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-1.5">
              {item.href && !last ? (
                <a href={item.href} className={cn("rounded-xs rovr-focus hover:text-foreground")}>
                  {item.label}
                </a>
              ) : (
                <span aria-current={last ? "page" : undefined} className={cn(last && "font-medium text-foreground")}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight className="size-3.5 text-subtle-foreground" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
