import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GEO-Pulse | AI Visibility Auditor",
  description: "Audit and boost brand visibility across AI search engines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-zinc-950 text-zinc-50 antialiased`}>
        <div className="flex flex-col min-h-screen">
          <header className="border-b border-zinc-800 bg-zinc-950/50 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/20">
            <div className="container mx-auto flex h-14 items-center justify-between px-4">
              <div className="flex items-center space-x-4">
                <a href="/" className="flex items-center space-x-2">
                  <span className="font-bold text-xl tracking-tight text-white">GEO-Pulse</span>
                </a>
              </div>
              <nav className="flex items-center space-x-6 text-sm font-medium">
                <a href="/" className="transition-colors hover:text-zinc-300 text-zinc-50">Dashboard</a>
                <a href="/audit" className="transition-colors hover:text-zinc-300 text-zinc-400">Run Audit</a>
              </nav>
            </div>
          </header>
          <main className="flex-1 container mx-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
