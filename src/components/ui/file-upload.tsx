import * as React from "react";
import { FileText, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "./progress";

export interface UploadItem {
  id: string;
  name: string;
  /** Bytes */
  size: number;
  /** 0 to 100 while uploading; omit when done. */
  progress?: number;
  error?: string;
}

export interface FileUploadProps {
  /** Called with the chosen or dropped files. The caller owns the upload and the `items` list. */
  onFiles: (files: File[]) => void;
  items?: UploadItem[];
  onRemove?: (id: string) => void;
  accept?: string;
  multiple?: boolean;
  /** One line on what is accepted: "PDF, JPG or PNG, up to 10 MB each". */
  hint?: string;
  disabled?: boolean;
  className?: string;
}

const formatSize = (bytes: number) => (bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`);

/** Drop zone plus the list of files with progress and errors. Works by click and keyboard as well as drag. */
export function FileUpload({ onFiles, items = [], onRemove, accept, multiple = true, hint, disabled, className }: FileUploadProps) {
  const [over, setOver] = React.useState(false);
  const input = React.useRef<HTMLInputElement>(null);
  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setOver(false);
          if (!disabled) onFiles([...e.dataTransfer.files]);
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-border-strong px-6 py-7 text-center rovr-focus",
          "hover:border-primary hover:bg-accent/50 disabled:cursor-not-allowed disabled:opacity-50",
          over && "border-primary bg-accent",
        )}
      >
        <Upload className={cn("size-5 text-muted-foreground transition-[translate,color] duration-(--dur-base) ease-out", over && "-translate-y-0.5 text-primary")} aria-hidden />
        <span className="text-body">
          <span className="font-medium text-accent-foreground">Choose files</span> or drop them here
        </span>
        {hint && <span className="text-caption text-muted-foreground">{hint}</span>}
      </button>
      <input
        ref={input}
        type="file"
        hidden
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          if (e.target.files?.length) onFiles([...e.target.files]);
          e.target.value = "";
        }}
      />
      {items.length > 0 && (
        <ul className="flex flex-col divide-y divide-border rounded-lg border border-border">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-3 px-3 py-2.5">
              <FileText className={cn("size-4.5 shrink-0", item.error ? "text-destructive-fg" : "text-muted-foreground")} aria-hidden />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-baseline justify-between gap-3">
                  <span className="truncate text-body-sm font-medium">{item.name}</span>
                  <span className="shrink-0 text-caption text-muted-foreground text-data">
                    {item.progress !== undefined && !item.error ? `${Math.round(item.progress)}%` : formatSize(item.size)}
                  </span>
                </div>
                {item.error ? (
                  <span className="text-caption text-destructive-fg">{item.error}</span>
                ) : (
                  item.progress !== undefined && <Progress value={item.progress} size="sm" aria-label={`Uploading ${item.name}`} />
                )}
              </div>
              {onRemove && (
                <button
                  type="button"
                  aria-label={`Remove ${item.name}`}
                  onClick={() => onRemove(item.id)}
                  className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-full text-muted-foreground rovr-focus hover:bg-secondary hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
