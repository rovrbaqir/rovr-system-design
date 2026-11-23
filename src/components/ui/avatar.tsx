import * as React from "react";
import { Avatar as BaseAvatar } from "@base-ui/react/avatar";
import { cn } from "@/lib/utils";

const sizes = {
  xs: "size-6 text-[0.6875rem]",
  sm: "size-8 text-caption",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
} as const;

export interface AvatarProps extends React.ComponentProps<typeof BaseAvatar.Root> {
  src?: string;
  /** Full name. Used for the alt text and the initials fallback. */
  name: string;
  size?: keyof typeof sizes;
}

/** "Dr. Ngozi Okafor, MD" gives "NO": titles and credentials are not part of the initials. */
const initials = (name: string) =>
  name
    .split(",")[0]
    .replace(/^(dr|mr|mrs|ms|mx|prof)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

export function Avatar({ src, name, size = "md", className, ...props }: AvatarProps) {
  return (
    <BaseAvatar.Root
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-sunken font-medium text-foreground ring-1 ring-border ring-inset select-none",
        sizes[size],
        className,
      )}
      {...props}
    >
      {src && (
        <BaseAvatar.Image
          src={src}
          alt={name}
          className="size-full object-cover transition-opacity duration-(--dur-slow) ease-out data-[starting-style]:opacity-0"
        />
      )}
      <BaseAvatar.Fallback>{initials(name)}</BaseAvatar.Fallback>
    </BaseAvatar.Root>
  );
}

/** Overlapping avatars for a care team or attendee list. */
export function AvatarGroup({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex -space-x-2 [&>*]:ring-2 [&>*]:ring-surface", className)} {...props} />;
}
