import { Container } from "@/components/ui/Container";

const architectureHighlights = [
  "App Router foundation",
  "Reusable layout components",
  "Domain types ready for event data",
  "Axios client wired for future API calls",
];

export default function HomePage() {
  return (
    <Container className="py-16 sm:py-24">
      <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-6">
          <span className="inline-flex rounded-full border border-sky-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-sky-700 shadow-sm backdrop-blur">
            Frontend scaffold
          </span>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              CampusAI Event Agent starts with a clean, modular frontend.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              This starter keeps the app shell lightweight so event workflows, data
              fetching, and product pages can be added later without reworking the
              foundation.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-700">
            <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">
              App Router
            </span>
            <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">
              TypeScript
            </span>
            <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 shadow-sm">
              Tailwind CSS
            </span>
          </div>
        </div>

        <div className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                Architecture
              </p>
              <h2 className="mt-1 text-xl font-semibold text-slate-900">
                Ready for expansion
              </h2>
            </div>
            <div className="rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white">
              No event pages yet
            </div>
          </div>

          <ul className="space-y-3">
            {architectureHighlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-700"
              >
                <span className="mt-1 h-2.5 w-2.5 rounded-full bg-sky-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </Container>
  );
}
