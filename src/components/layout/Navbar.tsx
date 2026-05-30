import Link from "next/link";
import { Container } from "@/components/ui/Container";

type NavbarLink = {
  label: string;
  href: string;
};

type NavbarProps = {
  brand?: string;
  tagline?: string;
  statusLabel?: string;
  links?: NavbarLink[];
};

export function Navbar({
  brand = "CampusAI",
  tagline = "Event Agent",
  statusLabel = "Frontend scaffold",
  links = [],
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/70 backdrop-blur-xl">
      <Container className="flex min-h-16 items-center justify-between gap-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-sm font-semibold text-white shadow-lg shadow-slate-950/15">
            CA
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              {brand}
            </span>
            <span className="text-base font-semibold text-slate-950">{tagline}</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {links.length > 0 ? (
            <nav aria-label="Primary navigation" className="hidden items-center gap-2 md:flex">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          ) : null}

          <span className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
            {statusLabel}
          </span>
        </div>
      </Container>
    </header>
  );
}
