import * as React from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { MaskedInput, PHONE_MASK, PhoneInput, isMaskComplete } from "@/components/ui/masked-input";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function ContactPhone() {
  const [phone, setPhone] = React.useState("");
  const [digits, setDigits] = React.useState("");
  return (
    <Field className="max-w-sm">
      <FieldLabel>Mobile number</FieldLabel>
      <PhoneInput
        value={phone}
        onValueChange={(masked, raw) => {
          setPhone(masked);
          setDigits(raw);
        }}
      />
      <FieldDescription>
        Sent to the server as <span className="font-mono text-data">{digits || "nothing yet"}</span>.
      </FieldDescription>
    </Field>
  );
}

function EmergencyContactPhone() {
  const [phone, setPhone] = React.useState("(415) 555-01");
  const [touched, setTouched] = React.useState(true);
  const invalid = touched && phone.length > 0 && !isMaskComplete(PHONE_MASK, phone);
  return (
    <Field invalid={invalid} className="max-w-sm">
      <FieldLabel>Emergency contact phone</FieldLabel>
      <PhoneInput value={phone} onValueChange={(masked) => setPhone(masked)} onBlur={() => setTouched(true)} aria-invalid={invalid || undefined} />
      <FieldError match={invalid}>Enter all 10 digits, including the area code.</FieldError>
    </Field>
  );
}

function Body() {
  return (
    <>
      <Demo id="masked-input-phone" files={["ui/masked-input", "ui/field"]} title="Phone number" note="PhoneInput is the US phone preset. Type digits only and the brackets, space and dash are written for you. Pasting a number with a +1 country code drops the code." className="items-start">
        <ContactPhone />
      </Demo>
      <Demo id="masked-input-patterns" files={["ui/masked-input", "ui/field"]} title="Other patterns" note="Pass any mask where an underscore is a digit slot. The mask is the placeholder unless you give one that reads better, as the date does here." className="items-start">
        <Field className="max-w-sm">
          <FieldLabel>Date of birth</FieldLabel>
          <MaskedInput mask="__/__/____" placeholder="MM/DD/YYYY" autoComplete="bday" defaultValue="04/14/1988" />
        </Field>
        <Field className="max-w-sm">
          <FieldLabel>ZIP code</FieldLabel>
          <MaskedInput mask="_____" autoComplete="postal-code" />
        </Field>
        <Field className="max-w-sm">
          <FieldLabel>Pharmacy NCPDP number</FieldLabel>
          <MaskedInput mask="__-_____" />
          <FieldDescription>Seven digits, printed on the pharmacy's receipt.</FieldDescription>
        </Field>
      </Demo>
      <Demo id="masked-input-invalid" files={["ui/masked-input", "ui/field"]} title="Incomplete value" note="isMaskComplete says whether every slot is filled. Check it when the person leaves the field, not while they type. Finish the number to clear the error." className="items-start">
        <EmergencyContactPhone />
      </Demo>
      <Demo id="masked-input-sizes" files={["ui/masked-input"]} title="Sizes" note="The same three sizes as Input. Leading and trailing content work the same way too." className="flex-col items-stretch">
        <PhoneInput size="sm" aria-label="Clinic phone, small" className="max-w-sm" />
        <PhoneInput aria-label="Clinic phone, medium" className="max-w-sm" />
        <PhoneInput size="lg" aria-label="Clinic phone, large" className="max-w-sm" />
      </Demo>
      <Demo id="masked-input-disabled" files={["ui/masked-input", "ui/field"]} title="Disabled" note="A value passed as bare digits is shown masked. Say why it cannot be changed." className="items-start">
        <Field disabled className="max-w-sm">
          <FieldLabel>Phone on file with your plan</FieldLabel>
          <PhoneInput disabled defaultValue="4155550142" />
          <FieldDescription>Set by your insurer. Call the number on your card to change it.</FieldDescription>
        </Field>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "masked-input",
  title: "Masked input",
  group: "Components",
  summary: "A digit field that writes its own punctuation as you type, for phone numbers, dates and codes with a fixed shape. PhoneInput is the US phone preset.",
  keywords: "mask phone tel date pattern format input number",
  Body,
};
