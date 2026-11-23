import * as React from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown, Columns3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Menu, MenuCheckboxItem, MenuContent, MenuLabel, MenuTrigger } from "./menu";
import { Pagination } from "./pagination";
import { SmoothHeight } from "./smooth-height";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export interface DataTableColumn<Row> {
  id: string;
  header: string;
  cell: (row: Row) => React.ReactNode;
  /** Provide to make the column sortable. */
  sortValue?: (row: Row) => string | number;
  numeric?: boolean;
  /** Set false to keep the column out of the column picker. */
  hideable?: boolean;
  className?: string;
}

export interface DataTableProps<Row> {
  columns: DataTableColumn<Row>[];
  rows: Row[];
  rowId: (row: Row) => string;
  /** Rows per page. Omit to show every row. */
  pageSize?: number;
  /** Enables row checkboxes and reports the selected ids. */
  onSelectionChange?: (ids: string[]) => void;
  onRowClick?: (row: Row) => void;
  /** Filters, search and bulk actions, shown above the table at the start of the toolbar. */
  toolbar?: React.ReactNode;
  /** Shown in place of the rows when there are none. Use EmptyState. */
  empty?: React.ReactNode;
  caption?: string;
  className?: string;
}

type Sort = { id: string; dir: "asc" | "desc" } | null;

/** Table with sorting, a column picker, row selection and pagination. For static tables use Table. */
export function DataTable<Row>({ columns, rows, rowId, pageSize, onSelectionChange, onRowClick, toolbar, empty, caption, className }: DataTableProps<Row>) {
  const [sort, setSort] = React.useState<Sort>(null);
  const [hidden, setHidden] = React.useState<Set<string>>(new Set());
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [page, setPage] = React.useState(1);
  // Ids shown in the previous render. A row that was not there fades in;
  // rows that stay are left completely alone, so nothing flickers.
  const seen = React.useRef<Set<string> | null>(null);
  // When each row arrived, so a second keystroke mid-fade does not cut the fade short.
  const arrived = React.useRef(new Map<string, number>());

  const visible = columns.filter((c) => !hidden.has(c.id));
  const sorted = React.useMemo(() => {
    const column = sort && columns.find((c) => c.id === sort.id);
    if (!column?.sortValue) return rows;
    const get = column.sortValue;
    const factor = sort!.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      const x = get(a);
      const y = get(b);
      return (typeof x === "number" && typeof y === "number" ? x - y : String(x).localeCompare(String(y))) * factor;
    });
  }, [rows, columns, sort]);

  const pageCount = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1;
  const current = Math.min(page, pageCount);
  const pageRows = pageSize ? sorted.slice((current - 1) * pageSize, current * pageSize) : sorted;

  const update = (next: Set<string>) => {
    setSelected(next);
    onSelectionChange?.([...next]);
  };
  const pageIds = pageRows.map(rowId);
  const allChecked = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const someChecked = pageIds.some((id) => selected.has(id));

  React.useEffect(() => {
    seen.current = new Set(pageIds);
    for (const id of arrived.current.keys()) if (!seen.current.has(id)) arrived.current.delete(id);
  });

  const cycle = (id: string) => setSort((s) => (s?.id !== id ? { id, dir: "asc" } : s.dir === "asc" ? { id, dir: "desc" } : null));

  return (
    <div className={cn("flex w-full flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">{toolbar}</div>
        <Menu>
          <MenuTrigger
            render={
              <Button variant="outline" size="sm">
                <Columns3 /> Columns
              </Button>
            }
          />
          <MenuContent align="end">
            <MenuLabel>Show columns</MenuLabel>
            {columns
              .filter((c) => c.hideable !== false)
              .map((c) => (
                <MenuCheckboxItem
                  key={c.id}
                  checked={!hidden.has(c.id)}
                  closeOnClick={false}
                  onCheckedChange={(checked) =>
                    setHidden((h) => {
                      const next = new Set(h);
                      if (checked) next.delete(c.id);
                      else next.add(c.id);
                      return next;
                    })
                  }
                >
                  {c.header}
                </MenuCheckboxItem>
              ))}
          </MenuContent>
        </Menu>
      </div>

      <SmoothHeight>
        <Table>
          {caption && <caption className="sr-only">{caption}</caption>}
          <TableHeader>
            <TableRow className="border-border-strong">
              {onSelectionChange && (
                <TableHead className="w-9">
                  <Checkbox
                    aria-label="Select all rows on this page"
                    checked={allChecked}
                    indeterminate={!allChecked && someChecked}
                    onCheckedChange={(checked) => {
                      const next = new Set(selected);
                      pageIds.forEach((id) => (checked ? next.add(id) : next.delete(id)));
                      update(next);
                    }}
                  />
                </TableHead>
              )}
              {visible.map((c) => {
                const active = sort?.id === c.id;
                const Icon = !active ? ChevronsUpDown : sort!.dir === "asc" ? ArrowUp : ArrowDown;
                return (
                  <TableHead key={c.id} numeric={c.numeric} aria-sort={active ? (sort!.dir === "asc" ? "ascending" : "descending") : undefined} className={c.className}>
                    {c.sortValue ? (
                      <button
                        type="button"
                        onClick={() => cycle(c.id)}
                        className={cn(
                          "group inline-flex cursor-pointer items-center gap-1 rounded-xs text-overline rovr-focus hover:text-foreground",
                          active && "text-foreground",
                          c.numeric && "flex-row-reverse",
                        )}
                      >
                        {c.header}
                        <Icon className={cn("size-3 transition-opacity duration-(--dur-fast)", !active && "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100")} aria-hidden />
                      </button>
                    ) : (
                      c.header
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.map((row) => {
              const id = rowId(row);
              const now = performance.now();
              if (seen.current !== null && !seen.current.has(id)) arrived.current.set(id, now);
              const entering = now - (arrived.current.get(id) ?? -Infinity) < 400;
              return (
                <TableRow
                  key={id}
                  data-selected={selected.has(id) || undefined}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(entering && "rovr-enter", onRowClick && "cursor-pointer")}
                >
                  {onSelectionChange && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        aria-label="Select row"
                        checked={selected.has(id)}
                        onCheckedChange={(checked) => {
                          const next = new Set(selected);
                          if (checked) next.add(id);
                          else next.delete(id);
                          update(next);
                        }}
                      />
                    </TableCell>
                  )}
                  {visible.map((c) => (
                    <TableCell key={c.id} numeric={c.numeric} className={c.className}>
                      {c.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {/* Rows and the empty state are never on screen together. */}
        {rows.length === 0 && empty && <div className="rovr-enter [animation-delay:120ms]">{empty}</div>}

        {pageSize && rows.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-3">
            <p className="text-body-sm text-muted-foreground text-data">
              {selected.size > 0 ? `${selected.size} selected · ` : ""}
              {(current - 1) * pageSize + 1}–{Math.min(current * pageSize, rows.length)} of {rows.length}
            </p>
            {pageCount > 1 && <Pagination page={current} pageCount={pageCount} onPageChange={setPage} />}
          </div>
        )}
      </SmoothHeight>
    </div>
  );
}
