"use client";

import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="flex justify-between items-center p-4 bg-white shadow-md">
      <Link href="/" className="flex items-center space-x-2">
        <img src="/logo.png" alt="Logo" className="w-8 h-8" />
        <span className="font-bold text-lg text-black">
          Tech Connect Alberta
        </span>
      </Link>

      {/* Mobile Menu Icon */}
      <button
        className="md:hidden p-2 text-black"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X size={24} className="text-black" />
        ) : (
          <Menu size={24} className="text-black" />
        )}
      </button>

      {/* Nav Links */}
      <nav
        className={`${
          isMobileMenuOpen
            ? "block absolute top-full left-0 w-full bg-white p-4 z-50"
            : "hidden md:block"
        }`}
      >
        <ul className="md:flex md:items-center md:space-x-6 text-black">
          <li>
            <Link href="#" className="block py-2 md:py-0 hover:text-orange-500">
              Home
            </Link>
          </li>
          <li className="relative group">
            <button className="flex items-center gap-1 py-2 hover:text-orange-500">
              Services <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-md hidden group-hover:block z-10">
              <Link
                href="#"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Option 1
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 text-sm hover:bg-gray-100"
              >
                Option 2
              </Link>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
}
