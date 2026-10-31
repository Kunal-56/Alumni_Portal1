"use client";

import { useState, useEffect } from "react";

/* ─── Member Interface ─── */
export interface Member {
  id: number;
  name: string;
  degree: string;
  year: string;
  dept: string;
  company: string;
  role: string;
  location: string;
  email: string;
  phone: string;
  dob?: string;
  gender?: string;
  linkedin: string;
  bio: string;
  skills: string[];
  achievements: string[];
  experience?: string | number;
  institute?: string;
  avatar?: string;
  verified: boolean;
  verificationMethod?: "email" | "mobile";
  createdAt?: string;
}

/* ─── Initial Seed Members (Pure DB driven, 0 mock records) ─── */
export const INITIAL_MEMBERS: Member[] = [];

const STORAGE_KEY = "tolani_alumni_db_cache_v2";

/* ─── LocalStorage Helpers (DB Cache Only) ─── */
export function getStoredMembers(): Member[] {
  if (typeof window === "undefined") return [];
  try {
    // Purge old mock data cache
    localStorage.removeItem("tolani_alumni_members_v1");
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
  } catch (err) {
    console.error("Error reading cached alumni members:", err);
  }
  return [];
}

export function saveMembers(members: Member[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    window.dispatchEvent(new Event("alumni_members_updated"));
  } catch (err) {
    console.error("Error saving alumni members cache:", err);
  }
}

export function addMember(newMember: Omit<Member, "id"> & { id?: number }): Member {
  const current = getStoredMembers();
  const maxId = current.reduce((max, m) => Math.max(max, m.id), 0);
  const memberWithId: Member = {
    ...newMember,
    id: newMember.id || maxId + 1,
    verified: newMember.verified !== undefined ? newMember.verified : true,
    createdAt: newMember.createdAt || new Date().toISOString(),
  };
  saveMembers([...current.filter((m) => m.id !== memberWithId.id), memberWithId]);
  return memberWithId;
}

export function getMemberById(id: number): Member | undefined {
  return getStoredMembers().find((m) => m.id === id);
}

/* ─── React Hook for Live Sync & Database Fetch ─── */
export function useAlumniMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingDb, setLoadingDb] = useState(true);

  const fetchLiveMembers = async () => {
    try {
      setLoadingDb(true);
      const res = await fetch("/api/alumni?limit=500");
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.alumni)) {
          // Exactly the members in PostgreSQL database
          setMembers(json.alumni);
          saveMembers(json.alumni);
          setIsLoaded(true);
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch alumni from DB API, using cached data:", err);
    } finally {
      setLoadingDb(false);
      setIsLoaded(true);
    }

    // Only fallback to verified cache, never to hardcoded dummy records
    const cached = getStoredMembers();
    setMembers(cached);
  };

  useEffect(() => {
    // 1. Initial cached state (if any)
    const cached = getStoredMembers();
    if (cached.length > 0) {
      setMembers(cached);
    }

    // 2. Fetch live data from PostgreSQL Database API
    fetchLiveMembers();

    // 3. Listen for internal event triggers
    const handleUpdate = () => fetchLiveMembers();
    window.addEventListener("alumni_members_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("alumni_members_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleAddMember = (data: Omit<Member, "id"> & { id?: number }) => {
    const created = addMember(data);
    fetchLiveMembers();
    return created;
  };

  return {
    members,
    totalCount: members.length,
    isLoaded,
    loadingDb,
    refresh: fetchLiveMembers,
    addMember: handleAddMember,
    getMemberById: (id: number) => members.find((m) => m.id === id),
  };
}
