"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Container } from "@/components/ui/Container";
import { ChatBox } from "@/components/chat/ChatBox";
import {
  getAllSessions,
  ChatSession,
  deleteChatSession,
} from "@/lib/chatStorage";
import { v4 as uuidv4 } from "uuid";

export default function ChatPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const allSessions = getAllSessions();
    setSessions(allSessions);

    setSessionId(uuidv4());
  }, []);

  const handleNewChat = () => {
    setSessionId(uuidv4());
  };

  const handleSelectSession = (id: string) => {
    setSessionId(id);
  };

  const handleDeleteSession = (
    e: React.MouseEvent,
    id: string
  ) => {
    e.stopPropagation();

    if (window.confirm("Delete this chat?")) {
      deleteChatSession(id);

      setSessions(getAllSessions());

      if (sessionId === id) {
        setSessionId(uuidv4());
      }
    }
  };

  const refreshSessions = useCallback(() => {
    setSessions(getAllSessions());
  }, []);

  if (!mounted) return null;

  return (
    <Container className="py-6 sm:py-8 lg:py-10 max-w-7xl">
      <div className="flex flex-col md:flex-row gap-6 h-[80vh]">
        {/* Sidebar */}
        <aside className="w-full md:w-64 flex flex-col gap-4 bg-white/50 backdrop-blur rounded-[2rem] border border-slate-200/80 p-4 shadow-sm">
          <button
            onClick={handleNewChat}
            className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-slate-950 text-white text-sm font-semibold hover:bg-slate-800 transition"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            New Chat
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mt-2">
              Recent Chats
            </p>

            {sessions.length === 0 ? (
              <p className="text-xs text-slate-400 px-2 italic">
                No history yet
              </p>
            ) : (
              sessions.map((session) => (
                <div
                  key={session.id}
                  onClick={() => handleSelectSession(session.id)}
                  className={`group flex items-center justify-between gap-2 p-3 rounded-xl cursor-pointer transition-all ${
                    sessionId === session.id
                      ? "bg-sky-50 text-sky-700 border border-sky-100"
                      : "hover:bg-slate-100 text-slate-600 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${
                        sessionId === session.id
                          ? "text-sky-500"
                          : "text-slate-400"
                      }`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                      />
                    </svg>

                    <span className="text-xs font-medium truncate">
                      {session.title || "Untitled Chat"}
                    </span>
                  </div>

                  <button
                    onClick={(e) =>
                      handleDeleteSession(e, session.id)
                    }
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-opacity"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              ))
            )}
          </div>
        </aside>

        {/* Main Chat Area */}
        <main className="flex-1 flex flex-col min-w-0">
          <section className="flex-1 overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur flex flex-col">
            <ChatBox
              className="flex-1"
              sessionId={sessionId}
              onNewMessage={refreshSessions}
            />
          </section>
        </main>
      </div>
    </Container>
  );
}