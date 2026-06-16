import { apiClient } from "./client";
import { Event } from "@/types/event";

export interface AdminStats {
  totalEvents: number;
  totalRegistrations: number;
  totalUsers: number;
  avgAttendance: number;
  recentEvents: Array<Event & { registrationsCount: number; capacity: number }>;
}

export async function getAdminStats(): Promise<AdminStats> {
  // Mock aggregation logic
  const eventsResponse = await apiClient.get<Event[]>("/events");
  const events = eventsResponse.data;

  return {
    totalEvents: events.length,
    totalRegistrations: events.length * 15 + 42, // Mocked total
    totalUsers: 1250, // Mocked total
    avgAttendance: 88, // Mocked percentage
    recentEvents: events.map(e => ({
      ...e,
      registrationsCount: Math.floor(Math.random() * 50) + 10,
      capacity: 100,
    })),
  };
}
