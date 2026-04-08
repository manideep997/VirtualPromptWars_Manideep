import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sentient Stadium",
  description: "Live physical event experience dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-slate-900 text-slate-50 min-h-screen">
        {children}
      </body>
    </html>
  );
}
