export type InputAreaProps = {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onClear: () => void;
  loading?: boolean;
  placeholder?: string;
};

export function InputArea({
  value,
  onChange,
  onSend,
  onClear,
  loading = false,
  placeholder = "Write a message...",
}: InputAreaProps) {
  const isDisabled = loading || !value.trim();

  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter sends the message; Shift+Enter keeps the textarea multiline.
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!isDisabled) {
        onSend();
      }
    }
  }

  return (
    <div className="space-y-4 border-t border-slate-200/50 bg-gradient-to-t from-white to-white/95 px-4 py-4 sm:px-5 sm:py-5">
      <label htmlFor="chat-input" className="sr-only">
        Chat message
      </label>

      <textarea
        id="chat-input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={4}
        disabled={loading}
        className="min-h-[100px] w-full resize-y rounded-xl border border-slate-200/70 bg-white/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none backdrop-blur-sm transition focus:border-slate-400 focus:bg-white focus:ring-2 focus:ring-slate-950/5 disabled:cursor-not-allowed disabled:bg-slate-50/50 disabled:text-slate-500"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onSend}
            disabled={isDisabled}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200 ${
              isDisabled 
                ? "cursor-not-allowed bg-slate-200 text-slate-400" 
                : "bg-gradient-to-r from-slate-900 to-slate-950 text-white hover:shadow-lg hover:shadow-slate-900/20 active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Sending
              </>
            ) : (
              <>
                <span>Send</span>
                <span>→</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClear}
            disabled={loading}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        <div className={`text-xs font-medium transition-colors ${value.length > 900 ? "text-red-600" : "text-slate-500"}`}>
          {value.length}/1000
        </div>
      </div>
    </div>
  );
}