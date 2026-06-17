import { Container } from "@/components/ui/Container";
import Link from "next/link";

export default function DashboardPage() {
  const agents = [
    {
      title: "Event Agent",
      description: "Your campus event assistant.",
      href: "/agents/event",
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700",
      features: ["Discover events", "Register", "Tickets", "Recommendations"],
      icon: "M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    },
    {
      title: "Support Agent",
      description: "Academic and campus life support.",
      href: "/agents/support",
      status: "Active",
      statusColor: "bg-emerald-100 text-emerald-700",
      features: ["Attendance", "Exams", "Faculty", "Room locations"],
      icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
    },
    {
      title: "Placement Agent",
      description: "Career and placement preparation.",
      href: "/agents/placement",
      status: "Coming Soon",
      statusColor: "bg-amber-100 text-amber-700",
      features: ["Resume review", "Mock interviews", "Coding practice", "Aptitude"],
      icon: "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    },
    {
      title: "Health Agent",
      description: "Student wellness and health guidance.",
      href: "/agents/health",
      status: "Coming Soon",
      statusColor: "bg-amber-100 text-amber-700",
      features: ["Symptom guidance", "Wellness resources", "Reminders"],
      icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    }
  ];

  return (
    <Container className="py-8 sm:py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Welcome to CampusAI
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            Select an agent to assist you today.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {agents.map((agent) => (
            <Link 
              key={agent.title} 
              href={agent.href}
              className="group flex flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-700 group-hover:bg-slate-950 group-hover:text-white transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={agent.icon} />
                  </svg>
                </div>
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${agent.statusColor}`}>
                  {agent.status}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-slate-950 mb-2">{agent.title}</h3>
              <p className="text-slate-600 mb-6 flex-1">{agent.description}</p>
              
              <div className="border-t border-slate-100 pt-4 mt-auto">
                <ul className="grid grid-cols-2 gap-2">
                  {agent.features.map(feature => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-slate-600">
                      <svg className="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
