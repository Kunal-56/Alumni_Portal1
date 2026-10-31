"use client";

import "../login/login.css";
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Briefcase,
  Users,
  UserPlus,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const role = "alumni";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status & feedback
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("tolani_logged_in");
      if (stored === "true") router.push("/");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // Client-side Validation
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all required fields." });
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setMessage({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters long." });
      return;
    }

    if (password !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match. Please verify." });
      return;
    }

    if (!agreeTerms) {
      setMessage({ type: "error", text: "Please accept the Terms & Privacy Policy to continue." });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsLoading(false);
        setMessage({
          type: "error",
          text: data.message || "Failed to create account. Please try again.",
        });
        return;
      }

      setIsLoading(false);
      setMessage({
        type: "success",
        text: "Account registered successfully! Redirecting to login...",
      });

      setTimeout(() => {
        router.push(`/login?registered=true&email=${encodeURIComponent(email.trim().toLowerCase())}`);
      }, 1300);
    } catch (err: any) {
      setIsLoading(false);
      setMessage({
        type: "error",
        text: "Unable to reach the server. Please check your network and try again.",
      });
    }
  };

  return (
    <main
      className="relative min-h-screen w-full flex flex-col justify-between p-3 sm:p-4 lg:p-6 overflow-y-auto"
      style={{ background: "#F6EFEA" }}
    >
      {/* Background decorative elements */}
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] opacity-70 pointer-events-none -z-10"
        style={{ background: "#EFE1D8", borderRadius: "0 0 0 60%" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[350px] opacity-80 pointer-events-none -z-10"
        style={{ background: "#FDF9F7", borderRadius: "0 80% 0 0" }}
      />
      <div className="absolute top-6 left-[42%] w-28 h-28 bg-dot-matrix pointer-events-none -z-10" />
      <div className="absolute bottom-4 right-6 w-32 h-32 bg-dot-matrix pointer-events-none -z-10" />

      {/* Top Header Row */}
      <div className="max-w-7xl w-full mx-auto flex items-center justify-between mb-4 sm:mb-6 z-10 shrink-0">
        {/* Tolani Logo */}
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 shrink-0">
            <Image
              src="/logo.jpg"
              alt="Tolani Logo"
              fill
              className="object-contain rounded-full shadow-xs"
              unoptimized
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[11px] md:text-xs font-extrabold tracking-wider text-gray-900 leading-tight">
              TOLANI
            </span>
            <span
              className="text-[10px] md:text-[11px] font-bold tracking-widest leading-tight"
              style={{ color: "#9B2335" }}
            >
              ALUMNI PORTAL
            </span>
          </div>
        </Link>

        {/* Back Link */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-[#9B2335] bg-white/70 hover:bg-white px-3.5 py-1.5 rounded-full border border-gray-200/60 shadow-2xs transition-all"
          >
            <ArrowLeft size={14} /> Back to Login
          </Link>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto flex-1 py-2">
        {/* Left Hero Column */}
        <div className="lg:col-span-6 xl:col-span-6 w-full flex flex-col justify-center">
          <div className="flex flex-col justify-between space-y-3 lg:space-y-4 pr-0 lg:pr-6 py-1">
            {/* Headline */}
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-[#9B2335] bg-[#9B2335]/10 border border-[#9B2335]/20">
                <Sparkles size={13} /> Official Alumni Network
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-4xl xl:text-[44px] font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Join Our Global<br />
                <span style={{ color: "#9B2335" }}>Alumni Community</span>
              </h1>
              <div className="w-12 h-1 rounded-full" style={{ background: "#9B2335" }} />
              <p className="text-gray-600 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
                Create your account to connect with batchmates, discover job opportunities, attend college reunions, and stay inspired.
              </p>
            </div>

            {/* Campus Image */}
            <div
              className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border bg-white"
              style={{ borderColor: "#E9DDD8" }}
            >
              <div className="relative h-32 sm:h-36 lg:h-44 w-full">
                <Image
                  src="/campus-building.png"
                  alt="Tolani Campus Building"
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
              </div>
            </div>

            {/* 3 Pillars */}
            <div className="grid grid-cols-3 gap-2.5 pt-1">
              {[
                {
                  icon: Users,
                  label: "Connect",
                  desc: "Network with alumni across batches & industries",
                },
                {
                  icon: Briefcase,
                  label: "Opportunities",
                  desc: "Explore jobs, internships & career guidance",
                },
                {
                  icon: GraduationCap,
                  label: "Give Back",
                  desc: "Mentor juniors and support campus initiatives",
                },
              ].map((p, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center text-center space-y-1 group bg-white/50 p-2.5 rounded-2xl border border-gray-200/50 hover:bg-white transition-all shadow-2xs"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-2xs"
                    style={{ background: "#F7EEEC", color: "#9B2335" }}
                  >
                    <p.icon className="w-5 h-5 stroke-[1.75]" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-xs sm:text-sm">{p.label}</h3>
                  <p className="text-[10px] text-gray-500 font-medium leading-tight max-w-[130px]">
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Registration Card */}
        <div className="lg:col-span-6 xl:col-span-6 w-full flex flex-col items-center justify-center">
          <div
            className="w-full max-w-md mx-auto bg-white rounded-[36px] sm:rounded-[44px] p-5 sm:p-7 lg:p-8 border custom-shadow-card"
            style={{ borderColor: "rgba(233,221,216,0.7)" }}
          >
            {/* Header / Avatar */}
            <div className="flex flex-col items-center text-center space-y-1.5 mb-4">
              <div
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xs"
                style={{ background: "#F7EEEC", color: "#9B2335" }}
              >
                <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                  Create Account
                </h2>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">
                  Register to access the Tolani Alumni Portal
                </p>
              </div>
            </div>

            {/* Feedback Message Banner */}
            {message && (
              <div
                className={`mb-4 p-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                    : "bg-rose-50 text-rose-800 border border-rose-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-800 tracking-wide">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400 pointer-events-none">
                    <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <input
                    type="text"
                    id="register-fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-gray-50/60 rounded-xl border border-gray-200 text-gray-900 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-[#9B2335] transition-all duration-200"
                    style={{ "--tw-ring-color": "rgba(155,35,53,0.3)" } as React.CSSProperties}
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-800 tracking-wide">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400 pointer-events-none">
                    <Mail className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <input
                    type="email"
                    id="register-email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-gray-50/60 rounded-xl border border-gray-200 text-gray-900 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-[#9B2335] transition-all duration-200"
                    style={{ "--tw-ring-color": "rgba(155,35,53,0.3)" } as React.CSSProperties}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-800 tracking-wide">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400 pointer-events-none">
                    <Lock className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="register-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password (min 6 characters)"
                    className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-gray-50/60 rounded-xl border border-gray-200 text-gray-900 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-[#9B2335] transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-800 tracking-wide">
                  Confirm Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400 pointer-events-none">
                    <Lock className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="register-confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-gray-50/60 rounded-xl border border-gray-200 text-gray-900 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-[#9B2335] transition-all duration-200"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-center gap-2 pt-0.5">
                <input
                  type="checkbox"
                  id="agree-terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 rounded text-[#9B2335] focus:ring-[#9B2335] border-gray-300 cursor-pointer"
                />
                <label htmlFor="agree-terms" className="text-[11px] sm:text-xs text-gray-600 cursor-pointer">
                  I agree to the{" "}
                  <a href="#" className="font-bold underline hover:text-[#9B2335]">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-bold underline hover:text-[#9B2335]">
                    Privacy Policy
                  </a>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                id="register-submit-btn"
                disabled={isLoading}
                className="w-full py-2.5 sm:py-3 text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 custom-shadow-button active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed shadow-sm"
                style={{ background: isLoading ? "#9B2335cc" : "#9B2335" }}
              >
                {isLoading ? (
                  <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Create Account</>
                )}
              </button>
            </form>



            {/* Already have an account? Login */}
            <div className="mt-4 text-center">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-bold hover:underline transition-all"
                  style={{ color: "#9B2335" }}
                >
                  Log In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto shrink-0 text-center py-2 z-10">
        <p className="text-[11px] text-gray-500 font-medium">
          © 2026 Tolani Alumni Portal. All rights reserved.
        </p>
      </footer>
    </main>
  );
}
