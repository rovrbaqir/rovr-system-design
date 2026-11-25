import * as React from "react";
import { Download, LogOut, RefreshCw, Settings } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/menu";
import { toast } from "@/components/ui/toast";
import { HeaderActions, InnerHeader, PageTitle } from "@/components/patterns/page-header";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const notifications = [
  { id: "n1", title: "Your lipid panel results are ready", time: "10 minutes ago", unread: true },
  { id: "n2", title: "Dr. Okafor replied to your message", time: "Yesterday, 16:42", unread: true },
  { id: "n3", title: "Appointment confirmed for Thursday 3 December at 10:30", time: "Monday, 09:15", unread: false },
];

function NotificationList() {
  return (
    <div className="flex flex-col p-2">
      <h2 className="pb-3 text-title-sm">Notifications</h2>
      <ul className="flex flex-col">
        {notifications.map((item) => (
          <li key={item.id} className="flex items-start justify-between gap-3 border-t border-border py-3">
            <div className="min-w-0">
              <p className="text-body-sm text-foreground">{item.title}</p>
              <p className="text-caption text-data text-muted-foreground">{item.time}</p>
            </div>
            {item.unread && <span role="img" aria-label="Unread" className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />}
          </li>
        ))}
      </ul>
    </div>
  );
}

const reportError = () => toast.message("Error report opened", { description: "The app opens its report form here." });

function AccountMenu() {
  return (
    <Menu>
      <MenuTrigger aria-label="Account: Amara Osei" className="cursor-pointer rounded-full rovr-focus rovr-press">
        <Avatar name="Amara Osei" className="ring-2 ring-surface" />
      </MenuTrigger>
      <MenuContent align="end">
        <MenuItem>
          <Settings />
          Settings
        </MenuItem>
        <MenuItem>
          <LogOut />
          Sign out
        </MenuItem>
      </MenuContent>
    </Menu>
  );
}

function Body() {
  return (
    <>
      <Demo
        id="page-header-title"
        files={["patterns/page-header", "ui/button"]}
        title="Page title"
        note="The row at the top of a page: title and an optional description on the left, page-level actions on the right. A sub-page adds a round back button before the title."
        className="flex-col items-stretch gap-8"
      >
        <PageTitle
          title="Claims"
          description="1,284 claims submitted in the last 30 days"
          actions={
            <>
              <Button variant="secondary" size="sm">
                <RefreshCw />
                Refresh
              </Button>
              <Button variant="outline" size="sm">
                <Download />
                Export
              </Button>
            </>
          }
        />
        <PageTitle
          back={{ label: "Back to claims", onClick: () => toast.message("Back to claims") }}
          title="Claim CLM-2026-004871"
          description="Amara Osei, visit on 12 November 2026"
          actions={<Button size="sm">Start appeal</Button>}
        />
        <PageTitle title="Denials" />
      </Demo>
      <Demo
        id="page-header-inner"
        files={["patterns/page-header", "ui/popover", "ui/badge", "ui/button"]}
        title="Inner header"
        note="The bar of a page inside a section. It sticks to the top while the page scrolls: a back link named after the parent page on the left, extra content and the account cluster on the right."
        bare
        className="flex-col items-stretch"
      >
        <div className="h-72 overflow-y-auto rounded-xl border border-border bg-background px-4 pb-4">
          <InnerHeader
            backHref="#/page-header"
            backTitle="Action center"
            extra={
              <Badge tone="warning" className="mr-2">
                2 items due
              </Badge>
            }
            actions={<HeaderActions unread notifications={<NotificationList />} onReportError={reportError} />}
          />
          <div className="mt-4 flex flex-col gap-3">
            <h2 className="text-title-lg">Complete your intake form</h2>
            {[
              "Your first visit with Dr. Okafor is on Thursday 3 December at 10:30.",
              "The intake form takes about eight minutes. It covers your medical history, current medications and allergies.",
              "Your answers are saved as you go, so you can stop and come back.",
              "Bring a photo ID and your insurance card to the visit. If you uploaded them here, the front desk already has them.",
              "If you need to move the visit, do it at least 24 hours ahead so the time can go to someone else.",
              "Scroll this frame to see the header stay in place.",
            ].map((line) => (
              <p key={line} className="text-body text-muted-foreground">
                {line}
              </p>
            ))}
          </div>
        </div>
      </Demo>
      <Demo
        id="page-header-inner-variants"
        files={["patterns/page-header", "ui/button"]}
        title="Custom content and stacked"
        note="content replaces the back link with anything, such as a page name with a count. The stacked variant is the older header: the page name with the back link under it, and no actions."
        className="flex-col items-stretch gap-6"
      >
        <InnerHeader
          className="static"
          content={
            <div className="flex w-full min-w-0 items-baseline gap-2">
              <h2 className="truncate text-title-lg">Action center</h2>
              <span className="text-body-sm text-data text-muted-foreground">5 open</span>
            </div>
          }
          actions={<HeaderActions onReportError={reportError} />}
        />
        <div className="rounded-lg bg-surface-sunken">
          <InnerHeader variant="stacked" title="Health record" backTitle="Back to results" onBack={() => toast.message("Back to results")} />
        </div>
      </Demo>
      <Demo
        id="page-header-actions"
        files={["patterns/page-header", "ui/popover", "ui/avatar", "ui/menu", "ui/button", "ui/toast"]}
        title="Header actions"
        note="The cluster at the right end of a header: report an error, then the bell. unread shows a dot, or a count when it is a number. The bell opens the notifications popover. An account menu can follow the bell."
        className="flex-col items-end gap-4"
      >
        <HeaderActions onReportError={reportError} notifications={<NotificationList />} />
        <HeaderActions unread onReportError={reportError} notifications={<NotificationList />} />
        <HeaderActions unread={2} reportLabel="Report a problem" onReportError={reportError} notifications={<NotificationList />} account={<AccountMenu />} />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "page-header",
  title: "Page header",
  group: "Examples",
  summary:
    "The headers at the top of a page. PageTitle is from the provider app and replaces RcmPageTitle. InnerHeader and HeaderActions are from the patient app and replace ActionCenterInnerHeader, NewHeader and AccountHeaderIcon.",
  keywords: "title back button breadcrumb actions notifications bell report error account sticky toolbar",
  Body,
};
