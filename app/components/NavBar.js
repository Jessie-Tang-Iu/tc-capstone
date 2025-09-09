"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { signOut } from "@/lib/supabase_auth";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const popRef = useRef(null);

  // handle Log out function for user
  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/signIn");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  // Close popover on route change
  useEffect(() => setIsMobileMenuOpen(false), [pathname]);

  // Click outside to close
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
      {/* Brand: icon always; text only ≥ sm */}
      <Link href="/" className="flex items-center space-x-2">
        <Image
          src="/logo.jpeg"
          alt="Logo"
          width={32} // or whatever size your logo should be
          height={32}
          className="w-8 h-8 shrink-0"
        />
        <span className="hidden sm:inline font-bold text-lg text-black whitespace-nowrap">
          Tech Connect Alberta
        </span>
      </Link>

      {/* Mobile: hamburger + popover (shows ALL items) */}
      <div className="relative lg:hidden" ref={popRef}>
        <button
          aria-label="Open menu"
          aria-expanded={isMobileMenuOpen}
          className="p-2 text-black"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isMobileMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg ring-1 ring-black/5 overflow-hidden">
            <ul className="py-2 text-sm text-black">
              <li>
                <Link href="/" className="block px-4 py-2 hover:bg-gray-50">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/event"
                  className="block px-4 py-2 hover:bg-gray-50"
                >
                  Upcoming Event
                </Link>
              </li>
              <li>
                <Link
                  href="/myCalender"
                  className="block px-4 py-2 hover:bg-gray-50"
                >
                  My Calender
                </Link>
              </li>

              {/* Services (expand/collapse) */}
              <li>
                <button
                  className="w-full flex items-center justify-between px-4 py-2 hover:bg-gray-50"
                  onClick={() => setIsMobileServicesOpen((v) => !v)}
                  aria-expanded={isMobileServicesOpen}
                >
                  <span>Services</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      isMobileServicesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isMobileServicesOpen && (
                  <div className="pb-2">
                    <Link
                      href="#"
                      className="block pl-8 pr-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Option 1
                    </Link>
                    <Link
                      href="#"
                      className="block pl-8 pr-4 py-2 text-sm hover:bg-gray-50"
                    >
                      Option 2
                    </Link>
                  </div>
                )}
              </li>

              <li>
                <Link href="/jobBoard" className="block px-4 py-2 hover:bg-gray-50">
                  Job Board
                </Link>
              </li>
              <li>
                <Link href="/profile" className="block px-4 py-2 hover:bg-gray-50">
                  Profile
                </Link>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  Log Out
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Desktop nav only ≥ lg */}
      <nav className="hidden lg:block">
        <ul className="flex items-center space-x-6 text-black">
          <li>
            <Link href="/" className="hover:text-orange-500">
              Home
            </Link>
          </li>
          <li>
            <Link href="/event" className="hover:text-orange-500">
              Upcoming Event
            </Link>
          </li>
          <li>
            <Link href="/myCalender" className="hover:text-orange-500">
              My Calender
            </Link>
          </li>

          <li className="relative group">
            <button className="flex items-center gap-1 hover:text-orange-500">
              Services <ChevronDown className="w-4 h-4" />
            </button>
            <div className="absolute top-full left-0 mt-2 bg-white border rounded shadow-lg hidden group-hover:block">
              <Link
                href="#"
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                Option 1
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 text-sm hover:bg-gray-50"
              >
                Option 2
              </Link>
            </div>
          </li>

          <li>
            <Link href="/jobBoard" className="hover:text-orange-500">
              Job Board
            </Link>
          </li>
          <li>
            <Link href="/profile" className="hover:text-orange-500">
              Profile
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} className="hover:text-orange-500">
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
}
