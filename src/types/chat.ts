export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
  timestamp?: number;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  session_id?: string;
  agent_type?: string;
}

export interface ChatSuccessResponse {
  reply?: string;
  response?: string;
  message?: string;
  content?: string;
  session_id?: string;
  [key: string]: unknown;
}

export interface ChatErrorResponse {
  detail?: string;
  error?: string;
  message?: string;
  [key: string]: unknown;
}

export interface NormalizedChatReply {
  text: string;
  raw: ChatSuccessResponse | string | null;
}
