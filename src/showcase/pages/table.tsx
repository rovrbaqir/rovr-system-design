import * as React from "react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const patients = [
  { name: "Amara Osei", mrn: "20418", visit: "Follow-up", time: "09:00", status: ["success", "Checked in"] },
  { name: "Daniel Reyes", mrn: "19307", visit: "Lab review", time: "09:30", status: ["info", "In progress"] },
  { name: "Priya Raman", mrn: "22190", visit: "Annual physical", time: "10:15", status: ["neutral", "Scheduled"] },
  { name: "Tomás Lindqvist", mrn: "18842", visit: "Same-day sick visit", time: "11:00", status: ["warning", "Running late"] },
] as const;

const results = [
  { test: "Total cholesterol", value: 212, unit: "mg/dL", range: "under 200", flag: "High" },
  { test: "LDL cholesterol", value: 131, unit: "mg/dL", range: "under 100", flag: "High" },
  { test: "HDL cholesterol", value: 58, unit: "mg/dL", range: "over 40", flag: null },
  { test: "Triglycerides", value: 114, unit: "mg/dL", range: "under 150", flag: null },
] as const;

function SelectableRows() {
  const [selected, setSelected] = React.useState("19307");
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Patient</TableHead>
          <TableHead>Visit</TableHead>
          <TableHead numeric>Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {patients.map((p) => (
          <TableRow key={p.mrn} data-selected={selected === p.mrn || undefined} onClick={() => setSelected(p.mrn)} className="cursor-pointer">
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>{p.visit}</TableCell>
            <TableCell numeric>{p.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function Body() {
  return (
    <>
      <Demo id="table-basic" files={["ui/table", "ui/avatar", "ui/badge"]} title="Basic" note="Rows highlight on hover. Header cells are column headers for screen readers. In a table, status is a dot and plain text." className="items-start">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Patient</TableHead>
              <TableHead>MRN</TableHead>
              <TableHead>Visit</TableHead>
              <TableHead numeric>Time</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((p) => (
              <TableRow key={p.mrn}>
                <TableCell>
                  <span className="flex items-center gap-2.5 font-medium">
                    <Avatar name={p.name} size="xs" /> {p.name}
                  </span>
                </TableCell>
                <TableCell className="text-muted-foreground text-data">{p.mrn}</TableCell>
                <TableCell>{p.visit}</TableCell>
                <TableCell numeric>{p.time}</TableCell>
                <TableCell>
                  <Badge tone={p.status[0]} variant="status">
                    {p.status[1]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Demo>
      <Demo id="table-numeric" files={["ui/table", "ui/badge"]} title="Numeric columns" note="Set numeric on the head and the cell. The column aligns right and uses tabular figures, so values line up digit for digit." className="items-start">
        <Table>
          <caption className="pt-3 text-left text-caption text-muted-foreground">Lipid panel, collected 12 Nov 2026, fasting</caption>
          <TableHeader>
            <TableRow>
              <TableHead>Test</TableHead>
              <TableHead numeric>Result</TableHead>
              <TableHead>Unit</TableHead>
              <TableHead numeric>Reference</TableHead>
              <TableHead>Flag</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.map((r) => (
              <TableRow key={r.test}>
                <TableCell className="font-medium">{r.test}</TableCell>
                <TableCell numeric>{r.value}</TableCell>
                <TableCell className="text-muted-foreground">{r.unit}</TableCell>
                <TableCell numeric className="text-muted-foreground">
                  {r.range}
                </TableCell>
                <TableCell>{r.flag && <Badge tone="warning">{r.flag}</Badge>}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Demo>
      <Demo id="table-selected-row" files={["ui/table"]} title="Selected row" note="A row with data-selected takes the accent fill. Click a row to move the selection." className="items-start">
        <SelectableRows />
      </Demo>
      <Demo id="table-compact" files={["ui/table"]} title="Compact density" note="Row height follows the density of the surrounding region. The provider app sets compact on its tables." className="items-start">
        <div data-density="compact" className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication</TableHead>
                <TableHead>Directions</TableHead>
                <TableHead numeric>Refills</TableHead>
                <TableHead numeric>Next refill</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Atorvastatin 20 mg</TableCell>
                <TableCell>One tablet every morning</TableCell>
                <TableCell numeric>2</TableCell>
                <TableCell numeric>14 Dec</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Metformin 500 mg</TableCell>
                <TableCell>One tablet twice a day with meals</TableCell>
                <TableCell numeric>0</TableCell>
                <TableCell numeric>28 Nov</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Lisinopril 10 mg</TableCell>
                <TableCell>One tablet every evening</TableCell>
                <TableCell numeric>5</TableCell>
                <TableCell numeric>6 Jan</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "table",
  title: "Table",
  group: "Components",
  summary: "The plain table parts: header, body, rows and cells. Use it for static tables of a known size. For sorting, selection or pagination use Data table.",
  keywords: "grid rows columns cells thead tbody numeric",
  Body,
};
