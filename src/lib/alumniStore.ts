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

// Fast In-Memory Cache (SWR Pattern for Instant 0ms Page Navigation)
let _memoryCache: { members: Member[]; totalCount: number; fetchedAt: number } | null = null;

/* ─── React Hook for Live Sync & Database Fetch (Instant Render) ─── */
export function useAlumniMembers() {
  // Always initialize with empty state on SSR & initial client hydration to prevent hydration mismatch
  const [members, setMembers] = useState<Member[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadingDb, setLoadingDb] = useState(true);

  const fetchLiveMembers = async (force = false) => {
    // If fetched recently in memory, reuse cache instantly without making the browser wait
    if (!force && _memoryCache && Date.now() - _memoryCache.fetchedAt < 15000) {
      setMembers(_memoryCache.members);
      setTotalCount(_memoryCache.totalCount);
      setLoadingDb(false);
      return;
    }

    try {
      const res = await fetch("/api/alumni?limit=500", {
        headers: { "Accept": "application/json" }
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.alumni)) {
          const count = typeof json.pagination?.total === "number" ? json.pagination.total : json.alumni.length;
          _memoryCache = {
            members: json.alumni,
            totalCount: count,
            fetchedAt: Date.now()
          };
          setMembers(json.alumni);
          setTotalCount(count);
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

    const cached = getStoredMembers();
    setMembers(cached);
    setTotalCount(cached.length);
  };

  useEffect(() => {
    // Synchronously hydrate from cache immediately on mount
    const cached = _memoryCache?.members || getStoredMembers();
    if (cached.length > 0) {
      setMembers(cached);
      setTotalCount(_memoryCache?.totalCount || cached.length);
      setLoadingDb(false);
    }
    setIsLoaded(true);

    // Background revalidation (never blocks the initial render)
    fetchLiveMembers();

    const handleUpdate = () => {
      _memoryCache = null; // Invalidate cache on live updates
      fetchLiveMembers(true);
    };
    window.addEventListener("alumni_members_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("alumni_members_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleAddMember = (data: Omit<Member, "id"> & { id?: number }) => {
    const created = addMember(data);
    _memoryCache = null;
    fetchLiveMembers(true);
    return created;
  };

  return {
    members,
    totalCount: totalCount || members.length,
    isLoaded,
    loadingDb,
    refresh: () => fetchLiveMembers(true),
    addMember: handleAddMember,
    getMemberById: (id: number) => members.find((m) => m.id === id),
  };
}
