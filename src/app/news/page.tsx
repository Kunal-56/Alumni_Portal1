"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronRight, Search, Newspaper,
  Send, Facebook, Linkedin, Twitter,
  Instagram, Youtube, ArrowUp, Clock, X, User, Calendar, BookOpen
} from "lucide-react";
import { Header } from "@/components/Header";
import "@/app/dashboard.css";

interface NewsItem {
  title: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
  excerpt: string;
  img: string;
  featured?: boolean;
}

const ALL_NEWS: NewsItem[] = [
  {
    title: "Tolani Alumni Association – Dar es Salaam, Tanzania Alumni Reunion 2026–27",
    date: "Aug 05, 2026",
    category: "Reunion",
    author: "Alumni Relations Team",
    readTime: "3 min read",
    excerpt: "The Tolani Alumni Association successfully organized a grand reunion in Dar es Salaam, Tanzania, bringing together over 200 alumni from East Africa. The event was a celebration of shared memories, professional achievements and the enduring bonds of the Tolani community.",
    img: "/campus-building.png",
    featured: true
  },
  {
    title: "Building a Stronger Alumni Community: Northeast Chapters Virtual Reunion",
    date: "Aug 03, 2026",
    category: "Community",
    author: "Chapter Coordinators",
    readTime: "4 min read",
    excerpt: "Alumni from the Northeast chapters of India gathered virtually for an emotional and inspiring reunion. The event featured panel discussions, networking breakout rooms and a heartfelt tribute to faculty members.",
    img: "/campus-building.png",
    featured: true
  },
  {
    title: "Strengthening Connections: Virtual Alumni Reunion for Jharkhand, Chhattisgarh, Odisha & Madhya Pradesh",
    date: "Jul 31, 2026",
    category: "Reunion",
    author: "Regional Chapter Team",
    readTime: "2 min read",
    excerpt: "A landmark virtual reunion brought together alumni from four central Indian states, fostering regional bonds and new professional collaborations.",
    img: "/campus-building.png",
    featured: true
  },
  {
    title: "Tolani Alumni Entrepreneur Raises ₹50 Crore in Series B Funding",
    date: "Jul 25, 2026",
    category: "Success Story",
    author: "Alumni Portal Editorial",
    readTime: "5 min read",
    excerpt: "Batch 2018 alumnus Mr. Harsh Mehta's EdTech startup secured ₹50 crore in Series B funding from leading venture capital firms. His journey from a Tolani student to a successful entrepreneur is an inspiration to thousands.",
    img: "/campus-building.png"
  },
  {
    title: "New Mentorship Program Connects 500+ Alumni with Current Students",
    date: "Jul 20, 2026",
    category: "Programs",
    author: "Mentorship Cell",
    readTime: "3 min read",
    excerpt: "The Alumni Mentorship Program 2026 launched with a record 500+ alumni volunteers mentoring final-year students across all departments, providing career guidance, technical coaching and industry insights.",
    img: "/campus-building.png"
  },
  {
    title: "Tolani Polytechnic Ranks in Top 50 Polytechnics of India 2026",
    date: "Jul 15, 2026",
    category: "Achievement",
    author: "College Relations",
    readTime: "2 min read",
    excerpt: "Tolani Foundation Group of Institutes has been ranked among the Top 50 Polytechnic Institutions of India in 2026, a recognition that reflects the hard work of students, faculty and the entire alumni community.",
    img: "/campus-building.png"
  },
  {
    title: "Civil Department Alumni Lead Major Infrastructure Project in Gujarat",
    date: "Jul 10, 2026",
    category: "Department News",
    author: "Civil Dept. Alumni Cell",
    readTime: "4 min read",
    excerpt: "A team of five Civil Department alumni is leading the engineering and project management of a ₹200 crore highway expansion project in Gujarat, putting Tolani's engineering education on the national map.",
    img: "/campus-building.png"
  },
  {
    title: "Annual Alumni Scholarship Program Opens Applications for 2026-27",
    date: "Jul 05, 2026",
    category: "Scholarship",
    author: "Alumni Foundation",
    readTime: "3 min read",
    excerpt: "The Tolani Alumni Scholarship Program is now accepting applications for the 2026-27 academic year. Alumni contributions have funded 150+ scholarships worth ₹2 crore to deserving students over the past five years.",
    img: "/campus-building.png"
  },
  {
    title: "CDDM Alumni Showcased at International Fashion Week, Milan",
    date: "Jun 28, 2026",
    category: "Achievement",
    author: "CDDM Alumni Cell",
    readTime: "3 min read",
    excerpt: "Three CDDM Department alumni presented their original collections at the prestigious Milan Fashion Week 2026, putting Tolani's creative education program in the international spotlight.",
    img: "/campus-building.png"
  },
  {
    title: "Electrical Department Alumni Contribute to National Smart Grid Initiative",
    date: "Jun 20, 2026",
    category: "Department News",
    author: "Electrical Dept. Alumni Cell",
    readTime: "4 min read",
    excerpt: "Eight Electrical Department alumni are key contributors to India's ambitious National Smart Grid Mission, developing AI-powered power management systems for the Ministry of Power.",
    img: "/campus-building.png"
  },
  {
    title: "Tolani Alumni Job Portal Crosses 1,000+ Active Listings Milestone",
    date: "Jun 15, 2026",
    category: "Platform Update",
    author: "Alumni Portal Team",
    readTime: "2 min read",
    excerpt: "The Tolani Alumni Job Portal has crossed a major milestone with over 1,000 active job listings posted by alumni employers, providing exclusive opportunities to fellow graduates.",
    img: "/campus-building.png"
  },
  {
    title: "Mechanical Department Alumni Collaborate on EV Startup",
    date: "Jun 08, 2026",
    category: "Success Story",
    author: "Mechanical Alumni Cell",
    readTime: "5 min read",
    excerpt: "A group of five Mechanical Department alumni co-founded an Electric Vehicle component startup that recently received a Letter of Intent from a leading two-wheeler manufacturer.",
    img: "/campus-building.png"
  },
];

