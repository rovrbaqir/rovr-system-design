import * as React from "react";
import { EditableField } from "@/components/ui/editable-field";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-center gap-x-6 gap-y-1 border-b border-border py-2 last:border-b-0 sm:grid-cols-[10rem_minmax(0,1fr)]">
      <span className="text-label text-muted-foreground">{label}</span>
      {children}
    </div>
  );
}

function PersonalDetails() {
  const [name, setName] = React.useState("Amara Osei");
  const [pharmacy, setPharmacy] = React.useState("Harbor View Pharmacy, 2100 Webster St");
  return (
    <div className="w-full max-w-xl">
      <Row label="Preferred name">
        <EditableField label="Preferred name" value={name} onSave={setName} />
      </Row>
      <Row label="Pharmacy">
        <EditableField label="Pharmacy" value={pharmacy} onSave={setPharmacy} />
      </Row>
    </div>
  );
}

function SavedToServer() {
  const [email, setEmail] = React.useState("amara.osei@example.com");
  return (
    <div className="w-full max-w-xl">
      <Row label="Email">
        <EditableField
          label="Email"
          type="email"
          value={email}
          onSave={async (next) => {
            await new Promise((resolve) => setTimeout(resolve, 1200));
            setEmail(next);
          }}
        />
      </Row>
      <Row label="Member ID">
        <EditableField
          label="Member ID"
          value="RVR-2041-88317"
          onSave={async () => {
            await new Promise((resolve) => setTimeout(resolve, 900));
            throw new Error("Your plan sets this ID. Contact support to change it.");
          }}
        />
      </Row>
    </div>
  );
}

function ContactAndSecurity() {
  const [phone, setPhone] = React.useState("4155550142");
  const [password, setPassword] = React.useState("Lipid-panel-88");
  return (
    <div className="w-full max-w-xl">
      <Row label="Mobile number">
        <EditableField label="Mobile number" type="tel" mask="(___) ___-____" value={phone} onSave={setPhone} />
      </Row>
      <Row label="Password">
        <EditableField label="Password" type="password" value={password} onSave={setPassword} />
      </Row>
    </div>
  );
}

function EmptyAndLocked() {
  const [contact, setContact] = React.useState("");
  return (
    <div className="w-full max-w-xl">
      <Row label="Emergency contact">
        <EditableField label="Emergency contact" value={contact} onSave={setContact} emptyText="No one added yet" placeholder="Full name" />
      </Row>
      <Row label="Date of birth">
        <EditableField label="Date of birth" value="14 Apr 1988" onSave={() => {}} disabled />
      </Row>
    </div>
  );
}

function Sizes() {
  const [values, setValues] = React.useState({ sm: "Dr. Lena Ortiz", md: "Dr. Lena Ortiz", lg: "Dr. Lena Ortiz" });
  return (
    <>
      {(["sm", "md", "lg"] as const).map((size) => (
        <EditableField key={size} size={size} label={`Primary clinician, ${size}`} value={values[size]} onSave={(next) => setValues((all) => ({ ...all, [size]: next }))} className="max-w-md" />
      ))}
    </>
  );
}

function Body() {
  return (
    <>
      <Demo id="editable-field-default" files={["ui/editable-field"]} title="Edit in place" note="Press the pencil to edit. Enter or Save keeps the change, Escape or Cancel drops it. Focus moves into the input and returns to the pencil afterwards." className="items-start">
        <PersonalDetails />
      </Demo>
      <Demo id="editable-field-async" files={["ui/editable-field"]} title="Saving and errors" note="Return a promise from onSave. Save shows a spinner while it runs. If it rejects, the field stays open and shows the error's message under the input. Change the member ID to see it fail." className="items-start">
        <SavedToServer />
      </Demo>
      <Demo id="editable-field-types" files={["ui/editable-field", "ui/masked-input", "ui/password-input"]} title="Masks and passwords" note="A mask edits the value in a MaskedInput and shows it masked. A password is shown as dots and edited in a PasswordInput." className="items-start">
        <ContactAndSecurity />
      </Demo>
      <Demo id="editable-field-empty-disabled" files={["ui/editable-field"]} title="Empty and disabled" note="emptyText stands in for a missing value. A disabled field shows the value without the pencil." className="items-start">
        <EmptyAndLocked />
      </Demo>
      <Demo id="editable-field-sizes" files={["ui/editable-field"]} title="Sizes" note="size sets the text size, and the input and buttons shown while editing. The row keeps its height when it swaps." className="flex-col items-stretch">
        <Sizes />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "editable-field",
  title: "Editable field",
  group: "Components",
  summary: "A value shown as text that turns into an input with Save and Cancel. Use it on profile and settings pages where each value saves on its own.",
  keywords: "inline edit editable input click to edit pencil rename profile settings",
  Body,
};
