"use client";

import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";

export default function EmployerNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { signOut } = useClerk();
  const pathname = usePathname();
  const popRef = useRef(null);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/signIn");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  useEffect(() => setIsMobileMenuOpen(false), [pathname]);

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
      {/* Logo */}
      <Link
        href="/employerDashboard/message"
        className="flex items-center space-x-2"
      >
        <img src="/logo.jpeg" className="w-8 h-8" alt="Logo" />
        <span className="hidden sm:inline font-bold text-lg text-black whitespace-nowrap">
          Tech Connect Alberta
        </span>
      </Link>

      {/* Mobile Menu */}
      <div className="relative lg:hidden" ref={popRef}>
        <button
          aria-label="Open menu"
          className="p-2 text-black"
          onClick={() => setIsMobileMenuOpen((v) => !v)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {isMobileMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg ring-1 ring-black/5">
            <ul className="py-2 text-sm text-black">
              <li>
                <button
                  onClick={() => router.push("/employerDashboard/message")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => router.push("/employerDashboard/profile")}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50"
                >
                  Profile
                </button>
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

      {/* Desktop Nav */}
      <nav className="hidden lg:block">
        <ul className="flex items-center space-x-6 text-black">
          <li>
            <button
              onClick={() => router.push("/employerDashboard/message")}
              className="hover:text-orange-500"
            >
              Home
            </button>
          </li>

          <li>
            <button
              onClick={() => router.push("/employerDashboard/profile")}
              className="hover:text-orange-500"
            >
              Profile
            </button>
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
