import * as React from "react";
import {
  Bell,
  CalendarDays,
  FileText,
  FlaskConical,
  LayoutDashboard,
  MessageSquare,
  Pill,
  Search,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";
import { ConfirmDialog } from "@/components/ui/alert-dialog";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, type DateRange } from "@/components/ui/calendar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Combobox, MultiCombobox, type ComboboxItem } from "@/components/ui/combobox";
import { CopyButton } from "@/components/ui/copy-button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { DatePicker, DateRangePicker } from "@/components/ui/date-picker";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, FieldLabel } from "@/components/ui/field";
import { FileUpload, type UploadItem } from "@/components/ui/file-upload";
import { SearchInput } from "@/components/ui/input";
import { Kbd } from "@/components/ui/kbd";
import { NumberField } from "@/components/ui/number-field";
import { OtpInput } from "@/components/ui/otp-input";
import { TagInput } from "@/components/ui/tag-input";
import { Timeline, TimelineItem } from "@/components/ui/timeline";
import { toast } from "@/components/ui/toast";
import { Toggle, ToggleGroup } from "@/components/ui/toggle-group";
import { AppShell, Sidebar, SidebarItem, SidebarSection } from "@/components/patterns/app-shell";
import { PageHeader } from "@/components/patterns/page-header";
import { PatientHeader } from "@/components/patterns/patient-header";
import { StatCard } from "@/components/patterns/stat-card";
import { TimeSlots } from "@/components/patterns/time-slots";
import { Dashboard } from "./dashboard";
import { Demo, Section } from "./kit";

const clinicians: ComboboxItem[] = [
  { value: "okafor", label: "Dr. Ngozi Okafor", description: "Internal medicine" },
  { value: "whitfield", label: "Dr. Sam Whitfield", description: "Cardiology" },
  { value: "haddad", label: "Dr. Leila Haddad", description: "Endocrinology" },
  { value: "brandt", label: "Dr. Marcus Brandt", description: "Family medicine" },
  { value: "iyer", label: "Dr. Kavya Iyer", description: "Dermatology" },
  { value: "sato", label: "Dr. Hiro Sato", description: "Orthopaedics" },
  { value: "moreau", label: "Elise Moreau, NP", description: "Primary care" },
];

const panels: ComboboxItem[] = [
  { value: "cmp", label: "Comprehensive metabolic panel" },
  { value: "lipid", label: "Lipid panel" },
  { value: "cbc", label: "Complete blood count" },
  { value: "a1c", label: "HbA1c" },
  { value: "tsh", label: "TSH" },
  { value: "vitd", label: "Vitamin D, 25-hydroxy" },
  { value: "ferritin", label: "Ferritin" },
];

const slots = ["8:30 AM", "9:00 AM", "9:30 AM", "10:30 AM", "11:00 AM", "1:15 PM", "2:00 PM", "3:30 PM"].map((label, i) => ({
  value: label,
  label,
  available: i !== 1 && i !== 5,
}));

function Booking() {
  const today = React.useMemo(() => new Date(), []);
  // Sundays are closed in this demo, so start on the next open day.
  const firstOpen = React.useMemo(() => new Date(today.getFullYear(), today.getMonth(), today.getDate() + (today.getDay() === 0 ? 1 : 0)), [today]);
  const [date, setDate] = React.useState<Date | null>(firstOpen);
  const [slot, setSlot] = React.useState<string | null>("9:30 AM");
  return (
    <div className="flex w-full flex-wrap gap-x-10 gap-y-6">
      <Calendar value={date} onValueChange={setDate} min={today} isDisabled={(d) => d.getDay() === 0} />
      <div className="flex min-w-60 flex-1 flex-col gap-3">
        <p className="text-title-sm">{date ? new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(date) : "Choose a day"}</p>
        <TimeSlots aria-label="Available times" slots={slots} value={slot} onValueChange={setSlot} />
        <p className="text-body-sm text-muted-foreground">Times are shown in Pacific Time. Sundays are closed.</p>
      </div>
    </div>
  );
}

function PickerFields() {
  const [who, setWho] = React.useState<ComboboxItem | null>(clinicians[0]);
  const [tests, setTests] = React.useState<ComboboxItem[]>([panels[1], panels[3]]);
  const [dob, setDob] = React.useState<Date | null>(new Date(1988, 3, 14));
  const [range, setRange] = React.useState<DateRange>({ from: new Date(2026, 10, 2), to: new Date(2026, 10, 22) });
  return (
    <div className="grid w-full gap-5 sm:grid-cols-2">
      <Field>
        <FieldLabel>Clinician</FieldLabel>
        <Combobox aria-label="Clinician" items={clinicians} value={who} onValueChange={setWho} placeholder="Search by name or specialty" />
      </Field>
      <Field>
        <FieldLabel>Tests to order</FieldLabel>
        <MultiCombobox aria-label="Tests to order" items={panels} value={tests} onValueChange={setTests} placeholder="Search lab tests" />
      </Field>
      <Field>
        <FieldLabel>Date of birth</FieldLabel>
        <DatePicker aria-label="Date of birth" value={dob} onValueChange={setDob} max={new Date()} />
      </Field>
      <Field>
        <FieldLabel>Reporting period</FieldLabel>
        <DateRangePicker aria-label="Reporting period" value={range} onValueChange={setRange} />
      </Field>
    </div>
  );
}

