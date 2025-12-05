"use client";

import Link from "next/link";
import Image from "next/image";

export default function Ourservices() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-20 py-20 bg-[#e6ddeb]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 items-center">

        {/* TEXT SECTION */}
        <div className="md:col-span-1 text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-6 leading-snug text-black italic">
            Our <br /> Services
          </h2>

          <p className="text-black text-base sm:text-lg md:text-lg leading-relaxed max-w-full md:max-w-md mb-8">
            Step into effortless beauty with our luxurious wigs. Carefully selected for superior quality and comfort, each wig in our collection is perfect for rental or purchase. Transform your look, elevate your style, and make every moment unforgettable.
          </p>

          <Link
            href="/orders"
            className="inline-block bg-black hover:bg-[#2b2b2a] text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg transition"
          >
            Shop Now
          </Link>
        </div>

        {/* IMAGE 1 */}
        <div className="
          relative                       /* Required for Image fill */
          bg-gray-300 rounded-3xl w-full 
          aspect-[4/3]                    /* Mobile */
          sm:aspect-[16/10]               /* Larger phones + tablets */
          md:h-[360px]                     /* Medium screens */
          lg:h-[420px]                     /* Desktop */
          overflow-hidden
        ">
          <Image
            src="/wigb.jpeg"
            alt="Bridal wig rentals"
            fill
            className="object-cover rounded-3xl"
          />
        </div>

        {/* IMAGE 2 */}
        <div className="
          relative
          bg-gray-300 rounded-3xl w-full 
          aspect-[4/3]
          sm:aspect-[16/10]
          md:h-[420px]
          lg:h-[500px]
          overflow-hidden
        ">
          <Image
            src="/wig8.jpeg"
            alt="Luxury wig sales"
            fill
            className="object-cover rounded-3xl"
          />
        </div>

      </div>
    </section>
  );
}
