import * as React from "react";
import {
  Ambulance,
  AudioLines,
  ChevronDown,
  FileText,
  Globe,
  MessageSquarePlus,
  MessageSquareText,
  MessagesSquare,
  Mic,
  Paperclip,
  Phone,
  SendHorizontal,
  ThumbsDown,
  ThumbsUp,
  Upload,
  Volume2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { GradientText } from "@/components/ui/gradient-text";
import { Image } from "@/components/ui/image";
import { Textarea } from "@/components/ui/input";
import { LoadingOverlay } from "@/components/ui/loading-overlay";
import { Prose } from "@/components/ui/prose";
import { TypingDots } from "@/components/ui/spinner";
import { Tooltip } from "@/components/ui/tooltip";
import { Typewriter } from "@/components/ui/typewriter";

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

/** One step Pulse took before answering, shown under "Thought Process". */
export interface ChatThought {
  text: string;
  /** More detail, shown when the step is opened. */
  description?: string;
}

export interface ChatMessageData {
  id: string;
  /** `me` is the signed-in person and sits on the right. `other` is Pulse or a care-team member and sits on the left. */
  from: "me" | "other";
  /** The message was written by Pulse. It renders through Prose, has no bubble fill, and gets the copy, play, like and dislike row. */
  ai?: boolean;
  /** The plain text. Also what the copy button copies. */
  text?: string;
  /** The same message as rendered rich text, such as the output of a markdown renderer. Used in place of `text` on screen. */
  content?: React.ReactNode;
  /** Who sent it. Used for the avatar when the list shows avatars. */
  author?: { name: string; avatar?: string };
  /** The steps Pulse took. Adds the "Thought Process" toggle above the message. */
  thoughtProcess?: ChatThought[];
  /** Marks a message that arrived by SMS or was spoken, with a small tag under the text. */
  via?: "text" | "voice";
  /** A card, chart or file shown inside the message, under the text. */
  attachment?: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/* MessageBubble                                                              */
/* -------------------------------------------------------------------------- */

function ThoughtStep({ item }: { item: ChatThought }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="py-1">
      {item.description ? (
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex cursor-pointer items-center gap-1 rounded-xs text-left text-caption font-light text-muted-foreground rovr-focus hover:text-foreground"
        >
          {item.text}
          <ChevronDown aria-hidden className={cn("size-3 transition-transform duration-(--dur-base) ease-out", open && "rotate-180")} />
        </button>
      ) : (
        <p className="text-caption font-light text-muted-foreground">{item.text}</p>
      )}
      {open && item.description && <p className="mt-1 ml-2 text-caption font-light text-subtle-foreground italic rovr-enter">{item.description}</p>}
    </div>
  );
}

export interface MessageBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  message: ChatMessageData;
  /** Shows the sender's avatar next to messages from the other side. Turn it on when more than one person can reply. */
  showAvatar?: boolean;
  /** Whether this message is being read aloud. Lights the play button. */
  speaking?: boolean;
  /** Called when the play button under a Pulse message is pressed. */
  onSpeak?: (message: ChatMessageData) => void;
  /** Called when a Pulse message is liked or disliked, and with `null` when the choice is taken back. */
  onReaction?: (message: ChatMessageData, reaction: "like" | "dislike" | null) => void;
}

/**
 * One message. The other side's messages sit on the left and the signed-in
 * person's on the right. A Pulse message can carry its thought process above
 * and a row of copy, play, like and dislike below.
 */
