import { Avatar, AvatarGroup, type AvatarProps } from "@/components/ui/avatar";
import { type ComponentSpec, axis, list, matrix } from "./kit";

// A stand-in portrait, drawn inline so the sheet needs no network.
const photo =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#c9d8e6"/><circle cx="32" cy="25" r="11" fill="#7f97ad"/><path d="M10 64c0-13 10-22 22-22s22 9 22 22z" fill="#7f97ad"/></svg>',
  );

export const spec: ComponentSpec = {
  slug: "avatar",
  sections: [
    matrix({
      title: "Avatar",
      note: "size sets the diameter and the type size. Initials show while the photo loads and stay if it fails.",
      rows: axis("size", ["xs", "sm", "md", "lg"]),
      states: ["initials", "image"],
      render: (p, s) => <Avatar name="Dr. Ngozi Okafor, MD" size={p.size as AvatarProps["size"]} src={s.is("image") ? photo : undefined} />,
    }),
    matrix({
      title: "Avatar group",
      note: "Overlapping avatars for a care team. Each one gets a ring in the surface colour.",
      rows: axis("size", ["xs", "sm", "md", "lg"]),
      states: ["default"],
      render: (p) => (
        <AvatarGroup>
          <Avatar name="Ngozi Okafor" size={p.size as AvatarProps["size"]} />
          <Avatar name="Sam Whitfield" size={p.size as AvatarProps["size"]} />
          <Avatar name="Leila Haddad" size={p.size as AvatarProps["size"]} />
        </AvatarGroup>
      ),
    }),
    list({
      title: "Initials",
      note: "Titles and credentials are left out of the initials. A single name gives one letter.",
      items: [
        { label: "Two names", code: '<Avatar name="Sam Whitfield" />', render: () => <Avatar name="Sam Whitfield" /> },
        { label: "Title and credentials", code: '<Avatar name="Dr. Ngozi Okafor, MD" />', render: () => <Avatar name="Dr. Ngozi Okafor, MD" /> },
        { label: "Single name", code: '<Avatar name="Tomás" />', render: () => <Avatar name="Tomás" /> },
      ],
    }),
  ],
};
