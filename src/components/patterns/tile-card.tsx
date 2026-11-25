import * as React from "react";
import { ArrowRight, ArrowUpRight, Asterisk, CalendarDays, CirclePlus, ClipboardList, FlaskConical, HeartPulse, Lock, Plus, ScanLine, Watch } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image } from "@/components/ui/image";
import { Skeleton } from "@/components/ui/skeleton";

/* -------------------------------------------------------------------------- */
/* TileCard                                                                   */
/* -------------------------------------------------------------------------- */

export interface TileCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onClick"> {
  /** The tile's name, at the bottom left. Also names the tile for screen readers. */
  title: string;
  /** One line under the title. It does not wrap; a long line scrolls sideways. */
  description?: string;
  /** A second line shown only in the panel that rises on hover or focus. */
  subDescription?: string;
  /** The full-bleed picture. */
  image?: string | null;
  /** Shown when `image` is empty. Without either, the tile is a plain navy field. */
  fallbackImage?: string;
  /** Where the picture is anchored inside the tile. */
  objectPosition?: "center" | "top" | "bottom";
  /** How dark the scrim over the picture is, from 0 to 100. */
  brightness?: number;
  /** Shows a large plus in the middle of a tile that has no picture, for "add your first". */
  showPlusIcon?: boolean;
  /** Hides the arrow. */
  noArrowIcon?: boolean;
  /** Where the arrow sits. Left empty, a tile with a picture puts it bottom right and a tile without puts it top right. */
  arrowIconLocation?: "top-right" | "bottom-right" | null;
  /** Shows the skeleton in place of the tile. */
  loading?: boolean;
  /** Makes the whole tile one click target and shows the arrow. */
  cardClickable?: boolean;
  /** Called when a clickable tile is pressed. */
  onClick?: () => void;
  /** Shows a lock next to the title and turns off the hover panel and the arrow. */
  locked?: boolean;
  /** Shows the "Coming soon" badge at the top left and turns off the click and the arrow. */
  comingSoon?: boolean;
  /** Tenant portal variant: no arrow, no plus, no description line, and a dark layer over a locked tile. */
  multiTenant?: boolean;
  /** Shows the "New appointment" button at the top left when set. Hidden on locked and coming-soon tiles. */
  onAppointmentClick?: () => void;
}

const positions = { center: "object-center", top: "object-top", bottom: "object-bottom" } as const;

/**
 * A full-bleed picture tile for the home grid: a dark scrim over the image, the
 * title and one line at the bottom, an arrow in a corner, and a panel with the
 * full text that rises on hover or keyboard focus.
 */
