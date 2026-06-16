"use client";

import { useState } from "react";
import { Container } from "@/components/ui/Container";
import { QRScanner } from "@/components/events/QRScanner";
import { getRegisteredEvents } from "@/lib/api";
import { Event } from "@/types/event";

type ScanStatus = "idle" | "verifying" | "success" | "invalid";

interface CheckInData {
  userId: string;
  eventId: string;
  eventTitle?: string;
}

export default function CheckInPage() {
  const [status, setStatus] = useState<ScanStatus>("idle");
  const [checkInData, setCheckInData] = useState<CheckInData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const handleScanSuccess = async (decodedText: string) => {
    // Only process if we are idle
    if (status !== "idle") return;

    setStatus("verifying");

    // Format expected: campus-ai:ticket:userId:eventId
    const parts = decodedText.split(":");
    
    if (parts.length === 4 && parts[0] === "campus-ai" && parts[1] === "ticket") {
      const userId = parts[2];
      const eventId = parts[3];

      try {
        // Mock verification: check if this event exists in our mock data
        // In a real app, this would be an API call to POST /events/check-in
        const events = await getRegisteredEvents();
        const event = events.find(e => e.id === Number(eventId));

        setCheckInData({
          userId,
          eventId,
          eventTitle: event?.title || "Unknown Event",
        });
        setStatus("success");
      } catch (err) {
        setErrorMessage("Verification failed. Please try again.");
        setStatus("invalid");
      }
    } else {
      setErrorMessage("Invalid QR code format. This is not a CampusAI ticket.");
      setStatus("invalid");
    }
  };

  const resetScanner = () => {
    setStatus("idle");
    setCheckInData(null);
    setErrorMessage("");
  };

  return (
    <Container className="py-12 sm:py-24">
      <div className="mx-auto max-w-lg space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Event Check-In
          </h1>
          <p className="text-slate-600">
            Scan attendee QR codes to verify registration and grant entry.
          </p>
        </div>

        {/* State Machine UI */}
        <div className="flex flex-col items-center justify-center">
          {status === "idle" && (
            <div className="w-full space-y-8 animate-in fade-in duration-500">
              <QRScanner onScanSuccess={handleScanSuccess} />
              <div className="text-center text-sm text-slate-400">
                <p>Position the QR code within the frame to scan</p>
              </div>
            </div>
          )}

          {status === "verifying" && (
            <div className="flex flex-col items-center justify-center py-20 space-y-6">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
              <p className="font-semibold text-slate-900">Verifying Ticket...</p>
            </div>
          )}

          {status === "success" && checkInData && (
            <div className="w-full rounded-[2.5rem] bg-emerald-50 p-10 text-center ring-1 ring-emerald-100 animate-in zoom-in duration-300">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-emerald-950 text-emerald-900">
                  Access Granted
                </h3>
                <p className="text-emerald-700 font-medium">
                  {checkInData.eventTitle}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4 rounded-3xl bg-white/50 p-6 text-left">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600/60">
                    Attendee ID
                  </span>
                  <p className="font-bold text-emerald-900">#{checkInData.userId}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-emerald-600/60">
                    Timestamp
                  </span>
                  <p className="font-bold text-emerald-900">
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              <button
                onClick={resetScanner}
                className="mt-10 w-full rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                Scan Next Ticket
              </button>
            </div>
          )}

          {status === "invalid" && (
            <div className="w-full rounded-[2.5rem] bg-red-50 p-10 text-center ring-1 ring-red-100 animate-in zoom-in duration-300">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
                <svg className="h-10 w-10" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-red-950 text-red-900">
                  Invalid Ticket
                </h3>
                <p className="text-red-700">
                  {errorMessage}
                </p>
              </div>

              <button
                onClick={resetScanner}
                className="mt-10 w-full rounded-2xl bg-red-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Instructions */}
        {status === "idle" && (
          <div className="rounded-3xl bg-slate-50 p-8 space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-slate-400">
              Staff Instructions
            </h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">1</span>
                Ensure the attendee has their QR code ready on their screen.
              </li>
              <li className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">2</span>
                Point the camera directly at the code.
              </li>
              <li className="flex gap-3">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-700">3</span>
                Wait for the green &quot;Access Granted&quot; confirmation before letting them in.
              </li>
            </ul>
          </div>
        )}
      </div>
    </Container>
  );
}
