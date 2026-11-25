import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StackedBar } from "@/components/ui/stacked-bar";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const claims = [
  { key: "paid", label: "Paid", value: 412 },
  { key: "pending", label: "Pending", value: 96 },
  { key: "denied", label: "Denied", value: 38 },
  { key: "appealed", label: "Appealed", value: 14 },
];

const visits = [
  { key: "clinic", label: "In clinic", value: 284 },
  { key: "video", label: "Video", value: 192 },
  { key: "phone", label: "Phone", value: 24 },
];

function Body() {
  const total = visits.reduce((sum, v) => sum + v.value, 0);
  return (
    <>
      <Demo id="stacked-bar-basic" files={["ui/stacked-bar", "ui/chart"]} title="Segments and legend" note="Each segment takes its share of the bar. The legend gives the name and the value of each, so no segment is told apart by colour alone." className="items-stretch">
        <StackedBar aria-label="Claims by status, November" segments={claims} className="max-w-xl" />
      </Demo>
      <Demo id="stacked-bar-format" files={["ui/stacked-bar", "ui/chart"]} title="Formatted values" note="formatValue writes the legend values: a count, a share or money." className="flex-col items-stretch gap-8">
        <StackedBar aria-label="Visits by type, share of this week" segments={visits} formatValue={(v) => `${Math.round((v / total) * 100)}%`} className="max-w-xl" />
        <StackedBar
          aria-label="Patient balance by age"
          className="max-w-xl"
          formatValue={(v) => `$${v.toLocaleString("en-US")}`}
          segments={[
            { key: "current", label: "Current", value: 18400 },
            { key: "30", label: "31 to 60 days", value: 7250 },
            { key: "60", label: "61 to 90 days", value: 3100 },
            { key: "90", label: "Over 90 days", value: 1480 },
          ]}
        />
      </Demo>
      <Demo id="stacked-bar-sizes" files={["ui/stacked-bar", "ui/chart"]} title="Sizes" note="size sets the height of the bar. Use lg when the bar is the main figure of a card." className="flex-col items-stretch gap-8">
        <StackedBar size="sm" aria-label="Claims by status" segments={claims} className="max-w-xl" />
        <StackedBar size="md" aria-label="Claims by status" segments={claims} className="max-w-xl" />
        <StackedBar size="lg" aria-label="Claims by status" segments={claims} className="max-w-xl" />
      </Demo>
      <Demo id="stacked-bar-no-legend" files={["ui/stacked-bar", "ui/chart"]} title="Without a legend" note="Turn the legend off only where the values are written next to the bar, as in a table row. The bar then describes its segments to screen readers." className="flex-col items-stretch gap-4">
        {[
          { clinic: "Riverside", kept: 118, late: 9, missed: 5 },
          { clinic: "Northgate", kept: 92, late: 14, missed: 11 },
        ].map((row) => (
          <div key={row.clinic} className="grid max-w-xl grid-cols-[7rem_minmax(0,1fr)_auto] items-center gap-4">
            <span className="text-label">{row.clinic}</span>
            <StackedBar
              legend={false}
              aria-label={`${row.clinic} appointments`}
              segments={[
                { key: "kept", label: "kept", value: row.kept },
                { key: "late", label: "late", value: row.late },
                { key: "missed", label: "missed", value: row.missed },
              ]}
            />
            <span className="text-body-sm text-muted-foreground text-data">
              {row.kept} kept, {row.late} late, {row.missed} missed
            </span>
          </div>
        ))}
      </Demo>
      <Demo id="stacked-bar-in-a-card" files={["ui/stacked-bar", "ui/chart", "ui/card"]} title="In a card" note="Pass color to pin a segment to a chart colour. Colours come from the chart tokens, never from status colours." bare className="items-stretch">
        <Card className="max-w-lg flex-1">
          <CardHeader>
            <div>
              <CardTitle>Payer mix</CardTitle>
              <CardDescription>2,370 claims, 1 to 24 November 2026</CardDescription>
            </div>
          </CardHeader>
          <StackedBar
            size="lg"
            aria-label="Claims by payer"
            segments={[
              { key: "commercial", label: "Commercial", value: 1240, color: "var(--chart-1)" },
              { key: "medicare", label: "Medicare", value: 610, color: "var(--chart-2)" },
              { key: "medicaid", label: "Medicaid", value: 330, color: "var(--chart-3)" },
              { key: "self", label: "Self-pay", value: 190, color: "var(--chart-4)" },
            ]}
          />
        </Card>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "stacked-bar",
  title: "Stacked bar",
  group: "Components",
  summary: "One bar split into the parts of a whole, with a legend of names and values. Use it where a donut is too large; use BarList to compare amounts that are not parts of one total.",
  keywords: "segmented bar proportion breakdown share distribution legend parts whole",
  Body,
};
