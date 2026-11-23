import { Activity, Droplet, HeartPulse, Scale, Thermometer, Wind } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Meter } from "@/components/ui/meter";
import { VitalTile } from "@/components/patterns/vital-tile";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="vital-tile-trend" files={["patterns/vital-tile"]} title="With a trend" note="trend takes recent readings, oldest first, and draws them as a sparkline. trendLabel says the same thing in a sentence, for everyone and for screen readers. The reading itself is never animated." bare className="items-stretch">
        <VitalTile className="min-w-56 flex-1" label="Resting heart rate" value="61" unit="bpm" icon={<HeartPulse />} trend={[66, 65, 66, 64, 63, 64, 62, 62, 61]} trendLabel="Down 4 bpm over 30 days" measured="Today" />
        <VitalTile className="min-w-56 flex-1" label="Blood pressure" value="118/76" unit="mmHg" icon={<Activity />} trend={[124, 122, 121, 123, 120, 119, 118]} trendLabel="Steady" measured="12 Nov" />
        <VitalTile className="min-w-56 flex-1" label="Weight" value="72.4" unit="kg" icon={<Scale />} trend={[74.1, 73.8, 73.9, 73.2, 72.9, 72.6, 72.4]} trendLabel="Down 1.7 kg over 12 weeks" measured="12 Nov" />
      </Demo>
      <Demo id="vital-tile-single" files={["patterns/vital-tile"]} title="A single reading" note="Everything but the label and value is optional. Without a trend the tile is just the reading and when it was taken." bare className="items-stretch">
        <VitalTile className="min-w-48 flex-1" label="Temperature" value="36.8" unit="°C" icon={<Thermometer />} measured="Today, 09:04" />
        <VitalTile className="min-w-48 flex-1" label="Oxygen saturation" value="98" unit="%" icon={<Droplet />} measured="Today, 09:04" />
        <VitalTile className="min-w-48 flex-1" label="Respiratory rate" value="14" unit="per min" icon={<Wind />} measured="Today, 09:04" />
        <VitalTile className="min-w-48 flex-1" label="Pain" value="2 / 10" />
      </Demo>
      <Demo id="vital-tile-with-meters" files={["patterns/vital-tile", "ui/card", "ui/meter"]} title="Beside meters" note="On a patient's home screen, vitals share a row with progress towards daily targets." bare className="items-stretch">
        <VitalTile className="min-w-56 flex-1" label="Resting heart rate" value="61" unit="bpm" icon={<HeartPulse />} trend={[66, 65, 66, 64, 63, 64, 62, 62, 61]} trendLabel="Down 4 bpm over 30 days" measured="Today" />
        <Card className="min-w-56 flex-1 justify-center">
          <Meter label="Sleep" value={6.2} max={8} valueText="6.2 of 8 hours" />
          <Meter label="Medication adherence" value={92} valueText="92%" tone="success" />
        </Card>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "vital-tile",
  title: "Vital tile",
  group: "Patterns",
  summary: "One vital sign with its unit, when it was measured and its recent trend. Use it on the patient's home screen and in the chart summary.",
  keywords: "vitals heart rate blood pressure weight temperature reading sparkline health metric",
  Body,
};
