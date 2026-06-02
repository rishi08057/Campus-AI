type MessageRole = "user" | "assistant";

export type MessageBubbleProps = {
  role: MessageRole;
  content: string;
  timestamp?: number;
};

function formatMessageTime(timestamp?: number): string {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === "user";
  const timeString = formatMessageTime(timestamp);

  return (
    <div className={`flex w-full flex-col gap-1.5 animate-fadeInUp ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`flex max-w-full flex-col gap-2 rounded-2xl px-4 py-3 text-sm leading-6 shadow-md transition-all duration-200 hover:shadow-lg sm:max-w-[85%] sm:px-5 sm:py-4 md:max-w-[70%] lg:max-w-[60%] ${
          isUser
            ? "rounded-br-none bg-gradient-to-r from-slate-900 to-slate-950 text-white"
            : "rounded-bl-none border border-slate-200/60 bg-white shadow-sm"
        }`}
      >
        <div className="whitespace-pre-wrap break-words text-slate-900">{content}</div>
        {timeString ? (
          <div
            className={`text-xs font-medium tracking-wide ${
              isUser ? "text-slate-300" : "text-slate-500"
            }`}
          >
            {timeString}
          </div>
        ) : null}
      </div>
    </div>
  );
}