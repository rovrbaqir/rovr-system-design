import * as React from "react";
import { CalendarClock, ChevronDown, Copy, Download, Ellipsis, MessageSquare, Pencil, Trash2, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Menu, MenuCheckboxItem, MenuContent, MenuGroup, MenuItem, MenuLabel, MenuSeparator, MenuTrigger } from "@/components/ui/menu";
import { toast } from "@/components/ui/toast";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function ColumnsMenu() {
  const [columns, setColumns] = React.useState({ range: true, trend: true, lab: false });
  const shown = Object.values(columns).filter(Boolean).length;
  return (
    <Menu>
      <MenuTrigger
        render={
          <Button variant="outline">
            Columns ({shown}) <ChevronDown />
          </Button>
        }
      />
      <MenuContent>
        <MenuGroup aria-label="Columns">
          <MenuLabel>Columns</MenuLabel>
          <MenuCheckboxItem checked={columns.range} onCheckedChange={(checked) => setColumns((c) => ({ ...c, range: checked }))}>
            Reference range
          </MenuCheckboxItem>
          <MenuCheckboxItem checked={columns.trend} onCheckedChange={(checked) => setColumns((c) => ({ ...c, trend: checked }))}>
            Trend
          </MenuCheckboxItem>
          <MenuCheckboxItem checked={columns.lab} onCheckedChange={(checked) => setColumns((c) => ({ ...c, lab: checked }))}>
            Performing lab
          </MenuCheckboxItem>
        </MenuGroup>
      </MenuContent>
    </Menu>
  );
}

function Body() {
  return (
    <>
      <Demo id="menu-items" files={["ui/menu", "ui/button"]} title="Items, labels and shortcuts" note="A label heads a run of items and a separator divides runs. The destructive item is red and sits last, on its own. Arrow keys move one gliding highlight.">
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
      </Demo>
      <Demo id="menu-checkbox-items" files={["ui/menu", "ui/button"]} title="Checkbox items" note="For settings that apply straight away. Controlled here, so the trigger can show how many are on. MenuGroup with an aria-label announces the group.">
        <ColumnsMenu />
      </Demo>
      <Demo id="menu-row-actions" files={["ui/menu", "ui/button", "ui/toast"]} title="Row actions" note="An icon trigger at the end of a table row, opening towards the row with align set to end. Items that are not available are disabled, not hidden.">
        <div className="flex w-full max-w-md items-center justify-between gap-4 rounded-lg bg-surface-sunken px-4 py-3">
          <div>
            <p className="text-title-sm">Amara Osei</p>
            <p className="text-body-sm text-muted-foreground">Follow-up · Thursday 3 December, 10:30</p>
          </div>
          <Menu>
            <MenuTrigger
              render={
                <Button variant="ghost" size="icon-sm" aria-label="Actions for Amara Osei">
                  <Ellipsis />
                </Button>
              }
            />
            <MenuContent align="end">
              <MenuItem onClick={() => toast.message("Opening chart for Amara Osei")}>
                <UserRound /> Open chart
              </MenuItem>
              <MenuItem onClick={() => toast.message("New message to Amara Osei")}>
                <MessageSquare /> Message patient
              </MenuItem>
              <MenuItem disabled>
                <CalendarClock /> Reschedule
              </MenuItem>
              <MenuSeparator />
              <MenuItem destructive onClick={() => toast.message("Visit cancelled", { action: { label: "Undo", onClick: () => toast.success("Visit restored") } })}>
                <Trash2 /> Cancel visit
              </MenuItem>
            </MenuContent>
          </Menu>
        </div>
      </Demo>
      <Demo id="menu-placement" files={["ui/menu", "ui/button"]} title="Placement" note="Opens below, lined up with the start of the trigger. side, align and sideOffset change that.">
        <Menu>
          <MenuTrigger render={<Button variant="secondary">Above</Button>} />
          <MenuContent side="top">
            <MenuItem>Today</MenuItem>
            <MenuItem>Last 7 days</MenuItem>
            <MenuItem>Last 30 days</MenuItem>
          </MenuContent>
        </Menu>
        <Menu>
          <MenuTrigger render={<Button variant="secondary">To the right</Button>} />
          <MenuContent side="right" sideOffset={10}>
            <MenuItem>Newest first</MenuItem>
            <MenuItem>Oldest first</MenuItem>
            <MenuItem>Out of range first</MenuItem>
          </MenuContent>
        </Menu>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "menu",
  title: "Menu",
  group: "Components",
  summary: "A list of actions that opens from a button. Use it for the secondary actions of a page, card or table row; use Select to choose a value.",
  keywords: "dropdown menu actions overflow more options kebab",
  Body,
};
