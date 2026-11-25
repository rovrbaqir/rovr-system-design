import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type TypewriterElement = "p" | "span" | "div" | "h1" | "h2" | "h3" | "h4";

export interface TypewriterProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  /** The text to reveal. Plain text only. Pass an array for several lines; each item starts on a new line. */
  text: string | string[];
  /** Reveal a word at a time, or a character at a time. */
  by?: "word" | "char";
  /** Milliseconds between two words (or characters). */
  speed?: number;
  /** Milliseconds to wait before the first word. */
  delay?: number;
  /** Milliseconds to wait between two lines. */
  lineDelay?: number;
  /** Called once, when the last word is shown. Called straight away under reduced motion. */
  onComplete?: () => void;
  /** The element to render. */
  as?: TypewriterElement;
}

const split = (line: string, by: "word" | "char") => (by === "word" ? (line.match(/\s*\S+\s*/g) ?? [line]) : Array.from(line));

function Reveal({
  lines,
  by,
  speed,
  delay,
  lineDelay,
  onComplete,
}: Required<Pick<TypewriterProps, "by" | "speed" | "delay" | "lineDelay">> & { lines: string[]; onComplete?: () => void }) {
  const reduced = useReducedMotion();
  const tokens = React.useMemo(() => lines.map((line) => split(line, by)), [lines, by]);
  /** How many tokens come before each line, so a token knows its place in the whole text. */
  const starts = React.useMemo(() => {
    let sum = 0;
    return tokens.map((line) => {
      const start = sum;
      sum += line.length;
      return start;
    });
  }, [tokens]);
  const total = tokens.reduce((sum, line) => sum + line.length, 0);
  const [count, setCount] = React.useState(0);
  const shown = reduced ? total : count;

  const done = React.useRef(onComplete);
  const fired = React.useRef(false);
  React.useEffect(() => {
    done.current = onComplete;
  });

  React.useEffect(() => {
    if (shown >= total) {
      if (!fired.current) done.current?.();
      fired.current = true;
      return;
    }
    const wait = (count === 0 ? delay : 0) + (count > 0 && starts.includes(count) ? lineDelay : speed);
    const timer = setTimeout(() => setCount((c) => c + 1), wait);
    return () => clearTimeout(timer);
  }, [shown, total, count, delay, lineDelay, speed, starts]);

  // Every word is in the page from the start and only its opacity changes, so
  // the text takes its full space at once and nothing below it moves.
  return (
    <span aria-hidden className="whitespace-pre-wrap">
      {tokens.map((line, l) => (
        <span key={l} className={cn(lines.length > 1 && "block")}>
          {line.map((token, i) => (
            <span key={i} className={cn("transition-opacity duration-(--dur-base) ease-out", starts[l] + i >= shown && "opacity-0")}>
              {token}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

/**
 * Reveals text a word at a time, as if it were being written. Screen readers
 * get the whole text at once, and reduced motion shows it all immediately.
 * For greetings and generated summaries; never for clinical values or errors.
 */
export const Typewriter = React.forwardRef<HTMLElement, TypewriterProps>(function Typewriter(
  { text, by = "word", speed = 50, delay = 0, lineDelay = 500, onComplete, as = "p", className, ...props },
  ref,
) {
  const Tag = as as React.ElementType;
  const key = Array.isArray(text) ? text.join("\n") : text;
  const lines = React.useMemo(() => key.split("\n"), [key]);
  return (
    <Tag ref={ref} className={cn("relative", className)} {...props}>
      {/* What assistive technology reads. Not selectable, so copying the text does not copy it twice. */}
      <span className="sr-only select-none">{lines.join(" ")}</span>
      {/* A new text starts again from the first word. */}
      <Reveal key={`${by}:${key}`} lines={lines} by={by} speed={speed} delay={delay} lineDelay={lineDelay} onComplete={onComplete} />
    </Tag>
  );
});
