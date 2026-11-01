"use client";

import "./login.css";
import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // If already logged in, redirect accordingly
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdmin = sessionStorage.getItem("tolani_admin_authenticated");
      if (storedAdmin === "true") {
        router.push("/admin");
        return;
      }

      const stored = sessionStorage.getItem("tolani_logged_in");
      if (stored === "true") {
        router.push("/");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      if (params.get("registered") === "true") {
        setMessage({
          type: "success",
          text: "Registration successful! Please login with your password.",
        });
      }
      const emailParam = params.get("email");
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email.trim() || !password) {
      setMessage({ type: "error", text: "Please enter your email and password." });
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setIsLoading(false);
        setMessage({
          type: "error",
          text: data.message || "Invalid email or password. Please try again.",
        });
        return;
      }

      const isAdmin =
        data.user?.role === "admin" ||
        data.user?.email === "admin@tolani.edu" ||
        email.trim().toLowerCase() === "admin@tolani.edu";

      // Save user session
      if (typeof window !== "undefined") {
        sessionStorage.setItem("tolani_logged_in", "true");
        sessionStorage.setItem("tolani_user_id", String(data.user?.id || ""));
        sessionStorage.setItem("tolani_user_email", data.user?.email || email.trim().toLowerCase());
        sessionStorage.setItem("tolani_user_name", data.user?.name || "");
        sessionStorage.setItem("tolani_user_role", data.user?.role || (isAdmin ? "admin" : "alumni"));

        localStorage.setItem("tolani_logged_in", "true");
        localStorage.setItem("tolani_user_id", String(data.user?.id || ""));
        localStorage.setItem("tolani_user_email", data.user?.email || email.trim().toLowerCase());
        localStorage.setItem("tolani_user_name", data.user?.name || "");
        localStorage.setItem("tolani_user_role", data.user?.role || (isAdmin ? "admin" : "alumni"));

        if (isAdmin) {
          sessionStorage.setItem("tolani_admin_authenticated", "true");
          localStorage.setItem("tolani_admin_authenticated", "true");
        } else {
          sessionStorage.removeItem("tolani_admin_authenticated");
          localStorage.removeItem("tolani_admin_authenticated");
        }
      }

      setIsLoading(false);

      if (isAdmin) {
        setMessage({
          type: "success",
          text: `Welcome Administrator! Opening Admin Portal...`,
        });
        setTimeout(() => {
          router.push("/admin");
        }, 800);
      } else {
        setMessage({
          type: "success",
          text: `Welcome back, ${data.user?.name}! Redirecting to dashboard...`,
        });
        setTimeout(() => {
          router.push("/");
        }, 1000);
      }
    } catch (err: any) {
      setIsLoading(false);
      setMessage({
        type: "error",
        text: "Unable to reach the server. Please check your network connection.",
      });
    }
  };

  return (
    <main
      className="login-body relative h-screen max-h-screen w-full flex flex-col justify-between p-3 sm:p-4 lg:p-6"
      style={{ background: "#F6EFEA", overflow: "hidden" }}
    >
      {/* Background blobs */}
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

      {/* Top-left: Tolani Logo */}
      <div className="absolute top-4 left-4 sm:top-5 sm:left-5 lg:top-6 lg:left-6 z-10">
        <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="relative w-11 h-11 shrink-0">
            <Image src="/logo.jpg" alt="Tolani Logo" fill className="object-contain" unoptimized />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[11px] md:text-xs font-extrabold tracking-wider text-gray-900 leading-tight">TOLANI</span>
            <span className="text-[10px] md:text-[11px] font-bold tracking-widest leading-tight" style={{ color: "#9B2335" }}>ALUMNI PORTAL</span>
          </div>
        </Link>
      </div>

      {/* Top-right: Back to Dashboard */}
      <div className="absolute top-4 right-4 sm:top-5 sm:right-5 lg:top-6 lg:right-6 z-10">
        <Link href="/" className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-[#9B2335] transition-colors">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center my-auto flex-1 overflow-hidden">

        {/* Left Hero */}
        <div className="lg:col-span-6 xl:col-span-6 w-full flex flex-col justify-center">
          <div className="flex flex-col justify-between space-y-2 lg:space-y-3 pr-0 lg:pr-6 py-1 pt-1 lg:pt-0.5">
            {/* Headline */}
            <div className="space-y-2 pt-0.5">
              <h1 className="pt-50 text-3xl sm:text-4xl lg:text-4xl xl:text-[44px] font-extrabold text-gray-900 tracking-tight leading-[1.15]">
                Stay Connected<br />
                <span style={{ color: "#9B2335" }}>Stay Inspired</span>
              </h1>
              <div className="w-10 h-1 rounded-full" style={{ background: "#9B2335" }} />
              <p className="text-gray-600 text-xs sm:text-sm max-w-md font-medium leading-relaxed">
                A dedicated platform for Tolani alumni to connect, collaborate and grow together
              </p>
            </div>

            {/* Campus image */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border bg-white" style={{ borderColor: "#E9DDD8" }}>
              <div className="relative h-28 sm:h-32 lg:h-36 xl:h-40 w-full">
                <Image src="/campus-building.png" alt="Tolani Campus Building" fill className="object-cover" priority unoptimized />
              </div>
            </div>

            {/* 3 pillars */}
            <div className="grid grid-cols-3 gap-2.5 pt-0.5">
              {[
                { label: "Connect", desc: "Build connections with peers and alumni" },
                { label: "Explore", desc: "Explore resources and opportunities" },
                { label: "Grow", desc: "Learn, grow and achieve together" },
              ].map((p, i) => (
                <div key={i} className="flex flex-col items-center text-center space-y-1 group">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm"
                    style={{ background: "#F7EEEC", color: "#9B2335" }}>
                    <User className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.75]" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-xs sm:text-sm">{p.label}</h3>
                  <p className="text-[10px] sm:text-[11px] text-gray-500 font-medium leading-tight max-w-[130px]">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Login Card */}
        <div className="lg:col-span-6 xl:col-span-6 w-full flex flex-col items-center justify-center">
          <div
            className="w-full max-w-md mx-auto bg-white rounded-[36px] sm:rounded-[44px] p-6 sm:p-8 border custom-shadow-card"
            style={{ borderColor: "rgba(233,221,216,0.6)" }}
          >
            {/* Avatar */}
            <div className="flex flex-col items-center text-center space-y-1.5 mb-4">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center shadow-xs"
                style={{ background: "#F7EEEC", color: "#9B2335" }}>
                <User className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
              </div>
              <div className="space-y-0.5">
                <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">Welcome Back!</h2>
                <p className="text-gray-500 text-xs sm:text-sm font-medium">Login to access your account</p>
              </div>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-4 p-3 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 ${
                message.type === "success"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-rose-50 text-rose-800 border border-rose-200"
              }`}>
                {message.text}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-800 tracking-wide">Email ID</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400 pointer-events-none">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <input
                    type="email" id="email" value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-gray-50/50 rounded-xl border border-gray-200 text-gray-900 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-[#9B2335] transition-all duration-200"
                    style={{ "--tw-ring-color": "rgba(155,35,53,0.3)" } as React.CSSProperties}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-800 tracking-wide">Password</label>
                <div className="relative flex items-center">
                  <div className="absolute left-3.5 text-gray-400 pointer-events-none">
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"} id="password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-gray-50/50 rounded-xl border border-gray-200 text-gray-900 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:border-[#9B2335] transition-all duration-200"
                    required
                  />
                  <button type="button" id="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
                  </button>
                </div>
                <div className="flex justify-end pt-0.5">
                  <a href="#" className="text-xs font-bold hover:underline transition-all" style={{ color: "#9B2335" }}>Forgot Password?</a>
                </div>
              </div>

              {/* Login Button */}
              <button type="submit" id="login-btn" disabled={isLoading}
                className="w-full py-2.5 sm:py-3 text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 custom-shadow-button active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
                style={{ background: isLoading ? "#9B2335cc" : "#9B2335" }}>
                {isLoading
                  ? <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <>Login</>}
              </button>
            </form>

            {/* Register */}
            <div className="mt-3 sm:mt-4 text-center">
              <p className="text-xs sm:text-sm text-gray-500 font-medium">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="font-bold hover:underline transition-all" style={{ color: "#9B2335" }}>Register Now</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl w-full mx-auto shrink-0 pt-1">
        <footer className="w-full text-center space-y-1 pt-2 pb-1">
          <p className="text-[11px] text-gray-500 font-medium">© 2026 Tolani Alumni Portal. All rights reserved.</p>
          <div className="flex items-center justify-center gap-2.5 text-[11px] font-semibold" style={{ color: "#9B2335" }}>
            <a href="#" className="hover:underline transition-all">Privacy Policy</a>
            <span className="text-gray-300 font-normal">|</span>
            <a href="#" className="hover:underline transition-all">Terms of Use</a>
            <span className="text-gray-300 font-normal">|</span>
            <a href="#" className="hover:underline transition-all">Help &amp; Support</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
