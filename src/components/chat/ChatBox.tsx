"use client";

import React, { useState } from "react";
import { apiClient } from "@/lib/api";

export type ChatBoxProps = {
  className?: string;
  placeholder?: string;
};

export function ChatBox({ className = "", placeholder = "Write a message..." }: ChatBoxProps) {
  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSend() {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResponse(null);
    try {
      const res = await apiClient.post("/chat", { message: input });

      // backend may return { reply } or plain string — handle both
      const data = res.data;
      if (data && typeof data === "object" && "reply" in data) {
        setResponse(String((data as any).reply));
      } else if (typeof data === "string") {
        setResponse(data as string);
      } else {
        setResponse(JSON.stringify(data));
      }
    } catch (err: any) {
      setError(err?.message ?? "Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`w-full ${className}`.trim()}>
      <div className="flex w-full flex-col gap-4">
        <label htmlFor="chat-input" className="sr-only">
          Chat message
        </label>
        <textarea
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          rows={4}
          className="min-h-[96px] w-full resize-y rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className={`inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold text-white ${
                loading || !input.trim()
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              {loading ? "Sending..." : "Send"}
            </button>

            <button
              type="button"
              onClick={() => setInput("")}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Clear
            </button>
          </div>

          <div className="text-sm text-slate-500">
            {input.length}/1000
          </div>
        </div>

        <div>
          {error ? (
            <div className="rounded-md border border-red-100 bg-red-50 p-3 text-sm text-red-700">
              <div className="font-semibold">Error</div>
              <div>{error}</div>
            </div>
          ) : null}

          {response ? (
            <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Response
              </div>
              <div className="whitespace-pre-wrap">{response}</div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
