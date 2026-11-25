import * as React from "react";
import {
  ArrowLeftRight,
  Bug,
  CalendarDays,
  CreditCard,
  FileText,
  HeartPulse,
  House,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  LogOut,
  MessageSquare,
  Search,
  Send,
  Settings,
  ShieldCheck,
  Sparkles,
  SquarePen,
  Users,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { MenuItem } from "@/components/ui/menu";
import { toast } from "@/components/ui/toast";
import {
  AppHeader,
  AppShell,
  AppSidebar,
  SidebarAccount,
  SidebarItem,
  SidebarRecent,
  SidebarSection,
  SidebarSeparator,
  SidebarWorkspaceSwitch,
  type SidebarRecentItem,
} from "@/components/patterns/app-shell";
import { PoweredByRovr, RovrWordmark } from "@/components/patterns/intake-page";
import { HeaderActions } from "@/components/patterns/page-header";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const frame = "w-full overflow-hidden rounded-xl border border-border";
const reportError = () => toast.message("Error report opened", { description: "The app opens its report form here." });

/* Provider app ------------------------------------------------------- */

const providerModules = [
  { id: "mission-control", label: "Mission Control", icon: <LayoutDashboard /> },
  { id: "schedule", label: "Schedule", icon: <CalendarDays /> },
  { id: "patients", label: "Patients", icon: <Users /> },
  { id: "documents", label: "Document Center", icon: <FileText />, badge: 4 },
  { id: "tasks", label: "Task Management", icon: <ListChecks />, badge: 12 },
  { id: "referrals", label: "Referrals", icon: <Send /> },
  { id: "prior-auth", label: "Prior Authorization", icon: <ShieldCheck /> },
  { id: "payments", label: "Payments", icon: <CreditCard /> },
];

const providerRecent: SidebarRecentItem[] = [
  { id: "c1", title: "Amara Osei: lipid panel follow-up", unread: true },
  { id: "c2", title: "Front desk: Thursday schedule" },
  { id: "c3", title: "Daniel Reyes: refill request" },
  { id: "c4", title: "Billing: claim CLM-2026-004871", unread: true },
];

const visits = [
  { time: "09:00", patient: "Daniel Reyes", reason: "Medication review", status: "Checked in" },
  { time: "09:30", patient: "Amara Osei", reason: "Lipid panel follow-up", status: "Confirmed" },
  { time: "10:30", patient: "Mei Tanaka", reason: "New patient visit", status: "Intake due" },
  { time: "11:15", patient: "Joseph Adeyemi", reason: "Blood pressure check", status: "Confirmed" },
  { time: "13:00", patient: "Priya Raman", reason: "Annual physical", status: "Confirmed" },
  { time: "14:00", patient: "Lucas Moreau", reason: "Video visit, asthma", status: "Confirmed" },
];

function VisitList() {
  return (
    <section className="rounded-xl rovr-risen p-5">
      <h2 className="text-title-md">Today's visits</h2>
      <ul className="mt-3 flex flex-col">
        {visits.map((visit) => (
          <li key={visit.time} className="flex items-center gap-4 border-t border-border py-3">
            <span className="w-12 shrink-0 text-body-sm text-data text-muted-foreground">{visit.time}</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-label">{visit.patient}</span>
              <span className="block truncate text-caption text-muted-foreground">{visit.reason}</span>
            </span>
            <span className="shrink-0 text-caption text-muted-foreground">{visit.status}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ProviderShell({ defaultExpanded = true }: { defaultExpanded?: boolean }) {
  const [active, setActive] = React.useState("mission-control");
  const [opening, setOpening] = React.useState<string | null>(null);
  const title = active === "pulse" ? "Pulse" : (providerModules.find((item) => item.id === active)?.label ?? "Mission Control");

  const openConversation = (item: SidebarRecentItem) => {
    setOpening(item.id);
    setTimeout(() => {
      setOpening(null);
      setActive("pulse");
    }, 900);
  };

  return (
    <div className={frame}>
      <AppShell
        height={560}
        sidebar={
          <AppSidebar
            defaultExpanded={defaultExpanded}
            logo={<RovrWordmark className="h-5 w-[60px]" />}
            onLogoClick={() => setActive("mission-control")}
            footer={
              <>
                <SidebarWorkspaceSwitch icon={<ArrowLeftRight />} label="RCM Home" description="Go to workspace" onClick={() => toast.message("Switched to the RCM workspace")} />
                <SidebarAccount name="Ngozi Okafor" detail="Provider">
                  <MenuItem>Settings</MenuItem>
                  <MenuItem className="justify-between">
                    Logout
                    <LogOut />
                  </MenuItem>
                </SidebarAccount>
              </>
            }
          >
            <SidebarSection aria-label="Pulse">
              <SidebarItem icon={<Sparkles />} label="Pulse" badge={3} active={active === "pulse"} onClick={() => setActive("pulse")} />
            </SidebarSection>
            <SidebarSection label="Modules">
              {providerModules.map((item) => (
                <SidebarItem key={item.id} icon={item.icon} label={item.label} badge={item.badge} active={active === item.id} onClick={() => setActive(item.id)} />
              ))}
            </SidebarSection>
            <SidebarRecent items={providerRecent.map((item) => ({ ...item, opening: opening === item.id }))} onSelect={openConversation} />
          </AppSidebar>
        }
        header={
          <AppHeader
            title={title}
            actions={
              <Button variant="secondary" size="sm" onClick={reportError}>
                <Bug />
                Report an error
              </Button>
            }
          />
        }
      >
        <VisitList />
      </AppShell>
    </div>
  );
}

/* Patient app -------------------------------------------------------- */

const patientNav = [
  { id: "home", label: "Home", icon: <House /> },
  { id: "appointments", label: "Appointments", icon: <CalendarDays /> },
  { id: "health-record", label: "Health Record", icon: <HeartPulse /> },
  { id: "care-team", label: "Care Team", icon: <Users /> },
  { id: "virtual-lobby", label: "Virtual Lobby", icon: <Video />, dot: "A visit is ready to join" },
  { id: "payments", label: "Payments", icon: <CreditCard /> },
  { id: "marketplace", label: "Marketplace", icon: <ShieldCheck />, disabled: true },
];

const patientRecent: SidebarRecentItem[] = [
  { id: "p1", title: "What does my LDL result mean?", unread: true },
  { id: "p2", title: "Dr. Okafor: follow-up plan" },
  { id: "p3", title: "Preparing for a fasting blood test" },
];

function NotificationList() {
  return (
    <div className="flex flex-col p-2">
      <h2 className="pb-3 text-title-sm">Notifications</h2>
      <p className="border-t border-border py-3 text-body-sm">Your lipid panel results are ready.</p>
      <p className="border-t border-border py-3 text-body-sm">Dr. Okafor replied to your message.</p>
    </div>
  );
}

function PatientShell({ loading = false }: { loading?: boolean }) {
  const [active, setActive] = React.useState("home");
  const title = active === "chat-history" ? "Chat History" : (patientNav.find((item) => item.id === active)?.label ?? "Home");
  return (
    <div className={frame}>
      <AppShell
        height={560}
        contentClassName="px-4 pt-4"
        sidebar={
          <AppSidebar
            logo={<RovrWordmark className="mb-2 h-5 w-[60px]" />}
            logoCaption={<PoweredByRovr disableLink />}
            onLogoClick={() => setActive("home")}
            footer={
              <>
                <SidebarSeparator />
                <SidebarAccount name="Amara Osei" detail="Complete Care plan" size="md" menuHeader loading={loading}>
                  <MenuItem>
                    <LifeBuoy />
                    Contact Support
                  </MenuItem>
                  <MenuItem>
                    <Settings />
                    Settings
                  </MenuItem>
                  <MenuItem>
                    <LogOut />
                    Sign Out
                  </MenuItem>
                </SidebarAccount>
              </>
            }
          >
            <SidebarSection aria-label="Chat">
              <SidebarItem icon={<MessageSquare />} label="Message Your Care Team" onClick={() => toast.message("Opened a chat with your care team")} />
              <SidebarItem icon={<SquarePen />} label="New Chat" onClick={() => toast.message("Started a new chat with Pulse")} />
              <SidebarItem icon={<Search />} label="Chat History" active={active === "chat-history"} onClick={() => setActive("chat-history")} />
            </SidebarSection>
            <SidebarSection label="Health OS">
              {patientNav.map((item) => (
                <SidebarItem key={item.id} icon={item.icon} label={item.label} dot={item.dot} disabled={item.disabled} active={active === item.id} onClick={() => setActive(item.id)} />
              ))}
            </SidebarSection>
            <SidebarRecent items={loading ? [] : patientRecent} loading={loading} />
          </AppSidebar>
        }
        header={<AppHeader title={title} className="pl-8" actions={<HeaderActions unread onReportError={reportError} notifications={<NotificationList />} />} />}
      >
        <section className="rounded-xl rovr-risen p-5">
          <h2 className="text-title-md">Your next visit</h2>
          <p className="mt-1 text-body text-muted-foreground">Follow-up with Dr. Ngozi Okafor on Thursday 3 December at 10:30. It is a video visit; the lobby opens ten minutes before.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button size="sm">Join the lobby</Button>
            <Button size="sm" variant="secondary">
              Reschedule
            </Button>
          </div>
        </section>
      </AppShell>
    </div>
  );
}

function EmptyRecentShell() {
  return (
    <div className={frame}>
      <AppShell
        height={320}
        sidebar={
          <AppSidebar
            hideCollapse
            logo={<RovrWordmark className="h-5 w-[60px]" />}
            footer={
              <>
                <SidebarSeparator />
                <SidebarAccount name="Mei Tanaka" detail="New member" size="md" />
              </>
            }
          >
            <SidebarSection label="Health OS">
              <SidebarItem icon={<Sparkles />} label="Pulse" active />
              <SidebarItem icon={<House />} label="Home" disabled />
            </SidebarSection>
            <SidebarRecent items={[]} />
          </AppSidebar>
        }
        header={<AppHeader title="Welcome, Mei" />}
      >
        <p className="text-body text-muted-foreground">During onboarding the sidebar stays open and the collapse button is hidden.</p>
      </AppShell>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo
        id="app-shell-provider"
        files={["patterns/app-shell", "patterns/intake-page", "ui/menu", "ui/button", "ui/toast"]}
        title="Provider app"
        note="The sidebar has the Pulse item, the modules with their counts, recent conversations, the workspace switch between two rules, and the account row. The header shows the current page and the report button. The sidebar is hidden on narrow screens, where the apps use a drawer."
        bare
        className="flex-col items-stretch"
      >
        <ProviderShell />
      </Demo>
      <Demo
        id="app-shell-patient"
        files={["patterns/app-shell", "patterns/page-header", "patterns/intake-page", "ui/menu", "ui/button", "ui/toast"]}
        title="Patient app"
        note="The same sidebar with the patient app's parts: quick chat actions on top, the Health OS group with a live dot on the lobby, the powered by RoVR line under the logo, and a roomier account row whose menu repeats the name."
        bare
        className="flex-col items-stretch"
      >
        <PatientShell />
      </Demo>
      <Demo
        id="app-shell-collapsed"
        files={["patterns/app-shell", "patterns/intake-page", "ui/menu", "ui/button", "ui/toast"]}
        title="Collapsed"
        note="defaultExpanded false starts the sidebar as a 60px rail. Labels, group headings, counts and recent conversations are hidden; the account row shows the avatar alone. The button at the top opens it again."
        bare
        className="flex-col items-stretch"
      >
        <ProviderShell defaultExpanded={false} />
      </Demo>
      <Demo
        id="app-shell-loading"
        files={["patterns/app-shell", "patterns/page-header", "patterns/intake-page", "ui/skeleton", "ui/menu"]}
        title="Loading and empty"
        note="While the profile and conversations load, the account row and the recent list show placeholders. With no conversations the list says so. hideCollapse keeps the sidebar open during onboarding."
        bare
        className="flex-col items-stretch gap-4"
      >
        <PatientShell loading />
        <EmptyRecentShell />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "app-shell",
  title: "App shell",
  group: "Examples",
  summary:
    "Both apps. The frame around every signed-in page: a collapsible sidebar on the left and a content column with a sticky header on the right. Replaces DashboardSidebar, DashboardLayout and DashboardHeader in the patient and provider apps.",
  keywords: "sidebar navigation layout dashboard header frame nav rail collapse account menu workspace",
  Body,
};
