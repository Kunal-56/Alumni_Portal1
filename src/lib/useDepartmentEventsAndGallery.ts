"use client";

import { useState, useEffect } from "react";

export interface DepartmentEventItem {
  id: string;
  numericId?: number;
  title: string;
  slug?: string;
  day: string;
  month: string;
  year?: string;
  dateFormatted?: string;
  time: string;
  location: string;
  desc: string;
  description?: string;
  img?: string;
  image_url?: string;
  type?: string;
  raw_type?: string;
  mode?: string;
  tags?: string[];
  is_online?: boolean;
  registration_count?: number;
}

export interface DepartmentGalleryItem {
  id: string;
  numericId?: number;
  label: string;
  category?: string;
  raw_category?: string;
  year?: string;
  desc?: string;
  description?: string;
  img?: string;
  image_url?: string;
  bg?: string;
  bg_color?: string;
  sort_order?: number;
}

export function useDepartmentEventsAndGallery(
  departmentSlug: string,
  initialEvents: any[] = [],
  initialGallery: any[] = []
) {
  const [events, setEvents] = useState<DepartmentEventItem[]>(initialEvents);
  const [gallery, setGallery] = useState<DepartmentGalleryItem[]>(initialGallery);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingGallery, setLoadingGallery] = useState(true);
  const [dbDepartment, setDbDepartment] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      // 1. Fetch from department endpoint
      try {
        const res = await fetch(`/api/departments/${departmentSlug}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && isMounted) {
            if (json.department) setDbDepartment(json.department);
            if (Array.isArray(json.events) && json.events.length > 0) {
              setEvents(json.events);
              setLoadingEvents(false);
            }
            if (Array.isArray(json.gallery) && json.gallery.length > 0) {
              setGallery(json.gallery);
              setLoadingGallery(false);
            }
          }
        }
      } catch (err) {
        console.warn(`Failed to fetch /api/departments/${departmentSlug}:`, err);
      }

      // 2. Fetch all events directly from /api/events to guarantee full sync
      try {
        const evRes = await fetch("/api/events");
        if (evRes.ok) {
          const evJson = await evRes.json();
          if (evJson.success && Array.isArray(evJson.events) && evJson.events.length > 0) {
            if (isMounted) {
              setEvents(evJson.events);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to fetch /api/events:", err);
      } finally {
        if (isMounted) setLoadingEvents(false);
      }

      // 3. Fetch all gallery items directly from /api/gallery to guarantee full sync
      try {
        const galRes = await fetch("/api/gallery");
        if (galRes.ok) {
          const galJson = await galRes.json();
          const items = galJson.items || galJson.gallery;
          if (galJson.success && Array.isArray(items) && items.length > 0) {
            if (isMounted) {
              setGallery(items);
            }
          }
        }
      } catch (err) {
        console.warn("Failed to fetch /api/gallery:", err);
      } finally {
        if (isMounted) setLoadingGallery(false);
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, [departmentSlug]);

  return {
    events,
    gallery,
    loadingEvents,
    loadingGallery,
    dbDepartment,
  };
}

