export type EventStatus = "draft" | "published" | "cancelled";

export interface Event {
  id: string;
  title: string;
  description: string;
  startAt: string;
  endAt?: string;
  location?: string;
  organizer?: string;
  status: EventStatus;
}
