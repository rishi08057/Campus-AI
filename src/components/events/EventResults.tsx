import React from "react";
import { EventCard } from "@/components/events/EventCard";
import type { Event } from "@/types/event";

export type EventResultsProps = {
  events: Event[];
  isLoading: boolean;
  error: string | null;
  onRetry?: () => void;
  isSearching?: boolean;
};

function EventCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="h-6 w-24 rounded-full bg-slate-100" />
        <div className="h-5 w-28 rounded-full bg-slate-100" />
      </div>
      <div className="mt-5 space-y-3">
        <div className="h-7 w-3/4 rounded-xl bg-slate-100" />
        <div className="h-4 w-full rounded-xl bg-slate-100" />
        <div className="h-4 w-11/12 rounded-xl bg-slate-100" />
      </div>
      <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="h-3 w-16 rounded-full bg-slate-100" />
          <div className="h-4 w-5/6 rounded-full bg-slate-100" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-20 rounded-full bg-slate-100" />
          <div className="h-4 w-5/6 rounded-full bg-slate-100" />
        </div>
      </div>
      <div className="mt-6 h-11 w-full rounded-2xl bg-slate-100 sm:w-36" />
    </div>
  );
}

export function EventResults({
  events,
  isLoading,
  error,
  onRetry,
  isSearching = false,
}: EventResultsProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <EventCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="rounded-2xl border border-red-200/70 bg-gradient-to-br from-red-50 to-red-50/50 p-6 shadow-sm sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-lg">
            ⚠️
          </div>
          <div className="flex-1">
            <p className="font-semibold text-red-900">Unable to load events</p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (events.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-slate-50 to-slate-50/50 p-8 text-center shadow-sm sm:p-12">
        <div className="space-y-3">
          <div className="text-3xl">🔍</div>
          <div>
            <p className="font-semibold text-slate-900">
              {isSearching ? "No events match your search" : "No events found"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isSearching
                ? "Try adjusting your search terms or filters to find what you're looking for."
                : "Events will appear here once they're available."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Results grid
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <div key={event.id} className="animate-fadeInUp">
          <EventCard
            title={event.title}
            description={event.description}
            venue={event.venue}
            category={event.category}
            datetime={event.datetime}
            registerHref={`/events/${event.id}/register`}
          />
        </div>
      ))}
    </div>
  );
}

export default EventResults;
