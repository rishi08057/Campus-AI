import { apiClient } from "./client";
import { UserProfile, UserCreate, UserOut, Token } from "@/types/user";

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
  
  return response.data;
}

export async function logout() {
  try {
    await apiClient.post("/auth/logout");
  } catch (err) {
    // Ignore error if already logged out on backend
  }
  document.cookie = 'logged_in=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>("/profile");
  return response.data;
}
