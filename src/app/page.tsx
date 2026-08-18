"use client";

import { Header } from "@/components/Header";
import "./dashboard.css";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users, Building2, Briefcase, CalendarDays, Trophy,
  ChevronRight, ChevronLeft, MapPin, Clock, Globe,
  Code2, Cpu, Settings, Layers, Facebook, Linkedin,
  Twitter, Instagram, Youtube, Send, ArrowUp, BookOpen,
  UserPlus, Zap
} from "lucide-react";

/* ─── Types ─── */
interface Event {
  day: string;
  month: string;
  title: string;
  type: string;
  time: string;
  location: string;
  desc: string;
}

interface GalleryItem {
  label: string;
  bg: string;
  tall?: boolean;
}

interface NewsItem {
  title: string;
  date: string;
  img: string;
}

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
}

interface Department {
  icon: React.ReactNode;
  name: string;
  alumni: string;
}

/* ─── Data ─── */
const STATS: Stat[] = [
  { icon: <Users size={22} />, value: "25,000+", label: "Total Alumni" },
  { icon: <Building2 size={22} />, value: "120+", label: "Countries" },
  { icon: <Briefcase size={22} />, value: "1,250+", label: "Jobs Posted" },
  { icon: <CalendarDays size={22} />, value: "200+", label: "Events Organized" },
  { icon: <Trophy size={22} />, value: "100+", label: "Awards Won" },
];

const DEPARTMENTS: Department[] = [
  { icon: <Code2 size={28} />, name: "Computer Department", alumni: "5,248+ Alumni" },
  { icon: <Layers size={28} />, name: "Civil Department", alumni: "3,126+ Alumni" },
  { icon: <Zap size={28} />, name: "Electrical Department", alumni: "2,860+ Alumni" },
  { icon: <Settings size={28} />, name: "Mechanical Department", alumni: "4,112+ Alumni" },
  { icon: <BookOpen size={28} />, name: "CDDM Department", alumni: "2,340+ Alumni" },
];

const EVENTS: Event[] = [
  { day: "25", month: "JUN", title: "Global Alumni Meet 2026", type: "Virtual Event", time: "10:00 AM", location: "Online", desc: "Join alumni from across the world for an inspiring virtual meet." },
  { day: "10", month: "JUL", title: "Career Growth Webinar", type: "Online Session", time: "04:00 PM", location: "Online", desc: "Learn from industry experts and explore new career opportunities." },
  { day: "18", month: "AUG", title: "Code. Connect. Contribute.", type: "Department Meetup", time: "11:00 AM", location: "Tolani Campus", desc: "A meetup for developers to collaborate and build together." },
  { day: "30", month: "AUG", title: "Alumni Leadership Talk", type: "In-Person Event", time: "02:00 PM", location: "Tolani Auditorium", desc: "An interactive session with accomplished alumni leaders." },
];

const GALLERY: GalleryItem[] = [
  { label: "Alumni Meet 2026", bg: "#2a1a1f" },
  { label: "Virtual Alumni Reunion", bg: "#1a2030" },
  { label: "Networking Session", bg: "#1e2820" },
  { label: "Campus Visit", bg: "#203020" },
  { label: "Guest Lecture", bg: "#1c1c2e" },
  { label: "Cultural Night", bg: "#2e1c1c" },
];

const NEWS: NewsItem[] = [
  { title: "Tolani Alumni Association – Dar es Salaam, Tanzania Alumni Reunion 2026–27", date: "Aug 05, 2026", img: "/campus-building.png" },
  { title: "Building a Stronger Alumni Community: Northeast Chapters Virtual Reunion", date: "Aug 03, 2026", img: "/campus-building.png" },
  { title: "Strengthening Connections: Virtual Alumni Reunion for Jharkhand, Chhattisgarh, Odisha & Madhya Pradesh", date: "Jul 31, 2026", img: "/campus-building.png" },
];

