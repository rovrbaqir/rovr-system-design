import { FileUpload, type UploadItem } from "@/components/ui/file-upload";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const done: UploadItem = { id: "1", name: "lipid-panel-2026-11-12.pdf", size: 286_000 };
const uploading: UploadItem = { id: "2", name: "referral-letter-cardiology.pdf", size: 1_840_000, progress: 62 };
const failed: UploadItem = { id: "3", name: "insurance-card-front.heic", size: 12_400_000, error: "Too large. Files can be up to 10 MB." };
const noop = () => {};

export const spec: ComponentSpec = {
  slug: "file-upload",
  sections: [
    matrix({
      title: "File upload",
      note: "The drop zone. hint is one line on what is accepted. Dragging a file over the zone looks like hover with a stronger fill.",
      rows: axis("hint", ["false", "true"]),
      states: ["default", "hover", "focus", "disabled"],
      render: (p, s) => (
        <div className="w-80">
          <FileUpload onFiles={noop} disabled={s.disabled} hint={p.hint === "true" ? "PDF, JPG or PNG, up to 10 MB each" : undefined} />
        </div>
      ),
    }),
    matrix({
      title: "File upload item",
      note: "One row of the file list under the drop zone. progress runs from 0 to 100 while uploading, and error replaces the bar.",
      rows: axis("status", ["uploading", "done", "error"]),
      groups: axis("removable", ["true", "false"]),
      states: ["default"],
      render: (p) => (
        <div className="w-80 [&>div>button]:hidden">
          <FileUpload onFiles={noop} items={[p.status === "uploading" ? uploading : p.status === "error" ? failed : done]} onRemove={p.removable === "true" ? noop : undefined} />
        </div>
      ),
    }),
    list({
      title: "With files",
      note: "The caller owns the list of files and the upload itself.",
      items: [
        {
          label: "Mixed list",
          code: "<FileUpload items={items} onRemove={remove} />",
          render: () => (
            <div className="w-96">
              <FileUpload onFiles={noop} onRemove={noop} hint="Lab reports and referral letters, up to 10 MB each" items={[done, uploading, failed]} />
            </div>
          ),
        },
        {
          label: "Disabled with a file",
          code: "<FileUpload disabled items={items} />",
          render: () => (
            <div className="w-96">
              <FileUpload disabled onFiles={noop} hint="Uploads are closed while your claim is in review" items={[{ id: "1", name: "claim-CL-48224-appeal.pdf", size: 286_000 }]} />
            </div>
          ),
        },
      ],
    }),
  ],
};
