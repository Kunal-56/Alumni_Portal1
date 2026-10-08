"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight, Search, ImageIcon,
  Send, Facebook, Linkedin, Twitter,
  Instagram, Youtube, ArrowUp, X
} from "lucide-react";
import { Header } from "@/components/Header";
import "@/app/dashboard.css";

interface GalleryItem {
  label: string;
  bg: string;
  category: string;
  year: string;
  desc: string;
}

const ALL_GALLERY: GalleryItem[] = [
  { label: "Alumni Meet 2026", bg: "#2a1a1f", category: "Annual Event", year: "2026", desc: "A grand gathering of Tolani alumni from across the globe, celebrating bonds and shared memories." },
  { label: "Virtual Alumni Reunion", bg: "#1a2030", category: "Virtual", year: "2026", desc: "An online reunion connecting alumni from 50+ countries through screens and shared stories." },
  { label: "Networking Session", bg: "#1e2820", category: "Networking", year: "2026", desc: "An evening of meaningful connections, collaborations and career conversations among alumni." },
  { label: "Campus Visit", bg: "#203020", category: "Campus", year: "2026", desc: "Alumni walked the hallways they once called home, reliving the golden days of their college years." },
  { label: "Guest Lecture Series", bg: "#1c1c2e", category: "Academic", year: "2026", desc: "Distinguished alumni shared their journeys and insights with current students and fellow graduates." },
  { label: "Cultural Night 2026", bg: "#2e1c1c", category: "Cultural", year: "2026", desc: "A vibrant evening filled with music, dance and art celebrating the diverse cultures of Tolani." },
  { label: "Computer Lab Hackathon", bg: "#1e293b", category: "Tech", year: "2026", desc: "48-hour coding marathon where Computer Department alumni built innovative solutions together." },
  { label: "Annual Tech Symposium", bg: "#9B2335", category: "Tech", year: "2025", desc: "Industry leaders and alumni came together to discuss emerging technologies and future trends." },
  { label: "Coding Competition Finals", bg: "#0f766e", category: "Competition", year: "2026", desc: "The exciting finale of the annual coding competition, showcasing top talent from all batches." },
  { label: "Civil Engineering Site Visit", bg: "#3b0764", category: "Department", year: "2026", desc: "Civil Department alumni visited a major infrastructure project guided by their fellow alumni." },
  { label: "Department Graduation 2026", bg: "#451a03", category: "Graduation", year: "2026", desc: "A proud and emotional ceremony marking the beginning of new journeys for the Class of 2026." },
  { label: "Tolani Sports Day", bg: "#1e3a5f", category: "Sports", year: "2025", desc: "Alumni came together for friendly sporting competitions, reliving the energy of their campus days." },
  { label: "Electrical Lab Workshop", bg: "#064e3b", category: "Department", year: "2026", desc: "A hands-on workshop in the electrical labs demonstrating power systems and automation projects." },
  { label: "CDDM Fashion Show", bg: "#500724", category: "Cultural", year: "2026", desc: "A dazzling fashion showcase by CDDM alumni presenting original designs on a grand runway." },
  { label: "Mechanical Innovation Expo", bg: "#365314", category: "Department", year: "2026", desc: "Mechanical alumni showcased cutting-edge design projects and engineering prototypes." },
  { label: "Alumni Award Ceremony", bg: "#1c1917", category: "Annual Event", year: "2025", desc: "Celebrating outstanding alumni for their contributions to industry, society and innovation." },
  { label: "Sports Tournament 2025", bg: "#1e3a3a", category: "Sports", year: "2025", desc: "A thrilling inter-batch sports tournament with cricket, football and badminton championships." },
  { label: "New Year Alumni Bash", bg: "#2d1b69", category: "Social", year: "2025", desc: "A grand end-of-year celebration bringing alumni together to welcome the new year with joy." },
];

const CATEGORIES = ["All", "Annual Event", "Virtual", "Networking", "Campus", "Academic", "Cultural", "Tech", "Competition", "Department", "Graduation", "Sports", "Social"];

