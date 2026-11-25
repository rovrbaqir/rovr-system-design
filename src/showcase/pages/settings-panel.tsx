import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Panel, PanelBody, PanelHeader, PanelRow } from "@/components/patterns/settings-panel";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function PersonalInformation() {
  const [profile, setProfile] = React.useState({ preferredName: "Amara", genderIdentity: "Woman", pronouns: "she/her" });
  const set = (key: keyof typeof profile) => (value: string) => setProfile((p) => ({ ...p, [key]: value }));
  return (
    <Panel>
      <PanelHeader>Personal information</PanelHeader>
      <PanelBody>
        <PanelRow label="Legal name" value="Amara Osei" tooltip="Send a message to our admin team if you'd like to change your legal name." />
        <PanelRow label="Preferred name" value={profile.preferredName} onUpdate={set("preferredName")} />
        <PanelRow label="Date of birth" value="14 Apr 1988" tooltip="Send a message to our admin team if you'd like to change your date of birth." />
        <PanelRow label="Sex at birth" value="female" tooltip="We collect this for insurance and clinical purposes." />
        <PanelRow label="Gender identity" value={profile.genderIdentity} onUpdate={set("genderIdentity")} />
        <PanelRow label="Pronouns" value={profile.pronouns} onUpdate={set("pronouns")} />
      </PanelBody>
    </Panel>
  );
}

function ContactDetails() {
  const [phone, setPhone] = React.useState("4155550142");
  const [email, setEmail] = React.useState("amara.osei@example.com");
  const [contact, setContact] = React.useState("");
  return (
    <Panel>
      <PanelHeader>Contact details</PanelHeader>
      <PanelBody>
        <PanelRow
          label="Mobile phone"
          value={phone}
          type="tel"
          mask="(___) ___-____"
          tooltip="We text appointment reminders to this number."
          // Waits like a request would, so the pending state shows.
          onUpdate={(value) => new Promise<void>((resolve) => setTimeout(() => (setPhone(value), resolve()), 900))}
        />
        <PanelRow
          label="Email"
          value={email}
          type="email"
          onUpdate={(value) => {
            if (!/^\S+@\S+\.\S+$/.test(value)) throw new Error("Enter a full address, such as name@example.com.");
            setEmail(value);
          }}
        />
        <PanelRow label="Emergency contact" value={contact} emptyText="Not added" onUpdate={setContact} />
        <PanelRow label="Member ID" value="RVR-2041-88317" valueClassName="font-mono normal-case" />
      </PanelBody>
    </Panel>
  );
}

function Body() {
  return (
    <>
      <Demo
        id="settings-panel-rows"
        files={["patterns/settings-panel", "ui/tooltip", "ui/editable-field"]}
        title="Rows"
        note="Labels sit in the left column, aligned to its right edge, and values in the right column. A row with onUpdate is edited in place. A row with tooltip gets an info button after the label."
        bare
        className="items-stretch"
      >
        <PersonalInformation />
      </Demo>
      <Demo
        id="settings-panel-editing"
        files={["patterns/settings-panel", "ui/editable-field", "ui/tooltip"]}
        title="Masks, saving and errors"
        note="type and mask pass through to the editable value. Return a promise from onUpdate to show a pending state; throw to keep the row open with the message. Save an email without a domain to see it."
        bare
        className="items-stretch"
      >
        <ContactDetails />
      </Demo>
      <Demo
        id="settings-panel-custom"
        files={["patterns/settings-panel", "ui/badge", "ui/button"]}
        title="Custom rows"
        note="PanelBody is a two-column grid, so any pair of elements makes a row next to PanelRows. Use this when the value is more than text. disabled shows an editable value without its edit button."
        bare
        className="items-stretch"
      >
        <Panel>
          <PanelHeader>Membership</PanelHeader>
          <PanelBody>
            <PanelRow label="Current plan" value="RoVR complete" />
            <div className="flex items-center justify-end gap-2 text-body-sm font-medium min-[1100px]:text-body">Renews</div>
            <div className="flex flex-wrap items-center gap-2 text-body-sm min-[1100px]:text-body">
              <span className="text-data">1 Mar 2027</span>
              <Badge tone="success">Active</Badge>
            </div>
            <div className="flex items-center justify-end gap-2 text-body-sm font-medium min-[1100px]:text-body">Payment card</div>
            <div className="flex flex-col items-start gap-2 text-body-sm min-[1100px]:text-body">
              <span className="text-data">Visa ending 4242</span>
              <Button variant="outline" size="sm">
                Change card
              </Button>
            </div>
            <PanelRow label="Billing name" value="Amara Osei" onUpdate={() => {}} disabled tooltip="Billing details are locked while a payment is processing." />
          </PanelBody>
        </Panel>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "settings-panel",
  title: "Settings panel",
  group: "Examples",
  summary: "A bordered box with a tinted header strip and rows of label and value, where a value can be edited in place. For account and profile pages. Patient app. Replaces Panel, PanelHeader, PanelBody and PanelRow.",
  keywords: "account profile settings panel row label value editable info tooltip personal information membership",
  Body,
};
