import { FileText, MessageSquare, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DescriptionItem, DescriptionList } from "@/components/ui/description-list";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="description-list-one-column" files={["ui/description-list"]} title="One column" note="The default. For narrow panels and sheets, where each pair gets the full width." className="items-start">
        <DescriptionList className="w-full max-w-xs">
          <DescriptionItem label="Pharmacy">Walgreens, 825 Market St</DescriptionItem>
          <DescriptionItem label="Prescriber">Dr. Ngozi Okafor</DescriptionItem>
          <DescriptionItem label="Last filled">28 Oct 2026</DescriptionItem>
          <DescriptionItem label="Refills left">2</DescriptionItem>
        </DescriptionList>
      </Demo>
      <Demo id="description-list-two-columns" files={["ui/description-list"]} title="Two columns" note="Pairs flow left to right, then down. Below the small breakpoint every column count falls back to one." className="items-start">
        <DescriptionList columns={2} className="w-full">
          <DescriptionItem label="Full name">Amara Osei</DescriptionItem>
          <DescriptionItem label="Date of birth">14 Apr 1988 (38)</DescriptionItem>
          <DescriptionItem label="Phone">(415) 555-0142</DescriptionItem>
          <DescriptionItem label="Email">amara.osei@example.com</DescriptionItem>
          <DescriptionItem label="Preferred language">English</DescriptionItem>
          <DescriptionItem label="Emergency contact">Kwame Osei, brother</DescriptionItem>
        </DescriptionList>
      </Demo>
      <Demo id="description-list-three-columns" files={["ui/description-list", "ui/badge"]} title="Three columns" note="For wide detail views. A value can be any content: a badge, a code, a link." className="items-start">
        <DescriptionList columns={3} className="w-full">
          <DescriptionItem label="Claim">
            <span className="font-mono text-[0.875rem]">CL-48213</span>
          </DescriptionItem>
          <DescriptionItem label="Payer">Aetna PPO</DescriptionItem>
          <DescriptionItem label="Status">
            <Badge tone="success">Paid</Badge>
          </DescriptionItem>
          <DescriptionItem label="Service date">12 Nov 2026</DescriptionItem>
          <DescriptionItem label="Billed">
            <span className="text-data">$240.00</span>
          </DescriptionItem>
          <DescriptionItem label="Patient owes">
            <span className="text-data">$25.00</span>
          </DescriptionItem>
        </DescriptionList>
      </Demo>
      <Demo id="description-list-lab-order" files={["ui/description-list", "ui/context-menu", "ui/hover-card", "ui/avatar", "ui/badge"]} title="Lab order details" note="Hover the clinician's name for a preview. Right-click the list for its menu." className="items-start">
        <ContextMenu>
          <ContextMenuTrigger className="w-full rounded-lg outline-none">
            <DescriptionList columns={3} className="w-full">
              <DescriptionItem label="Ordering clinician">
                <HoverCard>
                  <HoverCardTrigger href="#/description-list" className="rounded-xs text-accent-foreground underline decoration-transparent underline-offset-4 rovr-focus hover:decoration-current">
                    Dr. Ngozi Okafor
                  </HoverCardTrigger>
                  <HoverCardContent className="flex gap-3">
                    <Avatar name="Ngozi Okafor" />
                    <div className="flex flex-col gap-0.5">
                      <p className="text-title-sm">Dr. Ngozi Okafor</p>
                      <p className="text-body-sm text-muted-foreground">Internal medicine · Mission St Clinic</p>
                      <p className="mt-1 text-body-sm">Next opening Thursday 10:30</p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </DescriptionItem>
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
    </>
  );
}

export const page: DocPage = {
  slug: "description-list",
  title: "Description list",
  group: "Components",
  summary: "Label and value pairs in one, two or three columns. Use it for demographics, order details and claim fields: facts someone reads, not edits.",
  keywords: "details key value pairs definition dl metadata properties fields",
  Body,
};
