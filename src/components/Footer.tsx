import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-gray-300 pt-16">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* 1. Logo & Tagline */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Curls Logo"
              width={50}
              height={50}
              className="rounded-full"
            />
            <h2 className="text-3xl font-serif italic text-[#E6DDEB]">
              Cur<span className="font-light text-[#856e91]">ls</span>
            </h2>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Elevate your look with premium wigs crafted for style, comfort, and confidence.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 5 3.66 9.13 8.44 9.88v-6.99h-2.54V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 17 22 12z"/></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.2c3.2 0 3.584.012 4.85.07 1.17.054 1.97.24 2.44.4a4.92 4.92 0 0 1 1.78 1.16 4.918 4.918 0 0 1 1.16 1.78c.16.47.346 1.27.4 2.44.058 1.266.07 1.65.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.4 2.44a4.92 4.92 0 0 1-1.16 1.78 4.918 4.918 0 0 1-1.78 1.16c-.47.16-1.27.346-2.44.4-1.266.058-1.65.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.44-.4a4.92 4.92 0 0 1-1.78-1.16 4.918 4.918 0 0 1-1.16-1.78c-.16-.47-.346-1.27-.4-2.44-.058-1.266-.07-1.65-.07-4.85s.012-3.584.07-4.85c.054-1.17.24-1.97.4-2.44a4.92 4.92 0 0 1 1.16-1.78 4.918 4.918 0 0 1 1.78-1.16c.47-.16 1.27-.346 2.44-.4C8.416 2.212 8.8 2.2 12 2.2zm0-2.2C8.736 0 8.332.012 7.052.07 5.77.128 4.905.308 4.15.548c-.78.244-1.44.57-2.09 1.22-.65.65-.975 1.31-1.22 2.09-.24.755-.42 1.62-.478 2.902C.012 8.332 0 8.736 0 12s.012 3.668.07 4.948c.058 1.282.238 2.147.478 2.902.244.78.57 1.44 1.22 2.09.65.65 1.31.975 2.09 1.22.755.24 1.62.42 2.902.478C8.332 23.988 8.736 24 12 24s3.668-.012 4.948-.07c1.282-.058 2.147-.238 2.902-.478.78-.244 1.44-.57 2.09-1.22.65-.65.975-1.31 1.22-2.09.24-.755.42-1.62.478-2.902C23.988 15.668 24 15.264 24 12s-.012-3.668-.07-4.948c-.058-1.282-.238-2.147-.478-2.902-.244-.78-.57-1.44-1.22-2.09-.65-.65-1.31-.975-2.09-1.22-.755-.24-1.62-.42-2.902-.478C15.668.012 15.264 0 12 0z"/></svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-purple-400 transition">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 4.557a9.94 9.94 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.555-2.005.959-3.127 1.184a4.916 4.916 0 0 0-8.384 4.482C7.69 8.094 4.066 6.13 1.64 3.161c-.542.928-.855 2.004-.855 3.15 0 2.17 1.105 4.083 2.788 5.203a4.904 4.904 0 0 1-2.228-.616v.062c0 3.034 2.157 5.567 5.022 6.14a4.935 4.935 0 0 1-2.224.085c.626 1.955 2.444 3.377 4.6 3.415A9.867 9.867 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.01-7.514 14.01-14.034 0-.213-.005-.425-.014-.637A10.012 10.012 0 0 0 24 4.557z"/></svg>
            </a>
          </div>
        </div>

        {/* 2. Quick Links */}
        <div>
          <h3 className="uppercase text-sm font-semibold mb-4 text-[#856e91]">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/orders" className="hover:text-purple-400 transition duration-300 ease-in-out transform hover:translate-x-1">
                Shop
              </Link>
            </li>
            <li>
              <Link href="/rent" className="hover:text-purple-400 transition duration-300 ease-in-out transform hover:translate-x-1">
                Bridal Hire
              </Link>
            </li>
            <li>
              <Link href="/rent" className="hover:text-purple-400 transition duration-300 ease-in-out transform hover:translate-x-1">
                Explore
              </Link>
            </li>
            <li>
              <Link href="/contactus" className="hover:text-purple-400 transition duration-300 ease-in-out transform hover:translate-x-1">
                Contact Us
              </Link>
            </li>
          </ul>

        </div>

        {/* 3. Customer Care */}
        <div>
          <h3 className="uppercase text-sm font-semibold mb-4 text-[#856e91]">Customer Care</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/#faqq" className="hover:text-purple-400 transition duration-300 ease-in-out transform hover:translate-x-1">
                FAQs
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-purple-400 transition duration-300 ease-in-out transform hover:translate-x-1">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link href="/policy" className="hover:text-purple-400 transition duration-300 ease-in-out transform hover:translate-x-1">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* 4. Contact Info */}
        <div className="space-y-2">
          <h3 className="uppercase text-sm font-semibold mb-4 text-[#856e91]">Contact Info</h3>
          <p className="text-sm text-gray-400">Lilongwe, Malawi</p>
          <p className="text-sm text-gray-400">Email: hello@curls.com</p>
          <p className="text-sm text-gray-400">Phone: +265 123 456 789</p>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Curls — All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
