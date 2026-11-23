import * as React from "react";
import { Pagination } from "@/components/ui/pagination";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function ManyPages() {
  const [page, setPage] = React.useState(3);
  return <Pagination page={page} pageCount={12} onPageChange={setPage} />;
}

function FewPages() {
  const [page, setPage] = React.useState(1);
  return <Pagination page={page} pageCount={5} onPageChange={setPage} />;
}

function ClaimsList() {
  const claims = [
    ["CL-48213", "Amara Osei", "$240.00"],
    ["CL-48219", "Daniel Reyes", "$185.50"],
    ["CL-48224", "Priya Raman", "$420.00"],
    ["CL-48230", "Tomás Lindqvist", "$96.00"],
    ["CL-48236", "Grace Mbeki", "$310.25"],
    ["CL-48241", "Noah Feldman", "$154.00"],
    ["CL-48247", "Sofia Marchetti", "$275.00"],
    ["CL-48252", "Jun Watanabe", "$88.75"],
  ];
  const size = 3;
  const [page, setPage] = React.useState(1);
  const rows = claims.slice((page - 1) * size, page * size);
  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <ul className="flex flex-col divide-y divide-border text-body">
        {rows.map(([id, patient, billed]) => (
          <li key={id} className="flex items-center gap-4 py-2.5 first:pt-0">
            <span className="font-mono text-body-sm text-muted-foreground">{id}</span>
            <span className="flex-1 font-medium">{patient}</span>
            <span className="text-data">{billed}</span>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-body-sm text-muted-foreground text-data">
          {(page - 1) * size + 1} to {Math.min(page * size, claims.length)} of {claims.length} claims
        </p>
        <Pagination page={page} pageCount={Math.ceil(claims.length / size)} onPageChange={setPage} />
      </div>
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="pagination-basic" files={["ui/pagination"]} title="Many pages" note="Above seven pages the middle collapses: the first, the last and the neighbours of the current page stay. Pages count from 1.">
        <ManyPages />
      </Demo>
      <Demo id="pagination-few" files={["ui/pagination"]} title="Few pages" note="Seven pages or fewer are all shown. Previous is disabled on the first page and Next on the last.">
        <FewPages />
      </Demo>
      <Demo id="pagination-with-list" files={["ui/pagination"]} title="Under a list" note="Say which rows are showing on the left and put the pages on the right." className="items-start">
        <ClaimsList />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "pagination",
  title: "Pagination",
  group: "Components",
  summary: "Moves through a long list one page at a time. DataTable has it built in, so reach for this only with lists and tables you assemble yourself.",
  keywords: "pager pages next previous paging",
  Body,
};
