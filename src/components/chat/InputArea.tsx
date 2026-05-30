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
    <div className="space-y-4 border-t border-slate-200/80 bg-white/95 p-4 sm:p-5">
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
        className="min-h-[108px] w-full resize-y rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-slate-300 focus:ring-2 focus:ring-slate-950/10"
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSend}
            disabled={isDisabled}
            className={`inline-flex items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold text-white transition ${
              isDisabled ? "cursor-not-allowed bg-slate-300" : "bg-slate-950 hover:bg-slate-800"
            }`}
          >
            {loading ? "Sending..." : "Send"}
          </button>

          <button
            type="button"
            onClick={onClear}
            className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
          >
            Clear chat
          </button>
        </div>

        <div className="text-sm text-slate-500">{value.length}/1000</div>
      </div>
    </div>
  );
}