import * as React from "react";
import { Activity, CalendarDays, FileText, FlaskConical, HeartPulse, LayoutDashboard, MessageSquare, Pill, Settings, UserRound, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, DonutChart, LineChart } from "@/components/ui/chart";
import { Chip, ChipGroup } from "@/components/ui/chip";
import { CommandPalette, CommandTrigger, useCommandShortcut, type CommandItem } from "@/components/ui/command";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { DescriptionItem, DescriptionList } from "@/components/ui/description-list";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { List, ListItem } from "@/components/ui/list";
import { Meter } from "@/components/ui/meter";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { SuccessBurst } from "@/components/ui/success-burst";
import { TimePicker } from "@/components/ui/time-picker";
import { toast } from "@/components/ui/toast";
import { ChatComposer, ChatMessage, ChatTyping } from "@/components/patterns/chat";
import { MedicationCard } from "@/components/patterns/medication-card";
import { ScheduleDay, type ScheduleEvent } from "@/components/patterns/schedule-day";
import { VitalTile } from "@/components/patterns/vital-tile";
import { Demo, Section } from "./kit";

const weeks = ["Sep 7", "Sep 14", "Sep 21", "Sep 28", "Oct 5", "Oct 12", "Oct 19", "Oct 26", "Nov 2", "Nov 9", "Nov 16", "Nov 23"];
const visits = {
  "In clinic": [212, 224, 198, 236, 241, 229, 252, 248, 263, 259, 271, 284],
  Video: [96, 104, 118, 121, 137, 142, 139, 158, 163, 171, 186, 192],
};
const byDay = [
  { label: "Mon", value: 62 },
  { label: "Tue", value: 71 },
  { label: "Wed", value: 58 },
  { label: "Thu", value: 77 },
  { label: "Fri", value: 49 },
  { label: "Sat", value: 18 },
];
const payers = [
  { label: "Commercial", value: 1240 },
  { label: "Medicare", value: 610 },
  { label: "Medicaid", value: 330 },
  { label: "Self-pay", value: 190 },
];

const events: ScheduleEvent[] = [
  { id: "1", title: "Amara Osei", detail: "Follow-up · Room 2", start: "08:30", end: "09:00" },
  { id: "2", title: "Daniel Reyes", detail: "Lab review · Video", start: "09:00", end: "09:30", tone: "success" },
  { id: "3", title: "Priya Raman", detail: "Annual physical · Room 1", start: "09:45", end: "10:45" },
  { id: "4", title: "Team huddle", start: "11:00", end: "11:20", tone: "neutral" },
  { id: "5", title: "Tomás Lindqvist", detail: "Same-day sick visit · Room 2", start: "11:30", end: "12:00", tone: "warning" },
  { id: "6", title: "Grace Mbeki", detail: "New patient · Room 3", start: "13:00", end: "14:00" },
];

function Charts() {
  const [mode, setMode] = React.useState<"both" | "clinic">("both");
  const series = Object.entries(visits)
    .filter(([name]) => mode === "both" || name === "In clinic")
    .map(([label, data]) => ({ label, data }));
  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-title-md">Visits per week</p>
          <p className="text-body-sm text-muted-foreground">Last 12 weeks, all locations</p>
        </div>
        <SegmentedControl
          size="sm"
          aria-label="Series"
          value={mode}
          onValueChange={setMode}
          options={[
            { value: "both", label: "By format" },
            { value: "clinic", label: "In clinic only" },
          ]}
        />
      </div>
      <LineChart key={mode} aria-label="Visits per week by format" labels={weeks} series={series} />
    </div>
  );
}

