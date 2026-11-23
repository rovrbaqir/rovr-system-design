import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export interface MedicationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  /** Strength and form: "20 mg tablet". */
  strength: string;
  /** How to take it, in plain words. */
  directions: string;
  refillsLeft?: number;
  /** Next refill or renewal date, already formatted. */
  nextRefill?: string;
  status?: "active" | "refill-due" | "expired";
  actions?: React.ReactNode;
}

const statusBadge = {
  active: { tone: "success", label: "Active" },
  "refill-due": { tone: "warning", label: "Refill due" },
  expired: { tone: "danger", label: "Expired" },
} as const;

export function MedicationCard({ name, strength, directions, refillsLeft, nextRefill, status = "active", actions, className, ...props }: MedicationCardProps) {
  const badge = statusBadge[status];
  return (
    <Card className={cn("flex-row flex-wrap items-center gap-4", className)} {...props}>
      <div className="flex min-w-44 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <p className="text-title-sm">{name}</p>
          <span className="text-body-sm text-muted-foreground text-data">{strength}</span>
          <Badge tone={badge.tone}>{badge.label}</Badge>
        </div>
        <p className="text-body-sm text-muted-foreground">{directions}</p>
        {(refillsLeft !== undefined || nextRefill) && (
          <p className="text-caption text-subtle-foreground text-data">
            {refillsLeft !== undefined && `${refillsLeft} refill${refillsLeft === 1 ? "" : "s"} left`}
            {refillsLeft !== undefined && nextRefill && " · "}
            {nextRefill && `Next refill ${nextRefill}`}
          </p>
        )}
      </div>
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </Card>
  );
}
