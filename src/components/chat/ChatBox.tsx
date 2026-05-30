"use client";

import React, { useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api";
import { ChatHistory, type Message } from "@/components/chat/ChatHistory";
import { InputArea } from "@/components/chat/InputArea";

export type ChatBoxProps = {
  className?: string;
  placeholder?: string;
};

function readAssistantResponse(data: unknown): string {
  if (data && typeof data === "object" && "response" in data) {
    return String((data as { response: unknown }).response);
  }

  if (typeof data === "string") {
    return data;
  }

  return JSON.stringify(data);
}

export function ChatBox({ className = "", placeholder = "Write a message..." }: ChatBoxProps) {
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
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
    setMessages((currentMessages) => [...currentMessages, { role: "user", content: trimmedInput }]);
    setInput("");

    try {
      const res = await apiClient.post("/chat", { message: trimmedInput });
      const assistantMessage = readAssistantResponse(res.data);

      setMessages((currentMessages) => [
        ...currentMessages,
        { role: "assistant", content: assistantMessage },
      ]);
    } catch (err: any) {
      setError(err?.message ?? "Failed to send message");
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
          <ChatHistory messages={messages} isTyping={loading} />
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
