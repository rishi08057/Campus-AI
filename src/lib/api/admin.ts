import { apiClient } from "./client";


export interface AdminStats {
  total_events: number;
  total_registrations: number;
  total_attendees: number;
  most_popular_event: string | null;
}

export async function getAdminStats(): Promise<AdminStats> {
  const response = await apiClient.get<AdminStats>("/admin/stats");
  return response.data;
}
