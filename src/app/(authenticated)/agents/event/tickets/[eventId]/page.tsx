"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { TicketCard } from "@/components/events/TicketCard";
import { getRegisteredEvents, getUserProfile } from "@/lib/api";
import { Event } from "@/types/event";
import { UserProfile } from "@/types/user";

export default function TicketPage() {
  const { eventId } = useParams();
  const router = useRouter();
  const [event, setEvent] = useState<Event | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!eventId) return;

      try {
        setLoading(true);
        const [registeredEvents, userProfile] = await Promise.all([
          getRegisteredEvents(),
          getUserProfile(),
        ]);

        const foundEvent = registeredEvents.find((e) => e.id === Number(eventId));
        
        if (!foundEvent) {
          setError("Ticket not found. You might not be registered for this event.");
        } else {
          setEvent(foundEvent);
          setUser(userProfile);
        }
      } catch (err) {
        setError("Failed to load ticket details.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [eventId]);

  if (loading) {
    return (
      <Container className="py-24">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          <p className="text-slate-500 font-medium">Preparing your ticket...</p>
        </div>
      </Container>
    );
  }

  if (error || !event || !user) {
    return (
      <Container className="py-24">
        <div className="mx-auto max-w-md rounded-3xl border border-red-100 bg-red-50 p-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-slate-900">Oops!</h2>
          <p className="mt-2 text-slate-600">{error || "Something went wrong."}</p>
          <button
            onClick={() => router.push("/events")}
            className="mt-6 inline-flex rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Events
          </button>
        </div>
      </Container>
    );
  }

  const qrData = `campus-ai:ticket:${user.id}:${event.id}`;

  return (
    <Container className="py-12 sm:py-20">
      <div className="mb-12 text-center space-y-4">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-950 transition"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Your Event Ticket
        </h1>
        <p className="text-slate-600">
          Present this ticket at the entrance for verification.
        </p>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        <TicketCard
          eventName={event.title}
          venue={event.venue}
          datetime={event.datetime}
          userName={user.name}
          qrData={qrData}
        />
      </div>

      <div className="mt-12 flex flex-col items-center justify-center gap-4">
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 sm:w-auto"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2h2m2 4h10a2 2 0 002-2v-4a2 2 0 012-2H7a2 2 0 01-2 2v4a2 2 0 002 2z" />
          </svg>
          Print or Save PDF
        </button>
        <p className="max-w-xs text-center text-xs text-slate-400">
          We recommend taking a screenshot of this ticket for offline access.
        </p>
      </div>
    </Container>
  );
}
