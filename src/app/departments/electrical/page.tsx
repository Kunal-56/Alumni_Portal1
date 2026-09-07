"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users, Briefcase, CalendarDays, Trophy,
  ChevronRight, MapPin, Clock,
  BookOpen, UserPlus, Heart, GraduationCap, FolderOpen,
  Tv, Sparkles, Building, Award,
  Lightbulb, Send, Facebook, Linkedin, Twitter,
  Instagram, Youtube, Zap, Activity
} from "lucide-react";
import { Header } from "@/components/Header";
import "@/app/dashboard.css";

/* ─── Data ─── */
const DEPT_STATS = [
  { icon: <Users size={20} />, value: "2,860+", label: "Alumni" },
  { icon: <Briefcase size={20} />, value: "650+", label: "Jobs Posted" },
  { icon: <CalendarDays size={20} />, value: "55+", label: "Events Organized" },
];

const FEATURES = [
  {
    icon: <Users size={22} />,
    title: "Alumni Directory",
    desc: "Connect with electrical engineers and power grid leads worldwide."
  },
  {
    icon: <GraduationCap size={22} />,
    title: "Mentorship Program",
    desc: "Get guidance from renewable energy, EV, and VLSI experts."
  },
  {
    icon: <Briefcase size={22} />,
    title: "Jobs & Internships",
    desc: "Roles at ABB, Siemens, Schneider Electric, PowerGrid, & Intel."
  },
  {
    icon: <FolderOpen size={22} />,
    title: "VLSI & Circuit Hub",
    desc: "Access MATLAB models, PCB schematics, and microgrid papers."
  },
  {
    icon: <Tv size={22} />,
    title: "Tech Talks & Expos",
    desc: "Join EV summits, high voltage seminars, & smart grid webinars."
  },
  {
    icon: <Heart size={22} />,
    title: "Give Back",
    desc: "Sponsor solar prototype kits, EV motor labs, and student tools."
  },
];

const EVENTS = [
  {
    day: "25",
    month: "JUN",
    title: "EV & Renewable Energy Expo 2026",
    time: "10:00 AM",
    location: "Electrical Tech Center",
    desc: "Showcasing solar microgrids, battery management systems, and electric powertrain prototypes.",
    img: "/campus-building.png"
  },
  {
    day: "10",
    month: "JUL",
    title: "High Voltage & Smart Grid Seminar",
    time: "04:00 PM",
    location: "Online",
    desc: "Learn about grid automation, SCADA systems, and high voltage protection.",
    img: "/campus-building.png"
  },
  {
    day: "18",
    month: "AUG",
    title: "Circuit Master Simulation Challenge",
    time: "11:00 AM",
    location: "VLSI & Circuit Lab",
    desc: "An intensive circuit design competition using MATLAB Simulink and Proteus.",
    img: "/campus-building.png"
  },
  {
    day: "30",
    month: "AUG",
    title: "Power Sector Leadership Summit",
    time: "02:00 PM",
    location: "Tolani Auditorium",
    desc: "Interactive keynote session with accomplished alumni leading energy corporations.",
    img: "/campus-building.png"
  },
];

const BY_THE_NUMBERS = [
  { label: "Established", value: "1995", icon: <Building size={16} /> },
  { label: "Programs Offered", value: "Diploma in Electrical", icon: <BookOpen size={16} /> },
  { label: "Faculty Strength", value: "16+", icon: <Users size={16} /> },
  { label: "Labs", value: "8+ Electrical Labs", icon: <Award size={16} /> },
  { label: "Research Projects", value: "24+", icon: <Lightbulb size={16} /> },
  { label: "Student Strength", value: "340+", icon: <GraduationCap size={16} /> },
];

const SPOTLIGHT = [
  {
    name: "Chirag Desai",
    role: "Power Systems Lead",
    company: "ABB India",
    batch: "Batch 2023",
    bg: "#1e293b",
    initials: "CD"
  },
  {
    name: "Meera Iyer",
    role: "Embedded Systems Manager",
    company: "Siemens Energy",
    batch: "Batch 2024",
    bg: "#9B2335",
    initials: "MI"
  },
  {
    name: "Hardik Shah",
    role: "Energy Analyst",
    company: "Schneider Electric",
    batch: "Batch 2022",
    bg: "#0f766e",
    initials: "HS"
  },
  {
    name: "Shruti Nair",
    role: "VLSI Design Engineer",
    company: "Intel",
    batch: "Batch 2025",
    bg: "#6b21a8",
    initials: "SN"
  },
  {
    name: "Tarun Bhatt",
    role: "Electrical Consultant",
    company: "PowerGrid Corp",
    batch: "Batch 2021",
    bg: "#b45309",
    initials: "TB"
  },
];

