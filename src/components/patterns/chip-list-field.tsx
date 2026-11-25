import * as React from "react";
import { ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Label } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

/** A plain entry, or an entry with the year it happened: `["Appendectomy", "2014"]`. */
export type ChipListValue = [string, string] | string;

export interface ChipListFieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Shown to the left of the options, e.g. "Allergies". */
  label: string;
  /** Options to pick from. "None" clears every other entry. "Other" adds a free-text entry. */
  options: string[];
  value: ChipListValue[];
  onChange: (value: ChipListValue[]) => void;
  /** Placeholder of the free-text input behind "Other". */
  placeholder?: string;
  /** Marks the field as unanswered or wrong: the label turns red. */
  error?: boolean;
  /** Height of the options list. It scrolls inside this height. */
  height?: string;
  /** Each chip carries a year input, and values are `[name, year]` pairs. */
  hasYear?: boolean;
  /** `wide` gives the label less room and the options a minimum width, for long option names. */
  variant?: "wide" | "normal";
  /** Extra controls shown at the end of the options list. */
  customInputs?: React.ReactNode;
  /** Applied to the free-text row behind "Other". */
  customInputClassName?: string;
  /** Applied to the options list. */
  optionsClassName?: string;
  labelClassName?: string;
}

const nameOf = (v: ChipListValue) => (typeof v === "string" ? v : v[0]);

/**
 * A pick-many field for clinical intake: a label, a divider, a short scrolling
 * list of options, and the chosen entries as removable chips. Used for
 * allergies, conditions and surgeries.
 */
