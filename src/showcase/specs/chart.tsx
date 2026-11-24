import { BarChart, DonutChart, LineChart, Sparkline } from "@/components/ui/chart";
import { type ComponentSpec, axis, matrix } from "./kit";

const weeks = ["Sep 7", "Sep 14", "Sep 21", "Sep 28", "Oct 5", "Oct 12", "Oct 19", "Oct 26", "Nov 2", "Nov 9", "Nov 16", "Nov 23"];
const visits = [
  { label: "In clinic", data: [212, 224, 198, 236, 241, 229, 252, 248, 263, 259, 271, 284] },
  { label: "Video", data: [96, 104, 118, 121, 137, 142, 139, 158, 163, 171, 186, 192] },
  { label: "Phone", data: [41, 38, 44, 36, 39, 33, 35, 31, 28, 30, 26, 24] },
];
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
const trends: Record<string, number[]> = {
  falling: [66, 65, 66, 64, 63, 64, 62, 62, 61],
  rising: [118, 119, 121, 120, 123, 124, 126, 125, 128],
  steady: [72, 73, 72, 72, 73, 72, 73, 72, 72],
};

export const spec: ComponentSpec = {
  slug: "chart",
  sections: [
    matrix({
      title: "Line chart",
      note: "A single series gets a soft area wash by default. Two or more get a legend. Colour follows the series order.",
      rows: axis("series", ["1", "2", "3"]),
      groups: axis("area", ["false", "true"]),
      states: ["default"],
      render: (p) => (
        <div className="w-[26rem]">
          <LineChart aria-label="Visits per week" labels={weeks} series={visits.slice(0, Number(p.series))} area={p.area === "true"} />
        </div>
      ),
    }),
    matrix({
      title: "Bar chart",
      note: "highlight is the index of the one bar to emphasise; the rest recede.",
      rows: axis("highlight", ["none", "3"]),
      states: ["default"],
      render: (p) => (
        <div className="w-[26rem]">
          <BarChart aria-label="Visits" data={byDay} highlight={p.highlight === "none" ? undefined : Number(p.highlight)} />
        </div>
      ),
    }),
    matrix({
      title: "Donut chart",
      note: "Two to five parts of one whole. The centre holds the total or the headline share.",
      rows: axis("parts", ["2", "4"]),
      groups: axis("size", ["120", "148"]),
      states: ["default"],
      render: (p) => {
        const data = payers.slice(0, Number(p.parts));
        const total = data.reduce((sum, d) => sum + d.value, 0);
        return (
          <div className="w-[24rem]">
            <DonutChart aria-label="Claims by payer" data={data} size={Number(p.size)}>
              <p className="text-xl leading-none font-semibold tracking-tight text-data">{total.toLocaleString("en-US")}</p>
              <p className="mt-1 text-caption text-muted-foreground">claims</p>
            </DonutChart>
          </div>
        );
      },
    }),
    matrix({
      title: "Sparkline",
      note: "A trend beside a number. No axes and no tooltip.",
      rows: axis("trend", ["falling", "rising", "steady"]),
      groups: axis("size", ["72x24", "96x28"]),
      states: ["default"],
      render: (p) => {
        const [width, height] = p.size.split("x").map(Number);
        return <Sparkline data={trends[p.trend]} width={width} height={height} aria-label={`Resting heart rate, ${p.trend} over 30 days`} />;
      },
    }),
  ],
};
