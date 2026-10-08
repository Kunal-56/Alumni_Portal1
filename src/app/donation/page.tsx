"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Users, GraduationCap, Building2, Heart, Star, Briefcase,
  ChevronRight, ArrowRight, ShieldCheck, Receipt, TrendingUp,
  Award, Clock, MapPin, Facebook, Linkedin, Twitter, Instagram,
  Youtube, Send, ArrowUp, X, CheckCircle2,
  User, Mail, Phone, CreditCard, Landmark, Compass, Home, Building,
  Check, ChevronDown
} from "lucide-react";
import { Header } from "@/components/Header";
import "../dashboard.css";

/* ─── Initiatives Data ─── */
interface Initiative {
  id: number;
  tag: string;
  title: string;
  desc: string;
  raised: string;
  target: string;
  percentage: number;
  image: string;
}

const INITIATIVES: Initiative[] = [
  {
    id: 1,
    tag: "Education Support",
    title: "Scholarship Fund",
    desc: "Help deserving students achieve their dreams with financial support.",
    raised: "₹2,50,000",
    target: "₹5,00,000",
    percentage: 50,
    image: "/campus-building.png",
  },
  {
    id: 2,
    tag: "Infrastructure",
    title: "Campus Development Fund",
    desc: "Build a modern and smart campus for future generations.",
    raised: "₹3,20,000",
    target: "₹6,00,000",
    percentage: 53,
    image: "/campus-building.png",
  },
  {
    id: 3,
    tag: "Research & Innovation",
    title: "Research & Innovation Fund",
    desc: "Support cutting-edge research and innovation by our faculty and students.",
    raised: "₹1,80,000",
    target: "₹4,00,000",
    percentage: 45,
    image: "/campus-building.png",
  },
  {
    id: 4,
    tag: "Alumni Engagement",
    title: "Alumni Engagement Fund",
    desc: "Connect, support and empower our alumni community.",
    raised: "₹95,000",
    target: "₹2,00,000",
    percentage: 48,
    image: "/campus-building.png",
  },
];

/* ─── Events Data ─── */
const RECENT_EVENTS = [
  { day: "25", month: "JUN", title: "Global Alumni Meet 2026", type: "Virtual Event" },
  { day: "10", month: "JUL", title: "Career Growth Webinar", type: "Online Session" },
  { day: "18", month: "AUG", title: "Alumni Leadership Talk", type: "Tolani Campus" },
];

