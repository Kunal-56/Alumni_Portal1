"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Users, Menu, X, LogIn, LogOut, ChevronDown, Heart } from "lucide-react";

interface HeaderProps {
  activePage?: "home" | "members" | "donation" | "departments" | "events" | "gallery" | "news" | "contact";
}

export const Header: React.FC<HeaderProps> = ({ activePage = "home" }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("tolani_logged_in") || localStorage.getItem("tolani_logged_in");
      const email = sessionStorage.getItem("tolani_user_email") || localStorage.getItem("tolani_user_email") || "";
      if (stored === "true") {
        setLoggedIn(true);
        setUserEmail(email || "dakshahir14@gmail.com");
      }
    }
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("#user-profile-menu")) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("tolani_logged_in");
      sessionStorage.removeItem("tolani_user_email");
      localStorage.removeItem("tolani_logged_in");
      localStorage.removeItem("tolani_user_email");
    }
    setLoggedIn(false);
    setUserEmail("");
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const getInitials = (str: string) => {
    if (!str) return "DA";
    const namePart = str.split("@")[0].replace(/[^a-zA-Z0-9]/g, "");
    if (namePart.length >= 2) {
      return namePart.slice(0, 2).toUpperCase();
    }
    return (namePart[0] || "D").toUpperCase();
  };

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
          <Link
            href="/contact"
            className={activePage === "contact" ? "nav-link-active relative pb-1" : "hover:text-[#9B2335] transition-colors"}
          >
            Contact
          </Link>
          <Link
            href="/donation"
            className={activePage === "donation" ? "nav-link-active relative pb-1" : "hover:text-[#9B2335] transition-colors"}
          >
            Donation
          </Link>
        </div>

        {/* Action Buttons & Mobile Toggle */}
        <div className="flex items-center gap-2">
          {/* Auth State Button */}
          {loggedIn ? (
            <div className="relative" id="user-profile-menu">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-gray-200 hover:border-[#9B2335] bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-xs"
                style={{ borderColor: dropdownOpen ? "#9B2335" : undefined }}
              >
                {/* Circle with Initials e.g. "DA" */}
                <div className="w-8 h-8 rounded-full bg-[#9B2335] text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0 tracking-wider">
                  {getInitials(userEmail)}
                </div>
                {/* User ID / Email */}
                <span className="text-xs sm:text-sm font-bold text-gray-800 hidden sm:inline max-w-[170px] truncate">
                  {userEmail}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-gray-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                  style={{ border: "1.5px solid #f2e6e8" }}
                >
                  {/* User Info Header */}
                  <div className="flex items-center gap-3 p-2.5 bg-red-50/60 rounded-xl mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#9B2335] text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0 tracking-wider">
                      {getInitials(userEmail)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-extrabold text-gray-900 truncate">
                        {userEmail.split("@")[0]}
                      </div>
                      <div className="text-[11px] text-gray-500 truncate" title={userEmail}>
                        {userEmail}
                      </div>
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-100 text-[#9B2335]">
                        Active Alumni
                      </span>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="space-y-1">
                    <Link
                      href="/members"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Users size={14} className="text-[#9B2335]" />
                      Alumni Directory
                    </Link>
                    <Link
                      href="/donation"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Heart size={14} className="text-[#9B2335]" />
                      Support Portal
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 my-2" />

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left cursor-pointer"
                  >
                    <LogOut size={14} />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="btn-maroon flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-xl shadow-xs hover:shadow-md transition-all"
            >
              <LogIn size={15} />
              <span>Login</span>
            </Link>
          )}

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
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 px-3 rounded-lg ${activePage === "contact" ? "bg-red-50 text-[#9B2335] font-bold" : "hover:bg-gray-50"}`}
            >
              Contact
            </Link>
            <Link
              href="/donation"
              onClick={() => setMobileMenuOpen(false)}
              className={`py-1.5 px-3 rounded-lg ${activePage === "donation" ? "bg-red-50 text-[#9B2335] font-bold" : "hover:bg-gray-50"}`}
            >
              Donation
            </Link>

            {/* Mobile Auth Button */}
            <div className="pt-2 border-t border-gray-100">
              {loggedIn ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2.5 p-2 bg-red-50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-[#9B2335] text-white flex items-center justify-center text-xs font-black shrink-0">
                      {getInitials(userEmail)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-extrabold text-gray-900 truncate">{userEmail}</div>
                      <div className="text-[10px] text-gray-500">Logged In</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-maroon flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-bold rounded-xl"
                >
                  <LogIn size={15} />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
