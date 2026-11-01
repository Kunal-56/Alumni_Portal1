"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users, Briefcase, CalendarDays, Trophy,
  ChevronRight, MapPin, Clock,
  BookOpen, UserPlus, Heart, GraduationCap, FolderOpen,
  Tv, Sparkles, Building, Award,
  Lightbulb, Send, Facebook, Linkedin, Twitter,
  Instagram, Youtube, CheckCircle2, Database, RefreshCw
} from "lucide-react";
import { Header } from "@/components/Header";
import { useAlumniMembers } from "@/lib/alumniStore";
import { AddAlumniModal } from "@/components/AddAlumniModal";
import "@/app/dashboard.css";

/* ─── Data ─── */
const DEPT_STATS = [
  { icon: <Users size={20} />, value: "1,200+", label: "Alumni" },
  { icon: <Briefcase size={20} />, value: "250+", label: "Jobs Posted" },
  { icon: <CalendarDays size={20} />, value: "30+", label: "Events Organized" },
];

const FEATURES = [
  {
    icon: <Users size={22} />,
    title: "Alumni Directory",
    desc: "Find and connect with fellow civil alumni worldwide."
  },
  {
    icon: <GraduationCap size={22} />,
    title: "Mentorship Program",
    desc: "Get guidance from experienced civil engineers and industry experts."
  },
  {
    icon: <Briefcase size={22} />,
    title: "Jobs & Internships",
    desc: "Exclusive job and internship opportunities for civil alumni."
  },
  {
    icon: <FolderOpen size={22} />,
    title: "Resources Hub",
    desc: "Access notes, AutoCAD resources and helpful materials."
  },
  {
    icon: <Tv size={22} />,
    title: "Tech Talks",
    desc: "Join expert sessions, webinars and infrastructure discussions."
  },
  {
    icon: <Heart size={22} />,
    title: "Give Back",
    desc: "Support students, projects and the next generation."
  },
];

const EVENTS = [
  {
    day: "12",
    month: "JUL",
    title: "Civil Alumni Global Meet 2026",
    time: "10:00 AM",
    location: "Online",
    desc: "Join civil alumni from across the world for an inspiring virtual meet.",
    img: "/campus-building.png"
  },
  {
    day: "20",
    month: "JUL",
    title: "Infrastructure Development Webinar",
    time: "04:00 PM",
    location: "Online",
    desc: "Learn from industry experts about modern construction and infrastructure trends.",
    img: "/campus-building.png"
  },
  {
    day: "05",
    month: "SEP",
    title: "Civil Engineers Meetup",
    time: "11:00 AM",
    location: "Tolani Campus",
    desc: "A meetup for civil engineers to collaborate and build together.",
    img: "/campus-building.png"
  },
  {
    day: "22",
    month: "SEP",
    title: "Alumni Leadership Talk",
    time: "02:00 PM",
    location: "Tolani Auditorium",
    desc: "An interactive session with accomplished civil engineering alumni leaders.",
    img: "/campus-building.png"
  },
];

const BY_THE_NUMBERS = [
  { label: "Established", value: "1984", icon: <Building size={16} /> },
  { label: "Programs Offered", value: "Diploma, B.Tech", icon: <BookOpen size={16} /> },
  { label: "Faculty Strength", value: "10+", icon: <Users size={16} /> },
  { label: "Labs", value: "8+ Structural Labs", icon: <Award size={16} /> },
  { label: "Research Projects", value: "8+", icon: <Lightbulb size={16} /> },
  { label: "Student Strength", value: "400+", icon: <GraduationCap size={16} /> },
];

