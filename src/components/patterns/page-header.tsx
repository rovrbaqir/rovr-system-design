import * as React from "react";
import { cn } from "@/lib/utils";

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Breadcrumbs or a back link, shown above the title. */
  navigation?: React.ReactNode;
  /** Page-level actions. One primary button at most. */
  actions?: React.ReactNode;
}

/** The single header every screen uses, replacing the per-module headers. */
export function PageHeader({ title, description, navigation, actions, className, ...props }: PageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-3", className)} {...props}>
      {navigation}
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h1 className="text-display-md compact:text-display-sm">{title}</h1>
          {description && <p className="max-w-[60ch] text-body text-muted-foreground">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
      </div>
    </header>
  );
}
