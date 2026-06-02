import { MessageBubble } from "@/components/chat/MessageBubble";
import type { ChatMessage } from "@/types/chat";

export type Message = ChatMessage;

export type ChatHistoryProps = {
  messages: Message[];
};

export function ChatHistory({ messages }: ChatHistoryProps) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto px-2 py-4 sm:gap-5 sm:px-4 sm:py-6">
      {messages.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center space-y-6 px-4 py-12 text-center">
          <div className="space-y-4">
            <div className="animate-fadeIn">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-100 to-emerald-100 text-2xl">
                💬
              </div>
            </div>
            <div className="space-y-2 animate-fadeIn" style={{ animationDelay: "0.1s" }}>
              <h3 className="text-lg font-semibold text-slate-900">Start a conversation</h3>
              <p className="text-sm text-slate-500">
                Ask me about campus events, get personalized recommendations, or just chat!
              </p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-2 pt-4" style={{ animationDelay: "0.2s" }}>
            {["🎉 Find events", "🎓 Get tips", "✨ Explore"].map((suggestion) => (
              <div
                key={suggestion}
                className="rounded-full border border-slate-200 bg-white/50 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur-sm"
              >
                {suggestion}
              </div>
            ))}
          </div>
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