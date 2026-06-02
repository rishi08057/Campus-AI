import React from "react";

export type EventFiltersProps = {
  categories: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  isLoading?: boolean;
  resultsCount?: number;
};

export function EventFilters({
  categories,
  activeFilter,
  onFilterChange,
  isLoading = false,
  resultsCount = 0,
}: EventFiltersProps) {
  if (categories.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Filter by category
        </span>

        {resultsCount > 0 && (
          <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
            {resultsCount} result{resultsCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const isActive = activeFilter === category;
          const label = category === "all" ? "All categories" : category;

          return (
            <button
              key={category}
              type="button"
              onClick={() => onFilterChange(category)}
              disabled={isLoading}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-sky-500 to-sky-600 text-white shadow-lg shadow-sky-500/20"
                  : "border border-slate-200/70 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900 active:bg-slate-50 disabled:opacity-50"
              }`}
            >
              {isActive && (
                <span className="flex h-1.5 w-1.5 rounded-full bg-white" />
              )}
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default EventFilters;