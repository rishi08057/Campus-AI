import type { ChatMessage } from "@/types/chat";

const CHAT_STORAGE_KEY = "campusai_chat_history";
const MAX_MESSAGES = 100;

export interface ChatSession {
  messages: ChatMessage[];
  lastUpdated: number;
}

/**
 * Load chat history from localStorage.
 * Returns an empty session if none exists or if parsing fails.
 */
export function loadChatSession(): ChatSession {
  if (typeof window === "undefined") {
    return { messages: [], lastUpdated: Date.now() };
  }

  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY);
    if (!stored) {
      return { messages: [], lastUpdated: Date.now() };
    }

    const parsed = JSON.parse(stored) as ChatSession;
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      lastUpdated: parsed.lastUpdated || Date.now(),
    };
  } catch (error) {
    console.warn("Failed to load chat session from localStorage:", error);
    return { messages: [], lastUpdated: Date.now() };
  }
}

/**
 * Save chat history to localStorage.
 * Truncates to MAX_MESSAGES to prevent excessive storage use.
 */
export function saveChatSession(messages: ChatMessage[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const truncated =
      messages.length > MAX_MESSAGES ? messages.slice(-MAX_MESSAGES) : messages;

    const session: ChatSession = {
      messages: truncated,
      lastUpdated: Date.now(),
    };

    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(session));
  } catch (error) {
    console.warn("Failed to save chat session to localStorage:", error);
  }
}

/**
 * Clear the entire chat history from localStorage.
 */
export function clearChatSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(CHAT_STORAGE_KEY);
  } catch (error) {
    console.warn("Failed to clear chat session:", error);
  }
}