export default function DonationPage() {
  const [selectedInitiative, setSelectedInitiative] = useState<Initiative | null>(null);
  const [amount, setAmount] = useState("1000");
  const [customAmount, setCustomAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [donorForm, setDonorForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    pan: "",
    houseNo: "",
    area: "",
    city: "",
    state: "Gujarat",
    pinCode: "",
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [showTop, setShowTop] = useState(false);

  // Show back to top on scroll
  React.useEffect(() => {
    const el = document.querySelector(".dashboard-body");
    const onScroll = () => setShowTop((el?.scrollTop ?? 0) > 400);
    el?.addEventListener("scroll", onScroll);
    return () => el?.removeEventListener("scroll", onScroll);
  }, []);

  // Lock background scroll when modal is open
  React.useEffect(() => {
    if (selectedInitiative) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedInitiative]);

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      alert("Please agree to the Terms & Conditions and Privacy Policy");
      return;
    }
    setIsSuccess(true);
  };

  const handleCloseModal = () => {
    setIsSuccess(false);
    setSelectedInitiative(null);
  };

  return (
    <div className="dashboard-body min-h-screen" style={{ overflowY: "auto", overflowX: "hidden", background: "#fcf8f7" }}>

      {/* ── Navbar ── */}
      <Header activePage="donation" />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #fdf3f2 0%, #fae8e6 50%, #f7dbd8 100%)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-4">
            <span className="inline-block text-xs font-extrabold tracking-wider uppercase px-3 py-1 rounded-full" style={{ background: "#fce4e6", color: "#9B2335" }}>
              SUPPORT OUR ALUMNI COMMUNITY
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#751624] leading-tight">
              Make a Difference<br />for a Brighter Tomorrow
            </h1>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl leading-relaxed font-medium">
              Your contribution helps in building a stronger, smarter and more connected alumni community. Together we grow.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setSelectedInitiative(INITIATIVES[0])}
                className="btn-maroon flex items-center gap-2 px-6 py-3 text-sm font-bold shadow-md hover:shadow-lg transition-all"
              >
                <Heart size={16} fill="white" /> Donate Now
              </button>
              <a
                href="#initiatives"
                className="px-6 py-3 rounded-xl border border-[#9B2335] text-[#9B2335] font-bold text-sm hover:bg-[#9B2335]/5 transition-all flex items-center gap-2"
              >
                Explore Campaigns <ArrowRight size={16} />
              </a>
            </div>
          </div>

          {/* Right Visual Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md h-64 sm:h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="/campus-building.png"
                alt="Support Tolani Alumni"
                fill
                className="object-cover"
                priority
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#751624]/80 via-transparent to-transparent flex items-end p-6">
                <div className="text-white">
                  <p className="text-xs font-bold text-white/80 uppercase tracking-widest">Tolani Alumni Foundation</p>
                  <p className="text-lg font-extrabold">Empowering Future Leaders Together</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 -mt-8">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
              <Users size={22} />
            </div>
            <div>
              <div className="text-lg font-extrabold text-gray-900 leading-tight">2500+</div>
              <div className="text-[11px] text-gray-500 font-medium">Alumni Supported</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
              <GraduationCap size={22} />
            </div>
            <div>
              <div className="text-lg font-extrabold text-gray-900 leading-tight">120+</div>
              <div className="text-[11px] text-gray-500 font-medium">Departments</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
              <Building2 size={22} />
            </div>
            <div>
              <div className="text-lg font-extrabold text-gray-900 leading-tight">50+</div>
              <div className="text-[11px] text-gray-500 font-medium">New Initiatives</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
              <Heart size={22} />
            </div>
            <div>
              <div className="text-lg font-extrabold text-gray-900 leading-tight">1000+</div>
              <div className="text-[11px] text-gray-500 font-medium">Donors</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
              <Star size={22} />
            </div>
            <div>
              <div className="text-lg font-extrabold text-gray-900 leading-tight">98%</div>
              <div className="text-[11px] text-gray-500 font-medium">Impact Satisfaction</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Why Donate / Make a Lasting Impact Section ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Campus Image */}
          <div className="lg:col-span-5">
            <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden shadow-lg border border-gray-200">
              <Image
                src="/campus-building.png"
                alt="Tolani Campus"
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          </div>

          {/* Right Features */}
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9B2335]">WHY DONATE?</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Make a Lasting Impact</h2>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Your support fuels alumni initiatives, student growth and campus development. Together, we can create more opportunities for future generations.
            </p>

            {/* 4 Feature Boxes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              <div className="bg-white p-4 rounded-xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: "#fef0f2", color: "#9B2335" }}>
                  <GraduationCap size={20} />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Student Support</h4>
                <p className="text-[10px] text-gray-500 mt-1">Scholarships &amp; Mentorship</p>
              </div>

              <div className="bg-white p-4 rounded-xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: "#fef0f2", color: "#9B2335" }}>
                  <Building2 size={20} />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Campus Development</h4>
                <p className="text-[10px] text-gray-500 mt-1">Better Facilities &amp; Resources</p>
              </div>

              <div className="bg-white p-4 rounded-xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: "#fef0f2", color: "#9B2335" }}>
                  <Briefcase size={20} />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Career Growth</h4>
                <p className="text-[10px] text-gray-500 mt-1">Jobs &amp; Internships</p>
              </div>

              <div className="bg-white p-4 rounded-xl text-center border border-gray-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: "#fef0f2", color: "#9B2335" }}>
                  <Users size={20} />
                </div>
                <h4 className="text-xs font-bold text-gray-900">Alumni Network</h4>
                <p className="text-[10px] text-gray-500 mt-1">Stronger Connections</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Support Our Key Initiatives Section ── */}
      <section id="initiatives" className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">
              Support Our <span className="underline decoration-[#9B2335] underline-offset-4">Key</span> Initiatives
            </h2>
          </div>
          <a href="#" className="text-xs font-bold flex items-center gap-1 text-[#9B2335] hover:underline">
            View All Campaigns <ArrowRight size={14} />
          </a>
        </div>

        {/* 4 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {INITIATIVES.map((init) => (
            <div key={init.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between">
              <div>
                {/* Image */}
                <div className="relative h-40 bg-gray-100">
                  <Image src={init.image} alt={init.title} fill className="object-cover" unoptimized />
                  <span className="absolute top-3 left-3 bg-[#9B2335] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    {init.tag}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-sm font-extrabold text-gray-900 mb-1">{init.title}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-4">{init.desc}</p>

                  {/* Progress Info */}
                  <div className="flex justify-between items-center text-[11px] font-bold text-gray-700 mb-1.5">
                    <span><strong className="text-[#9B2335]">{init.raised}</strong> raised of {init.target}</span>
                    <span className="text-[#9B2335]">{init.percentage}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden mb-4">
                    <div className="bg-[#9B2335] h-full rounded-full transition-all duration-500" style={{ width: `${init.percentage}%` }} />
                  </div>
                </div>
              </div>

              {/* Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => setSelectedInitiative(init)}
                  className="w-full btn-maroon py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  Contribute Now <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 Column Bottom Section (Events, Gallery, Why Donate) ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Col 1: Recent Events */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-extrabold text-gray-900">Recent Events</h3>
              <a href="/#events" className="text-[11px] font-bold text-[#9B2335] flex items-center gap-0.5">
                View All <ArrowRight size={12} />
              </a>
            </div>

            <div className="space-y-3">
              {RECENT_EVENTS.map((ev, i) => (
                <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-gray-100 hover:border-[#9B2335]/30 transition-all cursor-pointer">
                  <div className="rounded-lg px-2.5 py-1.5 text-center shrink-0" style={{ background: "#9B2335", minWidth: "42px" }}>
                    <div className="text-sm font-extrabold text-white leading-tight">{ev.day}</div>
                    <div className="text-[9px] font-bold text-white/80">{ev.month}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{ev.title}</h4>
                    <p className="text-[10px] text-gray-400 font-medium">{ev.type}</p>
                  </div>
                  <ChevronRight size={14} className="text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Col 2: From Our Gallery */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-extrabold text-gray-900">From Our Gallery</h3>
              <a href="/#gallery" className="text-[11px] font-bold text-[#9B2335] flex items-center gap-0.5">
                View All <ArrowRight size={12} />
              </a>
            </div>

            <div className="relative h-44 rounded-xl overflow-hidden">
              <Image src="/campus-building.png" alt="Gallery" fill className="object-cover" unoptimized />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                <p className="text-xs font-bold text-white">Alumni Meet 2026 – A Grand Success</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 mt-3">
              <span className="w-4 h-1.5 rounded-full bg-[#9B2335]" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            </div>
          </div>

          {/* Col 3: Why Donate Info List */}
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-sm font-extrabold text-gray-900 mb-4">Why Donate?</h3>
            
            <div className="space-y-3.5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Transparent Usage</h4>
                  <p className="text-[10px] text-gray-500">Your contribution is used responsibly and transparently.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
                  <Receipt size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Tax Benefits</h4>
                  <p className="text-[10px] text-gray-500">Eligible for tax exemption under Section 80G.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
                  <TrendingUp size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Real Impact</h4>
                  <p className="text-[10px] text-gray-500">Creates opportunities and changes lives.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#fef0f2", color: "#9B2335" }}>
                  <Award size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Alumni Power</h4>
                  <p className="text-[10px] text-gray-500">Strengthens the bond between alumni, students and the institution.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pb-16">
        <div className="bg-[#9B2335] text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-full bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
              <Heart size={32} className="text-white" fill="white" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-extrabold leading-tight">
                Together We Can Build a Stronger Alumni Community
              </h3>
              <p className="text-xs sm:text-sm text-white/80 mt-1 font-medium">
                Join thousands of alumni in giving back and creating a better future.
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setSelectedInitiative(INITIATIVES[0])}
            className="bg-white text-[#9B2335] hover:bg-gray-100 font-extrabold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2 shrink-0 shadow-md"
          >
            Donate Now <Heart size={16} fill="#9B2335" />
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer-dark pt-12 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-10">

            {/* Brand */}
            <div className="lg:col-span-3">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative w-9 h-9 bg-white rounded-full p-1">
                  <Image src="/logo.jpg" alt="Tolani" fill className="object-contain" unoptimized />
                </div>
                <div>
                  <div className="text-xs font-extrabold tracking-widest text-white whitespace-nowrap">TOLANI F.G POLYTECHNIC</div>
                  <div className="text-[10px] font-bold tracking-wider" style={{ color: "#c0586a" }}>ALUMNI PORTAL</div>
                </div>
              </div>
              <p className="text-[12px] text-gray-500 leading-relaxed mb-4">
                The official alumni community of Tolani Foundation.
              </p>
              <div className="flex gap-3">
                {[Facebook, Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a key={i} href="#" className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-800 text-gray-400 hover:bg-[#9B2335] hover:text-white transition-all">
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
              {["Alumni Directory", "Departments", "Jobs & Internships", "Events", "Gallery", "News"].map(l => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>

            {/* Resources */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-bold text-white mb-4">Resources</h4>
              {["Success Stories", "Career Support", "Mentorship", "FAQs", "Help & Support"].map(l => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>

            {/* Support */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-bold text-white mb-4">Support</h4>
              {["Privacy Policy", "Terms of Use", "Refund Policy", "Contact Us"].map(l => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>

            {/* Newsletter */}
            <div className="lg:col-span-3">
              <h4 className="text-sm font-bold text-white mb-4">Stay Connected</h4>
              <div className="flex gap-2 mb-3">
                <input type="email" placeholder="Enter your email" className="flex-1 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#9B2335]" />
                <button className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#9B2335" }}>
                  <Send size={14} className="text-white" />
                </button>
              </div>
              <p className="text-[11px] text-gray-500">Stay updated with the latest news, events and opportunities.</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-left">
            <p className="text-[12px] text-gray-600">© 2026 Tolani Alumni Portal. All Rights Reserved.</p>
          </div>
        </div>
      </footer>

      {/* ── Back to Top ── */}
      {showTop && (
        <button
          onClick={() => document.querySelector(".dashboard-body")?.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg z-50 transition-all"
          style={{ background: "#9B2335" }}
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* ── Donation Modal matching user image ── */}
      {selectedInitiative && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-hidden"
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseModal();
          }}
        >
          <div className="bg-white rounded-[24px] sm:rounded-[28px] max-w-2xl w-full relative shadow-2xl animate-slideup border border-gray-100 max-h-[86vh] flex flex-col overflow-hidden">
            
            {/* ── Top Header Banner with soft warm blush styling ── */}
            <div className="relative bg-[#fcf4f2] px-6 sm:px-8 py-5 sm:py-6 border-b border-[#f4eae7] shrink-0">
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>

              {/* Calligraphic script text in top right */}
              <div className="hidden sm:block absolute right-14 top-6 select-none pointer-events-none text-right">
                <p
                  className="text-[#9e525f] text-base leading-tight font-bold"
                  style={{ fontFamily: "'Caveat', 'Segoe Script', 'Brush Script MT', cursive, sans-serif" }}
                >
                  Education<br />Creates<br />
                  <span className="inline-flex items-center gap-1">Opportunities <span className="text-xs">♥</span></span>
                </p>
              </div>

              <div className="flex items-center gap-4 sm:gap-5 pr-0 sm:pr-24">
                {/* Round badge with graduation cap & heart */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#fdecef] flex items-center justify-center shrink-0 shadow-xs">
                  <GraduationCap size={28} className="text-[#8B263E]" />
                  <Heart size={14} className="text-[#8B263E] fill-[#8B263E] absolute bottom-2 right-2" />
                </div>

                <div>
                  <div className="text-xs sm:text-sm font-bold text-[#8B263E]">
                    Contribute <span className="text-[#8B263E]/80 font-semibold">to Initiative</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">
                    {selectedInitiative.title}
                  </h2>
                  <p className="text-xs text-gray-600 mt-1 max-w-md leading-relaxed font-medium">
                    {selectedInitiative.desc}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Form Body / Success Screen ── */}
            {isSuccess ? (
              <div className="p-8 sm:p-10 text-center space-y-5 overflow-y-auto flex-1 modal-scroll">
                <div className="w-16 h-16 rounded-full bg-[#fdecef] text-[#8B263E] flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">Thank You for Your Generous Support!</h3>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    Dear <strong className="text-gray-900">{donorForm.fullName || "Valued Donor"}</strong>, your contribution of <strong className="text-[#8B263E]">₹{customAmount || amount}</strong> towards <strong className="text-gray-900">{selectedInitiative.title}</strong> has been received.
                  </p>
                </div>

                <div className="bg-[#faf7f6] p-4 rounded-2xl max-w-md mx-auto text-left border border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Reference ID:</span>
                    <span className="font-mono font-bold text-gray-800">TXN{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Initiative:</span>
                    <span className="font-bold text-gray-800">{selectedInitiative.title}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Email for Receipt:</span>
                    <span className="font-bold text-gray-800">{donorForm.email || "Sent to registered email"}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Payment Mode:</span>
                    <span className="font-bold uppercase text-[#8B263E]">{paymentMethod}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-500">
                    Tax exemption receipt under Section 80G has been processed.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-[#8B263E] hover:bg-[#741c31] text-white font-bold px-8 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer"
                >
                  Close &amp; Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleDonate} className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1 modal-scroll">
                
                {/* ── 1. Select Donation Amount ── */}
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <Heart size={15} className="text-[#8B263E] fill-[#8B263E]" />
                      <h3 className="text-xs sm:text-sm font-bold text-gray-900">Select Donation Amount (₹)</h3>
                    </div>
                    <span className="text-[11px] text-gray-400">Or enter a custom amount</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-2.5">
                    {["500", "1000", "2500", "5000"].map((val) => {
                      const isSelected = amount === val && !customAmount;
                      return (
                        <button
                          type="button"
                          key={val}
                          onClick={() => {
                            setAmount(val);
                            setCustomAmount("");
                          }}
                          className={`relative py-2.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 cursor-pointer ${
                            isSelected
                              ? "bg-[#8B263E] text-white shadow-sm"
                              : "bg-[#fbf9f8] text-gray-800 border border-[#ebe4e1] hover:border-[#8B263E]/40 hover:bg-[#f7f2f0]"
                          }`}
                        >
                          ₹{val}
                          {isSelected && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#691829] text-white flex items-center justify-center ring-2 ring-white">
                              <Check size={10} strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Amount input */}
                  <div className="flex items-center rounded-xl border border-gray-200 bg-[#fbf9f8] overflow-hidden focus-within:border-[#8B263E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                    <div className="px-3.5 py-2.5 text-gray-400 font-semibold border-r border-gray-200 select-none text-xs sm:text-sm">
                      ₹
                    </div>
                    <input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => {
                        setCustomAmount(e.target.value);
                        if (e.target.value) setAmount("");
                      }}
                      className="w-full px-3 py-2 text-xs sm:text-sm bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900"
                    />
                  </div>
                </div>

                {/* ── 2. Personal Details ── */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <User size={15} className="text-[#8B263E]" />
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">Personal Details</h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Full Name */}
                    <div>
                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-[#fbf9f8] focus-within:border-[#8B263E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                        <User size={15} className="text-gray-400 shrink-0" />
                        <input
                          type="text"
                          required
                          placeholder="Full Name *"
                          value={donorForm.fullName}
                          onChange={(e) => setDonorForm({ ...donorForm, fullName: e.target.value })}
                          className="w-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900"
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-[#fbf9f8] focus-within:border-[#8B263E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                        <Mail size={15} className="text-gray-400 shrink-0" />
                        <input
                          type="email"
                          required
                          placeholder="Email Address *"
                          value={donorForm.email}
                          onChange={(e) => setDonorForm({ ...donorForm, email: e.target.value })}
                          className="w-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 pl-1 font-medium">(For tax receipt)</p>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-[#fbf9f8] focus-within:border-[#8B263E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                        <Phone size={15} className="text-gray-400 shrink-0" />
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number *"
                          value={donorForm.phone}
                          onChange={(e) => setDonorForm({ ...donorForm, phone: e.target.value })}
                          className="w-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 pl-1 font-medium">(10 digits)</p>
                    </div>

                    {/* PAN Card */}
                    <div>
                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-[#fbf9f8] focus-within:border-[#8B263E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                        <CreditCard size={15} className="text-gray-400 shrink-0" />
                        <input
                          type="text"
                          placeholder="PAN Card No. *"
                          value={donorForm.pan}
                          onChange={(e) => setDonorForm({ ...donorForm, pan: e.target.value })}
                          className="w-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1 pl-1 font-medium">(Optional for 80G receipt)</p>
                    </div>
                  </div>
                </div>

                {/* ── 3. Address ── */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <MapPin size={15} className="text-[#8B263E]" />
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">Address</h3>
                  </div>

                  <div className="space-y-2.5">
                    {/* House No */}
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-[#fbf9f8] focus-within:border-[#8B263E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                      <MapPin size={15} className="text-gray-400 shrink-0" />
                      <input
                        type="text"
                        required
                        placeholder="House No. / Flat No. / Building *"
                        value={donorForm.houseNo}
                        onChange={(e) => setDonorForm({ ...donorForm, houseNo: e.target.value })}
                        className="w-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900"
                      />
                    </div>

                    {/* Area & City */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-[#fbf9f8] focus-within:border-[#8B263E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                        <Building size={15} className="text-gray-400 shrink-0" />
                        <input
                          type="text"
                          required
                          placeholder="Area / Locality *"
                          value={donorForm.area}
                          onChange={(e) => setDonorForm({ ...donorForm, area: e.target.value })}
                          className="w-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900"
                        />
                      </div>

                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-[#fbf9f8] focus-within:border-[#8B263E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                        <Building2 size={15} className="text-gray-400 shrink-0" />
                        <input
                          type="text"
                          required
                          placeholder="City *"
                          value={donorForm.city}
                          onChange={(e) => setDonorForm({ ...donorForm, city: e.target.value })}
                          className="w-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900"
                        />
                      </div>
                    </div>

                    {/* State & PIN */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-[#fbf9f8] focus-within:border-[#8B263E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                        <Compass size={15} className="text-gray-400 shrink-0" />
                        <select
                          value={donorForm.state}
                          onChange={(e) => setDonorForm({ ...donorForm, state: e.target.value })}
                          className="w-full text-xs sm:text-sm bg-transparent outline-none font-medium text-gray-900 appearance-none cursor-pointer pr-6"
                        >
                          <option value="Gujarat">Gujarat</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Karnataka">Karnataka</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Punjab">Punjab</option>
                          <option value="West Bengal">West Bengal</option>
                          <option value="Other">Other</option>
                        </select>
                        <ChevronDown size={15} className="text-gray-400 pointer-events-none absolute right-3" />
                      </div>

                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-[#fbf9f8] focus-within:border-[#8B263E] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                        <Mail size={15} className="text-gray-400 shrink-0" />
                        <input
                          type="text"
                          required
                          placeholder="PIN Code *"
                          value={donorForm.pinCode}
                          onChange={(e) => setDonorForm({ ...donorForm, pinCode: e.target.value })}
                          className="w-full text-xs sm:text-sm bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── 4. Payment Method (UI only, as requested) ── */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <CreditCard size={15} className="text-[#8B263E]" />
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">Payment Method</h3>
                  </div>

                  {/* 4 Cards (UPI, Credit Card, Debit Card, Net Banking) */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {/* UPI */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("upi")}
                      className={`relative p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[72px] ${
                        paymentMethod === "upi"
                          ? "bg-[#fcf3f4] border-[#8B263E] ring-1 ring-[#8B263E]"
                          : "bg-[#fbf9f8] border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {paymentMethod === "upi" && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#8B263E] text-white flex items-center justify-center">
                          <Check size={9} strokeWidth={3} />
                        </span>
                      )}
                      <div className="flex items-center justify-center gap-0.5 mb-1 select-none">
                        <span className="text-[#097939] font-black text-sm italic">/</span>
                        <span className="text-[#ED752E] font-black text-sm italic -ml-1">/</span>
                        <span className="font-extrabold text-xs text-gray-800 ml-0.5">UPI</span>
                      </div>
                      <span className="text-[11px] font-bold text-gray-700">UPI</span>
                    </button>

                    {/* Credit Card */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("credit")}
                      className={`relative p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[72px] ${
                        paymentMethod === "credit"
                          ? "bg-[#fcf3f4] border-[#8B263E] ring-1 ring-[#8B263E]"
                          : "bg-[#fbf9f8] border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {paymentMethod === "credit" && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#8B263E] text-white flex items-center justify-center">
                          <Check size={9} strokeWidth={3} />
                        </span>
                      )}
                      <CreditCard size={20} className="text-gray-700 mb-1" />
                      <span className="text-[11px] font-bold text-gray-700">Credit Card</span>
                    </button>

                    {/* Debit Card */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("debit")}
                      className={`relative p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[72px] ${
                        paymentMethod === "debit"
                          ? "bg-[#fcf3f4] border-[#8B263E] ring-1 ring-[#8B263E]"
                          : "bg-[#fbf9f8] border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {paymentMethod === "debit" && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#8B263E] text-white flex items-center justify-center">
                          <Check size={9} strokeWidth={3} />
                        </span>
                      )}
                      <CreditCard size={20} className="text-gray-700 mb-1" />
                      <span className="text-[11px] font-bold text-gray-700">Debit Card</span>
                    </button>

                    {/* Net Banking */}
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`relative p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[72px] ${
                        paymentMethod === "netbanking"
                          ? "bg-[#fcf3f4] border-[#8B263E] ring-1 ring-[#8B263E]"
                          : "bg-[#fbf9f8] border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {paymentMethod === "netbanking" && (
                        <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#8B263E] text-white flex items-center justify-center">
                          <Check size={9} strokeWidth={3} />
                        </span>
                      )}
                      <Landmark size={20} className="text-gray-700 mb-1" />
                      <span className="text-[11px] font-bold text-gray-700">Net Banking</span>
                    </button>
                  </div>
                </div>

                {/* ── Terms & Conditions Checkbox ── */}
                <div className="pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-700 select-none">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-[#8B263E] accent-[#8B263E] border-gray-300 focus:ring-[#8B263E] cursor-pointer"
                    />
                    <span>
                      I agree to the{" "}
                      <a href="#" className="font-semibold text-gray-900 underline underline-offset-2 hover:text-[#8B263E]">
                        Terms &amp; Conditions
                      </a>{" "}
                      and{" "}
                      <a href="#" className="font-semibold text-gray-900 underline underline-offset-2 hover:text-[#8B263E]">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>

                {/* ── Submit Button ── */}
                <button
                  type="submit"
                  disabled={!agreedToTerms}
                  className="w-full bg-[#8B263E] hover:bg-[#761c31] active:scale-[0.99] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#8B263E]/25 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck size={18} className="text-white fill-white/20" />
                  <span>Proceed to Pay ₹{customAmount || amount || "1000"}</span>
                  <ArrowRight size={16} className="text-white" />
                </button>

                {/* ── Footer Heart Line ── */}
                <div className="text-center pt-1 pb-1">
                  <div className="flex items-center justify-center gap-2.5 mb-1">
                    <div className="h-[1px] w-12 bg-gray-200" />
                    <span className="text-[#8B263E] text-xs">♥</span>
                    <div className="h-[1px] w-12 bg-gray-200" />
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Together we can make a difference ♡
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
