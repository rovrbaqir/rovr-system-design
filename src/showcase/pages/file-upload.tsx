import * as React from "react";
import { FileUpload, type UploadItem } from "@/components/ui/file-upload";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Uploads() {
  const [items, setItems] = React.useState<UploadItem[]>([
    { id: "1", name: "insurance-card-front.jpg", size: 1_840_000 },
    { id: "2", name: "referral-letter.pdf", size: 412_000, progress: 62 },
    { id: "3", name: "mri-report.dcm", size: 48_200_000, error: "This file type is not supported. Upload a PDF, JPG or PNG." },
  ]);
  return (
    <FileUpload
      hint="PDF, JPG or PNG, up to 10 MB each"
      accept=".pdf,.jpg,.jpeg,.png"
      items={items}
      onRemove={(id) => setItems((list) => list.filter((i) => i.id !== id))}
      onFiles={(files) => setItems((list) => [...list, ...files.map((f, i) => ({ id: `${Date.now()}-${i}`, name: f.name, size: f.size }))])}
    />
  );
}

function SimulatedUpload() {
  const [items, setItems] = React.useState<UploadItem[]>([]);
  const limit = 10 * 1024 * 1024;
  const start = (files: File[]) => {
    const added = files.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      size: f.size,
      ...(f.size > limit ? { error: "This file is larger than 10 MB. Export it at a lower quality and try again." } : { progress: 0 }),
    }));
    setItems((list) => [...list, ...added]);
    for (const item of added) {
      if ("error" in item) continue;
      const timer = setInterval(() => {
        setItems((list) =>
          list.map((x) => {
            if (x.id !== item.id || x.progress === undefined) return x;
            const next = x.progress + 20;
            if (next < 100) return { ...x, progress: next };
            clearInterval(timer);
            return { id: x.id, name: x.name, size: x.size };
          }),
        );
      }, 350);
    }
  };
  return <FileUpload hint="Lab reports and referral letters, up to 10 MB each" items={items} onFiles={start} onRemove={(id) => setItems((list) => list.filter((i) => i.id !== id))} />;
}

function SingleFile() {
  const [items, setItems] = React.useState<UploadItem[]>([]);
  return (
    <FileUpload
      multiple={false}
      accept="image/*"
      hint="One photo of the front of your insurance card"
      items={items}
      onFiles={(files) => setItems(files.slice(0, 1).map((f) => ({ id: f.name, name: f.name, size: f.size })))}
      onRemove={() => setItems([])}
    />
  );
}

function Body() {
  return (
    <>
      <Demo id="file-upload-states" files={["ui/file-upload"]} title="File states" note="A finished file shows its size, an uploading file shows progress, and a failed file says what to upload instead." className="items-start">
        <Uploads />
      </Demo>
      <Demo id="file-upload-progress" files={["ui/file-upload"]} title="Upload progress" note="The component does not upload anything itself. onFiles hands you the files and you own the items list. Choose a file to watch a simulated upload." className="items-start">
        <SimulatedUpload />
      </Demo>
      <Demo id="file-upload-single" files={["ui/file-upload"]} title="One file" note="Set multiple to false and replace the list each time. accept limits what the file dialog offers." className="items-start">
        <SingleFile />
      </Demo>
      <Demo id="file-upload-disabled" files={["ui/file-upload"]} title="Disabled" note="Without onRemove, files in the list cannot be removed." className="items-start">
        <FileUpload disabled hint="Uploads are closed while your claim is in review" onFiles={() => {}} items={[{ id: "1", name: "claim-CL-48224-appeal.pdf", size: 286_000 }]} />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "file-upload",
  title: "File upload",
  group: "Components",
  summary: "A drop zone and a list of the files added, with progress and errors per file. It works by click and keyboard as well as drag, and leaves the upload itself to you.",
  keywords: "dropzone drag and drop attachment document upload files",
  Body,
};
