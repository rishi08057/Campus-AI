import { Container } from "@/components/ui/Container";

export default function SupportAgentPage() {
  return (
    <Container className="py-8 sm:py-12">
      <div className="space-y-8 h-full flex flex-col">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Support Agent
          </h1>
          <p className="mt-2 text-lg text-slate-600">
            I can help you with attendance, exams, faculty contacts, and room locations.
          </p>
        </div>

        <div className="flex-1 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-12 flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-sky-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Chat Interface Placeholder</h3>
            <p className="text-slate-500">
              The chat interface for the Support Agent will be implemented here. It will connect to the Support Agent AI backend for intelligent responses.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
