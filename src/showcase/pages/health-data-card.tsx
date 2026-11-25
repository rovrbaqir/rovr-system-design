import * as React from "react";
import { LineChart } from "@/components/ui/chart";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Skeleton } from "@/components/ui/skeleton";
import { HealthDataCard, HealthDataCardHeader, type HealthDataRange, MetricValue, NoDataChart, NotConnected } from "@/components/patterns/health-data-card";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const ranges: { value: HealthDataRange; label: string }[] = [
  { value: "day", label: "D" },
  { value: "week", label: "W" },
  { value: "month", label: "M" },
  { value: "6-months", label: "6M" },
  { value: "year", label: "Y" },
];

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
};

const heartRate: Record<HealthDataRange, { labels: string[]; data: number[]; caption: string }> = {
  day: { labels: ["12AM", "3AM", "6AM", "9AM", "12PM", "3PM", "6PM", "9PM"], data: [54, 51, 58, 72, 78, 84, 76, 63], caption: "12 minutes ago" },
  week: { labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], data: [62, 64, 61, 66, 63, 65, 60], caption: "7-day average" },
  month: { labels: ["1", "6", "11", "16", "21", "26", "31"], data: [63, 61, 64, 66, 62, 60, 61], caption: "31-day average" },
  "4-month": { labels: ["Aug", "Sep", "Oct", "Nov"], data: [65, 63, 62, 61], caption: "4-month average" },
  "6-months": { labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"], data: [66, 67, 65, 63, 62, 61], caption: "6-month average" },
  year: { labels: ["Jan", "Mar", "May", "Jul", "Sep", "Nov"], data: [68, 67, 66, 67, 63, 61], caption: "365-day average" },
};

