import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function LoadingCard() {
  const [loading, setLoading] = React.useState(true);
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <Card variant="outline" aria-busy={loading}>
        {loading ? (
          <>
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-3.5 w-2/5" />
                <Skeleton className="h-3 w-3/5" />
              </div>
              <Skeleton className="h-6 w-20 rounded-full" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Avatar name="Dr. Ngozi Okafor" />
              <div className="min-w-0 flex-1">
                <p className="text-title-sm">Dr. Ngozi Okafor</p>
                <p className="text-body-sm text-muted-foreground">Internal medicine</p>
              </div>
              <Badge tone="success">Confirmed</Badge>
            </div>
            <p className="text-body-sm text-muted-foreground">Follow-up visit on Thursday 3 December at 10:30 to review your lipid panel.</p>
          </>
        )}
      </Card>
      <Button variant="secondary" size="sm" className="w-fit" onClick={() => setLoading((l) => !l)}>
        {loading ? "Show loaded" : "Show loading"}
      </Button>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="skeleton-shapes" files={["ui/skeleton"]} title="Shapes" note="A skeleton has no size of its own. Give it the height, width and radius of the thing it stands in for: a line of text, an avatar, a tag, an image.">
        <Skeleton className="h-3.5 w-40" />
        <Skeleton className="size-10 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-20 w-36 rounded-lg" />
      </Demo>
      <Demo id="skeleton-text" files={["ui/skeleton"]} title="Text" note="Vary the line widths and end on a short one, so it reads as a paragraph and not a block." className="flex-col items-stretch gap-2.5">
        <Skeleton className="mb-2 h-5 w-1/3" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-11/12" />
        <Skeleton className="h-3 w-3/5" />
      </Demo>
      <Demo id="skeleton-list" files={["ui/skeleton"]} title="List rows" note="Repeat the row shape a few times. Three or four rows are enough to say a list is coming." className="flex-col items-stretch gap-4">
        {["w-2/5", "w-1/2", "w-1/3"].map((width) => (
          <div key={width} className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className={`h-3.5 ${width}`} />
              <Skeleton className="h-3 w-3/5" />
            </div>
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </Demo>
      <Demo id="skeleton-matching-content" files={["ui/skeleton", "ui/card", "ui/avatar", "ui/badge", "ui/button"]} title="Matching the content" note="The skeleton takes the layout of what is coming, so nothing jumps when it arrives. Skeletons are hidden from screen readers; mark the container aria-busy." className="items-start">
        <LoadingCard />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "skeleton",
  title: "Skeleton",
  group: "Components",
  summary: "A shimmering placeholder with the shape of the content it stands in for. Use it while a page, card or list is loading; use Spinner for a short wait on an action.",
  keywords: "loading placeholder shimmer ghost content loader",
  Body,
};
