import { apiClient } from "./client";
import { Recommendation } from "@/types/recommendation";

export async function getRecommendations(): Promise<Recommendation[]> {
  const response = await apiClient.get<Recommendation[]>("/recommendations");
  return response.data;
}