const INITIATIVES = [
  {
    icon: <GraduationCap size={22} />,
    title: "Student Mentorship",
    desc: "One-on-one guidance for civil engineering students."
  },
  {
    icon: <Lightbulb size={22} />,
    title: "Green Building Challenges",
    desc: "Encouraging sustainable and eco-friendly construction."
  },
  {
    icon: <Building size={22} />,
    title: "Industry Collaborations",
    desc: "Building bridges with construction industry leaders."
  },
  {
    icon: <Trophy size={22} />,
    title: "Scholarships",
    desc: "Supporting bright future civil engineers."
  },
  {
    icon: <Heart size={22} />,
    title: "Community Outreach",
    desc: "Giving back to the society through infrastructure projects."
  },
];

const GALLERY = [
  { label: "Structural Design Lab", bg: "#1e293b" },
  { label: "Annual Civil Symposium", bg: "#9B2335" },
  { label: "Site Visit 2026", bg: "#0f766e" },
  { label: "Alumni Guest Lecture", bg: "#3b0764" },
  { label: "Department Graduation", bg: "#451a03" },
];

export default function CivilDepartmentPage() {
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const [dbData, setDbData] = useState<any>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [loadingDb, setLoadingDb] = useState(true);

  const fetchDepartmentData = async () => {
    try {
      setLoadingDb(true);
      const res = await fetch("/api/departments/civil");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.department) {
          setDbData(json.department);
        }
      }
    } catch (err) {
      console.error("Failed to fetch civil department API data", err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    setRegisteredEvents(JSON.parse(localStorage.getItem('registeredEvents') || '[]'));
    fetchDepartmentData();
  }, []);

  const { members, isLoaded } = useAlumniMembers();

  // Dynamic live spotlight members from database (max 6)
  const deptMembers = members.filter(m => {
    const d = (m.dept || "").toLowerCase();
    return d.includes("civil") || d.includes("infra") || d.includes("const");
  });
  const otherMembers = members.filter(m => !deptMembers.some(dm => dm.id === m.id));
  const spotlightMembers = [...deptMembers, ...otherMembers].slice(0, 6);

  const liveAlumniCount = dbData?.alumni_count ? `${dbData.alumni_count.toLocaleString()}+` : "1,200+";

  return (
    <div className="dashboard-body min-h-screen" style={{ overflowY: "auto", overflowX: "hidden", background: "#fcfafb" }}>

      {/* ── Header ── */}
      <Header activePage="departments" />

      {/* ── Department Hero Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Text & Actions */}
          <div className="lg:col-span-7 space-y-5">
            {/* Department Tag & DB Live Status */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase" style={{ background: "#fef0f2", color: "#9B2335", border: "1px solid #f8d7db" }}>
                CIVIL DEPARTMENT
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-gray-900 tracking-tight leading-[1.12]">
              Build Today For<br />
              Tomorrow's <span style={{ color: "#9B2335" }}>Future</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 font-medium max-w-xl leading-relaxed">
              Uniting builders, designers and visionaries. The Civil Department alumni community empowers infrastructure leaders and builds a stronger tomorrow.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/invite?dept=Civil+Engineering" className="btn-maroon inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold shadow-md">
                Register Form <Users size={16} />
              </Link>
              <Link
                href="/members"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl border bg-white transition-all hover:bg-gray-50"
                style={{ borderColor: "#9B2335", color: "#9B2335" }}
              >
                View Members <ChevronRight size={16} />
              </Link>
            </div>

            {/* Stats Metric Bar */}
            <div className="pt-6 border-t border-gray-200/60 flex flex-wrap gap-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
                  <Users size={20} />
                </div>
                <div>
                  <div className="text-base font-extrabold text-gray-900 leading-tight">{liveAlumniCount}</div>
                  <div className="text-[10px] text-gray-500 font-semibold">Alumni Members</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <div className="text-base font-extrabold text-gray-900 leading-tight">250+</div>
                  <div className="text-[10px] text-gray-500 font-semibold">Jobs Posted</div>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
                  <CalendarDays size={20} />
                </div>
                <div>
                  <div className="text-base font-extrabold text-gray-900 leading-tight">30+</div>
                  <div className="text-[10px] text-gray-500 font-semibold">Events Organized</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            {/* Top Right Decorative Dots */}
            <div className="absolute -top-4 -right-4 w-20 h-20 text-[#9B2335] opacity-20 pointer-events-none grid grid-cols-4 gap-1.5 z-0">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-current" />
              ))}
            </div>

            {/* Main Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-900 group">
              <div className="relative h-[320px] sm:h-[380px] w-full">
                <Image
                  src="/campus-building.png"
                  alt="Civil Engineering"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                  unoptimized
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              </div>

              {/* Floating Overlay Badge */}
              <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-gray-100 max-w-[240px]">
                <div className="text-xs font-extrabold text-gray-900 mb-0.5">Stay Connected</div>
                <div className="text-[11px] text-gray-500 font-medium mb-2.5">One network. Infinite possibilities.</div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    {["#9B2335", "#2563eb", "#059669", "#7c3aed", "#d97706"].map((bg, idx) => (
                      <div key={idx} className="inline-block h-6 w-6 rounded-full ring-2 ring-white text-[9px] font-bold text-white flex items-center justify-center" style={{ background: bg }}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-50 text-[#9B2335] border border-red-100">
                    +1.5K
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Section: What's in it for You? ── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            What&apos;s in it for You?
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Everything you need to grow, give back and stay inspired.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 sm:gap-5">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all duration-200 hover:-translate-y-1 flex flex-col justify-between group cursor-pointer"
            >
              <div>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110" style={{ background: "#fdf2f4", color: "#9B2335" }}>
                  {f.icon}
                </div>
                <h3 className="text-sm font-extrabold text-gray-900 mb-1.5 group-hover:text-[#9B2335] transition-colors">{f.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed font-medium mb-4">{f.desc}</p>
              </div>
              <div className="flex justify-end">
                <ChevronRight size={15} className="text-gray-300 group-hover:text-[#9B2335] group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: Department Impact Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl" style={{ background: "linear-gradient(135deg, #7c1928 0%, #9B2335 50%, #5e111d 100%)" }}>

          <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none">
            <svg width="400" height="300" viewBox="0 0 400 300" fill="none">
              <circle cx="200" cy="150" r="140" stroke="white" strokeWidth="2" strokeDasharray="6 6" />
              <circle cx="200" cy="150" r="100" stroke="white" strokeWidth="1" />
              <circle cx="200" cy="150" r="60" stroke="white" strokeWidth="2" />
            </svg>
          </div>

          <div className="relative z-10">
            <div className="mb-8">
              <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-white/15 text-white mb-2">
                Department Impact
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                Empowering builders and creating lasting infrastructure.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">

              <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-white">
                    <GraduationCap size={16} />
                  </div>
                  <span className="text-xs font-bold leading-snug">Strong Technical Foundation</span>
                </div>

                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-white">
                    <Building size={16} />
                  </div>
                  <span className="text-xs font-bold leading-snug">Industry Oriented Curriculum</span>
                </div>

                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-white">
                    <Tv size={16} />
                  </div>
                  <span className="text-xs font-bold leading-snug">Modern Labs &amp; Infrastructure</span>
                </div>

                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-white">
                    <Lightbulb size={16} />
                  </div>
                  <span className="text-xs font-bold leading-snug">Innovation &amp; Research Driven</span>
                </div>
              </div>

              <div className="md:col-span-3 flex md:flex-col justify-around gap-4 border-y md:border-y-0 md:border-x border-white/20 py-4 md:py-0 md:px-6">
                <div>
                  <div className="text-3xl font-extrabold text-white">10+</div>
                  <div className="text-xs text-white/80 font-medium">Expert Faculty</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">8+</div>
                  <div className="text-xs text-white/80 font-medium">Structural Labs</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">400+</div>
                  <div className="text-xs text-white/80 font-medium">Students Strength</div>
                </div>
              </div>

              <div className="md:col-span-4 flex justify-center">
                <div className="w-full max-w-[220px] bg-white/10 rounded-2xl p-4 border border-white/15 shadow-inner text-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-2">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div className="text-sm font-extrabold text-white mb-1">State-of-the-Art Labs</div>
                  <div className="text-[11px] text-white/70">Surveying, AutoCAD &amp; Structural Analysis Workstations.</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ── Section: Upcoming Events & By the Numbers ── */}
      <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900">Upcoming Events</h2>
              <Link href="/events" className="text-xs font-bold flex items-center gap-1 hover:underline" style={{ color: "#9B2335" }}>
                View All Events <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-4">
              {EVENTS.map((ev, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group"
                >
                  <div className="flex items-start sm:items-center gap-4 flex-1">
                    <div className="rounded-xl px-3 py-2 text-center shrink-0" style={{ background: "#9B2335", minWidth: "50px" }}>
                      <div className="text-xl font-extrabold text-white leading-tight">{ev.day}</div>
                      <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{ev.month}</div>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 group-hover:text-[#9B2335] transition-colors">{ev.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 font-medium my-1">
                        <span className="flex items-center gap-1"><Clock size={11} /> {ev.time}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} /> {ev.location}</span>
                      </div>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{ev.desc}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-gray-100">
                    {registeredEvents.includes(ev.title) ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl text-green-700 bg-green-50 border border-green-200">
                        <CheckCircle2 size={12} /> Registered
                      </span>
                    ) : (
                      <a
                        href={`/events/register?event=${encodeURIComponent(ev.title)}`}
                        className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl border border-[#9B2335] text-[#9B2335] transition-all hover:bg-[#9B2335] hover:text-white hover:border-[#9B2335]"
                      >
                        Register Now <ChevronRight size={12} />
                      </a>
                    )}
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100 hidden sm:block">
                      <Image src={ev.img} alt={ev.title} fill className="object-cover" unoptimized />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">

            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-xs">
              <h3 className="text-base font-extrabold text-gray-900 mb-4 pb-3 border-b border-gray-100">
                By the Numbers
              </h3>

              <div className="space-y-3.5">
                {BY_THE_NUMBERS.map((n, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5 text-gray-600 font-medium">
                      <span style={{ color: "#9B2335" }}>{n.icon}</span>
                      <span>{n.label}</span>
                    </div>
                    <span className="font-extrabold text-gray-900">{n.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl p-6 text-white relative overflow-hidden shadow-lg" style={{ background: "linear-gradient(135deg, #9B2335 0%, #701422 100%)" }}>
              <h4 className="text-base font-extrabold mb-1">Expand Your Network</h4>
              <p className="text-xs text-white/80 leading-relaxed font-medium mb-4">
                Connect, collaborate and create meaningful impact together.
              </p>
              <Link href="/invite?dept=Civil+Engineering" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#9B2335] text-xs font-extrabold shadow-sm hover:bg-gray-100 transition-all">
                Join Alumni Network <ChevronRight size={14} />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ── Section: Alumni Members Spotlight ── */}
      <section id="spotlight" suppressHydrationWarning className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Alumni Members Spotlight</h2>
            <p className="text-xs text-gray-500 font-medium">Accomplished leaders and infrastructure pioneers from Civil Department.</p>
          </div>

          <Link
            href="/members"
            className="text-xs font-bold flex items-center gap-1 hover:underline"
            style={{ color: "#9B2335" }}
          >
            View All Alumni Members <ChevronRight size={14} />
          </Link>
        </div>

        {!isLoaded ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs text-center flex flex-col items-center animate-pulse"
              >
                <div className="w-20 h-20 rounded-full bg-gray-100 mb-3" />
                <div className="h-4 w-28 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-20 bg-gray-100 rounded mb-1" />
                <div className="h-3 w-16 bg-gray-100 rounded mb-3" />
                <div className="h-5 w-20 bg-gray-100 rounded-full" />
              </div>
            ))}
          </div>
        ) : spotlightMembers.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 border border-gray-100 text-center max-w-md mx-auto">
            <Users className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-sm font-bold text-gray-700">No Alumni Registered Yet</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Be the first to join the alumni directory for this department.</p>
            <Link
              href="/invite?dept=Civil%20Engineering"
              className="btn-maroon text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 font-bold"
            >
              Register as Alumnus
            </Link>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 ${
            spotlightMembers.length <= 3 ? "lg:grid-cols-3" :
            spotlightMembers.length === 4 ? "lg:grid-cols-4" :
            spotlightMembers.length === 5 ? "lg:grid-cols-5" :
            "lg:grid-cols-6"
          } gap-5`}>
            {spotlightMembers.map((alumni: any, i: number) => {
              const initials = alumni.name
                ? alumni.name
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((w: string) => w[0].toUpperCase())
                    .join("")
                : "AL";
              const palette = ["#1e293b", "#9B2335", "#0f766e", "#6b21a8", "#b45309", "#0369a1"];
              const bg = palette[i % palette.length];
              const batch = alumni.batch || (alumni.year ? `Batch ${alumni.year}` : (alumni.graduation_year ? `Batch ${alumni.graduation_year}` : "Batch 2025"));
              const company = alumni.company || "Tolani Alumni";
              const role = alumni.role || "Alumnus";

              return (
                <div
                  key={alumni.id || i}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center group cursor-pointer"
                >
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-extrabold mb-3 shadow-md group-hover:scale-105 transition-transform"
                    style={{ background: bg }}
                  >
                    {initials}
                  </div>

                  <h3 className="text-sm font-extrabold text-gray-900 mb-0.5 group-hover:text-[#9B2335] transition-colors line-clamp-1">
                    {alumni.name}
                  </h3>
                  <p className="text-[11px] text-gray-500 font-medium mb-1 line-clamp-1">
                    {role}
                  </p>
                  <div
                    className="text-[11px] font-extrabold mb-3 line-clamp-1"
                    style={{ color: "#9B2335" }}
                  >
                    {company}
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-[#9B2335] border border-red-100 mt-auto">
                    {batch}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Section: Our Initiatives ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-gray-900">Our Initiatives</h2>
            <p className="text-xs text-gray-500 font-medium">Empowering the next generation of civil engineers.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {INITIATIVES.map((init, i) => (
              <div key={i} className="flex flex-col items-center text-center p-3 rounded-2xl hover:bg-red-50/50 transition-colors">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3" style={{ background: "#fdf2f4", color: "#9B2335" }}>
                  {init.icon}
                </div>
                <h3 className="text-sm font-extrabold text-gray-900 mb-1">{init.title}</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed">{init.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section: Gallery Highlights ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Gallery Highlights</h2>
            <p className="text-xs text-gray-500 font-medium">Moments and memories from Civil Department activities.</p>
          </div>
          <Link href="/gallery" className="text-xs font-bold flex items-center gap-1 hover:underline" style={{ color: "#9B2335" }}>
            View Full Gallery <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {GALLERY.map((g, i) => (
            <div key={i} className="relative h-44 rounded-2xl overflow-hidden group cursor-pointer" style={{ background: g.bg }}>
              <Image src="/campus-building.png" alt={g.label} fill className="object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-all duration-300" unoptimized />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                <span className="text-white text-xs font-bold">{g.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="cta-banner flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: "#9B2335" }}>
              <Users size={26} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-extrabold" style={{ color: "#9B2335" }}>Be a Part of Our Civil Department Community</p>
              <p className="text-sm text-gray-500 font-medium">Reconnect. Collaborate. Grow Together.</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-maroon flex items-center gap-2 px-5 py-3 text-sm shrink-0 font-bold cursor-pointer"
          >
            <UserPlus size={16} />
            Invite Alumni
          </button>
        </div>
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

    </div>
  );
}
