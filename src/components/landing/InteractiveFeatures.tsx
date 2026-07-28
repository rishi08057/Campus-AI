"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MessageSquare, Ticket } from "lucide-react";

const SAMPLE_EVENTS = [
  { title: "Campus AI & Robotics Expo", date: "Aug 12 • 10:00 AM", location: "Main Auditorium" },
  { title: "National 48-Hour Hackathon", date: "Aug 18 • 09:00 AM", location: "Innovation Hub" },
  { title: "Design Systems & UI/UX Workshop", date: "Aug 22 • 02:00 PM", location: "Studio B" },
];

export function InteractiveFeatures() {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Featured Upcoming Events Header */}
      <div className="rounded-3xl bg-[#161617] border border-[#2d2d2e] p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Featured Events
            </h3>
            <p className="text-sm text-neutral-400 mt-1">
              Explore upcoming campus workshops and competitions.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-medium hover:bg-neutral-200 transition"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          {SAMPLE_EVENTS.map((event, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 space-y-2 hover:border-neutral-700 transition"
            >
              <p className="text-xs text-neutral-400 font-medium">{event.date}</p>
              <h4 className="text-base font-bold text-white">{event.title}</h4>
              <p className="text-xs text-neutral-500">{event.location}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="rounded-3xl bg-[#161617] border border-[#2d2d2e] p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <MessageSquare className="w-6 h-6 text-white" />
            <h4 className="text-xl font-bold text-white">AI Chat Assistant</h4>
            <p className="text-sm text-neutral-400">
              Get personalized event recommendations and instant help.
            </p>
          </div>
          <Link
            href="/chat"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-white text-xs font-medium transition"
          >
            <span>Open Chat Assistant</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="rounded-3xl bg-[#161617] border border-[#2d2d2e] p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-2">
            <Ticket className="w-6 h-6 text-white" />
            <h4 className="text-xl font-bold text-white">Event Directory</h4>
            <p className="text-sm text-neutral-400">
              Browse all scheduled campus activities and reserve your spot.
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium text-xs hover:bg-neutral-200 transition"
          >
            <span>Browse Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
