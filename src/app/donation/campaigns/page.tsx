"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart, ArrowRight, ArrowLeft, ShieldCheck, Users,
  GraduationCap, Building2, Briefcase, Lightbulb, Leaf,
  Trophy, BookOpen, Laptop, Wrench, Globe, Search,
  ChevronRight, CheckCircle2, X, Check, CreditCard,
  Landmark, User, Mail, Phone, MapPin, Building,
  Compass, ChevronDown, ArrowUp,
} from "lucide-react";
import { Header } from "@/components/Header";
import "../../dashboard.css";

/* ─── All Campaigns Data ─── */
const ALL_CAMPAIGNS = [
  {
    id: 1,
    tag: "Education Support",
    tagColor: "#9B2335",
    title: "Scholarship Fund",
    desc: "Help deserving students achieve their dreams with financial support. Every rupee counts towards a brighter future.",
    raised: "₹2,50,000",
    target: "₹5,00,000",
    raisedNum: 250000,
    targetNum: 500000,
    percentage: 50,
    donors: 128,
    daysLeft: 45,
    icon: <GraduationCap size={22} />,
    image: "/campus-building.png",
    category: "Education",
  },
  {
    id: 2,
    tag: "Infrastructure",
    tagColor: "#9B2335",
    title: "Campus Development Fund",
    desc: "Build a modern and smart campus for future generations. Better facilities create better learning environments.",
    raised: "₹3,20,000",
    target: "₹6,00,000",
    raisedNum: 320000,
    targetNum: 600000,
    percentage: 53,
    donors: 204,
    daysLeft: 60,
    icon: <Building2 size={22} />,
    image: "/campus-building.png",
    category: "Infrastructure",
  },
  {
    id: 3,
    tag: "Research & Innovation",
    tagColor: "#9B2335",
    title: "Research & Innovation Fund",
    desc: "Support cutting-edge research and innovation by our faculty and students. Drive tomorrow's breakthroughs today.",
    raised: "₹1,80,000",
    target: "₹4,00,000",
    raisedNum: 180000,
    targetNum: 400000,
    percentage: 45,
    donors: 96,
    daysLeft: 30,
    icon: <Lightbulb size={22} />,
    image: "/campus-building.png",
    category: "Research",
  },
  {
    id: 4,
    tag: "Alumni Engagement",
    tagColor: "#9B2335",
    title: "Alumni Engagement Fund",
    desc: "Connect, support and empower our alumni community. Strengthen the bond between generations.",
    raised: "₹95,000",
    target: "₹2,00,000",
    raisedNum: 95000,
    targetNum: 200000,
    percentage: 48,
    donors: 61,
    daysLeft: 90,
    icon: <Users size={22} />,
    image: "/campus-building.png",
    category: "Community",
  },
  {
    id: 5,
    tag: "Green Campus",
    tagColor: "#9B2335",
    title: "Green Campus Initiative",
    desc: "Create a sustainable and eco-friendly campus environment. Plant trees, reduce waste and build a greener tomorrow.",
    raised: "₹75,000",
    target: "₹1,50,000",
    raisedNum: 75000,
    targetNum: 150000,
    percentage: 50,
    donors: 43,
    daysLeft: 75,
    icon: <Leaf size={22} />,
    image: "/campus-building.png",
    category: "Environment",
  },
  {
    id: 6,
    tag: "Sports & Athletics",
    tagColor: "#9B2335",
    title: "Sports Excellence Fund",
    desc: "Support student athletes with world-class training facilities, equipment and coaching to achieve their sporting dreams.",
    raised: "₹1,10,000",
    target: "₹3,00,000",
    raisedNum: 110000,
    targetNum: 300000,
    percentage: 37,
    donors: 77,
    daysLeft: 55,
    icon: <Trophy size={22} />,
    image: "/campus-building.png",
    category: "Sports",
  },
  {
    id: 7,
    tag: "Digital Library",
    tagColor: "#9B2335",
    title: "Digital Library & Resources",
    desc: "Build a comprehensive digital library with e-books, research papers and online learning resources for all students.",
    raised: "₹60,000",
    target: "₹1,25,000",
    raisedNum: 60000,
    targetNum: 125000,
    percentage: 48,
    donors: 39,
    daysLeft: 40,
    icon: <BookOpen size={22} />,
    image: "/campus-building.png",
    category: "Education",
  },
  {
    id: 8,
    tag: "Tech Labs",
    tagColor: "#9B2335",
    title: "Advanced Tech Lab Setup",
    desc: "Equip students with the latest technology — AI, robotics, IoT and more. Hands-on learning for the future of tech.",
    raised: "₹2,00,000",
    target: "₹5,00,000",
    raisedNum: 200000,
    targetNum: 500000,
    percentage: 40,
    donors: 112,
    daysLeft: 50,
    icon: <Laptop size={22} />,
    image: "/campus-building.png",
    category: "Infrastructure",
  },
  {
    id: 9,
    tag: "Skill Development",
    tagColor: "#9B2335",
    title: "Vocational Skills Program",
    desc: "Empower students with practical vocational skills and industry certifications that prepare them for real-world careers.",
    raised: "₹45,000",
    target: "₹1,00,000",
    raisedNum: 45000,
    targetNum: 100000,
    percentage: 45,
    donors: 28,
    daysLeft: 65,
    icon: <Wrench size={22} />,
    image: "/campus-building.png",
    category: "Education",
  },
  {
    id: 10,
    tag: "International Exchange",
    tagColor: "#9B2335",
    title: "Global Exchange Program",
    desc: "Send deserving students on international exchange programs. Broaden horizons, build global perspectives.",
    raised: "₹3,50,000",
    target: "₹8,00,000",
    raisedNum: 350000,
    targetNum: 800000,
    percentage: 44,
    donors: 189,
    daysLeft: 80,
    icon: <Globe size={22} />,
    image: "/campus-building.png",
    category: "Community",
  },
  {
    id: 11,
    tag: "Women Empowerment",
    tagColor: "#9B2335",
    title: "Women in STEM Scholarship",
    desc: "Break barriers and inspire the next generation of women scientists, engineers and tech leaders in our community.",
    raised: "₹1,40,000",
    target: "₹2,50,000",
    raisedNum: 140000,
    targetNum: 250000,
    percentage: 56,
    donors: 93,
    daysLeft: 35,
    icon: <GraduationCap size={22} />,
    image: "/campus-building.png",
    category: "Education",
  },
  {
    id: 12,
    tag: "Career Services",
    tagColor: "#9B2335",
    title: "Career Development Centre",
    desc: "Build a world-class career services centre with placement support, resume workshops and industry networking events.",
    raised: "₹85,000",
    target: "₹2,00,000",
    raisedNum: 85000,
    targetNum: 200000,
    percentage: 43,
    donors: 54,
    daysLeft: 70,
    icon: <Briefcase size={22} />,
    image: "/campus-building.png",
    category: "Community",
  },
];