const INITIATIVES = [
  {
    icon: <Zap size={22} />,
    title: "Solar Prototype Grant",
    desc: "Funding student renewable energy & inverter projects."
  },
  {
    icon: <Lightbulb size={22} />,
    title: "EV Tech Bootcamp",
    desc: "Hands-on training in motor controllers & battery packs."
  },
  {
    icon: <Building size={22} />,
    title: "Power Substation Visits",
    desc: "Guided tours of 220kV high-voltage substations."
  },
  {
    icon: <Trophy size={22} />,
    title: "Clean Energy Awards",
    desc: "Recognizing innovative microgrid & solar designs."
  },
  {
    icon: <Heart size={22} />,
    title: "Community Outreach",
    desc: "Promoting electrical safety & energy conservation."
  },
];

const GALLERY = [
  { label: "High Voltage Lab Demonstration", bg: "#1e293b" },
  { label: "EV Motor & Battery Prototype Testing", bg: "#9B2335" },
  { label: "Embedded Circuit & Microcontroller Workshop", bg: "#0f766e" },
  { label: "Solar Energy & Microgrid Seminar", bg: "#3b0764" },
  { label: "Department Graduation 2026", bg: "#451a03" },
];

export default function ElectricalDepartmentPage() {
  return (
    <div className="dashboard-body min-h-screen" style={{ overflowY: "auto", overflowX: "hidden", background: "#fcfafb" }}>

      {/* ── Header ── */}
      <Header activePage="departments" />

      {/* ── Department Hero Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* Left Text & Actions */}
          <div className="lg:col-span-7 space-y-5">
            {/* Department Tag */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wider uppercase" style={{ background: "#fef0f2", color: "#9B2335", border: "1px solid #f8d7db" }}>
              ELECTRICAL DEPARTMENT
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-extrabold text-gray-900 tracking-tight leading-[1.12]">
              Electrifying Ideas,<br />
              Powering <span style={{ color: "#9B2335" }}>Progress</span>
            </h1>

            {/* Description */}
            <p className="text-sm sm:text-base text-gray-600 font-medium max-w-xl leading-relaxed">
              Uniting power engineers, renewable energy pioneers and microelectronics specialists. The Electrical Department alumni community energizes sustainable solutions and powers global innovation.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/login" className="btn-maroon inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold shadow-md">
                Connect with Alumni <Users size={16} />
              </Link>
              <a
                href="#events"
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold rounded-xl border bg-white transition-all hover:bg-gray-50"
                style={{ borderColor: "#9B2335", color: "#9B2335" }}
              >
                Explore Opportunities <ChevronRight size={16} />
              </a>
            </div>

            {/* Stats Metric Bar */}
            <div className="pt-6 border-t border-gray-200/60 flex flex-wrap gap-6">
              {DEPT_STATS.map((s, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-base font-extrabold text-gray-900 leading-tight">{s.value}</div>
                    <div className="text-[10px] text-gray-500 font-semibold">{s.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="absolute -top-4 -right-4 w-20 h-20 text-[#9B2335] opacity-20 pointer-events-none grid grid-cols-4 gap-1.5 z-0">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full bg-current" />
              ))}
            </div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-gray-900 group">
              <div className="relative h-[320px] sm:h-[380px] w-full">
                <Image
                  src="/campus-building.png"
                  alt="Electrical Engineering Lab & Power Grid"
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
                <div className="text-[11px] text-gray-500 font-medium mb-2.5">2,860+ Electrical &amp; Energy Engineers.</div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2 overflow-hidden">
                    {["#9B2335", "#2563eb", "#059669", "#7c3aed", "#d97706"].map((bg, idx) => (
                      <div key={idx} className="inline-block h-6 w-6 rounded-full ring-2 ring-white text-[9px] font-bold text-white flex items-center justify-center" style={{ background: bg }}>
                        {String.fromCharCode(69 + idx)}
                      </div>
                    ))}
                  </div>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-50 text-[#9B2335] border border-red-100">
                    +2.8K
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
            What's in it for You?
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            Tools, guidance and network designed for electrical, EV &amp; energy engineers.
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
                Powering clean energy systems and smart electrical grids.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-white">
                    <GraduationCap size={16} />
                  </div>
                  <span className="text-xs font-bold leading-snug">Strong Circuits Foundation</span>
                </div>

                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-white">
                    <Building size={16} />
                  </div>
                  <span className="text-xs font-bold leading-snug">EV &amp; Smart Grid Curriculum</span>
                </div>

                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-white">
                    <Tv size={16} />
                  </div>
                  <span className="text-xs font-bold leading-snug">Modern High Voltage Labs</span>
                </div>

                <div className="flex items-center gap-2.5 bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center shrink-0 text-white">
                    <Lightbulb size={16} />
                  </div>
                  <span className="text-xs font-bold leading-snug">Renewable &amp; VLSI Research</span>
                </div>
              </div>

              <div className="md:col-span-3 flex md:flex-col justify-around gap-4 border-y md:border-y-0 md:border-x border-white/20 py-4 md:py-0 md:px-6">
                <div>
                  <div className="text-3xl font-extrabold text-white">16+</div>
                  <div className="text-xs text-white/80 font-medium">Expert Faculty</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">8+</div>
                  <div className="text-xs text-white/80 font-medium">Advanced Labs</div>
                </div>
                <div>
                  <div className="text-3xl font-extrabold text-white">340+</div>
                  <div className="text-xs text-white/80 font-medium">Students Strength</div>
                </div>
              </div>

              <div className="md:col-span-4 flex justify-center">
                <div className="w-full max-w-[220px] bg-white/10 rounded-2xl p-4 border border-white/15 shadow-inner text-center">
                  <div className="w-12 h-12 rounded-full bg-white/20 mx-auto flex items-center justify-center mb-2">
                    <Sparkles size={24} className="text-white" />
                  </div>
                  <div className="text-sm font-extrabold text-white mb-1">State-of-the-Art Labs</div>
                  <div className="text-[11px] text-white/70">High Voltage, Solar Simulation, VLSI &amp; Microcontroller Workstations.</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── Section: Upcoming Events & By the Numbers ── */}
      <section id="events" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left 8 Cols: Upcoming Events */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900">Upcoming Events</h2>
              <a href="#" className="text-xs font-bold flex items-center gap-1 hover:underline" style={{ color: "#9B2335" }}>
                View All Events <ChevronRight size={14} />
              </a>
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
                    <a
                      href="#"
                      className="inline-flex items-center gap-1 text-xs font-bold px-3.5 py-2 rounded-xl border transition-all hover:bg-[#9B2335] hover:text-white hover:border-[#9B2335]"
                      style={{ borderColor: "#9B2335", color: "#9B2335" }}
                    >
                      Register Now <ChevronRight size={12} />
                    </a>
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100 hidden sm:block">
                      <Image src={ev.img} alt={ev.title} fill className="object-cover" unoptimized />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 4 Cols: By the Numbers & Expand Network */}
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
                Connect with electrical engineers across top power grid &amp; energy firms.
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#9B2335] text-xs font-extrabold shadow-sm hover:bg-gray-100 transition-all">
                Join Alumni Network <ChevronRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* ── Section: Alumni Members Spotlight ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">Alumni Members Spotlight</h2>
            <p className="text-xs text-gray-500 font-medium">Accomplished leaders in power systems, EV tech and microelectronics.</p>
          </div>

          <Link
            href="/members"
            className="text-xs font-bold flex items-center gap-1 hover:underline"
            style={{ color: "#9B2335" }}
          >
            View All Alumni Members <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {SPOTLIGHT.map((alumni, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs hover:shadow-md transition-all text-center flex flex-col items-center group cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-extrabold mb-3 shadow-md group-hover:scale-105 transition-transform" style={{ background: alumni.bg }}>
                {alumni.initials}
              </div>

              <h3 className="text-sm font-extrabold text-gray-900 mb-0.5 group-hover:text-[#9B2335] transition-colors">{alumni.name}</h3>
              <p className="text-[11px] text-gray-500 font-medium mb-1">{alumni.role}</p>
              <div className="text-[11px] font-extrabold mb-3" style={{ color: "#9B2335" }}>{alumni.company}</div>

              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-[#9B2335] border border-red-100">
                {alumni.batch}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section: Our Initiatives ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-xs">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold text-gray-900">Our Initiatives</h2>
            <p className="text-xs text-gray-500 font-medium">Empowering the next generation of electrical &amp; energy engineers.</p>
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
            <p className="text-xs text-gray-500 font-medium">Moments and memories from Electrical Department activities.</p>
          </div>
          <a href="#" className="text-xs font-bold flex items-center gap-1 hover:underline" style={{ color: "#9B2335" }}>
            View Full Gallery <ChevronRight size={14} />
          </a>
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
              <p className="text-lg font-extrabold" style={{ color: "#9B2335" }}>Be a Part of Our Electrical Department Community</p>
              <p className="text-sm text-gray-500 font-medium">Reconnect. Collaborate. Grow Together.</p>
            </div>
          </div>
          <Link href="/invite" className="btn-maroon flex items-center gap-2 px-5 py-3 text-sm shrink-0 font-bold">
            <UserPlus size={16} />
            Invite Alumni
          </Link>
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
