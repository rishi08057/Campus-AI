"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { apiClient } from "@/lib/api";
import { loadChatSession, saveChatSession, clearChatSession } from "@/lib/chatStorage";
import { ChatHistory } from "@/components/chat/ChatHistory";
import { InputArea } from "@/components/chat/InputArea";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import type {
  ChatErrorResponse,
  ChatMessage,
  ChatRequest,
  ChatSuccessResponse,
  NormalizedChatReply,
} from "@/types/chat";

export type ChatBoxProps = {
  className?: string;
  placeholder?: string;
};

function normalizeAssistantResponse(data: ChatSuccessResponse | string | null): NormalizedChatReply {
  if (typeof data === "string") {
    return { text: data, raw: data };
  }

  if (!data) {
    return { text: "", raw: null };
  }

  const text =
    typeof data.reply === "string"
      ? data.reply
      : typeof data.response === "string"
        ? data.response
        : typeof data.message === "string"
          ? data.message
          : typeof data.content === "string"
            ? data.content
            : JSON.stringify(data);

  return { text, raw: data };
}

function readErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ChatErrorResponse>(error)) {
    return (
      error.response?.data?.detail ??
      error.response?.data?.error ??
      error.response?.data?.message ??
      error.message ??
      "Failed to send message"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to send message";
}

export function ChatBox({ className = "", placeholder = "Write a message..." }: ChatBoxProps) {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState<boolean>(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  // Load chat session from localStorage on mount
  useEffect(() => {
    const session = loadChatSession();
    setMessages(session.messages);
    // Try to retrieve session_id if stored in session object (need to update chatStorage too, but for now we'll handle it here)
    const storedSession = typeof window !== 'undefined' ? localStorage.getItem('campusai_session_id') : null;
    if (storedSession) setSessionId(storedSession);
    setMounted(true);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (mounted && messages.length > 0) {
      saveChatSession(messages);
    }
  }, [messages, mounted]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [messages, loading]);

  async function handleSend() {
    const trimmedInput = input.trim();

    if (!trimmedInput || loading) {
      return;
    }

    setError(null);
    setLoading(true);
    const timestamp = Date.now();
    const userMessage: ChatMessage = { role: "user", content: trimmedInput, timestamp };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");

    try {
      const payload: ChatRequest = {
        message: trimmedInput,
        history: updatedMessages,
        session_id: sessionId || undefined,
      };
      const res = await apiClient.post<ChatSuccessResponse | string>("/chat", payload);
      const normalizedReply = normalizeAssistantResponse(res.data);
      const assistantTimestamp = Date.now();

      // Update session ID if returned
      if (typeof res.data !== 'string' && res.data?.session_id) {
        setSessionId(res.data.session_id);
        localStorage.setItem('campusai_session_id', res.data.session_id);
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: normalizedReply.text, timestamp: assistantTimestamp },
      ]);
    } catch (err: any) {
      setError(readErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    if (
      typeof window !== "undefined" &&
      window.confirm("Are you sure you want to clear this conversation? This action cannot be undone.")
    ) {
      setMessages([]);
      setInput("");
      setError(null);
      setLoading(false);
      setSessionId(null);
      localStorage.removeItem('campusai_session_id');
      clearChatSession();
    }
  }

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return null;
  }

  return (
    <div
      className={`flex w-full flex-col overflow-hidden rounded-2xl border border-slate-200/60 bg-white shadow-lg shadow-slate-900/5 sm:rounded-3xl ${className}`.trim()}
    >
      <div className="border-b border-slate-200/50 bg-gradient-to-br from-slate-50/80 via-white to-white/50 px-4 py-3 backdrop-blur-sm sm:px-5 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Assistant
            </p>
            <h2 className="mt-0.5 truncate text-base font-semibold text-slate-950 sm:text-lg">
              CampusAI Chat
            </h2>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
              loading
                ? "bg-amber-100 text-amber-700"
                : "bg-emerald-100 text-emerald-700"
            }`}>
              <span className={`h-2 w-2 rounded-full ${loading ? "animate-pulse bg-amber-500" : "bg-emerald-500"}`} />
              {loading ? "Thinking" : "Ready"}
            </div>
            {messages.length > 0 ? (
              <span className="text-xs text-slate-500">{messages.length} {messages.length === 1 ? "message" : "messages"}</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="flex h-[60vh] min-h-[420px] flex-col bg-gradient-to-b from-slate-50/30 to-white/50">
        <div
          role="log"
          aria-live="polite"
          aria-label="Chat messages"
          ref={messagesContainerRef}
          className="flex-1 overflow-hidden"
        >
          <div className="flex h-full flex-col overflow-y-auto">
            <ChatHistory messages={messages} />
            {loading ? <TypingIndicator /> : null}
            <div ref={messagesEndRef} className="flex-shrink-0" />
          </div>
        </div>

        {error ? (
          <div className="animate-fadeInDown mx-2 mb-3 rounded-xl border border-red-200/50 bg-red-50/80 px-4 py-3 text-sm text-red-700 shadow-sm backdrop-blur-sm sm:mx-4">
            <div className="font-semibold">Unable to send message</div>
            <div className="mt-1 text-xs opacity-90">{error}</div>
          </div>
        ) : null}

        <InputArea
          value={input}
          onChange={setInput}
          onSend={handleSend}
          onClear={handleClear}
          loading={loading}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}

export default ChatBox;
