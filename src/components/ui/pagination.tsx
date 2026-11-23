import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export interface PaginationProps extends Omit<React.HTMLAttributes<HTMLElement>, "onChange"> {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

function pages(page: number, count: number): (number | "gap")[] {
  if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
  const middle = [page - 1, page, page + 1].filter((p) => p > 1 && p < count);
  return [1, ...(middle[0] > 2 ? (["gap"] as const) : []), ...middle, ...(middle[middle.length - 1] < count - 1 ? (["gap"] as const) : []), count];
}

export function Pagination({ page, pageCount, onPageChange, className, ...props }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)} {...props}>
      <Button variant="ghost" size="icon-sm" aria-label="Previous page" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        <ChevronLeft />
      </Button>
      {pages(page, pageCount).map((p, i) =>
        p === "gap" ? (
          <span key={`gap-${i}`} className="w-8 text-center text-muted-foreground" aria-hidden>
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p === page ? "secondary" : "ghost"}
            size="icon-sm"
            aria-label={`Page ${p}`}
            aria-current={p === page ? "page" : undefined}
            onClick={() => onPageChange(p)}
            className="text-data"
          >
            {p}
          </Button>
        ),
      )}
      <Button variant="ghost" size="icon-sm" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
        <ChevronRight />
      </Button>
    </nav>
  );
}
