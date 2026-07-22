"use client";

import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Container } from "@/components/ui/Container";
import { apiClient, getEvents, getRegisteredEvents, getSavedEvents } from "@/lib/api";
import { Event as EventType } from "@/types/event";
import { SearchBar } from "@/components/events/SearchBar";
import { EventFilters } from "@/components/events/EventFilters";
import { EventResults } from "@/components/events/EventResults";

type EventsFilter = "all" | string;

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<EventsFilter>("all");
  const [savedEventIds, setSavedEventIds] = useState<number[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<number[]>([]);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = typeof document !== 'undefined' && document.cookie.includes('logged_in=true');
      
      const promises: Promise<any>[] = [
        getEvents(0, 100) // load up to 100 events
      ];
      
      if (token) {
        promises.push(getSavedEvents());
        promises.push(getRegisteredEvents());
      }
      
      const [eventsRes, savedRes, registeredRes] = await Promise.all(promises);
      
      setEvents(eventsRes || []);
      if (token && savedRes && registeredRes) {
        setSavedEventIds(savedRes.map((e: EventType) => e.id));
        setRegisteredEventIds(registeredRes.map((e: EventType) => e.id));
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to load events");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(events.map((event) => event.category).filter(Boolean)));
    return ["all", ...uniqueCategories];
  }, [events]);

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return events.filter((event) => {
      const matchesCategory = activeFilter === "all" || event.category === activeFilter;
      const matchesSearch =
        query.length === 0 ||
        [event.title, event.description, event.venue, event.category]
          .join(" ")
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeFilter, events, search]);

  return (
    <Container className="py-8 sm:py-12 lg:py-16">
      {/* Header */}
      <div className="mb-8 space-y-4 sm:mb-10 lg:mb-12">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-600">
            Event Discovery
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            Find your next event
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base sm:leading-8">
            Search, discover, and register for campus events tailored to your interests.
          </p>
        </div>
      </div>

      {/* Search Section */}
      <div className="mb-8 space-y-4 sm:mb-10 lg:mb-12">
        <SearchBar
          value={search}
          onChange={setSearch}
          onClear={() => setActiveFilter("all")}
          isLoading={loading}
        />

        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div />
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setActiveFilter("all");
            }}
            disabled={loading || (search === "" && activeFilter === "all")}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset filters
          </button>
        </div>
      </div>

      {/* Filters */}
      {categories.length > 1 && (
        <div className="mb-8 sm:mb-10 lg:mb-12">
          <EventFilters
            categories={categories}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            isLoading={loading}
            resultsCount={filteredEvents.length}
          />
        </div>
      )}

      {/* Results */}
      <EventResults
        events={filteredEvents}
        isLoading={loading}
        error={error}
        onRetry={fetchEvents}
        isSearching={search.length > 0}
        savedEventIds={savedEventIds}
        registeredEventIds={registeredEventIds}
      />
    </Container>
  );
}
