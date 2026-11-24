import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const patients = [
  { name: "Amara Osei", mrn: "20418", visit: "Follow-up", time: "09:00" },
  { name: "Daniel Reyes", mrn: "19307", visit: "Lab review", time: "09:30" },
  { name: "Priya Raman", mrn: "22190", visit: "Annual physical", time: "10:15" },
  { name: "Tomás Lindqvist", mrn: "18842", visit: "Same-day sick visit", time: "11:00" },
];
const results = [
  { test: "Total cholesterol", value: 212, range: "under 200" },
  { test: "LDL cholesterol", value: 131, range: "under 100" },
  { test: "HDL cholesterol", value: 58, range: "over 40" },
];

function Schedule({ rows, selected }: { rows: typeof patients; selected?: string }) {
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
        {rows.map((p) => (
          <TableRow key={p.mrn} data-selected={selected === p.mrn || undefined}>
            <TableCell className="font-medium">{p.name}</TableCell>
            <TableCell>{p.visit}</TableCell>
            <TableCell numeric>{p.time}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export const spec: ComponentSpec = {
  slug: "table",
  sections: [
    matrix({
      title: "Table",
      note: "A static table. Set data-selected on a row to mark it.",
      rows: axis("selected", ["false", "true"]),
      states: ["default"],
      render: (p) => (
        <div className="w-[30rem]">
          <Schedule rows={patients} selected={p.selected === "true" ? "19307" : undefined} />
        </div>
      ),
    }),
    matrix({
      title: "Table row",
      note: "Body rows highlight on hover. The header row does not.",
      rows: axis("selected", ["false", "true"]),
      states: ["default", "hover"],
      target: "tbody tr",
      render: (p) => (
        <div className="w-96">
          <Schedule rows={patients.slice(1, 2)} selected={p.selected === "true" ? "19307" : undefined} />
        </div>
      ),
    }),
    list({
      title: "Columns",
      items: [
        {
          label: "Numeric columns",
          code: "<TableHead numeric> <TableCell numeric>",
          render: () => (
            <div className="w-96">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Test</TableHead>
                    <TableHead numeric>mg/dL</TableHead>
                    <TableHead numeric>Target</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((r) => (
                    <TableRow key={r.test}>
                      <TableCell className="font-medium">{r.test}</TableCell>
                      <TableCell numeric>{r.value}</TableCell>
                      <TableCell numeric className="text-muted-foreground">
                        {r.range}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ),
        },
        {
          label: "Without a header",
          code: "<Table><TableBody>…</TableBody></Table>",
          render: () => (
            <div className="w-72">
              <Table>
                <TableBody>
                  {results.map((r) => (
                    <TableRow key={r.test}>
                      <TableCell className="text-muted-foreground">{r.test}</TableCell>
                      <TableCell numeric>{r.value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ),
        },
      ],
    }),
  ],
};
