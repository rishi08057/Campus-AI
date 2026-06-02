import type { Event } from "./event";

export type RecommendationReason =
  | "category-match"
  | "trending"
  | "personalized"
  | "new"
  | "nearby"
  | "popular";

export interface Recommendation {
  event: Event;
  reason: RecommendationReason;
  confidence?: number;
  score?: number;
}

export function getRecommendationLabel(reason: RecommendationReason): string {
  const labels: Record<RecommendationReason, string> = {
    "category-match": "Matches your interests",
    trending: "Trending right now",
    personalized: "Personalized for you",
    new: "Just added",
    nearby: "Near you",
    popular: "Popular event",
  };

  return labels[reason] || "Recommended";
}

export function getRecommendationBadgeColor(
  reason: RecommendationReason
): "sky" | "emerald" | "amber" | "purple" | "rose" {
  const colors: Record<RecommendationReason, "sky" | "emerald" | "amber" | "purple" | "rose"> = {
    "category-match": "sky",
    trending: "rose",
    personalized: "purple",
    new: "emerald",
    nearby: "amber",
    popular: "sky",
  };

  return colors[reason] || "sky";
}
