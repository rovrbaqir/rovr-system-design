import { CalendarDays, FileText, FlaskConical, MessageSquare, Pill, Stethoscope } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="timeline-basic" files={["ui/timeline"]} title="Basic" note="Newest first. Without an icon an entry gets a dot, and the body text is optional." className="items-start">
        <Timeline className="w-full max-w-xl">
          <TimelineItem time="12 Nov" title="Follow-up visit with Dr. Okafor">
            Atorvastatin increased from 10 mg to 20 mg daily.
          </TimelineItem>
          <TimelineItem time="28 Oct" title="Prescription refilled">
            Atorvastatin 10 mg, 30 tablets.
          </TimelineItem>
          <TimelineItem time="14 Oct" title="Intake forms completed" />
          <TimelineItem time="2 Oct" title="Registered as a new patient" />
        </Timeline>
      </Demo>
      <Demo id="timeline-icons-and-emphasis" files={["ui/timeline"]} title="Icons and emphasis" note="An icon names the kind of event. Emphasis marks the one entry to notice first, such as the latest or an abnormal result. Use it once per timeline." className="items-start">
        <Timeline className="w-full max-w-xl">
          <TimelineItem time="Today, 10:42" title="Lipid panel resulted" icon={<FlaskConical />} emphasis>
            LDL 131 mg/dL, above the reference range. Flagged for review.
          </TimelineItem>
          <TimelineItem time="12 Nov" title="Follow-up visit with Dr. Okafor" icon={<Stethoscope />}>
            Atorvastatin increased from 10 mg to 20 mg daily.
          </TimelineItem>
          <TimelineItem time="28 Oct" title="Prescription refilled" icon={<Pill />}>
            Atorvastatin 10 mg, 30 tablets.
          </TimelineItem>
        </Timeline>
      </Demo>
      <Demo id="timeline-rich-content" files={["ui/timeline", "ui/badge", "ui/button"]} title="Rich entries" note="The title and the body take any content, so an entry can carry a status or the action that follows from it." className="items-start">
        <Timeline className="w-full max-w-xl">
          <TimelineItem
            time="Today, 09:15"
            icon={<MessageSquare />}
            emphasis
            title={
              <span className="flex flex-wrap items-center gap-2">
                Message from Amara Osei <Badge tone="info">Unread</Badge>
              </span>
            }
          >
            <p>Asks whether to keep taking atorvastatin in the morning after the dose change.</p>
            <Button variant="outline" size="sm" className="mt-2">
              Reply
            </Button>
          </TimelineItem>
          <TimelineItem time="20 Nov" icon={<FileText />} title="Claim CL-48213 paid">
            Aetna paid <span className="text-data">$215.00</span> of <span className="text-data">$240.00</span>. Patient owes <span className="text-data">$25.00</span>.
          </TimelineItem>
          <TimelineItem time="12 Nov" icon={<CalendarDays />} title="Visit completed">
            Follow-up, 30 minutes, Room 2. Note signed by Dr. Ngozi Okafor.
          </TimelineItem>
        </Timeline>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "timeline",
  title: "Timeline",
  group: "Components",
  summary: "Dated entries joined by a line. Use it for encounter history, order tracking and activity logs, where the order of events is the point.",
  keywords: "history activity log feed events audit trail encounters",
  Body,
};
