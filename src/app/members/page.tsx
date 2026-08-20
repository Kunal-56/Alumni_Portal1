"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users, Search, MapPin, Briefcase, ChevronLeft, ChevronRight,
  Facebook, Linkedin, Twitter, Instagram, Youtube, Send,
  CheckCircle2, SlidersHorizontal, Heart
} from "lucide-react";
import { Header } from "@/components/Header";
import "../dashboard.css";

/* ─── Types ─── */
interface Member {
  id: number;
  name: string;
  degree: string;
  year: string;
  dept: string;
  company: string;
  location: string;
  avatar: string;
  verified: boolean;
}

/* ─── Data ─── */
const ALL_MEMBERS: Member[] = [
  { id: 1, name: "Daksh Ahir", degree: "B.Tech", year: "2025", dept: "CSE", company: "Google", location: "Bangalore, India", avatar: "/avatars/m1.jpg", verified: true },
  { id: 2, name: "Kunal Solanki", degree: "B.Tech", year: "2024", dept: "CSE", company: "Microsoft", location: "Hyderabad, India", avatar: "/avatars/m2.jpg", verified: true },
  { id: 3, name: "Khushal Bhatiya", degree: "BA (J&MC)", year: "2026", dept: "Journalism", company: "Zomato", location: "Gurugram, India", avatar: "/avatars/f1.jpg", verified: true },
  { id: 4, name: "Raghav Rathod", degree: "BBA", year: "2026", dept: "Business", company: "Deloitte", location: "Mumbai, India", avatar: "/avatars/m3.jpg", verified: true },
  { id: 5, name: "Bhoomi Sumbad", degree: "B.Tech", year: "2026", dept: "CSE", company: "Amazon", location: "Chennai, India", avatar: "/avatars/m4.jpg", verified: true },
  { id: 6, name: "Dev Gouswami", degree: "BA (J&MC)", year: "2020", dept: "Journalism", company: "Times Of India", location: "Kolkata, India", avatar: "/avatars/f2.jpg", verified: true },
  { id: 7, name: "Parth Pitroda", degree: "B.Tech", year: "2023", dept: "IT", company: "Infosys", location: "Pune, India", avatar: "/avatars/m5.jpg", verified: true },
  { id: 8, name: "Solanki Yashvi", degree: "BBA", year: "2021", dept: "Business", company: "Accenture", location: "Noida, India", avatar: "/avatars/f3.jpg", verified: true },
  { id: 9, name: "Priya Nair", degree: "B.Tech", year: "2022", dept: "ECE", company: "TCS", location: "Kochi, India", avatar: "/avatars/f4.jpg", verified: true },
  { id: 10, name: "Vikram Tiwari", degree: "M.Tech", year: "2021", dept: "CSE", company: "Wipro", location: "Bhopal, India", avatar: "/avatars/m6.jpg", verified: true },
  { id: 11, name: "Meera Joshi", degree: "B.Tech", year: "2020", dept: "IT", company: "HCL", location: "Delhi, India", avatar: "/avatars/f5.jpg", verified: true },
  { id: 12, name: "Aarav Singh", degree: "BBA", year: "2023", dept: "Business", company: "KPMG", location: "Ahmedabad, India", avatar: "/avatars/m7.jpg", verified: true },
  { id: 13, name: "Divya Patel", degree: "B.Tech", year: "2024", dept: "CSE", company: "Flipkart", location: "Surat, India", avatar: "/avatars/f6.jpg", verified: true },
  { id: 14, name: "Rahul Verma", degree: "MBA", year: "2022", dept: "Management", company: "HDFC Bank", location: "Jaipur, India", avatar: "/avatars/m8.jpg", verified: true },
  { id: 15, name: "Tanvi Desai", degree: "B.Tech", year: "2021", dept: "Mechanical", company: "Tata Motors", location: "Vadodara, India", avatar: "/avatars/f7.jpg", verified: true },
  { id: 16, name: "Karan Malhotra", degree: "B.Tech", year: "2025", dept: "Civil", company: "L&T", location: "Chandigarh, India", avatar: "/avatars/m9.jpg", verified: true },
];

const YEARS = ["2020", "2021", "2022", "2023", "2024", "2025", "2026"];
const DEPARTMENTS = ["Computer", "Civil", "Electrical", "Mechanical", "CDDM", "CSE", "IT", "ECE", "Business", "Journalism", "Management"];
const INDUSTRIES = ["Technology", "Finance", "Media", "Manufacturing", "Consulting", "E-commerce"];
const LOCATIONS = ["Delhi, India", "Mumbai, India", "Bangalore, India", "Hyderabad, India", "Chennai, India", "Pune, India", "Kolkata, India"];

