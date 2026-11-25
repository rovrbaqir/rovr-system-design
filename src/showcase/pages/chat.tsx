import * as React from "react";
import { MessageSquarePlus } from "lucide-react";
import { ChatPanel, Composer, EmergencyDisclaimer, ThinkingIndicator, type ChatMessageData, type ComposerAttachment } from "@/components/patterns/chat";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Demo } from "../kit";
import type { DocPage } from "../types";

const chatFiles = [
  "patterns/chat",
  "ui/avatar",
  "ui/badge",
  "ui/button",
  "ui/copy-button",
  "ui/gradient-text",
  "ui/image",
  "ui/input",
  "ui/loading-overlay",
  "ui/prose",
  "ui/spinner",
  "ui/tooltip",
  "ui/typewriter",
];

// Drawn here as an SVG data URI, so the page needs no network. A data URI
// cannot read CSS variables, so the brand colours from rovr.css are repeated.
const orb = `data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">` +
    `<defs><radialGradient id="orb" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#a0aeff"/><stop offset="0.55" stop-color="#546eff"/><stop offset="1" stop-color="#c13bff"/></radialGradient></defs>` +
    `<circle cx="120" cy="120" r="104" fill="url(#orb)"/><circle cx="88" cy="84" r="36" fill="#ffffff" opacity="0.22"/></svg>`,
)}`;

const pulseThread: ChatMessageData[] = [
  { id: "p1", from: "me", text: "My lipid panel came back. What does an LDL of 131 mean?" },
  {
    id: "p2",
    from: "other",
    ai: true,
    text: "Your LDL is 131 mg/dL. That is a little above the range most adults aim for.\n\n- Under 100 mg/dL is the usual goal\n- 100 to 129 is near the goal\n- 130 to 159 is borderline high\n\nIt is down from 148 in August, so the atorvastatin is working. Dr. Okafor will review the result at your visit on 3 December.",
    content: (
      <>
        <p>
          Your LDL is <strong>131 mg/dL</strong>. That is a little above the range most adults aim for.
        </p>
        <ul>
          <li>Under 100 mg/dL is the usual goal</li>
          <li>100 to 129 is near the goal</li>
          <li>130 to 159 is borderline high</li>
        </ul>
        <p>It is down from 148 in August, so the atorvastatin is working. Dr. Okafor will review the result at your visit on 3 December.</p>
      </>
    ),
    thoughtProcess: [
      { text: "Read the lipid panel from 12 November", description: "LDL 131 mg/dL, HDL 52 mg/dL, triglycerides 140 mg/dL, fasting." },
      { text: "Compared it with the panel from August" },
      { text: "Checked current medications" },
    ],
  },
  { id: "p3", from: "me", text: "Should I change anything before the visit?", via: "voice" },
];

const pulseReply = (id: string): ChatMessageData => ({
  id,
  from: "other",
  ai: true,
  text: "Keep taking atorvastatin 20 mg each morning. Two things help before a recheck:\n\n1. Fast for 9 to 12 hours before the blood draw\n2. Write down any muscle pain so you can tell Dr. Okafor",
  content: (
    <>
      <p>Keep taking atorvastatin 20 mg each morning. Two things help before a recheck:</p>
      <ol>
        <li>Fast for 9 to 12 hours before the blood draw</li>
        <li>Write down any muscle pain so you can tell Dr. Okafor</li>
      </ol>
    </>
  ),
  thoughtProcess: [{ text: "Reading your medication list" }, { text: "Checking the care plan from your last visit" }],
});

function PulseChat() {
  const [messages, setMessages] = React.useState(pulseThread);
  const [thought, setThought] = React.useState<string | null>(null);
  const [recording, setRecording] = React.useState(false);
  const [files, setFiles] = React.useState<ComposerAttachment[]>([]);
  const [speakingId, setSpeakingId] = React.useState<string | null>(null);
  const timers = React.useRef<number[]>([]);
  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const addFiles = (picked: File[]) => setFiles((current) => [...current, ...picked.map((file, i) => ({ id: `${Date.now()}-${i}`, name: file.name }))]);

  const send = (text: string) => {
    const id = String(Date.now());
    const sent = files.length > 0 && !text ? `Sent ${files.length} ${files.length === 1 ? "file" : "files"}` : text;
    setMessages((current) => [...current, { id, from: "me", text: sent }]);
    setFiles([]);
    setRecording(false);
    setThought("Pulse is thinking...");
    timers.current.push(
      window.setTimeout(() => setThought("Reading your medication list"), 1200),
      window.setTimeout(() => setThought("Checking the care plan from your last visit"), 2600),
      window.setTimeout(() => {
        setThought(null);
        setMessages((current) => [...current, pulseReply(`${id}-reply`)]);
      }, 4200),
    );
  };

  return (
    <div className="h-[40rem] w-full overflow-hidden rounded-xl rovr-risen">
      <ChatPanel
        messages={messages}
        header={
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
            <p className="text-title-sm">Pulse</p>
            <Button variant="secondary" size="sm" onClick={() => setMessages([])}>
              <MessageSquarePlus /> New Chat
            </Button>
          </div>
        }
        thinking={thought !== null}
        thinkingText={thought ?? undefined}
        shouldHaveInitialMessageUI
        initialText="Hey Amara! What can I help you with?"
        initialMedia={<img src={orb} alt="" className="size-28" />}
        onDropFiles={addFiles}
        list={{
          speakingId,
          onSpeak: (message) => setSpeakingId((current) => (current === message.id ? null : message.id)),
        }}
        composer={{
          onSend: send,
          sendBlocked: thought !== null,
          attachments: files,
          onAttach: addFiles,
          onRemoveAttachment: (id) => setFiles((current) => current.filter((file) => file.id !== id)),
          recording,
          onDictationToggle: () => setRecording((on) => !on),
          onVoiceMode: () => toast.message("Voice-only mode"),
        }}
      />
    </div>
  );
}

const careThread: ChatMessageData[] = [
  { id: "c1", from: "other", author: { name: "Elise Moreau, NP" }, text: "Hi Amara, this is Elise from Dr. Okafor's team. Your visit starts in ten minutes." },
  { id: "c2", from: "me", text: "Thanks. I have my blood pressure readings from this week ready.", via: "text" },
  { id: "c3", from: "other", author: { name: "Dr. Ngozi Okafor, MD" }, text: "Good. Please send a photo of the log if you can, so I can add it to your chart." },
];

function CareTeamChat() {
  const [messages, setMessages] = React.useState(careThread);
  return (
    <div className="h-[30rem] w-full overflow-hidden rounded-xl rovr-risen">
      <ChatPanel
        messages={messages}
        showAvatars
        simpleComposer
        showDropAndDropIndicator
        onDropFiles={(files) => toast.message(`${files.length} ${files.length === 1 ? "file" : "files"} ready to share`)}
        disclaimer="Message your core RoVR clinical care team for all medical questions."
        composer={{
          placeholder: "Message your care team",
          onSend: (text) => setMessages((current) => [...current, { id: String(Date.now()), from: "me", text }]),
          onAttach: (files) => toast.message(`${files.length} ${files.length === 1 ? "file" : "files"} ready to share`),
        }}
      />
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo
        id="chat-pulse"
        files={[...chatFiles, "ui/toast"]}
        title="Chat with Pulse"
        note="The whole panel: an optional header, the messages, the thinking indicator and the composer with the disclaimer under it. Send a message to see Pulse think and answer. Pulse answers render through Prose and carry the thought process above and the copy, play, like and dislike row below. New Chat empties the thread and shows the greeting. Drop a file anywhere on the panel."
        bare
        className="items-stretch"
      >
        <PulseChat />
      </Demo>
      <Demo
        id="chat-care-team"
        files={[...chatFiles, "ui/toast"]}
        title="Care-team chat"
        note="With more than one person on the other side, showAvatars puts a face next to each message and their messages get a fill. simpleComposer is the one-row composer used during a visit. A message that came in by SMS carries a via Text tag."
        bare
        className="items-stretch"
      >
        <CareTeamChat />
      </Demo>
      <Demo
        id="chat-states"
        files={chatFiles}
        title="Ended, locked and loading"
        note="A frozen conversation dims its messages, explains why, and offers a new chat. A locked chat keeps the composer in view and says Coming soon on hover. While the conversation opens, a spinner takes the panel's place after a short delay."
        bare
        className="items-stretch gap-4"
      >
        <div className="h-[26rem] min-w-72 flex-1 overflow-hidden rounded-xl rovr-risen">
          <ChatPanel messages={pulseThread.slice(0, 2)} frozen frozenText="Your Clinical Intake has been completed. You can start a new chat by clicking below." onNewChat={() => {}} hideDisclaimer />
        </div>
        <div className="h-[26rem] min-w-72 flex-1 overflow-hidden rounded-xl rovr-risen">
          <ChatPanel messages={[]} shouldHaveInitialMessageUI initialMedia={<img src={orb} alt="" className="size-24" />} locked />
        </div>
        <div className="h-[26rem] min-w-72 flex-1 overflow-hidden rounded-xl rovr-risen">
          <ChatPanel messages={[]} isLoading loadingLabel="Starting a new chat…" />
        </div>
      </Demo>
      <Demo
        id="chat-emergency"
        files={["patterns/chat", "ui/button"]}
        title="Emergency disclaimer"
        note="Shown above the composer when a conversation needs urgent help. psych points to the 988 lifeline and medical to 911. In ChatPanel, set the emergency prop."
        className="items-start gap-6"
      >
        <EmergencyDisclaimer kind="psych" className="mx-0 my-0" />
        <EmergencyDisclaimer kind="medical" className="mx-0 my-0" />
      </Demo>
      <Demo
        id="chat-composer"
        files={["patterns/chat", "ui/button", "ui/image", "ui/input", "ui/spinner", "ui/typewriter", "ui/toast"]}
        title="Composer and thinking indicator"
        note="Enter sends and Shift+Enter adds a line. Waiting files sit above the field. The microphone turns red while dictation listens, and a notice opens under the field when something must not be sent. The thinking indicator types out what Pulse is doing."
        className="flex-col items-stretch gap-6"
      >
        <Composer
          recording
          onDictationToggle={() => {}}
          onVoiceMode={() => {}}
          attachments={[
            { id: "a1", name: "blood-pressure-log.pdf" },
            { id: "a2", name: "insurance-card-front.jpg" },
          ]}
          onSend={(text) => toast.message("Message sent", { description: text })}
        />
        <div className="pb-20">
          <Composer
            defaultValue="My card number is 4242 4242 4242 4242"
            onDictationToggle={() => {}}
            notice="For your security, please don't share card numbers in chat. You can pay on the Payments page."
            sendBlocked
          />
        </div>
        <Composer simple placeholder="Message your care team" onSend={(text) => toast.message("Message sent", { description: text })} />
        <ThinkingIndicator thinkingText="Reading your lipid panel from 12 November" className="mx-0 mb-0" />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "chat",
  title: "Chat",
  group: "Examples",
  summary:
    "Patient app. Replaces PulseChatUi and CustomMessageInput, with their message, thinking indicator and emergency disclaimer. Used for Pulse, care-team and front-desk conversations in check-in, mission control, mobile and telehealth. Takes messages and callbacks as props, with no chat SDK.",
  keywords: "messages messaging thread conversation composer bubble typing thinking pulse assistant ai emergency disclaimer 988 911 attachments dictation",
  Body,
};
