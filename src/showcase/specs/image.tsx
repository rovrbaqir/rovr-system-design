import { UserRound } from "lucide-react";
import { Image, type ImageProps } from "@/components/ui/image";
import { type ComponentSpec, axis, list, matrix } from "./kit";

// Drawn inline so the sheet needs no network. A data URI cannot read CSS variables, so the brand colours are repeated.
const picture = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="720" viewBox="0 0 960 720">` +
    `<defs><linearGradient id="g" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#152163"/><stop offset="1" stop-color="#546eff"/></linearGradient></defs>` +
    `<rect width="960" height="720" fill="url(#g)"/><circle cx="760" cy="150" r="260" fill="#a0aeff" opacity="0.35"/>` +
    `<path d="M0 520 C 220 420 420 620 640 500 S 900 420 960 470 V720 H0 Z" fill="#ffffff" opacity="0.14"/></svg>`,
)}`;

const card = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400">` +
    `<rect width="640" height="400" rx="28" fill="#f2f3fe"/><rect x="40" y="44" width="150" height="26" rx="13" fill="#546eff"/>` +
    `<rect x="40" y="150" width="300" height="20" rx="10" fill="#152163" opacity="0.8"/><rect x="40" y="190" width="210" height="16" rx="8" fill="#152163" opacity="0.35"/></svg>`,
)}`;

export const spec: ComponentSpec = {
  slug: "image",
  sections: [
    matrix({
      title: "Image",
      note: "ratio reserves the frame. Loading shows the skeleton (captured as a still). Fallback shows when src is empty or the request fails.",
      rows: axis("ratio", ["16/9", "4/3", "1/1"]),
      states: ["default", "loading", "fallback"],
      render: (p, s) => (
        <Image src={s.is("fallback") ? "" : picture} alt="Waiting room at the Riverside clinic" ratio={p.ratio} pending={s.is("loading")} loading="eager" className="w-44" />
      ),
    }),
    matrix({
      title: "Radius",
      note: "radius rounds the frame. Use full with a 1/1 ratio for a circle.",
      component: "Image radius",
      rows: axis("radius", ["none", "sm", "md", "lg", "xl", "full"]),
      states: ["default", "fallback"],
      render: (p, s) => (
        <Image src={s.is("fallback") ? "" : picture} alt="Waiting room at the Riverside clinic" ratio="1/1" radius={p.radius as ImageProps["radius"]} loading="eager" className="w-24" />
      ),
    }),
    list({
      title: "Content",
      note: "fit chooses between cropping and showing the whole image. The fallback can carry a line of text or be replaced.",
      items: [
        { label: "Cover", code: '<Image fit="cover" />', render: () => <Image src={card} alt="Front of insurance card" ratio="1/1" loading="eager" className="w-40" /> },
        {
          label: "Contain",
          code: '<Image fit="contain" />',
          render: () => <Image src={card} alt="Front of insurance card" ratio="1/1" fit="contain" loading="eager" className="w-40 bg-surface-sunken" imgClassName="p-3" />,
        },
        {
          label: "Fallback text",
          code: '<Image fallbackText="…" />',
          render: () => <Image src="" alt="Chest X-ray, 12 November 2026" ratio="4/3" fallbackText="This image could not be loaded." className="w-48" />,
        },
        {
          label: "Custom fallback",
          code: "<Image fallback={…} />",
          render: () => (
            <Image
              src=""
              alt="Amara Osei"
              ratio="1/1"
              radius="full"
              className="w-32"
              fallback={
                <>
                  <UserRound className="size-6 text-subtle-foreground" aria-hidden />
                  <span className="text-caption">No photo yet</span>
                </>
              }
            />
          ),
        },
      ],
    }),
  ],
};
