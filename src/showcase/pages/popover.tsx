import * as React from "react";
import { CircleHelp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/components/ui/toast";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function WeightPopover() {
  const [open, setOpen] = React.useState(false);
  const [weight, setWeight] = React.useState("68.4");
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline">Weight: {weight} kg</Button>} />
      <PopoverContent align="start" className="flex flex-col gap-3">
        <PopoverTitle>Update weight</PopoverTitle>
        <Field>
          <FieldLabel>Today's reading</FieldLabel>
          <Input inputMode="decimal" value={weight} onChange={(event) => setWeight(event.target.value)} trailing="kg" className="text-data" />
        </Field>
        <div className="flex justify-end gap-2">
          <PopoverClose render={<Button variant="secondary" size="sm">Cancel</Button>} />
          <Button
            size="sm"
            onClick={() => {
              setOpen(false);
              toast.success("Weight saved", { description: `${weight} kg, recorded today.` });
            }}
          >
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Body() {
  return (
    <>
      <Demo id="popover-basic" files={["ui/popover", "ui/button"]} title="Title and description" note="For an explanation that is too long for a tooltip. It opens on click and stays until dismissed.">
        <Popover>
          <PopoverTrigger render={<Button variant="outline">What is HbA1c?</Button>} />
          <PopoverContent align="start" className="flex flex-col gap-1.5">
            <PopoverTitle>HbA1c</PopoverTitle>
            <PopoverDescription>
              Your average blood sugar over roughly three months. Below 5.7% is the usual reference range for adults without diabetes.
            </PopoverDescription>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger
            render={
              <Button variant="ghost" size="icon-md" aria-label="About the reference range">
                <CircleHelp />
              </Button>
            }
          />
          <PopoverContent className="flex flex-col gap-1.5">
            <PopoverTitle>Reference range</PopoverTitle>
            <PopoverDescription>The range most healthy adults fall in. Your clinician may set a different target for you.</PopoverDescription>
          </PopoverContent>
        </Popover>
      </Demo>
      <Demo id="popover-placement" files={["ui/popover", "ui/button"]} title="Placement" note="side and align set where it opens. It flips by itself when there is no room.">
        <Popover>
          <PopoverTrigger render={<Button variant="secondary">Top</Button>} />
          <PopoverContent side="top">
            <PopoverDescription>Opens above the trigger, centred.</PopoverDescription>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger render={<Button variant="secondary">Right, start</Button>} />
          <PopoverContent side="right" align="start">
            <PopoverDescription>Opens beside the trigger, lined up with its top edge.</PopoverDescription>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger render={<Button variant="secondary">Bottom, end</Button>} />
          <PopoverContent align="end" sideOffset={12}>
            <PopoverDescription>Opens below, lined up with the trigger's far edge and a little further away.</PopoverDescription>
          </PopoverContent>
        </Popover>
      </Demo>
      <Demo id="popover-with-form" files={["ui/popover", "ui/field", "ui/input", "ui/button", "ui/toast"]} title="With a small form" note="One or two fields at most. Controlled, so saving closes it; PopoverClose handles Cancel.">
        <WeightPopover />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "popover",
  title: "Popover",
  group: "Components",
  summary: "A small frosted panel that opens from its trigger on click. Use it for a longer explanation or a quick edit that does not deserve a dialog.",
  keywords: "popup flyout floating panel help inline edit",
  Body,
};
