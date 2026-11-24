import { FlaskConical, Pill, Stethoscope } from "lucide-react";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { type ComponentSpec, axis, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "timeline",
  sections: [
    matrix({
      title: "Timeline",
      note: "Newest first. emphasis marks the entry to notice first, such as the latest one.",
      rows: axis("icon", ["false", "true"]),
      states: ["default"],
      render: (p) => {
        const icons = p.icon === "true";
        return (
          <div className="w-96">
            <Timeline>
              <TimelineItem emphasis time="12 Nov, 10:52" title="Atorvastatin increased to 20 mg" icon={icons ? <Pill /> : undefined}>
                LDL still above target. Repeat lipid panel in 8 weeks.
              </TimelineItem>
              <TimelineItem time="12 Nov, 08:15" title="Lipid panel resulted" icon={icons ? <FlaskConical /> : undefined}>
                Total cholesterol 212 mg/dL, LDL 131 mg/dL.
              </TimelineItem>
              <TimelineItem time="14 Aug, 09:30" title="Annual physical with Dr. Okafor" icon={icons ? <Stethoscope /> : undefined} />
            </Timeline>
          </div>
        );
      },
    }),
    matrix({
      title: "Timeline item",
      note: "Without an icon the marker is a dot. The last item in a timeline has no connecting line, as shown here.",
      rows: axis("emphasis", ["false", "true"]),
      groups: axis("icon", ["false", "true"]),
      states: ["title", "details"],
      render: (p, s) => (
        <div className="w-80">
          <Timeline>
            <TimelineItem emphasis={p.emphasis === "true"} time="12 Nov, 08:15" title="Lipid panel resulted" icon={p.icon === "true" ? <FlaskConical /> : undefined}>
              {s.is("details") ? "Total cholesterol 212 mg/dL, LDL 131 mg/dL." : undefined}
            </TimelineItem>
          </Timeline>
        </div>
      ),
    }),
  ],
};
