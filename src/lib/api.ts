import axios from "axios";
import { Event, EventRegistration, EventRegistrationResponse, EventSave, EventSaveResponse } from "@/types/event";
import { UserProfile } from "@/types/user";
import { Recommendation } from "@/types/recommendation";

const FALLBACK_API_BASE_URL = "http://localhost:8000";

export const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || FALLBACK_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

export async function registerForEvent(registration: EventRegistration): Promise<EventRegistrationResponse> {
  const response = await apiClient.post<EventRegistrationResponse>("/events/register", registration);
  return response.data;
}

export async function saveEvent(saveReq: EventSave): Promise<EventSaveResponse> {
  const response = await apiClient.post<EventSaveResponse>("/events/save", saveReq);
  return response.data;
}

export async function getSavedEvents(userId: number = 1): Promise<Event[]> {
  const response = await apiClient.get<Event[]>("/events/saved", { params: { userId } });
  return response.data;
}

export async function getRegisteredEvents(userId: number = 1): Promise<Event[]> {
  const response = await apiClient.get<Event[]>("/events/registered", { params: { userId } });
  return response.data;
}

export async function getRecommendations(): Promise<Recommendation[]> {
  const response = await apiClient.get<Recommendation[]>("/recommendations");
  return response.data;
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>("/profile");
  return response.data;
}
