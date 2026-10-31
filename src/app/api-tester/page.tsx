"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import {
  Database, Send, CheckCircle2, AlertCircle, RefreshCw,
  Code, Users, Building2, HardHat, Laptop, ArrowRight, Play, Eye
} from "lucide-react";
import "@/app/dashboard.css";

export default function ApiTesterPage() {
  const [activeTab, setActiveTab] = useState<"computer" | "civil">("computer");
  const [loading, setLoading] = useState(false);
  const [deptData, setDeptData] = useState<any>(null);
  const [alumniList, setAlumniList] = useState<any[]>([]);
  const [apiResponse, setApiResponse] = useState<string>("// Response will appear here after clicking an API button");
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  // Form state for creating alumni
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("+91 98765 00000");
  const [formCompany, setFormCompany] = useState("");
  const [formRole, setFormRole] = useState("");
  const [formLocation, setFormLocation] = useState("Gujarat, India");
  const [formYear, setFormYear] = useState("2025");
  const [formSkills, setFormSkills] = useState("");
  const [formBio, setFormBio] = useState("");

  useEffect(() => {
    if (activeTab === "computer") {
      setFormCompany("Google");
      setFormRole("Cloud Solutions Architect");
      setFormSkills("React, Next.js, Node.js, PostgreSQL, Docker");
      setFormBio("Experienced software architect specializing in scalable microservices and cloud deployments.");
    } else {
      setFormCompany("L&T Construction");
      setFormRole("Senior Project Engineer");
      setFormSkills("AutoCAD, STAAD Pro, Structural Engineering, BIM");
      setFormBio("Infrastructure engineer leading smart city highway and bridge construction projects.");
    }
    loadDeptSummary(activeTab);
  }, [activeTab]);

  const loadDeptSummary = async (slug: "computer" | "civil") => {
    try {
      setLoading(true);
      const res = await fetch(`/api/departments/${slug}`);
      const data = await res.json();
      setDeptData(data.department || null);
      setResponseStatus(res.status);
      setApiResponse(JSON.stringify(data, null, 2));

      // Also load alumni
      const aRes = await fetch(`/api/departments/${slug}/alumni?limit=8`);
      const aData = await aRes.json();
      setAlumniList(aData.alumni || []);
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleTestGetDept = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/departments/${activeTab}`);
      const data = await res.json();
      setResponseStatus(res.status);
      setApiResponse(JSON.stringify(data, null, 2));
      if (data.department) setDeptData(data.department);
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleTestGetAlumni = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/departments/${activeTab}/alumni?limit=10`);
      const data = await res.json();
      setResponseStatus(res.status);
      setApiResponse(JSON.stringify(data, null, 2));
      if (data.alumni) setAlumniList(data.alumni);
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAlumni = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formEmail) {
      alert("Name and Email are required");
      return;
    }
    setLoading(true);

    const payload = {
      name: formName,
      email: formEmail,
      phone: formPhone,
      company: formCompany,
      role: formRole,
      location: formLocation,
      graduation_year: formYear,
      skills: formSkills.split(",").map((s) => s.trim()).filter(Boolean),
      bio: formBio,
      achievements: [`Tolani ${activeTab.toUpperCase()} Graduate ${formYear}`],
    };

    try {
      const res = await fetch(`/api/departments/${activeTab}/alumni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponseStatus(res.status);
      setApiResponse(JSON.stringify(data, null, 2));

      if (res.ok && data.success) {
        // Refresh summary
        loadDeptSummary(activeTab);
        // Reset name & email to prevent duplicate click
        setFormName("");
        setFormEmail("");
      }
    } catch (err: any) {
      setApiResponse(JSON.stringify({ error: err.message }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f8] flex flex-col">
      <Header activePage="departments" />

      {/* Top Banner */}
      <section className="bg-gradient-to-r from-[#701422] to-[#9B2335] text-white py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-red-100 mb-3 border border-white/20">
              <Database size={14} className="text-emerald-300" />
              PostgreSQL Direct Storage API
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Computer & Civil Department API Dashboard
            </h1>
            <p className="text-sm text-red-100/90 mt-2 max-w-2xl font-medium">
              Real-time PostgreSQL database API for Computer Engineering (ID: 1) and Civil Engineering (ID: 2). Test GET queries and POST new data directly into the database.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              href="/departments/computer"
              className="px-4 py-2.5 rounded-xl bg-white text-[#9B2335] text-xs font-bold shadow-md hover:bg-gray-100 transition-all flex items-center gap-1.5"
            >
              <Laptop size={14} /> Computer Page <ArrowRight size={12} />
            </Link>
            <Link
              href="/departments/civil"
              className="px-4 py-2.5 rounded-xl bg-white text-[#9B2335] text-xs font-bold shadow-md hover:bg-gray-100 transition-all flex items-center gap-1.5"
            >
              <HardHat size={14} /> Civil Page <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 flex-1 w-full space-y-8">
        
        {/* Department Switcher Tabs */}
        <div className="flex items-center gap-3 border-b border-gray-200 pb-3">
          <button
            onClick={() => setActiveTab("computer")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "computer"
                ? "bg-[#9B2335] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Laptop size={16} /> Computer Engineering (CSE - ID: 1)
          </button>
          <button
            onClick={() => setActiveTab("civil")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "civil"
                ? "bg-[#9B2335] text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <HardHat size={16} /> Civil Engineering (Civil - ID: 2)
          </button>
        </div>

        {/* Live Dept Stats Overview Card */}
        {deptData && (
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Department</span>
              <div className="text-lg font-extrabold text-gray-900 mt-0.5">{deptData.name}</div>
              <div className="text-xs text-gray-500 font-mono mt-1">slug: {deptData.slug} | id: {deptData.id}</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Catalog Alumni Count</span>
              <div className="text-2xl font-black text-[#9B2335] mt-0.5">
                {deptData.alumni_count?.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500 mt-1">Auto-updated via DB Trigger</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Live DB Registered Rows</span>
              <div className="text-2xl font-black text-emerald-600 mt-0.5">
                {deptData.total_registered_alumni}
              </div>
              <div className="text-xs text-gray-500 mt-1">Rows in table `members`</div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-200/80 shadow-xs">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Top Hiring Companies</span>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {deptData.top_companies?.slice(0, 3).map((c: string) => (
                  <span key={c} className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-800 text-[11px] font-semibold">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Two Columns: Action Form & API Playground Console */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: POST Insert Form (Data Store) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 border border-gray-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Database size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">
                    Insert Data into PostgreSQL DB
                  </h3>
                  <p className="text-xs text-gray-500">
                    POST /api/departments/{activeTab}/alumni
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold">
                POST 201
              </span>
            </div>

            <form onSubmit={handleCreateAlumni} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aman Varma"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. aman@example.com"
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Graduation Year</label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Job Role</label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Skills (comma-separated)</label>
                <input
                  type="text"
                  value={formSkills}
                  onChange={(e) => setFormSkills(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-maroon py-3 rounded-xl text-xs font-extrabold shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send size={14} /> Store into Database (POST /api/departments/{activeTab}/alumni)
              </button>
            </form>
          </div>

          {/* Right Column: Interactive API Console & Output */}
          <div className="lg:col-span-6 space-y-4 flex flex-col">
            <div className="bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-800 flex-1 flex flex-col text-gray-100">
              
              {/* Header with Quick Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <Code size={16} className="text-emerald-400" />
                  <span className="font-mono text-xs font-bold text-gray-200">
                    API Response Console
                  </span>
                  {responseStatus && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                        responseStatus >= 200 && responseStatus < 300
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      HTTP {responseStatus}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTestGetDept}
                    disabled={loading}
                    className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-[11px] font-mono text-gray-300 hover:text-white transition-colors"
                  >
                    GET Dept
                  </button>
                  <button
                    onClick={handleTestGetAlumni}
                    disabled={loading}
                    className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-[11px] font-mono text-gray-300 hover:text-white transition-colors"
                  >
                    GET Alumni
                  </button>
                  <button
                    onClick={() => loadDeptSummary(activeTab)}
                    disabled={loading}
                    className="w-7 h-7 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white flex items-center justify-center transition-colors"
                    title="Refresh"
                  >
                    <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
                  </button>
                </div>
              </div>

              {/* JSON code block display */}
              <div className="mt-4 flex-1">
                <pre className="text-[11px] font-mono bg-black/60 p-4 rounded-2xl overflow-x-auto max-h-[380px] text-emerald-300 leading-relaxed border border-gray-800">
                  {apiResponse}
                </pre>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  PostgreSQL Local: Alumni_Portal (Port 5432)
                </span>
                <span className="font-mono text-gray-500">Node-Postgres Pool Active</span>
              </div>
            </div>

            {/* Live Database Members List for Selected Department */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-[#9B2335]" />
                  <h4 className="font-extrabold text-sm text-gray-900">
                    Live Members in {deptData?.name || activeTab}
                  </h4>
                </div>
                <span className="text-xs font-bold text-gray-500">
                  {alumniList.length} shown
                </span>
              </div>

              <div className="space-y-2 max-h-[220px] overflow-y-auto">
                {alumniList.map((m: any) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-red-50/50 transition-colors border border-gray-100 text-xs"
                  >
                    <div>
                      <div className="font-extrabold text-gray-900 flex items-center gap-1.5">
                        {m.name}
                        <span className="font-mono text-[10px] text-gray-400">#{m.id}</span>
                      </div>
                      <div className="text-gray-500 text-[11px]">
                        {m.role} at <span className="font-semibold text-gray-700">{m.company}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full bg-white text-[#9B2335] border border-red-200 text-[10px] font-bold">
                        {m.graduation_year}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
