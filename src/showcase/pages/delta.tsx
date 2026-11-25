import type * as React from "react";
import { Card } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Stat({ label, value, children }: { label: string; value: string; children: React.ReactNode }) {
  return (
    <Card className="min-w-44 flex-1 gap-1">
      <p className="text-body-sm text-muted-foreground">{label}</p>
      <p className="flex items-baseline gap-2">
        <span className="text-display-sm text-data">{value}</span>
        {children}
      </p>
    </Card>
  );
}

function Body() {
  return (
    <>
      <Demo id="delta-basic" files={["ui/delta"]} title="Direction" note="An arrow and the amount. Without good the change is neutral, so nothing is judged by accident." className="gap-6">
        <Delta direction="up">4.2%</Delta>
        <Delta direction="down">1.8%</Delta>
        <Delta direction="flat">0.0%</Delta>
      </Demo>
      <Demo id="delta-good" files={["ui/delta"]} title="Good direction" note="good says which way is good news. Collections going up and denials going down both read as success; the opposite reads as a problem." className="grid grid-cols-[auto_auto_auto] items-center justify-start gap-x-8 gap-y-3">
        <span className="text-body-sm text-muted-foreground">Collection rate, good is up</span>
        <Delta direction="up" good="up">2.1 pts</Delta>
        <Delta direction="down" good="up">2.1 pts</Delta>
        <span className="text-body-sm text-muted-foreground">Denial rate, good is down</span>
        <Delta direction="down" good="down">0.9 pts</Delta>
        <Delta direction="up" good="down">0.9 pts</Delta>
        <span className="text-body-sm text-muted-foreground">No change</span>
        <Delta direction="flat" good="up">0.0 pts</Delta>
        <span />
      </Demo>
      <Demo id="delta-title" files={["ui/delta"]} title="Comparison" note="title says what the change is measured against. It shows on hover and screen readers hear it after the amount: Up 12, vs last week." className="gap-6">
        <Delta direction="up" title="vs last week">12</Delta>
        <Delta direction="down" good="down" title="vs prior 30 days">6 min</Delta>
      </Demo>
      <Demo id="delta-sizes" files={["ui/delta"]} title="Sizes" note="sm in tables and dense tiles, md by default, lg beside a large figure." className="items-baseline gap-6">
        <Delta size="sm" direction="up" good="up">4.2%</Delta>
        <Delta size="md" direction="up" good="up">4.2%</Delta>
        <Delta size="lg" direction="up" good="up">4.2%</Delta>
      </Demo>
      <Demo id="delta-in-a-stat" files={["ui/delta", "ui/card"]} title="Beside a figure" note="The usual place: next to the number it qualifies." bare className="items-stretch gap-4">
        <Stat label="Visits this week" value="500">
          <Delta direction="up" good="up" title="vs last week">6.4%</Delta>
        </Stat>
        <Stat label="No-show rate" value="7.2%">
          <Delta direction="up" good="down" title="vs last week">1.1 pts</Delta>
        </Stat>
        <Stat label="Average wait" value="14 min">
          <Delta direction="flat" title="vs last week">0 min</Delta>
        </Stat>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "delta",
  title: "Delta",
  group: "Components",
  summary: "A small up, down or flat indicator with the amount of change. Put it beside a figure to show how it moved against an earlier period.",
  keywords: "change trend difference increase decrease arrow percent comparison kpi",
  Body,
};
