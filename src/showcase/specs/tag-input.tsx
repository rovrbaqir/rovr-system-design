import * as React from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { TagInput } from "@/components/ui/tag-input";
import { type ComponentSpec, axis, list, matrix } from "./kit";

function Tags({ initial, placeholder, label }: { initial: string[]; placeholder: string; label: string }) {
  const [value, setValue] = React.useState(initial);
  return <TagInput aria-label={label} value={value} onValueChange={setValue} placeholder={placeholder} />;
}

export const spec: ComponentSpec = {
  slug: "tag-input",
  sections: [
    matrix({
      title: "Tag input",
      note: "Enter or comma adds a tag and Backspace removes the last one. The placeholder shows only while there are no tags.",
      rows: axis("value", ["empty", "filled"]),
      states: ["default", "hover", "focus"],
      // Hover and focus belong to the field's outer box, not to the text input inside it.
      target: "div:has(> input)",
      render: (p) => (
        <div className="w-72">
          <Tags initial={p.value === "filled" ? ["Penicillin", "Latex"] : []} placeholder="Type an allergy and press Enter" label="Allergies" />
        </div>
      ),
    }),
    list({
      title: "Content",
      note: "The field grows as tags wrap onto new lines.",
      items: [
        {
          label: "One tag",
          code: '<TagInput value={["Penicillin"]} />',
          render: () => (
            <div className="w-72">
              <Tags initial={["Penicillin"]} placeholder="Type an allergy and press Enter" label="Allergies" />
            </div>
          ),
        },
        {
          label: "Tags wrapping",
          code: "<TagInput value={[…]} />",
          render: () => (
            <div className="w-72">
              <Tags initial={["E11.9", "I10", "E78.5", "J45.909", "K21.9", "M54.5"]} placeholder="Add an ICD-10 code" label="Diagnosis codes" />
            </div>
          ),
        },
        {
          label: "In a field",
          code: "<Field><FieldLabel /><TagInput /></Field>",
          render: () => (
            <div className="w-72">
              <Field>
                <FieldLabel>Allergies</FieldLabel>
                <Tags initial={["Penicillin", "Latex"]} placeholder="Type an allergy and press Enter" label="Allergies" />
                <FieldDescription>Include reactions to medications, foods and materials.</FieldDescription>
              </Field>
            </div>
          ),
        },
      ],
    }),
  ],
};
