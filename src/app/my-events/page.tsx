"use client";

import { useEffect, useState, useMemo } from "react";
import { Container } from "@/components/ui/Container";
import { getRegisteredEvents, getSavedEvents } from "@/lib/api";
import { Event } from "@/types/event";
import { EventCard } from "@/components/events/EventCard";
import { SearchBar } from "@/components/events/SearchBar";

export default function MyEventsPage() {
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"registered" | "saved">("registered");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [registeredData, savedData] = await Promise.all([
          getRegisteredEvents(),
          getSavedEvents(),
        ]);
        setRegisteredEvents(registeredData);
        setSavedEvents(savedData);
      } catch (err) {
        setError("Failed to load your events.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredEvents = useMemo(() => {
    const events = activeTab === "registered" ? registeredEvents : savedEvents;
    const query = search.trim().toLowerCase();

    if (!query) return events;

    return events.filter((event) =>
      [event.title, event.description, event.venue, event.category]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [activeTab, registeredEvents, savedEvents, search]);

  if (loading) {
    return (
      <Container className="py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-48 bg-slate-100 rounded-lg" />
          <div className="h-12 w-full bg-slate-100 rounded-2xl" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-100 rounded-3xl" />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">My Events</h1>
          <p className="text-slate-600">Manage the events you're attending and those you've saved for later.</p>
        </div>

        {/* Search and Tabs */}
        <div className="space-y-6">
          <SearchBar 
            value={search} 
            onChange={setSearch} 
            placeholder="Search your events..." 
          />

          <div className="flex border-b border-slate-200">
            <button
              onClick={() => setActiveTab("registered")}
              className={`pb-4 px-6 text-sm font-semibold transition-colors relative ${
                activeTab === "registered" 
                  ? "text-sky-600" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Registered ({registeredEvents.length})
              {activeTab === "registered" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`pb-4 px-6 text-sm font-semibold transition-colors relative ${
                activeTab === "saved" 
                  ? "text-sky-600" 
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Saved ({savedEvents.length})
              {activeTab === "saved" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600" />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        {filteredEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <EventCard 
                key={event.id} 
                {...event} 
                isInitialSaved={savedEvents.some(s => s.id === event.id)} 
              />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-lg font-semibold text-slate-900">
              {search ? "No events match your search" : `No ${activeTab} events yet`}
            </p>
            <p className="mt-1 text-slate-500">
              {search 
                ? "Try a different search term." 
                : activeTab === "registered" 
                  ? "Browse events and sign up to see them here." 
                  : "Save events you're interested in to find them easily later."}
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
