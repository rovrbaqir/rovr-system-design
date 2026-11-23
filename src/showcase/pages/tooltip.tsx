import { Download, Printer, RefreshCw, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="tooltip-basic" files={["ui/tooltip", "ui/button"]} title="Hint" note="A short, non-essential hint on hover or keyboard focus. It is never the only place a piece of information lives.">
        <Tooltip content="Synced from Apple Health 4 minutes ago">
          <Button variant="ghost">Hover for a tooltip</Button>
        </Tooltip>
      </Demo>
      <Demo id="tooltip-sides" files={["ui/tooltip", "ui/button"]} title="Sides" note="Top is the default. It moves to the opposite side when there is no room.">
        <Tooltip content="Above the trigger">
          <Button variant="secondary">Top</Button>
        </Tooltip>
        <Tooltip content="Below the trigger" side="bottom">
          <Button variant="secondary">Bottom</Button>
        </Tooltip>
        <Tooltip content="Before the trigger" side="left">
          <Button variant="secondary">Left</Button>
        </Tooltip>
        <Tooltip content="After the trigger" side="right">
          <Button variant="secondary">Right</Button>
        </Tooltip>
      </Demo>
      <Demo id="tooltip-toolbar" files={["ui/tooltip", "ui/button"]} title="Icon toolbar" note="Icon-only buttons keep their aria-label and get a tooltip that says the same thing. After the first one opens, its neighbours open without the delay.">
        <Tooltip content="Download PDF">
          <Button variant="outline" size="icon-md" aria-label="Download PDF">
            <Download />
          </Button>
        </Tooltip>
        <Tooltip content="Print">
          <Button variant="outline" size="icon-md" aria-label="Print">
            <Printer />
          </Button>
        </Tooltip>
        <Tooltip content="Share with care team">
          <Button variant="outline" size="icon-md" aria-label="Share with care team">
            <Share2 />
          </Button>
        </Tooltip>
        <Tooltip content="Refresh results">
          <Button variant="outline" size="icon-md" aria-label="Refresh results">
            <RefreshCw />
          </Button>
        </Tooltip>
      </Demo>
      <Demo id="tooltip-on-text" files={["ui/tooltip", "ui/badge"]} title="On other elements" note="Any focusable element can carry one. Give plain elements tabIndex so keyboard users reach the hint too.">
        <Tooltip content="Released by Quest Diagnostics on 12 November, 08:14">
          <Badge tone="success" tabIndex={0} className="rovr-focus">
            Final
          </Badge>
        </Tooltip>
        <Tooltip content="Low-density lipoprotein cholesterol" side="bottom">
          <abbr tabIndex={0} className="cursor-help rounded-xs text-body underline decoration-dotted underline-offset-4 rovr-focus">
            LDL-C
          </abbr>
        </Tooltip>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "tooltip",
  title: "Tooltip",
  group: "Components",
  summary: "A small label that appears on hover or focus. Use it to name an icon button or add a hint; anything the person needs to read belongs on the page or in a popover.",
  keywords: "hint title hover label help",
  Body,
};