const TOTAL = 16;
const PER_PAGE = 8;

/* ─── Avatar placeholder colors ─── */
const AVATAR_COLORS = [
  "#9B2335", "#2563eb", "#059669", "#7c3aed", "#d97706", "#0891b2", "#be185d", "#374151"
];

function AvatarPlaceholder({ name, index }: { name: string; index: number }) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const bg = AVATAR_COLORS[index % AVATAR_COLORS.length];
  return (
    <div
      className="w-full h-full rounded-full flex items-center justify-center text-white font-extrabold text-2xl"
      style={{ background: bg }}
    >
      {initials}
    </div>
  );
}

export default function MembersPage() {
  const [search, setSearch] = useState("");
  const [year, setYear] = useState("");
  const [dept, setDept] = useState("");
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [page, setPage] = useState(1);

  /* Filter logic */
  const filtered = ALL_MEMBERS.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.company.toLowerCase().includes(q) || m.dept.toLowerCase().includes(q);
    const matchYear = !year || m.year === year;
    const matchDept = !dept || m.dept === dept;
    const matchLoc = !location || m.location === location;
    return matchSearch && matchYear && matchDept && matchLoc;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = () => setPage(1);

  return (
    <div className="dashboard-body min-h-screen" style={{ overflowY: "auto", overflowX: "hidden", background: "#faf8f8" }}>

      {/* ── Navbar ── */}
      <Header activePage="members" />

      {/* ── Hero Header ── */}
      <div style={{ background: "linear-gradient(135deg, #fef0f2 0%, #fff5f5 60%, #fdf8f0 100%)" }} className="py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "#9B2335" }}>OUR ALUMNI NETWORK</p>
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              Members <span style={{ color: "#9B2335" }}>Directory</span>
            </h1>
            <p className="text-sm text-gray-500 mt-2 max-w-md">
              Search and connect with friends, batchmates and other alumni from around the world.
            </p>
          </div>

          {/* Total Members Badge */}
          <div className="bg-white rounded-2xl shadow-md px-6 py-4 flex items-center gap-4 shrink-0" style={{ border: "1.5px solid #f0e8e4" }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#fef0f2" }}>
              <Users size={24} style={{ color: "#9B2335" }} />
            </div>
            <div>
              <div className="text-3xl font-extrabold text-gray-900">{TOTAL.toLocaleString()}</div>
              <div className="text-xs font-semibold text-gray-500">Total Members</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Search & Filters ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row flex-wrap gap-3 items-stretch sm:items-center" style={{ border: "1px solid #f0e8e4" }}>
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex-1 min-w-[180px] w-full sm:w-auto">
            <Search size={15} className="text-gray-400 shrink-0" />
            <input
              type="text"
              placeholder="Search by name, company..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              className="bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
            />
          </div>

          {/* Select filters grid on mobile */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-3 w-full sm:w-auto flex-1">
            {/* Year */}
            <div className="relative w-full sm:w-auto">
              <select
                value={year}
                onChange={e => { setYear(e.target.value); setPage(1); }}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-gray-600 pr-8 outline-none cursor-pointer"
              >
                <option value="">Select Year</option>
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
            </div>

            {/* Department */}
            <div className="relative w-full sm:w-auto">
              <select
                value={dept}
                onChange={e => { setDept(e.target.value); setPage(1); }}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-gray-600 pr-8 outline-none cursor-pointer"
              >
                <option value="">Select Department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
              <ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
            </div>

            {/* Industry */}
            <div className="relative w-full sm:w-auto">
              <select
                value={industry}
                onChange={e => { setIndustry(e.target.value); setPage(1); }}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-gray-600 pr-8 outline-none cursor-pointer"
              >
                <option value="">Select Industry</option>
                {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
              </select>
              <ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
            </div>

            {/* Location */}
            <div className="relative w-full sm:w-auto">
              <select
                value={location}
                onChange={e => { setLocation(e.target.value); setPage(1); }}
                className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-3 sm:px-4 py-2.5 text-xs sm:text-sm text-gray-600 pr-8 outline-none cursor-pointer"
              >
                <option value="">Select Location</option>
                {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
              <ChevronRight size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 rotate-90 pointer-events-none" />
            </div>
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="btn-maroon flex items-center justify-center gap-2 px-5 py-2.5 text-sm shrink-0 w-full sm:w-auto mt-1 sm:mt-0"
          >
            <Search size={15} />
            Search
          </button>
        </div>
      </div>

      {/* ── Members Grid ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        {paginated.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Users size={48} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-semibold">No members found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {paginated.map((member, idx) => (
              <Link
                key={member.id}
                href={`/members/${member.id}`}
                className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer group"
                style={{ border: "1.5px solid #f0e8e4" }}
              >
                {/* Avatar */}
                <div className="relative mb-3">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden ring-2 ring-white shadow-md">
                    <AvatarPlaceholder name={member.name} index={(page - 1) * PER_PAGE + idx} />
                  </div>
                  {member.verified && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <CheckCircle2 size={16} style={{ color: "#22c55e" }} fill="#22c55e" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="text-sm font-extrabold text-gray-900 mb-0.5 group-hover:text-[#9B2335] transition-colors line-clamp-1">{member.name}</h3>
                <p className="text-[11px] text-gray-500 font-medium mb-3 line-clamp-1">
                  {member.degree}, {member.year}, {member.dept}
                </p>

                {/* Company */}
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-600 font-semibold mb-1 w-full truncate">
                  <Briefcase size={11} style={{ color: "#9B2335" }} className="shrink-0" />
                  <span className="truncate">{member.company}</span>
                </div>

                {/* Location */}
                <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 w-full truncate">
                  <MapPin size={11} style={{ color: "#9B2335" }} className="shrink-0" />
                  <span className="truncate">{member.location}</span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-9 h-9 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{ borderColor: "#e5e7eb" }}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-9 h-9 rounded-full font-bold text-sm transition-all"
                style={page === p
                  ? { background: "#9B2335", color: "white" }
                  : { background: "white", color: "#374151", border: "1.5px solid #e5e7eb" }
                }
              >
                {p}
              </button>
            ))}

            {totalPages > 5 && (
              <>
                <span className="text-gray-400 font-bold">···</span>
                <button
                  onClick={() => setPage(93)}
                  className="w-9 h-9 rounded-full font-bold text-sm transition-all"
                  style={{ background: "white", color: "#374151", border: "1.5px solid #e5e7eb" }}
                >
                  93
                </button>
              </>
            )}

            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-9 h-9 rounded-full border flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              style={{ borderColor: "#e5e7eb" }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      <footer className="footer-dark pt-12 pb-0 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-10">
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative w-9 h-9 bg-white rounded-full p-1">
                  <Image src="/logo.jpg" alt="Tolani" fill className="object-contain" unoptimized />
                </div>
                <div>
                  <div className="text-xs font-extrabold tracking-widest text-white whitespace-nowrap">TOLANI F.G. POLYTECHNIC</div>
                  <div className="text-[10px] font-bold tracking-wider" style={{ color: "#c0586a" }}>ALUMNI PORTAL</div>
                </div>
              </div>
              <p className="text-[12px] text-gray-500 leading-relaxed mb-4">The official alumni community of Tolani Foundation.</p>
              <div className="flex gap-3">
                {[Facebook, Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-800 text-gray-400 hover:bg-[#9B2335] hover:text-white transition-all">
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </div>
            <div className="lg:col-span-2">
              <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
              {["Members", "Jobs & Internships", "Events", "Gallery", "Contact Us"].map(l => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>
            <div className="lg:col-span-2">
              <h4 className="text-sm font-bold text-white mb-4">Resources</h4>
              {["News Corner", "Success Stories", "Mentorship", "Batchmates", "Help & Support"].map(l => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>
            <div className="lg:col-span-2">
              <h4 className="text-sm font-bold text-white mb-4">Support</h4>
              {["FAQs", "Privacy Policy", "Terms of Use"].map(l => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>
            <div className="lg:col-span-3">
              <h4 className="text-sm font-bold text-white mb-4">Stay Connected</h4>
              <div className="flex gap-2 mb-3">
                <input type="email" placeholder="Enter your email" className="flex-1 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#9B2335]" />
                <button className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#9B2335" }}>
                  <Send size={14} className="text-white" />
                </button>
              </div>
              <p className="text-[11px] text-gray-500">Get the latest updates and events straight to your inbox.</p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-left">
            <p className="text-[12px] text-gray-600">© 2026 Tolani Alumni Portal. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
