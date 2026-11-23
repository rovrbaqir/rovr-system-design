import * as React from "react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/ui/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { SearchInput } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { Toggle, ToggleGroup } from "@/components/ui/toggle-group";
import { Demo } from "../kit";
import type { DocPage } from "../types";

interface Claim {
  id: string;
  patient: string;
  payer: string;
  service: string;
  billed: number;
  status: "Paid" | "Submitted" | "Denied" | "In review";
}
const claims: Claim[] = [
  { id: "CL-48213", patient: "Amara Osei", payer: "Aetna", service: "2026-11-12", billed: 240, status: "Paid" },
  { id: "CL-48219", patient: "Daniel Reyes", payer: "Blue Shield", service: "2026-11-13", billed: 185.5, status: "Submitted" },
  { id: "CL-48224", patient: "Priya Raman", payer: "Cigna", service: "2026-11-13", billed: 420, status: "Denied" },
  { id: "CL-48230", patient: "Tomás Lindqvist", payer: "UnitedHealthcare", service: "2026-11-14", billed: 96, status: "In review" },
  { id: "CL-48236", patient: "Grace Mbeki", payer: "Aetna", service: "2026-11-17", billed: 310.25, status: "Paid" },
  { id: "CL-48241", patient: "Noah Feldman", payer: "Medicare", service: "2026-11-18", billed: 154, status: "Submitted" },
  { id: "CL-48247", patient: "Sofia Marchetti", payer: "Cigna", service: "2026-11-19", billed: 275, status: "Paid" },
  { id: "CL-48252", patient: "Jun Watanabe", payer: "Blue Shield", service: "2026-11-20", billed: 88.75, status: "In review" },
];
const claimTone = { Paid: "success", Submitted: "info", Denied: "danger", "In review": "warning" } as const;
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const shortDate = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

const claimColumns: DataTableColumn<Claim>[] = [
  { id: "id", header: "Claim", cell: (r) => <span className="font-mono text-[0.8125rem]">{r.id}</span>, sortValue: (r) => r.id, hideable: false },
  { id: "patient", header: "Patient", cell: (r) => <span className="font-medium">{r.patient}</span>, sortValue: (r) => r.patient },
  { id: "payer", header: "Payer", cell: (r) => r.payer, sortValue: (r) => r.payer },
  { id: "service", header: "Service date", cell: (r) => shortDate.format(new Date(`${r.service}T12:00:00`)), sortValue: (r) => r.service, className: "text-data" },
  { id: "billed", header: "Billed", cell: (r) => money.format(r.billed), sortValue: (r) => r.billed, numeric: true },
  {
    id: "status",
    header: "Status",
    cell: (r) => (
      <Badge tone={claimTone[r.status]} variant="status">
        {r.status}
      </Badge>
    ),
    sortValue: (r) => r.status,
  },
];

const statuses = ["Paid", "Submitted", "In review", "Denied"] as const;

function SortableClaims() {
  // Columns: { id, header, cell, sortValue?, numeric?, hideable?, className? }.
  // A column sorts when it has sortValue. hideable: false keeps it out of the Columns menu.
  return <DataTable caption="Claims" columns={claimColumns} rows={claims.slice(0, 5)} rowId={(r) => r.id} />;
}

function SelectableClaims() {
  const [ids, setIds] = React.useState<string[]>([]);
  return (
    <DataTable
      caption="Claims"
      columns={claimColumns}
      rows={claims}
      rowId={(r) => r.id}
      pageSize={4}
      onSelectionChange={setIds}
      toolbar={
        <>
          <Button size="sm" variant="secondary" disabled={ids.length === 0} onClick={() => toast.success(`${ids.length} ${ids.length === 1 ? "claim" : "claims"} resubmitted`)}>
            Resubmit
          </Button>
          <span className="text-body-sm text-muted-foreground text-data">{ids.length === 0 ? "Select claims to resubmit them" : `${ids.length} selected`}</span>
        </>
      }
    />
  );
}

function ClickableClaims() {
  return (
    <DataTable
      caption="Claims"
      columns={claimColumns}
      rows={claims.slice(0, 4)}
      rowId={(r) => r.id}
      onRowClick={(r) => toast.message(`Opened ${r.id}`, { description: `${r.patient} · ${r.payer} · ${money.format(r.billed)}` })}
    />
  );
}

function ClaimsTable() {
  const [query, setQuery] = React.useState("");
  const [status, setStatus] = React.useState<string[]>([]);
  const rows = claims.filter((c) => `${c.patient} ${c.id} ${c.payer}`.toLowerCase().includes(query.toLowerCase()) && (status.length === 0 || status.includes(c.status)));
  const clear = () => {
    setQuery("");
    setStatus([]);
  };
  return (
    <DataTable
      caption="Claims"
      columns={claimColumns}
      rows={rows}
      rowId={(r) => r.id}
      pageSize={5}
      onSelectionChange={() => {}}
      toolbar={
        <>
          <SearchInput size="sm" aria-label="Filter claims" placeholder="Patient, claim or payer" value={query} onValueChange={setQuery} className="max-w-64" />
          <ToggleGroup multiple value={status} onValueChange={setStatus} aria-label="Status">
            {statuses.map((s) => (
              <Toggle key={s} value={s} className="h-control-sm">
                {s}
              </Toggle>
            ))}
          </ToggleGroup>
        </>
      }
      empty={
        <EmptyState
          icon={<Search />}
          title="No claims match"
          description="Nothing fits this search and status. Loosen one of them to see more."
          action={
            <Button size="sm" variant="outline" onClick={clear}>
              Clear filters
            </Button>
          }
        />
      }
    />
  );
}

function Body() {
  return (
    <>
      <Demo id="data-table-sorting" files={["ui/data-table", "ui/badge"]} title="Sorting and columns" note="Click a header to sort ascending, again for descending, a third time to clear. The Columns menu hides any column except the ones marked hideable: false, here the claim number." className="items-start">
        <div data-density="compact" className="w-full">
          <SortableClaims />
        </div>
      </Demo>
      <Demo id="data-table-selection" files={["ui/data-table", "ui/button", "ui/toast"]} title="Selection and pagination" note="Pass onSelectionChange to get row checkboxes; the header checkbox selects the page. Pass pageSize to paginate. The selection is kept across pages and counted in the footer." className="items-start">
        <div data-density="compact" className="w-full">
          <SelectableClaims />
        </div>
      </Demo>
      <Demo id="data-table-row-click" files={["ui/data-table", "ui/toast"]} title="Clickable rows" note="With onRowClick the whole row is the target. Click a claim." className="items-start">
        <div data-density="compact" className="w-full">
          <ClickableClaims />
        </div>
      </Demo>
      <Demo id="data-table-toolbar" files={["ui/data-table", "ui/input", "ui/toggle-group", "ui/empty-state", "ui/button"]} title="Toolbar and empty state" note="Type in the search or toggle a status. The table resizes in one smooth move, rows that stay do not move or flicker, and new rows fade in. Search for something that is not there to see the empty state." className="items-start">
        <div data-density="compact" className="w-full">
          <ClaimsTable />
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "data-table",
  title: "Data table",
  group: "Components",
  summary: "A table that sorts, hides columns, selects rows and paginates, with a toolbar slot and an empty state. Use it for any list of records people work through; it replaces the hand-written tables in the provider app.",
  keywords: "grid sort filter columns selection checkbox pagination toolbar claims records",
  Body,
};
