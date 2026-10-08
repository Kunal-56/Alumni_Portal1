"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight, MapPin, Clock, CalendarDays,
  Search, Filter, Send, Facebook, Linkedin,
  Twitter, Instagram, Youtube, Users, ArrowUp, CheckCircle2
} from "lucide-react";
import { Header } from "@/components/Header";
import "@/app/dashboard.css";

const ALL_EVENTS = [
  {
    day: "25", month: "JUN", year: "2026",
    title: "Global Alumni Meet 2026",
    type: "Virtual Event",
    time: "10:00 AM",
    location: "Online",
    desc: "Join alumni from across the world for an inspiring virtual meet. This flagship event brings together thousands of Tolani alumni to reconnect, share experiences and celebrate achievements together.",
    tags: ["Virtual", "Networking"],
    img: "/campus-building.png"
  },
  {
    day: "10", month: "JUL", year: "2026",
    title: "Career Growth Webinar",
    type: "Online Session",
    time: "04:00 PM",
    location: "Online",
    desc: "Learn from industry experts and explore new career opportunities. This session covers resume building, interview tips and the latest job market trends.",
    tags: ["Career", "Online"],
    img: "/campus-building.png"
  },
  {
    day: "18", month: "AUG", year: "2026",
    title: "Code. Connect. Contribute.",
    type: "Department Meetup",
    time: "11:00 AM",
    location: "Tolani Campus",
    desc: "A meetup for developers to collaborate and build together. Showcase your projects, connect with tech alumni and contribute to open source initiatives.",
    tags: ["Tech", "In-Person"],
    img: "/campus-building.png"
  },
  {
    day: "30", month: "AUG", year: "2026",
    title: "Alumni Leadership Talk",
    type: "In-Person Event",
    time: "02:00 PM",
    location: "Tolani Auditorium",
    desc: "An interactive session with accomplished alumni leaders. Gain insights on leadership, entrepreneurship and building a successful career.",
    tags: ["Leadership", "In-Person"],
    img: "/campus-building.png"
  },
  {
    day: "15", month: "SEP", year: "2026",
    title: "Entrepreneurship Summit 2026",
    type: "Summit",
    time: "09:00 AM",
    location: "Tolani Convention Hall",
    desc: "A full-day summit dedicated to entrepreneurship and startup culture. Meet investors, mentors and fellow alumni entrepreneurs.",
    tags: ["Startup", "In-Person"],
    img: "/campus-building.png"
  },
  {
    day: "22", month: "SEP", year: "2026",
    title: "Women in Tech Webinar",
    type: "Online Session",
    time: "05:00 PM",
    location: "Online",
    desc: "A special webinar celebrating and empowering women in technology. Hear from inspiring female alumni working at leading tech companies globally.",
    tags: ["Virtual", "Diversity"],
    img: "/campus-building.png"
  },
  {
    day: "10", month: "OCT", year: "2026",
    title: "Civil Engineering Symposium",
    type: "Department Event",
    time: "10:30 AM",
    location: "Tolani Campus",
    desc: "Explore the latest trends in infrastructure, smart cities and sustainable construction. A must-attend for Civil Department alumni.",
    tags: ["Civil", "In-Person"],
    img: "/campus-building.png"
  },
  {
    day: "28", month: "OCT", year: "2026",
    title: "Tolani Homecoming 2026",
    type: "Annual Event",
    time: "11:00 AM",
    location: "Tolani Campus",
    desc: "The most awaited alumni event of the year. Relive campus memories, meet old friends and celebrate your Tolani journey together.",
    tags: ["Annual", "In-Person"],
    img: "/campus-building.png"
  },
  {
    day: "05", month: "NOV", year: "2026",
    title: "Mechanical Innovation Challenge",
    type: "Competition",
    time: "09:00 AM",
    location: "Tolani Labs",
    desc: "A hands-on competition for Mechanical Department alumni to showcase engineering innovation and creative problem-solving skills.",
    tags: ["Mechanical", "In-Person"],
    img: "/campus-building.png"
  },
  {
    day: "20", month: "NOV", year: "2026",
    title: "Annual CDDM Fashion Show",
    type: "Cultural Event",
    time: "06:00 PM",
    location: "Tolani Auditorium",
    desc: "A grand fashion showcase by CDDM alumni and students, presenting original designs inspired by cultural heritage and modern trends.",
    tags: ["CDDM", "Cultural"],
    img: "/campus-building.png"
  },
  {
    day: "08", month: "DEC", year: "2026",
    title: "Alumni Donation Drive",
    type: "CSR Event",
    time: "10:00 AM",
    location: "Online",
    desc: "Give back to your alma mater. Contribute to scholarships, lab upgrades and student welfare programs to support the next generation.",
    tags: ["CSR", "Virtual"],
    img: "/campus-building.png"
  },
  {
    day: "20", month: "DEC", year: "2026",
    title: "New Year Networking Bash",
    type: "Social Event",
    time: "07:00 PM",
    location: "Tolani Banquet Hall",
    desc: "End the year with an exciting networking event. Meet alumni from all departments, celebrate 2026 achievements and welcome 2027 together.",
    tags: ["Networking", "Social"],
    img: "/campus-building.png"
  },
];

