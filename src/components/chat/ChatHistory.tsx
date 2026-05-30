import { MessageBubble } from "@/components/chat/MessageBubble";

export type Message = {
  role: "user" | "assistant";
  content: string;
};

export type ChatHistoryProps = {
  messages: Message[];
  isTyping?: boolean;
};

export function ChatHistory({ messages, isTyping = false }: ChatHistoryProps) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-1 py-1 sm:gap-5 sm:px-2">
      {messages.length === 0 ? (
        <div className="flex h-full items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-16 text-center text-sm text-slate-500">
          Start the conversation by sending a message.
        </div>
      ) : (
        messages.map((message, index) => (
          <MessageBubble
            key={`${message.role}-${index}-${message.content.slice(0, 20)}`}
            role={message.role}
            content={message.content}
          />
        ))
      )}

      {isTyping ? (
        <div className="flex w-full justify-start">
          <div className="max-w-[85%] rounded-3xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-500 shadow-sm sm:max-w-[75%] sm:px-5 sm:py-4">
            CampusAI is typing...
          </div>
        </div>
      ) : null}
    </div>
  );
}