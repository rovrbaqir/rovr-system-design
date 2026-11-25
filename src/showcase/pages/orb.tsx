import * as React from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Orb, type OrbActivity, type OrbMode } from "@/components/ui/orb";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const modes: { value: OrbMode; label: string }[] = [
  { value: "scattered", label: "Scattered" },
  { value: "resolved", label: "Resolved" },
  { value: "heartbeat", label: "Heartbeat" },
  { value: "complete", label: "Complete" },
];

const activities: { value: OrbActivity; label: string; caption: string }[] = [
  { value: "idle", label: "Idle", caption: "Waiting for you" },
  { value: "user", label: "Listening", caption: "Listening to you" },
  { value: "thinking", label: "Thinking", caption: "Working on an answer" },
  { value: "pulse", label: "Speaking", caption: "Pulse is speaking" },
];

/** A stand-in for a microphone level: syllable-like bursts between 0 and 1. */
const fakeVoice = () => {
  const t = performance.now() / 1000;
  return Math.max(0, Math.sin(t * 7.3) * 0.5 + Math.sin(t * 2.1) * 0.35 + 0.35);
};

function Modes() {
  const [mode, setMode] = React.useState<OrbMode>("heartbeat");
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Orb key={mode} size={220} mode={mode} label={`Pulse, ${mode}`} />
      <SegmentedControl aria-label="Mode" size="sm" value={mode} onValueChange={(v) => setMode(v as OrbMode)} options={modes} />
    </div>
  );
}

function Voice() {
  const [activity, setActivity] = React.useState<OrbActivity>("user");
  const [muted, setMuted] = React.useState(false);
  const caption = muted ? "Microphone is off" : activities.find((a) => a.value === activity)?.caption;
  return (
    <div className="flex w-full flex-col items-center gap-4">
      <Orb size={240} mode="complete" activity={activity} muted={muted} getEnergy={fakeVoice} label={`Pulse. ${caption}`} />
      <p className="text-body-sm text-muted-foreground" aria-live="polite">
        {caption}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <SegmentedControl aria-label="Who is talking" size="sm" value={activity} onValueChange={(v) => setActivity(v as OrbActivity)} options={activities} />
        <Button variant={muted ? "secondary" : "outline"} size="sm" aria-pressed={muted} onClick={() => setMuted((m) => !m)}>
          {muted ? <MicOff /> : <Mic />}
          {muted ? "Unmute" : "Mute"}
        </Button>
      </div>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="orb-modes" files={["ui/orb"]} title="Modes" note="Scattered is rest. Resolved is attention. Heartbeat is alive and waiting, and is the default. Complete plays Ignite once, then keeps the heartbeat: use it when a step or a set-up finishes.">
        <Modes />
      </Demo>
      <Demo id="orb-voice" files={["ui/orb", "ui/segmented-control", "ui/button"]} title="Voice" note="activity says who is talking and getEnergy gives the loudness each frame. Listening lights the core, speaking swells with the voice, thinking breathes. Muted loosens the sphere. Always say the state in words next to it.">
        <Voice />
      </Demo>
      <Demo id="orb-sizes" files={["ui/orb"]} title="Sizes" note="size is the box in px. Small orbs draw fewer, finer points. Leave size out and the orb fills its parent." className="items-center">
        <Orb size={40} label="Pulse" />
        <Orb size={64} label="Pulse" />
        <Orb size={120} label="Pulse" />
        <Orb size={200} label="Pulse" />
      </Demo>
      <Demo id="orb-interactive" files={["ui/orb"]} title="Interactive" note="With interactive and mode auto, the sphere resolves under the pointer, beats when the pointer stays, and can be dragged round. Keep this for a hero or an empty first screen, never inside a button or a list.">
        <Orb size={260} mode="auto" interactive label="Pulse. Move the pointer over the sphere" />
      </Demo>
      <Demo id="orb-with-text" files={["ui/orb", "ui/button"]} title="As the face of Pulse" note="Where the apps used the Pulse video or icon, use the orb at the same size and position: beside a greeting, above a welcome step, at the top of a chat.">
        <div className="flex max-w-md items-center gap-4">
          <Orb size={72} />
          <div className="flex flex-col gap-1">
            <p className="text-title-md">Good morning, Amara</p>
            <p className="text-body-sm text-muted-foreground">Your lipid panel is back. I can walk you through it before your visit on 3 December.</p>
          </div>
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "orb",
  title: "Orb",
  group: "Components",
  summary: "The RoVR particle sphere, the face of Pulse. It rests, pays attention, beats, and reacts to who is talking. Use it wherever Pulse is present, in place of the old Pulse video and icon.",
  keywords: "pulse orb sphere particles voice listening speaking thinking assistant ai avatar brand",
  Body,
};
