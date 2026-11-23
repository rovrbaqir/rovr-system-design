import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="breadcrumbs-basic" files={["ui/breadcrumbs"]} title="Default" note="Every item except the last is a link. The last is the current page and is marked for screen readers.">
        <Breadcrumbs items={[{ label: "Patients", href: "#/breadcrumbs" }, { label: "Amara Osei", href: "#/breadcrumbs" }, { label: "Lab results" }]} />
      </Demo>
      <Demo id="breadcrumbs-depth" files={["ui/breadcrumbs"]} title="Depth" note="Two levels is the least worth showing. Long trails wrap onto a second line instead of being cut off." className="flex-col items-start gap-5">
        <Breadcrumbs items={[{ label: "Schedule", href: "#/breadcrumbs" }, { label: "Thursday 3 December" }]} />
        <Breadcrumbs
          items={[
            { label: "Billing", href: "#/breadcrumbs" },
            { label: "Claims", href: "#/breadcrumbs" },
            { label: "Aetna", href: "#/breadcrumbs" },
            { label: "November 2026", href: "#/breadcrumbs" },
            { label: "CL-48224", href: "#/breadcrumbs" },
            { label: "Appeal" },
          ]}
        />
      </Demo>
      <Demo id="breadcrumbs-plain-items" files={["ui/breadcrumbs"]} title="Items without links" note="Leave href off a level that has no page of its own. It shows as plain text.">
        <Breadcrumbs items={[{ label: "Settings", href: "#/breadcrumbs" }, { label: "Workspace" }, { label: "Clinic hours" }]} />
      </Demo>
      <Demo id="breadcrumbs-page-header" files={["ui/breadcrumbs", "ui/button"]} title="Above a page title" note="Breadcrumbs sit above the heading, with the page's actions to the right of it." className="items-start">
        <div className="flex w-full flex-col gap-2">
          <Breadcrumbs items={[{ label: "Patients", href: "#/breadcrumbs" }, { label: "Amara Osei", href: "#/breadcrumbs" }, { label: "Lipid panel" }]} />
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-title-md">Lipid panel</p>
              <p className="text-body-sm text-muted-foreground">Collected 12 November, resulted 13 November</p>
            </div>
            <Button variant="outline" size="sm">
              Download PDF
            </Button>
          </div>
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "breadcrumbs",
  title: "Breadcrumbs",
  group: "Components",
  summary: "Shows where a page sits in the app and links back up each level. Use it on pages two or more levels deep, such as a result inside a patient's chart.",
  keywords: "breadcrumb trail path hierarchy navigation back",
  Body,
};
