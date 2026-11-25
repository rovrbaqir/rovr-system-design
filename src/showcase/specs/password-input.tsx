import { PasswordChecklist, PasswordInput, type PasswordInputProps } from "@/components/ui/password-input";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const sizes = ["sm", "md", "lg"] as const;

export const spec: ComponentSpec = {
  slug: "password-input",
  sections: [
    matrix({
      title: "Password input",
      note: "size sets the height. visible shows the password as plain text and swaps the eye for a crossed eye.",
      rows: axis("size", sizes),
      groups: axis("visible", ["false", "true"]),
      states: ["default", "hover", "focus", "invalid", "disabled"],
      target: "input",
      render: (p, s) => (
        <div className="w-52">
          <PasswordInput
            size={p.size as PasswordInputProps["size"]}
            visible={p.visible === "true"}
            defaultValue="Lipid-panel-88"
            aria-label="Password"
            aria-invalid={s.is("invalid") || undefined}
            disabled={s.disabled}
          />
        </div>
      ),
    }),
    matrix({
      title: "Show password button",
      component: "Password input / Toggle",
      note: "The eye is a toggle button inside the field. The states here are the button's own.",
      rows: axis("visible", ["false", "true"]),
      groups: axis("size", sizes),
      states: ["default", "hover", "focus", "pressed", "disabled"],
      target: "button",
      render: (p, s) => (
        <div className="w-44">
          <PasswordInput size={p.size as PasswordInputProps["size"]} visible={p.visible === "true"} defaultValue="Lipid-88" aria-label="Password" disabled={s.disabled} />
        </div>
      ),
    }),
    list({
      title: "Password checklist",
      note: "One row per rule. A met rule gets a filled tick and full-strength text. confirm and email each add a rule.",
      items: [
        { label: "Nothing typed", code: '<PasswordChecklist password="" />', render: () => <PasswordChecklist password="" /> },
        { label: "Partly met", code: '<PasswordChecklist password="lipid88" />', render: () => <PasswordChecklist password="lipid88" /> },
        { label: "All met", code: '<PasswordChecklist password="Lipid-panel-88" />', render: () => <PasswordChecklist password="Lipid-panel-88" /> },
        {
          label: "With email and confirmation",
          code: "<PasswordChecklist password={password} confirm={confirm} email={email} />",
          render: () => <PasswordChecklist password="Lipid-panel-88" confirm="Lipid-panel" email="amara.osei@example.com" />,
        },
        {
          label: "Own rules and title",
          code: '<PasswordChecklist rules={rules} title="A staff PIN must" />',
          render: () => (
            <PasswordChecklist
              password="2041"
              title="A staff PIN must"
              rules={[
                { id: "digits", label: "Be digits only", test: ({ password }) => /^\d+$/.test(password) },
                { id: "length", label: "Be 6 digits long", test: ({ password }) => password.length === 6 },
              ]}
            />
          ),
        },
      ],
    }),
  ],
};
