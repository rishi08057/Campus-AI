export function TypingIndicator() {
  return (
    <div className="flex w-full justify-start">
      <div className="max-w-[85%] rounded-3xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm sm:max-w-[75%] sm:px-5 sm:py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.2s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.1s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-slate-400" />
          </div>
          <p className="text-sm font-medium leading-6 text-slate-500">CampusAI is typing...</p>
        </div>
      </div>
    </div>
  );
}
