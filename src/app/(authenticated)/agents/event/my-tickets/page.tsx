"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { TicketCard } from "@/components/events/TicketCard";
import { getRegisteredEvents, getUserProfile } from "@/lib/api";
import { Event } from "@/types/event";
import { UserProfile } from "@/types/user";

export default function MyTicketsPage() {
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [eventsData, userProfile] = await Promise.all([
          getRegisteredEvents(),
          getUserProfile(),
        ]);
        setRegisteredEvents(eventsData);
        setUser(userProfile);
      } catch (err) {
        setError("Failed to load your tickets. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-10 w-64 bg-slate-100 rounded-lg" />
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-[600px] bg-slate-100 rounded-[2.5rem]" />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="space-y-12">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">My Tickets</h1>
          <p className="text-slate-600">All your registered event passes in one place. Show these at the venue for entry.</p>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">
            {error}
          </div>
        )}

        {/* Content */}
        {registeredEvents.length > 0 && user ? (
          <div className="grid gap-12 lg:grid-cols-2 items-start">
            {registeredEvents.map((event) => {
              const qrData = `campus-ai:ticket:${user.id}:${event.id}`;
              return (
                <div key={event.id} className="space-y-6">
                  <div className="transition-transform duration-300 hover:scale-[1.02]">
                    <TicketCard
                      eventName={event.title}
                      venue={event.venue}
                      event_datetime={event.event_datetime}
                      userName={user.name || "Attendee"}
                      qrData={qrData}
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      href={`/agents/event/tickets/${event.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View & Download Pass
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-[3rem] border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center py-20">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <p className="text-xl font-bold text-slate-950">No tickets found</p>
            <p className="mt-2 text-slate-500">
              You haven&apos;t registered for any events yet.
            </p>
            <Link
              href="/agents/event/events"
              className="mt-8 inline-flex rounded-2xl bg-slate-950 px-8 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Browse Events
            </Link>
          </div>
        )}
      </div>
    </Container>
  );
}
