import { Pagination } from "@/components/ui/pagination";
import { type ComponentSpec, axis, matrix } from "./kit";

const noop = () => {};

export const spec: ComponentSpec = {
  slug: "pagination",
  sections: [
    matrix({
      title: "Pagination",
      note: "Up to 7 pages are all shown. Beyond that the first, the last and the neighbours of the current page stay, with gaps between.",
      rows: axis("pageCount", ["1", "5", "7", "12", "40"]),
      states: ["first", "middle", "last"],
      render: (p, s) => {
        const count = Number(p.pageCount);
        return <Pagination page={s.is("first") ? 1 : s.is("last") ? count : Math.ceil(count / 2)} pageCount={count} onPageChange={noop} />;
      },
    }),
    matrix({
      title: "Page button",
      note: "Shown on page 2 of 3. The current page is a secondary button, the others are ghost.",
      rows: axis("current", ["false", "true"]),
      states: ["default", "hover", "focus", "pressed"],
      target: '[aria-label="Page 2"]',
      render: (p) => <Pagination page={p.current === "true" ? 2 : 1} pageCount={3} onPageChange={noop} />,
    }),
    matrix({
      title: "Arrow button",
      note: "Previous is disabled on the first page and next on the last.",
      rows: axis("direction", ["previous", "next"]),
      states: ["default", "hover", "focus", "pressed", "disabled"],
      target: 'button:not([disabled]):is([aria-label="Previous page"], [aria-label="Next page"])',
      render: (p, s) => {
        const atEnd = (p.direction === "previous") !== s.disabled;
        return <Pagination page={atEnd ? 3 : 1} pageCount={3} onPageChange={noop} />;
      },
    }),
  ],
};
