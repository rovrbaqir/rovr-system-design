import * as React from "react";
import { toast } from "@/components/ui/toast";
import { ChatComposer, ChatMessage, ChatTyping } from "@/components/patterns/chat";
import { Demo } from "../kit";
import type { DocPage } from "../types";

function Thread() {
  const [messages, setMessages] = React.useState<{ from: "self" | "other"; text: string }[]>([
    { from: "other", text: "Your lipid panel is back. LDL is 131 mg/dL, a little above range. I'd like to raise your atorvastatin to 20 mg." },
    { from: "self", text: "Okay. Should I keep taking it in the morning?" },
  ]);
  const [typing, setTyping] = React.useState(false);
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      {messages.map((m, i) => (
        <ChatMessage key={i} from={m.from} author={i === 0 ? "Dr. Ngozi Okafor" : undefined} time={i === 0 ? "10:42" : undefined}>
          {m.text}
        </ChatMessage>
      ))}
      {typing && <ChatTyping label="Dr. Okafor is writing" />}
      <ChatComposer
        className="mt-2"
        placeholder="Message Dr. Okafor"
        onAttach={() => toast.message("Attach a file")}
        onSend={(text) => {
          setMessages((m) => [...m, { from: "self", text }]);
          setTyping(true);
          setTimeout(() => {
            setTyping(false);
            setMessages((m) => [...m, { from: "other", text: "Yes, mornings with food is fine. We'll recheck in 8 weeks." }]);
          }, 1800);
        }}
      />
    </div>
  );
}

function Body() {
  return (
    <>
      <Demo id="chat-thread" files={["patterns/chat", "ui/toast"]} title="A thread" note="Secure threads and Pulse share one bubble and one composer. Send a reply: the typing indicator shows while the other side writes." className="items-start">
        <Thread />
      </Demo>
      <Demo id="chat-messages" files={["patterns/chat"]} title="Messages" note="from sets the side and the fill: self is the signed-in person, other is a clinician, staff member or Pulse. author and time are optional, so a run of messages from one person can name them once." className="flex-col items-stretch gap-3">
        <ChatMessage from="other" author="Pulse" time="08:02">
          Good morning, Amara. Your fasting blood draw is at 08:15 today at 410 Mission St.
        </ChatMessage>
        <ChatMessage from="other">Remember not to eat until it is done. Water is fine.</ChatMessage>
        <ChatMessage from="self" time="08:05">
          Thanks. Can I take my atorvastatin first?
        </ChatMessage>
        <ChatMessage from="other" author="Elise Moreau, NP" time="08:09">
          Yes, take it as usual with water.
        </ChatMessage>
      </Demo>
      <Demo id="chat-typing" files={["patterns/chat"]} title="Typing indicator" note="Three dots while the other side is writing. The label is read to screen readers, so name who is writing." className="flex-col items-start gap-3">
        <ChatTyping />
        <ChatTyping label="Dr. Okafor is writing" />
      </Demo>
      <Demo id="chat-composer" files={["patterns/chat", "ui/toast"]} title="Composer" note="Enter sends and Shift+Enter adds a line. The field grows with the text and the send button lights when there is something to send. Pass onAttach to show the attach button." className="flex-col items-stretch gap-4">
        <ChatComposer onSend={(text) => toast.message("Message sent", { description: text })} />
        <ChatComposer placeholder="Ask Pulse about your results" onAttach={() => toast.message("Attach a file")} onSend={(text) => toast.message("Message sent", { description: text })} />
        <ChatComposer disabled placeholder="This conversation is closed" onAttach={() => {}} onSend={() => {}} />
      </Demo>
    </>
  );
}

export const page: DocPage = {
  slug: "chat",
  title: "Chat",
  group: "Patterns",
  summary: "Message bubbles, a typing indicator and a composer. Use them for secure messaging between patients and the care team and for conversations with Pulse.",
  keywords: "messages messaging thread conversation composer bubble typing pulse assistant",
  Body,
};
