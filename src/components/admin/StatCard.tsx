import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
}

export function StatCard({ title, value, icon, trend, description }: StatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-[2.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(15,23,42,0.1)] sm:p-8">
      <div className="flex items-start justify-between">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
            {title}
          </p>
          <h3 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
            {value}
          </h3>
        </div>
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-slate-50 text-slate-950 transition-colors group-hover:bg-slate-950 group-hover:text-white">
          {icon}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        {trend && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
            trend.isPositive 
              ? "bg-emerald-50 text-emerald-600" 
              : "bg-red-50 text-red-600"
          }`}>
            {trend.isPositive ? (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            ) : (
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            )}
            {trend.value}
          </span>
        )}
        {description && (
          <span className="text-sm font-medium text-slate-500">{description}</span>
        )}
      </div>
      
      {/* Decorative gradient blur */}
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-slate-50 opacity-50 blur-3xl transition-opacity group-hover:opacity-100" />
    </div>
  );
}