const TYPES = ["All", "Virtual Event", "Online Session", "Department Meetup", "In-Person Event", "Summit", "Annual Event", "Competition", "Cultural Event", "CSR Event", "Social Event"];

export default function EventsPage() {
  const [search, setSearch] = useState("");
  const [activeType, setActiveType] = useState("All");
  const [showTop, setShowTop] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  useEffect(() => {
    setRegisteredEvents(JSON.parse(localStorage.getItem('registeredEvents') || '[]'));
  }, []);

  const filtered = ALL_EVENTS.filter(ev => {
    const matchSearch = ev.title.toLowerCase().includes(search.toLowerCase()) ||
      ev.location.toLowerCase().includes(search.toLowerCase()) ||
      ev.desc.toLowerCase().includes(search.toLowerCase());
    const matchType = activeType === "All" || ev.type === activeType;
    return matchSearch && matchType;
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
            <span className="text-gray-900">Events</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            Upcoming Events
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium max-w-xl">
            Stay connected and inspired. Explore all upcoming alumni events, webinars, meetups and more.
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
              placeholder="Search events by name, location..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white focus:outline-none focus:border-[#9B2335] transition-colors shadow-xs"
            />
          </div>
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 bg-white text-xs font-bold text-gray-500 shadow-xs">
            <Filter size={14} />
            <span className="hidden sm:inline">Filter</span>
          </div>
        </div>

        {/* Type Filter Pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TYPES.map(type => (
            <button
              key={type}
              onClick={() => setActiveType(type)}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={activeType === type
                ? { background: "#9B2335", color: "white", borderColor: "#9B2335" }
                : { background: "white", color: "#555", borderColor: "#e5e7eb" }
              }
            >
              {type}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">All Events</h2>
            <div className="section-underline" style={{ margin: "5px 0 0", marginLeft: "0" }} />
          </div>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {/* Events Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <CalendarDays size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-semibold text-sm">No events found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ev, i) => (
              <div key={i} className="event-card group bg-white flex flex-col">
                {/* Image */}
                <div className="relative h-44 bg-gray-100">
                  <Image src={ev.img} alt={ev.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                  {/* Date Badge */}
                  <div className="absolute top-3 left-3 rounded-xl px-2.5 py-2 text-center shadow-lg" style={{ background: "#9B2335", minWidth: "48px" }}>
                    <div className="text-xl font-extrabold text-white leading-tight">{ev.day}</div>
                    <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{ev.month}</div>
                  </div>
                  {/* Type Badge */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/90 backdrop-blur-sm shadow" style={{ color: "#9B2335" }}>
                    {ev.type}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-sm font-extrabold text-gray-900 mb-2 group-hover:text-[#9B2335] transition-colors leading-snug">
                    {ev.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 font-medium mb-3">
                    <span className="flex items-center gap-1"><Clock size={11} /> {ev.time}</span>
                    <span className="flex items-center gap-1"><MapPin size={11} /> {ev.location}</span>
                  </div>
                  <p className="text-[12px] text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">{ev.desc}</p>

                  {/* Tags */}
                  <div className="flex gap-1.5 flex-wrap mb-4">
                    {ev.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#9B2335] border border-red-100">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {registeredEvents.includes(ev.title) ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-4 py-2.5 rounded-xl border border-green-200 mt-auto justify-center">
                      <CheckCircle2 size={13} /> Registered
                    </span>
                  ) : (
                    <a
                      href={`/events/register?event=${encodeURIComponent(ev.title)}`}
                      className="inline-flex items-center justify-center gap-1.5 text-xs font-bold border border-[#9B2335] text-[#9B2335] rounded-xl px-4 py-2.5 transition-all hover:bg-[#9B2335] hover:text-white hover:border-[#9B2335] mt-auto"
                    >
                      Register Now <ChevronRight size={13} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>



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
