import { CalendarDays, FlaskConical, Pill } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type ComponentSpec, axis, matrix } from "./kit";

type Variant = "underline" | "boxed" | "segmented";

export const spec: ComponentSpec = {
  slug: "tabs",
  sections: [
    matrix({
      title: "Tabs",
      note: "underline for page sections, boxed for equal-width stage tabs, segmented for switching views in a toolbar. One indicator glides between tabs.",
      rows: axis("variant", ["underline", "boxed", "segmented"]),
      states: ["default", "icons", "disabled"],
      render: (p, s) => (
        <div className="w-96">
          <Tabs defaultValue="visits">
            <TabsList variant={p.variant as Variant}>
              <TabsTrigger value="visits">{s.is("icons") && <CalendarDays />}Visits</TabsTrigger>
              <TabsTrigger value="medications">{s.is("icons") && <Pill />}Medications</TabsTrigger>
              <TabsTrigger value="labs" disabled={s.disabled}>
                {s.is("icons") && <FlaskConical />}Lab results
              </TabsTrigger>
            </TabsList>
            <TabsContent value="visits" className="text-body-sm text-muted-foreground">
              Next visit on Thursday 3 December at 10:30 with Dr. Okafor.
            </TabsContent>
          </Tabs>
        </div>
      ),
    }),
    matrix({
      title: "Tab",
      note: "A single tab. The active tab carries the indicator.",
      rows: axis("variant", ["underline", "boxed", "segmented"]),
      groups: axis("active", ["false", "true"]),
      states: ["default", "hover", "focus", "pressed", "disabled"],
      target: "[role=tab]",
      render: (p, s) => (
        <div className={p.variant === "boxed" ? "w-36" : undefined}>
          <Tabs defaultValue={p.active === "true" ? "medications" : null}>
            <TabsList variant={p.variant as Variant}>
              <TabsTrigger value="medications" disabled={s.disabled}>
                Medications
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      ),
    }),
  ],
};
