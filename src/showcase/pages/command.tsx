import * as React from "react";
import { CalendarDays, FlaskConical, LayoutDashboard, MessageSquare, Pill, Search, Settings, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommandPalette, CommandTrigger, useCommandShortcut, type CommandItem } from "@/components/ui/command";
import { toast } from "@/components/ui/toast";
import { Demo } from "../kit";
import type { DocPage } from "../types";

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

function ChartActions() {
  const [open, setOpen] = React.useState(false);
  const done = (message: string) => () => toast.success(message);
  const items: CommandItem[] = [
    { id: "o1", group: "Order", label: "Lipid panel", keywords: "cholesterol ldl hdl", icon: <FlaskConical />, onSelect: done("Lipid panel ordered for Amara Osei") },
    { id: "o2", group: "Order", label: "HbA1c", keywords: "a1c glucose diabetes", icon: <FlaskConical />, onSelect: done("HbA1c ordered for Amara Osei") },
    { id: "o3", group: "Order", label: "Complete blood count", keywords: "cbc", icon: <FlaskConical />, onSelect: done("Complete blood count ordered for Amara Osei") },
    { id: "r1", group: "Prescribe", label: "Renew atorvastatin 20 mg", keywords: "rx statin refill", icon: <Pill />, onSelect: done("Atorvastatin 20 mg renewed") },
    { id: "m1", group: "Contact", label: "Message Amara Osei", icon: <MessageSquare />, onSelect: done("Message started") },
  ];
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        <Search /> Find an action
      </Button>
      <CommandPalette open={open} onOpenChange={setOpen} items={items} placeholder="Order a test, renew a prescription, send a message" />
    </>
  );
}

function Body() {
  return (
    <>
      <Demo id="command-palette" files={["ui/command", "ui/toast"]} title="Command palette" note="Press ⌘K, or Ctrl+K on Windows, anywhere on this page. Arrow keys move one gliding highlight, Enter runs the item and Escape closes. useCommandShortcut binds the keys.">
        <Palette />
      </Demo>
      <Demo id="command-trigger" files={["ui/command"]} title="Trigger" note="CommandTrigger looks like a search field and shows the shortcut. It is a button, so it takes onClick, disabled and a class for width." className="flex-col items-stretch">
        <CommandTrigger />
        <CommandTrigger className="max-w-none">Search 2,418 patients</CommandTrigger>
        <CommandTrigger disabled className="cursor-not-allowed opacity-45">
          Search is unavailable offline
        </CommandTrigger>
      </Demo>
      <Demo id="command-scoped" files={["ui/command", "ui/button", "ui/toast"]} title="Scoped to a task" note="Any button can open a palette. Items are grouped by their group name, and keywords match words that are not in the label: try 'rx' or 'cholesterol'. Type something that is not there to see the empty message.">
        <ChartActions />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "command",
  title: "Command palette",
  group: "Components",
  summary: "Search-and-jump for the whole app: patients, pages and actions in one list, opened with ⌘K. One per app, mounted at the root.",
  keywords: "cmdk command menu search spotlight quick actions shortcut ⌘K ctrl k launcher",
  Body,
};
