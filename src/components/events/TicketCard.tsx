"use client";

import { QRCodeSVG } from "qrcode.react";

interface TicketCardProps {
  eventName: string;
  venue: string;
  datetime: string;
  userName: string;
  qrData: string;
}

function formatDateTime(datetime: string) {
  const parsedDate = new Date(datetime);
  if (Number.isNaN(parsedDate.getTime())) return datetime;

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "full",
    timeStyle: "short",
  }).format(parsedDate);
}

export function TicketCard({
  eventName,
  venue,
  datetime,
  userName,
  qrData,
}: TicketCardProps) {
  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-[2.5rem] bg-white shadow-2xl">
      {/* Top Section: Event Details */}
      <div className="bg-slate-950 p-8 text-white sm:p-10">
        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
              Official Entry Pass
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {eventName}
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Venue
              </span>
              <p className="font-semibold text-slate-100">{venue}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                Attendee
              </span>
              <p className="font-semibold text-slate-100">{userName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Ticket Divider */}
      <div className="relative h-6 bg-white">
        {/* Left Cutout */}
        <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />
        {/* Right Cutout */}
        <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-slate-50" />
        {/* Dashed Line */}
        <div className="mx-6 h-full border-b-2 border-dashed border-slate-100" />
      </div>

      {/* Bottom Section: Date & QR Code */}
      <div className="space-y-8 p-8 sm:p-10">
        <div className="space-y-1 text-center">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Event Date & Time
          </span>
          <p className="text-lg font-bold text-slate-900">
            {formatDateTime(datetime)}
          </p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="rounded-3xl bg-slate-50 p-6 ring-1 ring-slate-100">
            <QRCodeSVG
              value={qrData}
              size={180}
              level="H"
              includeMargin={false}
              className="h-auto w-full max-w-[180px]"
            />
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-slate-500">
              Scan this QR code at the venue for entry
            </p>
            <p className="mt-1 text-[10px] font-mono text-slate-400 uppercase">
              {qrData.split(':').pop() || 'TICKET-ID'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="bg-slate-50 py-4 text-center">
        <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">
          CampusAI Events
        </span>
      </div>
    </div>
  );
}
