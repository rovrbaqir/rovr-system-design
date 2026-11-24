import { Skeleton } from "@/components/ui/skeleton";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const shapes: Record<string, string> = {
  text: "h-4 w-48",
  heading: "h-6 w-56",
  avatar: "size-10 rounded-full",
  button: "h-10 w-28 rounded-full",
  thumbnail: "h-20 w-40 rounded-lg",
};

export const spec: ComponentSpec = {
  slug: "skeleton",
  sections: [
    matrix({
      title: "Skeleton",
      note: "One block, sized and rounded with className to match the content it stands in for. The shimmer is captured as a still.",
      rows: axis("shape", Object.keys(shapes)),
      states: ["default"],
      render: (p) => <Skeleton className={shapes[p.shape]} />,
    }),
    list({
      title: "Compositions",
      note: "Build the outline of the real content from several blocks.",
      items: [
        {
          label: "List row",
          render: () => (
            <div className="flex w-72 items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-3 w-4/5" />
              </div>
            </div>
          ),
        },
        {
          label: "Paragraph",
          render: () => (
            <div className="flex w-72 flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          ),
        },
        {
          label: "Card",
          render: () => (
            <div className="flex w-72 flex-col gap-4 rounded-xl rovr-risen p-card">
              <Skeleton className="h-5 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-10 w-28 rounded-full" />
            </div>
          ),
        },
      ],
    }),
  ],
};
