"use client";

import { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import RecommendationCard from "@/components/events/RecommendationCard";
import type { Recommendation } from "@/types/recommendation";
import ApiClient from "@/lib/api";

type RecommendationsPageState = {
  recommendations: Recommendation[];
  loading: boolean;
  error: string | null;
};

export default function RecommendationsPage() {
  const [state, setState] = useState<RecommendationsPageState>({
    recommendations: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setState((prev) => ({ ...prev, loading: true, error: null }));

        // Fetch events first (since we need them as the base)
        const eventsResponse = await ApiClient.get("/events");
        const events = Array.isArray(eventsResponse.data) ? eventsResponse.data : [];

        // In a real scenario, you'd have a dedicated /recommendations endpoint
        // For now, we'll create sample recommendations from the fetched events
        const recommendations: Recommendation[] = events.slice(0, 6).map((event, index) => ({
          event,
          reason: [
            "category-match",
            "trending",
            "personalized",
            "new",
            "nearby",
            "popular",
          ][index % 6] as const,
          confidence: 0.65 + Math.random() * 0.3,
        }));

        setState({
          recommendations,
          loading: false,
          error: null,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load recommendations";
        setState({
          recommendations: [],
          loading: false,
          error: errorMessage,
        });
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
