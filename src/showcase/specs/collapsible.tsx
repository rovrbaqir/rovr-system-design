import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { type ComponentSpec, axis, list, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "collapsible",
  sections: [
    matrix({
      title: "Collapsible",
      note: "The chevron points down while the panel is open.",
      rows: axis("open", ["false", "true"]),
      states: ["default", "hover", "focus", "pressed", "disabled"],
      render: (p, s) => (
        <div className="w-72">
          <Collapsible defaultOpen={p.open === "true"} disabled={s.disabled}>
            <CollapsibleTrigger>Previous results</CollapsibleTrigger>
            <CollapsibleContent className="flex flex-col gap-1 text-body-sm text-muted-foreground">
              <span>LDL 162 mg/dL, 14 Aug 2026</span>
              <span>LDL 171 mg/dL, 9 May 2026</span>
            </CollapsibleContent>
          </Collapsible>
        </div>
      ),
    }),
    list({
      title: "Content",
      items: [
        {
          label: "Longer panel",
          code: "<Collapsible defaultOpen>",
          render: () => (
            <div className="w-80">
              <Collapsible defaultOpen>
                <CollapsibleTrigger>Visit instructions</CollapsibleTrigger>
                <CollapsibleContent className="text-body-sm text-muted-foreground">Do not eat or drink anything except water for 10 hours before your blood draw. Take your usual morning medications unless your clinician has told you otherwise.</CollapsibleContent>
              </Collapsible>
            </div>
          ),
        },
      ],
    }),
  ],
};
