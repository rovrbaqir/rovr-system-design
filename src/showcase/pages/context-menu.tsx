import { CalendarClock, Copy, FileText, MessageSquare, Trash2, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DescriptionItem, DescriptionList } from "@/components/ui/description-list";
import { toast } from "@/components/ui/toast";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const appointments = [
  { time: "09:00", name: "Amara Osei", reason: "Lipid panel review" },
  { time: "09:30", name: "Daniel Mensah", reason: "Blood pressure check" },
  { time: "10:30", name: "Priya Raman", reason: "Annual physical" },
];

function Body() {
  return (
    <>
      <Demo id="context-menu-basic" files={["ui/context-menu"]} title="On an area" note="Right-click inside the box, or long-press on a touch screen. The menu opens at the pointer.">
        <ContextMenu>
          <ContextMenuTrigger className="grid h-32 w-full place-items-center rounded-lg border border-dashed border-border-strong text-body-sm text-muted-foreground outline-none">
            Right-click here
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <FileText /> Open report
            </ContextMenuItem>
            <ContextMenuItem>
              <Copy /> Copy link
            </ContextMenuItem>
            <ContextMenuItem disabled>
              <Users /> Share with care team
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Demo>
      <Demo id="context-menu-details" files={["ui/context-menu", "ui/description-list", "ui/badge"]} title="On a record" note="A whole panel can be the trigger. Everything in the menu must also be reachable another way, because many people never right-click." className="items-start">
        <ContextMenu>
          <ContextMenuTrigger className="w-full rounded-lg outline-none">
            <DescriptionList columns={3} className="w-full">
              <DescriptionItem label="Ordering clinician">Dr. Ngozi Okafor</DescriptionItem>
              <DescriptionItem label="Collected">12 Nov 2026, 08:14</DescriptionItem>
              <DescriptionItem label="Specimen">Serum, fasting</DescriptionItem>
              <DescriptionItem label="Lab">Quest Diagnostics</DescriptionItem>
              <DescriptionItem label="Order">
                <span className="font-mono text-[0.875rem]">LB-2041-7731</span>
              </DescriptionItem>
              <DescriptionItem label="Status">
                <Badge tone="success">Final</Badge>
              </DescriptionItem>
            </DescriptionList>
          </ContextMenuTrigger>
          <ContextMenuContent>
            <ContextMenuItem>
              <FileText /> Open report
            </ContextMenuItem>
            <ContextMenuItem>
              <Users /> Share with care team
            </ContextMenuItem>
            <ContextMenuItem>
              <MessageSquare /> Message patient
            </ContextMenuItem>
          </ContextMenuContent>
        </ContextMenu>
      </Demo>
      <Demo id="context-menu-rows" files={["ui/context-menu", "ui/toast"]} title="On list rows" note="One menu per row, with the destructive action last. Right-click any appointment." className="flex-col items-stretch gap-2">
        {appointments.map((item) => (
          <ContextMenu key={item.time}>
            <ContextMenuTrigger className="flex items-center gap-4 rounded-lg bg-surface-sunken px-4 py-3 outline-none">
              <span className="w-12 text-body-sm font-medium text-data">{item.time}</span>
              <span className="flex-1 text-title-sm">{item.name}</span>
              <span className="text-body-sm text-muted-foreground">{item.reason}</span>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem onClick={() => toast.message(`Opening chart for ${item.name}`)}>
                <FileText /> Open chart
              </ContextMenuItem>
              <ContextMenuItem onClick={() => toast.message(`Choose a new time for ${item.name}`)}>
                <CalendarClock /> Reschedule
              </ContextMenuItem>
              <ContextMenuItem destructive onClick={() => toast.message(`Visit with ${item.name} cancelled`)}>
                <Trash2 /> Cancel visit
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        ))}
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "context-menu",
  title: "Context menu",
  group: "Components",
  summary: "A menu that opens where you right-click or long-press. Use it as a shortcut on rows, cards and records, never as the only route to an action.",
  keywords: "right click long press menu actions shortcut",
  Body,
};
