import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
