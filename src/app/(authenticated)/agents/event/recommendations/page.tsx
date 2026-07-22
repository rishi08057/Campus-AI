"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import RecommendationCard from "@/components/events/RecommendationCard";
import type { Recommendation } from "@/types/recommendation";
import { apiClient, getRecommendations, getRegisteredEvents, getSavedEvents } from "@/lib/api";
import type { Event } from "@/types/event";

type RecommendationsPageState = {
  recommendations: Recommendation[];
  registeredEventIds: number[];
  savedEventIds: number[];
  loading: boolean;
  error: string | null;
};

export default function RecommendationsPage() {
  const [state, setState] = useState<RecommendationsPageState>({
    recommendations: [],
    registeredEventIds: [],
    savedEventIds: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        const token = typeof document !== 'undefined' && document.cookie.includes('logged_in=true');
        
        const promises: [Promise<Recommendation[]>, Promise<Event[]>?, Promise<Event[]>?] = [
          getRecommendations()
        ];

        if (token) {
          promises.push(getRegisteredEvents());
          promises.push(getSavedEvents());
        }

        const [recommendations, registeredEvents, savedEvents] = await Promise.all(promises);

        setState({
          recommendations: recommendations || [],
          registeredEventIds: registeredEvents ? registeredEvents.map(e => e.id) : [],
          savedEventIds: savedEvents ? savedEvents.map(e => e.id) : [],
          loading: false,
          error: null,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load recommendations";
        setState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <Container className="py-8 sm:py-12">
      <div className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            For You
          </h1>
          <p className="text-lg text-slate-600">
            Personalized event recommendations tailored to your interests
          </p>
        </div>

        {/* Error State */}
        {state.error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-sm font-semibold text-red-700">Unable to load recommendations</p>
            <p className="mt-1 text-sm text-red-600">{state.error}</p>
          </div>
        )}

        {/* Loading Skeletons */}
        {state.loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-3xl border border-slate-200 bg-slate-100 p-6"
                style={{ height: "400px" }}
              />
            ))}
          </div>
        )}

        {/* Recommendations Grid */}
        {!state.loading && state.recommendations.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {state.recommendations.map((recommendation) => (
              <RecommendationCard
                key={`${recommendation.event.id}-${recommendation.reason}`}
                recommendation={recommendation}
                isInitialRegistered={state.registeredEventIds.includes(recommendation.event.id)}
                isInitialSaved={state.savedEventIds.includes(recommendation.event.id)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!state.loading && state.recommendations.length === 0 && !state.error && (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
            <p className="text-lg font-semibold text-slate-700">No recommendations yet</p>
            <p className="mt-2 text-slate-600">
              Visit the chat to get personalized event recommendations
            </p>
          </div>
        )}
      </div>
    </Container>
  );
}
