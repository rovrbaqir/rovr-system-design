import * as React from "react";
import { MapPin, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

const statusTone: Record<string, { tone: BadgeProps["tone"]; label: string; live?: boolean }> = {
  confirmed: { tone: "success", label: "Confirmed" },
  pending: { tone: "warning", label: "Awaiting confirmation" },
  "in-progress": { tone: "info", label: "In progress", live: true },
  cancelled: { tone: "danger", label: "Cancelled" },
  completed: { tone: "neutral", label: "Completed" },
};

export interface AppointmentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Month abbreviation and day number, already formatted for the viewer's locale. */
  month: string;
  day: string;
  time: string;
  title: string;
  person: { name: string; role?: string; src?: string };
  mode: "video" | "in-person";
  location?: string;
  status: keyof typeof statusTone;
  actions?: React.ReactNode;
}

export function AppointmentCard({ month, day, time, title, person, mode, location, status, actions, className, ...props }: AppointmentCardProps) {
  const s = statusTone[status];
  const ModeIcon = mode === "video" ? Video : MapPin;
  return (
    <Card className={cn("flex-row flex-wrap items-center gap-4", className)} {...props}>
      <div className="flex w-13 shrink-0 flex-col items-center gap-0.5 rounded-lg border border-border py-2">
        <span className="text-overline text-muted-foreground">{month}</span>
        <span className="text-xl leading-none font-medium tracking-tight text-data">{day}</span>
      </div>
      <div className="flex min-w-44 flex-1 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
          <p className="truncate text-title-sm">{title}</p>
          <Badge tone={s.tone} variant={s.live ? "status" : "tag"} live={s.live}>
            {s.label}
          </Badge>
        </div>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-body-sm text-muted-foreground">
          <span className="text-data">{time}</span>
          <span className="inline-flex items-center gap-1.5">
            <ModeIcon className="size-3.5" aria-hidden />
            {mode === "video" ? "Video visit" : location}
          </span>
        </p>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-body-sm">
          <Avatar name={person.name} src={person.src} size="xs" />
          <span>{person.name}</span>
          {person.role && <span className="text-muted-foreground">{person.role}</span>}
        </p>
      </div>
      {actions && <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>}
    </Card>
  );
}
