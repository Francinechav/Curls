"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  // Hide header/footer on certain routes
  const hideHeaderFooter =
    pathname.startsWith("/dashboard") || pathname.startsWith("/login");

  return (
    <>
      {!hideHeaderFooter && <Header />}
      <main className="min-h-screen">{children}</main>
      {!hideHeaderFooter && <Footer />}
    </>
  );
}
