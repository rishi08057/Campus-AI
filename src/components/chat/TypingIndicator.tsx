export function TypingIndicator() {
  return (
    <div className="flex w-full justify-start animate-fadeInUp">
      <div className="max-w-full flex-1 rounded-2xl rounded-bl-none border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white px-4 py-3 shadow-md sm:max-w-[85%] sm:px-5 sm:py-4 md:max-w-[70%] lg:max-w-[60%]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2" aria-hidden="true">
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-gradient-to-r from-sky-400 to-sky-500 [animation-delay:-0.2s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 [animation-delay:-0.1s]" />
            <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-gradient-to-r from-purple-400 to-purple-500" />
          </div>
          <p className="text-sm font-medium leading-6 text-slate-600">CampusAI is thinking...</p>
        </div>
      </div>
    </div>
  );
}