const CATEGORIES = ["All", "Reunion", "Community", "Success Story", "Programs", "Achievement", "Department News", "Scholarship", "Platform Update"];

/* ──────────────────────────────────────
   News Detail Modal Component
────────────────────────────────────── */
function NewsModal({ news, onClose }: { news: NewsItem; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Animate in on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  // Lock body/dashboard scroll while modal open
  useEffect(() => {
    const dashBody = document.querySelector(".dashboard-body") as HTMLElement | null;
    if (dashBody) dashBody.style.overflow = "hidden";
    return () => { if (dashBody) dashBody.style.overflow = ""; };
  }, []);

  // Escape key closes modal
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  });

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      handleClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-8"
      style={{
        background: visible ? "rgba(0,0,0,0.52)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(5px)" : "blur(0px)",
        WebkitBackdropFilter: visible ? "blur(5px)" : "blur(0px)",
        transition: "background 0.28s ease, backdrop-filter 0.28s ease",
      }}
      onClick={handleBackdropClick}
    >
      <div
        ref={modalRef}
        className="modal-scroll bg-white rounded-3xl shadow-2xl relative w-full"
        style={{
          maxWidth: 680,
          maxHeight: "88vh",
          overflowY: "auto",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0px)" : "scale(0.92) translateY(22px)",
          transition: "opacity 0.28s cubic-bezier(0.4,0,0.2,1), transform 0.28s cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* Hero Image */}
        <div className="relative h-52 sm:h-64 w-full rounded-t-3xl overflow-hidden bg-gray-100 shrink-0">
          <Image src={news.img} alt={news.title} fill className="object-cover" unoptimized />
          {/* Gradient */}
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.48) 0%, rgba(0,0,0,0) 55%)" }}
          />
          {/* Category badge */}
          <span
            className="absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-lg text-white tracking-wide"
            style={{ background: "#9B2335" }}
          >
            {news.category}
          </span>
          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Close article"
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/65 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Article Content */}
        <div className="p-6 sm:p-8">
          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400 font-medium mb-4">
            <span className="flex items-center gap-1.5">
              <User size={12} className="text-[#9B2335]" />
              {news.author}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-[#9B2335]" />
              {news.date}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen size={12} className="text-[#9B2335]" />
              {news.readTime}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug mb-4">
            {news.title}
          </h2>

          {/* Maroon accent divider */}
          <div className="w-10 h-[3px] rounded-full mb-5" style={{ background: "#9B2335" }} />

          {/* Full article body */}
          <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
            <p>{news.excerpt}</p>
            <p>
              This achievement continues to build upon Tolani Foundation Gandhidham Polytechnic&apos;s long-standing
              tradition of nurturing professionals who go on to make a significant impact in their respective fields
              across the globe. The alumni community has continued to grow stronger with each passing year, supporting
              both current students and fellow graduates in their journeys.
            </p>
            <p>
              The institute&apos;s Alumni Relations Cell continues to facilitate such milestones and remains committed
              to keeping the Tolani alumni network vibrant, connected and impactful. Further updates will be shared
              through the official alumni portal and newsletter.
            </p>
          </div>

          {/* Footer row */}
          <div className="mt-7 pt-5 border-t border-gray-100 flex items-center justify-between gap-3 flex-wrap">
            <span className="text-[11px] font-semibold text-gray-400">
              Tolani Alumni Portal &middot; Official News
            </span>
            <button
              onClick={handleClose}
              className="btn-maroon px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <X size={13} /> Close Article
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────
   Main News Page
────────────────────────────────────── */
export default function NewsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showTop, setShowTop] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const open = (n: NewsItem) => setSelectedNews(n);

  const filtered = ALL_NEWS.filter(n => {
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      n.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "All" || n.category === activeCategory;
    return matchSearch && matchCat;
  });

  const featured = filtered.filter(n => n.featured);
  const regular = filtered.filter(n => !n.featured);

  return (
    <div
      className="dashboard-body min-h-screen"
      style={{ overflowY: "auto", overflowX: "hidden", background: "#fafafa" }}
      onScroll={(e) => setShowTop((e.currentTarget.scrollTop ?? 0) > 300)}
    >
      <Header activePage="news" />

      {/* ── Page Hero Banner ── */}
      <section className="relative overflow-hidden bg-white">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center gap-2 text-gray-500 text-xs font-semibold mb-3">
            <Link href="/" className="hover:text-[#9B2335] transition-colors">Home</Link>
            <ChevronRight size={13} />
            <span className="text-gray-900">News & Updates</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight mb-3">
            News &amp; Updates
          </h1>
          <p className="text-gray-600 text-sm sm:text-base font-medium max-w-xl">
            Stay informed with the latest news, success stories, announcements and updates from the Tolani alumni community.
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
              placeholder="Search news by title, category or keywords..."
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
              className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer"
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
            <h2 className="text-xl font-extrabold text-gray-900">Latest News</h2>
            <div className="section-underline" style={{ margin: "5px 0 0", marginLeft: "0" }} />
          </div>
          <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-full">
            {filtered.length} article{filtered.length !== 1 ? "s" : ""} found
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 font-semibold text-sm">No news articles found matching your search.</p>
          </div>
        ) : (
          <>
            {/* Featured Articles - Large Cards */}
            {featured.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {featured.map((n, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-xs hover:shadow-md transition-all group cursor-pointer"
                    onClick={() => open(n)}
                  >
                    <div className="relative h-48 bg-gray-100">
                      <Image src={n.img} alt={n.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow-md" style={{ background: "#9B2335", color: "white" }}>
                          {n.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-sm font-extrabold text-gray-900 leading-snug mb-2 group-hover:text-[#9B2335] transition-colors line-clamp-2">
                        {n.title}
                      </h3>
                      <p className="text-[12px] text-gray-500 leading-relaxed mb-4 line-clamp-3">{n.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-[11px] text-gray-400 font-medium">
                          <span className="flex items-center gap-1"><Clock size={11} /> {n.readTime}</span>
                          <span>{n.date}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); open(n); }}
                          className="text-[11px] font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                          style={{ color: "#9B2335" }}
                        >
                          Read <ChevronRight size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Divider */}
            {featured.length > 0 && regular.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs font-bold text-gray-400 px-2">More Stories</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
            )}

            {/* Regular Articles - List Style */}
            {regular.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {regular.map((n, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-4 border border-gray-100 shadow-xs hover:shadow-md transition-all group cursor-pointer flex gap-4"
                    onClick={() => open(n)}
                  >
                    <div className="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-gray-100">
                      <Image src={n.img} alt={n.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" unoptimized />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: "#fef0f2", color: "#9B2335", border: "1px solid #f8d7db" }}>
                          {n.category}
                        </span>
                      </div>
                      <h3 className="text-xs font-extrabold text-gray-900 leading-snug mb-1 group-hover:text-[#9B2335] transition-colors line-clamp-2">
                        {n.title}
                      </h3>
                      <p className="text-[11px] text-gray-500 line-clamp-1 flex-1">{n.excerpt}</p>
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400 font-medium">
                        <span className="flex items-center gap-1"><Clock size={10} /> {n.readTime}</span>
                        <span>{n.date}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); open(n); }}
                          className="ml-auto text-[10px] font-bold flex items-center gap-0.5 hover:underline cursor-pointer"
                          style={{ color: "#9B2335" }}
                        >
                          Read More <ChevronRight size={11} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
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
                <button className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 cursor-pointer" style={{ background: "#9B2335" }}>
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
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg z-50 transition-all cursor-pointer"
          style={{ background: "#9B2335" }}
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* ── News Detail Modal ── */}
      {selectedNews && (
        <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />
      )}
    </div>
  );
}
