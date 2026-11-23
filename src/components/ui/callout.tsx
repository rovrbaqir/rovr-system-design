import * as React from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const tones = {
  info: { icon: "text-primary", Icon: Info },
  success: { icon: "text-success-fg", Icon: CircleCheck },
  warning: { icon: "text-warning-fg", Icon: TriangleAlert },
  danger: { icon: "text-destructive-fg", Icon: CircleAlert },
} as const;

export interface CalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  tone?: keyof typeof tones;
  title?: React.ReactNode;
  /** Buttons or links that resolve the message. Sits at the end of the row. */
  action?: React.ReactNode;
}

/** An inline message that stays on the page. Use role="alert" when it appears in response to an action. */
export function Callout({ tone = "info", title, action, className, children, ...props }: CalloutProps) {
  const { icon, Icon } = tones[tone];
  return (
    <div className={cn("flex flex-wrap items-start gap-x-3 gap-y-2 rounded-lg rovr-risen px-4 py-3.5", className)} {...props}>
      <Icon className={cn("mt-0.5 size-4.5 shrink-0", icon)} aria-hidden />
      <div className="flex min-w-48 flex-1 flex-col gap-0.5">
        {title && <p className="text-title-sm">{title}</p>}
        {children && <div className="text-body-sm text-muted-foreground">{children}</div>}
      </div>
      {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
    </div>
  );
}