function Palette() {
  const [open, setOpen] = React.useState(false);
  useCommandShortcut(React.useCallback(() => setOpen((o) => !o), []));
  const go = (label: string) => () => toast.message(`Opened ${label}`);
  const items: CommandItem[] = [
    { id: "p1", group: "Patients", label: "Amara Osei", keywords: "20418", icon: <UserRound />, onSelect: go("Amara Osei") },
    { id: "p2", group: "Patients", label: "Daniel Reyes", keywords: "19307", icon: <UserRound />, onSelect: go("Daniel Reyes") },
    { id: "p3", group: "Patients", label: "Priya Raman", keywords: "22190", icon: <UserRound />, onSelect: go("Priya Raman") },
    { id: "n1", group: "Go to", label: "Mission control", icon: <LayoutDashboard />, shortcut: "G M", onSelect: go("Mission control") },
    { id: "n2", group: "Go to", label: "Schedule", icon: <CalendarDays />, shortcut: "G S", onSelect: go("Schedule") },
    { id: "n3", group: "Go to", label: "Labs and imaging", icon: <FlaskConical />, onSelect: go("Labs and imaging") },
    { id: "n4", group: "Go to", label: "Prescriptions", keywords: "rx medications", icon: <Pill />, onSelect: go("Prescriptions") },
    { id: "a1", group: "Actions", label: "New appointment", icon: <CalendarDays />, shortcut: "N", onSelect: go("New appointment") },
    { id: "a2", group: "Actions", label: "Send a message", icon: <MessageSquare />, onSelect: go("Messages") },
    { id: "a3", group: "Actions", label: "Open settings", icon: <Settings />, onSelect: go("Settings") },
  ];
  return (
    <>
      <CommandTrigger onClick={() => setOpen(true)}>Search patients, pages, actions</CommandTrigger>
      <CommandPalette open={open} onOpenChange={setOpen} items={items} />
    </>
  );
}

function Thread() {
  const [messages, setMessages] = React.useState<{ from: "self" | "other"; text: string }[]>([
    { from: "other", text: "Your lipid panel is back. LDL is 131 mg/dL, a little above range. I'd like to raise your atorvastatin to 20 mg." },
    { from: "self", text: "Okay. Should I keep taking it in the morning?" },
  ]);
  const [typing, setTyping] = React.useState(false);
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      {messages.map((m, i) => (
        <ChatMessage key={i} from={m.from} author={i === 0 ? "Dr. Ngozi Okafor" : undefined} time={i === 0 ? "10:42" : undefined}>
          {m.text}
        </ChatMessage>
      ))}
      {typing && <ChatTyping label="Dr. Okafor is writing" />}
      <ChatComposer
        className="mt-2"
        placeholder="Message Dr. Okafor"
        onAttach={() => toast.message("Attach a file")}
        onSend={(text) => {
          setMessages((m) => [...m, { from: "self", text }]);
          setTyping(true);
          setTimeout(() => {
            setTyping(false);
            setMessages((m) => [...m, { from: "other", text: "Yes, mornings with food is fine. We'll recheck in 8 weeks." }]);
          }, 1800);
        }}
      />
    </div>
  );
}

