import { EditableField, type EditableFieldProps } from "@/components/ui/editable-field";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const sizes = ["sm", "md", "lg"] as const;
const save = () => {};

export const spec: ComponentSpec = {
  slug: "editable-field",
  sections: [
    matrix({
      title: "Editable field",
      note: "At rest: the value as text with a pencil button. Hover, focus and pressed are the pencil's states. A disabled field has no pencil.",
      rows: axis("size", sizes),
      groups: axis("value", ["filled", "empty"]),
      states: ["default", "hover", "focus", "pressed", "disabled"],
      target: "button",
      render: (p, s) => (
        <EditableField size={p.size as EditableFieldProps["size"]} label="Preferred name" value={p.value === "filled" ? "Amara Osei" : ""} onSave={save} disabled={s.disabled} />
      ),
    }),
    matrix({
      title: "Editable field, editing",
      component: "Editable field / Editing",
      note: "After the pencil is pressed: an input with Save and Cancel. Focus is the input's state. While onSave runs, Save shows a spinner; if it fails, the error appears under the input.",
      rows: axis("size", sizes),
      states: ["default", "focus"],
      target: "input",
      render: (p) => (
        <div className="w-96">
          <EditableField defaultEditing size={p.size as EditableFieldProps["size"]} label="Preferred name" value="Amara Osei" onSave={save} />
        </div>
      ),
    }),
    list({
      title: "Content",
      note: "type and mask choose the input used while editing and how the value reads at rest.",
      items: [
        { label: "Masked phone", code: '<EditableField type="tel" mask="(___) ___-____" />', render: () => <EditableField label="Mobile number" type="tel" mask="(___) ___-____" value="4155550142" onSave={save} /> },
        { label: "Password", code: '<EditableField type="password" />', render: () => <EditableField label="Password" type="password" value="Lipid-panel-88" onSave={save} /> },
        { label: "Empty text", code: '<EditableField value="" emptyText="No one added yet" />', render: () => <EditableField label="Emergency contact" value="" emptyText="No one added yet" onSave={save} /> },
        {
          label: "Long value",
          code: "<EditableField value={address} />",
          render: () => (
            <div className="w-64">
              <EditableField label="Pharmacy" value="Harbor View Pharmacy, 2100 Webster St, San Francisco" onSave={save} />
            </div>
          ),
        },
        {
          label: "Editing a password",
          code: '<EditableField type="password" defaultEditing />',
          render: () => (
            <div className="w-96">
              <EditableField defaultEditing label="Password" type="password" value="Lipid-panel-88" onSave={save} />
            </div>
          ),
        },
      ],
    }),
  ],
};
