import { ClampText } from "@/components/ui/clamp-text";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const note =
  "Follow-up for hyperlipidaemia. LDL 131 mg/dL on 12 November, down from 148 in August. Tolerating atorvastatin 20 mg with no muscle pain. Advised to continue the current dose and recheck the lipid panel in 12 weeks.";

export const spec: ComponentSpec = {
  slug: "clamp-text",
  sections: [
    matrix({
      title: "Clamp text",
      note: "lines sets where the text is cut. The states are the button's; expanded shows the whole text.",
      rows: axis("lines", ["1", "2", "3"]),
      states: ["default", "hover", "focus", "pressed", "expanded"],
      render: (p, s) => (
        <ClampText key={s.name} lines={Number(p.lines)} defaultExpanded={s.is("expanded")} className="w-64 text-body-sm">
          {note}
        </ClampText>
      ),
    }),
    list({
      title: "Content",
      items: [
        {
          label: "Text that fits",
          code: "<ClampText lines={3}>Headache for three days.</ClampText>",
          render: () => (
            <ClampText className="w-64 text-body-sm">Headache for three days. No fever.</ClampText>
          ),
        },
        {
          label: "Own labels",
          code: '<ClampText moreLabel="Read the full note" />',
          render: () => (
            <ClampText lines={2} moreLabel="Read the full note" className="w-64 text-body-sm">
              {note}
            </ClampText>
          ),
        },
      ],
    }),
  ],
};
