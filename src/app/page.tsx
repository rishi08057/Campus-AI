import Link from "next/link";
import { Container } from "@/components/ui/Container";

const featureHighlights = [
  "Real-time event discovery",
  "Chat-assisted campus planning",
  "Reusable event UI components",
];

export default function HomePage() {
  return (
    <Container className="relative overflow-hidden py-16 sm:py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-sky-300/25 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute right-0 top-24 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl sm:h-80 sm:w-80" />
      </div>

      <section className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="space-y-8">
          <span className="inline-flex rounded-full border border-sky-200 bg-white/75 px-4 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-sky-700 shadow-sm backdrop-blur">
            CampusAI Event Agent
          </span>

          <div className="space-y-5">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              CampusAI Event Agent
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
              AI-powered campus event assistant.
            </p>
          </div>

          <p className="max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
            Discover events, ask the assistant for help, and navigate campus life through a clean, modern interface built for speed on desktop and mobile.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/events"
              className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-3 text-sm font-semibold !text-white shadow-lg shadow-slate-950/10 transition hover:-translate-y-0.5 hover:bg-slate-800"
            >
              Browse Events
            </Link>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white"
            >
              Open Chat Assistant
            </Link>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {featureHighlights.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/70 bg-white/75 px-4 py-4 text-sm font-medium text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.06)] backdrop-blur"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 -z-10 rounded-[2rem] bg-gradient-to-br from-sky-100 via-white to-cyan-50 blur-2xl" />
          <div className="rounded-[2rem] border border-white/70 bg-white/80 p-5 shadow-[0_28px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                  Campus dashboard
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-950">
                  Your event command center
                </h2>
              </div>
              <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Live-ready
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {[
                "Find student events instantly",
                "Get AI help with planning and registration",
                "Keep campus activity organized in one place",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-4"
                >
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                  <p className="text-sm leading-6 text-slate-700 sm:text-base">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
