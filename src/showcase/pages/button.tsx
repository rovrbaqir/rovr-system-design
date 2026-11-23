import * as React from "react";
import { ArrowRight, CalendarPlus, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function LoadingButton() {
  const [loading, setLoading] = React.useState(false);
  return (
    <Button
      loading={loading}
      onClick={() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          toast.success("Appointment booked", { description: "Thursday 3 December, 10:30 with Dr. Okafor" });
        }, 1400);
      }}
    >
      Book appointment
    </Button>
  );
}

function Body() {
  return (
    <>
      <Demo id="button-variants" files={["ui/button"]} title="Variants" note="One primary action per view. Move across the primary: its light follows the pointer. Press any of them: they sink and spring back.">
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Cancel visit</Button>
        <Button variant="destructive-solid">Delete</Button>
        <Button variant="link">View details</Button>
      </Demo>
      <Demo id="button-sizes" files={["ui/button"]} title="Sizes" note="Medium is the default. Small is for toolbars and table rows, large for the one action that ends a flow.">
        <Button size="sm">Small</Button>
        <Button>Medium</Button>
        <Button size="lg">Large</Button>
      </Demo>
      <Demo id="button-with-icons" files={["ui/button", "ui/tooltip"]} title="With icons" note="An icon sits before the label when it names the action and after it when it shows direction. Icon-only buttons need an aria-label and get a tooltip.">
        <Button variant="secondary">
          <CalendarPlus /> New appointment
        </Button>
        <Button size="lg">
          Continue <ArrowRight />
        </Button>
        <Tooltip content="Download summary">
          <Button variant="outline" size="icon-md" aria-label="Download summary">
            <Download />
          </Button>
        </Tooltip>
        <Tooltip content="Add note">
          <Button variant="secondary" size="icon-md" aria-label="Add note">
            <Plus />
          </Button>
        </Tooltip>
      </Demo>
      <Demo id="button-loading" files={["ui/button", "ui/toast"]} title="Loading" note="Loading keeps the button's width and swaps the label for a spinner. Press it.">
        <LoadingButton />
      </Demo>
      <Demo id="button-disabled" files={["ui/button"]} title="Disabled">
        <Button disabled>Disabled</Button>
        <Button variant="secondary" disabled>
          Disabled
        </Button>
        <Button variant="outline" disabled>
          Disabled
        </Button>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "button",
  title: "Button",
  group: "Components",
  summary: "One Button with seven variants and three sizes. It replaces the six or seven button components in each app today.",
  keywords: "action cta submit icon button",
  Body,
};
