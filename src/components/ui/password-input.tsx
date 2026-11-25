import * as React from "react";
import { Check, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input, type InputProps } from "./input";

export interface PasswordInputProps extends Omit<InputProps, "type" | "trailing"> {
  /** Whether the password is shown as plain text. Leave unset to let the field manage it. */
  visible?: boolean;
  /** Whether the password starts out shown. */
  defaultVisible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  /** Accessible name of the eye button. It is a toggle, so the name stays the same in both states. */
  toggleLabel?: string;
}

const toggleSizes = { sm: "size-6", md: "size-7", lg: "size-8" } as const;

/** A password field with a button that shows or hides what was typed. */
export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(function PasswordInput(
  { visible, defaultVisible = false, onVisibleChange, toggleLabel = "Show password", size = "md", disabled, autoComplete = "current-password", ...props },
  ref,
) {
  const [inner, setInner] = React.useState(defaultVisible);
  const shown = visible ?? inner;
  const toggle = () => {
    if (visible === undefined) setInner(!shown);
    onVisibleChange?.(!shown);
  };

  return (
    <Input
      ref={ref}
      type={shown ? "text" : "password"}
      size={size}
      disabled={disabled}
      autoComplete={autoComplete}
      autoCapitalize="none"
      autoCorrect="off"
      spellCheck={false}
      trailing={
        <button
          type="button"
          aria-label={toggleLabel}
          aria-pressed={shown}
          disabled={disabled}
          onClick={toggle}
          className={cn(
            // Pulled toward the edge so it sits the same distance from the top, bottom and right. The ::after widens the touch target.
            "relative -mr-1.5 grid cursor-pointer place-items-center rounded-full text-muted-foreground rovr-focus rovr-press after:absolute after:-inset-1.5",
            "hover:bg-secondary-hover hover:text-foreground aria-pressed:text-foreground",
            "disabled:cursor-not-allowed disabled:text-subtle-foreground disabled:hover:bg-transparent",
            toggleSizes[size],
          )}
        >
          {shown ? <EyeOff aria-hidden /> : <Eye aria-hidden />}
        </button>
      }
      {...props}
    />
  );
});

/** What a rule is checked against. */
export interface PasswordRuleInput {
  password: string;
  /** The confirmation field's value, when the form has one. */
  confirm?: string;
  /** The account email, when it is known. */
  email?: string;
}

export interface PasswordRule {
  /** Stable key for the row. */
  id: string;
  /** Finishes the sentence "Password must", e.g. "Be at least 8 characters". */
  label: string;
  test: (input: PasswordRuleInput) => boolean;
}

/**
 * The rules RoVR accounts use. The email rule only applies when an email is
 * passed, and the confirmation rule only when a confirmation is passed.
 */
export const defaultPasswordRules: PasswordRule[] = [
  { id: "length", label: "Be at least 8 characters", test: ({ password }) => password.length >= 8 },
  { id: "lowercase", label: "Have at least one lowercase letter", test: ({ password }) => /[a-z]/.test(password) },
  { id: "uppercase", label: "Have at least one uppercase letter", test: ({ password }) => /[A-Z]/.test(password) },
  { id: "number", label: "Have at least one number", test: ({ password }) => /[0-9]/.test(password) },
];
const emailRule: PasswordRule = {
  id: "email",
  label: "Not be the same as the email",
  test: ({ password, email = "" }) => password.length > 0 && password.toLowerCase() !== email.toLowerCase(),
};
const confirmRule: PasswordRule = {
  id: "confirm",
  label: "Match the confirmation password",
  test: ({ password, confirm }) => password.length > 0 && password === confirm,
};

/** Each rule that applies to the input, with whether it is met. */
export function checkPassword(input: PasswordRuleInput, rules?: PasswordRule[]) {
  const applied = rules ?? [...defaultPasswordRules, ...(input.email !== undefined ? [emailRule] : []), ...(input.confirm !== undefined ? [confirmRule] : [])];
  return applied.map((rule) => ({ id: rule.id, label: rule.label, met: rule.test(input) }));
}

/** True when every rule is met. Use it to enable the submit button. */
export function isPasswordValid(input: PasswordRuleInput, rules?: PasswordRule[]) {
  return checkPassword(input, rules).every((rule) => rule.met);
}

export interface PasswordChecklistProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  /** The password as typed so far. */
  password: string;
  /** The confirmation field's value. Passing it, even empty, adds the "match" rule. */
  confirm?: string;
  /** The account email. Passing it adds the "not the same as the email" rule. */
  email?: string;
  /** Replaces the default rules. */
  rules?: PasswordRule[];
  /** The line above the rules. */
  title?: string;
}

/**
 * The list of password rules, each ticking as it is met. Point the password
 * field at it with `aria-describedby`. Screen readers hear the count of rules
 * met whenever it changes.
 */
export const PasswordChecklist = React.forwardRef<HTMLDivElement, PasswordChecklistProps>(function PasswordChecklist(
  { password, confirm, email, rules, title = "Password must", className, ...props },
  ref,
) {
  const titleId = React.useId();
  const results = checkPassword({ password, confirm, email }, rules);
  const met = results.filter((rule) => rule.met).length;

  return (
    <div ref={ref} role="group" aria-labelledby={titleId} className={cn("flex flex-col gap-2 text-body-sm", className)} {...props}>
      <p id={titleId} className="text-label text-foreground">
        {title}
      </p>
      <ul className="flex flex-col gap-1.5">
        {results.map((rule) => (
          <li key={rule.id} className={cn("flex items-center gap-2 transition-colors duration-(--dur-fast) ease-out", rule.met ? "text-foreground" : "text-muted-foreground")}>
            <span
              aria-hidden
              className={cn(
                "grid size-4 shrink-0 place-items-center rounded-full border transition-[background-color,border-color] duration-(--dur-fast) ease-out",
                rule.met ? "border-primary bg-primary text-primary-foreground" : "border-dashed border-border-strong",
              )}
            >
              <Check
                className={cn("size-2.5 stroke-[2.5]transition-[opacity,scale] duration-(--dur-fast) ease-out motion-reduce:scale-100", rule.met ? "scale-100 opacity-100" : "scale-75 opacity-0")}
              />
            </span>
            <span>
              {rule.label}
              <span className="sr-only">{rule.met ? ", met" : ", not met yet"}</span>
            </span>
          </li>
        ))}
      </ul>
      <p role="status" className="sr-only">
        {password.length > 0 ? `${met} of ${results.length} password rules met` : ""}
      </p>
    </div>
  );
});
