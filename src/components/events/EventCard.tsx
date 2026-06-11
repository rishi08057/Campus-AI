"use client";

import { useState } from "react";
import { RegistrationModal } from "./RegistrationModal";
import { saveEvent } from "@/lib/api";

export type EventCardProps = {
  id: number;
  title: string;
  description: string;
  venue: string;
  category: string;
  datetime: string;
  isInitialSaved?: boolean;
  isInitialRegistered?: boolean;
  className?: string;
};

function formatDateTime(datetime: string) {
  const parsedDate = new Date(datetime);

  if (Number.isNaN(parsedDate.getTime())) {
    return datetime;
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

export function EventCard({
  id,
  title,
  description,
  venue,
  category,
  datetime,
  isInitialSaved = false,
  isInitialRegistered = false,
  className = "",
}: EventCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(isInitialSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegistered, setIsRegistered] = useState(isInitialRegistered);

  const handleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsSaving(true);
    try {
      const response = await saveEvent({ userId: 0, eventId: id });
      if (response.success) {
        setIsSaved(response.saved);
      }
    } catch (err) {
      console.error("Failed to save event:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegistrationSuccess = () => {
    setIsRegistered(true);
    setIsModalOpen(false);
  };

  return (
    <>
      <article
        className={`group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-6 ${className}`.trim()}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
            {category}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                isSaved 
                  ? "bg-amber-100 text-amber-600 hover:bg-amber-200" 
                  : "bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
              }`}
              title={isSaved ? "Unsave event" : "Save event"}
            >
              <svg 
                className={`h-5 w-5 ${isSaving ? 'animate-pulse' : ''}`} 
                fill={isSaved ? "currentColor" : "none"} 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" 
                />
              </svg>
            </button>
            <time className="text-sm font-medium text-slate-500" dateTime={datetime}>
              {formatDateTime(datetime)}
            </time>
          </div>
        </div>

        <div className="mt-5 flex flex-1 flex-col gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              {title}
            </h3>
            <p className="text-sm leading-6 text-slate-600 sm:text-base">{description}</p>
          </div>

          <div className="grid gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Venue
              </span>
              <p className="mt-1 font-medium text-slate-800">{venue}</p>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Date & Time
              </span>
              <p className="mt-1 font-medium text-slate-800">{formatDateTime(datetime)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={() => !isRegistered && setIsModalOpen(true)}
            disabled={isRegistered}
            className={`inline-flex w-full items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:px-5 ${
              isRegistered
                ? "bg-emerald-100 text-emerald-700 cursor-default"
                : "bg-slate-950 text-white hover:bg-slate-800 focus:ring-slate-950"
            }`}
          >
            {isRegistered ? (
              <span className="flex items-center gap-2">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Registered
              </span>
            ) : (
              "Register"
            )}
          </button>
        </div>
      </article>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleRegistrationSuccess}
        eventId={id}
        eventTitle={title}
      />
    </>
  );
}