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
    <div className={`flex w-full flex-col ${isUser ? "items-end" : "items-start"}`}>
      <div
        className={`flex max-w-[85%] flex-col gap-1.5 rounded-3xl px-4 py-3 text-sm leading-6 shadow-sm sm:max-w-[75%] sm:px-5 sm:py-4 ${
          isUser
            ? "rounded-br-md bg-slate-950 text-white"
            : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{content}</div>
        {timeString ? (
          <div
            className={`text-xs font-medium ${
              isUser ? "text-slate-400" : "text-slate-500"
            }`}
          >
            {timeString}
          </div>
        ) : null}
      </div>
    </div>
  );
}