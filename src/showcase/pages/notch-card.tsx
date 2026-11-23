import { CalendarPlus } from "lucide-react";
import { Frost, FrostDisc } from "@/components/ui/frost";
import { NotchCard, RoundAction } from "@/components/ui/notch-card";
import { Segments } from "@/components/ui/segments";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="notch-card-signature" files={["ui/notch-card", "ui/frost", "ui/segments"]} title="The signature card" note="A generously curved card with one corner cut away, and the card's single action resting in the cut, in words. Leave room for the notch at the end of the content." bare className="items-stretch">
        <NotchCard tone="aurora" className="min-h-56 flex-[2] basis-96 justify-between gap-6" action={<RoundAction href="#/notch-card" label="Book now" />}>
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
              Good morning, Amara.
              <span className="block text-white/55">Two steps left.</span>
            </p>
            <Frost className="w-56">
              <p className="text-caption text-white/70">Setup</p>
              <p className="text-title-lg text-data">56%</p>
              <Segments className="mt-2" value={5} total={9} label="Setup steps" tone="on-aurora" />
            </Frost>
          </div>
        </NotchCard>
        <NotchCard tone="tint" className="min-h-56 flex-1 basis-64 justify-between gap-6" action={<RoundAction tone="ink" size="md" href="#/notch-card" label="Book labs" />}>
          <div className="flex flex-col gap-3">
            <p className="text-title-lg">Comprehensive lab panel</p>
            <Segments value={1} total={3} label="Kick-off steps" />
          </div>
          <p className="pr-16 text-body-sm text-muted-foreground">Key health markers that guide your plan and track your progress.</p>
        </NotchCard>
      </Demo>
      <Demo id="notch-card-tones" files={["ui/notch-card"]} title="Tones" note="Surface is the default white. Sunken and tint are quiet, ink is the dark one, and aurora is the single rich surface a page gets." bare className="items-stretch">
        <NotchCard className="min-h-40 min-w-52 flex-1 justify-between gap-6" action={<RoundAction size="md" href="#/notch-card" label="Open" />}>
          <p className="text-title-md">Surface</p>
          <p className="pr-24 text-body-sm text-muted-foreground">Visit summary, 12 November</p>
        </NotchCard>
        <NotchCard tone="sunken" className="min-h-40 min-w-52 flex-1 justify-between gap-6" action={<RoundAction size="md" href="#/notch-card" label="Open" />}>
          <p className="text-title-md">Sunken</p>
          <p className="pr-24 text-body-sm text-muted-foreground">Intake form, 4 of 6 pages</p>
        </NotchCard>
        <NotchCard tone="tint" className="min-h-40 min-w-52 flex-1 justify-between gap-6" action={<RoundAction tone="ink" size="md" href="#/notch-card" label="Open" />}>
          <p className="text-title-md">Tint</p>
          <p className="pr-24 text-body-sm text-muted-foreground">Lipid panel, results ready</p>
        </NotchCard>
        <NotchCard tone="ink" className="min-h-40 min-w-52 flex-1 justify-between gap-6" action={<RoundAction size="md" href="#/notch-card" label="Open" />}>
          <p className="text-title-md">Ink</p>
          <p className="pr-24 text-body-sm opacity-70">Video visit starts in 10 minutes</p>
        </NotchCard>
        <NotchCard tone="aurora" className="min-h-40 min-w-52 flex-1 justify-between gap-6" action={<RoundAction tone="surface" size="md" href="#/notch-card" label="Open" />}>
          <p className="text-title-md">Aurora</p>
          <p className="pr-24 text-body-sm text-white/70">Your care plan for December</p>
        </NotchCard>
      </Demo>
      <Demo id="notch-card-round-action" files={["ui/notch-card"]} title="Round action" note="The pill that sits in the notch. Three tones and two sizes; its arrow leans toward where it goes on hover. iconOnly hides the words where the card already says what it does, and icon swaps the arrow.">
        <RoundAction href="#/notch-card" label="Book now" />
        <RoundAction href="#/notch-card" tone="ink" label="View results" />
        <RoundAction href="#/notch-card" tone="surface" label="Message Dr. Okafor" />
        <RoundAction href="#/notch-card" size="md" label="Book labs" />
        <RoundAction href="#/notch-card" size="md" tone="ink" label="New appointment" icon={<CalendarPlus aria-hidden />} />
        <RoundAction href="#/notch-card" iconOnly label="Open lipid panel" />
        <RoundAction href="#/notch-card" iconOnly size="md" tone="ink" label="Open visit summary" />
      </Demo>
      <Demo id="notch-card-on-a-surface" files={["ui/notch-card"]} title="Inside another surface" note="The notch is painted in the colour behind the card, the page canvas by default. Inside a card or panel, set --notch-bg to that surface's colour." className="items-stretch bg-surface-sunken [--notch-bg:var(--surface-sunken)]">
        <NotchCard className="min-h-40 max-w-sm flex-1 justify-between gap-6" action={<RoundAction size="md" href="#/notch-card" label="Request refill" />}>
          <div className="flex flex-col gap-1">
            <p className="text-title-md">Atorvastatin 20 mg</p>
            <p className="text-body-sm text-muted-foreground">One tablet every morning with food</p>
          </div>
          <p className="pr-36 text-body-sm text-muted-foreground">2 refills left · next due 14 December</p>
        </NotchCard>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "notch-card",
  title: "Notch card",
  group: "Components",
  summary: "The system's signature form: a card with one corner cut away in a curve and its single action resting in the cut. Use it for the few cards on a page that lead somewhere.",
  keywords: "signature card cutout corner round action hero aurora cta",
  Body,
};
