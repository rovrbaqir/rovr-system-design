import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge has to know which RoVR utilities are font sizes. Without
 * this it reads `text-label` as a colour and drops it next to `text-foreground`.
 */
const twMerge = extendTailwindMerge<"rovr-data">({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display-xl",
            "display-lg",
            "display-md",
            "display-sm",
            "title-lg",
            "title-md",
            "title-sm",
            "body-lg",
            "body",
            "body-sm",
            "label",
            "caption",
            "overline",
          ],
        },
      ],
      "rovr-data": ["text-data"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
