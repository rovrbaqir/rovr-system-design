import * as React from "react";
import { RotateCw, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Demo } from "../kit";
import type { DocPage } from "../types";

// The demo pictures are drawn here as SVG data URIs, so the page needs no network.
// A data URI cannot read CSS variables, so the brand colours from rovr.css are repeated.
const svg = (width: number, height: number, body: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`)}`;

const scene = (id: string, from: string, to: string, glow: string) =>
  svg(
    960,
    720,
    `<defs><linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
      `<rect width="960" height="720" fill="url(#${id})"/>` +
      `<circle cx="760" cy="150" r="260" fill="${glow}" opacity="0.35"/>` +
      `<circle cx="180" cy="640" r="320" fill="#ffffff" opacity="0.1"/>` +
      `<path d="M0 520 C 220 420 420 620 640 500 S 900 420 960 470 V720 H0 Z" fill="#ffffff" opacity="0.14"/>`,
  );

const clinic = scene("clinic", "#152163", "#546eff", "#a0aeff");
const lab = scene("lab", "#0e9f8e", "#546eff", "#f2f3fe");
const sleep = scene("sleep", "#152163", "#c13bff", "#546eff");

const insuranceCard = svg(
  640,
  400,
  `<rect width="640" height="400" rx="28" fill="#f2f3fe"/>` +
    `<rect x="40" y="44" width="150" height="26" rx="13" fill="#546eff"/>` +
    `<rect x="40" y="150" width="300" height="20" rx="10" fill="#152163" opacity="0.8"/>` +
    `<rect x="40" y="190" width="210" height="16" rx="8" fill="#152163" opacity="0.35"/>` +
    `<rect x="40" y="300" width="130" height="16" rx="8" fill="#152163" opacity="0.35"/>` +
    `<rect x="210" y="300" width="130" height="16" rx="8" fill="#152163" opacity="0.35"/>` +
    `<circle cx="540" cy="100" r="50" fill="#546eff" opacity="0.18"/>`,
);

/** A data URI that is not an image, to show what a failed request looks like. */
const broken = "data:image/png;base64,AAAA";

function SlowImage() {
  const [pending, setPending] = React.useState(true);
  React.useEffect(() => {
    if (!pending) return;
    const t = setTimeout(() => setPending(false), 1400);
    return () => clearTimeout(t);
  }, [pending]);
  return (
    <div className="flex w-full max-w-sm flex-col items-start gap-3">
      <Image src={clinic} alt="Waiting room at the Riverside clinic" ratio="16/9" pending={pending} className="w-full" />
      <Button variant="secondary" size="sm" onClick={() => setPending(true)}>
        <RotateCw /> Load again
      </Button>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="image-ratios" files={["ui/image", "ui/skeleton"]} title="Ratios" note="Set ratio so the frame keeps its space while the image loads and the page does not jump. Without a ratio, give the frame a size with className." className="items-start">
        <Image src={clinic} alt="Waiting room at the Riverside clinic" ratio="16/9" className="w-64" />
        <Image src={lab} alt="Sample tubes in the lab" ratio="4/3" className="w-48" />
        <Image src={sleep} alt="Night sky over the sleep clinic" ratio="1/1" className="w-36" />
      </Demo>
      <Demo id="image-loading" files={["ui/image", "ui/skeleton", "ui/button"]} title="Loading" note="A skeleton holds the frame until the image arrives, then the image fades and sharpens in. Set pending while you are still fetching the URL. With reduced motion it only fades.">
        <SlowImage />
      </Demo>
      <Demo id="image-fallback" files={["ui/image", "ui/skeleton"]} title="Fallback" note="An empty src or a failed request shows a fallback in the same frame. Add fallbackText to say what is missing, or pass your own node." className="items-start">
        <Image src="" alt="Dr. Lena Fischer" ratio="1/1" className="w-36" />
        <Image src={broken} alt="Chest X-ray, 12 November 2026" ratio="4/3" fallbackText="This image could not be loaded." className="w-48" />
        <Image
          src={null}
          alt="Amara Osei"
          ratio="1/1"
          radius="full"
          className="w-36"
          fallback={
            <>
              <UserRound className="size-6 text-subtle-foreground" aria-hidden />
              <span className="text-caption">No photo yet</span>
            </>
          }
        />
      </Demo>
      <Demo id="image-fit" files={["ui/image", "ui/skeleton"]} title="Fit" note="Cover fills the frame and crops the edges. Use contain for insurance cards, scans and logos, where nothing may be cut off." className="items-start">
        <figure className="flex flex-col gap-2">
          <Image src={insuranceCard} alt="Front of insurance card" ratio="1/1" fit="cover" className="w-44" />
          <figcaption className="text-caption text-muted-foreground">Cover</figcaption>
        </figure>
        <figure className="flex flex-col gap-2">
          <Image src={insuranceCard} alt="Front of insurance card" ratio="1/1" fit="contain" className="w-44 bg-surface-sunken" imgClassName="p-3" />
          <figcaption className="text-caption text-muted-foreground">Contain</figcaption>
        </figure>
      </Demo>
      <Demo id="image-radius" files={["ui/image", "ui/skeleton"]} title="Radius" note="Match the radius to the surface the image sits in: lg inside a card, xl when it is the card, full for a round portrait." className="items-start">
        <Image src={lab} alt="Sample tubes in the lab" ratio="1/1" radius="none" className="w-28" />
        <Image src={lab} alt="Sample tubes in the lab" ratio="1/1" radius="md" className="w-28" />
        <Image src={lab} alt="Sample tubes in the lab" ratio="1/1" radius="lg" className="w-28" />
        <Image src={lab} alt="Sample tubes in the lab" ratio="1/1" radius="xl" className="w-28" />
        <Image src={lab} alt="Sample tubes in the lab" ratio="1/1" radius="full" className="w-28" />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "image",
  title: "Image",
  group: "Components",
  summary: "An image in a frame that shows a skeleton until it loads, fades in, loads lazily and falls back to an icon when there is no picture. Use it for any photo, scan or product picture.",
  keywords: "img picture photo lazy blur skeleton fallback thumbnail aspect ratio",
  Body,
};
