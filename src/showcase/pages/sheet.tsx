import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const statuses = ["Final", "Preliminary", "Awaiting collection", "Cancelled"];

function FilterSheet() {
  const [open, setOpen] = React.useState(false);
  const [picked, setPicked] = React.useState(["Final", "Preliminary"]);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="outline">Filters ({picked.length})</Button>} />
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Filter lab results</SheetTitle>
          <SheetDescription>Choose which results appear in the list.</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-3">
          <p className="text-label">Status</p>
          {statuses.map((status) => (
            <label key={status} className="flex items-center gap-2.5 text-body">
              <Checkbox
                checked={picked.includes(status)}
                onCheckedChange={(checked) => setPicked((list) => (checked ? [...list, status] : list.filter((item) => item !== status)))}
              />
              {status}
            </label>
          ))}
        </div>
        <SheetFooter>
          <Button variant="secondary" onClick={() => setPicked([])}>
            Clear all
          </Button>
          <Button onClick={() => setOpen(false)}>Show results</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function Body() {
  return (
    <>
      <Demo id="sheet-right" files={["ui/sheet", "ui/button", "ui/avatar", "ui/callout"]} title="From the right" note="The default side. Use it for the detail of a row or card, so the list stays in view behind it.">
        <Sheet>
          <SheetTrigger render={<Button variant="outline">Open visit details</Button>} />
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Follow-up visit</SheetTitle>
              <SheetDescription>Thursday 3 December, 10:30 to 11:00</SheetDescription>
            </SheetHeader>
            <div className="flex items-center gap-3">
              <Avatar name="Ngozi Okafor" />
              <div>
                <p className="text-title-sm">Dr. Ngozi Okafor</p>
                <p className="text-body-sm text-muted-foreground">Internal medicine</p>
              </div>
            </div>
            <Callout tone="info" title="Join from this page">
              The video room opens 10 minutes before your visit.
            </Callout>
            <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-body">
              <dt className="text-muted-foreground">Format</dt>
              <dd>Video visit</dd>
              <dt className="text-muted-foreground">Reason</dt>
              <dd>Review of lipid panel</dd>
              <dt className="text-muted-foreground">Copay</dt>
              <dd className="text-data">$25.00</dd>
            </dl>
            <SheetFooter>
              <SheetClose render={<Button variant="secondary">Close</Button>} />
              <Button>Reschedule</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Demo>
      <Demo id="sheet-left" files={["ui/sheet", "ui/button", "ui/checkbox"]} title="From the left" note="For filters and for navigation at phone width. This one is controlled, so its own button can close it.">
        <FilterSheet />
      </Demo>
      <Demo id="sheet-bottom" files={["ui/sheet", "ui/button"]} title="From the bottom" note="Spans the full width and grows to fit its content, up to 85% of the screen height. Best for a short choice on a phone.">
        <Sheet>
          <SheetTrigger render={<Button variant="outline">Share result</Button>} />
          <SheetContent side="bottom">
            <SheetHeader>
              <SheetTitle>Share this result</SheetTitle>
              <SheetDescription>Lipid panel, collected 12 November 2026</SheetDescription>
            </SheetHeader>
            <div className="flex flex-wrap gap-2">
              <SheetClose render={<Button variant="secondary">Send to care team</Button>} />
              <SheetClose render={<Button variant="secondary">Download PDF</Button>} />
              <SheetClose render={<Button variant="secondary">Copy link</Button>} />
            </div>
          </SheetContent>
        </Sheet>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "sheet",
  title: "Sheet",
  group: "Components",
  summary: "A panel that slides in from an edge and keeps the page in context. Use it for detail views, filters and mobile navigation.",
  keywords: "drawer side panel slide over bottom sheet",
  Body,
};
