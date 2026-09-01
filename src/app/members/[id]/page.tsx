"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Users, MapPin, Briefcase, GraduationCap, Mail, Phone,
  Linkedin, Globe, ArrowLeft, CheckCircle2, Calendar,
  Building2, Award, Facebook, Twitter, Instagram, Youtube, Send
} from "lucide-react";
import { Header } from "@/components/Header";
import "../../dashboard.css";

/* ─── Member Data (same as members page) ─── */
const ALL_MEMBERS = [
  { id: 1, name: "Daksh Ahir", degree: "B.Tech", year: "2025", dept: "CSE", company: "Google", role: "Software Engineer", location: "Bangalore, India", email: "daksh.ahir@alumni.tolani.ac.in", phone: "+91 98765 43210", linkedin: "www.linkedin.com/in/daksh-ahir-759a863a7/", bio: "Passionate software engineer at Google, working on large-scale distributed systems. Former gold medalist at Tolani. Love open-source contributions and community building.", skills: ["React", "Node.js", "Python", "Cloud", "Kubernetes"], achievements: ["Dean's List 2024–25", "Best Project Award 2025", "Smart India Hackathon Winner"], verified: true },
  { id: 2, name: "Kunal Solanki", degree: "B.Tech", year: "2024", dept: "CSE", company: "Microsoft", role: "Product Manager", location: "Hyderabad, India", email: "kunal.solanki@alumni.tolani.ac.in", phone: "+91 87654 32109", linkedin: "https://www.linkedin.com/in/kunal-solanki-3093613a8/", bio: "Product Manager at Microsoft Azure, driving cloud innovation. Alumni mentor and startup advisor.", skills: ["Product Strategy", "Agile", "Azure", "Data Analytics", "Leadership"], achievements: ["Microsoft Rising Star 2025", "Alumni Mentor of the Year"], verified: true },
  { id: 3, name: "Khushal Bhatiya", degree: "BA (J&MC)", year: "2026", dept: "Journalism", company: "Zomato", role: "Content Strategist", location: "Gurugram, India", email: "khushal.bhatiya@alumni.tolani.ac.in", phone: "+91 76543 21098", linkedin: "https://www.linkedin.com/in/khushal-bhatiya-33864942b/", bio: "Content Strategist at Zomato, crafting brand narratives. Passionate about digital media and creative storytelling.", skills: ["Content Strategy", "SEO", "Social Media", "Brand Writing", "Analytics"], achievements: ["Best Journalist Award 2026", "Editor, Tolani Times"], verified: true },
  { id: 4, name: "Raghav Rathod", degree: "BBA", year: "2026", dept: "Business", company: "Deloitte", role: "Business Analyst", location: "Mumbai, India", email: "raghav.rathod@alumni.tolani.ac.in", phone: "+91 65432 10987", linkedin: "https://www.linkedin.com/in/raghav-rathod-6b7945402/", bio: "Business Analyst at Deloitte Consulting. Expert in financial modelling and digital transformation.", skills: ["Financial Modelling", "Consulting", "Excel", "Power BI", "Strategy"], achievements: ["Deloitte Rising Talent 2026", "CFA Level 1"], verified: true },
  { id: 5, name: "Bhoomi Sumbad", degree: "B.Tech", year: "2026", dept: "CSE", company: "Amazon", role: "SDE II", location: "Chennai, India", email: "bhoomi.sumbad@alumni.tolani.ac.in", phone: "+91 54321 09876", linkedin: "https://www.linkedin.com/in/bhoomi-sumbad-1131683ba/", bio: "Software Development Engineer at Amazon Web Services. Backend systems enthusiast and competitive programmer.", skills: ["Java", "AWS", "System Design", "Microservices", "DSA"], achievements: ["Amazon Star Performer Q2 2026", "Open Source Contributor"], verified: true },
  { id: 6, name: "Dev Goswami", degree: "BA (J&MC)", year: "2020", dept: "Journalism", company: "Times Of India", role: "Senior Reporter", location: "Kolkata, India", email: "dev.gouswami@alumni.tolani.ac.in", phone: "+91 43210 98765", linkedin: "https://www.linkedin.com/in/dev-goswami-61467b2b9/", bio: "Senior Reporter at Times of India covering politics, culture and social affairs.", skills: ["Investigative Journalism", "Reporting", "Editing", "Video Production"], achievements: ["Press Club Award 2024", "Tolani Distinguished Alumnus"], verified: true },
  { id: 7, name: "Parth Pitroda", degree: "B.Tech", year: "2023", dept: "IT", company: "Infosys", role: "Tech Lead", location: "Pune, India", email: "parth.pitroda@alumni.tolani.ac.in", phone: "+91 32109 87654", linkedin: "https://www.linkedin.com/in/parth-pitroda1/", bio: "Tech Lead at Infosys managing enterprise application development. Passionate about clean code and agile methodologies.", skills: ["Java EE", "Spring Boot", "Docker", "CI/CD", "Oracle DB"], achievements: ["Infosys Insta Award 2025", "Certified Scrum Master"], verified: true },
  { id: 8, name: "Solanki Yashvi", degree: "BBA", year: "2021", dept: "Business", company: "Accenture", role: "Management Consultant", location: "Noida, India", email: "yashvi.solanki@alumni.tolani.ac.in", phone: "+91 21098 76543", linkedin: "https://www.linkedin.com/in/yashvi-solanki-b2546a412/", bio: "Management Consultant at Accenture Strategy. Specialist in digital transformation and ERP implementations.", skills: ["Management Consulting", "SAP", "Change Management", "ERP", "PMO"], achievements: ["Accenture ACE Award 2024", "Tolani Top 10 Graduates"], verified: true },
  { id: 9, name: "Priya Nair", degree: "B.Tech", year: "2022", dept: "ECE", company: "TCS", role: "Embedded Engineer", location: "Kochi, India", email: "priya.nair@alumni.tolani.ac.in", phone: "+91 91234 56789", linkedin: "linkedin.com/in/priyanair", bio: "Embedded systems engineer working on IoT devices at TCS Innovation Labs. Robotics enthusiast and IEEE volunteer.", skills: ["Embedded C", "RTOS", "IoT", "PCB Design", "ARM Cortex"], achievements: ["TCS Star of the Month", "IEEE Best Paper Award", "Robotics Club Founder"], verified: true },
  { id: 10, name: "Vikram Tiwari", degree: "M.Tech", year: "2021", dept: "CSE", company: "Wipro", role: "Senior Architect", location: "Bhopal, India", email: "vikram.tiwari@alumni.tolani.ac.in", phone: "+91 82345 67890", linkedin: "linkedin.com/in/vikramtiwari", bio: "Senior Solution Architect at Wipro. Specializes in enterprise cloud migrations and DevOps transformations. Guest faculty at Tolani.", skills: ["Cloud Architecture", "DevOps", "Terraform", "Azure", "Solution Design"], achievements: ["Wipro Pinnacle Award", "Guest Faculty Tolani 2024", "AWS Certified Architect"], verified: true },
  { id: 11, name: "Meera Joshi", degree: "B.Tech", year: "2020", dept: "IT", company: "HCL", role: "Data Scientist", location: "Delhi, India", email: "meera.joshi@alumni.tolani.ac.in", phone: "+91 73456 78901", linkedin: "linkedin.com/in/meerajoshi", bio: "Data Scientist at HCL Analytics building ML models for financial predictions. Kaggle expert. Published researcher in AI ethics.", skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Data Visualization"], achievements: ["Kaggle Expert Badge", "HCL Excellence Award", "Published AI Research Paper"], verified: true },
  { id: 12, name: "Aarav Singh", degree: "BBA", year: "2023", dept: "Business", company: "KPMG", role: "Audit Associate", location: "Ahmedabad, India", email: "aarav.singh@alumni.tolani.ac.in", phone: "+91 64567 89012", linkedin: "linkedin.com/in/aaravsingh", bio: "Audit Associate at KPMG India. Specialist in statutory audit and risk advisory. CA finalist and passionate about financial literacy.", skills: ["Audit", "Risk Advisory", "IFRS", "Financial Analysis", "Compliance"], achievements: ["KPMG Future Leader 2024", "CA Finalist", "NSC Gold Medal"], verified: true },
  { id: 13, name: "Divya Patel", degree: "B.Tech", year: "2024", dept: "CSE", company: "Flipkart", role: "Full Stack Developer", location: "Surat, India", email: "divya.patel@alumni.tolani.ac.in", phone: "+91 55678 90123", linkedin: "linkedin.com/in/divyapatel", bio: "Full Stack Developer at Flipkart building scalable e-commerce solutions. React & Node specialist. Women in Tech community organizer.", skills: ["React", "Node.js", "MongoDB", "GraphQL", "TypeScript"], achievements: ["Flipkart Spark Award", "Women in Tech Lead", "HackWithIndia Winner"], verified: true },
  { id: 14, name: "Rahul Verma", degree: "MBA", year: "2022", dept: "Management", company: "HDFC Bank", role: "Branch Manager", location: "Jaipur, India", email: "rahul.verma@alumni.tolani.ac.in", phone: "+91 46789 01234", linkedin: "linkedin.com/in/rahulverma", bio: "Branch Manager at HDFC Bank. Expert in retail banking and wealth management. Youngest branch manager in Rajasthan region.", skills: ["Banking", "Wealth Management", "CRM", "Team Leadership", "Risk Management"], achievements: ["HDFC Fastest Growth Award", "Youngest Branch Manager", "MBA Gold Medal"], verified: true },
  { id: 15, name: "Tanvi Desai", degree: "B.Tech", year: "2021", dept: "Mechanical", company: "Tata Motors", role: "Design Engineer", location: "Vadodara, India", email: "tanvi.desai@alumni.tolani.ac.in", phone: "+91 37890 12345", linkedin: "linkedin.com/in/tanvidesai", bio: "Automotive Design Engineer at Tata Motors, working on next-gen EV platforms. CAD specialist and sustainability advocate.", skills: ["CAD/CAM", "SolidWorks", "ANSYS", "EV Systems", "GD&T"], achievements: ["Tata Innovator Award 2024", "Best Design Thesis 2021", "SAE India Member"], verified: true },
  { id: 16, name: "Karan Malhotra", degree: "B.Tech", year: "2025", dept: "Civil", company: "L&T", role: "Project Engineer", location: "Chandigarh, India", email: "karan.malhotra@alumni.tolani.ac.in", phone: "+91 28901 23456", linkedin: "linkedin.com/in/karanmalhotra", bio: "Project Engineer at L&T Construction managing large-scale infrastructure projects. Structural analysis expert and green building advocate.", skills: ["AutoCAD", "STAAD Pro", "Project Management", "Structural Analysis", "MS Project"], achievements: ["L&T Star Performer 2025", "Best Civil Graduate 2025", "LEED Green Associate"], verified: true },
];

const getLinkedInUrl = (url: string) => url.startsWith("http") ? url : `https://${url}`;

const AVATAR_COLORS = [
  "#9B2335", "#2563eb", "#059669", "#7c3aed", "#d97706", "#0891b2", "#be185d", "#374151"
];

function AvatarLarge({ name, colorIndex }: { name: string; colorIndex: number }) {
  const initials = name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      className="w-full h-full rounded-full flex items-center justify-center text-white font-extrabold text-5xl"
      style={{ background: AVATAR_COLORS[colorIndex % AVATAR_COLORS.length] }}
    >
      {initials}
    </div>
  );
}

