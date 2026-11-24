import { Phone, Video } from "lucide-react";
import { Toggle, ToggleGroup } from "@/components/ui/toggle-group";
import { type ComponentSpec, axis, list, matrix } from "./kit";

export const spec: ComponentSpec = {
  slug: "toggle-group",
  sections: [
    matrix({
      title: "Toggle",
      note: "One on/off button. The pressed prop is the on value, and the Pressed column is the moment the pointer is held down.",
      rows: axis("pressed", ["false", "true"]),
      groups: axis("icon", ["false", "true"]),
      states: ["default", "hover", "focus", "pressed", "disabled"],
      render: (p, s) => (
        <Toggle defaultPressed={p.pressed === "true"} disabled={s.disabled}>
          {p.icon === "true" && <Video />}
          Video
        </Toggle>
      ),
    }),
    list({
      title: "Toggle group",
      note: "One value at a time by default. multiple lets several be on at once.",
      items: [
        {
          label: "Single",
          code: '<ToggleGroup defaultValue={["video"]}>',
          render: () => (
            <ToggleGroup defaultValue={["video"]} aria-label="Visit format">
              <Toggle value="video">
                <Video /> Video
              </Toggle>
              <Toggle value="phone">
                <Phone /> Phone
              </Toggle>
              <Toggle value="clinic">In clinic</Toggle>
            </ToggleGroup>
          ),
        },
        {
          label: "Multiple",
          code: '<ToggleGroup multiple defaultValue={["mon", "wed", "thu"]}>',
          render: () => (
            <ToggleGroup multiple defaultValue={["mon", "wed", "thu"]} aria-label="Clinic days">
              <Toggle value="mon">Mon</Toggle>
              <Toggle value="tue">Tue</Toggle>
              <Toggle value="wed">Wed</Toggle>
              <Toggle value="thu">Thu</Toggle>
              <Toggle value="fri">Fri</Toggle>
            </ToggleGroup>
          ),
        },
        {
          label: "None selected",
          code: "<ToggleGroup multiple>",
          render: () => (
            <ToggleGroup multiple aria-label="Claim status">
              <Toggle value="submitted">Submitted</Toggle>
              <Toggle value="in-review">In review</Toggle>
              <Toggle value="paid">Paid</Toggle>
              <Toggle value="denied">Denied</Toggle>
            </ToggleGroup>
          ),
        },
        {
          label: "One option disabled",
          code: '<Toggle value="sun" disabled>',
          render: () => (
            <ToggleGroup multiple defaultValue={["sat"]} aria-label="Weekend cover">
              <Toggle value="sat">Sat</Toggle>
              <Toggle value="sun" disabled>
                Sun
              </Toggle>
            </ToggleGroup>
          ),
        },
        {
          label: "Group disabled",
          code: "<ToggleGroup multiple disabled>",
          render: () => (
            <ToggleGroup multiple disabled defaultValue={["mon", "tue"]} aria-label="Locked clinic days">
              <Toggle value="mon">Mon</Toggle>
              <Toggle value="tue">Tue</Toggle>
              <Toggle value="wed">Wed</Toggle>
            </ToggleGroup>
          ),
        },
        {
          label: "Wrapping",
          code: '<ToggleGroup className="w-64">',
          render: () => (
            <ToggleGroup multiple defaultValue={["in-review"]} aria-label="Claim status" className="w-64">
              <Toggle value="submitted">Submitted</Toggle>
              <Toggle value="in-review">In review</Toggle>
              <Toggle value="paid">Paid</Toggle>
              <Toggle value="denied">Denied</Toggle>
              <Toggle value="appealed">Appealed</Toggle>
            </ToggleGroup>
          ),
        },
      ],
    }),
  ],
};
