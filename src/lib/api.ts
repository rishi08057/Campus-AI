import axios from "axios";
import { Event, EventRegistration, EventRegistrationResponse, EventSave, EventSaveResponse } from "@/types/event";
import { UserProfile, UserCreate, UserOut, Token } from "@/types/user";
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

// Add a request interceptor to add the auth token to headers
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export async function signup(userData: UserCreate): Promise<UserOut> {
  const response = await apiClient.post<UserOut>("/auth/signup", userData);
  return response.data;
}

export async function login(email: string, password: string): Promise<Token> {
  const formData = new FormData();
  formData.append('username', email);
  formData.append('password', password);
  
  const response = await apiClient.post<Token>("/auth/login", formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  if (response.data.access_token) {
    sessionStorage.setItem('token', response.data.access_token);
    // Set session cookie for middleware (no expiration date means it clears on browser close)
    document.cookie = `token=${response.data.access_token}; path=/; SameSite=Lax`;
  }
  
  return response.data;
}

export async function logout() {
  sessionStorage.removeItem('token');
  document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

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

export async function getRecommendations(): Promise<Recommendation[]> {
  const response = await apiClient.get<Recommendation[]>("/recommendations");
  return response.data;
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>("/profile");
  return response.data;
}

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
