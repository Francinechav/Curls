import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative w-full min-h-[75vh] md:min-h-[90vh] flex items-center bg-[#B1A4AC] overflow-hidden">
      {/* Background image */}
      <Image
        src="/web.png"
        alt="Bridal wigs models"
        fill
        priority
        className="object-cover object-top"
      />

 

      {/* Text content */}
      {/* Text content */}
<div className="relative z-10 max-w-xl md:max-w-2xl px-6 md:px-10 py-20 text-white text-left">
  <h1 className="text-3xl text-white leading-tight md:text-5xl font-serif italic mb-6">
    Bridal Wigs Crafted <br /> for Perfection
  </h1>

  <p className="text-base md:text-lg mb-8 text-white max-w-lg">
    Experience unmatched quality, comfort, and beauty<br></br> 
    designed to make your big day unforgettable…
  </p>

 <Link href="/rent">
      <button className="bg-black text-white px-6 py-3 rounded-full text-lg hover:bg-[#2b2b2a] transition">
        Rent Now
      </button>
    </Link>
</div>


      {/* Down arrow */}
     {/* Down arrow */}
<div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce z-50">
  <a href="#collection">
    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/90 shadow-md hover:bg-white transition">
      <span className="text-black text-2xl">⌄</span>
    </div>
  </a>
</div>


    </section>
  );
}
