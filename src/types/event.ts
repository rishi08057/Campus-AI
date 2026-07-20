export interface Event {
  id: number;
  title: string;
  description: string;
  venue: string;
  category: string;
  datetime: string;
}

export interface EventRegistration {
  userId?: number;
  eventId: number;
}

export interface EventRegistrationResponse {
  message: string;
  success: boolean;
  registration: EventRegistration;
}

export interface EventSave {
  userId?: number;
  eventId: number;
}

export interface EventSaveResponse {
  message: string;
  success: boolean;
  saved: boolean;
  eventId: number;
}
