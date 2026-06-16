import { apiClient } from "./client";
import { Event, EventRegistration, EventRegistrationResponse, EventSave, EventSaveResponse } from "@/types/event";

export async function registerForEvent(registration: EventRegistration): Promise<EventRegistrationResponse> {
  const response = await apiClient.post<EventRegistrationResponse>("/events/register", registration);
  return response.data;
}

export async function saveEvent(saveReq: EventSave): Promise<EventSaveResponse> {
  const response = await apiClient.post<EventSaveResponse>("/events/save", saveReq);
  return response.data;
}

export async function getSavedEvents(): Promise<Event[]> {
  const response = await apiClient.get<Event[]>("/events/saved");
  return response.data;
}

export async function getRegisteredEvents(): Promise<Event[]> {
  const response = await apiClient.get<Event[]>("/events/registered");
  return response.data;
}
