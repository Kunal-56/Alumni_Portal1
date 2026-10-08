"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Building, Mail, Phone, CheckCircle2 } from 'lucide-react';
import { Header } from '@/components/Header';

export default function EventRegistrationPage() {
  const router = useRouter();
  const [eventTitle, setEventTitle] = useState('Global Alumni Meet 2026');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const event = params.get('event');
    if (event) setEventTitle(event);
  }, []);

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push('/#events');
    }
  };

  const handleRegister = () => {
    const registered = JSON.parse(localStorage.getItem('registeredEvents') || '[]');
    if (!registered.includes(eventTitle)) {
      registered.push(eventTitle);
      localStorage.setItem('registeredEvents', JSON.stringify(registered));
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push('/events');
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />
      
      {/* ── Back Button ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-8">
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-2 text-sm font-bold bg-white border border-gray-200 px-4 py-2 rounded-xl text-gray-600 hover:text-[#9B2335] hover:border-[#9B2335] transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      {/* ── Main Form Section ── */}
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Event Summary Banner */}
          <div className="bg-red-50/50 border-b border-red-100 p-6 sm:p-8">
            <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white text-[#9B2335] border border-red-100 mb-4 shadow-sm">
              Selected Event
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 mb-4">{eventTitle}</h2>
            <div className="flex flex-wrap gap-4 sm:gap-6 text-sm font-medium text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[#9B2335]" /> 25 June 2026
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#9B2335]" /> 10:00 AM - 04:00 PM
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-[#9B2335]" /> Online (Virtual Event)
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="p-6 sm:p-8">
            <form className="space-y-6">
              
              {/* Personal Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs">1</span>
                  Personal Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">First Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="John" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9B2335]/20 focus:border-[#9B2335] transition-all text-sm font-medium" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Last Name <span className="text-red-500">*</span></label>
                    <input type="text" placeholder="Doe" className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9B2335]/20 focus:border-[#9B2335] transition-all text-sm font-medium" required />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="email" placeholder="john@example.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9B2335]/20 focus:border-[#9B2335] transition-all text-sm font-medium" required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Phone Number <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="tel" placeholder="+91 98765 43210" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9B2335]/20 focus:border-[#9B2335] transition-all text-sm font-medium" required />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 my-8"></div>

              {/* Alumni Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs">2</span>
                  Alumni Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Graduation Year <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9B2335]/20 focus:border-[#9B2335] transition-all text-sm font-medium appearance-none" required defaultValue="">
                      <option value="" disabled>Select Year</option>
                      {Array.from({ length: 30 }, (_, i) => 2026 - i).map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Department <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9B2335]/20 focus:border-[#9B2335] transition-all text-sm font-medium appearance-none" required defaultValue="">
                      <option value="" disabled>Select Department</option>
                      <option value="Computer">Computer Engineering</option>
                      <option value="Civil">Civil Engineering</option>
                      <option value="Electrical">Electrical Engineering</option>
                      <option value="Mechanical">Mechanical Engineering</option>
                      <option value="CDDM">CDDM</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Current Company & Designation (Optional)</label>
                    <div className="relative">
                      <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder="e.g. Software Engineer at Google" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9B2335]/20 focus:border-[#9B2335] transition-all text-sm font-medium" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-gray-100 my-8"></div>

              {/* Event Specifics */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs">3</span>
                  Event Details
                </h3>
                <div className="grid grid-cols-1 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Number of Guests (Excluding you) <span className="text-red-500">*</span></label>
                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9B2335]/20 focus:border-[#9B2335] transition-all text-sm font-medium appearance-none" required>
                      <option value="0">None - Just me</option>
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3+ Guests</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-gray-700">Special Requirements or Dietary Restrictions</label>
                    <textarea rows={3} placeholder="Let us know if you have any specific needs..." className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9B2335]/20 focus:border-[#9B2335] transition-all text-sm font-medium resize-none"></textarea>
                  </div>
                </div>
              </div>
              
              {/* Consent & Submit */}
              <div className="pt-4">
                <label className="flex items-start gap-3 cursor-pointer group mb-6">
                  <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                    <input type="checkbox" className="peer w-5 h-5 appearance-none rounded border-2 border-gray-300 checked:bg-[#9B2335] checked:border-[#9B2335] transition-colors cursor-pointer" required />
                    <CheckCircle2 size={14} className="absolute text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
                  </div>
                  <span className="text-sm text-gray-600 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">
                    I confirm that the details provided are correct and I agree to the <a href="#" className="text-[#9B2335] hover:underline font-bold">Terms & Conditions</a> of the event.
                  </span>
                </label>

                <button type="button" onClick={handleRegister} className="w-full py-4 rounded-xl text-white font-extrabold text-base shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 flex justify-center items-center gap-2" style={{ background: "linear-gradient(135deg, #9B2335 0%, #7a1b28 100%)" }}>
                  Confirm Registration
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
