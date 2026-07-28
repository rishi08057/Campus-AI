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
  brand = "Campus AI",
  tagline = "Event Agent",
  statusLabel = "BETA",
}: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = typeof document !== "undefined" && document.cookie.includes("logged_in=true");
    setIsLoggedIn(!!token);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
    setIsLoggedIn(false);
    router.push("/login");
  };

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled
          ? "rgba(0, 0, 0, 0.8)"
          : "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(99, 102, 241, 0.15)"
          : "1px solid rgba(255, 255, 255, 0.05)",
      }}
    >
      <Container className="flex min-h-14 items-center justify-between gap-6 py-3">
        <Link href="/" className="flex items-center gap-2.5 group">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 group-hover:scale-110"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#ffffff",
              boxShadow: "0 0 15px rgba(99, 102, 241, 0.3)",
            }}
          >
            CA
          </span>
          <span
            className="text-sm font-bold tracking-tight"
            style={{ color: "#e2e8f0" }}
          >
            {brand}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200"
            style={{ color: "#c7d2fe" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ffffff";
              e.currentTarget.style.background = "rgba(99, 102, 241, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "#c7d2fe";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#ffffff",
              boxShadow: "0 0 12px rgba(99, 102, 241, 0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 20px rgba(99, 102, 241, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 12px rgba(99, 102, 241, 0.25)";
            }}
          >
            Get Started
          </Link>
        </div>
      </Container>
    </header>
  );
}
