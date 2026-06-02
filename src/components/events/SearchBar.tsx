import React from "react";

export type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
  isLoading?: boolean;
};

export function SearchBar({
  value,
  onChange,
  placeholder = "Search events, venues, or categories...",
  onClear,
  isLoading = false,
}: SearchBarProps) {
  return (
    <div className="relative flex w-full items-center gap-3 rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/50 px-4 py-3 shadow-sm transition-all focus-within:border-slate-400 focus-within:ring-2 focus-within:ring-sky-500/10 hover:border-slate-300/70 sm:px-5 sm:py-4">
      <span className="flex-shrink-0 text-slate-400" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
          <path d="m20 20-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        disabled={isLoading}
        className="flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            onClear?.();
          }}
          disabled={isLoading}
          className="flex-shrink-0 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
          aria-label="Clear search"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.3 5.7L5.7 18.3M5.7 5.7L18.3 18.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}

export default SearchBar;
