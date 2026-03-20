import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Team Access Control",
  description: "Role Base Access Control",
  keywords: ["team", "access control"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-950 text-slate">{children}</body>
    </html>
  );
}
