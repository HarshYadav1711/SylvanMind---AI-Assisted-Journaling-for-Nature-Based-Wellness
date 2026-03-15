import type { Metadata } from "next";
import { Lora } from "next/font/google";
import "./globals.css";

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SylvanMind",
  description: "AI-assisted journaling for nature-based wellness",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lora.variable}>
      <body className="min-h-screen antialiased">
        <nav className="border-b border-sage-200/60 bg-white/80 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
            <a href="/" className="font-serif text-xl font-medium text-sage-800">
              SylvanMind
            </a>
            <div className="flex gap-6">
              <a
                href="/"
                className="text-sm text-stone-600 transition hover:text-sage-700"
              >
                Home
              </a>
              <a
                href="/journal"
                className="text-sm text-stone-600 transition hover:text-sage-700"
              >
                Journal
              </a>
              <a
                href="/insights"
                className="text-sm text-stone-600 transition hover:text-sage-700"
              >
                Insights
              </a>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
