"use client";

import Image from "next/image";

export default function Collection() {
  const wigs = [
    { name: "Body wave", image: "/bodywave.jpg"},
    { name: "Kinky", image: "/kinky2.jpg"},
    { name: "Water wave", image: "/wave5.jpg"},
    { name: "Water wave", image: "/wave6.jpg"},
  ];

  return (
    <section id="collection" className="px-6 py-20 md:px-20 lg:px-32 bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-16">
        <p className="text-[#727272] text-lg max-w-xl leading-relaxed text-left">
          Experience unmatched quality, comfort, and beauty designed to make your
          big day unforgettable.
        </p>
         <h2 className="text-3xl md:text-4xl italic font-serif mt-6 md:mt-0 text-right text-[#000000]">
          Our Collection
          </h2>

          {/* Mobile-only hint */}
          <span className="text-sm text-[#727272] mt-2 md:hidden block">
          Slide the photo to see more →
          </span>
        </div>

      {/* Cards */}
      <div
        className="
          flex space-x-6 overflow-x-auto scroll-hide
          md:grid md:grid-cols-4 md:gap-8 md:space-x-0 md:overflow-visible
        "
      >
        {wigs.map((wig, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-64 md:w-full transition-transform duration-300 hover:scale-105 cursor-pointer"
          >

            {/* Image */}
            <div className="rounded-2xl overflow-hidden shadow-md">
              <Image
                src={wig.image}
                alt={wig.name}
                width={400}
                height={500}
                className="object-cover w-full h-[420px]"
                priority
              />
            </div>

            <p className="text-center text-[#8b6d9c] mt-4 text-lg font-medium">
              {wig.name}
            </p>
          </div>
        ))}
      </div>

     {/* Explore Button */}
      <div className="mt-12 flex justify-center">
        <a
          href="/orders" // <-- page to navigate to
          className="bg-[#856e91] text-white px-4 py-4 rounded-full text-sm font-medium hover:bg-[#594a61] transition"
        >
          Explore Our Collection
        </a>
      </div>

    </section>
  );
}
  