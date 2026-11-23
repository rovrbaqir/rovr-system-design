import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Meter } from "@/components/ui/meter";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function WaterMeter() {
  const [glasses, setGlasses] = React.useState(5);
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Meter label="Water today" value={glasses} max={8} valueText={`${glasses} of 8 glasses`} tone={glasses >= 8 ? "success" : "primary"} />
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={glasses === 0} onClick={() => setGlasses((g) => g - 1)}>
          Remove a glass
        </Button>
        <Button variant="secondary" size="sm" disabled={glasses === 8} onClick={() => setGlasses((g) => g + 1)}>
          Add a glass
        </Button>
      </div>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="meter-basic" files={["ui/meter"]} title="Label and value" note="The label says what is measured and valueText gives the value as people read it. value runs from 0 to 100 unless you set min and max." className="flex-col items-stretch gap-6">
        <Meter label="Medication adherence" value={92} valueText="92% this month" />
        <Meter label="Sleep" value={6.2} max={8} valueText="6.2 of 8 hours" />
        <Meter label="Resting heart rate" value={72} min={40} max={120} valueText="72 bpm" />
      </Demo>
      <Demo id="meter-tones" files={["ui/meter"]} title="Tones" note="Tone carries the judgement: on track, needs attention, or a problem. The words carry it too." className="flex-col items-stretch gap-6">
        <Meter label="Deductible met" value={1150} max={1500} valueText="$1,150 of $1,500" />
        <Meter label="Steps" value={8400} max={8000} tone="success" valueText="8,400 of 8,000, goal reached" />
        <Meter label="Refill supply" value={6} max={30} tone="warning" valueText="6 of 30 days left" />
        <Meter label="Clinic capacity today" value={38} max={40} tone="danger" valueText="38 of 40 slots booked" />
      </Demo>
      <Demo id="meter-controlled" files={["ui/meter", "ui/button"]} title="Changing value" note="The bar glides when the value changes. Here the tone turns to success once the goal is met." className="items-start">
        <WaterMeter />
      </Demo>
      <Demo id="meter-in-a-card" files={["ui/meter", "ui/card"]} title="In a card" note="A few meters stacked under one heading make a compact summary." bare className="items-stretch">
        <Card className="max-w-md flex-1">
          <CardHeader>
            <div>
              <CardTitle>This week</CardTitle>
              <CardDescription>Amara Osei, 16 to 22 November</CardDescription>
            </div>
          </CardHeader>
          <Meter label="Medication adherence" value={13} max={14} tone="success" valueText="13 of 14 doses" />
          <Meter label="Active minutes" value={95} max={150} valueText="95 of 150 minutes" />
          <Meter label="Sleep" value={5.4} max={8} tone="warning" valueText="5.4 of 8 hours a night" />
        </Card>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "meter",
  title: "Meter",
  group: "Components",
  summary: "A measured amount against a known range: capacity, adherence, a goal. Use Progress for work that is under way.",
  keywords: "gauge level capacity goal adherence bar measure",
  Body,
};
