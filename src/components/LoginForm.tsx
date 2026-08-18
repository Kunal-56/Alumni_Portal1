"use client";

import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!email || !password) {
      setMessage({ type: "error", text: "Please enter your email and password." });
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMessage({ type: "success", text: "Welcome back! Redirecting to alumni dashboard..." });
    }, 1200);
  };

  return (
    <div className="w-[640px] h-[645px] max-w-sm xl:max-w-md mx-auto bg-white rounded-[50px] p-4 sm:p-9 lg:p-6 custom-shadow-card border border-alumni-border/50 transition-shadow duration-300 ">
      {/* Top Circle Avatar Icon */}
      <div className="pt-[65px] flex flex-col items-center text-center space-y-1.5 mb-3 lg:mb-4">
        <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-alumni-maroon-subtle flex items-center justify-center text-alumni-maroon shadow-xs">
          <User className="pt-400px w-5 h-10  sm:w-6 sm:h-6 stroke-[1.75]" />
        </div>

        <div className="space-y-0.5">
          <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 tracking-tight">
            Welcome Back!
          </h2>
          <p className="text-gray-500 text-xs sm:text-sm font-medium">
            Login to access your account
          </p>
        </div>
      </div>

      {/* Form Feedback Messages */}
      {message && (
        <div
          className={`mb-4 p-3 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-2 ${message.type === "success"
            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
            : "bg-rose-50 text-rose-800 border border-rose-200"
            }`}
        >
          {message.text}
        </div>
      )}

      {/* Main Login Form */}
      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
        {/* Email ID Field */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-800 tracking-wide">
            Email ID
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-gray-400 pointer-events-none">
              <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-gray-50/50 rounded-xl border border-gray-200 text-gray-900 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-alumni-maroon/30 focus:border-alumni-maroon transition-all duration-200"
              required
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-gray-800 tracking-wide">
            Password
          </label>
          <div className="relative flex items-center">
            <div className="absolute left-3.5 text-gray-400 pointer-events-none">
              <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-gray-50/50 rounded-xl border border-gray-200 text-gray-900 text-xs sm:text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-alumni-maroon/30 focus:border-alumni-maroon transition-all duration-200"
              required
            />
            <button
              type="button"
              id="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 text-gray-400 hover:text-gray-600 focus:outline-none p-1 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end pt-0.5">
            <a
              href="#"
              className="text-xs font-bold text-alumni-maroon hover:text-alumni-maroon-dark transition-colors"
            >
              Forgot Password?
            </a>
          </div>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          id="login-btn"
          disabled={isLoading}
          className="w-full py-2.5 sm:py-3 bg-alumni-maroon hover:bg-alumni-maroon-dark text-white font-bold text-xs sm:text-sm rounded-xl transition-all duration-200 custom-shadow-button active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>Login</>
          )}
        </button>
      </form>

      {/* Or Continue With Divider */}
      <div className="relative my-3 sm:my-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <span className="relative bg-white px-3 text-[11px] sm:text-xs font-medium text-gray-400">
          or continue with
        </span>
      </div>

      {/* Social Login Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* Google Button */}
        <button
          type="button"
          id="google-login-btn"
          onClick={() => setMessage({ type: "success", text: "Connecting to Google Authentication..." })}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/80 text-gray-700 text-xs font-bold transition-colors shadow-2xs"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </button>

        {/* Apple ID Button */}
        <button
          type="button"
          id="apple-login-btn"
          onClick={() => setMessage({ type: "success", text: "Connecting to Apple Authentication..." })}
          className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50/80 text-gray-700 text-xs font-bold transition-colors shadow-2xs"
        >
          <svg className="w-4 h-4 fill-current text-gray-900" viewBox="0 0 170 170">
            <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.34.13-9.16-1.9-14.49-6.09-3.26-2.64-7.14-7.28-11.64-13.9-6.42-9.39-11.45-19.98-15.09-31.78-3.64-11.79-5.46-23.32-5.46-34.58 0-14.89 3.82-27.18 11.46-36.87 7.64-9.69 17.3-14.62 28.98-14.8 4.79 0 10.02 1.23 15.7 3.69 5.68 2.46 9.69 3.69 12.03 3.69 1.9 0 5.92-1.28 12.08-3.83 6.16-2.55 11.38-3.74 15.65-3.58 11.4.65 20.65 5.02 27.76 13.11-10.22 6.2-15.22 14.88-15 26.04.22 8.7 3.48 16.03 9.78 21.99 6.3 5.96 13.91 9.4 22.83 10.33-2.39 7.07-5.65 14.24-9.78 21.51zM119.22 31.08c0-7.39 2.72-14.45 8.16-21.18 5.44-6.73 12.18-10.87 20.22-12.42.43 1.09.65 2.18.65 3.26 0 7.28-2.77 14.45-8.31 21.51-5.54 7.07-12.33 11.25-20.37 12.55-.22-.98-.35-2.23-.35-3.72z" />
          </svg>
          Apple ID
        </button>
      </div>

      {/* Registration Callout */}
      <div className="mt-3 sm:mt-4 text-center">
        <p className="text-xs sm:text-sm text-gray-500 font-medium">
          Don&apos;t have an account?{" "}
          <a
            href="#"
            className="font-bold text-alumni-maroon hover:underline transition-all"
          >
            Register Now
          </a>
        </p>
      </div>
    </div>
  );
};
