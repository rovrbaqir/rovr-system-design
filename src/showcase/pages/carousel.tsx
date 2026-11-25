import * as React from "react";
import { Activity, ArrowLeft, ArrowRight, Droplets, HeartPulse, Moon, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Carousel, type CarouselHandle, CarouselItem } from "@/components/ui/carousel";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const results = [
  { title: "Biomarkers", value: "42 of 47", unit: "in range", note: "Five values are outside the reference range. Your clinician has reviewed them." },
  { title: "Lipids", value: "131", unit: "mg/dL LDL", note: "Down from 148 mg/dL in August. Keep taking atorvastatin 20 mg each evening." },
  { title: "Blood sugar", value: "5.6", unit: "% HbA1c", note: "Within the normal range. No change since your last panel." },
  { title: "Thyroid", value: "2.1", unit: "mIU/L TSH", note: "Within the normal range. Recheck in 12 months." },
];

const services = [
  { name: "Annual physical", detail: "45 minutes with your primary care clinician, with a lipid and metabolic panel.", price: "$0 with your plan" },
  { name: "Sleep study at home", detail: "Two nights with a wrist sensor. Results in five working days.", price: "$189" },
  { name: "Nutrition consult", detail: "A video visit with a registered dietitian and a four-week plan.", price: "$95" },
  { name: "Skin check", detail: "A full-body exam with a dermatologist. Photos are saved to your record.", price: "$140" },
  { name: "Physiotherapy intake", detail: "Movement assessment and a home exercise plan.", price: "$110" },
  { name: "Flu vaccine", detail: "Walk in at any RoVR clinic. Takes about ten minutes.", price: "$0 with your plan" },
];

const quotes = [
  { text: "I got my results the same evening, with a note from my doctor that explained each number.", name: "Priya Raman", detail: "Patient since 2024" },
  { text: "Booking the follow-up took less than a minute, and the reminder came with directions to the clinic.", name: "Daniel Reyes", detail: "Patient since 2023" },
  { text: "The care plan is in one place. I no longer keep paper lists of my medications.", name: "Grace Mbeki", detail: "Patient since 2025" },
];

const devices = [
  { name: "Blood pressure cuff", reading: "118/76 mmHg", synced: "Synced today, 07:42", Icon: HeartPulse },
  { name: "Glucose monitor", reading: "104 mg/dL", synced: "Synced today, 08:15", Icon: Droplets },
  { name: "Smart scale", reading: "72.4 kg", synced: "Synced yesterday", Icon: Scale },
  { name: "Sleep ring", reading: "7 h 12 min", synced: "Synced today, 06:58", Icon: Moon },
  { name: "Pulse oximeter", reading: "98 %", synced: "Synced 3 days ago", Icon: Activity },
];

const steps = ["Order the kit", "Collect your sample", "Post it back", "Read your results"];
const stepNotes = [
  "The kit arrives in two working days. Postage is paid both ways.",
  "Follow the card in the box. Collect in the morning, before you eat.",
  "Seal the tube in the return bag and post it the same day.",
  "Results appear in your record within five working days, with a note from your clinician.",
];

