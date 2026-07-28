import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Campus AI | Smart Campus Experience",
  description: "A multi-agent platform for Campus AI, providing intelligent event discovery, ticketing, and personalized recommendations for students.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Campus AI",
    description: "Intelligent event discovery and ticketing platform.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} antialiased bg-slate-50/50`}>
        <div className="min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
