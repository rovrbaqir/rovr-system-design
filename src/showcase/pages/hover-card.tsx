import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const link = "rounded-xs text-accent-foreground underline decoration-transparent underline-offset-4 rovr-focus hover:decoration-current";

function Body() {
  return (
    <>
      <Demo id="hover-card-person" files={["ui/hover-card", "ui/avatar"]} title="A person" note="Hover or focus the name. The card previews where the link goes; following the link must give the same information.">
        <p className="text-body">
          Ordered by{" "}
          <HoverCard>
            <HoverCardTrigger href="#/hover-card" className={link}>
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
          </HoverCard>{" "}
          on 12 November.
        </p>
      </Demo>
      <Demo id="hover-card-code" files={["ui/hover-card", "ui/badge"]} title="A code" note="Billing and diagnosis codes are compact on the page and spelled out in the card.">
        <p className="text-body">
          Diagnosis{" "}
          <HoverCard>
            <HoverCardTrigger href="#/hover-card" className={`${link} font-mono`}>
              E78.5
            </HoverCardTrigger>
            <HoverCardContent className="flex flex-col gap-1.5">
              <p className="text-title-sm">Hyperlipidaemia, unspecified</p>
              <p className="text-body-sm text-muted-foreground">ICD-10-CM. Raised cholesterol or triglycerides without a more specific type recorded.</p>
              <Badge tone="info">Billable</Badge>
            </HoverCardContent>
          </HoverCard>
          , visit code{" "}
          <HoverCard>
            <HoverCardTrigger href="#/hover-card" className={`${link} font-mono`}>
              99214
            </HoverCardTrigger>
            <HoverCardContent className="flex flex-col gap-1.5">
              <p className="text-title-sm">Office visit, established patient</p>
              <p className="text-body-sm text-muted-foreground">CPT. Moderate complexity, 30 to 39 minutes.</p>
            </HoverCardContent>
          </HoverCard>
          .
        </p>
      </Demo>
      <Demo id="hover-card-placement" files={["ui/hover-card", "ui/avatar", "ui/badge"]} title="Placement" note="Opens below the link and lines up with its start by default. Set side and align when the link sits at the edge of a table or panel.">
        <HoverCard>
          <HoverCardTrigger href="#/hover-card" className={link}>
            Amara Osei
          </HoverCardTrigger>
          <HoverCardContent side="top" align="center" className="flex gap-3">
            <Avatar name="Amara Osei" />
            <div className="flex flex-col gap-1">
              <p className="text-title-sm">Amara Osei</p>
              <p className="text-body-sm text-muted-foreground">34 years · MRN 2041-88317</p>
              <Badge variant="status" tone="success">
                Checked in
              </Badge>
            </div>
          </HoverCardContent>
        </HoverCard>
        <HoverCard>
          <HoverCardTrigger href="#/hover-card" className={link}>
            Quest Diagnostics
          </HoverCardTrigger>
          <HoverCardContent side="right" className="flex flex-col gap-0.5">
            <p className="text-title-sm">Quest Diagnostics</p>
            <p className="text-body-sm text-muted-foreground">1250 Mission St. Open 07:00 to 16:00, walk-ins welcome.</p>
          </HoverCardContent>
        </HoverCard>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "hover-card",
  title: "Hover card",
  group: "Components",
  summary: "A preview shown when a link is hovered or focused: a clinician, a patient, a code. It is a shortcut, never the only way to reach the information.",
  keywords: "preview card profile popover link hover",
  Body,
};
