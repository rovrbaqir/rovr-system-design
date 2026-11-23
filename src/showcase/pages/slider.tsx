import * as React from "react";
import { Slider } from "@/components/ui/slider";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function PainSlider() {
  const [pain, setPain] = React.useState(3);
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex items-center justify-between text-body">
        <span>Pain level today</span>
        <span className="font-medium text-data">{pain} / 10</span>
      </div>
      <Slider value={pain} onValueChange={(v) => setPain(v as number)} min={0} max={10} aria-label="Pain level" />
      <div className="flex justify-between text-caption text-muted-foreground">
        <span>No pain</span>
        <span>Worst imaginable</span>
      </div>
    </div>
  );
}

function GlucoseRange() {
  const [range, setRange] = React.useState([70, 180]);
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex items-center justify-between text-body">
        <span>Target glucose range</span>
        <span className="font-medium text-data">
          {range[0]} to {range[1]} mg/dL
        </span>
      </div>
      <Slider value={range} onValueChange={(v) => setRange(v as number[])} min={40} max={300} step={5} minStepsBetweenValues={2} aria-label="Target glucose range" />
    </div>
  );
}

function ReminderSlider() {
  const [minutes, setMinutes] = React.useState(30);
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex items-center justify-between text-body">
        <span>Remind me before a visit</span>
        <span className="font-medium text-data">{minutes} min</span>
      </div>
      <Slider value={minutes} onValueChange={(v) => setMinutes(v as number)} min={15} max={120} step={15} aria-label="Reminder lead time" />
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="slider-basic" files={["ui/slider"]} title="Single value" note="Always show the current value in words or numbers next to the slider. Arrow keys move it one step." className="items-start">
        <PainSlider />
      </Demo>
      <Demo id="slider-range" files={["ui/slider"]} title="Range" note="Pass an array and the slider draws one thumb per value." className="items-start">
        <GlucoseRange />
      </Demo>
      <Demo id="slider-step" files={["ui/slider"]} title="Steps" note="Set step when only certain values make sense. This one moves in quarter hours." className="items-start">
        <ReminderSlider />
      </Demo>
      <Demo id="slider-disabled" files={["ui/slider"]} title="Disabled" className="items-start">
        <div className="flex w-full max-w-sm flex-col gap-4">
          <div className="flex items-center justify-between text-body text-muted-foreground">
            <span>Basal rate (set by your clinician)</span>
            <span className="font-medium text-data">0.8 U/h</span>
          </div>
          <Slider defaultValue={0.8} min={0} max={2} step={0.05} disabled aria-label="Basal rate" />
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "slider",
  title: "Slider",
  group: "Components",
  summary: "Picks a number or a range by dragging along a track. Use it when the rough position matters more than the exact figure, such as a pain score.",
  keywords: "range scale track thumb",
  Body,
};
