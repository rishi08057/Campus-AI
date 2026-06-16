import { Sidebar } from "@/components/layout/Sidebar";

export default function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar />
      <main className="flex-1 pl-64">
        {children}
      </main>
    </div>
  );
}
