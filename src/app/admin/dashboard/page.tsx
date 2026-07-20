"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { StatCard } from "@/components/admin/StatCard";
import { getAdminStats, AdminStats } from "@/lib/api";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getAdminStats();
        setStats(data);
      } catch (err) {
        setError("Failed to load dashboard statistics.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="py-12">
        <div className="animate-pulse space-y-12">
          <div className="h-12 w-64 bg-slate-100 rounded-2xl" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-slate-100 rounded-[2.5rem]" />
            ))}
          </div>
          <div className="h-[400px] bg-slate-100 rounded-[2.5rem]" />
        </div>
      </Container>
    );
  }

  if (error || !stats) {
    return (
      <Container className="py-24">
        <div className="rounded-[2.5rem] border border-red-100 bg-red-50 p-12 text-center">
          <p className="text-lg font-bold text-red-700">{error || "Something went wrong."}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8 sm:py-12">
      <div className="space-y-12">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              Admin Dashboard
            </h1>
            <p className="text-slate-600">Overview of campus event activity and performance.</p>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Export Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Events"
            value={stats.total_events}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
          />
          <StatCard
            title="Total Registrations"
            value={stats.total_registrations}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
          <StatCard
            title="Total Attendees"
            value={stats.total_attendees}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
          />
          <StatCard
            title="Most Popular Event"
            value={stats.most_popular_event || "N/A"}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            }
          />
        </div>
      </div>
    </Container>
  );
}
