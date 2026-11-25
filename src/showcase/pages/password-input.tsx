import * as React from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { PasswordChecklist, PasswordInput, type PasswordRule, isPasswordValid } from "@/components/ui/password-input";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function CreatePassword() {
  const email = "amara.osei@example.com";
  const [password, setPassword] = React.useState("Lipid");
  const [confirm, setConfirm] = React.useState("");
  const rulesId = React.useId();
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Field>
        <FieldLabel>New password</FieldLabel>
        <PasswordInput autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby={rulesId} />
      </Field>
      <Field>
        <FieldLabel>Confirm password</FieldLabel>
        <PasswordInput autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} toggleLabel="Show confirmation" />
      </Field>
      <PasswordChecklist id={rulesId} password={password} confirm={confirm} email={email} />
      <Button className="self-start" disabled={!isPasswordValid({ password, confirm, email })}>
        Create account
      </Button>
    </div>
  );
}

function StaffPassword() {
  const staffRules: PasswordRule[] = [
    { id: "length", label: "Be at least 12 characters", test: ({ password }) => password.length >= 12 },
    { id: "symbol", label: "Have at least one symbol", test: ({ password }) => /[^A-Za-z0-9]/.test(password) },
    { id: "clinic", label: "Not contain the clinic name", test: ({ password }) => password.length > 0 && !/harbor/i.test(password) },
  ];
  const [password, setPassword] = React.useState("HarborView2026");
  const rulesId = React.useId();
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <Field>
        <FieldLabel>Staff password</FieldLabel>
        <PasswordInput autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} aria-describedby={rulesId} />
      </Field>
      <PasswordChecklist id={rulesId} password={password} rules={staffRules} title="A staff password must" />
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="password-input-default" files={["ui/password-input", "ui/field"]} title="Show and hide" note="The eye is a real button. Press it, or Tab to it and press Space, to read the password back. It is a toggle, so screen readers hear whether it is pressed." className="items-start">
        <Field className="max-w-sm">
          <FieldLabel>Password</FieldLabel>
          <PasswordInput defaultValue="Lipid-panel-88" />
        </Field>
      </Demo>
      <Demo id="password-input-checklist" files={["ui/password-input", "ui/field", "ui/button"]} title="With the rule list" note="PasswordChecklist ticks each rule as it is met. Passing confirm adds the match rule and passing email adds the email rule. isPasswordValid gives the same answer for the submit button." className="items-start">
        <CreatePassword />
      </Demo>
      <Demo id="password-input-custom-rules" files={["ui/password-input", "ui/field"]} title="Your own rules" note="Pass rules to replace the defaults. Each label finishes the sentence started by the title." className="items-start">
        <StaffPassword />
      </Demo>
      <Demo id="password-input-sizes" files={["ui/password-input"]} title="Sizes" note="Medium is the default. Large suits sign-in and kiosk screens." className="flex-col items-stretch">
        <PasswordInput size="sm" aria-label="Password, small" placeholder="Small" className="max-w-sm" />
        <PasswordInput aria-label="Password, medium" placeholder="Medium" className="max-w-sm" />
        <PasswordInput size="lg" aria-label="Password, large" placeholder="Large" className="max-w-sm" />
      </Demo>
      <Demo id="password-input-states" files={["ui/password-input", "ui/field"]} title="Invalid and disabled" note="Set aria-invalid for a wrong password and say what to do next. A disabled field also disables the eye." className="items-start">
        <Field invalid className="max-w-sm">
          <FieldLabel>Current password</FieldLabel>
          <PasswordInput aria-invalid defaultValue="lipid88" />
          <FieldError match>That password is not right. Try again or reset it.</FieldError>
        </Field>
        <Field disabled className="max-w-sm">
          <FieldLabel>Password</FieldLabel>
          <PasswordInput disabled defaultValue="Lipid-panel-88" />
          <FieldDescription>You sign in through your employer, so there is no password to change here.</FieldDescription>
        </Field>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "password-input",
  title: "Password input",
  group: "Components",
  summary: "A password field with a button that shows or hides what was typed, and PasswordChecklist, the list of rules that tick as a new password meets them.",
  keywords: "password show hide eye reveal strength rules checklist sign in",
  Body,
};
