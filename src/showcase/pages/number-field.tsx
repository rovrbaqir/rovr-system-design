import * as React from "react";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { NumberField } from "@/components/ui/number-field";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function DaysSupply() {
  const [tablets, setTablets] = React.useState<number | null>(30);
  const [perDay, setPerDay] = React.useState<number | null>(1);
  const days = tablets && perDay ? Math.floor(tablets / perDay) : null;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-label">Tablets</span>
          <NumberField value={tablets} onValueChange={setTablets} min={1} max={180} step={10} aria-label="Tablets" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-label">Tablets per day</span>
          <NumberField value={perDay} onValueChange={setPerDay} min={1} max={4} aria-label="Tablets per day" />
        </div>
      </div>
      <p className="text-body text-muted-foreground">
        Atorvastatin 20 mg. {days ? <span className="font-medium text-foreground text-data">{days} days supply.</span> : "Enter both numbers to see the days supply."}
      </p>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="number-field-basic" files={["ui/number-field", "ui/field"]} title="Default" note="Type a number, press the buttons, or use the up and down arrow keys. The buttons stop at min and max." className="items-start">
        <Field className="w-auto">
          <FieldLabel>Refills</FieldLabel>
          <NumberField defaultValue={3} min={0} max={12} />
          <FieldDescription>Up to 12 on this prescription.</FieldDescription>
        </Field>
      </Demo>
      <Demo id="number-field-step-and-format" files={["ui/number-field"]} title="Step and format" note="step sets how far each press moves. format takes Intl.NumberFormat options for units, decimals and currency." className="items-end gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-label">Dose</span>
          <NumberField defaultValue={2.5} min={0} max={20} step={0.5} format={{ style: "unit", unit: "milliliter", minimumFractionDigits: 1 }} aria-label="Dose" className="w-36" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-label">Copay</span>
          <NumberField defaultValue={25} min={0} step={5} format={{ style: "currency", currency: "USD" }} aria-label="Copay" className="w-36" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-label">Visit length</span>
          <NumberField defaultValue={20} min={10} max={90} step={5} format={{ style: "unit", unit: "minute" }} aria-label="Visit length" className="w-36" />
        </div>
      </Demo>
      <Demo id="number-field-controlled" files={["ui/number-field"]} title="Controlled" note="onValueChange gives a number, or null while the field is empty." className="items-start">
        <DaysSupply />
      </Demo>
      <Demo id="number-field-disabled" files={["ui/number-field"]} title="Disabled and read-only" className="items-end gap-5">
        <div className="flex flex-col gap-1.5">
          <span className="text-label text-muted-foreground">Refills (controlled substance)</span>
          <NumberField defaultValue={0} disabled aria-label="Refills" />
        </div>
        <div className="flex flex-col gap-1.5">
          <span className="text-label">Refills used</span>
          <NumberField defaultValue={2} readOnly aria-label="Refills used" />
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "number-field",
  title: "Number field",
  group: "Components",
  summary: "A number with minus and plus buttons, for small counts such as refills, tablets or days supply. For free-form measurements use an Input with a unit.",
  keywords: "stepper quantity counter increment decrement numeric input spinner",
  Body,
};
