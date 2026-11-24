import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const states = ["default", "hover", "focus", "pressed", "disabled"] as const;

export const spec: ComponentSpec = {
  slug: "radio-group",
  sections: [
    matrix({
      title: "Radio",
      note: "One option. It is checked when its value matches the group's value.",
      rows: axis("checked", ["false", "true"]),
      states,
      render: (p, s) => (
        <RadioGroup defaultValue={p.checked === "true" ? "video" : "clinic"} aria-label="Visit format">
          <Radio value="video" disabled={s.disabled} aria-label="Video visit" />
        </RadioGroup>
      ),
    }),
    matrix({
      title: "Radio with label",
      note: "Wrap the radio and its text in a label so the text is clickable too.",
      rows: axis("checked", ["false", "true"]),
      states,
      render: (p, s) => (
        <RadioGroup defaultValue={p.checked === "true" ? "video" : "clinic"} aria-label="Visit format">
          <label className={`flex items-center gap-3 text-body ${s.disabled ? "text-muted-foreground" : ""}`}>
            <Radio value="video" disabled={s.disabled} /> Video visit
          </label>
        </RadioGroup>
      ),
    }),
    list({
      title: "Radio group",
      note: "Stacked by default. A short set of short labels can sit in a row.",
      items: [
        {
          label: "Vertical",
          code: '<RadioGroup defaultValue="video">',
          render: () => (
            <RadioGroup defaultValue="video" aria-label="Visit format">
              <label className="flex items-center gap-3 text-body">
                <Radio value="video" /> Video visit
              </label>
              <label className="flex items-center gap-3 text-body">
                <Radio value="clinic" /> In clinic
              </label>
              <label className="flex items-center gap-3 text-body">
                <Radio value="phone" /> Phone call
              </label>
            </RadioGroup>
          ),
        },
        {
          label: "Horizontal",
          code: '<RadioGroup className="flex-row flex-wrap gap-6">',
          render: () => (
            <RadioGroup defaultValue="email" aria-label="Send reminders by" className="flex-row flex-wrap gap-6">
              <label className="flex items-center gap-3 text-body">
                <Radio value="email" /> Email
              </label>
              <label className="flex items-center gap-3 text-body">
                <Radio value="text" /> Text message
              </label>
              <label className="flex items-center gap-3 text-body">
                <Radio value="none" /> None
              </label>
            </RadioGroup>
          ),
        },
        {
          label: "With descriptions",
          code: "<Radio /> label + description",
          render: () => (
            <RadioGroup defaultValue="video" aria-label="Visit format" className="w-72 gap-4">
              <label className="flex items-start gap-3 text-body">
                <Radio value="video" />
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium">Video visit</span>
                  <span className="text-body-sm text-muted-foreground">Join from your phone or computer. Usually 20 minutes.</span>
                </span>
              </label>
              <label className="flex items-start gap-3 text-body">
                <Radio value="clinic" />
                <span className="flex flex-col gap-0.5">
                  <span className="font-medium">In clinic</span>
                  <span className="text-body-sm text-muted-foreground">Mission St Clinic. Arrive 10 minutes early.</span>
                </span>
              </label>
            </RadioGroup>
          ),
        },
        {
          label: "One option disabled",
          code: '<Radio value="phone" disabled />',
          render: () => (
            <RadioGroup defaultValue="video" aria-label="Visit format">
              <label className="flex items-center gap-3 text-body">
                <Radio value="video" /> Video visit
              </label>
              <label className="flex items-center gap-3 text-body">
                <Radio value="clinic" /> In clinic
              </label>
              <label className="flex items-center gap-3 text-body text-muted-foreground">
                <Radio value="phone" disabled /> Phone call, not offered for new patients
              </label>
            </RadioGroup>
          ),
        },
        {
          label: "Group disabled",
          code: "<RadioGroup disabled>",
          render: () => (
            <RadioGroup defaultValue="email" disabled aria-label="Send reminders by">
              <label className="flex items-center gap-3 text-body text-muted-foreground">
                <Radio value="email" /> Email
              </label>
              <label className="flex items-center gap-3 text-body text-muted-foreground">
                <Radio value="text" /> Text message
              </label>
            </RadioGroup>
          ),
        },
      ],
    }),
  ],
};
