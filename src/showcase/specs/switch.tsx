import { Switch } from "@/components/ui/switch";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const states = ["default", "hover", "focus", "pressed", "disabled"] as const;

export const spec: ComponentSpec = {
  slug: "switch",
  sections: [
    matrix({
      title: "Switch",
      note: "The thumb stretches while pressed. A switch takes effect at once, with no save step.",
      rows: axis("checked", ["false", "true"]),
      states,
      render: (p, s) => <Switch defaultChecked={p.checked === "true"} disabled={s.disabled} aria-label="Appointment reminders" />,
    }),
    matrix({
      title: "Switch with label",
      note: "The label names the setting and does not change with the value.",
      rows: axis("checked", ["false", "true"]),
      states,
      render: (p, s) => (
        <label className={`flex items-center gap-3 text-body ${s.disabled ? "text-muted-foreground" : ""}`}>
          <Switch defaultChecked={p.checked === "true"} disabled={s.disabled} /> Appointment reminders
        </label>
      ),
    }),
    list({
      title: "Content",
      note: "In a settings row the label sits on the left and the switch on the right.",
      items: [
        {
          label: "Label after",
          code: "<label><Switch /> Text</label>",
          render: () => (
            <label className="flex items-center gap-3 text-body">
              <Switch defaultChecked /> Refill reminders
            </label>
          ),
        },
        {
          label: "Settings row",
          code: '<label className="flex justify-between">',
          render: () => (
            <label className="flex w-80 items-center justify-between gap-6 text-body">
              <span className="font-medium">Lab result alerts</span>
              <Switch defaultChecked />
            </label>
          ),
        },
        {
          label: "With description",
          code: "label + description + <Switch />",
          render: () => (
            <label className="flex w-80 items-start justify-between gap-6 text-body">
              <span className="flex flex-col gap-0.5">
                <span className="font-medium">Share with my care team</span>
                <span className="text-body-sm text-muted-foreground">Clinicians at Mission St Clinic can see your home readings.</span>
              </span>
              <Switch />
            </label>
          ),
        },
      ],
    }),
  ],
};
