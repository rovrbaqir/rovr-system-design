import * as React from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, DonutChart, LineChart, Sparkline, chartColors } from "@/components/ui/chart";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const weeks = ["Sep 7", "Sep 14", "Sep 21", "Sep 28", "Oct 5", "Oct 12", "Oct 19", "Oct 26", "Nov 2", "Nov 9", "Nov 16", "Nov 23"];
const visits = {
  "In clinic": [212, 224, 198, 236, 241, 229, 252, 248, 263, 259, 271, 284],
  Video: [96, 104, 118, 121, 137, 142, 139, 158, 163, 171, 186, 192],
};
const byDay = [
  { label: "Mon", value: 62 },
  { label: "Tue", value: 71 },
  { label: "Wed", value: 58 },
  { label: "Thu", value: 77 },
  { label: "Fri", value: 49 },
  { label: "Sat", value: 18 },
];
const payers = [
  { label: "Commercial", value: 1240 },
  { label: "Medicare", value: 610 },
  { label: "Medicaid", value: 330 },
  { label: "Self-pay", value: 190 },
];
const collected = [38200, 41750, 39900, 44300, 46100, 43800, 48900, 51200, 49600, 53400, 55800, 58250];
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });

function VisitsChart() {
  const [mode, setMode] = React.useState<"both" | "clinic">("both");
  const series = Object.entries(visits)
    .filter(([name]) => mode === "both" || name === "In clinic")
    .map(([label, data]) => ({ label, data }));
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-title-md">Visits per week</p>
          <p className="text-body-sm text-muted-foreground">Last 12 weeks, all locations</p>
        </div>
        <SegmentedControl
          size="sm"
          aria-label="Series"
          value={mode}
          onValueChange={setMode}
          options={[
            { value: "both", label: "By format" },
            { value: "clinic", label: "In clinic only" },
          ]}
        />
      </div>
      <LineChart key={mode} aria-label="Visits per week by format" labels={weeks} series={series} />
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="chart-line" files={["ui/chart", "ui/segmented-control"]} title="Line chart" note="Change over time. Lines draw in once, and a crosshair with exact values follows the pointer. Two or more series get a legend; a single series gets a soft wash under it." className="items-start">
        <VisitsChart />
      </Demo>
      <Demo id="chart-line-format" files={["ui/chart"]} title="Line chart options" note="format writes the axis and tooltip values, here as currency. height sets the plot height, and area={false} removes the wash under a single series." className="flex-col items-stretch gap-4">
        <div>
          <p className="text-title-md">Payments collected</p>
          <p className="text-body-sm text-muted-foreground">Per week, Mission St Clinic</p>
        </div>
        <LineChart aria-label="Payments collected per week" labels={weeks} series={[{ label: "Collected", data: collected }]} format={(v) => usd.format(v)} height={180} area={false} />
      </Demo>
      <Demo id="chart-bar" files={["ui/chart", "ui/card"]} title="Bar chart" note="Magnitude across categories. Bars rise from the baseline once, in sequence. highlight keeps one bar at full strength while the rest recede; hovering a bar takes over." bare className="items-stretch">
        <Card className="min-w-72 flex-1">
          <CardHeader>
            <div>
              <CardTitle>Visits by weekday</CardTitle>
              <CardDescription>This week, busiest day highlighted</CardDescription>
            </div>
          </CardHeader>
          <BarChart aria-label="Visits" data={byDay} highlight={3} />
        </Card>
        <Card className="min-w-72 flex-1">
          <CardHeader>
            <div>
              <CardTitle>Average wait by weekday</CardTitle>
              <CardDescription>Minutes from check-in to room</CardDescription>
            </div>
          </CardHeader>
          <BarChart
            aria-label="Average wait"
            height={200}
            format={(v) => `${v} min`}
            data={[
              { label: "Mon", value: 14 },
              { label: "Tue", value: 11 },
              { label: "Wed", value: 9 },
              { label: "Thu", value: 16 },
              { label: "Fri", value: 8 },
              { label: "Sat", value: 5 },
            ]}
          />
        </Card>
      </Demo>
      <Demo id="chart-donut" files={["ui/chart", "ui/card"]} title="Donut chart" note="Two to five parts of one whole. The centre takes the total or the headline share, and the legend carries names, values and percentages so identity never rests on colour alone." bare className="items-stretch">
        <Card className="min-w-72 flex-1">
          <CardHeader>
            <div>
              <CardTitle>Payer mix</CardTitle>
              <CardDescription>Claims submitted this month</CardDescription>
            </div>
          </CardHeader>
          <DonutChart aria-label="Claims by payer" data={payers}>
            <p className="text-xl leading-none font-semibold tracking-tight text-data">2,370</p>
            <p className="mt-1 text-caption text-muted-foreground">claims</p>
          </DonutChart>
        </Card>
        <Card className="min-w-72 flex-1">
          <CardHeader>
            <div>
              <CardTitle>Visit format</CardTitle>
              <CardDescription>This week, smaller size</CardDescription>
            </div>
          </CardHeader>
          <DonutChart
            aria-label="Visits by format"
            size={112}
            format={(v) => `${v} visits`}
            data={[
              { label: "In clinic", value: 284 },
              { label: "Video", value: 192 },
            ]}
          >
            <p className="text-lg leading-none font-semibold tracking-tight text-data">60%</p>
            <p className="mt-1 text-caption text-muted-foreground">in clinic</p>
          </DonutChart>
        </Card>
      </Demo>
      <Demo id="chart-sparkline" files={["ui/chart"]} title="Sparkline and series colours" note="A sparkline is a trend at a glance beside a number: no axes and no tooltip, because the number carries the value. chartColors lists the five series colours in their fixed order." className="flex-col items-start gap-6">
        <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
          <div className="flex items-center gap-3">
            <p className="text-body-sm text-muted-foreground">
              Resting heart rate <span className="ml-1 text-body font-semibold text-foreground text-data">61 bpm</span>
            </p>
            <Sparkline data={[66, 65, 66, 64, 63, 64, 62, 62, 61]} aria-label="Resting heart rate, falling over 30 days" />
          </div>
          <div className="flex items-center gap-3">
            <p className="text-body-sm text-muted-foreground">
              Weight <span className="ml-1 text-body font-semibold text-foreground text-data">72.4 kg</span>
            </p>
            <Sparkline data={[74.1, 73.8, 73.9, 73.2, 72.9, 72.6, 72.4]} width={72} height={24} aria-label="Weight, falling over 12 weeks" />
          </div>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-caption text-muted-foreground">
          {chartColors.map((color, i) => (
            <li key={color} className="flex items-center gap-1.5">
              <span className="size-2.5 rounded-full" style={{ background: color }} />
              <span className="font-mono">chart-{i + 1}</span>
            </li>
          ))}
        </ul>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "chart",
  title: "Chart",
  group: "Components",
  summary: "Line, bar and donut charts plus a sparkline, drawn with thin marks, a quiet grid and one axis. Use a line for change over time, bars for magnitude across categories and a donut for parts of a whole.",
  keywords: "graph line bar donut pie sparkline plot data visualisation analytics trend",
  Body,
};