export function Dashboard() {
  const [time, setTime] = React.useState<string | null>("09:30");
  const [filters, setFilters] = React.useState(["Status: Open", "Payer: Aetna", "Last 30 days"]);
  const [burst, setBurst] = React.useState(0);
  return (
    <>
      <Section id="charts" title="Charts" lead="Thin marks, quiet grid, one axis. Lines draw in once and bars rise from the baseline; hover any chart for exact values.">
        <Demo id="charts-change-over-time" files={["ui/segmented-control", "ui/chart"]} title="Change over time" note="Five series colours in a fixed order, checked for colour-blind separation in both themes." className="items-start">
          <Charts />
        </Demo>
        <Demo id="charts-magnitude-and-share" files={["ui/card", "ui/chart"]} title="Magnitude and share" bare className="items-stretch">
          <Card className="min-w-72 flex-1">
            <CardHeader>
              <div>
                <CardTitle>Visits by weekday</CardTitle>
                <CardDescription>This week</CardDescription>
              </div>
            </CardHeader>
            <BarChart aria-label="Visits" data={byDay} highlight={3} />
          </Card>
          <Card className="min-w-72 flex-1">
            <CardHeader>
              <div>
                <CardTitle>Payer mix</CardTitle>
                <CardDescription>Claims submitted this month</CardDescription>
              </div>
            </CardHeader>
            <DonutChart aria-label="Claims by payer" data={payers}>
              <p className="text-xl leading-none font-semibold tracking-tight text-data">2,370</p>
              <p className="mt-1 text-caption text-muted-foreground">claims</p>
            </DonutChart>
          </Card>
        </Demo>
        <Demo id="charts-vitals-and-meters" files={["patterns/vital-tile", "ui/card", "ui/meter"]} title="Vitals and meters" bare className="items-stretch">
          <VitalTile className="min-w-56 flex-1" label="Resting heart rate" value="61" unit="bpm" icon={<HeartPulse />} trend={[66, 65, 66, 64, 63, 64, 62, 62, 61]} trendLabel="Down 4 bpm over 30 days" measured="Today" />
          <VitalTile className="min-w-56 flex-1" label="Blood pressure" value="118/76" unit="mmHg" icon={<Activity />} trend={[124, 122, 121, 123, 120, 119, 118]} trendLabel="Steady" measured="12 Nov" />
          <Card className="min-w-56 flex-1 justify-center">
            <Meter label="Sleep" value={6.2} max={8} valueText="6.2 of 8 hours" />
            <Meter label="Medication adherence" value={92} valueText="92%" tone="success" />
          </Card>
        </Demo>
      </Section>

      <Section id="workspace" title="Workspace" lead="The pieces a working dashboard is assembled from: search, schedule, lists, messages and the small things between them.">
        <Demo id="workspace-command-palette" files={["ui/command", "ui/toast"]} title="Command palette" note="Press ⌘K anywhere on this page. Arrow keys move a single gliding highlight.">
          <Palette />
        </Demo>
        <Demo id="workspace-day-schedule" files={["patterns/schedule-day", "ui/toast", "ui/time-picker"]} title="Day schedule" note="Compose columns side by side for a week or a multi-provider view." className="items-start">
          <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1fr)_15rem]">
            <ScheduleDay events={events} startHour={8} endHour={14} now="10:10" onEventClick={(e) => toast.message(e.title, { description: `${e.start} to ${e.end}` })} />
            <div className="flex flex-col gap-3">
              <span className="text-label">Start time</span>
              <TimePicker aria-label="Start time" value={time} onValueChange={setTime} min="07:00" max="18:00" step={15} />
              <p className="text-body-sm text-muted-foreground">The red line marks the current time. Click any visit for details.</p>
            </div>
          </div>
        </Demo>
        <Demo id="workspace-lists" files={["ui/list", "ui/avatar", "ui/badge"]} title="Lists" note="One highlight glides from row to row instead of each row lighting up." className="items-start">
          <List className="w-full max-w-xl">
            <ListItem href="#workspace" leading={<Avatar name="Amara Osei" size="sm" />} title="Amara Osei" description="Lipid panel resulted · LDL above range" trailing={<Badge tone="warning">Review</Badge>} />
            <ListItem href="#workspace" leading={<Avatar name="Daniel Reyes" size="sm" />} title="Daniel Reyes" description="Refill request · Metformin 500 mg" trailing="12 min" />
            <ListItem href="#workspace" leading={<Avatar name="Priya Raman" size="sm" />} title="Priya Raman" description="New message about her annual physical" trailing={<Badge variant="count" tone="info">2</Badge>} />
            <ListItem href="#workspace" leading={<Avatar name="Grace Mbeki" size="sm" />} title="Grace Mbeki" description="Intake forms completed" trailing="1 h" />
          </List>
        </Demo>
        <Demo id="workspace-messages" files={["patterns/chat", "ui/toast"]} title="Messages" note="Secure threads and Pulse share one bubble and one composer. Try sending a reply." className="items-start">
          <Thread />
        </Demo>
        <Demo id="workspace-medications" files={["patterns/medication-card", "ui/button"]} title="Medications" bare className="flex-col items-stretch">
          <MedicationCard name="Atorvastatin" strength="20 mg tablet" directions="Take one tablet by mouth every morning with food." refillsLeft={2} nextRefill="14 Dec" actions={<Button variant="outline" size="sm">Request refill</Button>} />
          <MedicationCard name="Metformin" strength="500 mg tablet" directions="Take one tablet twice a day with meals." refillsLeft={0} status="refill-due" actions={<Button size="sm">Renew</Button>} />
        </Demo>
        <Demo id="workspace-details-and-previews" files={["ui/context-menu", "ui/description-list", "ui/hover-card", "ui/avatar", "ui/badge"]} title="Details and previews" note="Hover the clinician's name. Right-click the card for its menu." className="items-start">
          <ContextMenu>
            <ContextMenuTrigger className="w-full rounded-lg outline-none">
              <DescriptionList columns={3} className="w-full">
                <DescriptionItem label="Ordering clinician">
                  <HoverCard>
                    <HoverCardTrigger href="#workspace" className="rounded-xs text-accent-foreground underline decoration-transparent underline-offset-4 rovr-focus hover:decoration-current">
                      Dr. Ngozi Okafor
                    </HoverCardTrigger>
                    <HoverCardContent className="flex gap-3">
                      <Avatar name="Ngozi Okafor" />
                      <div className="flex flex-col gap-0.5">
                        <p className="text-title-sm">Dr. Ngozi Okafor</p>
                        <p className="text-body-sm text-muted-foreground">Internal medicine · Mission St Clinic</p>
                        <p className="mt-1 text-body-sm">Next opening Thursday 10:30</p>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </DescriptionItem>
                <DescriptionItem label="Collected">12 Nov 2026, 08:14</DescriptionItem>
                <DescriptionItem label="Specimen">Serum, fasting</DescriptionItem>
                <DescriptionItem label="Lab">Quest Diagnostics</DescriptionItem>
                <DescriptionItem label="Order">
                  <span className="font-mono text-[0.875rem]">LB-2041-7731</span>
                </DescriptionItem>
                <DescriptionItem label="Status">
                  <Badge tone="success">Final</Badge>
                </DescriptionItem>
              </DescriptionList>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuItem>
                <FileText /> Open report
              </ContextMenuItem>
              <ContextMenuItem>
                <Users /> Share with care team
              </ContextMenuItem>
              <ContextMenuItem>
                <MessageSquare /> Message patient
              </ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </Demo>
        <Demo id="workspace-filters-and-banners" files={["ui/chip", "ui/button", "ui/banner"]} title="Filters and banners" className="flex-col items-stretch gap-4">
          <ChipGroup
            items={filters.map((f) => {
              const [label, value] = f.includes(": ") ? f.split(": ") : [undefined, f];
              return {
                key: f,
                node: (
                  <Chip label={label} onRemove={() => setFilters((list) => list.filter((x) => x !== f))}>
                    {value}
                  </Chip>
                ),
              };
            })}
            trailing={
              filters.length < 3 ? (
                <Button variant="link" size="sm" onClick={() => setFilters(["Status: Open", "Payer: Aetna", "Last 30 days"])}>
                  Reset filters
                </Button>
              ) : undefined
            }
          />
          <Banner tone="warning" className="rounded-lg" action={<Button variant="link" size="sm">See schedule</Button>}>
            Lab ordering will be unavailable Saturday 02:00 to 04:00 PT for maintenance.
          </Banner>
        </Demo>
        <Demo id="workspace-completion" files={["ui/success-burst", "ui/button"]} title="Completion" note="For the end of a flow that took effort: a booking, an intake, a payment. Not for routine saves.">
          <SuccessBurst key={burst} size={56} />
          <div className="flex flex-col gap-2">
            <p className="text-title-md">Appointment booked</p>
            <p className="text-body-sm text-muted-foreground">Thursday 3 December, 10:30 with Dr. Okafor</p>
            <Button variant="secondary" size="sm" className="w-fit" onClick={() => setBurst((b) => b + 1)}>
              Play again
            </Button>
          </div>
        </Demo>
      </Section>
    </>
  );
}
