import { MessageBubble } from "@/components/chat/MessageBubble";
import type { ChatMessage } from "@/types/chat";

export type Message = ChatMessage;

export type ChatHistoryProps = {
  messages: Message[];
  quickActions?: { label: string; prompt: string }[];
  onQuickAction?: (prompt: string) => void;
  emptySubtitle?: string;
};

export function ChatHistory({ messages, quickActions, onQuickAction, emptySubtitle }: ChatHistoryProps) {
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
                {emptySubtitle || "Ask me about campus events, get personalized recommendations, or just chat!"}
              </p>
            </div>
          </div>
          {quickActions && quickActions.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg pt-4 animate-fadeIn" style={{ animationDelay: "0.2s" }}>
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => onQuickAction?.(action.prompt)}
                  className="flex flex-col text-left p-4 rounded-2xl border border-slate-200 bg-white/50 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm hover:shadow active:scale-[0.98]"
                >
                  <span className="text-sm font-semibold text-slate-950">{action.label}</span>
                  <span className="text-xs text-slate-500 mt-1 line-clamp-2">{action.prompt}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap justify-center gap-2 pt-4" style={{ animationDelay: "0.2s" }}>
              {["🎉 Find events", "🎓 Get tips", "✨ Explore"].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => onQuickAction?.(suggestion.replace(/^[^a-zA-Z0-9\s]+/, "").trim())}
                  disabled={!onQuickAction}
                  className={`rounded-full border border-slate-200 bg-white/50 px-3 py-1 text-xs font-medium text-slate-600 backdrop-blur-sm transition-all ${
                    onQuickAction ? "hover:bg-slate-50 hover:border-slate-300 active:scale-95 cursor-pointer" : "cursor-default"
                  }`}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
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