import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "CampusAI Event Agent",
  description: "A clean Next.js frontend scaffold for the CampusAI Event Agent.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navLinks = [
    { label: "Events", href: "/events" },
    { label: "For You", href: "/recommendations" },
    { label: "My Events", href: "/my-events" },
    { label: "Chat", href: "/chat" },
    { label: "Profile", href: "/profile" },
  ];

  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased`}>
        <div className="min-h-screen">
          <Navbar links={navLinks} />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
