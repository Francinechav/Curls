"use client";
import Image from "next/image";

export default function Header2() {
  return (
    <header className="w-full h-16 bg-white border-b  border-gray-200 flex items-center justify-end px-6">

      <div className="flex items-center gap-4">
        <Image src="/logo.png" alt="Logo" width={40} height={40} />

      </div>
    </header>
  );
}
