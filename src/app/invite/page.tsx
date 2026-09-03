"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User, Mail, Phone, MapPin, Linkedin, GraduationCap,
  Briefcase, Shield, Check, ArrowLeft, ArrowRight, Lock, CheckCircle2,
  ChevronDown, X, Sparkles, AlertCircle, Info, Smartphone
} from "lucide-react";
import { addMember, Member } from "@/lib/alumniStore";
import "../dashboard.css";

const DEGREES = ["B.Tech", "Diploma", "BA (J&MC)", "BBA", "M.Tech", "MBA", "BCA", "MCA", "B.Sc", "M.Sc", "Other"];
const DEPARTMENTS = ["Computer Engineering", "Information Technology", "Civil Engineering", "Electrical Engineering", "Mechanical Engineering", "CDDM", "Journalism", "Business", "Management", "ECE", "Chemical Engineering"];
const YEARS = ["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015"];

export default function InviteAlumniPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [shortBio, setShortBio] = useState("");

  // Step 2
  const [degree, setDegree] = useState("B.Tech");
  const [dept, setDept] = useState("Computer Engineering");
  const [batchYear, setBatchYear] = useState("2025");
  const [institute, setInstitute] = useState("Tolani F. & Polytechnic");
  const [company, setCompany] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [workLocation, setWorkLocation] = useState("");
  const [experience, setExperience] = useState("2");
  const [skills, setSkills] = useState<string[]>(["React", "Node.js", "Python", "Cloud", "Kubernetes"]);
  const [newSkillInput, setNewSkillInput] = useState("");
  const [bioAchievements, setBioAchievements] = useState("Passionate software engineer working on large-scale distributed systems.");

  // Step 3
  const [verificationMethod, setVerificationMethod] = useState<"email" | "mobile">("email");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [verificationMobile, setVerificationMobile] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [createdMember, setCreatedMember] = useState<Member | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRemoveSkill = (s: string) => setSkills(skills.filter((sk) => sk !== s));
  const handleAddSkill = () => {
    const t = newSkillInput.trim();
    if (t && !skills.includes(t)) { setSkills([...skills, t]); setNewSkillInput(""); }
  };
  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); handleAddSkill(); }
  };

  const handleGoToStep2 = () => {
    const errs: Record<string, string> = {};
    if (!fullName.trim()) errs.fullName = "Full Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!email.includes("@")) errs.email = "Enter a valid email";
    if (!phoneNumber.trim()) errs.phoneNumber = "Phone Number is required";
    if (!dob) errs.dob = "Date of Birth is required";
    if (!gender) errs.gender = "Please select gender";
    if (!currentLocation.trim()) errs.currentLocation = "Location is required";
    if (!shortBio.trim()) errs.shortBio = "Short Bio is required";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    if (!verificationEmail) setVerificationEmail(email);
    if (!verificationMobile) setVerificationMobile(`+91 ${phoneNumber}`);
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGoToStep3 = () => {
    const errs: Record<string, string> = {};
    if (!company.trim()) errs.company = "Company name is required";
    if (!jobTitle.trim()) errs.jobTitle = "Job title is required";
    if (!workLocation.trim()) errs.workLocation = "Work location is required";
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    if (!verificationEmail) setVerificationEmail(email);
    if (!verificationMobile) setVerificationMobile(`+91 ${phoneNumber}`);
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const newMemberData: Omit<Member, "id"> = {
      name: fullName.trim(),
      email: verificationMethod === "email" ? (verificationEmail.trim() || email.trim()) : email.trim(),
      phone: `+91 ${phoneNumber}`.trim(),
      dob, gender,
      location: currentLocation.trim(),
      linkedin: linkedin.trim() || `https://linkedin.com/in/${fullName.toLowerCase().replace(/\s+/g, "-")}`,
      bio: shortBio.trim() || bioAchievements.trim(),
      degree, dept, year: batchYear,
      institute: institute.trim() || "Tolani F. & Polytechnic",
      company: company.trim(), role: jobTitle.trim(),
      experience: experience || "1",
      skills: skills.length > 0 ? skills : ["Engineering"],
      achievements: ["Tolani Verified Alumni", bioAchievements.trim() || `${jobTitle} at ${company}`],
      verified: true, verificationMethod, avatar: "/avatars/m1.jpg",
    };
    setTimeout(() => {
      const created = addMember(newMemberData);
      setCreatedMember(created);
      setIsSubmitting(false);
      setIsSuccessModalOpen(true);
    }, 800);
  };

  /* ─── Input helper ─── */
  const inputCls = (key: string) =>
    `w-full bg-white border ${errors[key] ? "border-red-500 ring-1 ring-red-300" : "border-gray-200"} rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335] transition-all`;

  const clearErr = (key: string) => { if (errors[key]) setErrors({ ...errors, [key]: "" }); };

  const errMsg = (key: string) =>
    errors[key] ? (
      <p className="text-[11px] text-red-500 font-semibold mt-1 flex items-center gap-1">
        <AlertCircle size={12} /> {errors[key]}
      </p>
    ) : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#faf8f8" }}>

      {/* ── Top Header Bar (Maroon) ── */}
      <header className="w-full py-4 px-4 sm:px-8 text-white shadow-md relative z-20"
        style={{ background: "linear-gradient(135deg, #7b1129 0%, #9B2335 50%, #660e22 100%)" }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-full bg-white p-1 shrink-0 shadow-sm">
              <Image src="/logo.jpg" alt="Tolani Logo" fill className="object-contain" unoptimized />
            </div>
            <div className="flex flex-col">
              <span className="text-xs sm:text-sm font-extrabold tracking-wider text-white">TOLANI F. &amp; POLYTECHNIC</span>
              <span className="text-[10px] font-bold tracking-widest text-rose-200">ALUMNI PORTAL</span>
            </div>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-rose-100 hover:text-white hover:underline transition-all">
            <ArrowLeft size={16} /> Back to Portal
          </Link>
        </div>
      </header>

      {/* ── Main Container ── */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">

        {/* ── Stepper ── */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-8 right-8 top-5 h-[2px] bg-gray-200 z-0" />
            <div className="absolute left-8 top-5 h-[2px] bg-[#9B2335] transition-all duration-500 z-0"
              style={{ width: step === 1 ? "0%" : step === 2 ? "50%" : "calc(100% - 64px)" }} />
            {[
              { num: 1, label: "Personal Info" },
              { num: 2, label: "Education & Career" },
              { num: 3, label: "Verification" },
            ].map(({ num, label }) => (
              <div key={num} className="flex flex-col items-center relative z-10">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step === num ? "bg-[#9B2335] text-white ring-4 ring-rose-100 shadow-md scale-110"
                    : step > num ? "bg-[#9B2335] text-white"
                    : "bg-white border-2 border-gray-300 text-gray-400"
                }`}>
                  {step > num ? <Check size={18} strokeWidth={3} /> : num}
                </div>
                <span className={`text-xs mt-2 font-bold tracking-wide transition-colors ${
                  step === num ? "text-[#9B2335]" : "text-gray-500"
                }`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ═══ STEP 1: PERSONAL INFO ═══ */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm" style={{ border: "1.5px solid #f0e8e4" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#fef0f2", color: "#9B2335" }}><User size={20} /></div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Personal Information</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Let&apos;s start with your basic details.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Full Name <span className="text-[#9B2335]">*</span></label>
                  <input type="text" value={fullName} onChange={(e) => { setFullName(e.target.value); clearErr("fullName"); }} placeholder="Enter your full name" className={inputCls("fullName")} />
                  {errMsg("fullName")}
                </div>
                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address <span className="text-[#9B2335]">*</span></label>
                  <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); clearErr("email"); }} placeholder="Enter your email" className={inputCls("email")} />
                  {errMsg("email")}
                </div>
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Phone Number <span className="text-[#9B2335]">*</span></label>
                  <div className={`flex items-center border ${errors.phoneNumber ? "border-red-500 ring-1 ring-red-300" : "border-gray-200"} rounded-xl px-3 py-1 bg-white focus-within:border-[#9B2335] focus-within:ring-1 focus-within:ring-[#9B2335] transition-all`}>
                    <div className="flex items-center gap-1.5 pr-2.5 border-r border-gray-200 shrink-0 select-none">
                      <span className="text-base">🇮🇳</span><ChevronDown size={14} className="text-gray-400" />
                    </div>
                    <span className="text-xs font-bold text-gray-500 pl-2 select-none">+91</span>
                    <input type="tel" value={phoneNumber} onChange={(e) => { setPhoneNumber(e.target.value); clearErr("phoneNumber"); }} placeholder="98765 43210" className="w-full bg-transparent px-2 py-1.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none" />
                  </div>
                  {errMsg("phoneNumber")}
                </div>
                {/* DOB */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Date of Birth <span className="text-[#9B2335]">*</span></label>
                  <input type="date" value={dob} onChange={(e) => { setDob(e.target.value); clearErr("dob"); }} className={inputCls("dob")} />
                  {errMsg("dob")}
                </div>
                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Gender <span className="text-[#9B2335]">*</span></label>
                  <div className="relative">
                    <select value={gender} onChange={(e) => { setGender(e.target.value); clearErr("gender"); }} className={`${inputCls("gender")} appearance-none pr-8 cursor-pointer`}>
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {errMsg("gender")}
                </div>
                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Current Location <span className="text-[#9B2335]">*</span></label>
                  <div className="relative">
                    <input type="text" value={currentLocation} onChange={(e) => { setCurrentLocation(e.target.value); clearErr("currentLocation"); }} placeholder="Enter your city" className={`${inputCls("currentLocation")} pr-8`} />
                    <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {errMsg("currentLocation")}
                </div>
                {/* LinkedIn */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">LinkedIn Profile</label>
                  <div className="relative">
                    <input type="text" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/your-profile" className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335] transition-all pr-9" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded bg-[#0A66C2] flex items-center justify-center text-white pointer-events-none"><Linkedin size={12} fill="white" /></div>
                  </div>
                </div>
              </div>
            </div>

            {/* About You */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm" style={{ border: "1.5px solid #f0e8e4" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#fef0f2", color: "#9B2335" }}><User size={20} /></div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-gray-900">About You</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Tell us more about yourself.</p>
                </div>
              </div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">Short Bio <span className="text-[#9B2335]">*</span></label>
              <textarea rows={4} maxLength={300} value={shortBio} onChange={(e) => { setShortBio(e.target.value); clearErr("shortBio"); }} placeholder="Write a short bio about yourself..." className={`${inputCls("shortBio")} resize-none`} />
              <div className="text-right text-[11px] font-semibold text-gray-400 mt-1">{shortBio.length}/300</div>
              {errMsg("shortBio")}
            </div>

            {/* Bottom: Step 1 of 3 + Next */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-extrabold text-gray-900 whitespace-nowrap">Step 1 of 3</span>
                <div className="w-36 sm:w-48 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="w-1/3 h-full bg-[#9B2335] rounded-full transition-all" /></div>
              </div>
              <button type="button" onClick={handleGoToStep2} className="btn-maroon w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-sm rounded-xl font-bold shadow-md">Next Step <ArrowRight size={16} /></button>
            </div>
            <div className="rounded-2xl p-3.5 flex items-center justify-center gap-2.5 text-center mt-4" style={{ background: "#fef0f2", border: "1px solid #fce3e6" }}>
              <Lock size={15} style={{ color: "#9B2335" }} className="shrink-0" />
              <span className="text-xs font-semibold text-gray-700">Your information is 100% secure and will never be shared with anyone.</span>
            </div>
          </div>
        )}

        {/* ═══ STEP 2: EDUCATION & CAREER ═══ */}
        {step === 2 && (
          <div className="space-y-6">
            {/* Education */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm" style={{ border: "1.5px solid #f0e8e4" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#fef0f2", color: "#9B2335" }}><GraduationCap size={20} /></div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Education Details</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Tell us about your academic journey.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Degree <span className="text-[#9B2335]">*</span></label>
                  <div className="relative"><select value={degree} onChange={(e) => setDegree(e.target.value)} className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335] pr-8 cursor-pointer">{DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}</select><ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Branch / Department <span className="text-[#9B2335]">*</span></label>
                  <div className="relative"><select value={dept} onChange={(e) => setDept(e.target.value)} className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335] pr-8 cursor-pointer">{DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}</select><ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Batch / Year of Passing <span className="text-[#9B2335]">*</span></label>
                  <div className="relative"><select value={batchYear} onChange={(e) => setBatchYear(e.target.value)} className="w-full appearance-none bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335] pr-8 cursor-pointer">{YEARS.map((y) => <option key={y} value={y}>{y}</option>)}</select><ChevronDown size={15} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" /></div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Institute</label>
                  <input type="text" value={institute} onChange={(e) => setInstitute(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]" />
                </div>
              </div>
            </div>

            {/* Career */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm" style={{ border: "1.5px solid #f0e8e4" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#fef0f2", color: "#9B2335" }}><Briefcase size={20} /></div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Career Details</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Tell us about your professional journey.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Current Company <span className="text-[#9B2335]">*</span></label>
                  <input type="text" value={company} onChange={(e) => { setCompany(e.target.value); clearErr("company"); }} placeholder="Google" className={inputCls("company")} />
                  {errMsg("company")}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Job Title <span className="text-[#9B2335]">*</span></label>
                  <input type="text" value={jobTitle} onChange={(e) => { setJobTitle(e.target.value); clearErr("jobTitle"); }} placeholder="Software Engineer" className={inputCls("jobTitle")} />
                  {errMsg("jobTitle")}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Work Location <span className="text-[#9B2335]">*</span></label>
                  <div className="relative">
                    <input type="text" value={workLocation} onChange={(e) => { setWorkLocation(e.target.value); clearErr("workLocation"); }} placeholder="Bangalore, India" className={`${inputCls("workLocation")} pr-8`} />
                    <MapPin size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  {errMsg("workLocation")}
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Experience (in years) <span className="text-[#9B2335]">*</span></label>
                  <input type="number" min="0" max="50" value={experience} onChange={(e) => setExperience(e.target.value)} placeholder="2" className="w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]" />
                </div>
                {/* Skills */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Skills / Technologies</label>
                  <div className="p-3 border border-gray-200 rounded-2xl bg-white focus-within:border-[#9B2335] transition-all">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {skills.map((skill) => (
                        <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow-sm" style={{ background: "#fef0f2", color: "#9B2335", border: "1px solid #fbd8dc" }}>
                          {skill}
                          <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:bg-rose-200/80 rounded-full p-0.5"><X size={12} /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                      <input type="text" value={newSkillInput} onChange={(e) => setNewSkillInput(e.target.value)} onKeyDown={handleSkillKeyDown} placeholder="Type skill & press Enter..." className="flex-1 text-xs sm:text-sm text-gray-800 placeholder-gray-400 outline-none bg-transparent" />
                      <button type="button" onClick={handleAddSkill} className="text-xs font-bold px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-[#9B2335] hover:text-white transition-all text-gray-700">+ Add</button>
                    </div>
                  </div>
                </div>
                {/* Bio / Achievements */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Bio / Achievements</label>
                  <textarea rows={3} maxLength={300} value={bioAchievements} onChange={(e) => setBioAchievements(e.target.value)} placeholder="Your achievements..." className="w-full bg-white border border-gray-200 rounded-xl p-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335] resize-none" />
                  <div className="text-right text-[11px] font-semibold text-gray-400 mt-1">{bioAchievements.length}/300</div>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-extrabold text-gray-900 whitespace-nowrap">Step 2 of 3</span>
                <div className="w-36 sm:w-48 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="w-2/3 h-full bg-[#9B2335] rounded-full" /></div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button type="button" onClick={() => { setStep(1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm rounded-xl font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"><ArrowLeft size={16} /> Previous</button>
                <button type="button" onClick={handleGoToStep3} className="btn-maroon flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 text-sm rounded-xl font-bold shadow-md">Next Step <ArrowRight size={16} /></button>
              </div>
            </div>
            <div className="rounded-2xl p-3.5 flex items-center justify-center gap-2.5 text-center mt-4" style={{ background: "#fef0f2", border: "1px solid #fce3e6" }}>
              <Lock size={15} style={{ color: "#9B2335" }} className="shrink-0" />
              <span className="text-xs font-semibold text-gray-700">Your information is 100% secure and will never be shared with anyone.</span>
            </div>
          </div>
        )}

        {/* ═══ STEP 3: VERIFICATION ═══ */}
        {step === 3 && (
          <form onSubmit={handleFinalSubmit} className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm" style={{ border: "1.5px solid #f0e8e4" }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "#fef0f2", color: "#9B2335" }}><Shield size={20} /></div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-gray-900">Verify Your Identity</h2>
                  <p className="text-xs sm:text-sm text-gray-500">Please verify your identity to complete your profile.</p>
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-sm font-bold text-gray-900">Choose Verification Method</h3>
                <p className="text-xs text-gray-500">Select any one method to verify your account.</p>
              </div>

              {/* Two Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* Email */}
                <div onClick={() => setVerificationMethod("email")} className={`relative p-5 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center ${verificationMethod === "email" ? "ring-2 ring-[#9B2335] bg-[#fffafb] shadow-sm" : "border border-gray-200 hover:border-gray-300 bg-white"}`}>
                  <div className="absolute top-3.5 left-3.5 sm:left-auto sm:right-3.5">
                    {verificationMethod === "email" ? <div className="w-5 h-5 rounded-full bg-[#9B2335] flex items-center justify-center text-white"><Check size={12} strokeWidth={3} /></div> : <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mt-1" style={{ background: "#fef0f2", border: "1px solid #fcdde1", color: "#9B2335" }}><Mail size={22} /></div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Email Verification</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">We will send a verification link to your email address.</p>
                </div>
                {/* Mobile */}
                <div onClick={() => setVerificationMethod("mobile")} className={`relative p-5 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center ${verificationMethod === "mobile" ? "ring-2 ring-[#9B2335] bg-[#fffafb] shadow-sm" : "border border-gray-200 hover:border-gray-300 bg-white"}`}>
                  <div className="absolute top-3.5 left-3.5 sm:left-auto sm:right-3.5">
                    {verificationMethod === "mobile" ? <div className="w-5 h-5 rounded-full bg-[#9B2335] flex items-center justify-center text-white"><Check size={12} strokeWidth={3} /></div> : <div className="w-5 h-5 rounded-full border-2 border-gray-300" />}
                  </div>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 mt-1" style={{ background: "#fef0f2", border: "1px solid #fcdde1", color: "#9B2335" }}><Smartphone size={22} /></div>
                  <h4 className="text-sm font-bold text-gray-900 mb-1">Mobile Verification</h4>
                  <p className="text-xs text-gray-500 leading-relaxed">We will send an OTP to your mobile number.</p>
                </div>
              </div>

              {/* Dynamic Input */}
              <div className="mb-6">
                {verificationMethod === "email" ? (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Email Address</label>
                    <div className="relative flex items-center border border-gray-200 rounded-xl bg-white focus-within:border-[#9B2335] focus-within:ring-1 focus-within:ring-[#9B2335]">
                      <Mail size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
                      <input type="email" required value={verificationEmail} onChange={(e) => setVerificationEmail(e.target.value)} placeholder="daksh.ahir@alumni.tolani.ac.in" className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:outline-none" />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">Mobile Number</label>
                    <div className="relative flex items-center border border-gray-200 rounded-xl bg-white focus-within:border-[#9B2335] focus-within:ring-1 focus-within:ring-[#9B2335]">
                      <Smartphone size={16} className="absolute left-3.5 text-gray-400 pointer-events-none" />
                      <input type="text" required value={verificationMobile} onChange={(e) => setVerificationMobile(e.target.value)} placeholder="+91 98765 43210" className="w-full bg-transparent pl-10 pr-4 py-2.5 text-sm text-gray-800 focus:outline-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* Why Verification */}
              <div className="p-4 rounded-2xl flex items-start gap-3" style={{ background: "#fef0f2", border: "1px solid #fce3e6" }}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#fbd8dc", color: "#9B2335" }}><Info size={16} /></div>
                <div>
                  <h5 className="text-xs font-extrabold text-gray-900 mb-0.5">Why Verification?</h5>
                  <p className="text-xs text-gray-600 leading-relaxed">Verification helps us ensure authentic alumni community and prevents fake profiles.</p>
                </div>
              </div>
            </div>

            {/* Bottom */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-extrabold text-gray-900 whitespace-nowrap">Step 3 of 3</span>
                <div className="w-36 sm:w-48 h-2 bg-gray-200 rounded-full overflow-hidden"><div className="w-full h-full bg-[#9B2335] rounded-full" /></div>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button type="button" onClick={() => { setStep(2); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm rounded-xl font-bold bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 shadow-sm"><ArrowLeft size={16} /> Previous</button>
                <button type="submit" disabled={isSubmitting} className="btn-maroon flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3 text-sm rounded-xl font-bold shadow-md disabled:opacity-75 disabled:cursor-not-allowed">
                  {isSubmitting ? <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Verifying...</> : verificationMethod === "email" ? <>Send Verification Link <ArrowRight size={16} /></> : <>Send OTP &amp; Verify <ArrowRight size={16} /></>}
                </button>
              </div>
            </div>
            <div className="rounded-2xl p-3.5 flex items-center justify-center gap-2.5 text-center mt-4" style={{ background: "#fef0f2", border: "1px solid #fce3e6" }}>
              <Lock size={15} style={{ color: "#9B2335" }} className="shrink-0" />
              <span className="text-xs font-semibold text-gray-700">Your information is 100% secure and will never be shared with anyone.</span>
            </div>
          </form>
        )}
      </main>

      {/* ═══ SUCCESS MODAL ═══ */}
      {isSuccessModalOpen && createdMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center shadow-2xl relative border border-gray-100">
            <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 ring-8 ring-green-50" style={{ background: "#22c55e" }}><CheckCircle2 size={36} className="text-white" /></div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-200 mb-2"><Sparkles size={13} /> Verified Member Added</span>
            <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Registration Successful!</h3>
            <p className="text-sm text-gray-600 mb-6 leading-relaxed">Welcome, <strong className="text-gray-900">{createdMember.name}</strong>! Your alumni profile is now verified and live in the directory.</p>
            <div className="bg-gray-50 rounded-2xl p-4 mb-6 text-left text-xs space-y-2 border border-gray-200/80">
              <div className="flex justify-between"><span className="text-gray-500">Degree &amp; Batch:</span><span className="font-bold text-gray-800">{createdMember.degree} ({createdMember.year})</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Department:</span><span className="font-bold text-gray-800">{createdMember.dept}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Company / Role:</span><span className="font-bold text-gray-800">{createdMember.role} at {createdMember.company}</span></div>
              <div className="flex justify-between"><span className="text-gray-500">Location:</span><span className="font-bold text-gray-800">{createdMember.location}</span></div>
            </div>
            <div className="flex flex-col gap-2.5">
              <Link href="/members" className="btn-maroon w-full py-3 text-sm rounded-xl font-bold flex items-center justify-center gap-2 shadow-md">View in Members Directory <ArrowRight size={16} /></Link>
              <Link href={`/members/${createdMember.id}`} className="w-full py-2.5 text-sm rounded-xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-800 transition-colors text-center">View My Profile</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
