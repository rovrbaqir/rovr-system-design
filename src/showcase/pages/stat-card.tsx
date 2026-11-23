import { Sparkline } from "@/components/ui/chart";
import { Meter } from "@/components/ui/meter";
import { NumberTicker } from "@/components/ui/motion";
import { StatCard } from "@/components/patterns/stat-card";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="stat-card-basic" files={["patterns/stat-card"]} title="Label, value and caption" note="The smallest form: one figure and what it counts. unit sits after the value in a quieter weight." bare className="items-stretch">
        <StatCard className="min-w-52 flex-1" label="Visits today" value="14" caption="6 completed" />
        <StatCard className="min-w-52 flex-1" label="Waiting now" value="2" caption="Longest 9 min" />
        <StatCard className="min-w-52 flex-1" label="Average visit" value="24" unit="min" />
      </Demo>
      <Demo id="stat-card-trend" files={["patterns/stat-card"]} title="Change and trend" note="direction sets the arrow and trend sets the colour, separately, because direction alone does not say whether a change is good. A falling no-show rate is positive; a rising wait is negative." bare className="items-stretch">
        <StatCard className="min-w-52 flex-1" label="Visits this week" value="148" delta="+12%" trend="positive" caption="vs last week" />
        <StatCard className="min-w-52 flex-1" label="No-show rate" value="4.8" unit="%" delta="−1.3 pts" direction="down" trend="positive" caption="vs last week" />
        <StatCard className="min-w-52 flex-1" label="Average wait" value="11" unit="min" delta="+2 min" trend="negative" caption="vs last week" />
        <StatCard className="min-w-52 flex-1" label="New patients" value="9" delta="+1" caption="vs last week" />
      </Demo>
      <Demo id="stat-card-ticker" files={["patterns/stat-card", "ui/motion"]} title="Counting up" note="value takes any content. A NumberTicker counts to the figure once when the card is first seen. Summary figures only, never a clinical reading." bare className="items-stretch">
        <StatCard className="min-w-52 flex-1" label="Visits this week" value={<NumberTicker value={148} />} delta="+12%" trend="positive" caption="vs last week" />
        <StatCard className="min-w-52 flex-1" label="No-show rate" value={<NumberTicker value={4.8} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} />} unit="%" delta="−1.3 pts" direction="down" trend="positive" caption="vs last week" />
        <StatCard className="min-w-52 flex-1" label="Collected" value={<NumberTicker value={58250} format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} />} delta="+4.4%" trend="positive" caption="vs last week" />
      </Demo>
      <Demo id="stat-card-children" files={["patterns/stat-card", "ui/chart", "ui/meter"]} title="With a chart or meter" note="Children render under the figure: a sparkline for the trend behind it, or a meter for progress towards a target." bare className="items-stretch">
        <StatCard className="min-w-60 flex-1" label="Video visits" value="192" delta="+3.2%" trend="positive" caption="vs last week">
          <Sparkline className="w-full" width={220} height={36} data={[96, 104, 118, 121, 137, 142, 139, 158, 163, 171, 186, 192]} aria-label="Video visits per week, rising over 12 weeks" />
        </StatCard>
        <StatCard className="min-w-60 flex-1" label="Notes signed today" value="9" unit="of 14">
          <Meter label="Signed" value={9} max={14} valueText="9 of 14" />
        </StatCard>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "stat-card",
  title: "Stat card",
  group: "Examples",
  summary: "One figure with its label and its change against a comparison period. Lay several out in a row for the summary strip at the top of a dashboard.",
  keywords: "kpi metric number figure summary dashboard delta trend tile",
  Body,
};
