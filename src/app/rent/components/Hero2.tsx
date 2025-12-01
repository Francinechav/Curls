"use client";

import Image from "next/image";

export default function Hero2() {
  return (
    <section className="relative w-full bg-[#f1e9f3] overflow-hidden">
      
      {/* --- LEFT IMAGE (Absolute Positioned) --- */}
      <div className="absolute left-0 bottom-0 md:bottom-[-40px] md:left-[50px] z-10">
        <div className="relative w-[430px] h-[400px] -bottom-3 -left-24">
          <Image
            src="/modela.png"
            alt="Left model"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* --- RIGHT IMAGE (Absolute Positioned) --- */}
      <div className="absolute right-0 bottom-0 md:bottom-[-40px] md:right-[50px] z-10">
        <div className="relative w-[400px] h-[690px] -bottom-35 -right-26">
          <Image
            src="/modelb.png"
            alt="Right model"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* --- CENTER TEXT --- */}
      <div className="max-w-4xl mx-auto text-center py-32 relative z-20">
        <h1 className="text-5xl md:text-6xl font-serif italic text-gray-900">
          Rent Elegance.<br />
          Remember Beauty.
        </h1>
        <p className="mt-4 text-lg text-[#767171]">
          Book your bridal wig with confidence.
        </p>
      </div>
    </section>
  );
}
