"use client";

import React, { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { apiClient } from "@/lib/api";
import { Event as EventType } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";

export default function EventsPage() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchEvents() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<EventType[]>('/events');
      setEvents(res.data || []);
    } catch (err: any) {
      setError(err?.message ?? 'Failed to load events');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="py-12">
      <header className="mb-6">
        <h1 className="text-3xl font-semibold text-slate-900">Events</h1>
        <p className="mt-2 text-sm text-slate-600">Upcoming and past events from the CampusAI API.</p>
      </header>

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-40 rounded-2xl bg-slate-100" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="space-y-4 rounded-2xl border border-red-100 bg-red-50 p-6">
          <p className="text-sm font-semibold text-red-700">Error</p>
          <p className="text-sm text-red-700">{error}</p>
          <div>
            <button
              onClick={() => fetchEvents()}
              className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
            >
              Retry
            </button>
          </div>
        </div>
      ) : events.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
          No events found.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((ev) => (
            <EventCard
              key={ev.id}
              title={ev.title}
              description={ev.description}
              venue={ev.location ?? 'TBA'}
              category={ev.organizer ?? ev.status}
              datetime={ev.startAt}
              registerHref={`/events/${ev.id}/register`}
            />
          ))}
        </div>
      )}
    </Container>
  );
}
