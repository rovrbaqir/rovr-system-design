import * as React from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { CopyButton } from "@/components/ui/copy-button";

export interface PatientHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  mrn: string;
  /** Short facts read at a glance: date of birth and age, sex, plan. */
  facts: { label: string; value: React.ReactNode }[];
  /** Allergies, fall risk and other flags that must stay visible. */
  alerts?: React.ReactNode;
  actions?: React.ReactNode;
}

/** The identity strip at the top of a patient chart. Name, MRN and safety flags never scroll out of a chart view. */
export function PatientHeader({ name, src, mrn, facts, alerts, actions, className, ...props }: PatientHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-x-6 gap-y-4 rounded-xl rovr-risen p-card", className)} {...props}>
      <div className="flex min-w-0 items-center gap-3">
        <Avatar name={name} src={src} size="lg" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate text-title-lg">{name}</p>
          <p className="flex items-center gap-1 text-body-sm text-muted-foreground">
            MRN <span className="font-mono text-foreground">{mrn}</span>
            <CopyButton value={mrn} label="Copy MRN" className="-my-1 size-6" />
          </p>
        </div>
      </div>
      <dl className="flex flex-wrap gap-x-7 gap-y-2">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-0.5">
            <dt className="text-overline text-muted-foreground">{fact.label}</dt>
            <dd className="text-body-sm font-medium text-data">{fact.value}</dd>
          </div>
        ))}
      </dl>
      {alerts && <div className="flex flex-wrap items-center gap-1.5">{alerts}</div>}
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
