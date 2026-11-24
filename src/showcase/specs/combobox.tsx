import { Combobox, type ComboboxItem, MultiCombobox } from "@/components/ui/combobox";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const pharmacies: ComboboxItem[] = [
  { value: "walgreens-market", label: "Walgreens, 825 Market St" },
  { value: "cvs-mission", label: "CVS, 2280 Mission St" },
  { value: "alto", label: "Alto Pharmacy, delivery" },
];

const panels: ComboboxItem[] = [
  { value: "lipid", label: "Lipid panel" },
  { value: "a1c", label: "HbA1c" },
  { value: "cbc", label: "Complete blood count" },
  { value: "tsh", label: "TSH" },
  { value: "cmp", label: "Metabolic panel" },
];

type Size = "sm" | "md" | "lg";
const states = ["default", "hover", "focus", "invalid", "disabled"] as const;
// Hover and focus belong to the field's outer box, not to the text input inside it.
const shell = "div:has(> input[role=combobox])";

export const spec: ComponentSpec = {
  slug: "combobox",
  sections: [
    matrix({
      title: "Combobox",
      note: "The closed field. Once a value is chosen a clear button appears before the chevron. The open list is shown in the examples below.",
      rows: axis("size", ["sm", "md", "lg"]),
      groups: axis("value", ["empty", "filled"]),
      states,
      target: shell,
      render: (p, s) => (
        <div className="w-60">
          <Combobox size={p.size as Size} items={pharmacies} defaultValue={p.value === "filled" ? pharmacies[0] : null} invalid={s.is("invalid")} disabled={s.disabled} placeholder="Search pharmacies" aria-label="Pharmacy" />
        </div>
      ),
    }),
    matrix({
      title: "Multi combobox",
      note: "Each choice becomes a removable chip inside the field.",
      rows: axis("size", ["sm", "md", "lg"]),
      groups: axis("value", ["empty", "filled"]),
      states,
      target: shell,
      render: (p, s) => (
        <div className="w-72">
          <MultiCombobox size={p.size as Size} items={panels} defaultValue={p.value === "filled" ? [panels[0], panels[1]] : []} invalid={s.is("invalid")} disabled={s.disabled} placeholder="Search lab tests" aria-label="Tests to order" />
        </div>
      ),
    }),
    list({
      title: "Content",
      note: "The multi field grows as chips wrap onto new lines.",
      items: [
        {
          label: "Chips wrapping",
          code: "<MultiCombobox defaultValue={[…]} />",
          render: () => (
            <div className="w-72">
              <MultiCombobox items={panels} defaultValue={panels} placeholder="Search lab tests" aria-label="Tests to order" />
            </div>
          ),
        },
        {
          label: "In a field",
          code: "<Field><FieldLabel /><Combobox /></Field>",
          render: () => (
            <div className="w-72">
              <Field>
                <FieldLabel>Preferred pharmacy</FieldLabel>
                <Combobox items={pharmacies} defaultValue={pharmacies[1]} placeholder="Search pharmacies" />
                <FieldDescription>Prescriptions are sent here unless you choose another.</FieldDescription>
              </Field>
            </div>
          ),
        },
        {
          label: "With error text",
          code: "<Combobox invalid />",
          render: () => (
            <div className="flex w-72 flex-col gap-1.5">
              <Combobox items={pharmacies} invalid placeholder="Search pharmacies" aria-label="Pharmacy" />
              <p className="text-body-sm text-destructive-fg">Choose a pharmacy so we know where to send the prescription.</p>
            </div>
          ),
        },
      ],
    }),
  ],
};
