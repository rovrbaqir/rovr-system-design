import * as React from "react";
import {
  ArrowRight,
  CalendarDays,
  CalendarPlus,
  Copy,
  Download,
  Ellipsis,
  FlaskConical,
  Mail,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/ui/callout";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input, Textarea } from "@/components/ui/input";
import { Menu, MenuCheckboxItem, MenuContent, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import { NumberTicker } from "@/components/ui/motion";
import { Pagination } from "@/components/ui/pagination";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { Progress, ProgressRing } from "@/components/ui/progress";
import { Radio, RadioGroup } from "@/components/ui/radio-group";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { Stepper } from "@/components/ui/stepper";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/toast";
import { Tooltip } from "@/components/ui/tooltip";
import { AppointmentCard } from "@/components/patterns/appointment-card";
import { LabTile } from "@/components/patterns/lab-tile";
import { StatCard } from "@/components/patterns/stat-card";
import { Demo, Section } from "./kit";
import { More } from "./more";

function LoadingButton() {
  const [loading, setLoading] = React.useState(false);
  return (
    <Button
      loading={loading}
      onClick={() => {
        setLoading(true);
        setTimeout(() => {
          setLoading(false);
          toast.success("Appointment booked", { description: "Thursday 3 December, 10:30 with Dr. Okafor" });
        }, 1400);
      }}
    >
      Book appointment
    </Button>
  );
}

const visitTypes = [
  { value: "annual", label: "Annual physical" },
  { value: "follow-up", label: "Follow-up" },
  { value: "labs", label: "Lab review" },
  { value: "urgent", label: "Same-day sick visit" },
  { value: "mental", label: "Behavioural health" },
];

function FormDemo() {
  const [email, setEmail] = React.useState("amara.osei@");
  const invalid = email.length > 0 && !/^\S+@\S+\.\S+$/.test(email);
  return (
    <div className="grid w-full gap-5 sm:grid-cols-2">
      <Field>
        <FieldLabel>Full name</FieldLabel>
        <Input defaultValue="Amara Osei" autoComplete="off" />
      </Field>
      <Field invalid={invalid}>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={invalid} leading={<Mail />} />
        {invalid ? (
          <p className="text-body-sm text-destructive-fg">Enter a full address, such as name@example.com.</p>
        ) : (
          <FieldDescription>We send visit summaries here.</FieldDescription>
        )}
      </Field>
      <Field>
        <FieldLabel>Visit type</FieldLabel>
        <Select defaultValue="follow-up" items={visitTypes}>
          <SelectTrigger placeholder="Choose a visit type" />
          <SelectContent>
            {visitTypes.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <Field>
        <FieldLabel>Weight</FieldLabel>
        <Input inputMode="decimal" defaultValue="68.4" trailing="kg" className="text-data" />
      </Field>
      <Field className="sm:col-span-2">
        <FieldLabel optional>Anything your clinician should know</FieldLabel>
        <Textarea placeholder="Symptoms, questions, changes since your last visit" rows={3} />
      </Field>
      <Field disabled className="sm:col-span-2">
        <FieldLabel>Member ID</FieldLabel>
        <Input disabled defaultValue="RVR-2041-88317" className="text-data" />
        <FieldDescription>Set by your plan. Contact support to change it.</FieldDescription>
      </Field>
    </div>
  );
}

function SelectionDemo() {
  const [range, setRange] = React.useState<"day" | "week" | "month">("week");
  const [pain, setPain] = React.useState(3);
  return (
    <div className="grid w-full gap-x-12 gap-y-8 sm:grid-cols-2">
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 text-body">
          <Checkbox defaultChecked /> Send me appointment reminders
        </label>
        <label className="flex items-center gap-3 text-body">
          <Checkbox /> Share results with my care team
        </label>
        <label className="flex items-center gap-3 text-body text-muted-foreground">
          <Checkbox disabled /> Paper statements (unavailable)
        </label>
      </div>
      <RadioGroup defaultValue="video" aria-label="Visit format">
        <label className="flex items-center gap-3 text-body">
          <Radio value="video" /> Video visit
        </label>
        <label className="flex items-center gap-3 text-body">
          <Radio value="clinic" /> In clinic
        </label>
        <label className="flex items-center gap-3 text-body">
          <Radio value="phone" /> Phone call
        </label>
      </RadioGroup>
      <div className="flex flex-col gap-4">
        <label className="flex items-center justify-between gap-4 text-body">
          Text message alerts <Switch defaultChecked />
        </label>
        <label className="flex items-center justify-between gap-4 text-body">
          Connect wearable data <Switch />
        </label>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-body">
          <span>Pain level today</span>
          <span className="font-medium text-data">{pain} / 10</span>
        </div>
        <Slider value={pain} onValueChange={(v) => setPain(v as number)} min={0} max={10} aria-label="Pain level" />
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <span className="text-label">Schedule view</span>
        <SegmentedControl
          aria-label="Schedule view"
          value={range}
          onValueChange={setRange}
          options={[
            { value: "day", label: "Day" },
            { value: "week", label: "Week" },
            { value: "month", label: "Month" },
          ]}
        />
      </div>
    </div>
  );
}

const patients = [
  { name: "Amara Osei", mrn: "20418", visit: "Follow-up", time: "09:00", status: ["success", "Checked in"] },
  { name: "Daniel Reyes", mrn: "19307", visit: "Lab review", time: "09:30", status: ["info", "In progress"] },
  { name: "Priya Raman", mrn: "22190", visit: "Annual physical", time: "10:15", status: ["neutral", "Scheduled"] },
  { name: "Tomás Lindqvist", mrn: "18842", visit: "Same-day sick visit", time: "11:00", status: ["warning", "Running late"] },
] as const;

export function Components() {
  const [page, setPage] = React.useState(3);
  const [step, setStep] = React.useState(1);
  const [progress, setProgress] = React.useState(64);
  return (
    <>
      <Section id="actions" title="Buttons" lead="One Button, six variants, three sizes. It replaces the six or seven button components in each app today.">
        <Demo id="actions-variants" files={["ui/button"]} title="Variants" note="One primary action per view. Move across the primary: its light follows the pointer. Press any of them: they sink and spring back.">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Cancel visit</Button>
          <Button variant="destructive-solid">Delete</Button>
          <Button variant="link">View details</Button>
        </Demo>
        <Demo id="actions-sizes-and-icons" files={["ui/button", "ui/tooltip"]} title="Sizes and icons" note="Icon-only buttons need an aria-label and get a tooltip.">
          <Button size="sm">Small</Button>
          <Button>Medium</Button>
          <Button size="lg">
            Continue <ArrowRight />
          </Button>
          <Button variant="secondary">
            <CalendarPlus /> New appointment
          </Button>
          <Tooltip content="Download summary">
            <Button variant="outline" size="icon-md" aria-label="Download summary">
              <Download />
            </Button>
          </Tooltip>
          <Tooltip content="Add note">
            <Button variant="secondary" size="icon-md" aria-label="Add note">
              <Plus />
            </Button>
          </Tooltip>
        </Demo>
        <Demo id="actions-states" files={["ui/button", "ui/toast"]} title="States" note="Loading keeps the button's width and swaps the label for a spinner.">
          <LoadingButton />
          <Button disabled>Disabled</Button>
          <Button variant="outline" disabled>
            Disabled
          </Button>
        </Demo>
      </Section>

      <Section id="forms" title="Forms" lead="Labels sit above fields, help text below, and errors say what to fix. Focus eases in a ring in the brand blue.">
        <Demo id="forms-fields" files={["ui/field", "ui/input", "ui/select"]} title="Fields" note="Input, Select and Textarea share one chrome, so a form reads as one object." className="items-start">
          <FormDemo />
        </Demo>
        <Demo id="forms-selection" files={["ui/checkbox", "ui/radio-group", "ui/switch", "ui/slider", "ui/segmented-control"]} title="Selection" note="The check draws itself, the radio dot springs in, and the switch thumb stretches while pressed." className="items-start">
          <SelectionDemo />
        </Demo>
      </Section>

      <Section id="navigation" title="Navigation" lead="A single indicator slides between tabs and steps, so the eye follows the change instead of hunting for it.">
        <Demo id="navigation-tabs" files={["ui/tabs"]} title="Tabs" className="items-start">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="labs">Labs</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="text-body text-muted-foreground">
              Last visit 12 November. Next follow-up due in 3 weeks.
            </TabsContent>
            <TabsContent value="labs" className="text-body text-muted-foreground">
              14 results from the last 12 months. 2 outside the reference range.
            </TabsContent>
            <TabsContent value="medications" className="text-body text-muted-foreground">
              3 active prescriptions. 1 refill due this week.
            </TabsContent>
            <TabsContent value="documents" className="text-body text-muted-foreground">
              After-visit summaries, referrals and uploaded records.
            </TabsContent>
          </Tabs>
        </Demo>
        <Demo id="navigation-boxed-tabs" files={["ui/tabs"]} title="Boxed tabs" note="The stage tabs from rovrstack.ai: equal cells, hairline grid, a blue line that slides along the top." className="items-start">
          <Tabs defaultValue="intake" className="w-full">
            <TabsList variant="boxed">
              <TabsTrigger value="intake">Intake</TabsTrigger>
              <TabsTrigger value="visit">Visit</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>
            <TabsContent value="intake" className="text-body text-muted-foreground">
              Forms and consent collected before the visit.
            </TabsContent>
            <TabsContent value="visit" className="text-body text-muted-foreground">
              Notes, vitals and the assessment recorded during the visit.
            </TabsContent>
            <TabsContent value="orders" className="text-body text-muted-foreground">
              Labs, imaging and prescriptions ordered from this encounter.
            </TabsContent>
            <TabsContent value="billing" className="text-body text-muted-foreground">
              Codes, claim status and patient responsibility.
            </TabsContent>
          </Tabs>
        </Demo>
        <Demo id="navigation-segmented-tabs" files={["ui/tabs"]} title="Segmented tabs" note="For switching views inside a card or toolbar.">
          <Tabs defaultValue="upcoming">
            <TabsList variant="segmented">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>
        </Demo>
        <Demo id="navigation-stepper" files={["ui/stepper", "ui/button"]} title="Stepper" className="flex-col items-start gap-6">
          <Stepper
            current={step}
            steps={[
              { label: "Reason for visit" },
              { label: "Choose a time" },
              { label: "Insurance" },
              { label: "Confirm" },
            ]}
          />
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            <Button size="sm" disabled={step === 4} onClick={() => setStep((s) => s + 1)}>
              Continue
            </Button>
          </div>
        </Demo>
        <Demo id="navigation-breadcrumbs-and-pagination" files={["ui/breadcrumbs", "ui/pagination"]} title="Breadcrumbs and pagination" className="flex-col items-start gap-5">
          <Breadcrumbs items={[{ label: "Patients", href: "#navigation" }, { label: "Amara Osei", href: "#navigation" }, { label: "Lab results" }]} />
          <Pagination page={page} pageCount={12} onPageChange={setPage} />
        </Demo>
      </Section>

      <Section id="overlays" title="Overlays" lead="Menus and popovers are frosted glass that opens from its trigger. Dialogs appear in place and sheets slide in as one solid panel. None of them bounce.">
        <Demo id="overlays-dialog-and-sheet" files={["ui/dialog", "ui/button", "ui/toast", "ui/sheet", "ui/avatar", "ui/callout"]} title="Dialog and sheet" note="Use a dialog only when the task needs protected focus. A sheet keeps the page in view.">
          <Dialog>
            <DialogTrigger render={<Button variant="outline">Cancel appointment</Button>} />
            <DialogContent size="sm">
              <DialogHeader>
                <DialogTitle>Cancel this appointment?</DialogTitle>
                <DialogDescription>
                  Your follow-up with Dr. Okafor on Thursday 3 December at 10:30 will be released. You can book a new time whenever you like.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="secondary">Keep appointment</Button>} />
                <DialogClose
                  render={
                    <Button variant="destructive-solid" onClick={() => toast.message("Appointment cancelled", { action: { label: "Undo", onClick: () => toast.success("Appointment restored") } })}>
                      Cancel appointment
                    </Button>
                  }
                />
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Sheet>
            <SheetTrigger render={<Button variant="outline">Open visit details</Button>} />
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Follow-up visit</SheetTitle>
                <SheetDescription>Thursday 3 December, 10:30 to 11:00</SheetDescription>
              </SheetHeader>
              <div className="flex items-center gap-3">
                <Avatar name="Ngozi Okafor" />
                <div>
                  <p className="text-title-sm">Dr. Ngozi Okafor</p>
                  <p className="text-body-sm text-muted-foreground">Internal medicine</p>
                </div>
              </div>
              <Callout tone="info" title="Join from this page">
                The video room opens 10 minutes before your visit.
              </Callout>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-body">
                <dt className="text-muted-foreground">Format</dt>
                <dd>Video visit</dd>
                <dt className="text-muted-foreground">Reason</dt>
                <dd>Review of lipid panel</dd>
                <dt className="text-muted-foreground">Copay</dt>
                <dd className="text-data">$25.00</dd>
              </dl>
              <SheetFooter>
                <SheetClose render={<Button variant="secondary">Close</Button>} />
                <Button>Reschedule</Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </Demo>
        <Demo id="overlays-menu-popover-tooltip" files={["ui/menu", "ui/button", "ui/popover", "ui/tooltip"]} title="Menu, popover, tooltip">
          <Menu>
            <MenuTrigger
              render={
                <Button variant="outline">
                  Actions <Ellipsis />
                </Button>
              }
            />
            <MenuContent>
              <MenuLabel>Result</MenuLabel>
              <MenuItem shortcut="E">
                <Pencil /> Add a note
              </MenuItem>
              <MenuItem shortcut="⌘C">
                <Copy /> Copy link
              </MenuItem>
              <MenuItem>
                <Download /> Download PDF
              </MenuItem>
              <MenuSeparator />
              <MenuCheckboxItem defaultChecked>Show reference range</MenuCheckboxItem>
              <MenuSeparator />
              <MenuItem destructive>
                <Trash2 /> Remove from chart
              </MenuItem>
            </MenuContent>
          </Menu>
          <Popover>
            <PopoverTrigger render={<Button variant="outline">What is HbA1c?</Button>} />
            <PopoverContent align="start" className="flex flex-col gap-1.5">
              <PopoverTitle>HbA1c</PopoverTitle>
              <PopoverDescription>
                Your average blood sugar over roughly three months. Below 5.7% is the usual reference range for adults without diabetes.
              </PopoverDescription>
            </PopoverContent>
          </Popover>
          <Tooltip content="Synced from Apple Health 4 minutes ago">
            <Button variant="ghost">Hover for a tooltip</Button>
          </Tooltip>
        </Demo>
        <Demo id="overlays-toasts" files={["ui/button", "ui/toast"]} title="Toasts" note="They stack upward and can be swiped away. Use them to confirm, not to report errors someone must fix.">
          <Button variant="secondary" onClick={() => toast.success("Refill requested", { description: "Atorvastatin 20 mg. Ready for pickup tomorrow." })}>
            Success
          </Button>
          <Button variant="secondary" onClick={() => toast.warning("Insurance card expires soon", { description: "Upload the new card before 31 December." })}>
            Warning
          </Button>
          <Button variant="secondary" onClick={() => toast.error("Could not send message", { description: "Check your connection and try again.", action: { label: "Retry", onClick: () => toast.success("Message sent") } })}>
            Error with action
          </Button>
        </Demo>
      </Section>

      <Section id="feedback" title="Status and feedback" lead="Five tones in three forms replace the two dozen one-off status badges in the apps today. Colour is always paired with words.">
        <Demo id="feedback-tags" files={["ui/badge"]} title="Tags" note="Small squared tags tinted with their tone, the way the mobile app tints status surfaces.">
          <Badge>Scheduled</Badge>
          <Badge tone="success">Confirmed</Badge>
          <Badge tone="info">In review</Badge>
          <Badge tone="warning">Awaiting results</Badge>
          <Badge tone="danger">Overdue</Badge>
        </Demo>
        <Demo id="feedback-status-and-counts" files={["ui/badge"]} title="Status and counts" note="In tables, a dot and plain text. Counts are solid.">
          <Badge variant="status" tone="success">
            Checked in
          </Badge>
          <Badge variant="status" tone="info" live>
            In call
          </Badge>
          <Badge variant="status" tone="warning">
            Running late
          </Badge>
          <Badge variant="status" tone="danger">
            No-show
          </Badge>
          <Badge variant="count" tone="info">
            3
          </Badge>
          <Badge variant="count" tone="danger">
            12
          </Badge>
        </Demo>
        <Demo id="feedback-callouts" files={["ui/callout", "ui/button"]} title="Callouts" bare className="flex-col items-stretch">
          <Callout tone="warning" title="Fasting required before this test" action={<Button size="sm" variant="outline">Add reminder</Button>}>
            Do not eat or drink anything except water for 10 hours before your lipid panel.
          </Callout>
          <Callout tone="success" title="Insurance verified">
            Your plan covers this visit. Estimated copay is $25.
          </Callout>
          <Callout tone="danger" title="Could not verify insurance" action={<Button size="sm" variant="outline">Update card</Button>}>
            The member ID on file was not recognised. Check it against your card.
          </Callout>
        </Demo>
        <Demo id="feedback-progress" files={["ui/progress", "ui/spinner", "ui/button"]} title="Progress" className="flex-col items-stretch gap-5">
          <div className="flex items-center gap-4">
            <Progress value={progress} aria-label="Intake form progress" />
            <span className="w-10 text-right text-body-sm font-medium text-data">{progress}%</span>
          </div>
          <Progress value={null} size="sm" aria-label="Uploading" />
          <div className="flex flex-wrap items-center gap-5">
            <ProgressRing value={progress} label="Care plan completion">
              {progress}
            </ProgressRing>
            <ProgressRing value={92} tone="success" label="Medication adherence">
              92
            </ProgressRing>
            <Spinner className="size-5 text-primary" />
            <Button variant="secondary" size="sm" onClick={() => setProgress((p) => (p >= 100 ? 12 : Math.min(100, p + 18)))}>
              Advance
            </Button>
          </div>
        </Demo>
        <Demo id="feedback-loading-and-empty" files={["ui/skeleton", "ui/card", "ui/empty-state", "ui/button"]} title="Loading and empty" note="Skeletons take the shape of what is coming. Empty states show the ghost of what belongs here and offer the action that fills it." className="items-center">
          <div className="flex min-w-60 flex-1 flex-col gap-3">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3.5 w-2/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
            </div>
            <Skeleton className="h-20 w-full rounded-lg" />
          </div>
          <Card variant="sunken" className="min-w-60 flex-1 p-0">
            <EmptyState
              icon={<FlaskConical />}
              title="No lab results yet"
              description="Results appear here as soon as the lab releases them."
              action={<Button size="sm" variant="outline">Order a test</Button>}
            />
          </Card>
        </Demo>
      </Section>

      <Section id="data" title="Data display" lead="Cards are white and float on the paper. Numbers use tabular figures, and clinical readings are never animated.">
        <Demo id="data-summary-figures" files={["patterns/stat-card", "ui/motion"]} title="Summary figures" bare className="items-stretch">
          <StatCard className="min-w-52 flex-1" label="Visits this week" value={<NumberTicker value={148} />} delta="+12%" trend="positive" caption="vs last week" />
          <StatCard className="min-w-52 flex-1" label="No-show rate" value={<NumberTicker value={4.8} format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }} />} unit="%" delta="−1.3 pts" direction="down" trend="positive" caption="vs last week" />
          <StatCard className="min-w-52 flex-1" label="Average wait" value={<NumberTicker value={11} />} unit="min" delta="+2 min" trend="negative" caption="vs last week" />
        </Demo>
        <Demo id="data-lab-results" files={["patterns/lab-tile"]} title="Lab results" bare className="items-stretch">
          <LabTile className="min-w-64 flex-1" name="HbA1c" value={5.4} unit="%" range={{ low: 4, high: 5.6 }} collected="12 Nov" />
          <LabTile className="min-w-64 flex-1" name="LDL cholesterol" value={131} unit="mg/dL" range={{ low: 0, high: 100 }} scale={{ min: 0, max: 190 }} collected="12 Nov" />
        </Demo>
        <Demo id="data-appointments" files={["patterns/appointment-card", "ui/button"]} title="Appointments" bare className="flex-col items-stretch">
          <AppointmentCard
            month="Dec"
            day="3"
            time="10:30 – 11:00"
            title="Follow-up visit"
            person={{ name: "Dr. Ngozi Okafor", role: "Internal medicine" }}
            mode="video"
            status="confirmed"
            actions={
              <>
                <Button variant="ghost" size="sm">
                  Reschedule
                </Button>
                <Button size="sm">Join</Button>
              </>
            }
          />
          <AppointmentCard
            month="Dec"
            day="17"
            time="08:15 – 08:30"
            title="Lipid panel blood draw"
            person={{ name: "Quest Diagnostics" }}
            mode="in-person"
            location="410 Mission St, Suite 2"
            status="pending"
            actions={<Button variant="ghost" size="sm">Details</Button>}
          />
        </Demo>
        <Demo id="data-table" files={["ui/table", "ui/avatar", "ui/badge"]} title="Table" note="Rows highlight on hover. Numeric columns align right." className="items-start" >
          <div data-density="compact" className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>MRN</TableHead>
                  <TableHead>Visit</TableHead>
                  <TableHead numeric>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((p) => (
                  <TableRow key={p.mrn}>
                    <TableCell>
                      <span className="flex items-center gap-2.5 font-medium">
                        <Avatar name={p.name} size="xs" /> {p.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-data">{p.mrn}</TableCell>
                    <TableCell>{p.visit}</TableCell>
                    <TableCell numeric>{p.time}</TableCell>
                    <TableCell>
                      <Badge tone={p.status[0]} variant="status">
                        {p.status[1]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Demo>
        <Demo id="data-cards-and-people" files={["ui/card", "ui/avatar"]} title="Cards and people" bare className="items-stretch">
          <Card className="min-w-64 flex-1">
            <CardHeader>
              <div>
                <CardTitle>Care team</CardTitle>
                <CardDescription>3 clinicians follow your plan</CardDescription>
              </div>
              <AvatarGroup>
                <Avatar name="Ngozi Okafor" size="sm" />
                <Avatar name="Sam Whitfield" size="sm" />
                <Avatar name="Leila Haddad" size="sm" />
              </AvatarGroup>
            </CardHeader>
          </Card>
          <Card interactive tabIndex={0} className="min-w-64 flex-1">
            <CardHeader>
              <div>
                <CardTitle>Book a visit</CardTitle>
                <CardDescription>An interactive card: hover, focus or press it</CardDescription>
              </div>
              <CalendarDays className="size-5 text-muted-foreground" />
            </CardHeader>
          </Card>
        </Demo>
        <Demo id="data-accordion" files={["ui/accordion"]} title="Accordion" className="items-start">
          <Accordion className="w-full">
            <AccordionItem value="prep">
              <AccordionTrigger>How do I prepare for a video visit?</AccordionTrigger>
              <AccordionContent>
                Find a quiet, well-lit place and open this page five minutes early. Have your medication list and any home readings to hand.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="results">
              <AccordionTrigger>When will I see my lab results?</AccordionTrigger>
              <AccordionContent>Most results are released within two business days. Your clinician may add a note explaining what they mean.</AccordionContent>
            </AccordionItem>
            <AccordionItem value="billing">
              <AccordionTrigger>What will this visit cost?</AccordionTrigger>
              <AccordionContent>Your copay is shown before you confirm. Anything your plan does not cover appears under Payments after the visit.</AccordionContent>
            </AccordionItem>
          </Accordion>
        </Demo>
        <Demo id="data-search" files={["ui/input"]} title="Search" className="items-start">
          <Input leading={<Search />} placeholder="Search patients by name or MRN" type="search" className="max-w-sm" />
        </Demo>
      </Section>
      <More />
    </>
  );
}
