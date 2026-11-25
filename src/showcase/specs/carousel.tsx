import { Carousel, type CarouselProps, CarouselItem } from "@/components/ui/carousel";
import { type ComponentSpec, axis, list, matrix } from "./kit";

const slides = [
  ["Biomarkers", "42 of 47", "in range"],
  ["Lipids", "131", "mg/dL LDL"],
  ["Blood sugar", "5.6", "% HbA1c"],
  ["Thyroid", "2.1", "mIU/L TSH"],
  ["Vitamin D", "34", "ng/mL"],
] as const;

const items = () =>
  slides.map(([title, value, unit]) => (
    <CarouselItem key={title} className="flex flex-col gap-1 rounded-lg bg-surface-sunken p-4">
      <span className="text-label text-muted-foreground">{title}</span>
      <span className="flex items-baseline gap-2">
        <span className="text-title-lg text-data">{value}</span>
        <span className="text-caption text-muted-foreground">{unit}</span>
      </span>
    </CarouselItem>
  ));

const position: Record<string, number> = { start: 0, middle: 2, end: slides.length - 1 };

export const spec: ComponentSpec = {
  slug: "carousel",
  sections: [
    matrix({
      title: "Carousel",
      note: "indicator picks dots, a counter or nothing. Previous is disabled on the first slide and next on the last, unless loop is set.",
      rows: axis("indicator", ["dots", "counter", "none"]),
      states: ["start", "middle", "end"],
      render: (p, s) => (
        <Carousel aria-label="Lab result summary" indicator={p.indicator as CarouselProps["indicator"]} initialSlide={position[s.name]} className="w-64">
          {items()}
        </Carousel>
      ),
    }),
    list({
      title: "Layout",
      note: "slidesPerView, gap and peek set how much of the row shows at once.",
      items: [
        {
          label: "Two per view",
          code: "<Carousel slidesPerView={2} />",
          render: () => (
            <Carousel aria-label="Lab result summary" slidesPerView={2} gap={12} className="w-96">
              {items()}
            </Carousel>
          ),
        },
        {
          label: "Peek",
          code: "<Carousel peek={40} />",
          render: () => (
            <Carousel aria-label="Lab result summary" peek={40} gap={12} indicator="counter" className="w-72">
              {items()}
            </Carousel>
          ),
        },
        {
          label: "Loop",
          code: "<Carousel loop />",
          render: () => (
            <Carousel aria-label="Lab result summary" loop className="w-64">
              {items()}
            </Carousel>
          ),
        },
        {
          label: "No buttons",
          code: "<Carousel arrows={false} />",
          render: () => (
            <Carousel aria-label="Lab result summary" arrows={false} className="w-64">
              {items()}
            </Carousel>
          ),
        },
      ],
    }),
  ],
};