/** The footer the heart rate card adds under the range switch. */
function StatsFooter({ max, min, unit }: { max: number; min: number; unit: string }) {
  return (
    <div className="mt-4 flex justify-between">
      {[
        { label: "Highest HR", value: max },
        { label: "Lowest HR", value: min },
      ].map((stat) => (
        <div key={stat.label}>
          <div className="text-caption text-muted-foreground">{stat.label}</div>
          <div className="text-body text-data">
            {stat.value}
            <span className="ml-1 text-caption text-muted-foreground">{unit}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function HeartRateCard() {
  const [rangeType, setRangeType] = React.useState<HealthDataRange>("week");
  const [selectedDate, setSelectedDate] = React.useState(today);
  const [pinned, setPinned] = React.useState(true);
  const set = heartRate[rangeType];
  const mean = set.data.reduce((sum, v) => sum + v, 0) / set.data.length;
  return (
    <HealthDataCard
      className="max-w-md"
      header={
        <HealthDataCardHeader
          title="Heart rate"
          rangeType={rangeType}
          selectedDate={selectedDate}
          onSelectedDateChange={setSelectedDate}
          pinned={pinned}
          onPinnedChange={setPinned}
          pinnedBy={pinned ? ["Dr. Amara Okafor"] : undefined}
        />
      }
    >
      <div className="flex h-auto min-h-[300px] w-full flex-col">
        <MetricValue value={rangeType === "day" ? set.data[set.data.length - 1] : mean} unit="bpm" caption={set.caption} />
        <div className="relative flex min-h-[150px] w-full flex-1 items-center justify-center">
          <LineChart height={200} aria-label={`Heart rate, ${set.caption}`} labels={set.labels} series={[{ label: "Heart rate", data: set.data }]} format={(v) => v.toFixed(0)} />
        </div>
        <div className="relative flex w-full items-center justify-center">
          <SegmentedControl<HealthDataRange> size="sm" aria-label="Heart rate period" value={rangeType} onValueChange={setRangeType} options={ranges} />
        </div>
        <StatsFooter max={Math.max(...set.data)} min={Math.min(...set.data)} unit="bpm" />
      </div>
    </HealthDataCard>
  );
}

function EmptyCard({ gathering = false }: { gathering?: boolean }) {
  const [rangeType, setRangeType] = React.useState<HealthDataRange>("day");
  const [selectedDate, setSelectedDate] = React.useState(today);
  return (
    <HealthDataCard
      className="max-w-md min-w-72 flex-1"
      header={<HealthDataCardHeader title={gathering ? "Heart rate variability" : "Respiratory rate"} rangeType={rangeType} selectedDate={selectedDate} onSelectedDateChange={setSelectedDate} />}
    >
      <div className="flex h-auto min-h-[300px] w-full flex-col">
        <MetricValue caption="" />
        <div className="relative flex min-h-[150px] w-full flex-1 items-center justify-center">
          <NoDataChart rangeType={rangeType} deviceName="oura" min={gathering ? 20 : 10} max={gathering ? 100 : 22} isGatheringInsight={gathering} />
        </div>
        <div className="relative flex w-full items-center justify-center">
          <SegmentedControl<HealthDataRange> size="sm" aria-label="Period" value={rangeType} onValueChange={setRangeType} options={ranges} />
        </div>
      </div>
    </HealthDataCard>
  );
}

function ConnectCard() {
  const [pairing, setPairing] = React.useState(false);
  React.useEffect(() => {
    if (!pairing) return;
    const t = setTimeout(() => setPairing(false), 1800);
    return () => clearTimeout(t);
  }, [pairing]);
  return <NotConnected className="max-w-md" title="Blood glucose" providerName="FreeStyle Libre" pairing={pairing} onConnect={() => setPairing(true)} />;
}

function Body() {
  return (
    <>
      <Demo
        id="health-data-card-chart"
        files={["patterns/health-data-card", "ui/chart", "ui/segmented-control"]}
        title="Card with a chart"
        note="The header holds the title, the date navigator and the pin. Below it sit the value, the chart, the range switch and any footer the metric adds. The card takes its width from its parent."
        bare
        className="items-stretch"
      >
        <HeartRateCard />
      </Demo>
      <Demo
        id="health-data-card-loading"
        files={["patterns/health-data-card", "ui/skeleton"]}
        title="Loading"
        note="showLoading swaps the value, unit and caption for placeholders on the first load. isLoading covers the whole card while a new period is fetched. The second card uses the plain title in place of a header."
        bare
        className="items-stretch"
      >
        <HealthDataCard className="max-w-md min-w-72 flex-1" header={<HealthDataCardHeader title="Resting heart rate" />}>
          <div className="flex min-h-[220px] w-full flex-col">
            <MetricValue value={58} unit="bpm" showLoading />
            <Skeleton className="w-full flex-1 rounded-md" />
          </div>
        </HealthDataCard>
        <HealthDataCard className="max-w-md min-w-72 flex-1" title="Sleep duration" isLoading>
          <div className="flex min-h-[220px] w-full flex-col">
            <MetricValue value="7 h 12 min" caption="7-day average" />
            <LineChart height={140} aria-label="Sleep duration over the last week" labels={["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]} series={[{ label: "Hours", data: [7.4, 6.8, 7.1, 7.6, 6.9, 7.3, 7.2] }]} />
          </div>
        </HealthDataCard>
      </Demo>
      <Demo
        id="health-data-card-no-data"
        files={["patterns/health-data-card", "ui/segmented-control"]}
        title="No data"
        note="NoDataChart keeps the axes in place of the chart. It says the device is offline, or shows Gathering insights while the first readings from a new device are processed."
        bare
        className="items-stretch"
      >
        <EmptyCard />
        <EmptyCard gathering />
      </Demo>
      <Demo
        id="health-data-card-not-connected"
        files={["patterns/health-data-card"]}
        title="Not connected"
        note="NotConnected stands in for a card whose source has never been paired. Pressing the device name calls onConnect, and pairing covers the card until it finishes."
        bare
        className="items-stretch"
      >
        <ConnectCard />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "health-data-card",
  title: "Health data card",
  group: "Examples",
  summary:
    "Patient app and provider app. The card behind every wearable and vitals KPI on the patient dashboard, digital twin, action center and the provider's patient chart. Replaces BioVerseCardLayout, CardHeader with KpiDateNavigator and PinUnpinKPI, the KPI value Header, NoDataGraphComponent and NotConnectedProvider.",
  keywords: "kpi bio verse vitals wearable heart rate metric chart pin date navigator range no data not connected device",
  Body,
};
