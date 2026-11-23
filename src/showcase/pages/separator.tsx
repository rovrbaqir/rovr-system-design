import { Download, Printer, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="separator-horizontal" files={["ui/separator"]} title="Horizontal" note="A hairline across the full width, between groups of content that belong to the same card." className="flex-col items-stretch gap-4">
        <div>
          <p className="text-title-sm">Follow-up visit</p>
          <p className="text-body-sm text-muted-foreground">Thursday 3 December, 10:30 to 11:00</p>
        </div>
        <Separator />
        <div>
          <p className="text-title-sm">Dr. Ngozi Okafor</p>
          <p className="text-body-sm text-muted-foreground">Internal medicine, Mission St Clinic</p>
        </div>
      </Demo>
      <Demo id="separator-vertical" files={["ui/separator"]} title="Vertical" note="Set orientation to vertical inside a flex row. It stretches to the height of the row.">
        <div className="flex gap-4 text-body">
          <span>
            <span className="text-muted-foreground">MRN</span> <span className="text-data">20418</span>
          </span>
          <Separator orientation="vertical" />
          <span>
            <span className="text-muted-foreground">Born</span> 14 Apr 1988
          </span>
          <Separator orientation="vertical" />
          <span>
            <span className="text-muted-foreground">Plan</span> Aetna PPO
          </span>
        </div>
      </Demo>
      <Demo id="separator-toolbar" files={["ui/separator", "ui/button"]} title="In a toolbar" note="Splits a row of actions into groups. Give it a height when the row should not be divided top to bottom.">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-md" aria-label="Download">
            <Download />
          </Button>
          <Button variant="ghost" size="icon-md" aria-label="Print">
            <Printer />
          </Button>
          <Separator orientation="vertical" className="mx-1.5 h-5 self-center" />
          <Button variant="ghost" size="icon-md" aria-label="Share with care team">
            <Share2 />
          </Button>
          <Separator orientation="vertical" className="mx-1.5 h-5 self-center" />
          <Button variant="ghost" size="sm">
            Add a note
          </Button>
        </div>
      </Demo>
      <Demo id="separator-label" files={["ui/separator"]} title="With a label" note="Two separators either side of a word, for the 'or' between two ways of doing the same thing." className="flex-col items-stretch gap-4">
        <Button variant="secondary" className="self-center">
          Sign in with your clinic account
        </Button>
        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-body-sm text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>
        <Button variant="outline" className="self-center">
          Send me a one-time code
        </Button>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "separator",
  title: "Separator",
  group: "Components",
  summary: "A hairline that divides content, horizontal or vertical. Try spacing first: a separator is for groups that white space alone does not tell apart.",
  keywords: "divider rule line hr hairline",
  Body,
};
