import * as React from "react";
import { Maximize2, Pause, Play } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FloatingPanel, type FloatingPanelProps } from "@/components/ui/floating-panel";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function VisitWindow() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(!open)}>
        {open ? "Hide the visit window" : "Show the visit window"}
      </Button>
      <FloatingPanel
        label="Visit with Amara Osei"
        open={open}
        onOpenChange={setOpen}
        header={
          <span className="flex min-w-0 items-center gap-2">
            <span className="truncate">Amara Osei</span>
            <span className="text-data text-muted-foreground">12:48</span>
          </span>
        }
      >
        {/* Stands in for the video. */}
        <div className="relative grid aspect-video place-items-center bg-surface-inverse text-inverse-foreground">
          <Avatar name="Amara Osei" size="lg" />
          <div className="absolute right-2 bottom-2 grid h-14 w-20 place-items-center rounded-md bg-surface text-foreground shadow-raised">
            <Avatar name="Dr. Ngozi Okafor, MD" size="sm" />
          </div>
        </div>
        <div className="flex justify-end p-2">
          <Button size="sm" onClick={() => setOpen(false)}>
            <Maximize2 /> Return to visit
          </Button>
        </div>
      </FloatingPanel>
    </>
  );
}

function ScribeWindow() {
  const [open, setOpen] = React.useState(false);
  const [paused, setPaused] = React.useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(!open)}>
        {open ? "Hide the scribe" : "Show the scribe"}
      </Button>
      <FloatingPanel label="Scribe for the in-person visit" open={open} onOpenChange={setOpen} minimizable defaultPosition="bottom-left" className="w-72" header="In-person visit">
        <div className="flex flex-col gap-3 px-4 pt-1 pb-4">
          <div className="flex items-center justify-between gap-2">
            <p className="min-w-0 truncate text-body-sm text-muted-foreground">Rafael Mendes, 58</p>
            <Badge variant="status" tone={paused ? "warning" : "success"} live={!paused}>
              {paused ? "Paused" : "Recording"}
            </Badge>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={() => setPaused(!paused)}>
              {paused ? <Play /> : <Pause />}
              {paused ? "Resume" : "Pause"}
            </Button>
            <Button size="sm" onClick={() => setOpen(false)}>
              <Maximize2 /> Return to visit
            </Button>
          </div>
        </div>
      </FloatingPanel>
    </>
  );
}

function CornerWindow() {
  const [corner, setCorner] = React.useState<NonNullable<FloatingPanelProps["defaultPosition"]>>("top-right");
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex flex-col items-start gap-4">
      <SegmentedControl
        aria-label="Starting corner"
        value={corner}
        onValueChange={setCorner}
        options={[
          { value: "top-left", label: "Top left" },
          { value: "top-right", label: "Top right" },
          { value: "bottom-left", label: "Bottom left" },
          { value: "bottom-right", label: "Bottom right" },
        ]}
      />
      <Button variant="secondary" onClick={() => setOpen(!open)}>
        {open ? "Hide the message" : "Show the message"}
      </Button>
      {/* The key starts a new window in the chosen corner. */}
      <FloatingPanel key={corner} label="Message from the front desk" open={open} onOpenChange={setOpen} defaultPosition={corner} className="w-72" header="Front desk">
        <p className="px-4 pt-1 pb-4 text-body-sm text-muted-foreground">Your 2:30 pm patient has checked in and is in room 4.</p>
      </FloatingPanel>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="floating-panel-visit" files={["ui/floating-panel", "ui/button", "ui/avatar"]} title="A call that follows you" note="Opens in the bottom right corner. Drag it by its header, or focus the grip and press the arrow keys; Shift moves it further. It stops at the edges of the window.">
        <VisitWindow />
      </Demo>
      <Demo id="floating-panel-minimise" files={["ui/floating-panel", "ui/button", "ui/badge"]} title="Minimise" note="With minimizable the window folds down to its header. Its content stays mounted, so a recording or a call keeps running.">
        <ScribeWindow />
      </Demo>
      <Demo id="floating-panel-corner" files={["ui/floating-panel", "ui/button", "ui/segmented-control"]} title="Starting corner" note="defaultPosition sets the corner it opens in. After that the window stays where the person leaves it, also when it is closed and opened again.">
        <CornerWindow />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "floating-panel",
  title: "Floating panel",
  group: "Components",
  summary: "A small window that floats above the page and can be moved out of the way, for a video call, a scribe or a chat that stays while the person works elsewhere. It does not block the page; use Dialog when it must.",
  keywords: "picture in picture pip draggable movable window popup video call chat bubble floating",
  Body,
};
