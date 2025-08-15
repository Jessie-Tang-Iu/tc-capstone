"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const popRef = useRef(null);
  const pathname = usePathname();

  // Close popover on route change
  useEffect(() => setIsMobileMenuOpen(false), [pathname]);

  // Close when clicking outside
  useEffect(() => {
    function onDocClick(e) {
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target)) setIsMobileMenuOpen(false);
    }
    if (isMobileMenuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-[0_6px_14px_-6px_rgba(0,0,0,0.18)]">
      {/* Brand: icon always, text ≥ sm */}
      <Link href="#" className="flex items-center space-x-2">
        <img src="/logo.jpeg" alt="Logo" className="w-8 h-8 shrink-0" />
        <span className="hidden sm:inline font-bold text-lg text-black whitespace-nowrap">
          Tech Connect Alberta
        </span>
      </Link>

      {/* Mobile Menu Button + Dropdown */}
      <div className="relative lg:hidden">
        <button
          className="p-2 text-black"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X size={24} className="text-black" />
          ) : (
            <Menu size={24} className="text-black" />
          )}
        </button>

        {isMobileMenuOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
            <ul className="flex flex-col text-black">
              <li>
                <Link
                  href="#"
                  className="block px-4 py-2 hover:text-orange-500"
                >
                  Register as Advisor
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="block px-4 py-2 hover:text-orange-500"
                >
                  Register as Employer
                </Link>
              </li>
              <li>
                <Link
                  href="/signIn"
                  className="block px-4 py-2 hover:text-orange-500"
                >
                  Sign In
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Desktop nav (lg+) */}
      <nav className="hidden lg:block">
        <ul className="flex items-center space-x-6 text-black">
          <li>
            <Link href="#" className="hover:text-orange-500">
              Register as Advisor
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-orange-500">
              Register as Employer
            </Link>
          </li>
          <li>
            <Link href="/signIn" className="hover:text-orange-500">
              Sign In
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
