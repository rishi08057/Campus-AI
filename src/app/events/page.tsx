"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { apiClient } from "@/lib/api";
import { Event as EventType } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";

type EventsFilter = "all" | string;

function createSkeletonItems(count: number) {
  return Array.from({ length: count }, (_, index) => index);
}

function EventCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.05)] sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="h-6 w-24 animate-pulse rounded-full bg-slate-100" />
        <div className="h-5 w-28 animate-pulse rounded-full bg-slate-100" />
      </div>
      <div className="mt-5 space-y-3">
        <div className="h-7 w-3/4 animate-pulse rounded-xl bg-slate-100" />
        <div className="h-4 w-full animate-pulse rounded-xl bg-slate-100" />
        <div className="h-4 w-11/12 animate-pulse rounded-xl bg-slate-100" />
      </div>
      <div className="mt-5 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="h-3 w-16 animate-pulse rounded-full bg-slate-100" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-100" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-20 animate-pulse rounded-full bg-slate-100" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-slate-100" />
        </div>
      </div>
      <div className="mt-6 h-11 w-full animate-pulse rounded-2xl bg-slate-100 sm:w-36" />
    </div>
  );
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [activeFilter, setActiveFilter] = useState<EventsFilter>("all");

  async function fetchEvents() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<EventType[]>("/events");
      setEvents(res.data || []);
    } catch (err: any) {
      setError(err?.message ?? "Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <Container className="py-12 sm:py-16">
      <header className="mb-8 space-y-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.26em] text-sky-700">
            Events
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Campus events made easier to explore
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
            Search by title, venue, or category, then filter the list to quickly find the events that matter.
          </p>
        </div>

        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white/85 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.05)] backdrop-blur sm:p-5 lg:grid-cols-[minmax(0,1.5fr)_auto] lg:items-center">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-950/10">
            <span className="text-slate-400" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
                <path
                  d="M21 21l-4.3-4.3m1.8-5.2a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search events, venues, or categories"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="flex items-center justify-between gap-3 lg:justify-end">
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveFilter("all");
              }}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white"
            >
              Clear filters
            </button>
            <span className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white">
              {loading ? "Loading..." : `${filteredEvents.length} shown`}
            </span>
          </div>
        </div>

        {!loading && categories.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = activeFilter === category;
              const label = category === "all" ? "All categories" : category;

              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveFilter(category)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-sky-600 text-white shadow-lg shadow-sky-600/20"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-950"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        ) : null}
      </header>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {createSkeletonItems(6).map((index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="space-y-4 rounded-3xl border border-red-100 bg-red-50 p-6 shadow-sm">
          <p className="text-sm font-semibold text-red-700">Error</p>
          <p className="text-sm leading-6 text-red-700">{error}</p>
          <div>
            <button
              onClick={() => fetchEvents()}
              className="rounded-2xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-600 shadow-sm">
          <p className="text-base font-semibold text-slate-900">No matching events found</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Try a different search term or clear the category filter to broaden the list.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredEvents.map((ev) => (
            <EventCard
              key={ev.id}
              title={ev.title}
              description={ev.description}
              venue={ev.venue}
              category={ev.category}
              datetime={ev.datetime}
              registerHref={`/events/${ev.id}/register`}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
