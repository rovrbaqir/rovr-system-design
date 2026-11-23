import { MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientHeader } from "@/components/patterns/patient-header";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="patient-header-full" files={["patterns/patient-header", "ui/badge", "ui/button"]} title="Identity, facts, alerts and actions" note="Name, MRN and safety flags stay at the top of every chart view. The MRN has a copy button, and alerts always carry words, not colour alone." bare>
        <PatientHeader
          className="w-full"
          name="Amara Osei"
          mrn="20418"
          facts={[
            { label: "Born", value: "14 Apr 1988 (38)" },
            { label: "Sex", value: "Female" },
            { label: "Plan", value: "Aetna PPO" },
            { label: "Primary", value: "Dr. Okafor" },
          ]}
          alerts={
            <>
              <Badge tone="danger">Penicillin allergy</Badge>
              <Badge tone="warning">Fall risk</Badge>
            </>
          }
          actions={<Button variant="outline">Open chart</Button>}
        />
      </Demo>
      <Demo id="patient-header-minimal" files={["patterns/patient-header"]} title="Without alerts or actions" note="alerts and actions are optional. facts takes any number of short label and value pairs; keep them to what is read at a glance." bare>
        <PatientHeader
          className="w-full"
          name="Daniel Reyes"
          mrn="19307"
          facts={[
            { label: "Born", value: "2 Sep 1975 (51)" },
            { label: "Sex", value: "Male" },
          ]}
        />
      </Demo>
      <Demo id="patient-header-chart" files={["patterns/patient-header", "ui/tabs", "ui/badge", "ui/button"]} title="At the top of a chart" note="The header sits above the chart's tabs, so identity stays put while the view below changes. A fact's value can be any content." bare className="flex-col items-stretch gap-4">
        <PatientHeader
          name="Tomás Lindqvist"
          mrn="18842"
          facts={[
            { label: "Born", value: "30 Jan 1962 (64)" },
            { label: "Sex", value: "Male" },
            { label: "Plan", value: "UnitedHealthcare" },
            { label: "Today", value: <Badge tone="info" variant="status" live>In room 2</Badge> },
          ]}
          alerts={<Badge tone="danger">Sulfa allergy</Badge>}
          actions={
            <>
              <Button variant="ghost" size="icon-md" aria-label="Message Tomás Lindqvist">
                <MessageSquare />
              </Button>
              <Button>Start visit</Button>
            </>
          }
        />
        <Tabs defaultValue="summary">
          <TabsList>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="visits">Visits</TabsTrigger>
            <TabsTrigger value="labs">Labs</TabsTrigger>
            <TabsTrigger value="medications">Medications</TabsTrigger>
          </TabsList>
          <TabsContent value="summary" className="text-body-sm text-muted-foreground">
            Same-day sick visit for a cough of five days. Last seen 14 October for a blood pressure check.
          </TabsContent>
          <TabsContent value="visits" className="text-body-sm text-muted-foreground">
            6 visits in the last 12 months, most recently 14 October.
          </TabsContent>
          <TabsContent value="labs" className="text-body-sm text-muted-foreground">
            Metabolic panel from 14 October, all values in range.
          </TabsContent>
          <TabsContent value="medications" className="text-body-sm text-muted-foreground">
            Lisinopril 10 mg every evening. Salbutamol inhaler when needed.
          </TabsContent>
        </Tabs>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "patient-header",
  title: "Patient header",
  group: "Examples",
  summary: "The identity strip at the top of a patient chart: name, MRN, key facts and safety flags. Use it on every chart view in the provider app so the clinician always knows whose record is open.",
  keywords: "patient banner chart identity mrn demographics allergies alerts",
  Body,
};
