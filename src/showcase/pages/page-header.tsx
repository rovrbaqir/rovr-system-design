import { ArrowLeft, CalendarPlus, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/patterns/page-header";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="page-header-basic" files={["patterns/page-header"]} title="Title and description" note="The title is the page's h1, so use one page header per screen. The description is optional." className="flex-col items-stretch gap-8">
        <PageHeader title="Lab results" />
        <PageHeader title="Medications" description="Everything you are currently prescribed. Ask your care team before stopping or changing a dose." />
      </Demo>
      <Demo id="page-header-actions" files={["patterns/page-header", "ui/button"]} title="With actions" note="Actions align with the baseline of the title and wrap below it when space runs out. One primary button at most." className="items-stretch">
        <PageHeader
          className="w-full"
          title="Appointments"
          description="2 upcoming visits. Your next one is Thursday 3 December at 10:30."
          actions={
            <>
              <Button variant="outline">
                <Download /> Export
              </Button>
              <Button>
                <CalendarPlus /> Book a visit
              </Button>
            </>
          }
        />
      </Demo>
      <Demo id="page-header-breadcrumbs" files={["patterns/page-header", "ui/breadcrumbs", "ui/badge", "ui/button"]} title="With breadcrumbs" note="navigation sits above the title. The title takes any content, so a status can ride beside it." className="items-stretch">
        <PageHeader
          className="w-full"
          navigation={<Breadcrumbs items={[{ label: "Billing", href: "#/page-header" }, { label: "Claims", href: "#/page-header" }, { label: "CL-48224" }]} />}
          title={
            <span className="flex flex-wrap items-center gap-3">
              Claim CL-48224 <Badge tone="danger">Denied</Badge>
            </span>
          }
          description="Priya Raman · Cigna · Service date 13 Nov 2026"
          actions={<Button>Resubmit claim</Button>}
        />
      </Demo>
      <Demo id="page-header-back-link" files={["patterns/page-header", "ui/button"]} title="With a back link" note="On a detail page reached from one list, a single back link reads better than a trail." className="items-stretch">
        <PageHeader
          className="w-full"
          navigation={
            <a href="#/page-header" className="inline-flex w-fit items-center gap-1.5 rounded-xs text-body-sm text-muted-foreground rovr-focus hover:text-foreground">
              <ArrowLeft className="size-3.5" aria-hidden /> All patients
            </a>
          }
          title="Amara Osei"
          description="Last seen 12 November for a follow-up with Dr. Ngozi Okafor."
          actions={<Button variant="outline">Message</Button>}
        />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "page-header",
  title: "Page header",
  group: "Examples",
  summary: "The single header every screen uses: title, optional description, navigation above and actions at the end. It replaces the per-module headers in both apps.",
  keywords: "title heading h1 toolbar breadcrumbs back actions",
  Body,
};
