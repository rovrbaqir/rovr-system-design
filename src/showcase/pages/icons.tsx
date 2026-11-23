import * as React from "react";
import {
  Activity,
  Apple,
  ArrowRight,
  Bell,
  Brain,
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Clock,
  Copy,
  CreditCard,
  Download,
  Droplet,
  Dumbbell,
  ExternalLink,
  FileText,
  FlaskConical,
  HeartPulse,
  Info,
  type LucideIcon,
  Mail,
  MapPin,
  MessageSquare,
  Moon,
  Paperclip,
  Pencil,
  Pill,
  Plus,
  Scale,
  Search,
  Settings,
  ShieldCheck,
  Smartphone,
  Stethoscope,
  Syringe,
  Thermometer,
  Trash2,
  TriangleAlert,
  Upload,
  UserRound,
  Users,
  Video,
  Watch,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { SearchInput, Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { Demo, Token } from "../kit";
import type { DocPage } from "../types";

const sizes = [
  ["size-3.5", "14px", "Inside small tags and dense table rows"],
  ["size-4", "16px", "The default: buttons, fields, menus, nav items"],
  ["size-5", "20px", "Card headers and list rows"],
  ["size-6", "24px", "Empty states and page-level markers"],
] as const;

const groups: { title: string; icons: [string, LucideIcon][] }[] = [
  {
    title: "Interface",
    icons: [
      ["Search", Search],
      ["Plus", Plus],
      ["X", X],
      ["Check", Check],
      ["ChevronDown", ChevronDown],
      ["ChevronRight", ChevronRight],
      ["ArrowRight", ArrowRight],
      ["Copy", Copy],
      ["Pencil", Pencil],
      ["Trash2", Trash2],
      ["Download", Download],
      ["Upload", Upload],
      ["Paperclip", Paperclip],
      ["ExternalLink", ExternalLink],
      ["Settings", Settings],
      ["Bell", Bell],
    ],
  },
  {
    title: "Status",
    icons: [
      ["Info", Info],
      ["CircleCheck", CircleCheck],
      ["TriangleAlert", TriangleAlert],
      ["CircleAlert", CircleAlert],
      ["ShieldCheck", ShieldCheck],
    ],
  },
  {
    title: "Care",
    icons: [
      ["CalendarDays", CalendarDays],
      ["CalendarPlus", CalendarPlus],
      ["Clock", Clock],
      ["Video", Video],
      ["MapPin", MapPin],
      ["Stethoscope", Stethoscope],
      ["FlaskConical", FlaskConical],
      ["Pill", Pill],
      ["Syringe", Syringe],
      ["FileText", FileText],
      ["MessageSquare", MessageSquare],
      ["Mail", Mail],
      ["UserRound", UserRound],
      ["Users", Users],
      ["CreditCard", CreditCard],
    ],
  },
  {
    title: "Health data",
    icons: [
      ["HeartPulse", HeartPulse],
      ["Activity", Activity],
      ["Thermometer", Thermometer],
      ["Droplet", Droplet],
      ["Scale", Scale],
      ["Moon", Moon],
      ["Dumbbell", Dumbbell],
      ["Apple", Apple],
      ["Brain", Brain],
      ["Watch", Watch],
      ["Smartphone", Smartphone],
    ],
  },
];

function IconGallery() {
  const [query, setQuery] = React.useState("");
  const q = query.trim().toLowerCase();
  const visible = groups.map((g) => ({ ...g, icons: g.icons.filter(([name]) => name.toLowerCase().includes(q)) })).filter((g) => g.icons.length > 0);
  const copy = async (name: string) => {
    const line = `import { ${name} } from "lucide-react";`;
    try {
      await navigator.clipboard.writeText(line);
      toast.success("Import copied", { description: line });
    } catch {
      toast.error("Could not copy", { description: "Copy the name by hand instead." });
    }
  };
  return (
    <div className="flex w-full flex-col gap-6">
      <SearchInput aria-label="Filter icons" placeholder="Filter by name" value={query} onValueChange={setQuery} className="max-w-xs" />
      {visible.map((group) => (
        <div key={group.title} className="flex flex-col gap-2">
          <p className="text-label text-muted-foreground">{group.title}</p>
          <ul className="grid grid-cols-[repeat(auto-fill,minmax(7.5rem,1fr))] gap-1">
            {group.icons.map(([name, Icon]) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => copy(name)}
                  aria-label={`Copy the import for ${name}`}
                  className="flex w-full cursor-pointer flex-col items-center gap-2.5 rounded-lg px-2 py-4 rovr-focus rovr-press hover:bg-secondary"
                >
                  <Icon className="size-5" />
                  <span className="max-w-full truncate font-mono text-[0.6875rem] text-muted-foreground">{name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
      {visible.length === 0 && (
        <p className="text-body-sm text-muted-foreground">
          No icon here is called "{query.trim()}". These are only the ones RoVR uses most; the full set is on lucide.dev.
        </p>
      )}
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="icons-library" title="The library" note="One icon set across the patient app and the provider app, so a calendar or a pill looks the same everywhere." className="flex-col items-start gap-4">
        <p className="max-w-[62ch] text-body">
          RoVR uses <span className="font-medium">Lucide</span>, through the <Token>lucide-react</Token> package. Every icon is a React component you
          import by name. Do not add a second icon set or hand-drawn SVGs for things Lucide already has.
        </p>
        <pre className="w-full max-w-xl overflow-x-auto rounded-lg bg-surface-sunken p-4 font-mono text-[0.8125rem] leading-relaxed">{`pnpm add lucide-react\n\nimport { CalendarDays } from "lucide-react";\n\n<CalendarDays className="size-5" />`}</pre>
        <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="group inline-flex items-center gap-2 rounded-xs text-body text-accent-foreground rovr-focus">
          Browse every icon on lucide.dev
          <ExternalLink className="size-4" />
        </a>
      </Demo>
      <Demo id="icons-sizes" title="Sizes" note="Set the size with a size- class. The stroke stays 1.5 at every size: the theme sets it once for all Lucide icons, so do not pass strokeWidth." className="flex-col items-stretch gap-4">
        {sizes.map(([cls, px, use]) => (
          <div key={cls} className="grid grid-cols-[2rem_6.5rem_minmax(0,1fr)] items-center gap-4">
            <HeartPulse className={cls} />
            <span className="font-mono text-[0.75rem]">
              {cls} <span className="text-muted-foreground">{px}</span>
            </span>
            <span className="text-body-sm text-muted-foreground">{use}</span>
          </div>
        ))}
      </Demo>
      <Demo id="icons-in-components" files={["ui/button", "ui/input", "ui/callout", "ui/tooltip"]} title="Inside components" note="Buttons, fields and menus size and space their icons for you: pass the icon as a child with no classes. An icon-only button needs an aria-label and a tooltip." className="flex-col items-start gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <CalendarPlus /> Book a visit
          </Button>
          <Button variant="secondary">
            Continue <ArrowRight />
          </Button>
          <Tooltip content="Download summary">
            <Button variant="outline" size="icon-md" aria-label="Download summary">
              <Download />
            </Button>
          </Tooltip>
        </div>
        <Input leading={<Mail />} placeholder="name@example.com" aria-label="Email" className="max-w-xs" />
        <Callout tone="warning" title="Fasting required before this test" className="w-full">
          Callouts and toasts choose their own icon from the tone.
        </Callout>
      </Demo>
      <Demo id="icons-colour" title="Colour" note="An icon takes the colour of the text around it. Use a text colour class, never a fill. Status colours need words beside them.">
        <span className="flex items-center gap-2 text-body">
          <Clock className="size-4" /> Default
        </span>
        <span className="flex items-center gap-2 text-body text-muted-foreground">
          <Clock className="size-4" /> Muted
        </span>
        <span className="flex items-center gap-2 text-body text-accent-foreground">
          <Clock className="size-4" /> Accent
        </span>
        <span className="flex items-center gap-2 text-body text-success-fg">
          <CircleCheck className="size-4" /> In range
        </span>
        <span className="flex items-center gap-2 text-body text-warning-fg">
          <TriangleAlert className="size-4" /> Needs review
        </span>
        <span className="flex items-center gap-2 text-body text-destructive-fg">
          <CircleAlert className="size-4" /> Overdue
        </span>
      </Demo>
      <Demo id="icons-common" title="Icons RoVR uses most" note="Use these names for these meanings so the two apps stay consistent. Press one to copy its import line." className="items-start">
        <IconGallery />
      </Demo>
      <Demo id="icons-rules" title="Rules" bare className="items-start">
        <ul className="grid w-full gap-x-10 gap-y-4 text-body sm:grid-cols-2">
          {[
            ["Words first", "Every action is a worded button. An icon supports the label; it replaces it only in tight toolbars, with an aria-label and a tooltip."],
            ["One meaning per icon", "CalendarDays is always an appointment and Pill is always a medication. Do not reuse an icon for a second idea."],
            ["No tinted squares", "An icon stands on its own or not at all. Do not put it inside a coloured rounded box."],
            ["Decorative icons are hidden", "Lucide icons are aria-hidden by default. Give meaning with text beside them, not with the icon alone."],
            ["No emoji", "Emoji render differently on every device. Use an icon or plain words."],
            ["Brand marks are not icons", "Logos for Apple Health, insurers or labs come from those companies' own assets, not from Lucide."],
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

export const page: DocPage = {
  slug: "icons",
  title: "Icons",
  group: "Foundations",
  order: 5,
  summary: "RoVR uses the Lucide icon set through lucide-react: outlined icons at a 1.5 stroke, 16px inside controls. One set for both apps.",
  keywords: "lucide icon svg glyph symbol",
  Body,
};
