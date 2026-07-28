"use client";

import React from "react";
import Link from "next/link";

export function WebsiteDescription() {
  return (
    <section className="w-full max-w-2xl mx-auto px-4 py-8 text-center space-y-8 bg-black">
      {/* Website Description */}
      <div className="space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          About Campus-AI
        </h3>
        <p className="text-base sm:text-lg text-neutral-400 leading-relaxed font-normal">
          Campus-AI is an intelligent platform built for students and organizers. Discover upcoming campus events, get instant answers from our AI assistant, and manage event registrations seamlessly.
        </p>
      </div>

      {/* Action Buttons: Log In / Get Started */}
      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href="/signup"
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition text-center"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-neutral-900 border border-neutral-800 text-white font-semibold text-sm hover:bg-neutral-800 transition text-center"
        >
          Log In
        </Link>
      </div>
    </section>
  );
}
