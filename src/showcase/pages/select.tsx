import * as React from "react";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectSeparator, SelectTrigger } from "@/components/ui/select";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const visitTypes = [
  { value: "annual", label: "Annual physical" },
  { value: "follow-up", label: "Follow-up" },
  { value: "labs", label: "Lab review" },
  { value: "urgent", label: "Same-day sick visit" },
  { value: "mental", label: "Behavioural health" },
];

const locations = [
  { value: "mission", label: "Mission St Clinic" },
  { value: "oakland", label: "Oakland Lakeside" },
  { value: "daly", label: "Daly City" },
  { value: "video", label: "Video visit" },
  { value: "phone", label: "Phone call" },
];

function ControlledSelect() {
  const [value, setValue] = React.useState<string | null>("follow-up");
  const length = { annual: "45 minutes", "follow-up": "20 minutes", labs: "15 minutes", urgent: "20 minutes", mental: "50 minutes" }[value ?? ""];
  return (
    <Field className="max-w-sm">
      <FieldLabel>Visit type</FieldLabel>
      <Select items={visitTypes} value={value} onValueChange={(v) => setValue(v as string | null)}>
        <SelectTrigger placeholder="Choose a visit type" />
        <SelectContent>
          {visitTypes.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldDescription>{length ? `We hold ${length} for this visit.` : "Choose a type to see how long the visit takes."}</FieldDescription>
    </Field>
  );
}

function RequiredSelect() {
  const [value, setValue] = React.useState<string | null>(null);
  return (
    <Field invalid={!value} className="max-w-sm">
      <FieldLabel>Visit type</FieldLabel>
      <Select items={visitTypes} value={value} onValueChange={(v) => setValue(v as string | null)}>
        <SelectTrigger placeholder="Choose a visit type" aria-invalid={!value} />
        <SelectContent>
          {visitTypes.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FieldError match={!value}>Choose a visit type so we can hold the right amount of time.</FieldError>
    </Field>
  );
}

function Body() {
  return (
    <>
      <Demo id="select-basic" files={["ui/select", "ui/field"]} title="Controlled" note="Pass items so the trigger shows the label of the chosen value. The highlight glides between options as you move." className="items-start">
        <ControlledSelect />
      </Demo>
      <Demo id="select-sizes" files={["ui/select"]} title="Sizes" note="The same three heights as Input, so they line up in a row.">
        <Select defaultValue="mission" items={locations}>
          <SelectTrigger size="sm" aria-label="Location, small" className="w-48" />
          <SelectContent>
            {locations.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue="mission" items={locations}>
          <SelectTrigger aria-label="Location, medium" className="w-48" />
          <SelectContent>
            {locations.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select defaultValue="mission" items={locations}>
          <SelectTrigger size="lg" aria-label="Location, large" className="w-48" />
          <SelectContent>
            {locations.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Demo>
      <Demo id="select-groups" files={["ui/select", "ui/field"]} title="Groups and disabled options" note="A SelectLabel must sit inside a SelectGroup. A disabled option stays visible so people know it exists." className="items-start">
        <Field className="max-w-sm">
          <FieldLabel>Where</FieldLabel>
          <Select defaultValue="mission" items={locations}>
            <SelectTrigger placeholder="Choose a location" />
            <SelectContent>
              <SelectGroup>
                <SelectLabel>In person</SelectLabel>
                <SelectItem value="mission">Mission St Clinic</SelectItem>
                <SelectItem value="oakland">Oakland Lakeside</SelectItem>
                <SelectItem value="daly" disabled>
                  Daly City
                </SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>Remote</SelectLabel>
                <SelectItem value="video">Video visit</SelectItem>
                <SelectItem value="phone">Phone call</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FieldDescription>Daly City reopens on 4 January.</FieldDescription>
        </Field>
      </Demo>
      <Demo id="select-states" files={["ui/select", "ui/field"]} title="Invalid and disabled" note="Choose a visit type to clear the error." className="items-start">
        <RequiredSelect />
        <Field disabled className="max-w-sm">
          <FieldLabel>Plan</FieldLabel>
          <Select disabled defaultValue="ppo" items={[{ value: "ppo", label: "Aetna PPO" }]}>
            <SelectTrigger />
            <SelectContent>
              <SelectItem value="ppo">Aetna PPO</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>Set by your employer.</FieldDescription>
        </Field>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "select",
  title: "Select",
  group: "Components",
  summary: "Chooses one option from a short, fixed list. For more than about ten options, or when people know what they are looking for, use a Combobox.",
  keywords: "dropdown picker menu options listbox",
  Body,
};
