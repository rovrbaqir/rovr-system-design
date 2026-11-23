import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip } from "@/components/ui/tooltip";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="kbd-keys" files={["ui/kbd"]} title="Keys" note="One Kbd per key. Short words such as esc and tab widen the key.">
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
        <Kbd>⇧</Kbd>
        <Kbd>↵</Kbd>
        <Kbd>esc</Kbd>
        <Kbd>tab</Kbd>
        <Kbd>↑</Kbd>
        <Kbd>↓</Kbd>
      </Demo>
      <Demo id="kbd-combinations" files={["ui/kbd"]} title="Combinations" note="Keys pressed together sit side by side. Keys pressed one after another are joined with 'then'." className="flex-col items-start">
        <span className="flex items-center gap-1.5 text-body-sm text-muted-foreground">
          Search <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
        <span className="flex items-center gap-1.5 text-body-sm text-muted-foreground">
          Go to schedule <Kbd>G</Kbd> then <Kbd>S</Kbd>
        </span>
        <span className="flex items-center gap-1.5 text-body-sm text-muted-foreground">
          Sign note <Kbd>⌘</Kbd>
          <Kbd>⇧</Kbd>
          <Kbd>↵</Kbd>
        </span>
      </Demo>
      <Demo id="kbd-in-tooltip" files={["ui/kbd", "ui/tooltip", "ui/button"]} title="In a tooltip" note="A shortcut hint belongs where the action is: hover or focus the button.">
        <Tooltip
          content={
            <span className="flex items-center gap-1.5">
              Save draft <Kbd>⌘</Kbd>
              <Kbd>S</Kbd>
            </span>
          }
        >
          <Button variant="secondary">
            <Save /> Save draft
          </Button>
        </Tooltip>
      </Demo>
      <Demo id="kbd-shortcut-list" files={["ui/kbd"]} title="Shortcut list" note="A help panel listing what the keyboard can do in the chart." className="items-start">
        <dl className="grid w-full max-w-sm grid-cols-[1fr_auto] gap-x-6 gap-y-2.5 text-body">
          <dt>Open command palette</dt>
          <dd className="flex gap-1">
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </dd>
          <dt>New appointment</dt>
          <dd className="flex gap-1">
            <Kbd>N</Kbd>
          </dd>
          <dt>Next patient</dt>
          <dd className="flex gap-1">
            <Kbd>J</Kbd>
          </dd>
          <dt>Previous patient</dt>
          <dd className="flex gap-1">
            <Kbd>K</Kbd>
          </dd>
          <dt>Close panel</dt>
          <dd className="flex gap-1">
            <Kbd>esc</Kbd>
          </dd>
        </dl>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "kbd",
  title: "Kbd",
  group: "Components",
  summary: "A keyboard key, for shortcut hints in menus, tooltips, search fields and help panels.",
  keywords: "keyboard key shortcut hotkey keycap",
  Body,
};
