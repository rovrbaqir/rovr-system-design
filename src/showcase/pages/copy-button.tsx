import { CopyButton } from "@/components/ui/copy-button";
import { Input } from "@/components/ui/input";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Body() {
  return (
    <>
      <Demo id="copy-button-basic" files={["ui/copy-button"]} title="Inline" note="Press it: the icon swaps to a tick for two seconds and the accessible name changes to Copied. label is required because the button has no text." className="flex-col items-start">
        <span className="flex items-center gap-1 text-body">
          Member ID <span className="font-mono">RVR-2041-88317</span>
          <CopyButton value="RVR-2041-88317" label="Copy member ID" />
        </span>
        <span className="flex items-center gap-1 text-body">
          MRN <span className="font-mono">20418</span>
          <CopyButton value="20418" label="Copy MRN" />
        </span>
      </Demo>
      <Demo id="copy-button-variants" files={["ui/copy-button", "ui/button"]} title="Variants and sizes" note="It takes every Button variant and size. Ghost and small icon are the defaults.">
        <CopyButton value="CL-48213" label="Copy claim number" />
        <CopyButton value="CL-48213" label="Copy claim number" variant="secondary" />
        <CopyButton value="CL-48213" label="Copy claim number" variant="outline" size="icon-md" />
        <CopyButton value="CL-48213" label="Copy claim number" disabled />
      </Demo>
      <Demo id="copy-button-in-field" files={["ui/copy-button", "ui/input"]} title="Next to a field" note="For a value people need elsewhere, such as a video visit link." className="items-start">
        <div className="flex w-full max-w-md items-center gap-2">
          <Input readOnly aria-label="Video visit link" defaultValue="https://visit.rovr.health/j/okafor-1203-1030" className="font-mono" />
          <CopyButton value="https://visit.rovr.health/j/okafor-1203-1030" label="Copy video visit link" variant="secondary" size="icon-md" />
        </div>
      </Demo>
      <Demo id="copy-button-list" files={["ui/copy-button"]} title="In a details list" note="One button per value, at the end of the row." className="items-start">
        <dl className="grid w-full max-w-sm grid-cols-[auto_1fr_auto] items-center gap-x-4 gap-y-1 text-body">
          <dt className="text-muted-foreground">Claim</dt>
          <dd className="font-mono">CL-48213</dd>
          <CopyButton value="CL-48213" label="Copy claim number" />
          <dt className="text-muted-foreground">Payer ID</dt>
          <dd className="font-mono">60054</dd>
          <CopyButton value="60054" label="Copy payer ID" />
          <dt className="text-muted-foreground">NPI</dt>
          <dd className="font-mono">1487650392</dd>
          <CopyButton value="1487650392" label="Copy NPI" />
        </dl>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "copy-button",
  title: "Copy button",
  group: "Components",
  summary: "Copies a value to the clipboard and confirms in place. Put it beside identifiers people paste elsewhere: MRNs, member IDs, claim numbers, links.",
  keywords: "clipboard copy to clipboard paste",
  Body,
};