const CATEGORIES = ["All", "Education", "Infrastructure", "Research", "Community", "Environment", "Sports"];

interface Campaign {
  id: number;
  tag: string;
  tagColor: string;
  title: string;
  desc: string;
  raised: string;
  target: string;
  raisedNum: number;
  targetNum: number;
  percentage: number;
  donors: number;
  daysLeft: number;
  icon: React.ReactNode;
  image: string;
  category: string;
}

export default function CampaignsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [amount, setAmount] = useState("1000");
  const [customAmount, setCustomAmount] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showTop, setShowTop] = useState(false);
  const [donorForm, setDonorForm] = useState({
    fullName: "", email: "", phone: "", pan: "",
    houseNo: "", area: "", city: "", state: "Gujarat", pinCode: "",
  });

  React.useEffect(() => {
    const el = document.querySelector(".dashboard-body");
    const onScroll = () => setShowTop((el?.scrollTop ?? 0) > 400);
    el?.addEventListener("scroll", onScroll);
    return () => el?.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    if (selectedCampaign) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [selectedCampaign]);

  const filtered = ALL_CAMPAIGNS.filter((c) => {
    const matchCat = selectedCategory === "All" || c.category === selectedCategory;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.tag.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) { alert("Please agree to Terms & Conditions"); return; }
    setIsSuccess(true);
  };

  const handleClose = () => {
    setIsSuccess(false);
    setSelectedCampaign(null);
    setAmount("1000");
    setCustomAmount("");
    setPaymentMethod("upi");
    setAgreedToTerms(true);
  };

  return (
    <div className="dashboard-body min-h-screen" style={{ overflowY: "auto", overflowX: "hidden", background: "#f9fafb" }}>
      <Header activePage="donation" />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-3">
                Support Our Campaigns
              </h1>
              <p className="text-sm text-gray-500 font-medium max-w-lg leading-relaxed">
                Every initiative you support creates a lasting impact. Browse all active campaigns and choose a cause that resonates with you.
              </p>

            </div>

            {/* Right actions */}
            <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
              <Link
                href="/donation"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#9B2335] text-[#9B2335] font-bold text-xs hover:bg-[#9B2335] hover:text-white transition-all"
              >
                <ArrowLeft size={14} /> Back to Donation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filters ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          {/* Category tabs */}
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-[#9B2335] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex items-center w-full sm:w-64">
            <Search size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:border-[#9B2335] focus:bg-white transition-all font-medium"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-2.5 text-gray-400 hover:text-gray-600">
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Campaigns Grid ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-[#9B2335] flex items-center justify-center mx-auto mb-4">
              <Heart size={28} />
            </div>
            <h3 className="text-lg font-extrabold text-gray-900 mb-1">No Campaigns Found</h3>
            <p className="text-xs text-gray-500 mb-4">Try a different category or search term.</p>
            <button
              onClick={() => { setSelectedCategory("All"); setSearch(""); }}
              className="px-5 py-2 text-xs font-bold bg-[#9B2335] text-white rounded-xl hover:bg-[#7a1c2a] transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((c) => (
              <div
                key={c.id}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition-all flex flex-col group"
              >
                {/* Image */}
                <div className="relative h-40 bg-gray-100 overflow-hidden">
                  <Image src={c.image} alt={c.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <span
                    className="absolute top-3 left-3 text-white text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: c.tagColor }}
                  >
                    {c.tag}
                  </span>
                  <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
                    <span className="bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {c.daysLeft}d left
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex items-start gap-2 mb-1.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: `${c.tagColor}15`, color: c.tagColor }}
                    >
                      {c.icon}
                    </div>
                    <h3 className="text-sm font-extrabold text-gray-900 leading-snug">{c.title}</h3>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed mb-4 flex-1">{c.desc}</p>

                  {/* Stats row */}
                  <div className="flex items-center justify-between text-[10px] text-gray-500 font-medium mb-1.5">
                    <span className="flex items-center gap-1">
                      <Users size={10} /> {c.donors} donors
                    </span>
                    <span className="font-bold" style={{ color: c.tagColor }}>{c.percentage}%</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${c.percentage}%`, background: c.tagColor }}
                    />
                  </div>

                  {/* Raised info */}
                  <div className="flex justify-between text-[11px] font-bold text-gray-700 mb-4">
                    <span style={{ color: c.tagColor }}>{c.raised} raised</span>
                    <span className="text-gray-400 font-medium">of {c.target}</span>
                  </div>

                  {/* Button */}
                  <button
                    onClick={() => setSelectedCampaign(c)}
                    className="w-full py-2.5 px-4 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-all shadow-sm"
                    style={{ background: c.tagColor }}
                  >
                    <Heart size={13} fill="white" /> Contribute Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
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
                Can't Decide? Start with Any Campaign
              </h3>
              <p className="text-xs sm:text-sm text-white/80 mt-1 font-medium">
                Every contribution, big or small, creates a meaningful difference.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCampaign(ALL_CAMPAIGNS[0])}
            className="bg-white text-[#9B2335] hover:bg-gray-100 font-extrabold px-6 py-3.5 rounded-xl text-sm transition-all flex items-center gap-2 shrink-0 shadow-md"
          >
            Donate Now <Heart size={16} fill="#9B2335" />
          </button>
        </div>
      </section>

      {/* ── Back to Top ── */}
      {showTop && (
        <button
          onClick={() => document.querySelector(".dashboard-body")?.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg z-50"
          style={{ background: "#9B2335" }}
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* ── Donation Modal ── */}
      {selectedCampaign && (
        <div
          className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5"
          onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
        >
          <div className="bg-white rounded-[24px] sm:rounded-[28px] max-w-2xl w-full relative shadow-2xl border border-gray-100 max-h-[88vh] flex flex-col overflow-hidden">

            {/* Header */}
            <div className="relative bg-[#fcf4f2] px-6 sm:px-8 py-5 border-b border-[#f4eae7] shrink-0">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-black/5 transition-colors"
              >
                <X size={20} />
              </button>
              <div className="hidden sm:block absolute right-14 top-6 text-right select-none pointer-events-none">
                <p className="text-[#9e525f] text-base leading-tight font-bold" style={{ fontFamily: "'Caveat', cursive" }}>
                  Education<br />Creates<br /><span className="inline-flex items-center gap-1">Opportunities <span className="text-xs">♥</span></span>
                </p>
              </div>
              <div className="flex items-center gap-4 sm:gap-5 pr-0 sm:pr-24">
                <div className="w-14 h-14 rounded-full bg-[#fdecef] flex items-center justify-center shrink-0 shadow-sm" style={{ color: "#8B263E" }}>
                  {selectedCampaign.icon}
                </div>
                <div>
                  <div className="text-xs font-bold text-[#8B263E]">Contribute <span className="font-semibold text-[#8B263E]/80">to Initiative</span></div>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-tight">{selectedCampaign.title}</h2>
                  <p className="text-xs text-gray-600 mt-0.5 max-w-md font-medium">{selectedCampaign.desc}</p>
                </div>
              </div>
            </div>

            {/* Body */}
            {isSuccess ? (
              <div className="p-8 sm:p-10 text-center space-y-5 overflow-y-auto flex-1 modal-scroll">
                <div className="w-16 h-16 rounded-full bg-[#fdecef] text-[#8B263E] flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">Thank You for Your Generous Support!</h3>
                  <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                    Dear <strong className="text-gray-900">{donorForm.fullName || "Valued Donor"}</strong>, your contribution of{" "}
                    <strong className="text-[#8B263E]">₹{customAmount || amount}</strong> towards{" "}
                    <strong className="text-gray-900">{selectedCampaign.title}</strong> has been received.
                  </p>
                </div>
                <div className="bg-[#faf7f6] p-4 rounded-2xl max-w-md mx-auto text-left border border-gray-100 space-y-2 text-xs">
                  <div className="flex justify-between text-gray-500">
                    <span>Reference ID:</span>
                    <span className="font-mono font-bold text-gray-800">TXN{Date.now().toString().slice(-8)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Campaign:</span>
                    <span className="font-bold text-gray-800">{selectedCampaign.title}</span>
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
                  onClick={handleClose}
                  className="bg-[#8B263E] hover:bg-[#741c31] text-white font-bold px-8 py-3 rounded-xl text-sm transition-all shadow-md"
                >
                  Close & Return
                </button>
              </div>
            ) : (
              <form onSubmit={handleDonate} className="p-5 sm:p-7 space-y-5 overflow-y-auto flex-1 modal-scroll">
                {/* Amount */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Heart size={15} className="text-[#8B263E] fill-[#8B263E]" />
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">Select Donation Amount (₹)</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-2.5">
                    {["500", "1000", "2500", "5000"].map((val) => {
                      const isSel = amount === val && !customAmount;
                      return (
                        <button
                          type="button"
                          key={val}
                          onClick={() => { setAmount(val); setCustomAmount(""); }}
                          className={`relative py-2.5 px-3 rounded-xl font-bold text-xs transition-all ${
                            isSel ? "bg-[#8B263E] text-white shadow-sm" : "bg-[#fbf9f8] text-gray-800 border border-[#ebe4e1] hover:border-[#8B263E]/40"
                          }`}
                        >
                          ₹{val}
                          {isSel && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#691829] text-white flex items-center justify-center ring-2 ring-white">
                              <Check size={10} strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center rounded-xl border border-gray-200 bg-[#fbf9f8] overflow-hidden focus-within:border-[#8B263E] focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                    <div className="px-3.5 py-2.5 text-gray-400 font-semibold border-r border-gray-200 select-none text-xs">₹</div>
                    <input
                      type="number"
                      placeholder="Enter custom amount"
                      value={customAmount}
                      onChange={(e) => { setCustomAmount(e.target.value); if (e.target.value) setAmount(""); }}
                      className="w-full px-3 py-2 text-xs bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900"
                    />
                  </div>
                </div>

                {/* Personal Details */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <User size={15} className="text-[#8B263E]" />
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">Personal Details</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { icon: <User size={15} />, placeholder: "Full Name *", field: "fullName", type: "text", required: true },
                      { icon: <Mail size={15} />, placeholder: "Email Address *", field: "email", type: "email", required: true },
                      { icon: <Phone size={15} />, placeholder: "Phone Number *", field: "phone", type: "tel", required: true },
                      { icon: <CreditCard size={15} />, placeholder: "PAN Card (optional)", field: "pan", type: "text", required: false },
                    ].map(({ icon, placeholder, field, type, required }) => (
                      <div key={field} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-[#fbf9f8] focus-within:border-[#8B263E] focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                        <span className="text-gray-400 shrink-0">{icon}</span>
                        <input
                          type={type}
                          required={required}
                          placeholder={placeholder}
                          value={(donorForm as any)[field]}
                          onChange={(e) => setDonorForm({ ...donorForm, [field]: e.target.value })}
                          className="w-full text-xs bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <CreditCard size={15} className="text-[#8B263E]" />
                    <h3 className="text-xs sm:text-sm font-bold text-gray-900">Payment Method</h3>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-4">
                    {[
                      { key: "upi", label: "UPI", icon: (
                        <div className="flex items-center gap-0.5 mb-1">
                          <span className="text-[#097939] font-black text-sm italic">/</span>
                          <span className="text-[#ED752E] font-black text-sm italic -ml-1">/</span>
                          <span className="font-extrabold text-xs text-gray-800 ml-0.5">UPI</span>
                        </div>
                      )},
                      { key: "credit", label: "Credit Card", icon: <CreditCard size={20} className="text-gray-700 mb-1" /> },
                      { key: "debit", label: "Debit Card", icon: <CreditCard size={20} className="text-gray-700 mb-1" /> },
                      { key: "netbanking", label: "Net Banking", icon: <Landmark size={20} className="text-gray-700 mb-1" /> },
                    ].map(({ key, label, icon }) => (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setPaymentMethod(key)}
                        className={`relative p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center min-h-[68px] ${
                          paymentMethod === key
                            ? "bg-[#fcf3f4] border-[#8B263E] ring-1 ring-[#8B263E]"
                            : "bg-[#fbf9f8] border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {paymentMethod === key && (
                          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#8B263E] text-white flex items-center justify-center">
                            <Check size={9} strokeWidth={3} />
                          </span>
                        )}
                        {icon}
                        <span className="text-[11px] font-bold text-gray-700">{label}</span>
                      </button>
                    ))}
                  </div>

                  {/* UPI Panel */}
                  {paymentMethod === "upi" && (
                    <div className="bg-[#fbf9f8] border border-gray-200 rounded-2xl p-4 flex flex-col sm:flex-row gap-5 items-center">
                      <div className="flex flex-col items-center shrink-0">
                        <div className="bg-white border-2 border-[#8B263E]/20 rounded-xl p-2.5 shadow-sm">
                          <svg width="110" height="110" viewBox="0 0 128 128" fill="none">
                            <rect width="128" height="128" fill="white"/>
                            <rect x="8" y="8" width="34" height="34" rx="4" fill="#8B263E"/>
                            <rect x="14" y="14" width="22" height="22" rx="2" fill="white"/>
                            <rect x="19" y="19" width="12" height="12" rx="1" fill="#8B263E"/>
                            <rect x="86" y="8" width="34" height="34" rx="4" fill="#8B263E"/>
                            <rect x="92" y="14" width="22" height="22" rx="2" fill="white"/>
                            <rect x="97" y="19" width="12" height="12" rx="1" fill="#8B263E"/>
                            <rect x="8" y="86" width="34" height="34" rx="4" fill="#8B263E"/>
                            <rect x="14" y="92" width="22" height="22" rx="2" fill="white"/>
                            <rect x="19" y="97" width="12" height="12" rx="1" fill="#8B263E"/>
                            <rect x="50" y="8" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="62" y="8" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="50" y="20" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="74" y="8" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="62" y="20" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="50" y="50" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="62" y="62" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="86" y="50" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="98" y="62" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="110" y="50" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="74" y="74" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="86" y="86" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="98" y="98" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="110" y="110" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="50" y="110" width="6" height="6" rx="1" fill="#8B263E"/>
                            <rect x="74" y="98" width="6" height="6" rx="1" fill="#8B263E"/>
                          </svg>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1.5 font-medium">Scan with any UPI app</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          {[
                            { bg: "white", border: true, text: "G", color: "#4285F4" },
                            { bg: "#5f259f", border: false, text: "Pe", color: "white" },
                            { bg: "#002970", border: false, text: "PTM", color: "white" },
                            { bg: "#00529c", border: false, text: "BHIM", color: "white" },
                          ].map((app, i) => (
                            <div
                              key={i}
                              className={`w-7 h-7 rounded-full flex items-center justify-center shadow-sm text-[8px] font-black ${app.border ? "border border-gray-200" : ""}`}
                              style={{ background: app.bg, color: app.color }}
                            >
                              {app.text}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex sm:flex-col items-center gap-1 text-gray-300 self-stretch">
                        <div className="flex-1 h-px sm:h-auto sm:w-px bg-gray-200 w-full" />
                        <span className="text-[10px] font-bold text-gray-400 shrink-0">OR</span>
                        <div className="flex-1 h-px sm:h-auto sm:w-px bg-gray-200 w-full" />
                      </div>
                      <div className="flex-1 w-full space-y-2.5">
                        <p className="text-xs font-bold text-gray-700">Enter UPI ID</p>
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus-within:border-[#8B263E] focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                          <div className="flex items-center gap-0.5 shrink-0">
                            <span className="text-[#097939] font-black text-sm italic">/</span>
                            <span className="text-[#ED752E] font-black text-sm italic -ml-1">/</span>
                          </div>
                          <input type="text" placeholder="yourname@upi" className="w-full text-xs bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900" />
                        </div>
                        <p className="text-[10px] text-gray-400">e.g. 9876543210@gpay or name@paytm</p>
                        <div className="bg-[#f0fdf4] border border-green-100 rounded-xl px-3 py-2 flex items-start gap-2">
                          <ShieldCheck size={13} className="text-green-600 shrink-0 mt-0.5" />
                          <p className="text-[10px] text-green-700 font-medium">100% secure. UPI PIN is never shared.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Card Panel */}
                  {(paymentMethod === "credit" || paymentMethod === "debit") && (
                    <div className="bg-[#fbf9f8] border border-gray-200 rounded-2xl p-4 space-y-3">
                      <div className="relative h-32 rounded-xl overflow-hidden p-4 flex flex-col justify-between shadow-md" style={{ background: "linear-gradient(135deg, #8B263E 0%, #4a0d1f 100%)" }}>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                            <div className="w-6 h-6 rounded-full bg-white/30" />
                            <div className="w-6 h-6 rounded-full bg-white/15 -ml-2.5" />
                          </div>
                          <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest">{paymentMethod === "credit" ? "Credit" : "Debit"}</span>
                        </div>
                        <div>
                          <p className="text-white/50 text-[9px] mb-0.5 tracking-widest">CARD NUMBER</p>
                          <p className="text-white font-mono text-xs tracking-[0.2em]">&bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull;</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-white/50 text-[8px] tracking-widest">CARD HOLDER</p>
                            <p className="text-white text-[10px] font-bold">{donorForm.fullName || "YOUR NAME"}</p>
                          </div>
                          <div>
                            <p className="text-white/50 text-[8px] tracking-widest">EXPIRES</p>
                            <p className="text-white text-[10px] font-bold">MM / YY</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus-within:border-[#8B263E] focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                        <CreditCard size={14} className="text-gray-400 shrink-0" />
                        <input type="text" placeholder="Card Number (16 digits)" maxLength={19} className="w-full text-xs bg-transparent outline-none placeholder:text-gray-400 font-mono text-gray-900 tracking-widest" />
                        <div className="flex gap-1 shrink-0">
                          <div className="w-7 h-4 rounded bg-[#1a1f71] flex items-center justify-center"><span className="text-white text-[7px] font-black italic">VISA</span></div>
                          <div className="w-7 h-4 rounded overflow-hidden flex">
                            <div className="w-1/2 bg-[#eb001b]" /><div className="w-1/2 bg-[#f79e1b]" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus-within:border-[#8B263E] focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                          <input type="text" placeholder="MM / YY" maxLength={5} className="w-full text-xs bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900" />
                        </div>
                        <div className="flex items-center px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus-within:border-[#8B263E] focus-within:ring-2 focus-within:ring-[#8B263E]/10 transition-all">
                          <input type="password" placeholder="CVV" maxLength={4} className="w-full text-xs bg-transparent outline-none placeholder:text-gray-400 font-medium text-gray-900" />
                        </div>
                      </div>
                      <div className="bg-[#f0fdf4] border border-green-100 rounded-xl px-3 py-2 flex items-start gap-2">
                        <ShieldCheck size={13} className="text-green-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-green-700 font-medium">256-bit SSL encrypted. 100% safe and secure.</p>
                      </div>
                    </div>
                  )}

                  {/* Net Banking Panel */}
                  {paymentMethod === "netbanking" && (
                    <div className="bg-[#fbf9f8] border border-gray-200 rounded-2xl p-4 space-y-3">
                      <p className="text-xs font-bold text-gray-700">Select Your Bank</p>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { name: "SBI", color: "#2155a5" }, { name: "HDFC", color: "#004c8f" },
                          { name: "ICICI", color: "#b02a30" }, { name: "Axis", color: "#800000" },
                          { name: "Kotak", color: "#ef4a23" }, { name: "PNB", color: "#e31e24" },
                          { name: "BOB", color: "#f47920" }, { name: "Canara", color: "#0047ab" },
                        ].map((bank) => (
                          <button key={bank.name} type="button" className="flex flex-col items-center gap-1 p-2 rounded-xl border border-gray-200 bg-white hover:border-[#8B263E]/50 hover:shadow-sm transition-all">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[9px] font-black" style={{ background: bank.color }}>{bank.name}</div>
                            <span className="text-[9px] font-bold text-gray-600">{bank.name}</span>
                          </button>
                        ))}
                      </div>
                      <div className="relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-white focus-within:border-[#8B263E] transition-all">
                        <Landmark size={14} className="text-gray-400 shrink-0" />
                        <select className="w-full text-xs bg-transparent outline-none font-medium text-gray-700 appearance-none pr-5">
                          <option value="">-- Other Banks --</option>
                          <option>Union Bank of India</option><option>Indian Bank</option>
                          <option>Yes Bank</option><option>IndusInd Bank</option><option>IDFC First Bank</option>
                        </select>
                        <ChevronDown size={13} className="text-gray-400 pointer-events-none absolute right-3" />
                      </div>
                      <div className="bg-[#f0fdf4] border border-green-100 rounded-xl px-3 py-2 flex items-start gap-2">
                        <ShieldCheck size={13} className="text-green-600 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-green-700 font-medium">You will be redirected to your bank's secure login page.</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Terms */}
                <div>
                  <label className="flex items-center gap-2.5 cursor-pointer text-xs text-gray-700 select-none">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="w-4 h-4 rounded accent-[#8B263E] border-gray-300 cursor-pointer"
                    />
                    <span>
                      I agree to the{" "}
                      <a href="#" className="font-semibold text-gray-900 underline underline-offset-2 hover:text-[#8B263E]">Terms & Conditions</a>
                      {" "}and{" "}
                      <a href="#" className="font-semibold text-gray-900 underline underline-offset-2 hover:text-[#8B263E]">Privacy Policy</a>
                    </span>
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!agreedToTerms}
                  className="w-full bg-[#8B263E] hover:bg-[#761c31] text-white font-bold py-3.5 px-6 rounded-2xl shadow-lg shadow-[#8B263E]/25 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ShieldCheck size={18} className="text-white" />
                  <span>Proceed to Pay ₹{customAmount || amount || "1000"}</span>
                  <ArrowRight size={16} />
                </button>

                <div className="text-center pb-1">
                  <div className="flex items-center justify-center gap-2.5 mb-1">
                    <div className="h-px w-12 bg-gray-200" />
                    <span className="text-[#8B263E] text-xs">♥</span>
                    <div className="h-px w-12 bg-gray-200" />
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">Together we can make a difference ♡</p>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