export default function MemberProfilePage() {
  const params = useParams();
  const id = Number(params.id);
  const member = ALL_MEMBERS.find(m => m.id === id);

  if (!member) {
    return (
      <div className="dashboard-body min-h-screen flex items-center justify-center" style={{ background: "#faf8f8" }}>
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-400 mb-4">Member not found</p>
          <Link href="/members" className="btn-maroon px-6 py-2.5 text-sm">Back to Members</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-body min-h-screen" style={{ overflowY: "auto", overflowX: "hidden", background: "#faf8f8" }}>

      {/* ── Navbar ── */}
      <Header activePage="members" />

      {/* ── Back Button ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        <Link href="/members" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#9B2335] transition-colors">
          <ArrowLeft size={16} /> Back to Members
        </Link>
      </div>

      {/* ── Profile Card ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden" style={{ border: "1.5px solid #f0e8e4" }}>

          {/* Cover */}
          <div
            className="h-36 w-full relative"
            style={{ background: "linear-gradient(135deg, #9B2335 0%, #c0586a 50%, #f0a0af 100%)" }}
          >
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
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
                    <p className="text-sm text-gray-500 font-medium">{member.role} at <span className="font-bold" style={{ color: "#9B2335" }}>{member.company}</span></p>
                  </div>
                  <div className="flex gap-2 w-full sm:w-auto pt-1 sm:pt-0">
                    <a href={getLinkedInUrl(member.linkedin)} target="_blank" rel="noreferrer" className="btn-maroon flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 text-sm">
                      <Linkedin size={14} /> Connect
                    </a>
                    <a href={getLinkedInUrl(member.linkedin)} target="_blank" rel="noreferrer"
                      className="flex-1 sm:flex-none justify-center flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl border transition-all hover:bg-gray-50"
                      style={{ borderColor: "#e5e7eb", color: "#374151" }}>
                      <Linkedin size={14} /> LinkedIn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Details */}
            <div className="grid grid-cols-1 min-[420px]:grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8 p-4 rounded-2xl" style={{ background: "#faf8f8", border: "1px solid #f0e8e4" }}>
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
                  <div className="text-xs font-bold text-gray-800">{member.dept}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2" }}>
                  <MapPin size={15} style={{ color: "#9B2335" }} />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Location</div>
                  <div className="text-xs font-bold text-gray-800">{member.location}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2" }}>
                  <Briefcase size={15} style={{ color: "#9B2335" }} />
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Company</div>
                  <div className="text-xs font-bold text-gray-800">{member.company}</div>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Left: Bio + Skills */}
              <div className="lg:col-span-2 space-y-6">
                {/* About */}
                <div className="p-5 rounded-2xl" style={{ border: "1.5px solid #f0e8e4" }}>
                  <h2 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                    <Users size={15} style={{ color: "#9B2335" }} /> About
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
                </div>

                {/* Skills */}
                <div className="p-5 rounded-2xl" style={{ border: "1.5px solid #f0e8e4" }}>
                  <h2 className="text-sm font-extrabold text-gray-900 mb-3 flex items-center gap-2">
                    <Globe size={15} style={{ color: "#9B2335" }} /> Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {member.skills.map((s, i) => (
                      <span key={i} className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "#fef0f2", color: "#9B2335" }}>
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
                    {member.achievements.map((a, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle2 size={14} style={{ color: "#22c55e" }} className="shrink-0" />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right: Contact */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl" style={{ border: "1.5px solid #f0e8e4" }}>
                  <h2 className="text-sm font-extrabold text-gray-900 mb-4 flex items-center gap-2">
                    <Mail size={15} style={{ color: "#9B2335" }} /> Contact Info
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2" }}>
                        <Mail size={13} style={{ color: "#9B2335" }} />
                      </div>
                      <a href={`mailto:${member.email}`} className="text-xs text-gray-600 hover:text-[#9B2335] transition-colors break-all">{member.email}</a>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2" }}>
                        <Phone size={13} style={{ color: "#9B2335" }} />
                      </div>
                      <span className="text-xs text-gray-600">{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fef0f2" }}>
                        <Linkedin size={13} style={{ color: "#9B2335" }} />
                      </div>
                      <a href={getLinkedInUrl(member.linkedin)} target="_blank" rel="noreferrer" className="text-xs text-gray-600 hover:text-[#9B2335] transition-colors">{member.linkedin}</a>
                    </div>
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
                      <p className="text-xs font-extrabold text-gray-900">Tolani Institute</p>
                      <p className="text-[11px] text-gray-500">{member.degree} in {member.dept}</p>
                      <p className="text-[11px] text-gray-400">Batch of {member.year}</p>
                    </div>
                  </div>
                </div>

                {/* Mutual Section */}
                <div className="p-5 rounded-2xl text-center" style={{ background: "linear-gradient(135deg, #fef0f2, #fff5f5)", border: "1.5px solid #f9c7cc" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: "#9B2335" }}>
                    <Users size={18} className="text-white" />
                  </div>
                  <p className="text-sm font-extrabold text-gray-900 mb-1">Part of Alumni Network</p>
                  <p className="text-[11px] text-gray-500 mb-3">Verified Tolani alumni member since {member.year}</p>
                  <a href="#" className="inline-block btn-maroon px-4 py-2 text-xs w-full text-center">
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
            {ALL_MEMBERS.filter(m => m.id !== member.id).slice(0, 4).map((m, idx) => (
              <Link
                key={m.id}
                href={`/members/${m.id}`}
                className="bg-white rounded-2xl p-4 flex flex-col items-center text-center transition-all hover:shadow-md hover:-translate-y-0.5"
                style={{ border: "1.5px solid #f0e8e4" }}
              >
                <div className="w-14 h-14 rounded-full overflow-hidden mb-2 shadow-sm">
                  <AvatarLarge name={m.name} colorIndex={m.id - 1} />
                </div>
                <p className="text-xs font-extrabold text-gray-900">{m.name}</p>
                <p className="text-[10px] text-gray-400">{m.company}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Footer ── */}
      <footer className="footer-dark pt-12 pb-0 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-10">
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
