import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { type ComponentSpec, type SpecState, axis, list, matrix } from "./kit";

const values = ["unchecked", "checked", "indeterminate"] as const;
const states = ["default", "hover", "focus", "pressed", "disabled", "invalid"] as const;

function Box({ value, state }: { value: string; state: SpecState }) {
  const box = <Checkbox defaultChecked={value === "checked"} indeterminate={value === "indeterminate"} disabled={state.disabled} aria-label="Share result" />;
  // Inside an invalid Field the checkbox gets data-invalid, which is what turns the border red.
  return state.is("invalid") ? (
    <Field invalid className="w-auto">
      {box}
    </Field>
  ) : (
    box
  );
}

export const spec: ComponentSpec = {
  slug: "checkbox",
  sections: [
    matrix({
      title: "Checkbox",
      note: "checked and indeterminate set the value. Invalid comes from the Field around it.",
      rows: axis("value", values),
      states,
      render: (p, s) => <Box value={p.value} state={s} />,
    }),
    matrix({
      title: "Checkbox with label",
      note: "Wrap the checkbox and its text in a label so the text is clickable too.",
      rows: axis("value", values),
      states,
      render: (p, s) => (
        <label className={`flex items-center gap-3 text-body ${s.disabled ? "text-muted-foreground" : ""}`}>
          <Box value={p.value} state={s} /> Lipid panel, 12 Nov
        </label>
      ),
    }),
    list({
      title: "Content",
      note: "Long labels wrap next to the box, which stays on the first line. Error text sits under the label.",
      items: [
        {
          label: "Multi-line label",
          code: '<label className="flex items-start gap-3">',
          render: () => (
            <label className="flex w-72 items-start gap-3 text-body">
              <Checkbox defaultChecked />
              <span>I agree to a video visit and understand it is not for emergencies.</span>
            </label>
          ),
        },
        {
          label: "With description",
          code: "<Checkbox /> label + description",
          render: () => (
            <label className="flex w-72 items-start gap-3 text-body">
              <Checkbox defaultChecked />
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">Share with Dr. Okafor</span>
                <span className="text-body-sm text-muted-foreground">Your clinician sees new lab results as soon as they arrive.</span>
              </span>
            </label>
          ),
        },
        {
          label: "With error text",
          code: "<Field invalid><Checkbox /></Field>",
          render: () => (
            <div className="flex w-72 flex-col gap-2">
              <label className="flex items-start gap-3 text-body">
                <Field invalid className="w-auto">
                  <Checkbox />
                </Field>
                <span>I agree to a video visit and understand it is not for emergencies.</span>
              </label>
              <p className="pl-8 text-body-sm text-destructive-fg">Tick the box to confirm before you join.</p>
            </div>
          ),
        },
        {
          label: "Select all",
          code: "<Checkbox indeterminate />",
          render: () => (
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 text-body font-medium">
                <Checkbox indeterminate /> Share all results
              </label>
              <div className="flex flex-col gap-3 pl-8">
                <label className="flex items-center gap-3 text-body">
                  <Checkbox defaultChecked /> Lipid panel, 12 Nov
                </label>
                <label className="flex items-center gap-3 text-body">
                  <Checkbox /> HbA1c, 12 Nov
                </label>
              </div>
            </div>
          ),
        },
      ],
    }),
  ],
};
