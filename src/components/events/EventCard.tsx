import Link from "next/link";

export type EventCardProps = {
  title: string;
  description: string;
  venue: string;
  category: string;
  datetime: string;
  registerHref?: string;
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
  title,
  description,
  venue,
  category,
  datetime,
  registerHref = "/register",
  className = "",
}: EventCardProps) {
  return (
    <article
      className={`flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-6 ${className}`.trim()}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-700">
          {category}
        </span>
        <time className="text-sm font-medium text-slate-500" dateTime={datetime}>
          {formatDateTime(datetime)}
        </time>
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
        <Link
          href={registerHref}
          className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 sm:w-auto sm:px-5"
        >
          Register
        </Link>
      </div>
    </article>
  );
}