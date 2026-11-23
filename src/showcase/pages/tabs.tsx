import * as React from "react";
import { FileText, FlaskConical, Pill } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function ControlledTabs() {
  const [tab, setTab] = React.useState("upcoming");
  const visits = {
    upcoming: ["Thu 3 Dec, 10:30. Follow-up with Dr. Ngozi Okafor", "Thu 17 Dec, 08:15. Lipid panel blood draw"],
    past: ["Thu 12 Nov. Follow-up with Dr. Ngozi Okafor", "Wed 28 Oct. Annual physical with Dr. Ngozi Okafor", "Tue 4 Aug. Dermatology with Dr. Kavya Iyer"],
    cancelled: ["Mon 21 Sep. Video visit with Elise Moreau, NP"],
  };
  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as string)} className="w-full">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-title-sm">Appointments</p>
        <TabsList variant="segmented">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </div>
      {Object.entries(visits).map(([key, list]) => (
        <TabsContent key={key} value={key}>
          <ul className="flex flex-col divide-y divide-border text-body">
            {list.map((v) => (
              <li key={v} className="py-2.5 first:pt-0 last:pb-0">
                {v}
              </li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function Body() {
  return (
    <>
      <Demo id="tabs-underline" files={["ui/tabs"]} title="Underline" note="The default, for the sections of a page. One line slides between tabs and the panel eases in. Arrow keys move between tabs." className="items-start">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="labs">Labs</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="text-body text-muted-foreground">
            Last visit 12 November. Next follow-up due in 3 weeks.
          </TabsContent>
          <TabsContent value="labs" className="text-body text-muted-foreground">
            14 results from the last 12 months. 2 outside the reference range.
          </TabsContent>
          <TabsContent value="medications" className="text-body text-muted-foreground">
            3 active prescriptions. 1 refill due this week.
          </TabsContent>
          <TabsContent value="documents" className="text-body text-muted-foreground">
            After-visit summaries, referrals and uploaded records.
          </TabsContent>
        </Tabs>
      </Demo>
      <Demo id="tabs-boxed" files={["ui/tabs"]} title="Boxed" note="The stage tabs from rovrstack.ai: equal cells, a hairline grid and a blue line that slides along the top." className="items-start">
        <Tabs defaultValue="intake" className="w-full">
          <TabsList variant="boxed">
            <TabsTrigger value="intake">Intake</TabsTrigger>
            <TabsTrigger value="visit">Visit</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
          </TabsList>
          <TabsContent value="intake" className="text-body text-muted-foreground">
            Forms and consent collected before the visit.
          </TabsContent>
          <TabsContent value="visit" className="text-body text-muted-foreground">
            Notes, vitals and the assessment recorded during the visit.
          </TabsContent>
          <TabsContent value="orders" className="text-body text-muted-foreground">
            Labs, imaging and prescriptions ordered from this encounter.
          </TabsContent>
          <TabsContent value="billing" className="text-body text-muted-foreground">
            Codes, claim status and patient responsibility.
          </TabsContent>
        </Tabs>
      </Demo>
      <Demo id="tabs-segmented" files={["ui/tabs"]} title="Segmented" note="For switching views inside a card or toolbar. Controlled here with value and onValueChange." className="items-start">
        <ControlledTabs />
      </Demo>
      <Demo id="tabs-icons-and-disabled" files={["ui/tabs", "ui/badge"]} title="Icons, counts and disabled" note="A trigger can hold an icon or a count beside its label. A disabled tab stays in place so the layout does not shift." className="items-start">
        <Tabs defaultValue="labs" className="w-full">
          <TabsList>
            <TabsTrigger value="labs">
              <FlaskConical /> Labs
              <Badge variant="count" tone="info">
                2
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="medications">
              <Pill /> Medications
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText /> Documents
            </TabsTrigger>
            <TabsTrigger value="imaging" disabled>
              Imaging
            </TabsTrigger>
          </TabsList>
          <TabsContent value="labs" className="text-body text-muted-foreground">
            2 new results since your last visit: lipid panel and HbA1c, both collected 12 November.
          </TabsContent>
          <TabsContent value="medications" className="text-body text-muted-foreground">
            Atorvastatin 20 mg daily, lisinopril 10 mg daily, vitamin D 1,000 IU daily.
          </TabsContent>
          <TabsContent value="documents" className="text-body text-muted-foreground">
            After-visit summary from 12 November and a cardiology referral letter.
          </TabsContent>
        </Tabs>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "tabs",
  title: "Tabs",
  group: "Components",
  summary: "Switches between panels of related content without leaving the page. Three looks: underline for page sections, boxed for stages, segmented for views inside a card.",
  keywords: "tab panel tablist sections navigation boxed segmented underline",
  Body,
};