export function MessageBubble({ message, showAvatar = false, speaking = false, onSpeak, onReaction, className, ...props }: MessageBubbleProps) {
  const [thoughtsOpen, setThoughtsOpen] = React.useState(false);
  const [reaction, setReaction] = React.useState<"like" | "dislike" | null>(null);
  const me = message.from === "me";
  const ai = !me && !!message.ai;
  const thoughts = message.thoughtProcess ?? [];
  const hasText = !!message.content || !!message.text?.trim();

  // Pulse opens each reply with an empty placeholder message; skip it.
  if (ai && !hasText && !message.attachment) return null;

  const react = (next: "like" | "dislike") => {
    const value = reaction === next ? null : next;
    setReaction(value);
    onReaction?.(message, value);
  };

  return (
    <div className={cn("w-full", className)} {...props}>
      {ai && thoughts.length > 0 && (
        <div className="mb-1 ml-4">
          <button
            type="button"
            aria-expanded={thoughtsOpen}
            onClick={() => setThoughtsOpen(!thoughtsOpen)}
            className="ml-3 flex cursor-pointer items-center gap-1 rounded-xs text-caption font-light text-subtle-foreground rovr-focus hover:text-foreground"
          >
            Thought Process
            <ChevronDown aria-hidden className={cn("size-3 transition-transform duration-(--dur-base) ease-out", thoughtsOpen && "rotate-180")} />
          </button>
          {thoughtsOpen && (
            <div className="mt-1 ml-4 border-l-2 border-border pl-3 rovr-enter">
              {thoughts.map((item, index) => (
                <ThoughtStep key={index} item={item} />
              ))}
            </div>
          )}
        </div>
      )}

      <div className={cn("flex w-full items-end gap-2", me ? "justify-end" : "justify-start")}>
        {!me && showAvatar && <Avatar size="sm" name={message.author?.name ?? "Care team"} src={message.author?.avatar} />}
        <div
          className={cn(
            "flex max-w-full min-w-0 flex-col rounded-lg",
            me ? "rounded-br-xs bg-accent text-foreground" : "rounded-bl-xs text-foreground md:max-w-2xl",
            !me && !ai && "bg-secondary",
            // A card or a chart needs the whole row, and shows without a fill behind it.
            !me && message.attachment && "w-full bg-transparent md:max-w-none",
          )}
        >
          {hasText && (
            <div className={cn("px-4 py-2", !me && message.attachment && !ai && "mb-2 self-start rounded-lg rounded-bl-xs bg-secondary md:max-w-2xl")}>
              {ai ? (
                <Prose size="sm">{message.content ?? <p>{message.text}</p>}</Prose>
              ) : (
                <div className="text-body-sm break-words whitespace-pre-wrap">{message.content ?? message.text}</div>
              )}
            </div>
          )}
          {message.attachment}
          {message.via === "text" && (
            <div className="px-2 pt-1 pb-1.5">
              <Badge className="h-5 px-1.5 text-[0.6875rem]">
                <MessageSquareText aria-hidden /> via Text
              </Badge>
            </div>
          )}
          {message.via === "voice" && (
            <div className={cn("flex px-4 pb-2", me && "justify-end")}>
              <Badge tone="info" className="h-5 px-2 text-[0.6875rem]">
                <Mic aria-hidden /> Via Voice
              </Badge>
            </div>
          )}
        </div>
      </div>

      {ai && !!message.text?.trim() && (
        <div className="mt-0 ml-5 flex items-center gap-0.5">
          <CopyButton value={message.text} label="Copy" className="text-subtle-foreground" />
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={speaking ? "Stop" : "Play"}
            aria-pressed={speaking}
            onClick={() => onSpeak?.(message)}
            className={speaking ? "text-accent-foreground" : "text-subtle-foreground"}
          >
            <Volume2 />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Like"
            aria-pressed={reaction === "like"}
            onClick={() => react("like")}
            className={reaction === "like" ? "text-accent-foreground" : "text-subtle-foreground"}
          >
            <ThumbsUp />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Dislike"
            aria-pressed={reaction === "dislike"}
            onClick={() => react("dislike")}
            className={reaction === "dislike" ? "text-accent-foreground" : "text-subtle-foreground"}
          >
            <ThumbsDown />
          </Button>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MessageList                                                                */
/* -------------------------------------------------------------------------- */

export interface MessageListProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  messages: ChatMessageData[];
  /** Shows avatars next to the other side's messages. Off for a thread with Pulse alone, on for a care-team thread. */
  showAvatars?: boolean;
  /** The id of the message being read aloud. */
  speakingId?: string | null;
  /** Called when the play button under a Pulse message is pressed. */
  onSpeak?: (message: ChatMessageData) => void;
  /** Called when a Pulse message is liked or disliked. */
  onReaction?: (message: ChatMessageData, reaction: "like" | "dislike" | null) => void;
  /** Draws a message yourself, for custom message kinds. Return `undefined` to fall back to MessageBubble. */
  renderMessage?: (message: ChatMessageData) => React.ReactNode | undefined;
}

/** The scrolling list of messages. It stays at the newest message as messages arrive. */
export const MessageList = React.forwardRef<HTMLDivElement, MessageListProps>(function MessageList(
  { messages, showAvatars = false, speakingId, onSpeak, onReaction, renderMessage, className, ...props },
  ref,
) {
  const scroller = React.useRef<HTMLDivElement | null>(null);
  const last = messages[messages.length - 1];
  React.useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length, last?.id]);

  return (
    <div
      ref={(el) => {
        scroller.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      role="log"
      aria-label="Messages"
      aria-live="polite"
      tabIndex={0}
      className={cn("flex min-h-0 w-full flex-1 flex-col gap-2 overflow-y-auto rounded-md py-2 pr-2.5 pl-2 rovr-focus", className)}
      {...props}
    >
      {messages.map((message) => (
        <React.Fragment key={message.id}>
          {renderMessage?.(message) ?? (
            <MessageBubble message={message} showAvatar={showAvatars} speaking={speakingId === message.id} onSpeak={onSpeak} onReaction={onReaction} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/* ThinkingIndicator                                                          */
/* -------------------------------------------------------------------------- */

export interface ThinkingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** What Pulse is doing now. When it changes, the previous text moves to the list of finished steps above. */
  thinkingText?: string;
}

/** Three dots and a line of text that is typed out while Pulse works. Finished steps stack above it. */
export function ThinkingIndicator({ thinkingText = "Pulse is thinking...", className, ...props }: ThinkingIndicatorProps) {
  const [steps, setSteps] = React.useState<{ current: string; done: string[] }>({ current: thinkingText, done: [] });
  // A new text finishes the one before it. Compared during render, so no frame shows the old text.
  if (steps.current !== thinkingText) setSteps({ current: thinkingText, done: steps.current ? [...steps.done, steps.current] : steps.done });

  return (
    <div role="status" className={cn("mx-4 mb-3 rounded-lg px-4 py-3 rovr-enter", className)} {...props}>
      {steps.done.length > 0 && (
        <div className="mb-2 ml-6 border-l-2 border-border pl-3">
          {steps.done.map((step, index) => (
            <p key={index} className="py-1 text-caption font-light text-muted-foreground rovr-enter">
              {step}
            </p>
          ))}
        </div>
      )}
      <div className="flex items-center gap-2">
        <TypingDots label="" className="text-primary" />
        <span className="text-body-sm font-light text-muted-foreground">
          <Typewriter as="span" by="char" speed={30} text={thinkingText} />
          <span aria-hidden className="ml-px inline-block h-4 w-0.5 animate-pulse bg-primary align-middle motion-reduce:animate-none" />
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* EmergencyDisclaimer                                                        */
/* -------------------------------------------------------------------------- */

export interface EmergencyDisclaimerProps extends React.HTMLAttributes<HTMLElement> {
  /** `psych` points to the 988 lifeline. `medical` points to 911. */
  kind: "psych" | "medical";
}

const helpLink = (solid: boolean, medical: boolean) =>
  cn(buttonVariants({ size: "sm", variant: medical ? (solid ? "destructive-solid" : "destructive") : solid ? "primary" : "outline" }), "min-w-0");

/** The emergency card shown above the composer when a conversation needs urgent help: a short message and the numbers to call. */
export function EmergencyDisclaimer({ kind, className, ...props }: EmergencyDisclaimerProps) {
  const medical = kind === "medical";
  return (
    <section aria-label="Emergency help" className={cn("mx-auto my-3 flex w-full max-w-[450px] flex-col items-center justify-start gap-2", className)} {...props}>
      <div className={cn("flex w-full items-center justify-start gap-2 rounded-md border p-2", medical ? "border-destructive/30 bg-destructive/5" : "border-primary/30 bg-primary/5")}>
        <div className={cn("flex aspect-square size-16 shrink-0 items-center justify-center rounded-full p-3", medical ? "bg-destructive-solid text-on-solid" : "bg-primary text-primary-foreground")}>
          <Ambulance aria-hidden className="size-8" />
        </div>
        <div className="flex w-full flex-col items-start justify-start gap-1">
          <h2 className={cn("text-title-md", medical ? "text-destructive-fg" : "text-accent-foreground")}>{medical ? "Help is available." : "Help is available. Speak with someone right now."}</h2>
          <p className="text-body-sm font-light text-muted-foreground">
            If you are experiencing a medical emergency or feel that you or someone else is in immediate danger, help is available right now.
          </p>
        </div>
      </div>
      {medical ? (
        <div className="grid w-full grid-cols-2 gap-2">
          <a href="tel:911" className={helpLink(true, true)}>
            <Phone aria-hidden /> Call 911
          </a>
          <a href="https://www.911.gov" target="_blank" rel="noreferrer" className={helpLink(false, true)}>
            <Globe aria-hidden /> Official Website
          </a>
        </div>
      ) : (
        <div className="grid w-full grid-cols-2 gap-2">
          <a href="tel:988" className={helpLink(true, false)}>
            <Phone aria-hidden /> Call 988
          </a>
          <a href="sms:988" className={helpLink(false, false)}>
            <MessageSquareText aria-hidden /> Text 988
          </a>
          <a href="https://chat.988lifeline.org" target="_blank" rel="noreferrer" className={helpLink(false, false)}>
            <MessagesSquare aria-hidden /> Chat with someone
          </a>
          <a href="https://988lifeline.org" target="_blank" rel="noreferrer" className={helpLink(false, false)}>
            <Globe aria-hidden /> Official Website
          </a>
        </div>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Composer                                                                   */
/* -------------------------------------------------------------------------- */

export interface ComposerAttachment {
  id: string;
  /** The file name. */
  name: string;
  /** A picture of the file. Without it the file shows as a name with an icon. */
  previewUrl?: string;
}

export interface ComposerProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  /** The text, when the parent holds it. Leave it out and the composer keeps its own. */
  value?: string;
  /** The starting text when the composer keeps its own. */
  defaultValue?: string;
  /** Called on every change, and with an empty string after a message is sent. */
  onValueChange?: (value: string) => void;
  /** Called with the trimmed text when the send button or Enter is pressed. Shift+Enter adds a line. */
  onSend?: (text: string) => void;
  placeholder?: string;
  /** Turns off the field and every button. */
  disabled?: boolean;
  /** Keeps typing on but blocks sending, for the time a reply is still being written. */
  sendBlocked?: boolean;
  /** Files waiting to be sent, shown above the field. */
  attachments?: ComposerAttachment[];
  /** Called with the files picked through the attach button. */
  onAttach?: (files: File[]) => void;
  /** Called when a waiting file's remove button is pressed. */
  onRemoveAttachment?: (id: string) => void;
  /** The file types the attach button offers, as for an `<input type="file">`. */
  accept?: string;
  /** Whether dictation is listening. The microphone button turns red and pulses. */
  recording?: boolean;
  /** Shows the microphone button and is called when it is pressed. */
  onDictationToggle?: () => void;
  /** Shows the voice-only button and is called when it is pressed. */
  onVoiceMode?: () => void;
  /** A message that must be read before sending, such as "do not share card numbers". It opens under the field. */
  notice?: React.ReactNode;
  /** The one-row composer for care-team chat during a visit: attach, field and send in a single pill. */
  simple?: boolean;
}

/**
 * The message field. The text sits on top; under it the attach, microphone
 * and voice buttons are on the left and send is on the right.
 */
export const Composer = React.forwardRef<HTMLTextAreaElement, ComposerProps>(function Composer(
  {
    value,
    defaultValue = "",
    onValueChange,
    onSend,
    placeholder = "Speak or Type a Message",
    disabled = false,
    sendBlocked = false,
    attachments = [],
    onAttach,
    onRemoveAttachment,
    accept,
    recording = false,
    onDictationToggle,
    onVoiceMode,
    notice,
    simple = false,
    className,
    ...props
  },
  ref,
) {
  const [inner, setInner] = React.useState(defaultValue);
  const text = value ?? inner;
  const file = React.useRef<HTMLInputElement>(null);
  const blocked = disabled || sendBlocked;

  const change = (next: string) => {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  };
  const send = () => {
    if (blocked) return;
    const trimmed = text.trim();
    if (!trimmed && attachments.length === 0) return;
    onSend?.(trimmed);
    change("");
  };

  const field = (
    <Textarea
      ref={ref}
      rows={1}
      value={text}
      disabled={disabled}
      readOnly={disabled}
      aria-label={placeholder}
      placeholder={placeholder}
      onChange={(event) => change(event.target.value)}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
          event.preventDefault();
          send();
        }
      }}
      className={cn(
        "field-sizing-content max-h-[100px] min-h-10 resize-none rounded-none border-0 bg-transparent px-4 font-light",
        "hover:border-0 focus-visible:border-0 focus-visible:shadow-none disabled:bg-transparent",
        simple ? "min-w-0 flex-1 px-2 py-2" : "py-2",
      )}
    />
  );

  const attach = (
    <>
      <input
        ref={file}
        type="file"
        multiple
        hidden
        accept={accept}
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) onAttach?.(files);
          event.target.value = "";
        }}
      />
      <Button variant="secondary" size="icon-sm" aria-label="Attach a file" disabled={disabled} onClick={() => file.current?.click()}>
        <Paperclip />
      </Button>
    </>
  );

  const sendButton = (
    <Button size="icon-sm" aria-label="Send message" disabled={blocked} onClick={send}>
      <SendHorizontal />
    </Button>
  );

  const previews = attachments.length > 0 && (
    <ul aria-label="Files to send" className="flex flex-wrap gap-2 p-2">
      {attachments.map((item) => (
        <li key={item.id} className="relative flex items-center gap-2 rounded-sm bg-secondary p-1.5 pr-9">
          {item.previewUrl ? <Image src={item.previewUrl} alt="" radius="sm" className="size-12" /> : <FileText aria-hidden className="size-5 shrink-0 text-muted-foreground" />}
          <span className="max-w-40 truncate text-caption text-foreground">{item.name}</span>
          <Button variant="ghost" size="icon-sm" aria-label={`Remove ${item.name}`} onClick={() => onRemoveAttachment?.(item.id)} className="absolute top-1/2 right-0.5 -translate-y-1/2">
            <X />
          </Button>
        </li>
      ))}
    </ul>
  );

  const alert = notice && (
    <div role="alert" className="absolute top-full right-0 left-0 z-20 mt-2 rounded-md border border-destructive/40 bg-surface p-3 text-body-sm text-destructive-fg shadow-raised">
      {notice}
    </div>
  );

  if (simple) {
    return (
      <div className={cn("w-full", className)} {...props}>
        {previews}
        <div className="relative my-2.5 flex items-center gap-1 rounded-full border border-border bg-secondary p-[5px] transition-[border-color,box-shadow] duration-(--dur-fast) ease-out focus-within:border-primary">
          {attach}
          {field}
          {sendButton}
          {alert}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full rounded-md border border-input bg-surface transition-[border-color,box-shadow] duration-(--dur-fast) ease-out",
        "focus-within:border-primary focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_22%,transparent)]",
        className,
      )}
      {...props}
    >
      {previews}
      <div className="flex w-full flex-col items-center">
        <div className="relative w-full flex-1">
          {field}
          {alert}
        </div>
        <div className="flex w-full items-center justify-between px-1 pb-1">
          <div className="flex shrink-0 items-center gap-2 pl-1">
            {attach}
            {onDictationToggle && (
              <Button
                variant="secondary"
                size="icon-sm"
                disabled={disabled}
                aria-pressed={recording}
                aria-label={recording ? "Stop recording" : "Start voice dictation"}
                onClick={onDictationToggle}
                className={cn(recording && "animate-pulse bg-destructive-solid text-on-solid hover:bg-destructive-solid motion-reduce:animate-none")}
              >
                <Mic />
              </Button>
            )}
            {onVoiceMode && (
              <Button variant="secondary" size="icon-sm" disabled={disabled} aria-label="Start voice-only mode" onClick={onVoiceMode} className="bg-accent text-accent-foreground hover:bg-accent hover:brightness-95">
                <AudioLines />
              </Button>
            )}
          </div>
          <div className="shrink-0">{sendButton}</div>
        </div>
      </div>
    </div>
  );
});

/* -------------------------------------------------------------------------- */
/* ChatPanel                                                                  */
/* -------------------------------------------------------------------------- */

const PULSE_DISCLAIMER = "Disclaimer: Certain features use AI to support guidance and recommendations. Always confirm medical or health-related decisions with your licensed care team.";

export interface ChatPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop"> {
  messages: ChatMessageData[];
  /** A bar above the messages, such as the agent's name and a close button. */
  header?: React.ReactNode;
  /** Shows a centred spinner in place of the whole panel while the conversation opens. */
  isLoading?: boolean;
  /** The words under the spinner. */
  loadingLabel?: string;
  /** Shows avatars next to the other side's messages, for threads where more than one person can reply. */
  showAvatars?: boolean;
  /** Shows the thinking indicator between the messages and the composer. */
  thinking?: boolean;
  /** What Pulse is doing now, typed out in the thinking indicator. */
  thinkingText?: string;
  /** While there are no messages, shows the greeting in place of the list. */
  shouldHaveInitialMessageUI?: boolean;
  /** The greeting shown with `shouldHaveInitialMessageUI`. */
  initialText?: string;
  /** The picture or video above the greeting. */
  initialMedia?: React.ReactNode;
  /** Shows a line above the composer saying that files can be dropped on the chat. */
  showDropAndDropIndicator?: boolean;
  /** Called with the files dropped on the panel. Dropping is ignored while the chat is locked or frozen. */
  onDropFiles?: (files: File[]) => void;
  /** Shows the emergency card above the composer. */
  emergency?: "psych" | "medical" | false;
  /** The conversation has ended. Messages dim, the composer cannot be used, and a line explains why. */
  frozen?: boolean;
  /** The line shown when the conversation is frozen. */
  frozenText?: string;
  /** Shows the "New Chat" button under the frozen line. */
  onNewChat?: () => void;
  /** The chat is not available yet. The composer dims and says "Coming soon" on hover. */
  locked?: boolean;
  /** Dims and blurs the composer while something else must be finished first. */
  disabled?: boolean;
  /** Content between the composer and the disclaimer, such as suggested questions. */
  otherDetails?: React.ReactNode;
  /** Hides the disclaimer under the composer. */
  hideDisclaimer?: boolean;
  /** Replaces the default AI disclaimer. */
  disclaimer?: React.ReactNode;
  /** Uses the one-row composer, for care-team chat during a visit. */
  simpleComposer?: boolean;
  /** Props for the composer: `onSend`, `attachments`, `onAttach`, `onDictationToggle`, `notice` and so on. */
  composer?: ComposerProps;
  /** Props for the message list: `onSpeak`, `onReaction`, `renderMessage` and so on. */
  list?: Omit<MessageListProps, "messages" | "showAvatars">;
}

/**
 * A whole conversation: the messages, the thinking indicator, and at the bottom
 * the emergency card, the composer and the disclaimer. Files can be dropped
 * anywhere on it. It fills its parent, so give the parent a height.
 */
export function ChatPanel({
  messages,
  header,
  isLoading = false,
  loadingLabel = "Opening conversation…",
  showAvatars = false,
  thinking = false,
  thinkingText,
  shouldHaveInitialMessageUI = false,
  initialText = "Hey! What can I help you with?",
  initialMedia,
  showDropAndDropIndicator = false,
  onDropFiles,
  emergency = false,
  frozen = false,
  frozenText = "This conversation is no longer active. You can start a new chat by clicking below.",
  onNewChat,
  locked = false,
  disabled = false,
  otherDetails,
  hideDisclaimer = false,
  disclaimer = PULSE_DISCLAIMER,
  simpleComposer = false,
  composer,
  list,
  className,
  ...props
}: ChatPanelProps) {
  const [dragging, setDragging] = React.useState(false);
  // Entering a child fires enter before leave, so the depth is counted rather than toggled.
  const depth = React.useRef(0);

  if (isLoading) {
    return (
      <div className={cn("relative size-full min-h-32 flex-1", className)} {...props}>
        <LoadingOverlay delay={250} blur={false} message={loadingLabel} className="bg-transparent" />
      </div>
    );
  }

  const showWelcome = shouldHaveInitialMessageUI && messages.length === 0;
  const blocked = locked || frozen;

  const composerBox = (
    <div
      inert={blocked || disabled}
      aria-disabled={blocked || disabled || undefined}
      className={cn(
        "relative transition-[opacity,filter] duration-(--dur-slow) ease-in-out",
        blocked && "pointer-events-none",
        frozen && "opacity-35",
        locked && !frozen && "opacity-50",
        disabled && !blocked && "pointer-events-none opacity-50 blur-[2px]",
      )}
    >
      <Composer simple={simpleComposer} {...composer} disabled={composer?.disabled || locked} />
    </div>
  );

  return (
    <div
      className={cn("relative flex size-full min-w-0 flex-col items-start justify-start overflow-y-auto", !header && "pt-10 md:pt-6", className)}
      onDragEnter={(event) => {
        event.preventDefault();
        depth.current += 1;
        setDragging(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        depth.current = Math.max(0, depth.current - 1);
        if (depth.current === 0) setDragging(false);
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        depth.current = 0;
        setDragging(false);
        if (blocked) return;
        const files = Array.from(event.dataTransfer.files);
        if (files.length > 0) onDropFiles?.(files);
      }}
      {...props}
    >
      {dragging && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm rovr-enter">
          <p className="flex items-center justify-start gap-1 text-title-lg text-foreground">
            <Upload aria-hidden className="size-5 animate-bounce motion-reduce:animate-none" />
            Drop files here
          </p>
          <p className="text-caption font-light text-muted-foreground">PNG, JPG, PDF up to 10mb</p>
        </div>
      )}

      {header && <div className="w-full shrink-0">{header}</div>}

      {!showWelcome && <MessageList {...list} messages={messages} showAvatars={showAvatars} className={cn(frozen && "opacity-60", list?.className)} />}

      {thinking && !frozen && <ThinkingIndicator thinkingText={thinkingText} />}

      <div className={cn("w-full", showWelcome && "flex min-h-0 flex-1 flex-col")}>
        <div className="relative flex w-full flex-col">
          {showWelcome && (
            <div className="flex w-full flex-col items-center justify-center px-3 pt-4 pb-3">
              {initialMedia}
              <GradientText as="p" variant="pulse" className="pt-2 text-center text-body-sm font-light md:text-display-sm md:font-light">
                {initialText}
              </GradientText>
            </div>
          )}

          {showDropAndDropIndicator && (
            <p className="flex w-full items-center justify-center gap-1 text-center text-caption font-light text-foreground">Drop Files, Medical Records, or other attachments to share with your Care Team</p>
          )}

          <div className="relative w-full p-2">
            {frozen && (
              <div className="flex w-full flex-col items-center gap-3 px-2 pb-3">
                <p className="max-w-md text-center text-body-sm font-light text-muted-foreground">{frozenText}</p>
                {onNewChat && (
                  <Button variant="outline" size="sm" onClick={onNewChat}>
                    <MessageSquarePlus /> New Chat
                  </Button>
                )}
              </div>
            )}
            {emergency && <EmergencyDisclaimer kind={emergency} />}
            <div className="relative w-full">
              {locked ? (
                <Tooltip content="Coming soon" side="top">
                  <div tabIndex={0} className="block w-full cursor-not-allowed rounded-md bg-primary/5 rovr-focus">
                    {composerBox}
                  </div>
                </Tooltip>
              ) : (
                composerBox
              )}
            </div>
          </div>

          {otherDetails && <div className="w-full p-2">{otherDetails}</div>}

          {!hideDisclaimer && <p className="py-3 text-center text-caption font-light text-subtle-foreground">{disclaimer}</p>}
        </div>
      </div>
    </div>
  );
}