const HERO_SLIDES = [
  { title: "Tolani Alumni Portal", subtitle: "Stay Connected. Stay Inspired.", desc: "A vibrant community of achievers, innovators and leaders from Tolani." },
  { title: "Grow Your Network", subtitle: "Connect with 25,000+ Alumni.", desc: "Build meaningful relationships with alumni across the globe." },
  { title: "Explore Opportunities", subtitle: "Careers. Events. Mentorship.", desc: "Discover jobs, events and mentorship programs tailored for you." },
  { title: "Celebrate Achievements", subtitle: "Proud. Together. Always.", desc: "Recognize and celebrate the milestones of our alumni community." },
];

export default function DashboardPage() {
  const [heroIdx, setHeroIdx] = useState(0);
  const [deptIdx, setDeptIdx] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("tolani_logged_in");
      setLoggedIn(stored === "true");
    }
  }, []);

  // Auto-advance hero
  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length), 4500);
    return () => clearInterval(t);
  }, []);

  // Show back-to-top after scroll
  useEffect(() => {
    const el = document.querySelector(".dashboard-body");
    const onScroll = () => setShowTop((el?.scrollTop ?? 0) > 400);
    el?.addEventListener("scroll", onScroll);
    return () => el?.removeEventListener("scroll", onScroll);
  }, []);

  const slide = HERO_SLIDES[heroIdx];
  const visibleDepts = DEPARTMENTS.slice(deptIdx, deptIdx + 5);

  return (
    <div className="dashboard-body min-h-screen" style={{ overflowY: "auto", overflowX: "hidden" }}>

      {/* ── Navbar ── */}
      <Header activePage="home" />

      {/* ── Hero Slider ── */}
      <section className="relative h-[340px] sm:h-[400px] overflow-hidden">
        {/* BG Image */}
        <div className="absolute inset-0">
          <Image src="/campus-building.png" alt="Tolani Campus" fill className="object-cover" unoptimized priority />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(0,0,0,0.72) 42%, rgba(0,0,0,0.28) 100%)" }} />
        </div>

        {/* Prev / Next */}
        <button
          onClick={() => setHeroIdx(i => (i - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-all"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onClick={() => setHeroIdx(i => (i + 1) % HERO_SLIDES.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/35 flex items-center justify-center text-white transition-all"
        >
          <ChevronRight size={20} />
        </button>

        {/* Hero Content */}
        <div className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-16 max-w-3xl animate-slideup" key={heroIdx}>
          <p className="text-white/70 text-sm font-medium mb-1">Welcome to</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight mb-2">{slide.title}</h1>
          <p className="text-white/90 text-lg font-semibold mb-2">{slide.subtitle}</p>
          <p className="text-white/65 text-sm max-w-md mb-6">{slide.desc}</p>
          <Link href="/login" className="btn-maroon inline-flex items-center gap-2 px-6 py-3 text-sm w-fit">
            Explore Alumni <ChevronRight size={16} />
          </Link>
        </div>

        {/* Dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_SLIDES.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} className={`hero-dot${i === heroIdx ? " active" : ""}`} />
          ))}
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="stats-bar px-6 py-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {STATS.map((s, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
                {s.icon}
              </div>
              <div>
                <div className="text-lg font-extrabold text-gray-900 leading-tight">{s.value}</div>
                <div className="text-[11px] text-gray-500 font-medium">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Departments ── */}
      <section id="departments" className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900 text-center w-full">Our Departments</h2>
            <div className="section-underline mx-auto" />
          </div>
          <a href="#" className="text-sm font-bold flex items-center gap-1" style={{ color: "#9B2335" }}>
            View All Departments <ChevronRight size={15} />
          </a>
        </div>

        <div className="relative mt-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {DEPARTMENTS.map((d, i) => (
              <div key={i} className={`dept-card p-5 text-center${i === 0 ? " active" : ""}`}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: "#fef0f2", color: "#9B2335" }}>
                  {d.icon}
                </div>
                <div className="text-sm font-bold text-gray-900 mb-1">{d.name}</div>
                <div className="text-xs text-gray-500 font-medium mb-3">{d.alumni}</div>
                <a href="#" className="text-xs font-bold flex items-center justify-center gap-1" style={{ color: "#9B2335" }}>
                  Explore <ChevronRight size={13} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming Events ── */}
      <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Upcoming Events</h2>
            <div className="section-underline" style={{ margin: "6px 0 0" }} />
          </div>
          <a href="#" className="text-sm font-bold flex items-center gap-1" style={{ color: "#9B2335" }}>
            View All Events <ChevronRight size={15} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {EVENTS.map((ev, i) => (
            <div key={i} className="event-card">
              {/* Date Badge + Image */}
              <div className="relative h-36 bg-gray-100">
                <Image src="/campus-building.png" alt={ev.title} fill className="object-cover" unoptimized />
                <div className="absolute top-3 left-3 rounded-lg px-2.5 py-1.5 text-center" style={{ background: "#9B2335", minWidth: "44px" }}>
                  <div className="text-xl font-extrabold text-white leading-tight">{ev.day}</div>
                  <div className="text-[10px] font-bold text-white/80">{ev.month}</div>
                </div>
              </div>
              <div className="p-4">
                <div className="text-xs font-bold mb-1" style={{ color: "#9B2335" }}>{ev.type}</div>
                <h3 className="text-sm font-extrabold text-gray-900 mb-2">{ev.title}</h3>
                <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-1">
                  <Clock size={11} /> {ev.time}
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-500 mb-3">
                  <MapPin size={11} /> {ev.location}
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed mb-4">{ev.desc}</p>
                <a href="#" className="inline-flex items-center gap-1 text-xs font-bold border rounded-lg px-3 py-1.5 transition-all hover:bg-[#9B2335] hover:text-white hover:border-[#9B2335]" style={{ borderColor: "#9B2335", color: "#9B2335" }}>
                  Register Now <ChevronRight size={13} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Gallery Highlights ── */}
      <section id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Gallery Highlights</h2>
            <div className="section-underline" style={{ margin: "6px 0 0" }} />
          </div>
          <a href="#" className="text-sm font-bold flex items-center gap-1" style={{ color: "#9B2335" }}>
            View All Gallery <ChevronRight size={15} />
          </a>
        </div>

        <div className="grid grid-cols-3 gap-3" style={{ gridTemplateRows: "auto auto" }}>
          {GALLERY.map((g, i) => (
            <div key={i} className="gallery-card" style={{ height: "180px", background: g.bg }}>
              <Image src="/campus-building.png" alt={g.label} fill className="object-cover opacity-70" unoptimized />
              <div className="gallery-overlay">
                <p className="text-white text-sm font-bold">{g.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── News & Updates ── */}
      <section id="news" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-14">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">News &amp; Updates</h2>
            <div className="section-underline" style={{ margin: "6px 0 0" }} />
          </div>
          <a href="#" className="text-sm font-bold flex items-center gap-1" style={{ color: "#9B2335" }}>
            View All News <ChevronRight size={15} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {NEWS.map((n, i) => (
            <div key={i} className="flex gap-3 pb-4 border-b border-gray-100">
              <div className="relative w-20 h-16 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                <Image src={n.img} alt={n.title} fill className="object-cover" unoptimized />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 leading-snug mb-1 line-clamp-3">{n.title}</p>
                <p className="text-[11px] text-gray-400 font-medium">{n.date}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-14">
        <div className="cta-banner flex items-center justify-between px-8 py-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: "#9B2335" }}>
              <Users size={26} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-extrabold" style={{ color: "#9B2335" }}>Be a Part of Our Global Alumni Community</p>
              <p className="text-sm text-gray-500 font-medium">Reconnect. Collaborate. Grow Together.</p>
            </div>
          </div>
          <Link href="/login" className="btn-maroon flex items-center gap-2 px-5 py-3 text-sm shrink-0">
            <UserPlus size={16} />
            Invite Alumni
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer-dark pt-12 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-10">

            {/* Brand */}
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

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
              {["Alumni Directory", "Jobs & Internships", "Events", "Gallery", "Contact Us"].map(l => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Resources</h4>
              {["News Corner", "Success Stories", "Mentorship", "Batchmates", "Help & Support"].map(l => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Support</h4>
              {["FAQs", "Privacy Policy", "Terms of Use"].map(l => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>

            {/* Newsletter */}
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

        {/* Copyright */}
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
