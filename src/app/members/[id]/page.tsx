"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Users, MapPin, Briefcase, GraduationCap, Mail, Phone,
  Linkedin, Globe, ArrowLeft, CheckCircle2, Calendar,
  Building2, Award, Facebook, Twitter, Instagram, Youtube, Send,
  UserPlus
} from "lucide-react";
import { Header } from "@/components/Header";
import { useAlumniMembers } from "@/lib/alumniStore";
import "../../dashboard.css";

const getLinkedInUrl = (url: string) => {
  if (!url) return "#";
  return url.startsWith("http") ? url : `https://${url}`;
};

const AVATAR_COLORS = [
  "#9B2335", "#2563eb", "#059669", "#7c3aed", "#d97706", "#0891b2", "#be185d", "#374151"
];

function AvatarLarge({ name, colorIndex }: { name: string; colorIndex: number }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="w-full h-full rounded-full flex items-center justify-center text-white font-extrabold text-5xl select-none"
      style={{ background: AVATAR_COLORS[Math.abs(colorIndex) % AVATAR_COLORS.length] }}
    >
      {initials || "AL"}
    </div>
  );
}

export default function MemberProfilePage() {
  const params = useParams();
  const id = Number(params?.id);
  const { members, isLoaded } = useAlumniMembers();

  const member = members.find((m) => m.id === id);

  if (!isLoaded) {
    return (
      <div className="dashboard-body min-h-screen flex items-center justify-center" style={{ background: "#faf8f8" }}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-[#9B2335] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-gray-500">Loading alumni profile...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="dashboard-body min-h-screen flex items-center justify-center" style={{ background: "#faf8f8" }}>
        <div className="text-center p-8 bg-white rounded-3xl shadow-sm border border-gray-200">
          <Users size={40} className="mx-auto mb-3 text-gray-400 opacity-40" />
          <p className="text-xl font-bold text-gray-800 mb-2">Member not found</p>
          <p className="text-xs text-gray-500 mb-5 max-w-xs">
            The alumni profile you are looking for does not exist or may have been removed.
          </p>
          <Link href="/members" className="btn-maroon px-6 py-2.5 text-xs inline-block">
            Back to Members Directory
          </Link>
        </div>
      </div>
    );
  }

  const roleText = member.role || "Alumni Member";
  const skillsList = member.skills && member.skills.length > 0 ? member.skills : ["Engineering", "Leadership", "Technology"];
  const achievementsList = member.achievements && member.achievements.length > 0
    ? member.achievements
    : ["Tolani Alumni Community Member", "Verified Graduate"];

  return (
    <div className="dashboard-body min-h-screen" style={{ overflowY: "auto", overflowX: "hidden", background: "#faf8f8" }}>
      {/* ── Navbar ── */}
      <Header activePage="members" />

      {/* ── Top Bar ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 flex items-center justify-between">
        <Link
          href="/members"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#9B2335] transition-colors"
        >
          <ArrowLeft size={16} /> Back to Members
        </Link>

        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9B2335] bg-rose-50 hover:bg-rose-100 px-3.5 py-1.5 rounded-xl transition-colors cursor-pointer"
        >
          <UserPlus size={14} /> Invite New Alumni
        </button>
      </div>

      {/* ── Profile Card ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden" style={{ border: "1.5px solid #f0e8e4" }}>
          {/* Cover */}
          <div
            className="h-36 w-full relative"
            style={{ background: "linear-gradient(135deg, #9B2335 0%, #c0586a 50%, #f0a0af 100%)" }}
          >
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Profile Info Row */}
          <div className="px-6 sm:px-10 pb-8">
            {/* Avatar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-14 mb-6">
              <div className="relative">
                <div className="w-28 h-28 rounded-full ring-4 ring-white shadow-xl overflow-hidden">
                  <AvatarLarge name={member.name} colorIndex={member.id - 1} />
                </div>
                {member.verified && (
                  <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow">
                    <CheckCircle2 size={20} style={{ color: "#22c55e" }} fill="#22c55e" />
                  </div>
                )}
              </div>

              <div className="flex-1 pt-3 sm:pt-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h1 className="text-2xl font-extrabold text-gray-900">{member.name}</h1>
                    <p className="text-sm text-gray-500 font-medium">
                      {roleText} at <span className="font-bold" style={{ color: "#9B2335" }}>{member.company}</span>
                    </p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto pt-1 sm:pt-0">
                    <a
                      href={getLinkedInUrl(member.linkedin)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-maroon flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 text-sm"
                    >
                      <Linkedin size={14} /> Connect
                    </a>
                    <a
                      href={getLinkedInUrl(member.linkedin)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl border transition-all hover:bg-gray-50"
                      style={{ borderColor: "#e5e7eb", color: "#374151" }}
                    >
                      <Linkedin size={14} /> LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Details */}
            <div
              className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 p-4 rounded-2xl"
              style={{ background: "#faf8f8", border: "1px solid #f0e8e4" }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2" }}>
                  <GraduationCap size={15} style={{ color: "#9B2335" }} />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Degree</div>
                  <div className="text-xs font-bold text-gray-800">{member.degree} · {member.year}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2" }}>
                  <Building2 size={15} style={{ color: "#9B2335" }} />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Department</div>
                  <div className="text-xs font-bold text-gray-800 truncate max-w-[150px]">{member.dept}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2" }}>
                  <MapPin size={15} style={{ color: "#9B2335" }} />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Location</div>
                  <div className="text-xs font-bold text-gray-800 truncate max-w-[150px]">{member.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2" }}>
                  <Briefcase size={15} style={{ color: "#9B2335" }} />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Company</div>
                  <div className="text-xs font-bold text-gray-800 truncate max-w-[150px]">{member.company}</div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Bio + Skills + Achievements */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <div className="p-5 rounded-2xl" style={{ border: "1.5px solid #f0e8e4" }}>
                  <h2 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                    <Users size={15} style={{ color: "#9B2335" }} /> About
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {member.bio || `Alumni of Tolani Institute, working as ${roleText} at ${member.company}.`}
                  </p>
                </div>

                {/* Skills */}
                <div className="p-5 rounded-2xl" style={{ border: "1.5px solid #f0e8e4" }}>
                  <h2 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                    <Globe size={15} style={{ color: "#9B2335" }} /> Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {skillsList.map((s, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-full text-xs font-bold shadow-sm"
                        style={{ background: "#fef0f2", color: "#9B2335", border: "1px solid #fcdde1" }}
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Achievements */}
                <div className="p-5 rounded-2xl" style={{ border: "1.5px solid #f0e8e4" }}>
                  <h2 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                    <Award size={15} style={{ color: "#9B2335" }} /> Achievements
                  </h2>
                  <ul className="space-y-2">
                    {achievementsList.map((a, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={14} style={{ color: "#22c55e" }} className="shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Contact & Info */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl" style={{ border: "1.5px solid #f0e8e4" }}>
                  <h2 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <Mail size={15} style={{ color: "#9B2335" }} /> Contact Info
                  </h2>
                  <div className="space-y-3">
                    {member.email && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2" }}>
                          <Mail size={13} style={{ color: "#9B2335" }} />
                        </div>
                        <a href={`mailto:${member.email}`} className="text-xs text-gray-600 hover:text-[#9B2335] transition-colors break-all">
                          {member.email}
                        </a>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2" }}>
                          <Phone size={13} style={{ color: "#9B2335" }} />
                        </div>
                        <span className="text-xs text-gray-600">{member.phone}</span>
                      </div>
                    )}
                    {member.linkedin && (
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2" }}>
                          <Linkedin size={13} style={{ color: "#9B2335" }} />
                        </div>
                        <a
                          href={getLinkedInUrl(member.linkedin)}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-gray-600 hover:text-[#9B2335] transition-colors truncate max-w-[190px]"
                        >
                          {member.linkedin}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Graduation */}
                <div className="p-5 rounded-2xl" style={{ border: "1.5px solid #f0e8e4" }}>
                  <h2 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar size={15} style={{ color: "#9B2335" }} /> Education
                  </h2>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#fef0f2" }}>
                      <GraduationCap size={16} style={{ color: "#9B2335" }} />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-gray-900">
                        {member.institute || "Tolani F. & Polytechnic"}
                      </p>
                      <p className="text-[11px] text-gray-500">{member.degree} in {member.dept}</p>
                      <p className="text-[11px] text-gray-400">Batch of {member.year}</p>
                    </div>
                  </div>
                </div>

                {/* Mutual Section */}
                <div
                  className="p-5 rounded-2xl text-center"
                  style={{ background: "linear-gradient(135deg, #fef0f2, #fff5f5)", border: "1.5px solid #f9c7cc" }}
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: "#9B2335" }}>
                    <Users size={18} className="text-white" />
                  </div>
                  <p className="text-sm font-extrabold text-gray-900 mb-1">Part of Alumni Network</p>
                  <p className="text-[11px] text-gray-500 mb-3">Verified Tolani alumni member since {member.year}</p>
                  <a href={`mailto:${member.email || "alumni@tolani.ac.in"}`} className="inline-block btn-maroon px-4 py-2 text-xs w-full text-center">
                    Send Message
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Members */}
        <div className="mt-8">
          <h2 className="text-lg font-extrabold text-gray-900 mb-5">Other Members You May Know</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {members
              .filter((m) => m.id !== member.id)
              .slice(0, 4)
              .map((m) => (
                <Link
                  key={m.id}
                  href={`/members/${m.id}`}
                  className="bg-white rounded-2xl p-4 flex flex-col items-center text-center transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ border: "1.5px solid #f0e8e4" }}
                >
                  <div className="w-14 h-14 rounded-full overflow-hidden mb-2 shadow-sm">
                    <AvatarLarge name={m.name} colorIndex={m.id - 1} />
                  </div>
                  <p className="text-xs font-extrabold text-gray-900 truncate w-full">{m.name}</p>
                  <p className="text-[10px] text-gray-400 truncate w-full">{m.company}</p>
                </Link>
              ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="footer-dark pt-12 pb-0 mt-10">
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
              {["Members", "Jobs & Internships", "Events", "Gallery", "Contact Us"].map((l) => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Resources</h4>
              {["News Corner", "Success Stories", "Mentorship", "Batchmates", "Help & Support"].map((l) => (
                <a key={l} href="#" className="block text-[12px] text-gray-400 hover:text-white mb-2 transition-colors">{l}</a>
              ))}
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Support</h4>
              {["FAQs", "Privacy Policy", "Terms of Use"].map((l) => (
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
