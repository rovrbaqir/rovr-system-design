import * as React from "react";
import { FlaskConical, RotateCw } from "lucide-react";
import { ServiceCard, TileCard, TileList, type TileItem } from "@/components/patterns/tile-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Demo } from "../kit";
import type { DocPage } from "../types";

// The demo pictures are drawn here as SVG data URIs, so the page needs no network.
// A data URI cannot read CSS variables, so the brand colours from rovr.css are repeated.
const scene = (id: string, from: string, to: string, glow: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720">` +
      `<defs><linearGradient id="${id}" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient></defs>` +
      `<rect width="960" height="720" fill="url(#${id})"/>` +
      `<circle cx="760" cy="150" r="260" fill="${glow}" opacity="0.35"/>` +
      `<circle cx="180" cy="640" r="320" fill="#ffffff" opacity="0.1"/>` +
      `<path d="M0 520 C 220 420 420 620 640 500 S 900 420 960 470 V720 H0 Z" fill="#ffffff" opacity="0.14"/>` +
      `</svg>`,
  )}`;

const clinic = scene("clinic", "#152163", "#546eff", "#a0aeff");
const lab = scene("lab", "#0e9f8e", "#546eff", "#f2f3fe");
const sleep = scene("sleep", "#152163", "#c13bff", "#546eff");
const imaging = scene("imaging", "#152163", "#0e9f8e", "#a0aeff");
const therapy = scene("therapy", "#c8780f", "#e0457b", "#f2f3fe");

function HomeTiles() {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    if (!loading) return;
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, [loading]);
  return (
    <div className="flex w-full flex-col items-start gap-3">
      <div className="grid w-full grid-cols-2 gap-3">
        <div className="h-44">
          <TileCard
            title="Upcoming visit"
            description="Thu 3 Dec, 09:30 with Dr. Okafor"
            subDescription="Video visit. Join from this tile ten minutes before."
            image={clinic}
            loading={loading}
            cardClickable
            onClick={() => toast.message("Open visit details")}
            onAppointmentClick={() => toast.message("Book a new appointment")}
          />
        </div>
        <div className="h-44">
          <TileCard title="Lab results" description="Lipid panel, 12 Nov" subDescription="LDL 131 mg/dL, a little above range." image={lab} loading={loading} cardClickable onClick={() => toast.message("Open lab results")} />
        </div>
        <div className="h-44">
          <TileCard title="Medications" description="No medications yet" loading={loading} showPlusIcon cardClickable onClick={() => toast.message("Add a medication")} />
        </div>
        <div className="h-44">
          <TileCard title="Sleep" description="7 h 12 min last night" image={sleep} loading={loading} arrowIconLocation="top-right" cardClickable onClick={() => toast.message("Open sleep")} />
        </div>
      </div>
      <Button variant="secondary" size="sm" onClick={() => setLoading(true)}>
        <RotateCw /> Load again
      </Button>
    </div>
  );
}

const labItems: TileItem[] = [
  { item_type: "labs", title: "Lipid panel", description: "Collected 12 November, fasting", image: lab, onClick: () => toast.message("Open lipid panel") },
  { item_type: "imaging", title: "Chest X-ray", description: "Riverside Imaging, 2 views", image: imaging, onClick: () => toast.message("Book chest X-ray") },
  { item_type: "testing", title: "Sleep study", description: "At-home test, two nights", image: sleep, linkText: "Order Kit", onClick: () => toast.message("Order sleep study kit") },
];

const careItems: TileItem[] = [
  { item_type: "visit", title: "Annual physical", description: "Dr. Ngozi Okafor, 45 minutes", image: clinic, onClick: () => toast.message("Book annual physical") },
  { item_type: "advanced-services", title: "Red light therapy", description: "20 minute session", image: therapy, onClick: () => toast.message("Book red light therapy") },
  { item_type: "wearables", title: "Connect a wearable", description: "Share sleep and heart rate", image: null, linkText: "Connect", onClick: () => toast.message("Connect a wearable") },
];

function Body() {
  return (
    <>
      <Demo
        id="tile-card-tiles"
        files={["patterns/tile-card", "ui/image", "ui/badge", "ui/button", "ui/skeleton", "ui/toast"]}
        title="Tile card"
        note="A picture tile for the home grid. Hover or focus a tile and the full text rises from the bottom. The arrow sits bottom right on a tile with a picture and top right without one. The tile fills its parent, so the grid sets the size."
        className="items-start"
      >
        <HomeTiles />
      </Demo>
      <Demo
        id="tile-card-states"
        files={["patterns/tile-card", "ui/image", "ui/badge", "ui/skeleton"]}
        title="Locked, coming soon, loading"
        note="A locked tile shows a lock next to its title and does not react to the pointer. A coming-soon tile carries a badge and cannot be pressed. Loading shows two skeleton lines where the title will be."
        className="items-start"
      >
        <div className="grid w-full grid-cols-2 gap-3">
          <div className="h-44">
            <TileCard title="Advanced services" description="Included with Plus" image={therapy} locked cardClickable />
          </div>
          <div className="h-44">
            <TileCard title="Imaging" description="Book scans near you" image={imaging} comingSoon cardClickable />
          </div>
          <div className="h-44">
            <TileCard title="Care plan" image={clinic} multiTenant locked />
          </div>
          <div className="h-44">
            <TileCard title="Lab results" loading />
          </div>
        </div>
      </Demo>
      <Demo
        id="tile-card-list"
        files={["patterns/tile-card", "ui/image", "ui/button", "ui/skeleton", "ui/toast"]}
        title="Tile list"
        note="A titled stack of rows, each with an icon for its kind, a title, one line, a link and a picture. Labs link to results and everything else to booking unless linkText says otherwise. A visit shows a round portrait."
        bare
        className="items-stretch gap-6"
      >
        <div className="h-[26rem] min-w-72 flex-1">
          <TileList title="Labs and imaging" titleIcon={<FlaskConical />} items={labItems} />
        </div>
        <div className="h-[26rem] min-w-72 flex-1">
          <TileList title="Recommended for you" items={careItems} />
        </div>
      </Demo>
      <Demo
        id="tile-card-list-states"
        files={["patterns/tile-card", "ui/image", "ui/button", "ui/skeleton"]}
        title="Tile list states"
        note="Completed replaces every link with the word Completed. Coming soon blurs the list under a lock. Loading shows two skeleton rows, and an empty list shows a lock on its own."
        bare
        className="items-stretch gap-6"
      >
        <div className="h-72 min-w-64 flex-1">
          <TileList title="Completed" items={labItems.slice(0, 2)} isCompleted />
        </div>
        <div className="h-72 min-w-64 flex-1">
          <TileList title="Coming soon" items={careItems.slice(0, 2)} status="coming-soon" />
        </div>
        <div className="h-72 min-w-64 flex-1">
          <TileList title="Loading" items={[]} isLoading />
        </div>
      </Demo>
      <Demo
        id="tile-card-service"
        files={["patterns/tile-card", "ui/image", "ui/badge", "ui/toast"]}
        title="Service card"
        note="A service in the catalogue. The price sits on the left of its row and the tags on the right. Set descriptionOnTop to lay the text over the picture; the picture then darkens a little on hover."
        bare
        className="items-stretch gap-4"
      >
        <div className="h-80 min-w-56 flex-1">
          <ServiceCard
            name="Red light therapy"
            fromPrice="$45"
            img={therapy}
            description="A 20 minute session for skin and muscle recovery."
            tags={<Badge tone="info">Popular</Badge>}
            onClick={() => toast.message("Open red light therapy")}
          />
        </div>
        <div className="h-80 min-w-56 flex-1">
          <ServiceCard name="IV hydration" fromPrice="$120" img={lab} description="Fluids and electrolytes, given by a nurse." priceVisible={false} tags={<Badge>Members only</Badge>} onClick={() => toast.message("Open IV hydration")} />
        </div>
        <div className="h-80 min-w-56 flex-1">
          <ServiceCard name="Sleep coaching" fromPrice="$80" img={sleep} description="Four sessions with a sleep specialist." descriptionOnTop onClick={() => toast.message("Open sleep coaching")} />
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "tile-card",
  title: "Tile card",
  group: "Examples",
  summary:
    "Patient app. Replaces TileCard, TileList with TileListItem, and the services ServiceCard. Picture tiles for the home grid, a titled list of bookable items, and a catalogue card with a price and tags.",
  keywords: "tile image card grid home list service catalogue price locked coming soon",
  Body,
};
