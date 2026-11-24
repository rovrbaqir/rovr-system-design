import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { type DemoSource, highlight, loadDemoSource } from "./source";

const tokenColor = {
  comment: "text-subtle-foreground italic",
  string: "text-(--chart-2)",
  keyword: "text-(--chart-4)",
  tag: "text-accent-foreground",
  number: "text-(--chart-3)",
} as const;

/** Copies a whole file and says so in words, for two seconds. */
function CopyFile({ code, name }: { code: string; name: string }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <Button
      variant="secondary"
      size="sm"
      className="shrink-0"
      aria-label={copied ? `Copied ${name}` : `Copy ${name}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(code);
          setCopied(true);
        } catch {
          setCopied(false);
        }
      }}
    >
      {copied ? <Check className="text-success-fg" /> : <Copy />}
      {copied ? "Copied" : "Copy"}
    </Button>
  );
}

/** The source behind a demo: one tab per file, the file's path, and a button that copies the whole file. */
function CodeView({ id, files }: { id: string; files: string[] }) {
  const [source, setSource] = React.useState<DemoSource | null>(null);
  const [failed, setFailed] = React.useState(false);
  const [active, setActive] = React.useState(0);
  React.useEffect(() => {
    let alive = true;
    loadDemoSource(id, files)
      .then((s) => alive && setSource(s))
      .catch(() => alive && setFailed(true));
    return () => {
      alive = false;
    };
  }, [id, files]);
  const file = source?.files[active];
  const tokens = React.useMemo(() => (file ? highlight(file.code) : []), [file]);

  if (failed) return <p className="rounded-xl rovr-risen p-6 text-body-sm text-muted-foreground">We couldn't load the source for this example.</p>;
  if (!source || !file) return <Skeleton className="h-72 w-full rounded-xl" role="status" aria-busy aria-label="Loading source" />;
  const install = source.packages.length > 0 ? `pnpm add ${source.packages.join(" ")}` : null;

  return (
    <div className="flex min-w-0 flex-col overflow-hidden rounded-xl rovr-risen">
      <div className="flex gap-1.5 overflow-x-auto border-b border-border p-3 [scrollbar-width:none]" role="tablist" aria-label="Files">
        {source.files.map((f, i) => (
          <button
            key={f.path}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            className={cn(
              "h-8 shrink-0 cursor-pointer rounded-full px-3.5 font-mono text-[0.75rem] whitespace-nowrap rovr-focus rovr-press",
              i === active ? "bg-accent font-medium text-accent-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )}
          >
            {f.name}
          </button>
        ))}
      </div>
      <div className="flex items-center justify-between gap-3 px-5 pt-3">
        <p className="min-w-0 truncate font-mono text-[0.75rem] text-muted-foreground">
          {file.name === "Usage" ? "How this example is written" : `src/${file.path}`}
        </p>
        <CopyFile key={file.path} code={file.code} name={file.name} />
      </div>
      {/* Focusable because it scrolls: keyboard users must be able to reach the code. */}
      <pre tabIndex={0} className="max-h-[32rem] overflow-auto p-5 pt-3 font-mono text-[0.8125rem] leading-relaxed rovr-focus">
        <code>
          {tokens.map((t, i) =>
            t.kind ? (
              <span key={i} className={tokenColor[t.kind]}>
                {t.text}
              </span>
            ) : (
              t.text
            ),
          )}
        </code>
      </pre>
      {install && file.name !== "Usage" && file.name !== "rovr.css" && (
        <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
          <p className="min-w-0 truncate font-mono text-[0.75rem] text-muted-foreground">{install}</p>
          <CopyButton value={install} label="Copy install command" className="shrink-0" />
        </div>
      )}
    </div>
  );
}

export function Demo({
  id,
  files,
  title,
  note,
  children,
  className,
  bare,
}: {
  /** Names this example in the showcase source, so its code can be shown. Set together with `files`. */
  id?: string;
  /** The component files this example is built from, e.g. `["ui/button"]`. Enables the Code view. */
  files?: string[];
  title: string;
  note?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bare?: boolean;
}) {
  const [view, setView] = React.useState<"preview" | "code">("preview");
  const hasCode = !!id && !!files && files.length > 0;
  return (
    <div className="grid grid-cols-1 gap-x-10 gap-y-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
      <div className="flex flex-col items-start gap-1.5">
        <h3 className="text-title-md">{title}</h3>
        {note && <p className="text-body-sm text-muted-foreground">{note}</p>}
        {hasCode && (
          <div data-demo-switch className="contents">
          <SegmentedControl<"preview" | "code">
            size="sm"
            aria-label={`${title}: preview or code`}
            className="mt-2"
            value={view}
            onValueChange={setView}
            options={[
              { value: "preview", label: "Preview" },
              { value: "code", label: "Code" },
            ]}
          />
          </div>
        )}
      </div>
      {/* The preview stays mounted while the code is shown, so its state survives switching back. */}
      <div
        // Read by the Figma export (figma/README.md) to find each example.
        data-figma-demo={id ?? title}
        data-figma-title={title}
        data-figma-note={typeof note === "string" ? note : undefined}
        className={cn(!bare && "rounded-xl rovr-risen p-6", "flex min-w-0 flex-wrap items-center gap-3", className, view === "code" && "hidden")}
      >
        {children}
      </div>
      {hasCode && view === "code" && <CodeView id={id} files={files} />}
    </div>
  );
}

export function Token({ children }: { children: React.ReactNode }) {
  return <code className="rounded-xs bg-secondary px-1.5 py-0.5 font-mono text-[0.75rem]">{children}</code>;
}
