"use client";

import { useState } from "react";
import Link from "next/link";
import { registerForEvent } from "@/lib/api";
import { EventRegistrationResponse } from "@/types/event";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  eventId: number;
  eventTitle: string;
}

export function RegistrationModal({
  isOpen,
  onClose,
  onSuccess,
  eventId,
  eventTitle,
}: RegistrationModalProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  if (!isOpen) return null;

  const handleRegister = async () => {
    setStatus("loading");
    try {
      const response = await registerForEvent({ eventId });
      if (response.success) {
        setStatus("success");
        setMessage(response.message);
        if (onSuccess) onSuccess();
      } else {
        setStatus("error");
        setMessage(response.message);
      }
    } catch (err) {
      setStatus("error");
      setMessage("Failed to register. Please try again later.");
    }
  };

  const handleClose = () => {
    setStatus("idle");
    setMessage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 sm:p-8">
          {status === "success" ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4.5 12.75l6 6 9-13.5"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-950">Registration Successful!</h3>
              <p className="text-slate-600">
                {message || `You have been successfully registered for "${eventTitle}".`}
              </p>
              <div className="flex flex-col gap-3 pt-2">
                <Link
                  href={`/agents/event/tickets/${eventId}`}
                  className="w-full rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 text-center"
                >
                  View My Ticket
                </Link>
                <button
                  onClick={handleClose}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-950">Confirm Registration</h3>
                <p className="mt-2 text-slate-600">
                  Are you sure you want to register for <span className="font-semibold text-slate-900">&quot;{eventTitle}&quot;</span>?
                </p>
              </div>

              {status === "error" && (
                <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700 border border-red-100">
                  {message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleClose}
                  disabled={status === "loading"}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRegister}
                  disabled={status === "loading"}
                  className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center"
                >
                  {status === "loading" ? (
                    <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