function SmallInputs() {
  const [allergies, setAllergies] = React.useState(["Penicillin", "Latex"]);
  const [days, setDays] = React.useState<string[]>(["mon", "wed", "fri"]);
  return (
    <div className="grid w-full gap-x-10 gap-y-7 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <span className="text-label">Allergies</span>
        <TagInput aria-label="Allergies" value={allergies} onValueChange={setAllergies} placeholder="Type an allergy and press Enter" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-label">Clinic days</span>
        <ToggleGroup multiple value={days} onValueChange={setDays} aria-label="Clinic days">
          {[
            ["mon", "Mon"],
            ["tue", "Tue"],
            ["wed", "Wed"],
            ["thu", "Thu"],
            ["fri", "Fri"],
          ].map(([v, l]) => (
            <Toggle key={v} value={v}>
              {l}
            </Toggle>
          ))}
        </ToggleGroup>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-label">Refills</span>
        <NumberField defaultValue={3} min={0} max={12} aria-label="Refills" />
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-label">Verification code</span>
        <OtpInput defaultValue="418" aria-label="Verification code" />
      </div>
    </div>
  );
}

interface Claim {
  id: string;
  patient: string;
  payer: string;
  service: string;
  billed: number;
  status: "Paid" | "Submitted" | "Denied" | "In review";
}
const claims: Claim[] = [
  { id: "CL-48213", patient: "Amara Osei", payer: "Aetna", service: "2026-11-12", billed: 240, status: "Paid" },
  { id: "CL-48219", patient: "Daniel Reyes", payer: "Blue Shield", service: "2026-11-13", billed: 185.5, status: "Submitted" },
  { id: "CL-48224", patient: "Priya Raman", payer: "Cigna", service: "2026-11-13", billed: 420, status: "Denied" },
  { id: "CL-48230", patient: "Tomás Lindqvist", payer: "UnitedHealthcare", service: "2026-11-14", billed: 96, status: "In review" },
  { id: "CL-48236", patient: "Grace Mbeki", payer: "Aetna", service: "2026-11-17", billed: 310.25, status: "Paid" },
  { id: "CL-48241", patient: "Noah Feldman", payer: "Medicare", service: "2026-11-18", billed: 154, status: "Submitted" },
  { id: "CL-48247", patient: "Sofia Marchetti", payer: "Cigna", service: "2026-11-19", billed: 275, status: "Paid" },
  { id: "CL-48252", patient: "Jun Watanabe", payer: "Blue Shield", service: "2026-11-20", billed: 88.75, status: "In review" },
];
const claimTone = { Paid: "success", Submitted: "info", Denied: "danger", "In review": "warning" } as const;
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

const claimColumns: DataTableColumn<Claim>[] = [
  { id: "id", header: "Claim", cell: (r) => <span className="font-mono text-[0.8125rem]">{r.id}</span>, sortValue: (r) => r.id, hideable: false },
  { id: "patient", header: "Patient", cell: (r) => <span className="font-medium">{r.patient}</span>, sortValue: (r) => r.patient },
  { id: "payer", header: "Payer", cell: (r) => r.payer, sortValue: (r) => r.payer },
  { id: "service", header: "Service date", cell: (r) => shortDate.format(new Date(`${r.service}T12:00:00`)), sortValue: (r) => r.service, className: "text-data" },
  { id: "billed", header: "Billed", cell: (r) => money.format(r.billed), sortValue: (r) => r.billed, numeric: true },
  {
    id: "status",
    header: "Status",
    cell: (r) => (
      <Badge tone={claimTone[r.status]} variant="status">
        {r.status}
      </Badge>
    ),
    sortValue: (r) => r.status,
  },
];

const statuses = ["Paid", "Submitted", "In review", "Denied"] as const;