export default function GalleryPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const [showTop, setShowTop] = useState(false);

  const filtered = ALL_GALLERY.filter(g => {
    const matchSearch = g.label.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase()) ||
      g.desc.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || g.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div
      className="dashboard-body min-h-screen"
      style={{ overflowY: "auto", overflowX: "hidden", background: "#fafafa" }}
      onScroll={(e) => setShowTop((e.currentTarget.scrollTop ?? 0) > 300)}
    >
      <Header activePage="home" />

      {/* ── Page Hero Banner ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold mb-3">
            <Link href="/" className="hover:text-[#9B2335] transition-colors">Home</Link>
            <ChevronRight size={13} />
            <span className="text-gray-900">Gallery</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            Gallery Highlights
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium max-w-xl">
            Moments, memories and milestones. Explore the vibrant story of Tolani&apos;s alumni community through our curated gallery.
          </p>

        </div>
      </section>

      {/* ── Search & Filter ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search gallery by event name or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:border-[#9B2335] transition-colors shadow-xs"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={activeCategory === cat
                ? { background: "#9B2335", color: "white", borderColor: "#9B2335" }
                : { background: "white", color: "#555", borderColor: "#e5e7eb" }
              }
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">All Photos</h2>
            <div className="section-underline" style={{ margin: "5px 0 0", marginLeft: "0" }} />
          </div>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
            {filtered.length} photo{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {/* Gallery Grid - Masonry-style */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <ImageIcon size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-semibold text-sm">No photos found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((g, i) => (
              <div
                key={i}
                className={`gallery-card group cursor-pointer rounded-2xl overflow-hidden ${i % 7 === 0 || i % 7 === 4 ? "sm:col-span-2" : ""}`}
                style={{ background: g.bg, height: i % 7 === 0 || i % 7 === 4 ? "240px" : "190px" }}
                onClick={() => setLightbox(g)}
              >
                <Image
                  src="/campus-building.png"
                  alt={g.label}
                  fill
                  className="object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-400"
                  unoptimized
                />
                {/* Category badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm shadow" style={{ color: "#9B2335" }}>
                    {g.category}
                  </span>
                </div>
                {/* Year badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-black/40 text-white backdrop-blur-sm">
                    {g.year}
                  </span>
                </div>
                {/* Hover overlay */}
                <div className="gallery-overlay z-10 flex flex-col justify-end">
                  <p className="text-white text-xs font-extrabold leading-snug">{g.label}</p>
                  <p className="text-white/70 text-[10px] font-medium mt-0.5 line-clamp-2">{g.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Lightbox Modal ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[999] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative h-64 sm:h-80 w-full" style={{ background: lightbox.bg }}>
              <Image src="/campus-building.png" alt={lightbox.label} fill className="object-cover opacity-80" unoptimized />
              <button
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-all"
                onClick={() => setLightbox(null)}
              >
                <X size={18} />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/90 text-[#9B2335]">
                  {lightbox.category}
                </span>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-extrabold text-gray-900">{lightbox.label}</h3>
                <span className="text-xs font-bold text-gray-400 ml-3 mt-1">{lightbox.year}</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{lightbox.desc}</p>
            </div>
          </div>
        </div>
      )}



      {/* ── Footer ── */}
      <footer className="footer-dark pt-12 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10">
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative w-9 h-9 bg-white rounded-full p-1">
                  <Image src="/logo.jpg" alt="Tolani" fill className="object-contain" unoptimized />
                </div>
                <div>
                  <div className="text-xs font-extrabold tracking-widest text-white">TOLANI</div>
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
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
              {["Alumni Directory", "Jobs & Internships", "Events", "Gallery", "Contact Us"].map(l => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Resources</h4>
              {["News Corner", "Success Stories", "Mentorship", "Batchmates", "Help & Support"].map(l => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Support</h4>
              {["FAQs", "Privacy Policy", "Terms of Use"].map(l => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>
            <div>
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
        <div className="border-t border-gray-800 py-4 text-center">
          <p className="text-[12px] text-gray-600">© 2026 Tolani Alumni Portal. All Rights Reserved.</p>
        </div>
      </footer>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => document.querySelector(".dashboard-body")?.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg z-50 transition-all"
          style={{ background: "#9B2335" }}
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
