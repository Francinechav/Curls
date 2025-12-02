
"use client"
import Image from "next/image";
import React, { useState } from "react";
import { ShoppingBag, Search, User, Menu, X } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className={`${poppins.className} w-full bg-white border-b border-gray-100`}>

      {/* Main Navbar */}
    <div className="max-w-7xl mx-auto flex items-center justify-between py-4 px-4 sm:px-6 md:px-8">
<Link href="/" className="flex items-center">
  <Image
    src="/logo.png"
    alt="Curls Logo"
    width={120}
    height={48}
    className="object-contain"
  />
</Link>


        {/* Desktop Nav Links */}
        <nav className="hidden md:flex gap-10 text-base text-black font-normal">
  <Link href="/" className="hover:text-gray-500 transition">Home</Link>
  <Link href="/rent" className="hover:text-gray-500 transition">Rent</Link>
  <Link href="/orders" className="hover:text-gray-500 transition">Shop</Link>
  <Link href="/contactus" className="hover:text-gray-500 transition">Contact us</Link>
</nav>


        {/* Icons */}
        {/* Icons */}
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/orders" aria-label="Shopping Bag">
            <ShoppingBag className="w-5 h-5 cursor-pointer hover:text-gray-500 transition text-black" />
          </Link>
          <Link href="/rent" aria-label="Search">
            <Search className="w-5 h-5 cursor-pointer hover:text-gray-500 transition text-black" />
          </Link>
          <Link href="/contactus" aria-label="User Account">
            <User className="w-5 h-5 cursor-pointer hover:text-gray-500 transition text-black" />
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-2 text-black"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {menuOpen && (
       <nav className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-4 text-black font-medium">
    <Link href="/" className="hover:text-gray-500 transition">Home</Link>
    <Link href="/rent" className="hover:text-gray-500 transition">Rent</Link>
    <Link href="/orders" className="hover:text-gray-500 transition">Shop</Link>
    <Link href="/contactus" className="hover:text-gray-500 transition">Contact us</Link>
  </nav>
      )}
       <div className="bg-black text-white text-sm flex justify-center items-center py-2 px-4 md:px-6">
        <p className="font-medium text-center">New Stock alert in our shop!</p>
      </div>
    </header>
  );
};

export default Header;
