import { Container } from "@/components/ui/Container";

export default function PlacementAgentPage() {
  return (
    <Container className="py-8 sm:py-12">
      <div className="space-y-8 h-full flex flex-col">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Placement Agent
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            I can help you with resume review, mock interviews, coding practice, and aptitude tests.
          </p>
        </div>

        <div className="flex-1 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Coming Soon</h3>
            <p className="text-slate-500">
              The Placement Agent is currently under development. Check back soon for career preparation features!
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
