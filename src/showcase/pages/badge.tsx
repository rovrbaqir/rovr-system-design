import { Check, Clock, FlaskConical, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const queue = [
  { name: "Amara Osei", reason: "Lipid panel review", status: "In call", tone: "info", live: true },
  { name: "Daniel Mensah", reason: "Blood pressure check", status: "Checked in", tone: "success", live: false },
  { name: "Priya Raman", reason: "Annual physical", status: "Running late", tone: "warning", live: false },
  { name: "Tomás Rivera", reason: "Medication review", status: "No-show", tone: "danger", live: false },
] as const;

function Body() {
  return (
    <>
      <Demo id="badge-tag" files={["ui/badge"]} title="Tag" note="The default: a small pill washed with its tone. Five tones cover every status in both apps. Colour is always paired with words.">
        <Badge>Scheduled</Badge>
        <Badge tone="success">Confirmed</Badge>
        <Badge tone="info">In review</Badge>
        <Badge tone="warning">Awaiting results</Badge>
        <Badge tone="danger">Overdue</Badge>
      </Demo>
      <Demo id="badge-with-icon" files={["ui/badge"]} title="Tag with an icon" note="An icon before the label is sized for you.">
        <Badge tone="success">
          <Check /> Final
        </Badge>
        <Badge tone="warning">
          <Clock /> Fasting
        </Badge>
        <Badge tone="danger">
          <TriangleAlert /> Out of range
        </Badge>
        <Badge>
          <FlaskConical /> Lab
        </Badge>
      </Demo>
      <Demo id="badge-status" files={["ui/badge"]} title="Status" note="A dot and plain text with no container, for table cells and dense lists. live pulses the dot for something happening now.">
        <Badge variant="status">Scheduled</Badge>
        <Badge variant="status" tone="success">
          Checked in
        </Badge>
        <Badge variant="status" tone="info" live>
          In call
        </Badge>
        <Badge variant="status" tone="warning">
          Running late
        </Badge>
        <Badge variant="status" tone="danger">
          No-show
        </Badge>
      </Demo>
      <Demo id="badge-count" files={["ui/badge"]} title="Count" note="A solid count for unread or waiting items. Cap large numbers yourself, for example 99+.">
        <Badge variant="count">4</Badge>
        <Badge variant="count" tone="info">
          3
        </Badge>
        <Badge variant="count" tone="success">
          8
        </Badge>
        <Badge variant="count" tone="warning">
          27
        </Badge>
        <Badge variant="count" tone="danger">
          99+
        </Badge>
        <span className="flex items-center gap-2 text-label">
          Messages
          <Badge variant="count" tone="info" aria-label="3 unread">
            3
          </Badge>
        </span>
      </Demo>
      <Demo id="badge-in-a-list" files={["ui/badge"]} title="In a list" note="Status badges down a column read as one aligned edge of dots." className="flex-col items-stretch gap-0">
        {queue.map((row) => (
          <div key={row.name} className="flex items-center gap-4 border-b border-border py-3 last:border-b-0">
            <div className="min-w-0 flex-1">
              <p className="text-title-sm">{row.name}</p>
              <p className="text-body-sm text-muted-foreground">{row.reason}</p>
            </div>
            <Badge variant="status" tone={row.tone} live={row.live} className="w-28">
              {row.status}
            </Badge>
          </div>
        ))}
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "badge",
  title: "Badge",
  group: "Components",
  summary: "Five tones in three forms: a tag, a status dot with text, and a count. It replaces the two dozen one-off status badges in the apps today.",
  keywords: "tag status pill count label chip dot indicator",
  Body,
};
