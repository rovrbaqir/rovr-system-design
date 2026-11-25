import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HeaderBarCard, InnerCard, KeyValueList, SectionCard } from "@/components/patterns/section-card";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Coverage({ plan, memberId, status }: { plan: string; memberId: string; status: "Active" | "Pending" }) {
  return (
    <InnerCard className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-label">{plan}</p>
        <p className="font-mono text-caption text-muted-foreground">{memberId}</p>
      </div>
      <Badge tone={status === "Active" ? "success" : "warning"}>{status}</Badge>
    </InnerCard>
  );
}

function Body() {
  return (
    <>
      <Demo
        id="section-card-nesting"
        files={["patterns/section-card", "ui/card", "ui/badge"]}
        title="Outer and inner"
        note="SectionCard is the outer surface. InnerCard is the quieter step inside it, one per record. Both pad 12px, and the caller sets the layout between them."
        bare
        className="items-stretch"
      >
        <SectionCard className="flex min-w-64 flex-1 flex-col gap-3">
          <Coverage plan="Blue Shield PPO" memberId="XEA904417726" status="Active" />
          <Coverage plan="Delta Dental Premier" memberId="DD-20418831" status="Active" />
          <Coverage plan="VSP Choice" memberId="VSP-7719024" status="Pending" />
        </SectionCard>
      </Demo>
      <Demo
        id="section-card-variants"
        files={["patterns/section-card", "ui/card"]}
        title="Variants"
        note="default floats on the page. lighter is an outline, for a section inside a busy page. darker is tinted, and the inner cards inside it turn white."
        bare
        className="items-stretch"
      >
        {(["default", "lighter", "darker"] as const).map((variant) => (
          <SectionCard key={variant} variant={variant} className="flex min-w-52 flex-1 flex-col gap-3">
            <InnerCard>
              <p className="text-caption text-muted-foreground">Lipid panel</p>
              <p className="text-label">Resulted 12 Nov 2026</p>
            </InnerCard>
            <InnerCard>
              <p className="text-caption text-muted-foreground">Chest X-ray, 2 views</p>
              <p className="text-label">Ordered 18 Nov 2026</p>
            </InnerCard>
          </SectionCard>
        ))}
      </Demo>
      <Demo
        id="section-card-title"
        files={["patterns/section-card", "ui/card", "ui/button", "ui/badge"]}
        title="Title row"
        note="Pass title for a heading on the left and aside for a link or a note on the right. The content sits in a column under the row."
        bare
        className="items-stretch"
      >
        <SectionCard
          className="max-w-xl flex-1"
          title="Insurance"
          aside={
            <Button variant="link" size="sm">
              Add coverage
            </Button>
          }
        >
          <Coverage plan="Blue Shield PPO" memberId="XEA904417726" status="Active" />
          <Coverage plan="Delta Dental Premier" memberId="DD-20418831" status="Active" />
        </SectionCard>
      </Demo>
      <Demo
        id="section-card-header-bar"
        files={["patterns/section-card", "ui/card", "ui/description-list", "ui/button"]}
        title="Header bar"
        note="HeaderBarCard puts the title and an optional description on a tinted bar, with aside on the right. The body is a padded column. KeyValueList fills it with label and value rows."
        bare
        className="items-stretch"
      >
        <HeaderBarCard
          className="max-w-xl flex-1"
          title="Claim details"
          description="Professional claim, CMS-1500"
          aside={
            <Button variant="link" size="sm">
              Open Claims Center
              <ArrowUpRight aria-hidden />
            </Button>
          }
        >
          <KeyValueList
            items={[
              { label: "Claim number", value: "CLM-2026-004417", mono: true },
              { label: "Patient", value: "Amara Osei" },
              { label: "Payer", value: "Blue Shield of California" },
              { label: "Rendering provider NPI", value: "1467592038", mono: true, hint: "Box 24J" },
              { label: "Date of service", value: "12 Nov 2026", hint: "Box 24A" },
              { label: "Billed amount", value: "$248.00" },
              { label: "Prior authorization", value: "", hint: "Box 23" },
            ]}
          />
        </HeaderBarCard>
      </Demo>
      <Demo
        id="section-card-loading"
        files={["patterns/section-card", "ui/card", "ui/skeleton"]}
        title="Loading and flush body"
        note="title, description and aside take any content, so a skeleton keeps the bar's shape while data loads. Pass bodyClassName p-0 gap-0 for rows that run to the card's edge."
        bare
        className="items-stretch"
      >
        <HeaderBarCard
          className="max-w-xl flex-1"
          title={<Skeleton className="my-0.5 h-4 w-40" />}
          description={<Skeleton className="mt-1.5 h-3 w-24" />}
          aside={<Skeleton className="h-7 w-28 rounded-full" />}
          bodyClassName="gap-0 p-0"
        >
          <div role="status" aria-busy aria-label="Loading claims">
            {[0, 1, 2, 3].map((row) => (
              <div key={row} className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 last:border-b-0">
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-1/2" />
                  <Skeleton className="h-2.5 w-1/3" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
            ))}
          </div>
        </HeaderBarCard>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "section-card",
  title: "Section card",
  group: "Examples",
  summary:
    "The surfaces a page section is built from: an outer card, the inner cards nested in it, and a card with a header bar. Provider app and patient app. Replaces CardWrapper, InnerCardWrapper, SectionCard, RcmSectionCard and RcmKeyValueList.",
  keywords: "card wrapper inner card surface section header bar rcm key value panel container",
  Body,
};
