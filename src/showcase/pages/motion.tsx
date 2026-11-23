import * as React from "react";
import { CalendarDays, FlaskConical, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { NumberTicker, Parallax, Reveal, RevealGroup } from "@/components/ui/motion";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function TickerFigures() {
  const [week, setWeek] = React.useState(0);
  const data = [
    { visits: 148, noShow: 4.8, collected: 58250 },
    { visits: 163, noShow: 3.9, collected: 61480 },
  ][week];
  return (
    <div className="flex w-full flex-col gap-5">
      <dl className="grid gap-x-10 gap-y-5 sm:grid-cols-3">
        <div className="flex flex-col gap-1">
          <dt className="text-label text-muted-foreground">Visits</dt>
          <dd className="text-[2rem] leading-none font-medium">
            <NumberTicker value={data.visits} />
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-label text-muted-foreground">No-show rate</dt>
          <dd className="text-[2rem] leading-none font-medium">
            <NumberTicker value={data.noShow} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} />
            <span className="ml-1 text-body-sm font-normal text-muted-foreground">%</span>
          </dd>
        </div>
        <div className="flex flex-col gap-1">
          <dt className="text-label text-muted-foreground">Collected</dt>
          <dd className="text-[2rem] leading-none font-medium">
            <NumberTicker value={data.collected} format={{ style: "currency", currency: "USD", maximumFractionDigits: 0 }} />
          </dd>
        </div>
      </dl>
      <Button variant="secondary" size="sm" className="w-fit" onClick={() => setWeek((w) => (w === 0 ? 1 : 0))}>
        Show {week === 0 ? "this week" : "last week"}
      </Button>
    </div>
  );
}

function RevealOnce() {
  const [run, setRun] = React.useState(0);
  return (
    <div className="flex w-full flex-col gap-4">
      <div key={run} className="grid gap-4 sm:grid-cols-2">
        <Reveal className="rounded-lg bg-surface-sunken p-4">
          <p className="text-title-sm">Default</p>
          <p className="text-body-sm text-muted-foreground">Fades in and rises 16px.</p>
        </Reveal>
        <Reveal delay={0.25} y={40} className="rounded-lg bg-surface-sunken p-4">
          <p className="text-title-sm">Later and further</p>
          <p className="text-body-sm text-muted-foreground">A 0.25 second delay and a 40px rise.</p>
        </Reveal>
      </div>
      <Button variant="secondary" size="sm" className="w-fit" onClick={() => setRun((r) => r + 1)}>
        Play again
      </Button>
    </div>
  );
}

function RevealList() {
  const [run, setRun] = React.useState(0);
  return (
    <div className="flex w-full flex-col gap-4">
      <RevealGroup key={run} stagger={0.1} className="grid gap-3 sm:grid-cols-3">
        <Card className="gap-2">
          <CalendarDays className="size-5 text-muted-foreground" aria-hidden />
          <p className="text-title-sm">Book a visit</p>
          <p className="text-body-sm text-muted-foreground">Video or in clinic, often the same week.</p>
        </Card>
        <Card className="gap-2">
          <FlaskConical className="size-5 text-muted-foreground" aria-hidden />
          <p className="text-title-sm">See your results</p>
          <p className="text-body-sm text-muted-foreground">Labs arrive with the reference range beside them.</p>
        </Card>
        <Card className="gap-2">
          <MessageSquare className="size-5 text-muted-foreground" aria-hidden />
          <p className="text-title-sm">Message your care team</p>
          <p className="text-body-sm text-muted-foreground">Replies within one working day.</p>
        </Card>
      </RevealGroup>
      <Button variant="secondary" size="sm" className="w-fit" onClick={() => setRun((r) => r + 1)}>
        Play again
      </Button>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="motion-number-ticker" files={["ui/motion"]} title="Number ticker" note="Counts to its value once, when first seen, then tracks later changes. format takes Intl.NumberFormat options. For summary figures only: never for a clinical reading someone needs to read at once." className="items-start">
        <TickerFigures />
      </Demo>
      <Demo id="motion-reveal" files={["ui/motion", "ui/button"]} title="Reveal" note="Fades and lifts content into place the first time it scrolls into view. delay and y adjust the timing and the distance. For marketing and overview pages; an app screen should be ready the moment it loads." className="items-start">
        <RevealOnce />
      </Demo>
      <Demo id="motion-reveal-group" files={["ui/motion", "ui/card", "ui/button"]} title="Reveal group" note="Reveals its direct children one after another; stagger is the gap between them in seconds. Keep to six children or fewer." bare className="items-start">
        <RevealList />
      </Demo>
      <Demo id="motion-parallax" files={["ui/motion"]} title="Parallax" note="Scroll the page. The two layers drift at different speeds as they cross the viewport; a negative offset moves against the scroll. Decorative layers only, and it holds still with reduced motion." className="items-start">
        <div className="relative h-56 w-full overflow-hidden rounded-lg bg-surface-sunken">
          <Parallax offset={48} className="absolute top-8 left-[12%]">
            <div className="size-28 rounded-full border border-border-strong" />
          </Parallax>
          <Parallax offset={-24} className="absolute top-16 right-[14%]">
            <div className="size-20 rounded-lg bg-accent" />
          </Parallax>
          <p className="absolute inset-x-0 bottom-4 text-center text-body-sm text-muted-foreground">offset 48 on the left, offset −24 on the right</p>
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "motion",
  title: "Motion helpers",
  group: "Components",
  summary: "Four motion helpers: NumberTicker for summary figures, Reveal and RevealGroup for content that enters on scroll, and Parallax for decorative layers. All of them respect the reduced motion setting.",
  keywords: "animation number ticker count up reveal scroll parallax stagger entrance",
  Body,
};