function GuidedSteps() {
  const carousel = React.useRef<CarouselHandle>(null);
  const [step, setStep] = React.useState(1);
  const last = step === steps.length - 1;
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <p className="text-label text-muted-foreground text-data">
        Step {step + 1} of {steps.length}
      </p>
      <Carousel ref={carousel} aria-label="How home testing works" initialSlide={1} onSlideChange={setStep} arrows={false} indicator="none">
        {steps.map((title, index) => (
          <CarouselItem key={title} className="flex flex-col gap-1.5 rounded-lg bg-surface-sunken p-5">
            <h4 className="text-title-md">{title}</h4>
            <p className="text-body-sm text-muted-foreground">{stepNotes[index]}</p>
          </CarouselItem>
        ))}
      </Carousel>
      <div className="flex items-center justify-between gap-3">
        <Button variant="secondary" disabled={step === 0} onClick={() => carousel.current?.prev()}>
          <ArrowLeft /> Back
        </Button>
        <Button onClick={() => (last ? carousel.current?.scrollTo(0) : carousel.current?.next())}>
          {last ? "Start again" : "Next step"} {!last && <ArrowRight />}
        </Button>
      </div>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="carousel-single" files={["ui/carousel", "ui/button"]} title="One slide at a time" note="The default. Swipe or scroll sideways, press the buttons, or focus the slides and use the arrow keys. Dots jump to any slide.">
        <Carousel aria-label="Lab result summary" className="w-full max-w-md">
          {results.map((result) => (
            <CarouselItem key={result.title} className="flex flex-col gap-2 rounded-lg bg-surface-sunken p-5">
              <h4 className="text-label text-muted-foreground">{result.title}</h4>
              <p className="flex items-baseline gap-2">
                <span className="text-display-md text-data">{result.value}</span>
                <span className="text-body-sm text-muted-foreground">{result.unit}</span>
              </p>
              <p className="text-body-sm text-muted-foreground">{result.note}</p>
            </CarouselItem>
          ))}
        </Carousel>
      </Demo>
      <Demo id="carousel-cards" files={["ui/carousel", "ui/button", "ui/badge"]} title="A row of cards" note="slidesPerView sets how many fit across and peek shows the edge of the next one. With many slides, use the counter in place of dots.">
        <Carousel aria-label="Recommended services" slidesPerView={2} peek={40} gap={12} indicator="counter" className="w-full">
          {services.map((service) => (
            <CarouselItem key={service.name} className="flex min-h-44 flex-col gap-2 rounded-lg border border-border p-5">
              <h4 className="text-title-sm">{service.name}</h4>
              <p className="text-body-sm text-muted-foreground">{service.detail}</p>
              <Badge className="mt-auto text-data">{service.price}</Badge>
            </CarouselItem>
          ))}
        </Carousel>
      </Demo>
      <Demo id="carousel-loop" files={["ui/carousel", "ui/button"]} title="Loop" note="With loop, next on the last slide returns to the first, so the buttons are never disabled. Use it for short sets with no natural end, such as patient stories.">
        <Carousel aria-label="What patients say" loop gap={24} className="w-full max-w-xl">
          {quotes.map((quote) => (
            <CarouselItem key={quote.name}>
              <figure className="flex flex-col gap-4 px-1 py-2">
                <blockquote className="text-title-lg">{quote.text}</blockquote>
                <figcaption className="flex flex-col">
                  <span className="text-label">{quote.name}</span>
                  <span className="text-caption text-muted-foreground">{quote.detail}</span>
                </figcaption>
              </figure>
            </CarouselItem>
          ))}
        </Carousel>
      </Demo>
      <Demo id="carousel-auto-width" files={["ui/carousel", "ui/button"]} title="Width from the item" note='Set slidesPerView to "auto" and give each CarouselItem a width with className. The row then shows as many as fit, at any screen size.'>
        <Carousel aria-label="Connected devices" slidesPerView="auto" gap={12} indicator="none" className="w-full">
          {devices.map(({ name, reading, synced, Icon }) => (
            <CarouselItem key={name} className="flex w-52 flex-col gap-3 rounded-lg bg-surface-sunken p-4">
              <Icon className="size-5 text-muted-foreground" aria-hidden />
              <div className="flex flex-col gap-0.5">
                <h4 className="text-label">{name}</h4>
                <p className="text-title-md text-data">{reading}</p>
                <p className="text-caption text-muted-foreground">{synced}</p>
              </div>
            </CarouselItem>
          ))}
        </Carousel>
      </Demo>
      <Demo id="carousel-controlled" files={["ui/carousel", "ui/button"]} title="Your own controls" note="Hide the built-in controls and drive the carousel through its ref. initialSlide sets where it starts and onSlideChange reports where it is, also after a swipe.">
        <GuidedSteps />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "carousel",
  title: "Carousel",
  group: "Components",
  summary: "A row of slides that scrolls sideways and snaps into place, with previous and next buttons and dots or a counter. Use it when a set of cards does not fit across, or to step through a short sequence.",
  keywords: "slider swiper slideshow scroller gallery testimonials cards scroll snap",
  Body,
};
