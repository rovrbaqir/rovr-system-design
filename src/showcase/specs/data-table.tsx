import * as React from "react";
import { FileSearch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/input";
import { type ComponentSpec, axis, matrix } from "./kit";

interface Claim {
  id: string;
  patient: string;
  payer: string;
  billed: number;
  status: "Paid" | "Submitted" | "Denied" | "In review";
}
const claims: Claim[] = [
  { id: "CL-48213", patient: "Amara Osei", payer: "Aetna", billed: 240, status: "Paid" },
  { id: "CL-48219", patient: "Daniel Reyes", payer: "Blue Shield", billed: 185.5, status: "Submitted" },
  { id: "CL-48224", patient: "Priya Raman", payer: "Cigna", billed: 420, status: "Denied" },
  { id: "CL-48230", patient: "Tomás Lindqvist", payer: "UnitedHealthcare", billed: 96, status: "In review" },
  { id: "CL-48236", patient: "Grace Mbeki", payer: "Aetna", billed: 310.25, status: "Paid" },
  { id: "CL-48241", patient: "Noah Feldman", payer: "Medicare", billed: 154, status: "Submitted" },
  { id: "CL-48247", patient: "Sofia Marchetti", payer: "Cigna", billed: 275, status: "Paid" },
  { id: "CL-48252", patient: "Jun Watanabe", payer: "Blue Shield", billed: 88.75, status: "In review" },
];
const claimTone = { Paid: "success", Submitted: "info", Denied: "danger", "In review": "warning" } as const;
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

const columns: DataTableColumn<Claim>[] = [
  { id: "id", header: "Claim", cell: (r) => <span className="font-mono text-[0.8125rem]">{r.id}</span>, sortValue: (r) => r.id, hideable: false },
  { id: "patient", header: "Patient", cell: (r) => <span className="font-medium">{r.patient}</span>, sortValue: (r) => r.patient },
  { id: "payer", header: "Payer", cell: (r) => r.payer, sortValue: (r) => r.payer },
  { id: "billed", header: "Billed", cell: (r) => money.format(r.billed), sortValue: (r) => r.billed, numeric: true },
  {
    id: "status",
    header: "Status",
    cell: (r) => (
      <Badge tone={claimTone[r.status]} variant="status">
        {r.status}
      </Badge>
    ),
  },
];
// One sortable column each, so the header button is easy to point at.
const headerColumns: Record<string, DataTableColumn<Claim>[]> = {
  false: [
    { id: "patient", header: "Patient", cell: (r) => <span className="font-medium">{r.patient}</span>, sortValue: (r) => r.patient },
    { id: "billed", header: "Billed", cell: (r) => money.format(r.billed), numeric: true },
  ],
  true: [
    { id: "patient", header: "Patient", cell: (r) => <span className="font-medium">{r.patient}</span> },
    { id: "billed", header: "Billed", cell: (r) => money.format(r.billed), sortValue: (r) => r.billed, numeric: true },
  ],
};

const rowId = (r: Claim) => r.id;
const noop = () => {};

/** DataTable keeps sort and selection to itself, so the sheet clicks its way to those states once, on mount. */
function Clicked({ clicks, className, children }: { clicks: readonly string[]; className?: string; children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const done = React.useRef(false);
  React.useEffect(() => {
    if (done.current) return;
    done.current = true;
    for (const selector of clicks) ref.current?.querySelector<HTMLElement>(selector)?.click();
  }, [clicks]);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

const NONE: readonly string[] = [];
const sortPatient = ["thead th:nth-child(2) button"] as const;
const selection: Record<string, readonly string[]> = { none: NONE, some: ["tbody tr:nth-child(2) [role=checkbox]"], all: ["thead [role=checkbox]"] };
const sortClicks: Record<string, readonly string[]> = { ascending: ["thead button"], descending: ["thead button", "thead button"] };

export const spec: ComponentSpec = {
  slug: "data-table",
  sections: [
    matrix({
      title: "Data table",
      note: "toolbar holds filters and search at the start of the row above the table; the Columns menu is always at the end. sorted is the Patient column, ascending.",
      rows: axis("toolbar", ["false", "true"]),
      states: ["default", "sorted", "empty"],
      render: (p, s) => (
        <Clicked clicks={s.is("sorted") ? sortPatient : NONE} className="w-[40rem]">
          <DataTable
            caption="Claims"
            columns={columns}
            rows={s.is("empty") ? [] : claims.slice(0, 4)}
            rowId={rowId}
            toolbar={p.toolbar === "true" ? <SearchInput value="" onValueChange={noop} size="sm" aria-label="Search claims" placeholder="Search claims" className="w-56" /> : undefined}
            empty={<EmptyState icon={<FileSearch />} title="No claims match" description="Try a different patient name or clear the status filter." />}
          />
        </Clicked>
      ),
    }),
    matrix({
      title: "Data table selection",
      note: "onSelectionChange adds the checkbox column. pageSize adds the footer with the count and the pagination.",
      rows: axis("selected", ["none", "some", "all"]),
      states: ["default"],
      render: (p) => (
        <Clicked clicks={selection[p.selected]} className="w-[40rem]">
          <DataTable caption="Claims" columns={columns} rows={claims} rowId={rowId} pageSize={4} onSelectionChange={noop} />
        </Clicked>
      ),
    }),
    matrix({
      title: "Column header",
      note: "A column with sortValue gets a header button. The arrows show on hover and focus, and stay while the column is sorted. Numeric columns align right with the arrow before the label.",
      rows: axis("numeric", ["false", "true"]),
      states: ["default", "hover", "focus", "pressed", "ascending", "descending"],
      target: "thead button",
      render: (p, s) => (
        <Clicked clicks={sortClicks[s.name] ?? NONE} className="w-64">
          <DataTable caption="Claims" columns={headerColumns[p.numeric]} rows={claims.slice(0, 2)} rowId={rowId} />
        </Clicked>
      ),
    }),
    matrix({
      title: "Data table row",
      note: "onRowClick makes the whole row a target. Rows highlight on hover.",
      rows: axis("onRowClick", ["false", "true"]),
      states: ["default", "hover"],
      target: "tbody tr",
      render: (p) => (
        <div className="w-[40rem]">
          <DataTable caption="Claims" columns={columns} rows={claims.slice(0, 1)} rowId={rowId} onRowClick={p.onRowClick === "true" ? noop : undefined} />
        </div>
      ),
    }),
  ],
};