function ClaimsTable() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string[]>([]);
  const rows = claims.filter((c) => `${c.patient} ${c.id} ${c.payer}`.toLowerCase().includes(query.toLowerCase()) && (status.length === 0 || status.includes(c.status)));
  const clear = () => {
    setQuery("");
    setStatus([]);
  };
  return (
    <DataTable
      caption="Claims"
      columns={claimColumns}
      rows={rows}
      rowId={(r) => r.id}
      pageSize={5}
      onSelectionChange={() => {}}
      toolbar={
        <>
          <SearchInput size="sm" aria-label="Filter claims" placeholder="Patient, claim or payer" value={query} onValueChange={setQuery} className="max-w-64" />
          <ToggleGroup multiple value={status} onValueChange={setStatus} aria-label="Status">
            {statuses.map((s) => (
              <Toggle key={s} value={s} className="h-control-sm">
                {s}
              </Toggle>
            ))}
          </ToggleGroup>
        </>
      }
      empty={
        <EmptyState
          icon={<Search />}
          title="No claims match"
          description="Nothing fits this search and status. Loosen one of them to see more."
          action={
            <Button size="sm" variant="outline" onClick={clear}>
              Clear filters
            </Button>
          }
        />
      }
    />
  );
}

function Uploads() {
  const [items, setItems] = React.useState<UploadItem[]>([
    { id: "1", name: "insurance-card-front.jpg", size: 1_840_000 },
    { id: "2", name: "referral-letter.pdf", size: 412_000, progress: 62 },
    { id: "3", name: "mri-report.dcm", size: 48_200_000, error: "This file type is not supported. Upload a PDF, JPG or PNG." },
  ]);
  return (
    <FileUpload
      hint="PDF, JPG or PNG, up to 10 MB each"
      accept=".pdf,.jpg,.jpeg,.png"
      items={items}
      onRemove={(id) => setItems((list) => list.filter((i) => i.id !== id))}
      onFiles={(files) => setItems((list) => [...list, ...files.map((f, i) => ({ id: `${Date.now()}-${i}`, name: f.name, size: f.size }))])}
    />
  );
}

function ShellDemo() {
  return (
    <div data-density="compact" className="h-[34rem] w-full overflow-hidden rounded-xl border border-border max-md:h-auto">
      <AppShell
        className="h-full"
        sidebar={
          <Sidebar
            className="h-[34rem]"
            header={<span className="text-lg leading-none font-bold tracking-[-0.035em]">RoVR</span>}
            footer={
              <div className="flex items-center gap-2.5 overflow-hidden rounded-md p-1.5">
                <Avatar name="Ngozi Okafor" size="sm" />
                <div className="min-w-0 transition-opacity duration-(--dur-base) group-data-[collapsed]/shell:opacity-0">
                  <p className="truncate text-body-sm font-medium">Dr. Ngozi Okafor</p>
                  <p className="truncate text-caption text-muted-foreground">Mission St Clinic</p>
                </div>
              </div>
            }
          >
            <SidebarItem icon={<LayoutDashboard />} label="Mission control" active href="#shell" />
            <SidebarItem icon={<CalendarDays />} label="Schedule" badge="14" href="#shell" />
            <SidebarItem icon={<Users />} label="Patients" href="#shell" />
            <SidebarItem icon={<MessageSquare />} label="Messages" badge="3" href="#shell" />
            <SidebarSection label="Clinical">
              <SidebarItem icon={<FlaskConical />} label="Labs and imaging" href="#shell" />
              <SidebarItem icon={<Pill />} label="Prescriptions" href="#shell" />
              <SidebarItem icon={<FileText />} label="Documents" href="#shell" />
            </SidebarSection>
            <SidebarSection label="Workspace">
              <SidebarItem icon={<Settings />} label="Settings" href="#shell" />
            </SidebarSection>
          </Sidebar>
        }
      >
        <div className="flex h-full flex-col gap-5 overflow-y-auto p-6">
          <PageHeader
            title="Mission control"
            description="Monday 23 November. 14 visits scheduled, 2 patients waiting."
            actions={
              <>
                <Button variant="ghost" size="icon-md" aria-label="Notifications">
                  <Bell />
                </Button>
                <Button>
                  <Stethoscope /> Start next visit
                </Button>
              </>
            }
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <StatCard label="Visits today" value="14" caption="6 completed" />
            <StatCard label="Waiting now" value="2" caption="Longest 9 min" />
            <StatCard label="Unsigned notes" value="5" delta="+2" trend="negative" caption="since Friday" />
          </div>
        </div>
      </AppShell>
    </div>
  );
}