export const TileCard = React.forwardRef<HTMLDivElement, TileCardProps>(function TileCard(
  {
    title,
    description,
    subDescription,
    image,
    fallbackImage,
    objectPosition = "top",
    brightness = 30,
    showPlusIcon = false,
    noArrowIcon = false,
    arrowIconLocation = null,
    loading = false,
    cardClickable = false,
    onClick,
    locked = false,
    comingSoon = false,
    multiTenant = false,
    onAppointmentClick,
    className,
    ...props
  },
  ref,
) {
  const src = image || fallbackImage;
  const clickable = cardClickable && !comingSoon;
  const arrowAtBottom = (!arrowIconLocation && !!image) || arrowIconLocation === "bottom-right";
  const showArrow = !noArrowIcon && !locked && !multiTenant && !comingSoon && cardClickable;
  const titleId = React.useId();

  return (
    <div
      ref={ref}
      aria-busy={loading || undefined}
      className={cn("group relative z-0 box-border size-full overflow-hidden rounded-sm bg-navy text-white transition-opacity duration-(--dur-base)", locked && "dark:opacity-50", className)}
      {...props}
    >
      {comingSoon && (
        <Badge className="absolute top-2 left-2 z-30 bg-white/15 text-white shadow-[inset_0_0_0_0.5px_rgb(255_255_255/0.3)] backdrop-blur-md">Coming soon</Badge>
      )}

      {loading ? (
        <div className="absolute inset-0 z-20 flex flex-col items-start justify-end gap-4 bg-surface-sunken p-4 rovr-enter">
          <div className="w-full">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </div>
        </div>
      ) : (
        <div className="size-full rovr-enter">
          {src && <Image src={src} alt="" radius="none" className="pointer-events-none absolute inset-0 size-full opacity-90" imgClassName={positions[objectPosition]} />}

          {locked && multiTenant && <div className="absolute inset-0 z-10 bg-black/50" />}
          {/* The wash that tells the pointer the tile has noticed it. */}
          <div className="absolute inset-0 z-10 bg-white/20 opacity-0 transition-opacity duration-(--dur-base) ease-out group-focus-within:opacity-100 group-hover:opacity-100" />

          {/* Scrim, the optional plus, and the resting title. */}
          <div className="relative z-20 flex size-full flex-col items-start justify-start overflow-hidden px-2 pb-2 md:px-4" style={{ backgroundColor: `rgb(0 0 0 / ${brightness}%)` }}>
            <div className="flex min-h-6 w-full flex-1 items-center justify-center overflow-hidden">
              {!image && showPlusIcon && !locked && !multiTenant && !comingSoon && <CirclePlus aria-hidden className="aspect-square h-1/2 w-auto max-w-1/2 text-white/50" />}
            </div>
            <div className="w-full">
              <h3 id={titleId} className={cn("flex items-center gap-1 pb-1 text-body-sm leading-none", multiTenant && locked && "font-light")}>
                <span className={cn(!locked && "transition-opacity duration-(--dur-fast) group-focus-within:opacity-0 group-hover:opacity-0")}>{title}</span>
                {locked && <Lock role="img" aria-label="Locked" className="size-4 shrink-0 text-white/60" />}
              </h3>
              {description && !multiTenant && (
                <p
                  className={cn(
                    "max-w-full overflow-x-auto text-body-sm leading-tight font-light text-nowrap [scrollbar-width:none] 2xl:text-caption",
                    !locked && "transition-opacity duration-(--dur-fast) group-focus-within:opacity-0 group-hover:opacity-0",
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* One button covers the tile, so the click, the focus ring and the name live in one place. */}
          {clickable && (
            <button
              type="button"
              aria-labelledby={titleId}
              onClick={onClick}
              className="absolute inset-0 z-20 cursor-pointer rounded-[inherit] rovr-focus focus-visible:-outline-offset-2!"
            />
          )}

          {onAppointmentClick && !comingSoon && !locked && (
            <Button variant="ghost" size="sm" onClick={onAppointmentClick} className="absolute top-2 left-2 z-40 bg-white/15 text-white shadow-[inset_0_0_0_1px_rgb(255_255_255/0.15)] backdrop-blur-sm hover:bg-white/40">
              <Plus /> New Appointment
            </Button>
          )}

          {showArrow && (
            <div aria-hidden className={cn("pointer-events-none absolute right-2 z-30", arrowAtBottom ? "bottom-2" : "top-2")}>
              {arrowAtBottom ? <ArrowRight className="size-6" /> : <ArrowUpRight className="size-6" />}
            </div>
          )}

          {/* The full text rises over a bottom gradient. Under reduced motion it only fades. */}
          {!locked && (
            <div
              aria-hidden
              className={cn(
                "pointer-events-none absolute inset-x-0 bottom-0 z-40 translate-y-(--motion-shift-lg) opacity-0",
                "transition-[opacity,translate] duration-(--dur-base) ease-out",
                "group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:translate-y-0 group-hover:opacity-100",
              )}
            >
              <div className="w-full bg-linear-to-t from-black/80 via-black/50 to-transparent px-2 py-3 md:px-4">
                <p className="text-label leading-none font-semibold">{title}</p>
                {description && <p className="mt-1 text-caption leading-snug text-white/80">{description}</p>}
                {subDescription && <p className="mt-2 text-caption leading-snug text-white/70">{subDescription}</p>}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/* TileList                                                                   */
/* -------------------------------------------------------------------------- */

export type TileItemType = "labs" | "imaging" | "testing" | "advanced-services" | "other" | "wearables" | "visit";

const typeIcons = {
  labs: FlaskConical,
  imaging: ScanLine,
  testing: ClipboardList,
  "advanced-services": HeartPulse,
  visit: CalendarDays,
  wearables: Watch,
  other: Asterisk,
} as const;

export interface TileListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onClick"> {
  /** What kind of thing the row is. Sets the icon and the default link text. */
  type: TileItemType;
  /** The row's name. */
  title: string;
  /** One line under the title. */
  description: string;
  /** The picture on the right. A visit shows it as a round portrait. */
  image?: string | null;
  /** Called when the link under the description is pressed. */
  onClick?: () => void;
  /** Seconds to wait before the row fades in, so a list arrives one row after the other. */
  delay?: number;
  /** The link's words. Defaults to "See Results" for labs and "Book Now" for everything else. */
  linkText?: string;
  /** Hides the link when false. */
  isClickVisible?: boolean;
  /** Replaces the link with the word "Completed". */
  isCompleted?: boolean;
}

/** One row of a TileList: an icon, a title, a line, a link, and a picture on the right. */
export function TileListItem({ type, title, description, image = null, onClick, delay = 0, linkText, isClickVisible = true, isCompleted = false, className, style, ...props }: TileListItemProps) {
  const Icon = typeIcons[type] ?? Asterisk;
  const link = linkText ?? (type === "labs" ? "See Results" : "Book Now");
  return (
    <div className={cn("flex size-full overflow-hidden rounded-lg rovr-risen rovr-enter", className)} style={{ animationDelay: `${delay}s`, ...style }} {...props}>
      <div className="flex min-w-0 flex-1 gap-1 p-1 md:gap-2 md:p-2">
        <div className="flex items-start gap-2 px-1 py-2 text-foreground">
          <Icon aria-hidden className="size-4" />
        </div>
        <div className="flex min-w-0 flex-col items-start p-1">
          <p className="text-body font-semibold text-foreground capitalize 2xl:text-body-sm">{title}</p>
          <p className="text-body-sm font-light text-muted-foreground first-letter:uppercase 2xl:text-caption">{description}</p>
          {isClickVisible &&
            (isCompleted ? (
              <p className="text-caption font-light text-accent-foreground">Completed</p>
            ) : (
              <Button variant="link" size="sm" onClick={onClick} className="gap-0.5 text-caption font-normal">
                {link}
                <ArrowUpRight aria-hidden className="size-3.5" />
              </Button>
            ))}
        </div>
      </div>
      <div className="flex aspect-square h-auto w-2/5 shrink-0 overflow-hidden">
        <Image src={image} alt="" radius={type === "visit" ? "full" : "none"} className={cn(type === "visit" ? "my-auto size-20" : "size-full")} />
      </div>
    </div>
  );
}

export interface TileItem {
  /** What kind of thing the row is. */
  item_type: TileItemType;
  title: string;
  description: string;
  onClick?: () => void;
  linkText?: string;
  image?: string | null;
}

export interface TileListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The heading above the list, with a line under it. */
  title?: string;
  /** An icon before the heading. */
  titleIcon?: React.ReactNode;
  /** Shows two skeleton rows in place of the list. */
  isLoading?: boolean;
  /** The rows. An empty list shows a lock in the middle. */
  items: TileItem[];
  /** `hide` renders nothing. `coming-soon` blurs the list and puts a lock over it. */
  status?: "show" | "hide" | "coming-soon";
  /** Hides every row's link when false. */
  isClickVisible?: boolean;
  /** Replaces every row's link with "Completed". */
  isCompleted?: boolean;
}

/** A titled, scrolling stack of TileListItems with loading, locked and empty states. */
export function TileList({ title, titleIcon, isLoading = false, items, status = "show", isClickVisible = true, isCompleted = false, className, ...props }: TileListProps) {
  if (status === "hide") return null;
  const locked = status === "coming-soon";
  const hasItems = items && items.length > 0;
  return (
    <div aria-busy={isLoading || undefined} className={cn("flex size-full flex-col gap-2", className)} {...props}>
      {title && (
        <h2 className="flex items-center justify-start gap-2 border-b border-border pt-3 pb-2 text-display-sm [&_svg]:size-5 [&_svg]:shrink-0">
          {titleIcon}
          {title}
        </h2>
      )}
      {isLoading && (
        <>
          <Skeleton className="size-full rounded-lg" />
          <Skeleton className="size-full rounded-lg" />
        </>
      )}
      {!isLoading && hasItems && (
        <div className={cn("relative flex-1", locked ? "overflow-hidden" : "overflow-y-auto")}>
          {locked && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <Lock role="img" aria-label="Coming soon" className="size-10 text-subtle-foreground" />
            </div>
          )}
          {/* A locked list is still drawn under the blur, but nothing in it can be reached. */}
          <div inert={locked} className="flex flex-col gap-1 overflow-hidden p-2 md:gap-2">
            {items.map((item, index) => (
              <TileListItem
                key={index}
                type={item.item_type}
                title={item.title}
                description={item.description}
                onClick={item.onClick}
                delay={index * 0.1}
                linkText={item.linkText}
                isClickVisible={isClickVisible}
                image={item.image}
                isCompleted={isCompleted}
              />
            ))}
          </div>
        </div>
      )}
      {!isLoading && !hasItems && (
        <div className="flex size-full items-center justify-center">
          <Lock role="img" aria-label="Nothing here yet" className="size-10 text-subtle-foreground" />
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* ServiceCard                                                                */
/* -------------------------------------------------------------------------- */

export interface ServiceCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  /** The service's name. Also names the card for screen readers. */
  name: string;
  /** The lowest price, already formatted, shown after the word "from". */
  fromPrice: string;
  /** The picture. */
  img: string;
  /** Lays the text over the bottom of the picture instead of under it, and adds a dark wash on hover. */
  descriptionOnTop?: boolean;
  /** A short line under the price row. */
  description?: string;
  /** Classes for the picture's frame, such as a fixed height. */
  imgClassName?: string;
  /** Hides the price when false. The tags stay on the right. */
  priceVisible?: boolean;
  /** Loads the picture at once instead of when it scrolls into view. */
  noImageLazy?: boolean;
  /** Badges at the right end of the price row. */
  tags?: React.ReactNode;
  /** Called when the card is pressed. */
  onClick?: () => void;
}

/**
 * A service in the catalogue: a picture, the name, a row with "from" and the
 * price on the left and tags on the right, then a short description. The whole
 * card is one click target.
 */
export const ServiceCard = React.forwardRef<HTMLDivElement, ServiceCardProps>(function ServiceCard(
  { name, fromPrice, img, descriptionOnTop = false, description, imgClassName, priceVisible = true, noImageLazy = false, tags, onClick, className, ...props },
  ref,
) {
  const nameId = React.useId();
  return (
    <div ref={ref} className={cn("group relative flex size-full min-h-fit flex-col items-start justify-start gap-2 overflow-hidden rounded-xl p-2", className)} {...props}>
      <Image src={img} alt="" radius="lg" loading={noImageLazy ? "eager" : "lazy"} className={cn("pointer-events-none h-full w-full flex-1", imgClassName)} imgClassName="object-center" />
      {descriptionOnTop && <div className="absolute inset-0 w-full transition-colors duration-(--dur-base) ease-out group-hover:bg-black/10" />}
      <div className={cn("flex w-full flex-col items-start justify-start", descriptionOnTop && "absolute bottom-0 left-0 p-4 text-white")}>
        <h3 id={nameId} className="text-left text-title-md">
          {name}
        </h3>
        <div className="flex w-full items-center justify-between gap-2">
          {priceVisible && (
            <p className="flex items-start justify-start gap-1 text-left text-body-sm text-data">
              <span className="inline-block font-light">from</span>
              {fromPrice}
            </p>
          )}
          {tags}
        </div>
        {description && <p className={cn("text-left text-caption font-light", descriptionOnTop ? "text-white/80" : "text-muted-foreground")}>{description}</p>}
      </div>
      <button type="button" aria-labelledby={nameId} onClick={onClick} className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] rovr-focus focus-visible:-outline-offset-2!" />
    </div>
  );
});
