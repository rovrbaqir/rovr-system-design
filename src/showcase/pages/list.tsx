import { CalendarDays, FileText, FlaskConical, Pill } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { List, ListItem } from "@/components/ui/list";
import { toast } from "@/components/ui/toast";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="list-links" files={["ui/list", "ui/avatar", "ui/badge"]} title="Linked rows" note="A row with href is a link and shows a chevron. One highlight glides from row to row instead of each row lighting up." className="items-start">
        <List className="w-full max-w-xl">
          <ListItem href="#/list" leading={<Avatar name="Amara Osei" size="sm" />} title="Amara Osei" description="Lipid panel resulted · LDL above range" trailing={<Badge tone="warning">Review</Badge>} />
          <ListItem href="#/list" leading={<Avatar name="Daniel Reyes" size="sm" />} title="Daniel Reyes" description="Refill request · Metformin 500 mg" trailing="12 min" />
          <ListItem href="#/list" leading={<Avatar name="Priya Raman" size="sm" />} title="Priya Raman" description="New message about her annual physical" trailing={<Badge variant="count" tone="info">2</Badge>} />
          <ListItem href="#/list" leading={<Avatar name="Grace Mbeki" size="sm" />} title="Grace Mbeki" description="Intake forms completed" trailing="1 h" />
        </List>
      </Demo>
      <Demo id="list-actions" files={["ui/list", "ui/toast"]} title="Action rows" note="A row with onClick is a button: it takes the highlight and keyboard focus but shows no chevron, because it does not go anywhere." className="items-start">
        <List className="w-full max-w-xl">
          <ListItem leading={<FlaskConical />} title="Order a lab test" description="Lipid panel, HbA1c, metabolic panel" onClick={() => toast.message("Lab order started")} />
          <ListItem leading={<Pill />} title="Write a prescription" description="Sent to the patient's pharmacy" onClick={() => toast.message("Prescription started")} />
          <ListItem leading={<CalendarDays />} title="Book a follow-up" description="Next opening Thursday 10:30" onClick={() => toast.message("Booking started")} />
        </List>
      </Demo>
      <Demo id="list-static" files={["ui/list"]} title="Static rows" note="Without href or onClick a row is plain content. It does not highlight, so nothing suggests it can be pressed." className="items-start">
        <List className="w-full max-w-xl">
          <ListItem leading={<FileText />} title="Visit summary" description="Follow-up with Dr. Okafor" trailing="12 Nov" />
          <ListItem leading={<FileText />} title="Lipid panel report" description="Quest Diagnostics" trailing="12 Nov" />
          <ListItem leading={<FileText />} title="Referral letter" description="Cardiology, Dr. Sam Whitfield" trailing="28 Oct" />
        </List>
      </Demo>
      <Demo id="list-in-card" files={["ui/list", "ui/card", "ui/avatar", "ui/badge"]} title="In a card" note="The usual home for a list: a titled card on a dashboard. Rows can be title only." bare className="items-start">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div>
              <CardTitle>Waiting room</CardTitle>
              <CardDescription>3 patients checked in</CardDescription>
            </div>
          </CardHeader>
          <List className="-mx-3">
            <ListItem href="#/list" leading={<Avatar name="Tomás Lindqvist" size="sm" />} title="Tomás Lindqvist" trailing={<span className="text-data">9 min</span>} />
            <ListItem href="#/list" leading={<Avatar name="Sofia Marchetti" size="sm" />} title="Sofia Marchetti" trailing={<span className="text-data">4 min</span>} />
            <ListItem href="#/list" leading={<Avatar name="Jun Watanabe" size="sm" />} title="Jun Watanabe" trailing={<Badge tone="info">Just arrived</Badge>} />
          </List>
        </Card>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "list",
  title: "List",
  group: "Components",
  summary: "A vertical list of rows with a leading slot, title, description and trailing value. Use it for inboxes, work queues and settings menus, where each row is one thing to open or do.",
  keywords: "rows items inbox queue menu list item navigation",
  Body,
};
