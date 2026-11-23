import * as React from "react";
import { Banner } from "@/components/ui/banner";
import { Button } from "@/components/ui/button";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function DismissibleBanner() {
  const [shown, setShown] = React.useState(true);
  return shown ? (
    <Banner tone="info" className="rounded-lg" onDismiss={() => setShown(false)}>
      Flu vaccines are now available at Mission St Clinic.
    </Banner>
  ) : (
    <Button variant="secondary" size="sm" className="w-fit" onClick={() => setShown(true)}>
      Show the banner again
    </Button>
  );
}

function Body() {
  return (
    <>
      <Demo id="banner-tones" files={["ui/banner"]} title="Tones" note="Info for news, warning for something coming, danger for something broken now, neutral for a mode the app is in. Show one at a time." className="flex-col items-stretch gap-4">
        <Banner className="rounded-lg">Flu vaccines are now available at Mission St Clinic.</Banner>
        <Banner tone="warning" className="rounded-lg">
          Lab ordering will be unavailable Saturday 02:00 to 04:00 PT for maintenance.
        </Banner>
        <Banner tone="danger" className="rounded-lg">
          Prescriptions cannot be sent to pharmacies right now. We are working on it.
        </Banner>
        <Banner tone="neutral" className="rounded-lg">
          You are viewing Amara Osei's chart in read-only mode.
        </Banner>
      </Demo>
      <Demo id="banner-with-action" files={["ui/banner", "ui/button"]} title="With an action" note="One link-style action after the text." className="flex-col items-stretch gap-4">
        <Banner tone="warning" className="rounded-lg" action={<Button variant="link" size="sm">See schedule</Button>}>
          Lab ordering will be unavailable Saturday 02:00 to 04:00 PT for maintenance.
        </Banner>
        <Banner tone="danger" className="rounded-lg" action={<Button variant="link" size="sm">Sign in again</Button>}>
          Your session has expired. Unsaved changes are kept on this device.
        </Banner>
      </Demo>
      <Demo id="banner-dismissible" files={["ui/banner", "ui/button"]} title="Dismissible" note="Pass onDismiss to add the close button. Leave it off for anything the person needs to keep seeing, such as read-only mode." className="flex-col items-stretch gap-4">
        <DismissibleBanner />
      </Demo>
      <Demo id="banner-page" files={["ui/banner", "ui/button"]} title="Above a page" note="In an app the banner spans the full width above the header, with square corners." bare className="flex-col items-stretch gap-0">
        <div className="overflow-hidden rounded-xl rovr-risen">
          <Banner tone="neutral" action={<Button variant="link" size="sm" className="text-inverse-foreground">Request edit access</Button>}>
            You are viewing Amara Osei's chart in read-only mode.
          </Banner>
          <div className="flex flex-col gap-1 p-6">
            <p className="text-title-lg">Amara Osei</p>
            <p className="text-body-sm text-muted-foreground">34 years · MRN 2041-88317 · Dr. Ngozi Okafor</p>
          </div>
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "banner",
  title: "Banner",
  group: "Components",
  summary: "A page-wide message above the content: scheduled downtime, an expired session, read-only mode. Use a callout for a message about one part of the page.",
  keywords: "announcement notice system message maintenance alert bar",
  Body,
};
