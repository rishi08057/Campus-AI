"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { useEffect, useState } from "react";
import { logout } from "@/lib/api";
import { useRouter, usePathname } from "next/navigation";


type NavbarProps = {
  brand?: string;
  tagline?: string;
  statusLabel?: string;
};

export function Navbar({
  brand = "CampusAI",
  tagline = "Event Agent",
  statusLabel = "BETA",
}: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = typeof document !== "undefined" && document.cookie.includes("logged_in=true");
    setIsLoggedIn(!!token);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    router.push("/login");
  };

  const authLinks = isLoggedIn
    ? [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Profile", href: "/profile" },
      ]
    : [
        { label: "Events", href: "/events" },
        { label: "Log In", href: "/login" },
        { label: "Sign Up", href: "/signup" },
      ];

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
          <nav aria-label="Primary navigation" className="hidden items-center gap-2 md:flex">
            {authLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  pathname === link.href
                    ? "bg-slate-100 text-slate-950"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="rounded-full px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Log Out
              </button>
            )}
          </nav>

          <span className="rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700 hidden sm:inline-block">
            {statusLabel}
          </span>

          <div className="md:hidden relative">
            <button 
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
              onClick={() => {
                const el = document.getElementById('mobile-menu');
                if (el) el.classList.toggle('hidden');
              }}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div id="mobile-menu" className="absolute right-0 top-full mt-2 hidden w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">
              {authLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  onClick={() => {
                    const el = document.getElementById('mobile-menu');
                    if (el) el.classList.add('hidden');
                  }}
                >
                  {link.label}
                </Link>
              ))}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    handleLogout();
                    const el = document.getElementById('mobile-menu');
                    if (el) el.classList.add('hidden');
                  }}
                  className="block w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </header>
  );
}
