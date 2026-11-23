import { Bell, CalendarDays, FileText, FlaskConical, LayoutDashboard, MessageSquare, PanelLeft, Pill, Settings, Stethoscope, Users } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { AppShell, Sidebar, SidebarItem, SidebarSection, useAppShell } from "@/components/patterns/app-shell";
import { PageHeader } from "@/components/patterns/page-header";
import { StatCard } from "@/components/patterns/stat-card";
import { Demo } from "../kit";
import type { DocPage } from "../types";

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
            <SidebarItem icon={<LayoutDashboard />} label="Mission control" active href="#/app-shell" />
            <SidebarItem icon={<CalendarDays />} label="Schedule" badge="14" href="#/app-shell" />
            <SidebarItem icon={<Users />} label="Patients" href="#/app-shell" />
            <SidebarItem icon={<MessageSquare />} label="Messages" badge="3" href="#/app-shell" />
            <SidebarSection label="Clinical">
              <SidebarItem icon={<FlaskConical />} label="Labs and imaging" href="#/app-shell" />
              <SidebarItem icon={<Pill />} label="Prescriptions" href="#/app-shell" />
              <SidebarItem icon={<FileText />} label="Documents" href="#/app-shell" />
            </SidebarSection>
            <SidebarSection label="Workspace">
              <SidebarItem icon={<Settings />} label="Settings" href="#/app-shell" />
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

function CollapsedShell() {
  return (
    <div className="h-80 w-full overflow-hidden rounded-xl border border-border max-md:h-auto">
      <AppShell
        defaultCollapsed
        className="h-full"
        sidebar={
          <Sidebar className="h-80" header={<span className="text-lg leading-none font-bold tracking-[-0.035em]">RoVR</span>}>
            <SidebarItem icon={<LayoutDashboard />} label="Home" href="#/app-shell" />
            <SidebarItem icon={<CalendarDays />} label="Appointments" active href="#/app-shell" />
            <SidebarItem icon={<MessageSquare />} label="Messages" badge="1" href="#/app-shell" />
            <SidebarSection label="Records">
              <SidebarItem icon={<FlaskConical />} label="Lab results" href="#/app-shell" />
              <SidebarItem icon={<Pill />} label="Medications" href="#/app-shell" />
            </SidebarSection>
          </Sidebar>
        }
      >
        <div className="flex h-full flex-col gap-2 p-6">
          <p className="text-title-md">Appointments</p>
          <p className="max-w-[52ch] text-body-sm text-muted-foreground">
            The rail keeps every destination one click away and leaves the width to the content. Hover an icon for its name, or press the button at the top of the rail to expand it.
          </p>
        </div>
      </AppShell>
    </div>
  );
}

function FocusToggle() {
  const { collapsed, toggle } = useAppShell();
  return (
    <Button variant="outline" size="sm" className="w-fit" onClick={toggle}>
      <PanelLeft /> {collapsed ? "Show navigation" : "Hide navigation"}
    </Button>
  );
}

function ShellWithToggle() {
  return (
    <div className="h-72 w-full overflow-hidden rounded-xl border border-border max-md:h-auto">
      <AppShell
        className="h-full"
        sidebar={
          <Sidebar className="h-72" header={<span className="text-lg leading-none font-bold tracking-[-0.035em]">RoVR</span>}>
            <SidebarItem icon={<Users />} label="Patients" active href="#/app-shell" />
            <SidebarItem icon={<CalendarDays />} label="Schedule" href="#/app-shell" />
            <SidebarItem icon={<MessageSquare />} label="Messages" href="#/app-shell" />
          </Sidebar>
        }
      >
        <div className="flex h-full flex-col gap-3 p-6">
          <p className="text-title-md">Amara Osei, visit note</p>
          <p className="max-w-[52ch] text-body-sm text-muted-foreground">Any component inside the shell can read and change the sidebar state, for example to give a long note more room.</p>
          <FocusToggle />
        </div>
      </AppShell>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="app-shell-full" files={["patterns/app-shell", "patterns/page-header", "patterns/stat-card", "ui/avatar", "ui/button"]} title="Sidebar and content" note="One frame for both apps: a collapsible sidebar with a header, sections and a footer, then the page. Shown at compact density, as the provider app uses it. The sidebar is hidden at phone width; apps show navigation in a Sheet there." bare className="flex-col items-stretch">
        <ShellDemo />
        <p className="text-body-sm text-muted-foreground md:hidden">The sidebar is hidden at phone width; apps show navigation in a Sheet there.</p>
      </Demo>
      <Demo id="app-shell-collapsed" files={["patterns/app-shell"]} title="Collapsed by default" note="defaultCollapsed starts the shell as a rail of icons. Labels move into tooltips, section labels become short rules and badges are hidden." bare className="flex-col items-stretch">
        <CollapsedShell />
      </Demo>
      <Demo id="app-shell-use-app-shell" files={["patterns/app-shell", "ui/button"]} title="Reading the sidebar state" note="useAppShell returns collapsed and toggle to anything rendered inside the shell." bare className="flex-col items-stretch">
        <ShellWithToggle />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "app-shell",
  title: "App shell",
  group: "Patterns",
  summary: "The frame shared by the patient and provider apps: a collapsible sidebar and the content area beside it. Use it once, at the root of an app.",
  keywords: "sidebar layout navigation nav rail frame menu collapse",
  Body,
};
