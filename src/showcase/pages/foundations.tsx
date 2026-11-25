import * as React from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Frost, FrostDisc } from "@/components/ui/frost";
import { NotchCard, RoundAction } from "@/components/ui/notch-card";
import { Segments } from "@/components/ui/segments";
import { Demo, Token } from "../kit";
import type { DocPage } from "../types";

const surfaces = [
  ["background", "Page"],
  ["surface", "Forms resting on the canvas"],
  ["surface-sunken", "Rows and wells inside a form"],
  ["surface-raised", "Controls on a sunken row"],
  ["surface-inverse", "Tooltips"],
];
const brand = [
  ["brand", "Logo, focus ring, selection"],
  ["primary", "Primary actions"],
  ["accent", "Selected and info tint"],
  ["ink", "Text"],
];
const status = [
  ["success", "success-fg", "Confirmed, in range"],
  ["warning", "warning-fg", "Needs attention"],
  ["destructive", "destructive-fg", "Errors, destructive actions"],
  ["info", "info-fg", "Neutral information"],
];

function Swatch({ token, role }: { token: string; role: string }) {
  return (
    <div className="flex min-w-36 flex-1 flex-col gap-2">
      <div className="h-16 rounded-lg border border-border" style={{ background: `var(--${token})` }} />
      <div>
        <p className="font-mono text-[0.75rem]">--{token}</p>
        <p className="text-caption text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

const durations = [
  ["--spring-snappy", "--dur-snappy", "380ms", "Presses, toggles, highlights. Settles without overshoot"],
  ["--spring-gentle", "--dur-gentle", "645ms", "Cards lifting, meters, layout"],
  ["--ease-panel", "--dur-panel", "420ms", "Sheets and the sidebar"],
  ["--ease-appear", "--dur-appear", "180ms", "Menus, popovers, dialogs"],
  ["--ease-panel", "--dur-expand", "280ms", "Accordions, collapsibles, tab indicators"],
  ["--ease-out", "--dur-base", "250ms", "Fades, blur, colour"],
  ["--ease-out", "--dur-fast", "150ms", "Hover, focus"],
];

function MotionLab() {
  const [on, setOn] = React.useState(false);
  return (
    <div className="flex w-full flex-col gap-5">
      <div className="flex flex-col gap-3">
        {durations.map(([curve, dur, ms, use]) => (
          <div key={curve + dur} className="grid grid-cols-[9rem_minmax(0,1fr)] items-center gap-4 sm:grid-cols-[9rem_minmax(0,1fr)_14rem]">
            <div className="flex flex-col">
              <span className="font-mono text-[0.75rem]">{curve}</span>
              <span className="text-caption text-muted-foreground text-data">{ms}</span>
            </div>
            <div className="relative h-7 rounded-full bg-secondary">
              <span
                className="absolute top-1 size-5 rounded-full bg-primary rovr-lit"
                style={{ left: on ? "calc(100% - 1.5rem)" : "0.25rem", transition: `left var(${dur}) var(${curve})` }}
              />
            </div>
            <span className="text-body-sm text-muted-foreground max-sm:hidden">{use}</span>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="secondary" size="sm" onClick={() => setOn((v) => !v)}>
          <Play /> Play
        </Button>
        <p className="text-body-sm text-muted-foreground">
          The two springs are the mobile app's, so a press feels the same on the web and on the phone.
        </p>
      </div>
    </div>
  );
}

function ColourBody() {
  return (
    <>
    <Demo id="colour-surfaces" title="Surfaces" note="Paper, white forms, and lavender rows inside a form." bare>
      {surfaces.map(([t, r]) => (
        <Swatch key={t} token={t} role={r} />
      ))}
    </Demo>
    <Demo id="colour-signature-forms" files={["ui/notch-card", "ui/frost", "ui/segments"]}
      title="Signature forms"
      note="The notched card carries its one action, in words, in a corner cut. The aurora is the single rich surface a page gets; glass panes belong on it and nowhere else."
      bare
      className="items-stretch"
    >
      <NotchCard tone="aurora" className="min-h-56 flex-[2] basis-96 justify-between gap-6" action={<RoundAction href="#/colour" label="Book now" />}>
        <div className="flex items-center gap-3">
          <FrostDisc>
            <span className="text-title-lg text-data">23</span>
          </FrostDisc>
          <p className="text-body-sm leading-tight text-white/85">
            Monday,
            <br />
            November
          </p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4 pr-16">
          <p className="text-display-md">
            Good morning, Maya.
            <span className="block text-white/55">Two steps left.</span>
          </p>
          <Frost className="w-56">
            <p className="text-caption text-white/70">Setup</p>
            <p className="text-title-lg text-data">56%</p>
            <Segments className="mt-2" value={5} total={9} label="Setup steps" tone="on-aurora" />
          </Frost>
        </div>
      </NotchCard>
      <NotchCard tone="tint" className="min-h-56 flex-1 basis-64 justify-between gap-6" action={<RoundAction tone="ink" size="md" href="#/colour" label="Book labs" />}>
        <div className="flex flex-col gap-3">
          <p className="text-title-lg">Comprehensive lab panel</p>
          <Segments value={1} total={3} label="Kick-off steps" />
        </div>
        <p className="pr-16 text-body-sm text-muted-foreground">Key health markers that guide your plan and track your progress.</p>
      </NotchCard>
    </Demo>
    <Demo id="colour-brand"
      title="Brand"
      note="White text on the brand blue falls just short of AA, so filled buttons use Primary, one step deeper."
      bare
    >
      {brand.map(([t, r]) => (
        <Swatch key={t} token={t} role={r} />
      ))}
    </Demo>
    <Demo id="colour-status" title="Status" note="One red, one green, one amber. Always paired with a label or icon, never colour alone." bare>
      {status.map(([solid, subtle, role]) => (
        <div key={solid} className="flex min-w-36 flex-1 flex-col gap-2">
          <div className="flex h-16 overflow-hidden rounded-lg border border-border">
            <div className="flex-1" style={{ background: `var(--${solid})` }} />
            <div className="grid flex-1 place-items-center text-label" style={{ background: `color-mix(in oklab, var(--${solid}) 10%, var(--surface))`, color: `var(--${subtle})` }}>
              Aa
            </div>
          </div>
          <div>
            <p className="font-mono text-[0.75rem]">--{solid}</p>
            <p className="text-caption text-muted-foreground">{role}</p>
          </div>
        </div>
      ))}
    </Demo>
    </>
  );
}

function TypographyBody() {
  return (
    <>
    <Demo id="type-display" title="Display" note="Page and section headlines. Tracking tightens as size grows." className="flex-col items-start gap-5">
      <p className="text-display-xl">Good morning, Amara</p>
      <p className="text-display-lg">Your care plan this week</p>
      <p className="text-display-md">Lab results</p>
      <p className="text-display-sm">Reschedule appointment</p>
    </Demo>
    <Demo id="type-text" title="Text" note="A fixed rem scale. The base size is 15px; body-lg is for patient-facing reading. Overline is for table headers and group labels." className="flex-col items-start gap-4">
      {[
        ["text-title-lg", "Upcoming appointments"],
        ["text-title-md", "Upcoming appointments"],
        ["text-title-sm", "Upcoming appointments"],
        ["text-body-lg", "Take one tablet by mouth every morning with food."],
        ["text-body", "Take one tablet by mouth every morning with food."],
        ["text-body-sm", "Take one tablet by mouth every morning with food."],
        ["text-label", "Date of birth"],
        ["text-caption", "Last synced 4 minutes ago"],
        ["text-overline", "Reference range"],
      ].map(([cls, sample]) => (
        <div key={cls} className="grid w-full grid-cols-[7.5rem_minmax(0,1fr)] items-baseline gap-4">
          <span className="font-mono text-[0.75rem] text-muted-foreground">{cls.replace("text-", "")}</span>
          <span className={cls}>{sample}</span>
        </div>
      ))}
    </Demo>
    <Demo id="type-data" title="Data" note="Tabular lining figures keep vitals, doses, times and money aligned in columns." className="flex-col items-start">
      <div className="grid w-full max-w-md grid-cols-[1fr_auto_auto] gap-x-6 gap-y-2 text-body text-data">
        {[
          ["Blood pressure", "118/76", "mmHg"],
          ["Resting heart rate", "61", "bpm"],
          ["HbA1c", "5.4", "%"],
          ["LDL cholesterol", "101", "mg/dL"],
        ].map(([k, v, u]) => (
          <React.Fragment key={k}>
            <span className="text-muted-foreground">{k}</span>
            <span className="text-right font-medium">{v}</span>
            <span className="text-muted-foreground">{u}</span>
          </React.Fragment>
        ))}
      </div>
    </Demo>
    </>
  );
}

function ShapeBody() {
  return (
    <>
    <Demo id="shape-radius" title="Radius" bare className="items-end">
      {[
        ["xs", "6"],
        ["sm", "10"],
        ["md", "14"],
        ["lg", "20"],
        ["xl", "28"],
        ["2xl", "36"],
      ].map(([name, px]) => (
        <div key={name} className="flex flex-col gap-2">
          <div className="size-20 border border-border-strong bg-surface" style={{ borderRadius: `var(--radius-${name})` }} />
          <p className="font-mono text-[0.75rem]">
            {name} <span className="text-muted-foreground">{px}px</span>
          </p>
        </div>
      ))}
    </Demo>
    <Demo id="shape-density" files={["ui/button"]}
      title="Density"
      note={
        <>
          Set <Token>data-density="compact"</Token> on any container. The provider app sets it once at its root.
        </>
      }
      className="items-start gap-8"
    >
      {(["comfortable", "compact"] as const).map((d) => (
        <div key={d} data-density={d} className="flex flex-col gap-3">
          <p className="text-caption text-muted-foreground capitalize">{d}</p>
          <div className="flex items-center gap-2">
            <Button size="sm">Small</Button>
            <Button>Medium</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      ))}
    </Demo>
    </>
  );
}

function MotionBody() {
  return (
    <>
    <Demo id="motion-durations" files={["ui/button"]} title="Durations" note="Springs for things you touch. Plain, fast curves for things that appear." className="items-start">
      <MotionLab />
    </Demo>
    <Demo id="motion-rules" title="Rules" bare className="items-start">
      <ul className="grid w-full gap-x-10 gap-y-4 text-body sm:grid-cols-2">
        {[
          ["Overlays arrive, they do not perform", "Menus and dialogs fade in with a slight scale in under 260 ms. Sheets slide on the iOS sheet curve. No bounce, no blur."],
          ["One highlight glides", "In menus, lists, tabs and the sidebar a single highlight travels between items."],
          ["Light follows the hand", "The light under a primary button tracks the pointer."],
          ["Readings are never animated", "Lab values and vitals appear instantly. Count-up is for summary figures only."],
          ["Reduced motion keeps feedback", "Travel, scale and blur are removed. Opacity and colour changes stay."],
        ].map(([t, d]) => (
          <li key={t} className="flex flex-col gap-1">
            <span className="text-title-sm">{t}</span>
            <span className="text-body-sm text-muted-foreground">{d}</span>
          </li>
        ))}
      </ul>
    </Demo>
    </>
  );
}

export const pages: DocPage[] = [
  { slug: "colour", title: "Colour", group: "Foundations", order: 1, summary: "The mobile app's palette: navy ink on warm paper, white forms that float on a soft warm shadow, lavender rows inside them, and RoVR blue kept for action. Red appears only when something is wrong.", keywords: "color palette tokens surfaces status", Body: ColourBody },
  { slug: "typography", title: "Typography", group: "Foundations", order: 2, summary: "Manrope throughout, the same typeface as the mobile app and both web apps. Headlines are medium weight and set tight; everything else is regular, medium or semibold at its natural spacing.", keywords: "type font text scale", Body: TypographyBody },
  { slug: "shape", title: "Shape and density", group: "Foundations", order: 3, summary: "Forms are generously curved and controls are full pills: 14px fields, 20px inner cards, 28px forms, 36px for the hero. Compact density tightens the same components for the provider app.", keywords: "radius density corners spacing", Body: ShapeBody },
  { slug: "motion-tokens", title: "Motion", group: "Foundations", order: 4, summary: "Controls respond like physical things: they sink under the pointer and spring back, and one highlight glides between items. Overlays do the opposite. They arrive quickly and plainly, because a dialog should not perform.", keywords: "animation easing spring duration", Body: MotionBody },
];
