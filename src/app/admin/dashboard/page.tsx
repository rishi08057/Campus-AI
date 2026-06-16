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
            value={stats.totalEvents}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            trend={{ value: "+2 this month", isPositive: true }}
          />
          <StatCard
            title="Registered Users"
            value={stats.totalUsers}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            }
            trend={{ value: "+12% vs last month", isPositive: true }}
          />
          <StatCard
            title="Total Registrations"
            value={stats.totalRegistrations}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            description="Active registrations across all events"
          />
          <StatCard
            title="Attendance Rate"
            value={`${stats.avgAttendance}%`}
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
            trend={{ value: "-2% vs last week", isPositive: false }}
          />
        </div>

        {/* Detailed Event Table */}
        <div className="overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
          <div className="border-b border-slate-100 bg-slate-50/50 p-6 sm:p-8">
            <h3 className="text-xl font-bold text-slate-950">Event Performance</h3>
            <p className="mt-1 text-sm text-slate-500">Detailed breakdown of registration and attendance per event.</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/30 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  <th className="px-8 py-5">Event Name</th>
                  <th className="px-8 py-5">Category</th>
                  <th className="px-8 py-5 text-center">Registrations</th>
                  <th className="px-8 py-5 text-center">Fill Rate</th>
                  <th className="px-8 py-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentEvents.map((event) => {
                  const fillRate = Math.round((event.registrationsCount / event.capacity) * 100);
                  return (
                    <tr key={event.id} className="group transition-colors hover:bg-slate-50/50">
                      <td className="px-8 py-6">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-950">{event.title}</p>
                          <p className="text-xs text-slate-500">{event.venue}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                          {event.category}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-bold text-slate-950">{event.registrationsCount}</span>
                          <span className="text-[10px] text-slate-400">of {event.capacity} seats</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="mx-auto flex max-w-[100px] flex-col gap-2">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div 
                              className={`h-full transition-all duration-500 ${
                                fillRate > 90 ? 'bg-amber-500' : 'bg-sky-500'
                              }`} 
                              style={{ width: `${fillRate}%` }} 
                            />
                          </div>
                          <span className="text-center text-xs font-bold text-slate-600">{fillRate}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          fillRate > 95 
                            ? "bg-amber-50 text-amber-600" 
                            : "bg-emerald-50 text-emerald-600"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${
                            fillRate > 95 ? "bg-amber-500" : "bg-emerald-500"
                          }`} />
                          {fillRate > 95 ? 'Almost Full' : 'Open'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Container>
  );
}
