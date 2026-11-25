import { CalendarCheck, CircleDollarSign, FileWarning, Hourglass, Percent, Receipt, Users } from "lucide-react";
import { KpiCard, KpiRow, KpiRowSkeleton, MetricsStrip } from "@/components/patterns/kpi-card";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Delta } from "@/components/ui/delta";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo
        id="kpi-card-row"
        files={["patterns/kpi-card", "ui/card"]}
        title="A row of KPIs"
        note="KpiRow shares the width between its cards and scrolls sideways once a card would be narrower than 160px. The detail line keeps its space when it is empty, so the cards stay the same height."
        bare
        className="items-stretch"
      >
        <KpiRow aria-label="Claims, last 30 days">
          <KpiCard label="Claims submitted" value="1,284" detail="Last 30 days" icon={<Receipt />} />
          <KpiCard label="Clean claim rate" value="94.6%" detail="1,215 accepted first pass" icon={<Percent />} />
          <KpiCard label="Denied" value="41" detail="$18,920 at risk" icon={<FileWarning />} />
          <KpiCard label="Days in A/R" value="27" icon={<Hourglass />} />
          <KpiCard label="Collected" value="$212,480" detail="$96 per visit" icon={<CircleDollarSign />} />
        </KpiRow>
      </Demo>
      <Demo
        id="kpi-card-delta"
        files={["patterns/kpi-card", "ui/card", "ui/delta"]}
        title="A change in the detail line"
        note="detail takes any content. Pass a Delta to show how the figure moved against the prior period. Set good only where a direction is clearly good news."
        bare
        className="items-stretch"
      >
        <KpiRow aria-label="Clinic health, this week">
          <KpiCard label="Visits completed" value="500" icon={<CalendarCheck />} detail={<Delta size="sm" direction="up" good="up" title="vs prior period">6.4%</Delta>} />
          <KpiCard label="No-show rate" value="7.2%" icon={<Percent />} detail={<Delta size="sm" direction="up" good="down" title="vs prior period">1.1 pts</Delta>} />
          <KpiCard label="Cost per visit" value="$41.20" icon={<CircleDollarSign />} detail={<Delta size="sm" direction="down" title="vs prior period">$0.02</Delta>} />
          <KpiCard label="Active patients" value="3,912" icon={<Users />} detail={<Delta size="sm" direction="flat" title="vs prior period">0</Delta>} />
        </KpiRow>
      </Demo>
      <Demo
        id="kpi-card-link"
        files={["patterns/kpi-card", "ui/card"]}
        title="As a link"
        note="Set href and the whole card opens the page behind the number. The border picks up the brand colour under the pointer and the focus ring sits inside the card."
        bare
        className="items-stretch"
      >
        <KpiRow aria-label="Work queues">
          <KpiCard href="#/kpi-card" label="Denials to work" value="41" detail="12 due this week" icon={<FileWarning />} />
          <KpiCard href="#/kpi-card" label="Eligibility checks failed" value="9" detail="For visits in the next 3 days" icon={<Users />} />
          <KpiCard href="#/kpi-card" label="Unposted payments" value="$6,340" detail="17 remittances" icon={<CircleDollarSign />} />
        </KpiRow>
      </Demo>
      <Demo
        id="kpi-card-loading"
        files={["patterns/kpi-card", "ui/card", "ui/skeleton"]}
        title="Loading"
        note="KpiRowSkeleton has the card's surface, padding and three lines, so the figures land where the placeholders were. Set count to the number of cards that will load."
        bare
        className="items-stretch"
      >
        <KpiRowSkeleton count={5} />
      </Demo>
      <Demo
        id="kpi-card-metrics-strip"
        files={["patterns/kpi-card", "ui/card"]}
        title="Metrics strip"
        note="A quieter strip of labels over values for the inside of a section card. Metrics share the width and wrap once one would be narrower than 88px."
        bare
        className="items-stretch"
      >
        <Card className="w-full">
          <CardHeader>
            <div>
              <CardTitle>Eligibility outreach</CardTitle>
              <CardDescription>Workflow run on 24 November</CardDescription>
            </div>
          </CardHeader>
          <MetricsStrip
            metrics={[
              { label: "Patients contacted", value: "318" },
              { label: "Coverage confirmed", value: "274", detail: "86% of contacted" },
              { label: "Needs follow-up", value: "31" },
              { label: "Average handle time", value: "3m 42s" },
              { label: "Cost", value: "$96.00", detail: "$0.30 per patient" },
            ]}
          />
        </Card>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "kpi-card",
  title: "KPI card",
  group: "Examples",
  summary: "Provider app. Replaces KpiCard, RcmKpiRow and MetricsStrip. A metric tile with a label, a figure and one line of detail, the scrolling row that holds a set of them, and a quieter strip for metrics inside a card.",
  keywords: "kpi metric stat tile figure number dashboard rcm claims row strip skeleton delta",
  Body,
};
