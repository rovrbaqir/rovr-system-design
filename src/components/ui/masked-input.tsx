import * as React from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, type InputProps } from "./input";

const SLOT = "_";
const digitsOf = (text: string) => text.replace(/\D/g, "");
const slotsIn = (mask: string) => mask.split(SLOT).length - 1;

/**
 * Fits digits into a mask, where `_` is a digit slot. Punctuation is written
 * only once a digit follows it, so a partly typed value never ends in a
 * dangling bracket or dash. Extra digits are dropped.
 */
export function formatMask(mask: string, value: string): string {
  const digits = digitsOf(value).slice(0, slotsIn(mask));
  let out = "";
  let used = 0;
  for (const char of mask) {
    if (used >= digits.length) break;
    out += char === SLOT ? digits[used++] : char;
  }
  return out;
}

/** True once every slot of the mask holds a digit. */
export function isMaskComplete(mask: string, value: string): boolean {
  return digitsOf(value).length >= slotsIn(mask);
}

/** Where the caret sits once `count` digits are to its left. */
function caretAfter(masked: string, count: number): number {
  let seen = 0;
  for (let i = 0; i < masked.length; i++) {
    if (!/\d/.test(masked[i])) continue;
    // Before any digit, the caret rests in the first slot, past the opening punctuation.
    if (count === 0) return i;
    if (++seen === count) return i + 1;
  }
  return masked.length;
}

export interface MaskedInputProps extends Omit<InputProps, "value" | "defaultValue"> {
  /** The pattern to fill. `_` is a digit slot and every other character is fixed, e.g. `"__/__/____"`. */
  mask: string;
  /** The controlled value. Masked or bare digits are both accepted. */
  value?: string;
  /** The starting value when uncontrolled. */
  defaultValue?: string;
  /** Called with the masked text and the digits alone, e.g. `"(415) 555-0142"` and `"4155550142"`. */
  onValueChange?: (masked: string, raw: string) => void;
  /** Runs on the digits before they are fitted to the mask, for example to drop a country code from a pasted number. */
  normalize?: (digits: string) => string;
}

/**
 * A text field that only takes digits and writes the punctuation itself.
 * Typing, deleting, pasting and autofill all keep the caret where the person
 * expects it. The mask is the placeholder until a `placeholder` is given.
 */
export const MaskedInput = React.forwardRef<HTMLInputElement, MaskedInputProps>(function MaskedInput(
  { mask, value, defaultValue, onValueChange, normalize, onChange, placeholder, inputMode = "numeric", className, ...props },
  ref,
) {
  const fit = React.useCallback((text: string) => formatMask(mask, normalize ? normalize(digitsOf(text)) : text), [mask, normalize]);

  const [inner, setInner] = React.useState(() => fit(defaultValue ?? ""));
  const controlled = value !== undefined;
  const masked = controlled ? fit(value) : fit(inner);

  const node = React.useRef<HTMLInputElement | null>(null);
  const setNode = React.useCallback(
    (el: HTMLInputElement | null) => {
      node.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    },
    [ref],
  );

  // The caret to restore once React has written the new value.
  const caret = React.useRef<number | null>(null);
  React.useLayoutEffect(() => {
    const el = node.current;
    const at = caret.current;
    caret.current = null;
    if (at === null || !el || document.activeElement !== el) return;
    const position = Math.min(at, el.value.length);
    el.setSelectionRange(position, position);
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const el = event.target;
    const typed = el.value;
    const at = el.selectionStart ?? typed.length;
    let digits = digitsOf(typed);
    let before = digitsOf(typed.slice(0, at)).length;

    // A delete that only removed punctuation should take the digit next to it,
    // otherwise the mask writes the punctuation back and nothing seems to happen.
    const kind = (event.nativeEvent as InputEvent).inputType ?? "";
    if (kind.startsWith("delete") && typed.length < masked.length && digits === digitsOf(masked)) {
      if (kind === "deleteContentForward") {
        digits = digits.slice(0, before) + digits.slice(before + 1);
      } else if (before > 0) {
        digits = digits.slice(0, before - 1) + digits.slice(before);
        before -= 1;
      }
    }

    const fitted = normalize ? normalize(digits) : digits;
    // Digits dropped from the front (a country code) move the caret back with them.
    if (fitted.length < digits.length && digits.endsWith(fitted)) before = Math.max(0, before - (digits.length - fitted.length));
    const next = formatMask(mask, fitted);
    const position = caretAfter(next, Math.min(before, digitsOf(next).length));

    // Written to the element now, so `onChange` handlers and form libraries read the masked text.
    el.value = next;
    el.setSelectionRange(position, position);
    caret.current = position;

    if (!controlled) setInner(next);
    if (next !== masked) onValueChange?.(next, digitsOf(next));
    onChange?.(event);
  };

  return (
    <Input
      ref={setNode}
      inputMode={inputMode}
      placeholder={placeholder ?? mask}
      value={masked}
      onChange={handleChange}
      className={cn("text-data", className)}
      {...props}
    />
  );
});

/** The US phone pattern used by PhoneInput. */
export const PHONE_MASK = "(___) ___-____";

/** A US number never starts with 1, so a leading 1 on a longer number is the country code. */
const dropCountryCode = (digits: string) => (digits.length > 10 && digits.startsWith("1") ? digits.slice(1) : digits);

export interface PhoneInputProps extends Omit<MaskedInputProps, "mask"> {
  /** Defaults to the US pattern, `"(___) ___-____"`. */
  mask?: string;
}

/** A US phone number field. A pasted or autofilled number with a +1 country code loses the code. */
export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(function PhoneInput(
  { mask = PHONE_MASK, type = "tel", autoComplete = "tel", leading = <Phone aria-hidden />, normalize = dropCountryCode, ...props },
  ref,
) {
  return <MaskedInput ref={ref} mask={mask} type={type} autoComplete={autoComplete} leading={leading} normalize={normalize} {...props} />;
});
