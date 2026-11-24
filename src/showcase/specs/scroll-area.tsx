import { ScrollArea } from "@/components/ui/scroll-area";
import { type ComponentSpec, axis, matrix } from "./kit";

const waiting = [
  ["Amara Osei", "Follow-up · Room 2", "09:00"],
  ["Daniel Reyes", "Lab review · Video", "09:30"],
  ["Priya Raman", "Annual physical · Room 1", "10:15"],
  ["Tomás Lindqvist", "Same-day sick visit · Room 2", "11:00"],
  ["Grace Mbeki", "New patient · Room 3", "13:00"],
  ["Noah Feldman", "Medication review · Video", "13:45"],
  ["Sofia Marchetti", "Follow-up · Room 1", "14:15"],
] as const;

export const spec: ComponentSpec = {
  slug: "scroll-area",
  sections: [
    matrix({
      title: "Scroll area",
      note: "Give it a height. The thin scrollbar only shows while the pointer is over the area or it is scrolling, so it is not drawn here.",
      rows: axis("content", ["list", "text"]),
      states: ["default"],
      render: (p) =>
        p.content === "list" ? (
          <ScrollArea className="h-56 w-80 rounded-lg border border-border">
            <ul className="flex flex-col p-1.5">
              {waiting.map(([name, visit, time]) => (
                <li key={name} className="flex items-center justify-between gap-4 rounded-md px-2.5 py-2">
                  <span className="flex flex-col">
                    <span className="text-label">{name}</span>
                    <span className="text-caption text-muted-foreground">{visit}</span>
                  </span>
                  <span className="text-body-sm text-muted-foreground text-data">{time}</span>
                </li>
              ))}
            </ul>
          </ScrollArea>
        ) : (
          <ScrollArea className="h-56 w-80 rounded-lg bg-surface-sunken">
            <div className="flex flex-col gap-3 p-4 text-body-sm">
              <p className="text-title-sm">Visit note, 12 November 2026</p>
              <p>Amara Osei, 38, seen for follow-up of hyperlipidaemia. She reports taking atorvastatin 10 mg every morning with no missed doses and no muscle pain.</p>
              <p>Blood pressure 118/76 mmHg, resting heart rate 61 bpm, weight 72.4 kg. Examination unremarkable.</p>
              <p>Plan: increase atorvastatin to 20 mg daily. Repeat lipid panel in 8 weeks.</p>
            </div>
          </ScrollArea>
        ),
    }),
  ],
};
