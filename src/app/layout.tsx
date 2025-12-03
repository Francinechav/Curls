"use client";

import { usePathname } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideHeaderFooter =
    pathname.startsWith("/dashboard") || pathname.startsWith("/login");

  return (
    <html lang="en">
      <body className="font-sans bg-white text-gray-900">
        {!hideHeaderFooter && <Header />}
        <main className="min-h-screen">{children}</main>
        {!hideHeaderFooter && <Footer />}
      </body>
    </html>
  );
}
