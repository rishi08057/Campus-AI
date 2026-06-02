import { MessageBubble } from "@/components/chat/MessageBubble";
import type { ChatMessage } from "@/types/chat";

export type Message = ChatMessage;

export type ChatHistoryProps = {
  messages: Message[];
};

export function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-1 py-1 sm:gap-5 sm:px-2">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center text-sm text-slate-500">
          Start the conversation by sending a message.
        </div>
      ) : (
        messages.map((message, index) => (
          <MessageBubble
            key={`${message.role}-${message.timestamp || index}`}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))
      )}
    </div>
  );
}