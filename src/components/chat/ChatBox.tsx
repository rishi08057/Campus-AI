"use client";

import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { apiClient } from "@/lib/api";
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
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  async function handleSend() {
    const trimmedInput = input.trim();

    if (!trimmedInput || loading) {
      return;
    }

    setError(null);
    setLoading(true);
    const userMessage: ChatMessage = { role: "user", content: trimmedInput };
    setMessages((currentMessages) => [...currentMessages, userMessage]);
    setInput("");

    try {
      const payload: ChatRequest = {
        message: trimmedInput,
        history: [...messages, userMessage],
      };
      const res = await apiClient.post<ChatSuccessResponse | string>("/chat", payload);
      const normalizedReply = normalizeAssistantResponse(res.data);

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: normalizedReply.text },
      ]);
    } catch (err: any) {
      setError(readErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  function handleClear() {
    setMessages([]);
    setInput("");
    setError(null);
    setLoading(false);
  }

  return (
    <div className={`flex w-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ${className}`.trim()}>
      <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-4 py-4 sm:px-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Conversation
            </p>
            <h2 className="mt-1 text-lg font-semibold text-slate-950 sm:text-xl">
              CampusAI Chat Assistant
            </h2>
          </div>

          <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
            {loading ? "Typing" : "Ready"}
          </div>
        </div>
      </div>

      <div className="flex h-[60vh] min-h-[420px] flex-col bg-[linear-gradient(180deg,rgba(248,250,252,0.9)_0%,rgba(255,255,255,1)_100%)]">
        <div className="flex-1 overflow-hidden px-3 py-4 sm:px-5 sm:py-6">
          <div className="flex h-full flex-col gap-4 overflow-y-auto px-1 py-1 sm:gap-5 sm:px-2">
            <ChatHistory messages={messages} />
            {loading ? <TypingIndicator /> : null}
          </div>
          <div ref={endRef} />
        </div>

        {error ? (
          <div className="mx-4 mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700 sm:mx-5">
            <div className="font-semibold">Error</div>
            <div>{error}</div>
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
