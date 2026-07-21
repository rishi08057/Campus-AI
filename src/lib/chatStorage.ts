import type { ChatMessage } from "@/types/chat";

const SESSIONS_STORAGE_KEY = "campusai_chat_sessions";
const SESSION_LIST_KEY = "campusai_session_ids";
const MAX_MESSAGES = 100;

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  lastUpdated: number;
  title?: string;
  agentType?: string;
}

/**
 * Get the list of all session IDs.
 */
export function getSessionIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(SESSION_LIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Get all chat sessions.
 */
export function getAllSessions(agentType?: string): ChatSession[] {
  if (typeof window === "undefined") return [];
  const ids = getSessionIds();
  
  try {
    const storedSessions = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!storedSessions) return [];
    
    const allSessions = JSON.parse(storedSessions) as Record<string, ChatSession>;
    const loaded = ids.map(id => allSessions[id]).filter(Boolean);

    if (agentType) {
      return loaded.filter(session => {
        const sessionAgentType = session.agentType || "event";
        return sessionAgentType === agentType;
      });
    }
    return loaded;
  } catch (error) {
    console.warn("Failed to load all sessions:", error);
    return [];
  }
}

/**
 * Load a specific chat session by ID.
 */
export function loadChatSession(id: string): ChatSession | null {
  if (typeof window === "undefined" || !id) return null;

  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!stored) return null;

    const allSessions = JSON.parse(stored) as Record<string, ChatSession>;
    return allSessions[id] || null;
  } catch (error) {
    console.warn(`Failed to load chat session ${id}:`, error);
    return null;
  }
}

/**
 * Save a chat session.
 */
export function saveChatSession(id: string, messages: ChatMessage[], title?: string, agentType?: string): void {
  if (typeof window === "undefined" || !id) return;

  try {
    const truncated = messages.length > MAX_MESSAGES ? messages.slice(-MAX_MESSAGES) : messages;
    
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    const allSessions = stored ? JSON.parse(stored) : {};
    
    // Update existing or create new
    const existing = allSessions[id];
    const session: ChatSession = {
      id,
      messages: truncated,
      lastUpdated: Date.now(),
      title: title || existing?.title || (messages[0]?.content.substring(0, 30) + "...") || "New Chat",
      agentType: agentType || existing?.agentType || "event"
    };

    // Try saving, if quota exceeded, prune older sessions and retry
    try {
      allSessions[id] = session;
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(allSessions));
    } catch (e: unknown) {
      if (e instanceof Error && (e.name === "QuotaExceededError" || e.name === "NS_ERROR_DOM_QUOTA_REACHED")) {
        console.warn("Storage quota exceeded. Pruning old chat sessions...");
        const sortedIds = Object.keys(allSessions).sort(
          (a, b) => allSessions[b].lastUpdated - allSessions[a].lastUpdated
        );
        
        // Remove oldest half
        const toKeep = sortedIds.slice(0, Math.max(1, Math.floor(sortedIds.length / 2)));
        const prunedSessions: Record<string, ChatSession> = {};
        for (const keepId of toKeep) {
          prunedSessions[keepId] = allSessions[keepId];
        }
        
        prunedSessions[id] = session; // Ensure current session is kept
        localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(prunedSessions));
        
        // Update IDs
        localStorage.setItem(SESSION_LIST_KEY, JSON.stringify(Object.keys(prunedSessions)));
        return; // Early return since we already updated SESSION_LIST_KEY
      } else {
        throw e;
      }
    }

    // Update ID list if new and no quota error occurred
    const ids = getSessionIds();
    if (!ids.includes(id)) {
      localStorage.setItem(SESSION_LIST_KEY, JSON.stringify([id, ...ids]));
    }
  } catch (error) {
    console.warn("Failed to save chat session:", error);
  }
}

/**
 * Delete a specific chat session.
 */
export function deleteChatSession(id: string): void {
  if (typeof window === "undefined" || !id) return;

  try {
    const stored = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (stored) {
      const allSessions = JSON.parse(stored);
      delete allSessions[id];
      localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(allSessions));
    }

    const ids = getSessionIds();
    localStorage.setItem(SESSION_LIST_KEY, JSON.stringify(ids.filter(sid => sid !== id)));
  } catch (error) {
    console.warn("Failed to delete chat session:", error);
  }
}

/**
 * Clear all chat sessions.
 */
export function clearAllSessions(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSIONS_STORAGE_KEY);
  localStorage.removeItem(SESSION_LIST_KEY);
}
