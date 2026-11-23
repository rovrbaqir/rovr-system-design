import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/toast";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function WearableSwitch() {
  const [on, setOn] = React.useState(false);
  return (
    <label className="flex w-full max-w-sm items-center justify-between gap-4 text-body">
      <span className="flex flex-col gap-0.5">
        <span className="font-medium">Connect wearable data</span>
        <span className="text-body-sm text-muted-foreground">{on ? "Syncing steps, sleep and heart rate." : "Nothing is shared from your watch."}</span>
      </span>
      <Switch
        checked={on}
        onCheckedChange={(next) => {
          setOn(next);
          toast.message(next ? "Wearable connected" : "Wearable disconnected");
        }}
      />
    </label>
  );
}

function Body() {
  return (
    <>
      <Demo id="switch-basic" files={["ui/switch"]} title="On and off" note="The thumb stretches while pressed, then springs to the other side." className="flex-col items-start gap-4">
        <label className="flex w-full max-w-xs items-center justify-between gap-4 text-body">
          Text message alerts <Switch defaultChecked />
        </label>
        <label className="flex w-full max-w-xs items-center justify-between gap-4 text-body">
          Email visit summaries <Switch />
        </label>
      </Demo>
      <Demo id="switch-controlled" files={["ui/switch", "ui/toast"]} title="Controlled" note="A switch takes effect straight away, so confirm what changed. If the change needs a Save button, use a Checkbox." className="items-start">
        <WearableSwitch />
      </Demo>
      <Demo id="switch-disabled" files={["ui/switch"]} title="Disabled" className="flex-col items-start gap-4">
        <label className="flex w-full max-w-xs items-center justify-between gap-4 text-body text-muted-foreground">
          Security alerts (always on) <Switch disabled defaultChecked />
        </label>
        <label className="flex w-full max-w-xs items-center justify-between gap-4 text-body text-muted-foreground">
          Paper statements (unavailable) <Switch disabled />
        </label>
      </Demo>
      <Demo id="switch-settings" files={["ui/switch"]} title="Settings list" note="Label on the left, switch on the right, one hairline between rows." className="items-start">
        <div className="flex w-full max-w-md flex-col divide-y divide-border">
          <label className="flex items-center justify-between gap-4 py-3 text-body first:pt-0">
            Appointment reminders <Switch defaultChecked />
          </label>
          <label className="flex items-center justify-between gap-4 py-3 text-body">
            New lab results <Switch defaultChecked />
          </label>
          <label className="flex items-center justify-between gap-4 py-3 text-body">
            Messages from my care team <Switch defaultChecked />
          </label>
          <label className="flex items-center justify-between gap-4 py-3 text-body last:pb-0">
            Billing statements <Switch />
          </label>
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "switch",
  title: "Switch",
  group: "Components",
  summary: "Turns a single setting on or off, effective immediately. Use it for preferences such as notifications, not for choices that are submitted with a form.",
  keywords: "toggle on off setting preference",
  Body,
};