export function More() {
  const [confirm, setConfirm] = React.useState(false);
  return (
    <>
      <Section id="pickers" title="Pickers" lead="Searchable dropdowns, dates and the small specialised inputs the two apps rebuild most often.">
        <Demo id="pickers-search-and-dates" files={["ui/combobox", "ui/calendar", "ui/field", "ui/date-picker"]} title="Search and dates" note="Type to filter. Arrow keys and Enter work everywhere; the calendar also takes PageUp and PageDown." className="items-start">
          <PickerFields />
        </Demo>
        <Demo id="pickers-booking" files={["ui/calendar", "patterns/time-slots"]} title="Booking" note="Calendar and time slots together, as in the appointment flow. Months slide in the direction you move." className="items-start">
          <Booking />
        </Demo>
        <Demo id="pickers-small-inputs" files={["ui/tag-input", "ui/toggle-group", "ui/number-field", "ui/otp-input"]} title="Small inputs" note="Tag entry, toggles, a stepper and one-time codes." className="items-start">
          <SmallInputs />
        </Demo>
      </Section>

      <Section id="tables" title="Tables and files" lead="The data table sorts, hides columns, selects rows and paginates. It replaces the 78 hand-written tables in the provider app.">
        <Demo id="tables-data-table" files={["ui/data-table", "ui/input", "ui/toggle-group", "ui/empty-state", "ui/button"]} title="Data table" note="Type in the search or toggle a status. The table resizes in one smooth move, rows that stay do not move or flicker, and new rows fade in. Search for something that is not there to see the empty state." className="items-start">
          <div data-density="compact" className="w-full">
            <ClaimsTable />
          </div>
        </Demo>
        <Demo id="tables-patient-header" files={["patterns/patient-header", "ui/badge", "ui/button"]} title="Patient header" note="Identity and safety flags stay at the top of every chart view." bare>
          <PatientHeader
            className="w-full"
            name="Amara Osei"
            mrn="20418"
            facts={[
              { label: "Born", value: "14 Apr 1988 (38)" },
              { label: "Sex", value: "Female" },
              { label: "Plan", value: "Aetna PPO" },
              { label: "Primary", value: "Dr. Okafor" },
            ]}
            alerts={
              <>
                <Badge tone="danger">
                  Penicillin allergy
                </Badge>
                <Badge tone="warning">
                  Fall risk
                </Badge>
              </>
            }
            actions={<Button variant="outline">Open chart</Button>}
          />
        </Demo>
        <Demo id="tables-file-upload" files={["ui/file-upload"]} title="File upload" note="Works by click, keyboard and drag. Errors say what to upload instead." className="items-start">
          <Uploads />
        </Demo>
        <Demo id="tables-timeline" files={["ui/timeline"]} title="Timeline" note="Encounter history and activity logs." className="items-start">
          <Timeline className="w-full max-w-xl">
            <TimelineItem time="Today, 10:42" title="Lipid panel resulted" icon={<FlaskConical />} emphasis>
              LDL 131 mg/dL, above the reference range. Flagged for review.
            </TimelineItem>
            <TimelineItem time="12 Nov" title="Follow-up visit with Dr. Okafor">
              Atorvastatin increased from 10 mg to 20 mg daily.
            </TimelineItem>
            <TimelineItem time="28 Oct" title="Prescription refilled" icon={<Pill />}>
              Atorvastatin 10 mg, 30 tablets.
            </TimelineItem>
          </Timeline>
        </Demo>
        <Demo id="tables-confirm-collapse-copy" files={["ui/button", "ui/alert-dialog", "ui/toast", "ui/copy-button", "ui/kbd", "ui/collapsible"]} title="Confirm, collapse, copy" className="items-center gap-x-8 gap-y-5">
          <Button variant="outline" onClick={() => setConfirm(true)}>
            Delete note
          </Button>
          <ConfirmDialog
            open={confirm}
            onOpenChange={setConfirm}
            title="Delete this note?"
            description="The note from 12 November will be removed from the chart. This cannot be undone."
            confirmLabel="Delete note"
            cancelLabel="Keep note"
            onConfirm={() => {
              toast.message("Note deleted");
            }}
          />
          <span className="flex items-center gap-1 text-body">
            Member ID <span className="font-mono">RVR-2041-88317</span>
            <CopyButton value="RVR-2041-88317" label="Copy member ID" />
          </span>
          <span className="flex items-center gap-1.5 text-body-sm text-muted-foreground">
            Search <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </span>
          <Collapsible className="w-full">
            <CollapsibleTrigger>Show billing codes</CollapsibleTrigger>
            <CollapsibleContent className="text-body-sm text-muted-foreground">
              <span className="font-mono text-foreground">99214</span> Office visit, established patient, moderate complexity.{" "}
              <span className="font-mono text-foreground">E78.5</span> Hyperlipidaemia, unspecified.
            </CollapsibleContent>
          </Collapsible>
        </Demo>
      </Section>

      <Dashboard />

      <Section id="shell" title="App shell" lead="One frame for both apps: a collapsible sidebar, a page header and the content area. Shown here at compact density, as the provider app uses it.">
        <ShellDemo />
        <p className="text-body-sm text-muted-foreground md:hidden">The sidebar is hidden at phone width; apps show navigation in a Sheet there.</p>
      </Section>
    </>
  );
}
