"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Building2,
  GraduationCap,
  Briefcase,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowUp,
  Facebook,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  HeartHandshake,
  Users
} from "lucide-react";
import { Header } from "@/components/Header";
import "@/app/dashboard.css";

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  userType: string;
  department: string;
  batchYear: string;
  subjectCategory: string;
  subject: string;
  message: string;
  sendCopy: boolean;
}

const INITIAL_FORM: ContactFormData = {
  fullName: "",
  email: "",
  phone: "",
  userType: "Alumnus / Alumna",
  department: "Computer Engineering",
  batchYear: "",
  subjectCategory: "General Reconnect",
  subject: "",
  message: "",
  sendCopy: true,
};

const FAQS = [
  {
    q: "How can I update my profile and contact details in the Alumni Directory?",
    a: "You can update your personal, academic, and professional details by logging into your portal account or by submitting an inquiry here with your full name, roll number, and graduation year.",
  },
  {
    q: "How do I request official transcripts or degree verification from the institute?",
    a: "Transcript and verification requests are processed by the Student Section & Examination Cell. Select 'Transcripts & Verifications' in the contact form, and our desk coordinator will share the official verification form and guidelines.",
  },
  {
    q: "Can alumni organize a batch reunion or departmental meet on campus?",
    a: "Absolutely! We warmly welcome alumni to reconnect on campus. Please notify the Alumni Relations Cell at least 3 weeks prior so we can arrange seminar halls, faculty meetings, and campus access.",
  },
  {
    q: "How can I volunteer to mentor current students or conduct a guest lecture?",
    a: "We are always eager to connect our accomplished alumni with students! Choose 'Mentorship & Guest Lectures' in the contact form or email our Training & Placement Officer directly.",
  },
  {
    q: "How can I contribute or donate to campus development initiatives?",
    a: "You can visit our dedicated Donation page (/donation) to explore ongoing scholarship and campus development funds, or get in touch with our Relations Desk for corporate CSR partnerships.",
  },
];

