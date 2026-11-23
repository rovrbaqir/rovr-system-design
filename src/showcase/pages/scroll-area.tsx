import { Avatar } from "@/components/ui/avatar";
import { List, ListItem } from "@/components/ui/list";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const waiting = [
  ["Amara Osei", "Follow-up · Room 2", "09:00"],
  ["Daniel Reyes", "Lab review · Video", "09:30"],
  ["Priya Raman", "Annual physical · Room 1", "10:15"],
  ["Tomás Lindqvist", "Same-day sick visit · Room 2", "11:00"],
  ["Grace Mbeki", "New patient · Room 3", "13:00"],
  ["Noah Feldman", "Medication review · Video", "13:45"],
  ["Sofia Marchetti", "Follow-up · Room 1", "14:15"],
  ["Jun Watanabe", "Blood pressure check · Room 2", "15:00"],
  ["Elise Moreau", "Vaccination · Room 3", "15:30"],
] as const;

function Body() {
  return (
    <>
      <Demo id="scroll-area-list" files={["ui/scroll-area", "ui/list", "ui/avatar"]} title="A long list in a fixed height" note="Give the scroll area a height. The thin scrollbar appears while you hover or scroll and fades out afterwards, so it never sits over the content." className="items-start">
        <ScrollArea className="h-72 w-full max-w-md rounded-lg border border-border">
          <List className="p-1.5">
            {waiting.map(([name, visit, time]) => (
              <ListItem key={name} href="#/scroll-area" leading={<Avatar name={name} size="sm" />} title={name} description={visit} trailing={<span className="text-data">{time}</span>} />
            ))}
          </List>
        </ScrollArea>
      </Demo>
      <Demo id="scroll-area-text" files={["ui/scroll-area"]} title="Long text" note="For consent text, visit notes and other reading that must stay inside a panel. Scrolling stops at the ends instead of moving the page behind it." className="items-start">
        <ScrollArea className="h-48 w-full max-w-xl rounded-lg bg-surface-sunken">
          <div className="flex flex-col gap-3 p-4 text-body-sm">
            <p className="text-title-sm">Visit note, 12 November 2026</p>
            <p>Amara Osei, 38, seen for follow-up of hyperlipidaemia. She reports taking atorvastatin 10 mg every morning with no missed doses and no muscle pain.</p>
            <p>Blood pressure 118/76 mmHg, resting heart rate 61 bpm, weight 72.4 kg. Examination unremarkable.</p>
            <p>Fasting lipid panel from this morning: total cholesterol 212 mg/dL, LDL 131 mg/dL, HDL 58 mg/dL, triglycerides 114 mg/dL. LDL remains above target.</p>
            <p>Plan: increase atorvastatin to 20 mg daily. Continue diet and exercise as discussed. Repeat lipid panel in 8 weeks. Patient to message the clinic if she notices muscle aches or dark urine.</p>
            <p className="text-muted-foreground">Signed by Dr. Ngozi Okafor, Internal medicine, 12 Nov 2026 at 10:52.</p>
          </div>
        </ScrollArea>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "scroll-area",
  title: "Scroll area",
  group: "Components",
  summary: "A region that scrolls inside a fixed height with a thin scrollbar that shows only while in use. Use it for long lists and text inside panels, sheets and cards.",
  keywords: "scrollbar overflow scroll container viewport",
  Body,
};