export function ChipListField({
  label,
  options,
  value = [],
  onChange,
  placeholder = "Other",
  error = false,
  height = "180px",
  hasYear = false,
  variant = "normal",
  customInputs,
  customInputClassName,
  optionsClassName,
  labelClassName,
  className,
  ...props
}: ChipListFieldProps) {
  const labelId = React.useId();
  const [hasOther, setHasOther] = React.useState(false);
  const [otherValue, setOtherValue] = React.useState("");
  const otherRow = React.useRef<HTMLDivElement>(null);

  const hasOtherInOptions = options.some((option) => option.toLowerCase() === "other");
  const displayOptions = options.filter((option) => option.toLowerCase() !== "other");
  const filteredValue = value.filter((v) => nameOf(v) !== "None");
  const entry = (name: string): ChipListValue => (hasYear ? [name, ""] : name);

  // The free-text row is added at the end of the list, so bring it into view.
  React.useEffect(() => {
    if (!hasOther) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    otherRow.current?.scrollIntoView({ block: "nearest", behavior: reduced ? "auto" : "smooth" });
  }, [hasOther]);

  const toggleOption = (option: string) => {
    if (option === "None") {
      onChange(value.some((v) => nameOf(v) === "None") ? filteredValue : [entry("None")]);
      setOtherValue("");
      setHasOther(false);
      return;
    }
    if (value.some((v) => nameOf(v) === option)) onChange(filteredValue.filter((v) => nameOf(v) !== option));
    else onChange([...filteredValue, entry(option)]);
  };

  const addOther = () => {
    if (otherValue.trim() === "") return;
    onChange([...filteredValue, entry(otherValue)]);
    setOtherValue("");
    setHasOther(false);
  };

  const changeYear = (name: string, raw: string) => {
    // Digits only, four at most, and a full year must fall between 1900 and this year.
    const year = raw.replace(/[^0-9]/g, "").slice(0, 4);
    if (year.length === 4 && (Number(year) < 1900 || Number(year) > new Date().getFullYear())) return;
    onChange(filteredValue.map((v) => (nameOf(v) === name ? [name, year] : v)));
  };

  const optionClass = cn("h-7 w-full shrink-0 justify-start rounded-xs px-2 font-normal", variant === "wide" && "min-w-[120px] min-[1100px]:min-w-[160px]");

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      aria-invalid={error || undefined}
      className={cn("mt-6 flex w-full min-w-0 flex-col min-[1100px]:flex-row min-[1100px]:items-start", className)}
      {...props}
    >
      <div className="flex w-full min-w-0 flex-row items-center min-[1100px]:min-w-[60%] min-[1100px]:flex-1">
        <Label
          id={labelId}
          className={cn(
            "shrink-0 text-sm font-normal min-[1100px]:text-title-md min-[1100px]:font-normal",
            variant === "normal" && "w-[100px] min-[1100px]:w-[140px]",
            variant === "wide" && "w-20 min-[1100px]:w-[120px]",
            error && "text-destructive-fg",
            labelClassName,
          )}
        >
          {label}
        </Label>
        <div className="relative flex w-full min-w-0 flex-row items-center overflow-hidden [mask-image:linear-gradient(to_top,transparent_1%,black_20%,black_70%,transparent_90%)]">
          <span aria-hidden className="ml-2 flex w-px shrink-0 bg-border-strong" style={{ height }} />
          <ScrollArea className="ml-1 w-full min-w-0" style={{ height }}>
            <div className={cn("flex w-full min-w-0 flex-col gap-1 pt-14 pb-10", optionsClassName)}>
              {displayOptions.map((option) => {
                const isSelected = value.some((v) => nameOf(v) === option);
                return (
                  <Button key={option} variant="ghost" size="sm" aria-pressed={isSelected} onClick={() => toggleOption(option)} className={cn(optionClass, isSelected && "font-medium text-accent-foreground")}>
                    {option}
                  </Button>
                );
              })}
              {hasOtherInOptions && !hasOther && (
                <Button variant="ghost" size="sm" onClick={() => setHasOther(true)} className={optionClass}>
                  Other <ChevronRight className="size-3" aria-hidden />
                </Button>
              )}
              {hasOtherInOptions && hasOther && (
                <div ref={otherRow} className={cn("relative mb-4 flex w-full max-w-[250px] min-w-0 items-center md:max-w-full", customInputClassName)}>
                  <Input
                    autoFocus
                    aria-label={`Other ${label.toLowerCase()}`}
                    placeholder={placeholder}
                    className="min-w-0 flex-1 bg-surface-sunken pr-20 pl-4"
                    value={otherValue}
                    onChange={(event) => setOtherValue(event.target.value)}
                    onBlur={() => {
                      if (otherValue.trim() === "") setHasOther(false);
                    }}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      event.preventDefault();
                      addOther();
                    }}
                  />
                  <Button
                    size="sm"
                    variant={otherValue === "" ? "secondary" : "primary"}
                    // Keeps focus in the input, so an empty row is not closed by its own button.
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={addOther}
                    className="absolute top-1/2 right-1 -translate-y-1/2 gap-1 px-3"
                  >
                    <Plus className="size-3" aria-hidden />
                    Add
                  </Button>
                </div>
              )}
              {customInputs}
            </div>
          </ScrollArea>
        </div>
      </div>
      <ul
        aria-label={`Selected ${label.toLowerCase()}`}
        className={cn(
          "mt-2 flex w-full flex-wrap gap-2 self-start md:max-w-[75%]",
          "min-[1100px]:mt-0 min-[1100px]:w-auto min-[1100px]:max-w-[min(40%,280px)] min-[1100px]:min-w-0 min-[1100px]:shrink",
          variant === "normal" && "ml-[100px] min-[1100px]:ml-4",
          variant === "wide" && "ml-[30px] min-[1100px]:ml-2",
        )}
      >
        {filteredValue.map((v) => {
          const name = nameOf(v);
          return (
            <li key={name} className="inline-flex">
              {/* Reversed so the remove button sits before the name, as in the intake form. */}
              <Chip onRemove={() => onChange(value.filter((other) => other !== v))} className="w-fit flex-row-reverse pr-3 pl-1 font-normal min-[1100px]:h-8">
                <span className="inline-flex items-center gap-1">
                  {name}
                  {hasYear && typeof v !== "string" && (
                    <Input
                      size="sm"
                      inputMode="numeric"
                      aria-label={`Year of ${name}`}
                      placeholder="YYYY"
                      maxLength={4}
                      className="h-5 w-[50px] rounded-xs border-transparent bg-transparent px-1 text-data hover:border-transparent"
                      value={v[1]}
                      onChange={(event) => changeYear(name, event.target.value)}
                    />
                  )}
                </span>
              </Chip>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
