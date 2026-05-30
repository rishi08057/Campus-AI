import { Container } from "@/components/ui/Container";
import { ChatBox } from "@/components/chat/ChatBox";

export default function ChatPage() {
  return (
    <Container className="flex min-h-[calc(100vh-4rem)] items-center py-12 sm:py-16">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header className="text-center space-y-3">
          <span className="inline-flex rounded-full border border-sky-200 bg-sky-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700">
            CampusAI Chat Assistant
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            CampusAI Chat Assistant
          </h1>
          <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
            Ask questions, draft messages, or interact with the assistant from a responsive chat workspace.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-200 bg-white/90 p-4 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6 lg:p-8">
          <ChatBox className="w-full" />
        </section>
      </div>
    </Container>
  );
}
