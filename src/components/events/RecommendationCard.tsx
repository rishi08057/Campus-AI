"use client";

import { useState } from "react";
import type { Recommendation } from "@/types/recommendation";
import { getRecommendationLabel, getRecommendationBadgeColor } from "@/types/recommendation";
import { RegistrationModal } from "./RegistrationModal";

export type RecommendationCardProps = {
  recommendation: Recommendation;
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

export function RecommendationCard({
  recommendation,
  className = "",
}: RecommendationCardProps) {
  const { event, reason, confidence } = recommendation;
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const label = getRecommendationLabel(reason);
  const badgeColor = getRecommendationBadgeColor(reason);

  const badgeColorMap: Record<string, string> = {
    sky: "border-sky-200 bg-sky-50 text-sky-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-700",
    amber: "border-amber-200 bg-amber-50 text-amber-700",
    purple: "border-purple-200 bg-purple-50 text-purple-700",
    rose: "border-rose-200 bg-rose-50 text-rose-700",
  };

  const badgeClasses = badgeColorMap[badgeColor] || badgeColorMap.sky;

  return (
    <>
      <article
        className={`group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-6 ${className}`.trim()}
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-3">
            <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] ${badgeClasses}`}>
              ⭐ {label}
            </span>
            <time className="text-sm font-medium text-slate-500" dateTime={event.datetime}>
              {formatDateTime(event.datetime)}
            </time>
          </div>

          {confidence && confidence > 0 ? (
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-full bg-slate-100 p-1">
                <div
                  className="rounded-full bg-gradient-to-r from-sky-400 to-sky-600 py-1 transition-all duration-300"
                  style={{ width: `${(confidence * 100).toFixed(0)}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-slate-600">{(confidence * 100).toFixed(0)}%</span>
            </div>
          ) : null}
        </div>

        <div className="mt-5 flex flex-1 flex-col gap-4">
          <div className="space-y-2">
            <h3 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">
              {event.title}
            </h3>
            <p className="text-sm leading-6 text-slate-600 sm:text-base">{event.description}</p>
          </div>

          <div className="grid gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600 sm:grid-cols-2">
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Category
              </span>
              <p className="mt-1 font-medium text-slate-800">{event.category}</p>
            </div>
            <div>
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                Venue
              </span>
              <p className="mt-1 font-medium text-slate-800">{event.venue}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex-1 inline-flex items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2"
          >
            Register
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            aria-label="Save recommendation"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </article>

      <RegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        eventId={event.id}
        eventTitle={event.title}
      />
    </>
  );
}

export default RecommendationCard;
