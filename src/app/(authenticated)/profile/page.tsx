"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { getUserProfile, getSavedEvents, getRegisteredEvents } from "@/lib/api";
import { UserProfile } from "@/types/user";
import { EventCard } from "@/components/events/EventCard";
import { Event } from "@/types/event";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [savedEvents, setSavedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [profileData, registeredData, savedData] = await Promise.all([
          getUserProfile(),
          getRegisteredEvents(),
          getSavedEvents(),
        ]);
        
        setProfile(profileData);
        setRegisteredEvents(registeredData);
        setSavedEvents(savedData);
      } catch (err) {
        setError("Failed to load profile information.");
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
          <div className="h-64 bg-slate-100 rounded-3xl" />
          <div className="space-y-4">
            <div className="h-8 w-48 bg-slate-100 rounded-lg" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !profile) {
    return (
      <Container className="py-12">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">{error || "User not found"}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="space-y-12">
        {/* Student Information Card */}
        <section>
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-32 bg-gradient-to-r from-sky-500 to-indigo-600" />
            <div className="px-6 pb-8 sm:px-8">
              <div className="relative -mt-12 mb-6">
                <div className="inline-flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-slate-100 text-3xl font-bold text-slate-400 shadow-sm">
                  {profile.name ? profile.name.charAt(0) : "?"}
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-slate-950">{profile.name || "Student"}</h1>
                    <p className="text-lg text-slate-600">{profile.department || "Undeclared Department"}</p>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span>{profile.year}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((interest) => (
                      <span key={interest} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Registered Events Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-950">Registered Events</h2>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-bold text-sky-700">
              {registeredEvents.length} Events
            </span>
          </div>
          {registeredEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {registeredEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  {...event} 
                  isInitialSaved={savedEvents.some(s => s.id === event.id)}
                  isInitialRegistered={true}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
              <p className="text-slate-500">You haven't registered for any events yet.</p>
            </div>
          )}
        </section>

        {/* Saved Events Section */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-slate-950">Saved for Later</h2>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              {savedEvents.length} Events
            </span>
          </div>
          {savedEvents.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {savedEvents.map((event) => (
                <EventCard 
                  key={event.id} 
                  {...event} 
                  isInitialSaved={true} 
                  isInitialRegistered={registeredEvents.some(r => r.id === event.id)}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <p className="text-slate-500">Your saved events will appear here.</p>
            </div>
          )}
        </section>
      </div>
    </Container>
  );
}
