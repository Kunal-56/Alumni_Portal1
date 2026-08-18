"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Menu, X } from "lucide-react";

interface HeaderProps {
  activePage?: "home" | "members" | "donation" | "departments" | "events" | "gallery" | "news" | "contact";
}

export const Header: React.FC<HeaderProps> = ({ activePage = "home" }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("tolani_logged_in");
      setLoggedIn(stored === "true");
    }
  }, []);

  return (
    <nav className="dash-nav relative z-50" style={{ background: "white", borderBottom: "1px solid #f0e8e4" }}>
      <div className="w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-[64px]">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer shrink-0">
          <div className="relative w-10 h-10 shrink-0">
            <Image src="/logo.jpg" alt="Tolani Logo" fill className="object-contain" unoptimized />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-xs sm:text-sm font-extrabold tracking-wider text-gray-900 whitespace-nowrap">
              TOLANI F. G. POLYTECHNIC
            </span>
            <span className="text-[10px] font-bold tracking-widest" style={{ color: "#9B2335" }}>
              ALUMNI PORTAL
            </span>
          </div>
        </Link>

        {/* Nav Links (Desktop) */}
        <div className="hidden md:flex items-center gap-6 text-base sm:text-[17px] font-bold text-gray-700">
          <Link
            href="/"
            className={activePage === "home" ? "nav-link-active relative pb-1" : "hover:text-[#9B2335] transition-colors"}
          >
            Home
          </Link>
          <Link
            href="/members"
            className={activePage === "members" ? "nav-link-active relative pb-1" : "hover:text-[#9B2335] transition-colors"}
          >
            Members
          </Link>
          <a
            href="/#departments"
            className={activePage === "departments" ? "nav-link-active relative pb-1" : "hover:text-[#9B2335] transition-colors"}
          >
            Departments
          </a>
          <a
            href="/#events"
            className={activePage === "events" ? "nav-link-active relative pb-1" : "hover:text-[#9B2335] transition-colors"}
          >
            Events
          </a>
          <a
            href="/#gallery"
            className={activePage === "gallery" ? "nav-link-active relative pb-1" : "hover:text-[#9B2335] transition-colors"}
          >
            Gallery
          </a>
          <a
            href="/#news"
            className={activePage === "news" ? "nav-link-active relative pb-1" : "hover:text-[#9B2335] transition-colors"}
          >
            News
          </a>
          <a
            href="#"
            className={activePage === "contact" ? "nav-link-active relative pb-1" : "hover:text-[#9B2335] transition-colors"}
          >
            Contact
          </a>
          <Link
            href="/donation"
            className={activePage === "donation" ? "nav-link-active relative pb-1" : "hover:text-[#9B2335] transition-colors"}
          >
            Donation
          </Link>
        </div>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* My Profile Button */}
          <Link href="/login" className="btn-maroon flex items-center gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm">
            <Users size={15} />
            <span className="hidden sm:inline">My Profile</span>
            <span className="sm:hidden">Profile</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#9B2335] focus:outline-none rounded-lg hover:bg-gray-100"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pt-3 pb-5 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3 text-base font-bold text-gray-700">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 px-3 rounded-lg ${activePage === "home" ? "bg-red-50 text-[#9B2335] font-bold" : "hover:bg-gray-50"}`}
            >
              Home
            </Link>
            <Link
              href="/members"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 px-3 rounded-lg ${activePage === "members" ? "bg-red-50 text-[#9B2335] font-bold" : "hover:bg-gray-50"}`}
            >
              Members
            </Link>
            <a
              href="/#departments"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 px-3 rounded-lg ${activePage === "departments" ? "bg-red-50 text-[#9B2335] font-bold" : "hover:bg-gray-50"}`}
            >
              Departments
            </a>
            <a
              href="/#events"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 px-3 rounded-lg ${activePage === "events" ? "bg-red-50 text-[#9B2335] font-bold" : "hover:bg-gray-50"}`}
            >
              Events
            </a>
            <a
              href="/#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 px-3 rounded-lg ${activePage === "gallery" ? "bg-red-50 text-[#9B2335] font-bold" : "hover:bg-gray-50"}`}
            >
              Gallery
            </a>
            <a
              href="/#news"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 px-3 rounded-lg ${activePage === "news" ? "bg-red-50 text-[#9B2335] font-bold" : "hover:bg-gray-50"}`}
            >
              News
            </a>
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 px-3 rounded-lg ${activePage === "contact" ? "bg-red-50 text-[#9B2335] font-bold" : "hover:bg-gray-50"}`}
            >
              Contact
            </a>
            <Link
              href="/donation"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 px-3 rounded-lg ${activePage === "donation" ? "bg-red-50 text-[#9B2335] font-bold" : "hover:bg-gray-50"}`}
            >
              Donation
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