const DEPARTMENT_CONTACTS = [
  {
    role: "Alumni Relations Officer",
    name: "Prof. D. B. Patel",
    dept: "Central Alumni Cell",
    email: "alumni-cell@tolani.ac.in",
    phone: "+91 2836 260249 Ext. 104",
    icon: Users,
  },
  {
    role: "Training & Placement Officer",
    name: "Prof. K. M. Mehta",
    dept: "TPO & Industry Relations",
    email: "placement@tolani.ac.in",
    phone: "+91 2836 260249 Ext. 112",
    icon: Briefcase,
  },
  {
    role: "Transcripts & Student Section",
    name: "Academic Verification Desk",
    dept: "Examination & Records",
    email: "transcripts@tolani.ac.in",
    phone: "+91 2836 260249 Ext. 108",
    icon: FileText,
  },
  {
    role: "Incubation & Student Mentorship",
    name: "Innovation & Startup Cell",
    dept: "Student Affairs",
    email: "mentorship@tolani.ac.in",
    phone: "+91 2836 260249 Ext. 120",
    icon: HeartHandshake,
  },
];

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showTop, setShowTop] = useState(false);



  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName.trim()) errs.fullName = "Please enter your full name.";
    if (!form.email.trim()) {
      errs.email = "Please enter your email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Please enter a valid email address.";
    }
    if (!form.subject.trim()) errs.subject = "Please enter a subject or title.";
    if (!form.message.trim()) {
      errs.message = "Please write your message.";
    } else if (form.message.trim().length < 15) {
      errs.message = "Message must be at least 15 characters long.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);

    // Mock API processing simulation (1.2 seconds)
    // As per user requirement: simulate complete message workflow,
    // show success notification, but do not actually dispatch external email.
    setTimeout(() => {
      const randomTicket = "TFGP-ALUM-" + Math.floor(10000 + Math.random() * 90000);
      setReferenceId(randomTicket);
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setErrors({});
    setSubmitted(false);
    setReferenceId("");
  };

  return (
    <div
      className="dashboard-body min-h-screen"
      style={{ overflowY: "auto", overflowX: "hidden", background: "#FAF9F9" }}
      onScroll={(e) => setShowTop((e.currentTarget.scrollTop ?? 0) > 300)}
    >
      {/* Global Navbar */}
      <Header activePage="contact" />

      {/* Hero / Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#4A0E17] via-[#7A1B28] to-[#9B2335] text-white pt-10 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle background decorative shapes */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-amber-300 blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-wider uppercase text-amber-200 mb-4">
              <Sparkles size={14} className="text-amber-300" />
              Alumni Relations & Helpdesk
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-4 leading-tight">
              Get in Touch with Your Alma Mater
            </h1>
            <p className="text-sm sm:text-base text-red-100/90 leading-relaxed max-w-2xl">
              Whether you want to reconnect with batchmates, plan a reunion, mentor diploma students,
              request transcripts, or collaborate on campus initiatives, we are always here to help.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-white/15">
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">25,000+</div>
                <div className="text-xs text-red-200">Global Alumni</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-amber-300">&lt; 24 Hrs</div>
                <div className="text-xs text-red-200">Avg. Response Time</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">100%</div>
                <div className="text-xs text-red-200">Support Dedication</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-white">Adipur</div>
                <div className="text-xs text-red-200">Gandhidham Campus</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 sm:-mt-10 mb-16 relative z-20 flex-1 w-full space-y-12">
        {/* 4 Quick Info Touchpoint Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Location */}
          <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#9B2335] flex items-center justify-center mb-4 group-hover:bg-[#9B2335] group-hover:text-white transition-colors">
              <MapPin size={22} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Campus Location</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Tolani F. G. Polytechnic, Post Box No. 11, Adipur (Kachchh), Gujarat 370205.
            </p>
            <a
              href="#campus-map"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#9B2335] hover:underline"
            >
              View on Map <ChevronRight size={13} />
            </a>
          </div>

          {/* Card 2: Phone */}
          <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#9B2335] flex items-center justify-center mb-4 group-hover:bg-[#9B2335] group-hover:text-white transition-colors">
              <Phone size={22} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Direct Helpline</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-1">
              Tel: <a href="tel:+912836260249" className="hover:text-[#9B2335] font-semibold">+91 (02836) 260249</a>
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              Mob: <a href="tel:+919825200000" className="hover:text-[#9B2335] font-semibold">+91 98252 00000</a>
            </p>
            <span className="text-[11px] text-gray-400 font-medium">Mon - Sat, 9am to 5pm</span>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#9B2335] flex items-center justify-center mb-4 group-hover:bg-[#9B2335] group-hover:text-white transition-colors">
              <Mail size={22} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Email Inquiries</h3>
            <p className="text-xs text-gray-600 leading-relaxed mb-1">
              Alumni: <a href="mailto:alumni@tolani.ac.in" className="text-[#9B2335] font-semibold hover:underline">alumni@tolani.ac.in</a>
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              General: <a href="mailto:info@tfgp.ac.in" className="text-[#9B2335] font-semibold hover:underline">info@tfgp.ac.in</a>
            </p>
            <span className="text-[11px] text-gray-400 font-medium">Fast digital turnaround</span>
          </div>

          {/* Card 4: Office Timings */}
          <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm hover:shadow-md transition-all group">
            <div className="w-12 h-12 rounded-xl bg-red-50 text-[#9B2335] flex items-center justify-center mb-4 group-hover:bg-[#9B2335] group-hover:text-white transition-colors">
              <Clock size={22} />
            </div>
            <h3 className="text-sm font-bold text-gray-900 mb-1">Visiting Hours</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong className="text-gray-800">Mon – Fri:</strong> 9:00 AM – 5:00 PM
            </p>
            <p className="text-xs text-gray-600 leading-relaxed mb-2">
              <strong className="text-gray-800">Saturday:</strong> 9:00 AM – 1:00 PM
            </p>
            <span className="text-[11px] text-red-500 font-semibold bg-red-50 px-2 py-0.5 rounded-md">
              Closed on Sundays & Public Holidays
            </span>
          </div>
        </div>

        {/* Section: Split Form & Key Contacts */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Contact Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-red-100/80 shadow-md relative">
            <div className="flex items-center justify-between pb-5 border-b border-gray-100 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="text-[#9B2335]" size={24} />
                  Send an Inquiry or Message
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  Fill in your details below and our team will get in touch with you.
                </p>
              </div>
              <span className="hidden sm:inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-red-50 text-[#9B2335]">
                Tolani Alumni Desk
              </span>
            </div>

            {submitted ? (
              /* Success Confirmation Card (Realistic Mock Outcome) */
              <div className="py-8 px-4 text-center animate-in fade-in zoom-in-95 duration-300">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-extrabold text-gray-900 mb-2">
                  Message Dispatched Successfully!
                </h3>
                <p className="text-sm text-gray-600 max-w-md mx-auto mb-6">
                  Thank you, <span className="font-bold text-gray-800">{form.fullName}</span>. Your inquiry regarding{" "}
                  <span className="font-semibold text-[#9B2335]">&quot;{form.subject}&quot;</span> has been recorded in our system.
                </p>

                {/* Ticket Reference Box */}
                <div className="bg-red-50/60 border border-red-100 rounded-2xl p-4 max-w-md mx-auto mb-6 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500 font-medium">Inquiry Reference ID:</span>
                    <span className="text-xs font-mono font-bold text-[#9B2335] bg-white px-2 py-0.5 rounded border border-red-200">
                      {referenceId}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1 pt-2 border-t border-red-100/80">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Contact Email:</span>
                      <span className="font-semibold text-gray-800">{form.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-semibold text-gray-800">{form.subjectCategory}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Department:</span>
                      <span className="font-semibold text-gray-800">{form.department}</span>
                    </div>
                  </div>
                </div>

                {/* Demo Notification Note */}
                <div className="flex items-center justify-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2.5 rounded-xl max-w-md mx-auto mb-6">
                  <ShieldCheck size={16} className="text-amber-600 shrink-0" />
                  <span>
                    <strong>Simulation Note:</strong> Your message has been safely validated and logged for preview. No external email was dispatched.
                  </span>
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="btn-maroon px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <RefreshCw size={14} /> Send Another Message
                  </button>
                  <Link
                    href="/"
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            ) : (
              /* Contact Form */
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* User Role Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-2">
                    I am contacting as: <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {[
                      "Alumnus / Alumna",
                      "Faculty / Staff",
                      "Other",
                    ].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({ ...form, userType: type })}
                        className={`text-xs py-2 px-3 rounded-xl border text-center font-medium transition-all ${
                          form.userType === type
                            ? "bg-red-50 border-[#9B2335] text-[#9B2335] font-bold shadow-xs"
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={form.fullName}
                      onChange={(e) => {
                        setForm({ ...form, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: "" });
                      }}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-gray-50/50 focus:bg-white focus:outline-none transition-all ${
                        errors.fullName
                          ? "border-red-400 focus:border-red-500 ring-2 ring-red-100"
                          : "border-gray-200 focus:border-[#9B2335] focus:ring-2 focus:ring-red-100"
                      }`}
                    />
                    {errors.fullName && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle size={12} /> {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: "" });
                      }}
                      className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-gray-50/50 focus:bg-white focus:outline-none transition-all ${
                        errors.email
                          ? "border-red-400 focus:border-red-500 ring-2 ring-red-100"
                          : "border-gray-200 focus:border-[#9B2335] focus:ring-2 focus:ring-red-100"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                        <AlertCircle size={12} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone & Department Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#9B2335] focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Department
                    </label>
                    <select
                      value={form.department}
                      onChange={(e) => setForm({ ...form, department: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#9B2335] focus:ring-2 focus:ring-red-100 transition-all cursor-pointer"
                    >
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Electrical Engineering">Electrical Engineering</option>
                      <option value="CDDM">Commercial Diploma in Design & Mfg. (CDDM)</option>
                      <option value="General / Administration">General / Administration</option>
                    </select>
                  </div>
                </div>

                {/* Batch & Inquiry Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Graduation Year / Batch
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2018 or 2022"
                      value={form.batchYear}
                      onChange={(e) => setForm({ ...form, batchYear: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#9B2335] focus:ring-2 focus:ring-red-100 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Subject Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={form.subjectCategory}
                      onChange={(e) => setForm({ ...form, subjectCategory: e.target.value })}
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-[#9B2335] focus:ring-2 focus:ring-red-100 transition-all cursor-pointer"
                    >
                      <option value="General Reconnect">General Reconnect / Greetings</option>
                      <option value="Alumni Meet & Reunions">Alumni Meet & Batch Reunions</option>
                      <option value="Student Mentorship & Sessions">Student Mentorship & Guest Lecture</option>
                      <option value="Transcripts & Verifications">Transcripts & Degree Verification</option>
                      <option value="Job Placement & Internships">Offer Jobs or Internships</option>
                      <option value="Donation & Giving">Donations & Giving Support</option>
                      <option value="Portal Support">Portal Login / Technical Issue</option>
                    </select>
                  </div>
                </div>

                {/* Subject Line */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Subject / Topic <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Brief summary of your inquiry..."
                    value={form.subject}
                    onChange={(e) => {
                      setForm({ ...form, subject: e.target.value });
                      if (errors.subject) setErrors({ ...errors, subject: "" });
                    }}
                    className={`w-full text-xs px-3.5 py-2.5 rounded-xl border bg-gray-50/50 focus:bg-white focus:outline-none transition-all ${
                      errors.subject
                        ? "border-red-400 focus:border-red-500 ring-2 ring-red-100"
                        : "border-gray-200 focus:border-[#9B2335] focus:ring-2 focus:ring-red-100"
                    }`}
                  />
                  {errors.subject && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle size={12} /> {errors.subject}
                    </p>
                  )}
                </div>

                {/* Message Textarea */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-gray-700">
                      Detailed Message <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[11px] text-gray-400">
                      {form.message.length} characters
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="Write your message, batch details, request, or questions here..."
                    value={form.message}
                    onChange={(e) => {
                      setForm({ ...form, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: "" });
                    }}
                    className={`w-full text-xs p-3.5 rounded-xl border bg-gray-50/50 focus:bg-white focus:outline-none transition-all resize-y ${
                      errors.message
                        ? "border-red-400 focus:border-red-500 ring-2 ring-red-100"
                        : "border-gray-200 focus:border-[#9B2335] focus:ring-2 focus:ring-red-100"
                    }`}
                  />
                  {errors.message && (
                    <p className="text-[11px] text-red-600 mt-1 flex items-center gap-1 font-medium">
                      <AlertCircle size={12} /> {errors.message}
                    </p>
                  )}
                </div>

                {/* Checkbox for copy */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="sendCopy"
                    checked={form.sendCopy}
                    onChange={(e) => setForm({ ...form, sendCopy: e.target.checked })}
                    className="w-4 h-4 rounded text-[#9B2335] accent-[#9B2335] focus:ring-red-200"
                  />
                  <label htmlFor="sendCopy" className="text-xs text-gray-600 select-none cursor-pointer">
                    Send a confirmation summary copy to my email address
                  </label>
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full btn-maroon py-3 px-6 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-75 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw size={16} className="animate-spin" />
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-gray-400 mt-2">
                    🔒 Messages are securely handled by Tolani Alumni Relations.
                  </p>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Departmental Directory & Support Desk (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Quick Contact Directory Cards */}
            <div className="bg-white rounded-3xl p-6 border border-red-100/80 shadow-md">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 mb-4">
                <div className="w-9 h-9 rounded-xl bg-red-50 text-[#9B2335] flex items-center justify-center">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Key Coordinators</h3>
                  <p className="text-xs text-gray-500">Reach the respective officer directly</p>
                </div>
              </div>

              <div className="space-y-3.5">
                {DEPARTMENT_CONTACTS.map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={i}
                      className="p-3.5 rounded-2xl bg-gray-50/70 hover:bg-red-50/40 border border-gray-100 hover:border-red-100 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 text-[#9B2335] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9B2335] bg-red-100/60 px-2 py-0.5 rounded">
                            {c.dept}
                          </span>
                          <div className="text-xs font-bold text-gray-900 mt-1">{c.name}</div>
                          <div className="text-[11px] text-gray-500">{c.role}</div>
                          <div className="mt-2 pt-2 border-t border-gray-200/60 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
                            <a
                              href={`mailto:${c.email}`}
                              className="text-[#9B2335] font-semibold hover:underline flex items-center gap-1"
                            >
                              <Mail size={12} /> {c.email}
                            </a>
                            <span className="text-gray-500 flex items-center gap-1">
                              <Phone size={12} /> {c.phone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>


            {/* Social Communities */}
            <div className="bg-white rounded-3xl p-5 border border-red-100/80 shadow-md">
              <h4 className="text-xs font-bold text-gray-900 mb-1">Connect on Social Channels</h4>
              <p className="text-[11px] text-gray-500 mb-3">
                Join 15,000+ Tolani alumni sharing updates, achievements & reunions online.
              </p>
              <div className="flex items-center gap-2">
                {[
                  { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
                  { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
                  { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
                  { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
                  { name: "YouTube", icon: Youtube, href: "https://youtube.com" },
                ].map((s, idx) => {
                  const SIcon = s.icon;
                  return (
                    <a
                      key={idx}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={s.name}
                      className="w-9 h-9 rounded-xl bg-gray-50 border border-gray-100 text-gray-600 hover:bg-[#9B2335] hover:text-white hover:border-[#9B2335] flex items-center justify-center transition-all"
                    >
                      <SIcon size={16} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Section: Frequently Asked Questions (FAQ) */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100/80 shadow-md">
          <div className="max-w-2xl mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#9B2335] bg-red-50 px-2.5 py-1 rounded-full">
              Got Questions?
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
              Frequently Asked Questions by Alumni
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Find quick answers to common inquiries regarding reunions, memberships, and records.
            </p>
          </div>

          <div className="divide-y divide-gray-100">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-4">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group"
                  >
                    <span
                      className={`text-sm sm:text-base font-bold transition-colors ${
                        isOpen ? "text-[#9B2335]" : "text-gray-800 group-hover:text-[#9B2335]"
                      }`}
                    >
                      {faq.q}
                    </span>
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen ? "bg-red-50 text-[#9B2335] rotate-180" : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      <ChevronDown size={16} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="mt-2.5 pr-8 text-xs sm:text-sm text-gray-600 leading-relaxed animate-in fade-in duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Section: Campus Map & Directions Guide */}
        <div id="campus-map" className="bg-white rounded-3xl p-6 sm:p-8 border border-red-100/80 shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9B2335] bg-red-50 px-2.5 py-1 rounded-full">
                Visit Campus
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                Tolani F. G. Polytechnic Campus Location
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Post Box No. 11, Adipur (Kachchh), Gujarat 370205, India
              </p>
            </div>

            <a
              href="https://maps.google.com/?q=Tolani+Foundation+Gandhidham+Polytechnic+Adipur"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-maroon px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 self-start md:self-auto shadow-sm"
            >
              <ExternalLink size={14} /> Open in Google Maps
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Embedded Google Maps Frame */}
            <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-gray-200 min-h-[340px] relative shadow-inner">
              <iframe
                title="Tolani Polytechnic Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14695.539829285094!2d70.09340915!3d23.0880193!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3950b784260a957b%3A0xe543e4b786cbbd32!2sTolani%20Foundation%20Gandhidham%20Polytechnic!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full min-h-[340px] border-0"
                loading="lazy"
                allowFullScreen
              />
            </div>

            {/* Travel Guide Information */}
            <div className="lg:col-span-4 bg-gray-50 rounded-2xl p-5 border border-gray-100 flex flex-col gap-4">
              <h4 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-2">
                Travel & Connectivity
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-[#9B2335] flex items-center justify-center shrink-0">
                    🚆
                  </div>
                  <div>
                    <strong className="text-gray-800">By Train:</strong>
                    <p className="text-gray-500 mt-0.5">
                      Adipur Junction: ~2 km away<br />
                      Gandhidham Junction: ~8 km away
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-[#9B2335] flex items-center justify-center shrink-0">
                    ✈️
                  </div>
                  <div>
                    <strong className="text-gray-800">By Air:</strong>
                    <p className="text-gray-500 mt-0.5">
                      Kandla Airport: ~6 km<br />
                      Bhuj Airport: ~55 km
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-white border border-gray-200 text-[#9B2335] flex items-center justify-center shrink-0">
                    🚌
                  </div>
                  <div>
                    <strong className="text-gray-800">By Road / Bus:</strong>
                    <p className="text-gray-500 mt-0.5">
                      Adipur GSRTC Bus Station: 1.5 km away with frequent connectivity to Ahmedabad & Rajkot.
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Global Standard Portal Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
            {/* Logo and Intro */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="relative w-9 h-9 bg-white rounded-full p-1">
                  <Image src="/logo.jpg" alt="Tolani" fill className="object-contain" unoptimized />
                </div>
                <div>
                  <div className="text-xs font-extrabold tracking-widest text-white">TOLANI</div>
                  <div className="text-[10px] font-bold tracking-wider" style={{ color: "#c0586a" }}>
                    ALUMNI PORTAL
                  </div>
                </div>
              </div>
              <p className="text-[12px] text-gray-400 leading-relaxed mb-4">
                The official alumni community of Tolani Foundation Gandhidham Polytechnic.
              </p>
              <div className="flex gap-2.5">
                {[Facebook, Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-800 text-gray-400 hover:bg-[#9B2335] hover:text-white transition-all"
                  >
                    <Icon size={13} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Quick Links</h4>
              <div className="space-y-2 text-[12px]">
                <Link href="/members" className="block text-gray-400 hover:text-white transition-colors">
                  Alumni Directory
                </Link>
                <Link href="/events" className="block text-gray-400 hover:text-white transition-colors">
                  Events & Meets
                </Link>
                <Link href="/gallery" className="block text-gray-400 hover:text-white transition-colors">
                  Campus Gallery
                </Link>
                <Link href="/donation" className="block text-gray-400 hover:text-white transition-colors">
                  Donations & Giving
                </Link>
                <Link href="/contact" className="block text-[#c0586a] font-bold hover:text-white transition-colors">
                  Contact Us
                </Link>
              </div>
            </div>

            {/* Departments */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Departments</h4>
              <div className="space-y-2 text-[12px]">
                <Link href="/departments/computer" className="block text-gray-400 hover:text-white transition-colors">
                  Computer Engineering
                </Link>
                <Link href="/departments/mechanical" className="block text-gray-400 hover:text-white transition-colors">
                  Mechanical Engineering
                </Link>
                <Link href="/departments/civil" className="block text-gray-400 hover:text-white transition-colors">
                  Civil Engineering
                </Link>
                <Link href="/departments/electrical" className="block text-gray-400 hover:text-white transition-colors">
                  Electrical Engineering
                </Link>
                <Link href="/departments/cddm" className="block text-gray-400 hover:text-white transition-colors">
                  CDDM Department
                </Link>
              </div>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Support & Help</h4>
              <div className="space-y-2 text-[12px]">
                <Link href="/contact#campus-map" className="block text-gray-400 hover:text-white transition-colors">
                  Campus Directions
                </Link>
                <a href="mailto:transcripts@tolani.ac.in" className="block text-gray-400 hover:text-white transition-colors">
                  Transcripts Desk
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">
                  Terms of Use
                </a>
              </div>
            </div>

            {/* Stay Connected */}
            <div>
              <h4 className="text-sm font-bold text-white mb-4">Stay Connected</h4>
              <div className="flex gap-2 mb-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-gray-800 text-white text-xs px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-[#9B2335]"
                />
                <button
                  type="button"
                  aria-label="Subscribe"
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 cursor-pointer"
                  style={{ background: "#9B2335" }}
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
              <p className="text-[11px] text-gray-500">
                Get the latest alumni newsletters & reunion invitations directly in your inbox.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 py-4 text-center">
          <p className="text-[12px] text-gray-500">
            © 2026 Tolani Alumni Portal. All Rights Reserved. Tolani Foundation Gandhidham Polytechnic.
          </p>
        </div>
      </footer>

      {/* Floating Back to Top Button */}
      {showTop && (
        <button
          onClick={() => document.querySelector(".dashboard-body")?.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xl z-50 transition-all hover:scale-110 cursor-pointer"
          style={{ background: "#9B2335" }}
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  );
}
