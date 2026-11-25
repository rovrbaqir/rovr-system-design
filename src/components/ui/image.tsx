import * as React from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "./skeleton";

const radii = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  lg: "rounded-lg",
  xl: "rounded-xl",
  full: "rounded-full",
} as const;

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src" | "alt" | "className" | "onLoad" | "onError"> {
  /** The image URL. When it is empty or missing, the fallback shows and nothing is requested. */
  src?: string | null;
  /** What the image shows. Pass an empty string only for decoration. The fallback is announced with the same text. */
  alt: string;
  /** Width to height, written as in CSS: "16/9", "4/3", "1/1". Reserves the space before the image loads. Without it, size the wrapper with className. */
  ratio?: string;
  /** `cover` fills the frame and crops. `contain` shows the whole image, for documents, cards and logos. */
  fit?: "cover" | "contain";
  /** Corner radius of the frame. Use `full` with a 1/1 ratio for a circle. */
  radius?: keyof typeof radii;
  /** Replaces the default fallback (an icon and `fallbackText`) when there is no image or it fails to load. */
  fallback?: React.ReactNode;
  /** A short line under the fallback icon, such as "No photo yet". */
  fallbackText?: string;
  /** Keeps the skeleton up while the caller is still fetching the URL. */
  pending?: boolean;
  /** Called once the image has loaded. */
  onLoad?: React.ReactEventHandler<HTMLImageElement>;
  /** Called when the image fails to load. The fallback shows after this. */
  onError?: React.ReactEventHandler<HTMLImageElement>;
  /** Classes for the frame: width, height, margins. */
  className?: string;
  /** Classes for the `<img>` itself, such as `object-top`. */
  imgClassName?: string;
}

/**
 * An image in a frame. A skeleton holds the space until it loads, then the
 * image fades and sharpens in. An empty or broken `src` shows a fallback.
 * Loads lazily unless `loading="eager"` is passed.
 */
export const Image = React.forwardRef<HTMLImageElement, ImageProps>(function Image(
  { src, alt, ratio, fit = "cover", radius = "lg", fallback, fallbackText, pending = false, onLoad, onError, className, imgClassName, loading = "lazy", decoding = "async", ...props },
  ref,
) {
  // Each state remembers the src it belongs to, so a new src starts again without an effect.
  const [loadedSrc, setLoadedSrc] = React.useState<string | null>(null);
  const [failedSrc, setFailedSrc] = React.useState<string | null>(null);
  const [settledSrc, setSettledSrc] = React.useState<string | null>(null);
  const img = React.useRef<HTMLImageElement | null>(null);

  const missing = !src;
  const failed = missing || failedSrc === src;
  const loaded = !failed && !pending && loadedSrc === src;
  const settled = loaded && settledSrc === src;

  // An image already in the cache can finish before React attaches onLoad.
  React.useLayoutEffect(() => {
    const el = img.current;
    if (!el || !src || !el.complete) return;
    if (el.naturalWidth > 0) {
      // Nothing to fade from, so the skeleton goes at once.
      setLoadedSrc(src);
      setSettledSrc(src);
    } else setFailedSrc(src);
  }, [src]);

  const setRef = (el: HTMLImageElement | null) => {
    img.current = el;
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  return (
    <div
      data-state={failed ? "fallback" : loaded ? "loaded" : "loading"}
      className={cn("relative overflow-hidden", radii[radius], className)}
      style={ratio ? { aspectRatio: ratio.replace("/", " / ") } : undefined}
    >
      {!failed && (
        <img
          ref={setRef}
          src={src ?? undefined}
          alt={alt}
          loading={loading}
          decoding={decoding}
          onLoad={(event) => {
            setLoadedSrc(src ?? null);
            onLoad?.(event);
          }}
          onError={(event) => {
            setFailedSrc(src ?? null);
            onError?.(event);
          }}
          onTransitionEnd={(event) => {
            if (event.propertyName === "opacity" && loaded) setSettledSrc(src ?? null);
          }}
          className={cn(
            "block size-full transition-[opacity,filter] duration-(--dur-slow) ease-out",
            ratio && "absolute inset-0",
            fit === "cover" ? "object-cover" : "object-contain",
            // The blur amount is zero under reduced motion, which leaves a plain fade.
            !loaded && "opacity-0 blur-(--motion-blur)",
            imgClassName,
          )}
          {...props}
        />
      )}
      {!failed && !settled && (
        <Skeleton
          className={cn("pointer-events-none absolute inset-0 size-full rounded-none transition-opacity duration-(--dur-base) ease-out", loaded && "opacity-0")}
        />
      )}
      {failed && (
        <div
          role={alt ? "img" : undefined}
          aria-label={alt || undefined}
          aria-hidden={alt ? undefined : true}
          className={cn("flex size-full flex-col items-center justify-center gap-1.5 bg-surface-sunken p-3 text-center text-muted-foreground", ratio && "absolute inset-0")}
        >
          {fallback ?? (
            <>
              <ImageOff className="size-5 shrink-0 text-subtle-foreground" aria-hidden />
              {fallbackText && <span className="text-caption">{fallbackText}</span>}
            </>
          )}
        </div>
      )}
    </div>
  );
});
