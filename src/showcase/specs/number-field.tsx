import { NumberField } from "@/components/ui/number-field";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const formats: Record<string, { value: number; step: number; format?: Intl.NumberFormatOptions; label: string }> = {
  number: { value: 3, step: 1, label: "Refills" },
  unit: { value: 2.5, step: 0.5, format: { style: "unit", unit: "milliliter", minimumFractionDigits: 1 }, label: "Dose" },
  currency: { value: 25, step: 5, format: { style: "currency", currency: "USD" }, label: "Copay" },
};

export const spec: ComponentSpec = {
  slug: "number-field",
  sections: [
    matrix({
      title: "Number field",
      note: "format takes Intl.NumberFormat options. Hover is shown on the decrease button. Focus rings the whole field.",
      rows: axis("format", ["number", "unit", "currency"]),
      states: ["default", "hover", "focus", "disabled", "read-only"],
      render: (p, s) => {
        const f = formats[p.format];
        return <NumberField defaultValue={f.value} min={0} step={f.step} format={f.format} disabled={s.disabled} readOnly={s.is("read-only")} aria-label={f.label} className="w-36" />;
      },
    }),
    list({
      title: "Limits and width",
      note: "A stepper button turns off at min or max. The field is 8rem wide unless className says otherwise.",
      items: [
        { label: "At minimum", code: "<NumberField defaultValue={0} min={0} />", render: () => <NumberField defaultValue={0} min={0} max={12} aria-label="Refills" /> },
        { label: "At maximum", code: "<NumberField defaultValue={12} max={12} />", render: () => <NumberField defaultValue={12} min={0} max={12} aria-label="Refills" /> },
        { label: "Empty", code: "<NumberField />", render: () => <NumberField min={1} max={180} aria-label="Tablets" /> },
        {
          label: "Wider",
          code: '<NumberField className="w-36" />',
          render: () => <NumberField defaultValue={20} min={10} max={90} step={5} format={{ style: "unit", unit: "minute" }} aria-label="Visit length" className="w-36" />,
        },
      ],
    }),
  ],
};
