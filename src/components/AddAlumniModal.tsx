"use client";

import React, { useState } from "react";
import { X, CheckCircle2, AlertCircle, Database, Sparkles, UserPlus, Loader2 } from "lucide-react";

interface AddAlumniModalProps {
  isOpen: boolean;
  onClose: () => void;
  departmentSlug: "computer" | "civil" | string;
  departmentName: string;
  onSuccess: (newMember: any) => void;
}

export function AddAlumniModal({
  isOpen,
  onClose,
  departmentSlug,
  departmentName,
  onSuccess,
}: AddAlumniModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [graduationYear, setGraduationYear] = useState("2025");
  const [degree, setDegree] = useState("B.Tech");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [location, setLocation] = useState("");
  const [skillsStr, setSkillsStr] = useState(
    departmentSlug === "civil"
      ? "AutoCAD, STAAD Pro, Project Management"
      : "React, Node.js, Python, Cloud"
  );
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<any>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const skills = skillsStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        graduation_year: graduationYear,
        degree,
        company: company.trim(),
        role: role.trim(),
        location: location.trim(),
        skills,
        bio: bio.trim() || `${role} at ${company}. Proud alumni of ${departmentName}.`,
        achievements: [`Tolani ${departmentName} Alumnus`],
      };

      const res = await fetch(`/api/departments/${departmentSlug}/alumni`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to store alumni in PostgreSQL database");
      }

      setSuccessData(data);
      onSuccess(data.member);
    } catch (err: any) {
      console.error("Error saving alumni:", err);
      setError(err.message || "Something went wrong while saving to database");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("+91 ");
    setCompany("");
    setRole("");
    setLocation("");
    setBio("");
    setError(null);
    setSuccessData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-[#801423] to-[#9B2335] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
              <Database size={18} className="text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Add {departmentName} Alumnus</h3>
              <p className="text-xs text-red-100 font-medium">
                Tolani Alumni Network Directory
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {successData ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={36} />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900">Successfully Stored in PostgreSQL!</h4>
                <p className="text-sm text-gray-600 mt-1">
                  <b>{successData.member?.name}</b> is now stored in the database table <code>members</code> for {departmentName}.
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-left text-xs text-gray-700 space-y-1.5 border border-gray-200/80">
                <div className="flex justify-between">
                  <span className="text-gray-500">Database Record ID:</span>
                  <span className="font-mono font-bold text-gray-900">#{successData.member?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Department:</span>
                  <span className="font-semibold">{departmentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Company & Role:</span>
                  <span className="font-semibold">{successData.member?.role} at {successData.member?.company}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Updated Department Alumni Count:</span>
                  <span className="font-mono font-bold text-emerald-600">
                    {successData.department_alumni_count ?? "Updated"}
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSuccessData(null);
                    setName("");
                    setEmail("");
                    setCompany("");
                    setRole("");
                  }}
                  className="px-4 py-2 text-xs font-bold text-[#9B2335] bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                >
                  Add Another Member
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="btn-maroon px-6 py-2 text-xs font-bold shadow-sm"
                >
                  Done & View on Page
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Degree</label>
                  <select
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335] bg-white"
                  >
                    <option value="B.Tech">B.Tech</option>
                    <option value="Diploma">Diploma</option>
                    <option value="M.Tech">M.Tech</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Graduation Year</label>
                  <select
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335] bg-white"
                  >
                    {["2026", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"].map(
                      (yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Company / Organization</label>
                  <input
                    type="text"
                    placeholder="e.g. Google, L&T, Infosys"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Job Role / Designation</label>
                  <input
                    type="text"
                    placeholder="e.g. Software Engineer, Site Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Current Location / City</label>
                <input
                  type="text"
                  placeholder="e.g. Bangalore, India or Ahmedabad, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Skills <span className="text-gray-400 font-normal">(comma-separated)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Python or AutoCAD, STAAD Pro"
                  value={skillsStr}
                  onChange={(e) => setSkillsStr(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Bio / Profile Summary</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of professional journey and expertise..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-[#9B2335] focus:ring-1 focus:ring-[#9B2335]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-maroon px-5 py-2.5 text-xs font-bold shadow-md inline-flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" /> Saving to Database...
                    </>
                  ) : (
                    <>
                      <UserPlus size={14} /> Save to PostgreSQL
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
