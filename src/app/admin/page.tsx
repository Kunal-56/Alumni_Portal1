"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  ImageIcon,
  Newspaper,
  Users,
  LayoutDashboard,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  ExternalLink,
  Sparkles,
  X,
  Clock,
  MapPin,
  ChevronRight,
  AlertTriangle,
  Upload,
  Globe,
  Building2,
  Calendar,
  BookOpen,
  User,
  Eye,
  Check,
  Briefcase,
  GraduationCap,
  Mail,
  Heart,
  TrendingUp,
  Download,
  RotateCw,
  Search,
  Filter,
  Phone,
  Table as TableIcon,
  LayoutGrid,
  ShieldCheck,
  CheckCircle,
  Loader2,
} from "lucide-react";
import "@/app/dashboard.css";

// ─── Preset Images Available ───
const PRESET_IMAGES = [
  { label: "Campus Building", url: "/campus-building.png" },
  { label: "Computer Department", url: "/computer-hero.jpg" },
  { label: "Campus Exact", url: "/campus-building-exact.png" },
  { label: "Tolani Logo", url: "/logo.jpg" },
];

// ─── Data Interfaces ───
interface EventItem {
  id: string | number;
  day: string;
  month: string;
  year: string;
  title: string;
  type: string;
  mode: "Online" | "Offline" | "Hybrid";
  time: string;
  location: string;
  desc: string;
  tags: string[];
  img: string;
}

interface GalleryItem {
  id: string | number;
  image_url?: string;
  bg_color?: string;
  label: string;
  category: string;
  year: string;
  desc: string;
  img: string;
  bg?: string;
}

interface NewsItem {
  id: string | number;
  title: string;
  slug?: string;
  date: string;
  category: string;
  raw_category?: string;
  author: string;
  readTime: string;
  read_time?: string;
  excerpt: string;
  content?: string;
  img: string;
  image_url?: string;
  featured: boolean;
  is_featured?: boolean;
  published_at?: string;
}

interface MemberItem {
  id: string | number;
  user_id?: string | null;
  name: string;
  email: string;
  phone?: string | null;
  dob?: string | null;
  gender?: string | null;
  degree?: string | null;
  year?: string | null;
  graduation_year?: string | null;
  department_id?: number | null;
  department_name?: string | null;
  department_short?: string | null;
  dept?: string | null;
  institute?: string | null;
  company?: string | null;
  role?: string | null;
  industry?: string | null;
  location?: string | null;
  experience?: string | number | null;
  experience_years?: number | null;
  linkedin?: string | null;
  linkedin_url?: string | null;
  bio?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  verified: boolean;
  verification_method?: string | null;
  created_at?: string | null;
  skills?: string[] | null;
  achievements?: string[] | null;
}

// ─── Initial Data (Matching public website content) ───
const INITIAL_EVENTS: EventItem[] = [
  {
    id: "evt-1",
    day: "25",
    month: "JUN",
    year: "2026",
    title: "Global Alumni Meet 2026",
    type: "Virtual Event",
    mode: "Online",
    time: "10:00 AM",
    location: "Online",
    desc: "Join alumni from across the world for an inspiring virtual meet. This flagship event brings together thousands of Tolani alumni to reconnect, share experiences and celebrate achievements...",
    tags: ["Virtual", "Networking"],
    img: "/campus-building.png",
  },
  {
    id: "evt-2",
    day: "10",
    month: "JUL",
    year: "2026",
    title: "Career Growth & Mentorship Webinar",
    type: "Online Session",
    mode: "Online",
    time: "04:00 PM",
    location: "Online",
    desc: "Learn from industry experts and explore new career opportunities. This session covers resume building, interview tips and the latest job market trends.",
    tags: ["Career", "Online"],
    img: "/computer-hero.jpg",
  },
  {
    id: "evt-3",
    day: "18",
    month: "AUG",
    year: "2026",
    title: "Code. Connect. Contribute.",
    type: "Department Meetup",
    mode: "Offline",
    time: "11:00 AM",
    location: "Tolani Campus",
    desc: "A meetup for developers to collaborate and build together. Showcase your projects, connect with tech alumni and contribute to open source initiatives.",
    tags: ["Tech", "In-Person"],
    img: "/computer-hero.jpg",
  },
  {
    id: "evt-4",
    day: "30",
    month: "AUG",
    year: "2026",
    title: "Alumni Leadership Talk",
    type: "In-Person Event",
    mode: "Offline",
    time: "02:00 PM",
    location: "Tolani Auditorium",
    desc: "An interactive session with accomplished alumni leaders. Gain insights on leadership, entrepreneurship and building a successful career.",
    tags: ["Leadership", "In-Person"],
    img: "/campus-building.png",
  },
];

const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: "gal-1",
    label: "Alumni Meet 2026",
    category: "Annual Event",
    year: "2026",
    desc: "A grand gathering of Tolani alumni from across the globe, celebrating bonds and shared memories.",
    img: "/campus-building.png",
  },
  {
    id: "gal-2",
    label: "Virtual Alumni Reunion",
    category: "Virtual",
    year: "2026",
    desc: "An online reunion connecting alumni from 50+ countries through screens and shared stories.",
    img: "/campus-building.png",
  },
  {
    id: "gal-3",
    label: "Networking Session",
    category: "Networking",
    year: "2026",
    desc: "An evening of meaningful connections, collaborations and career conversations among alumni.",
    img: "/campus-building.png",
  },
  {
    id: "gal-4",
    label: "Campus Visit",
    category: "Campus",
    year: "2026",
    desc: "Alumni walked the hallways they once called home, reliving the golden days of their college years.",
    img: "/campus-building.png",
  },
  {
    id: "gal-5",
    label: "Guest Lecture Series",
    category: "Academic",
    year: "2026",
    desc: "Distinguished alumni shared their journeys and insights with current students and fellow graduates.",
    img: "/computer-hero.jpg",
  },
  {
    id: "gal-6",
    label: "Cultural Night 2026",
    category: "Cultural",
    year: "2026",
    desc: "A vibrant evening filled with music, dance and art celebrating the diverse cultures of Tolani.",
    img: "/campus-building.png",
  },
];

const INITIAL_NEWS: NewsItem[] = [
  {
    id: "nws-1",
    title: "Tolani Alumni Association – Dar es Salaam, Tanzania Alumni Reunion 2026–27",
    date: "Aug 05, 2026",
    category: "Reunion",
    author: "Alumni Relations Team",
    readTime: "3 min read",
    excerpt: "The Tolani Alumni Association successfully organized a grand reunion in Dar es Salaam, Tanzania, bringing together over 200 alumni from East Africa.",
    content: `The Tolani Alumni Association successfully organized a grand reunion in Dar es Salaam, Tanzania, bringing together over 200 alumni from East Africa. The event was a celebration of shared memories, professional achievements and the enduring bonds of the Tolani community.

Distinguished speakers recalled their college days at Tolani and shared inspiring stories of global entrepreneurship and public service. A new East Africa alumni scholarship fund was also announced during the gala dinner.`,
    img: "/campus-building.png",
    featured: true,
  },
  {
    id: "nws-2",
    title: "Building a Stronger Alumni Community: Northeast Chapters Virtual Reunion",
    date: "Aug 03, 2026",
    category: "Community",
    author: "Chapter Coordinators",
    readTime: "4 min read",
    excerpt: "Alumni from the Northeast chapters of India gathered virtually for an emotional and inspiring reunion. The event featured panel discussions and networking rooms.",
    content: `Alumni from the Northeast chapters of India gathered virtually for an emotional and inspiring reunion. The event featured panel discussions, networking breakout rooms and a heartfelt tribute to faculty members.

More than 150 participants from Guwahati, Shillong, and Imphal engaged in interactive mentor-student sessions.`,
    img: "/campus-building.png",
    featured: true,
  },
  {
    id: "nws-3",
    title: "Strengthening Connections: Virtual Alumni Reunion for Jharkhand, Chhattisgarh & MP",
    date: "Jul 31, 2026",
    category: "Reunion",
    author: "Regional Chapter Team",
    readTime: "2 min read",
    excerpt: "A landmark virtual reunion brought together alumni from central Indian states, fostering regional bonds and new professional collaborations.",
    content: `A landmark virtual reunion brought together alumni from four central Indian states, fostering regional bonds and new professional collaborations.

Attendees pledged support for student internships and career guidance drives across Tolani engineering departments.`,
    img: "/campus-building.png",
    featured: true,
  },
  {
    id: "nws-4",
    title: "Tolani Alumni Entrepreneur Raises ₹50 Crore in Series B Funding",
    date: "Jul 25, 2026",
    category: "Success Story",
    author: "Alumni Portal Editorial",
    readTime: "5 min read",
    excerpt: "Batch 2018 alumnus Mr. Harsh Mehta's EdTech startup secured ₹50 crore in Series B funding from leading venture capital firms.",
    content: `Batch 2018 alumnus Mr. Harsh Mehta's EdTech startup secured ₹50 crore in Series B funding from leading venture capital firms. His journey from a Tolani student to a successful entrepreneur is an inspiration to thousands.

This achievement continues to build upon Tolani Foundation Gandhidham Polytechnic's long-standing tradition of nurturing professionals who go on to make a significant impact in their respective fields across the globe.`,
    img: "/computer-hero.jpg",
    featured: false,
  },
];

const INITIAL_MEMBERS: MemberItem[] = [
  {
    id: "mem-1",
    name: "Dr. Rajesh Vora",
    email: "rajesh.vora@example.com",
    dept: "Computer",
    year: "2012",
    company: "Google Cloud",
    role: "Staff Architect",
    verified: true,
    location: "Ahmedabad",
    degree: "B.Tech",
  },
  {
    id: "mem-2",
    name: "Pooja Mehta",
    email: "pooja.mehta@example.com",
    dept: "Civil",
    year: "2018",
    company: "L&T Construction",
    role: "Project Manager",
    verified: true,
    location: "Mumbai",
    degree: "B.Tech",
  },
  {
    id: "mem-3",
    name: "Amit Patel",
    email: "amit.patel@example.com",
    dept: "Mechanical",
    year: "2015",
    company: "Tata Motors",
    role: "Lead R&D Engineer",
    verified: true,
    location: "Pune",
    degree: "B.Tech",
  },
  {
    id: "mem-4",
    name: "Anjali Dave",
    email: "anjali.dave@example.com",
    dept: "Electrical",
    year: "2020",
    company: "Siemens India",
    role: "Systems Specialist",
    verified: true,
    location: "Gandhinagar",
    degree: "B.Tech",
  },
];

interface CampaignItem {
  id: string;
  tag: string;
  title: string;
  desc: string;
  raised: string;
  target: string;
  raisedNum: number;
  targetNum: number;
  percentage: number;
  donors: number;
  daysLeft: number;
  category: string;
  img: string;
}

const INITIAL_CAMPAIGNS: CampaignItem[] = [
  {
    id: "camp-1", tag: "Education Support", title: "Scholarship Fund",
    desc: "Help deserving students achieve their dreams with financial support. Every rupee counts towards a brighter future.",
    raised: "₹2,50,000", target: "₹5,00,000", raisedNum: 250000, targetNum: 500000, percentage: 50, donors: 128, daysLeft: 45, category: "Education", img: "/campus-building.png",
  },
  {
    id: "camp-2", tag: "Infrastructure", title: "Campus Development Fund",
    desc: "Build a modern and smart campus for future generations. Better facilities create better learning environments.",
    raised: "₹3,20,000", target: "₹6,00,000", raisedNum: 320000, targetNum: 600000, percentage: 53, donors: 204, daysLeft: 60, category: "Infrastructure", img: "/campus-building.png",
  },
  {
    id: "camp-3", tag: "Research & Innovation", title: "Research & Innovation Fund",
    desc: "Support cutting-edge research and innovation by our faculty and students. Drive tomorrow breakthroughs today.",
    raised: "₹1,80,000", target: "₹4,00,000", raisedNum: 180000, targetNum: 400000, percentage: 45, donors: 96, daysLeft: 30, category: "Research", img: "/campus-building.png",
  },
  {
    id: "camp-4", tag: "Alumni Engagement", title: "Alumni Engagement Fund",
    desc: "Connect, support and empower our alumni community. Strengthen the bond between generations.",
    raised: "₹95,000", target: "₹2,00,000", raisedNum: 95000, targetNum: 200000, percentage: 48, donors: 61, daysLeft: 90, category: "Community", img: "/campus-building.png",
  },
];

export default function AdminPortalPage() {
  const router = useRouter();

  // ── Authentication State ──
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // ── Active Navigation Tab ──
  const [activeTab, setActiveTab] = useState<"overview" | "events" | "gallery" | "news" | "members" | "campaigns">("overview");

  // ── Local Mock States (Safe preview mode, no live DB mutation) ──
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [gallery, setGallery] = useState<GalleryItem[]>(INITIAL_GALLERY);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [members, setMembers] = useState<MemberItem[]>([]);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(true);
  const [refreshingMembers, setRefreshingMembers] = useState<boolean>(false);
  const [memberSearch, setMemberSearch] = useState<string>("");
  const [memberDeptFilter, setMemberDeptFilter] = useState<string>("ALL");
  const [memberStatusFilter, setMemberStatusFilter] = useState<string>("ALL");
  const [memberViewMode, setMemberViewMode] = useState<"table" | "cards">("table");
  const [selectedMember, setSelectedMember] = useState<MemberItem | null>(null);
  const [memberDetailModalOpen, setMemberDetailModalOpen] = useState<boolean>(false);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(INITIAL_CAMPAIGNS);

  // ── Event Modal State ──
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [refreshingEvents, setRefreshingEvents] = useState<boolean>(false);
  const [uploadingEventPhoto, setUploadingEventPhoto] = useState<boolean>(false);
  const [savingEvent, setSavingEvent] = useState<boolean>(false);
  const [eventModalOpen, setEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventForm, setEventForm] = useState<{
    title: string;
    day: string;
    month: string;
    year: string;
    time: string;
    mode: "Online" | "Offline" | "Hybrid";
    location: string;
    type: string;
    desc: string;
    tagsInput: string;
    img: string;
  }>({
    title: "",
    day: "25",
    month: "JUN",
    year: "2026",
    time: "10:00 AM",
    mode: "Online",
    location: "Online",
    type: "Virtual Event",
    desc: "",
    tagsInput: "Virtual, Networking",
    img: "/campus-building.png",
  });

  // ── Gallery Modal State ──
  const [loadingGallery, setLoadingGallery] = useState<boolean>(true);
  const [refreshingGallery, setRefreshingGallery] = useState<boolean>(false);
  const [uploadingGalleryPhoto, setUploadingGalleryPhoto] = useState<boolean>(false);
  const [savingGallery, setSavingGallery] = useState<boolean>(false);
  const [galleryModalOpen, setGalleryModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<GalleryItem | null>(null);
  const [galleryForm, setGalleryForm] = useState<{
    label: string;
    category: string;
    year: string;
    desc: string;
    img: string;
  }>({
    label: "",
    category: "Annual Event",
    year: "2026",
    desc: "",
    img: "/campus-building.png",
  });

  // ── News Modal State ──
  const [loadingNews, setLoadingNews] = useState<boolean>(true);
  const [refreshingNews, setRefreshingNews] = useState<boolean>(false);
  const [uploadingNewsBanner, setUploadingNewsBanner] = useState<boolean>(false);
  const [savingNews, setSavingNews] = useState<boolean>(false);
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [newsForm, setNewsForm] = useState<{
    title: string;
    category: string;
    author: string;
    date: string;
    readTime: string;
    excerpt: string;
    content: string;
    img: string;
    featured: boolean;
  }>({
    title: "",
    category: "Reunion",
    author: "Alumni Relations Team",
    date: "Aug 05, 2026",
    readTime: "3 min read",
    excerpt: "",
    content: "",
    img: "/campus-building.png",
    featured: true,
  });

  // ── Reader Modal for Full News Preview ──
  const [previewNewsModal, setPreviewNewsModal] = useState<NewsItem | null>(null);

  // ── Delete Confirmation ──
  const [deleteConfirm, setDeleteConfirm] = useState<{
    type: "event" | "gallery" | "news" | "campaign" | "member";
    id: string;
    title: string;
  } | null>(null);

  // ── Notification Toast ──
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // File input refs for uploading photos
  const eventFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);
  const newsFileRef = useRef<HTMLInputElement>(null);
  const campaignFileRef = useRef<HTMLInputElement>(null);

  // Campaign Modal State
  const [campaignModalOpen, setCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<CampaignItem | null>(null);
  const [campaignForm, setCampaignForm] = useState<{
    title: string; tag: string; category: string; desc: string;
    targetNum: string; raisedNum: string; donors: string; daysLeft: string; img: string;
  }>({ title: "", tag: "Education Support", category: "Education", desc: "", targetNum: "500000", raisedNum: "0", donors: "0", daysLeft: "30", img: "/campus-building.png" });

  // Check authentication
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAdmin =
        sessionStorage.getItem("tolani_admin_authenticated") === "true" ||
        localStorage.getItem("tolani_admin_authenticated") === "true" ||
        sessionStorage.getItem("tolani_user_role") === "admin" ||
        localStorage.getItem("tolani_user_role") === "admin";

      if (isAdmin) {
        setIsAuthenticated(true);
        setIsCheckingAuth(false);
        fetchLiveMembers();
        fetchLiveEvents();
        fetchLiveGallery();
        fetchLiveNews();
      } else {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        router.replace("/login");
      }
    }
  }, [router]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("tolani_admin_authenticated");
      sessionStorage.removeItem("tolani_logged_in");
      sessionStorage.removeItem("tolani_user_role");
      sessionStorage.removeItem("tolani_user_email");
      sessionStorage.removeItem("tolani_user_name");

      localStorage.removeItem("tolani_admin_authenticated");
      localStorage.removeItem("tolani_logged_in");
      localStorage.removeItem("tolani_user_role");
      localStorage.removeItem("tolani_user_email");
      localStorage.removeItem("tolani_user_name");
    }
    setIsAuthenticated(false);
    router.push("/login");
  };

  // ── Image Upload Handler (Converts uploaded image to Base64 preview) ──
  const handleImageFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (imgUrl: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setter(reader.result);
          triggerToast("Image uploaded successfully!");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // ── FETCH LIVE EVENTS FROM DATABASE ──
  const fetchLiveEvents = async (showToast = false) => {
    setRefreshingEvents(true);
    try {
      const res = await fetch("/api/events", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.events)) {
          setEvents(json.events);
          if (showToast) {
            triggerToast(`Database synced: ${json.events.length} events loaded from PostgreSQL!`);
          }
          return;
        }
      }
      throw new Error("Failed to load events from API");
    } catch (err: any) {
      console.warn("Error fetching live events:", err);
      if (showToast) {
        triggerToast("Failed to sync events with database.");
      }
    } finally {
      setLoadingEvents(false);
      setRefreshingEvents(false);
    }
  };

  // ── UPLOAD EVENT PHOTO FROM LOCAL PC ──
  const handleUploadEventPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Fast local preview while uploading
    const previewUrl = URL.createObjectURL(file);
    setEventForm((prev) => ({ ...prev, img: previewUrl }));

    setUploadingEventPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "events");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.url) {
        setEventForm((prev) => ({ ...prev, img: json.url }));
        triggerToast("Local PC image uploaded and stored on server!");
      } else {
        throw new Error(json.error || "Failed to upload image file");
      }
    } catch (err: any) {
      console.error("Local photo upload failed:", err);
      triggerToast(`Upload error: ${err.message || "Could not upload image"}`);
    } finally {
      setUploadingEventPhoto(false);
    }
  };

  // ── EVENT ACTIONS ──
  const openNewEventModal = () => {
    setEditingEvent(null);
    setEventForm({
      title: "",
      day: "15",
      month: "SEP",
      year: "2026",
      time: "10:00 AM",
      mode: "Online",
      location: "Online",
      type: "Virtual Event",
      desc: "",
      tagsInput: "Virtual, Networking",
      img: "/campus-building.png",
    });
    setEventModalOpen(true);
  };

  const openEditEventModal = (item: EventItem) => {
    setEditingEvent(item);
    setEventForm({
      title: item.title,
      day: item.day,
      month: item.month,
      year: item.year,
      time: item.time,
      mode: item.mode || (item.location.toLowerCase().includes("online") ? "Online" : "Offline"),
      location: item.location,
      type: item.type,
      desc: item.desc,
      tagsInput: item.tags.join(", "),
      img: item.img || "/campus-building.png",
    });
    setEventModalOpen(true);
  };

  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim()) {
      triggerToast("Please provide an Event Title / Name");
      return;
    }

    setSavingEvent(true);
    try {
      const payload = {
        title: eventForm.title.trim(),
        day: eventForm.day.trim() || "15",
        month: eventForm.month.trim().toUpperCase() || "SEP",
        year: eventForm.year.trim() || "2026",
        time: eventForm.time.trim() || "10:00 AM",
        mode: eventForm.mode,
        location:
          eventForm.location.trim() ||
          (eventForm.mode === "Online" ? "Online" : "Tolani Auditorium"),
        type: eventForm.type,
        desc: eventForm.desc.trim(),
        tagsInput: eventForm.tagsInput,
        img: eventForm.img || "/campus-building.png",
      };

      if (editingEvent) {
        const res = await fetch(`/api/events/${editingEvent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (res.ok && json.success && json.event) {
          setEvents((prev) =>
            prev.map((ev) => (String(ev.id) === String(editingEvent.id) ? json.event : ev))
          );
          triggerToast(`Event "${payload.title}" updated in PostgreSQL database!`);
        } else {
          throw new Error(json.error || "Failed to update event in database");
        }
      } else {
        const res = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (res.ok && json.success && json.event) {
          setEvents((prev) => [json.event, ...prev]);
          triggerToast(`New event "${payload.title}" created in PostgreSQL database!`);
        } else {
          throw new Error(json.error || "Failed to create event in database");
        }
      }
      setEventModalOpen(false);
    } catch (err: any) {
      console.error("Save event failed:", err);
      triggerToast(`Error: ${err.message || "Failed to save event to database"}`);
    } finally {
      setSavingEvent(false);
    }
  };

  // ── FETCH LIVE GALLERY FROM DATABASE ──
  const fetchLiveGallery = async (showToast = false) => {
    setRefreshingGallery(true);
    try {
      const res = await fetch("/api/gallery", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.items)) {
          setGallery(json.items);
          if (showToast) {
            triggerToast(`Database synced: ${json.items.length} gallery photos loaded from PostgreSQL!`);
          }
          return;
        }
      }
      throw new Error("Failed to load gallery items from API");
    } catch (err: any) {
      console.warn("Error fetching live gallery:", err);
      if (showToast) {
        triggerToast("Failed to sync gallery with database.");
      }
    } finally {
      setLoadingGallery(false);
      setRefreshingGallery(false);
    }
  };

  // ── UPLOAD GALLERY PHOTO FROM LOCAL PC ──
  const handleUploadGalleryPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const previewUrl = URL.createObjectURL(file);
    setGalleryForm((prev) => ({ ...prev, img: previewUrl }));

    setUploadingGalleryPhoto(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.url) {
        setGalleryForm((prev) => ({ ...prev, img: json.url }));
        triggerToast("Gallery photo uploaded from PC and stored on server!");
      } else {
        throw new Error(json.error || "Failed to upload image file");
      }
    } catch (err: any) {
      console.error("Gallery photo upload failed:", err);
      triggerToast(`Upload error: ${err.message || "Could not upload image"}`);
    } finally {
      setUploadingGalleryPhoto(false);
    }
  };

  // ── GALLERY ACTIONS ──
  const openNewGalleryModal = () => {
    setEditingGallery(null);
    setGalleryForm({
      label: "",
      category: "Annual Event",
      year: "2026",
      desc: "",
      img: "/campus-building.png",
    });
    setGalleryModalOpen(true);
  };

  const openEditGalleryModal = (item: GalleryItem) => {
    setEditingGallery(item);
    setGalleryForm({
      label: item.label,
      category: item.category,
      year: item.year,
      desc: item.desc,
      img: item.img || "/campus-building.png",
    });
    setGalleryModalOpen(true);
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.label.trim()) {
      triggerToast("Please provide an event name or photo label");
      return;
    }

    setSavingGallery(true);
    try {
      const payload = {
        label: galleryForm.label.trim(),
        category: galleryForm.category,
        year: galleryForm.year.trim() || "2026",
        desc: galleryForm.desc.trim(),
        img: galleryForm.img || "/campus-building.png",
      };

      if (editingGallery) {
        const res = await fetch(`/api/gallery/${editingGallery.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (res.ok && json.success && json.item) {
          setGallery((prev) =>
            prev.map((g) => (String(g.id) === String(editingGallery.id) ? json.item : g))
          );
          triggerToast(`Gallery photo "${payload.label}" updated in PostgreSQL database!`);
        } else {
          throw new Error(json.error || "Failed to update gallery photo in database");
        }
      } else {
        const res = await fetch("/api/gallery", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (res.ok && json.success && json.item) {
          setGallery((prev) => [json.item, ...prev]);
          triggerToast(`New gallery photo "${payload.label}" created in PostgreSQL database!`);
        } else {
          throw new Error(json.error || "Failed to save gallery photo in database");
        }
      }
      setGalleryModalOpen(false);
    } catch (err: any) {
      console.error("Save gallery failed:", err);
      triggerToast(`Error: ${err.message || "Failed to save gallery photo to database"}`);
    } finally {
      setSavingGallery(false);
    }
  };

  // ── FETCH LIVE NEWS FROM DATABASE ──
  const fetchLiveNews = async (showToast = false) => {
    setRefreshingNews(true);
    try {
      const res = await fetch("/api/news", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.items)) {
          setNews(json.items);
          if (showToast) {
            triggerToast(`Database synced: ${json.items.length} news articles loaded from PostgreSQL!`);
          }
          return;
        }
      }
    } catch (err) {
      console.warn("Could not fetch news from PostgreSQL API:", err);
    } finally {
      setRefreshingNews(false);
      setLoadingNews(false);
    }
  };

  // ── UPLOAD NEWS BANNER FROM LOCAL PC ──
  const handleUploadNewsBanner = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Instant local preview
    const previewUrl = URL.createObjectURL(file);
    setNewsForm((prev) => ({ ...prev, img: previewUrl }));

    setUploadingNewsBanner(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "news");

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.success && json.url) {
        setNewsForm((prev) => ({ ...prev, img: json.url }));
        triggerToast("News banner uploaded from PC and stored on server!");
      } else {
        throw new Error(json.error || "Failed to upload image file");
      }
    } catch (err: any) {
      console.error("News banner upload failed:", err);
      triggerToast(`Upload error: ${err.message || "Could not upload image"}`);
    } finally {
      setUploadingNewsBanner(false);
    }
  };

  // ── NEWS ACTIONS ──
  const openNewNewsModal = () => {
    setEditingNews(null);
    setNewsForm({
      title: "",
      category: "Reunion",
      author: "Alumni Relations Team",
      date: "Aug 05, 2026",
      readTime: "3 min read",
      excerpt: "",
      content: "",
      img: "/campus-building.png",
      featured: true,
    });
    setNewsModalOpen(true);
  };

  const openEditNewsModal = (item: NewsItem) => {
    setEditingNews(item);
    setNewsForm({
      title: item.title,
      category: item.category,
      author: item.author,
      date: item.date,
      readTime: item.readTime,
      excerpt: item.excerpt,
      content: item.content || item.excerpt,
      img: item.img || "/campus-building.png",
      featured: item.featured,
    });
    setNewsModalOpen(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title.trim()) {
      triggerToast("Please provide an article headline / title");
      return;
    }

    setSavingNews(true);
    try {
      const payload = {
        title: newsForm.title.trim(),
        category: newsForm.category,
        author: newsForm.author.trim() || "Alumni Relations Team",
        date: newsForm.date.trim() || "Aug 05, 2026",
        readTime: newsForm.readTime.trim() || "3 min read",
        excerpt: newsForm.excerpt.trim(),
        content: newsForm.content.trim() || newsForm.excerpt.trim(),
        img: newsForm.img || "/campus-building.png",
        featured: Boolean(newsForm.featured),
      };

      if (editingNews) {
        const res = await fetch(`/api/news/${editingNews.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (res.ok && json.success && json.item) {
          setNews((prev) =>
            prev.map((n) => (String(n.id) === String(editingNews.id) ? json.item : n))
          );
          triggerToast(`News article "${payload.title.slice(0, 30)}..." updated in PostgreSQL database!`);
        } else {
          throw new Error(json.error || "Failed to update news article in database");
        }
      } else {
        const res = await fetch("/api/news", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (res.ok && json.success && json.item) {
          setNews((prev) => [json.item, ...prev]);
          triggerToast(`News article "${payload.title.slice(0, 30)}..." published to PostgreSQL database!`);
        } else {
          throw new Error(json.error || "Failed to publish news article to database");
        }
      }
      setNewsModalOpen(false);
    } catch (err: any) {
      console.error("Save news failed:", err);
      triggerToast(`Save error: ${err.message || "Could not save news article"}`);
    } finally {
      setSavingNews(false);
    }
  };

  // ── FETCH LIVE MEMBERS FROM DATABASE ──
  const fetchLiveMembers = async (showToast = false) => {
    setRefreshingMembers(true);
    try {
      const res = await fetch("/api/alumni?limit=500", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.alumni)) {
          setMembers(json.alumni);
          if (showToast) {
            triggerToast(`Database synced: ${json.alumni.length} members loaded from PostgreSQL!`);
          }
          return;
        }
      }
      throw new Error("Could not load from API");
    } catch (err: any) {
      console.warn("Error fetching live members:", err);
      setMembers((prev) => (prev.length > 0 ? prev : INITIAL_MEMBERS));
      if (showToast) {
        triggerToast("Failed to sync with database. Please check connection.");
      }
    } finally {
      setLoadingMembers(false);
      setRefreshingMembers(false);
    }
  };

  // ── TOGGLE VERIFY MEMBER IN DATABASE ──
  const handleToggleVerify = async (member: MemberItem) => {
    const nextStatus = !member.verified;
    try {
      await fetch(`/api/alumni/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: nextStatus }),
      });
      setMembers((prev) =>
        prev.map((m) =>
          String(m.id) === String(member.id) ? { ...m, verified: nextStatus } : m
        )
      );
      if (selectedMember && String(selectedMember.id) === String(member.id)) {
        setSelectedMember((prev) => (prev ? { ...prev, verified: nextStatus } : null));
      }
      triggerToast(
        nextStatus
          ? `Alumni "${member.name}" marked as Verified in Database!`
          : `Alumni "${member.name}" marked as Unverified.`
      );
    } catch {
      setMembers((prev) =>
        prev.map((m) =>
          String(m.id) === String(member.id) ? { ...m, verified: nextStatus } : m
        )
      );
    }
  };

  // ── EXPORT ALUMNI MEMBERS TO CSV ──
  const handleExportCSV = () => {
    if (members.length === 0) {
      triggerToast("No members available to export");
      return;
    }
    const headers = [
      "ID",
      "Full Name",
      "Email Address",
      "Phone",
      "Degree",
      "Department",
      "Passing Year",
      "Institute",
      "Company",
      "Job Title / Role",
      "Location",
      "Experience (Years)",
      "Skills",
      "Verified",
      "Verification Method",
      "LinkedIn Profile",
      "Bio",
    ];

    const rows = members.map((m) => [
      m.id,
      `"${(m.name || "").replace(/"/g, '""')}"`,
      `"${(m.email || "").replace(/"/g, '""')}"`,
      `"${(m.phone || "").replace(/"/g, '""')}"`,
      `"${(m.degree || "").replace(/"/g, '""')}"`,
      `"${(m.dept || m.department_name || "").replace(/"/g, '""')}"`,
      `"${m.year || m.graduation_year || ""}"`,
      `"${(m.institute || "").replace(/"/g, '""')}"`,
      `"${(m.company || "").replace(/"/g, '""')}"`,
      `"${(m.role || "").replace(/"/g, '""')}"`,
      `"${(m.location || "").replace(/"/g, '""')}"`,
      m.experience_years ?? m.experience ?? "",
      `"${(Array.isArray(m.skills) ? m.skills.join("; ") : "").replace(/"/g, '""')}"`,
      m.verified ? "Yes" : "No",
      m.verification_method || "email",
      `"${(m.linkedin || m.linkedin_url || "").replace(/"/g, '""')}"`,
      `"${(m.bio || "").replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `tolani_alumni_database_members_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast("Alumni members exported to CSV!");
  };

  // ── DELETE ACTIONS ──
  const executeDelete = async () => {
    if (!deleteConfirm) return;
    const { type, id, title } = deleteConfirm;

    if (type === "event") {
      try {
        const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
        if (res.ok) {
          setEvents((prev) => prev.filter((e) => String(e.id) !== String(id)));
          triggerToast(`Event "${title}" permanently removed from database!`);
        } else {
          setEvents((prev) => prev.filter((e) => String(e.id) !== String(id)));
          triggerToast(`Event "${title}" removed!`);
        }
      } catch {
        setEvents((prev) => prev.filter((e) => String(e.id) !== String(id)));
        triggerToast(`Event "${title}" removed!`);
      }
    } else if (type === "gallery") {
      try {
        const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" });
        if (res.ok) {
          setGallery((prev) => prev.filter((g) => String(g.id) !== String(id)));
          triggerToast(`Gallery photo "${title}" permanently removed from database!`);
        } else {
          setGallery((prev) => prev.filter((g) => String(g.id) !== String(id)));
          triggerToast(`Gallery photo "${title}" removed!`);
        }
      } catch {
        setGallery((prev) => prev.filter((g) => String(g.id) !== String(id)));
        triggerToast(`Gallery photo "${title}" removed!`);
      }
    } else if (type === "news") {
      try {
        const res = await fetch(`/api/news/${id}`, { method: "DELETE" });
        if (res.ok) {
          setNews((prev) => prev.filter((n) => String(n.id) !== String(id)));
          triggerToast(`News article "${title}" permanently removed from database!`);
        } else {
          setNews((prev) => prev.filter((n) => String(n.id) !== String(id)));
          triggerToast(`News article "${title}" removed!`);
        }
      } catch {
        setNews((prev) => prev.filter((n) => String(n.id) !== String(id)));
        triggerToast(`News article "${title}" removed!`);
      }
    } else if (type === "member") {
      try {
        const res = await fetch(`/api/alumni/${id}`, { method: "DELETE" });
        if (res.ok) {
          setMembers((prev) => prev.filter((m) => String(m.id) !== String(id)));
          triggerToast(`Member "${title}" removed from database!`);
        } else {
          setMembers((prev) => prev.filter((m) => String(m.id) !== String(id)));
          triggerToast(`Member "${title}" removed!`);
        }
      } catch {
        setMembers((prev) => prev.filter((m) => String(m.id) !== String(id)));
        triggerToast(`Member "${title}" removed`);
      }
    }
    setDeleteConfirm(null);
  };


  // CAMPAIGN ACTIONS
  const openNewCampaignModal = () => {
    setEditingCampaign(null);
    setCampaignForm({ title: "", tag: "Education Support", category: "Education", desc: "", targetNum: "500000", raisedNum: "0", donors: "0", daysLeft: "30", img: "/campus-building.png" });
    setCampaignModalOpen(true);
  };

  const openEditCampaignModal = (item: CampaignItem) => {
    setEditingCampaign(item);
    setCampaignForm({ title: item.title, tag: item.tag, category: item.category, desc: item.desc, targetNum: String(item.targetNum), raisedNum: String(item.raisedNum), donors: String(item.donors), daysLeft: String(item.daysLeft), img: item.img || "/campus-building.png" });
    setCampaignModalOpen(true);
  };

  const handleSaveCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignForm.title.trim()) return;
    const tNum = parseInt(campaignForm.targetNum) || 500000;
    const rNum = parseInt(campaignForm.raisedNum) || 0;
    const pct = tNum > 0 ? Math.min(100, Math.round((rNum / tNum) * 100)) : 0;
    const fmt = (n: number) => "\u20B9" + n.toLocaleString("en-IN");
    if (editingCampaign) {
      setCampaigns(prev => prev.map(c => c.id === editingCampaign.id ? { ...c, title: campaignForm.title.trim(), tag: campaignForm.tag.trim(), category: campaignForm.category, desc: campaignForm.desc.trim(), targetNum: tNum, raisedNum: rNum, percentage: pct, raised: fmt(rNum), target: fmt(tNum), donors: parseInt(campaignForm.donors) || 0, daysLeft: parseInt(campaignForm.daysLeft) || 30, img: campaignForm.img || "/campus-building.png" } : c));
      triggerToast("Campaign updated in Preview Mode!");
    } else {
      const newC: CampaignItem = { id: "camp-" + Date.now(), title: campaignForm.title.trim(), tag: campaignForm.tag.trim(), category: campaignForm.category, desc: campaignForm.desc.trim(), targetNum: tNum, raisedNum: rNum, percentage: pct, raised: fmt(rNum), target: fmt(tNum), donors: parseInt(campaignForm.donors) || 0, daysLeft: parseInt(campaignForm.daysLeft) || 30, img: campaignForm.img || "/campus-building.png" };
      setCampaigns(prev => [newC, ...prev]);
      triggerToast("Campaign added to Preview Mode!");
    }
    setCampaignModalOpen(false);
  };

  const handleDeleteCampaign = (id: string, title: string) => {
    setCampaigns(prev => prev.filter(c => c.id !== id));
    triggerToast("Campaign removed (Preview Mode)");
    void title;
  };
  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F6EFEA] flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-3 bg-white p-8 rounded-3xl border border-[#E9DDD8] shadow-sm max-w-sm text-center">
          <div className="w-10 h-10 rounded-full border-3 border-[#9B2335] border-t-transparent animate-spin" />
          <h2 className="text-base font-extrabold text-gray-900 tracking-tight">Checking Admin Access</h2>
          <p className="text-xs text-gray-500 font-medium leading-relaxed">
            Please login with Admin credentials on the main website login page. Redirecting to login...
          </p>
          <Link href="/login" className="text-xs font-bold text-[#9B2335] hover:underline pt-1">
            Click here to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F2] flex flex-col font-sans text-gray-800 overflow-x-hidden overflow-y-auto pb-24">
      {/* ── Toast Alert ── */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#1e293b] text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 text-sm animate-bounce-short">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 text-gray-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Safe Mode Floating Alert ── */}
      <div className="bg-amber-500 text-amber-950 px-4 py-2 text-xs font-semibold flex items-center justify-between border-b border-amber-600/20 shadow-sm">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <AlertTriangle size={15} className="text-amber-900 shrink-0 animate-pulse" />
          <span>
            <strong>Admin Design & Preview Mode:</strong> Interactive interface enabled. Any additions or edits stay in this preview session and do not overwrite your live database.
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-[11px] text-amber-900">
          <span className="bg-amber-600/20 px-2 py-0.5 rounded-full font-mono">DB Sync: Safe</span>
        </div>
      </div>

      {/* ── Top Navigation Bar ── */}
      <header className="bg-[#181113] text-white border-b border-[#2E1821] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-amber-400/40 shadow">
              <Image src="/logo.jpg" alt="Tolani Logo" fill className="object-contain" unoptimized />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">Tolani Admin</span>
                <span className="bg-[#9B2335] text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                  Portal
                </span>
              </div>
              <p className="text-[11px] text-gray-400 hidden sm:block">Alumni Community Central Management</p>
            </div>
          </div>

          {/* Desktop Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-white/5 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "overview" ? "bg-[#9B2335] text-white shadow" : "text-gray-300 hover:text-white"
              }`}
            >
              <LayoutDashboard size={14} />
              <span>Overview</span>
            </button>
            <button
              onClick={() => setActiveTab("events")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "events" ? "bg-[#9B2335] text-white shadow" : "text-gray-300 hover:text-white"
              }`}
            >
              <CalendarDays size={14} />
              <span>Events ({events.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("gallery")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "gallery" ? "bg-[#9B2335] text-white shadow" : "text-gray-300 hover:text-white"
              }`}
            >
              <ImageIcon size={14} />
              <span>Gallery ({gallery.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("news")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "news" ? "bg-[#9B2335] text-white shadow" : "text-gray-300 hover:text-white"
              }`}
            >
              <Newspaper size={14} />
              <span>News ({news.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === "members" ? "bg-[#9B2335] text-white shadow" : "text-gray-300 hover:text-white"
              }`}
            >
              <Users size={14} />
              <span>Members ({members.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("campaigns")}
              className={`px-3.5 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${activeTab === "campaigns" ? "bg-[#9B2335] text-white shadow" : "text-gray-300 hover:text-white"}`}
            >
              <Heart size={14} />
              <span>Campaigns ({campaigns.length})</span>
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs bg-white/10 hover:bg-white/20 text-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border border-white/10"
              title="Open Public Website in New Tab"
            >
              <span className="hidden sm:inline">View Live Site</span>
              <ExternalLink size={13} />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs bg-red-950/60 hover:bg-red-900/80 text-rose-200 border border-red-800/40 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
              title="Logout from Admin Portal"
            >
              <LogOut size={13} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Sub-Navigation for Mobile ── */}
      <div className="md:hidden bg-white border-b border-gray-200 px-2 py-2 flex items-center justify-around text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            activeTab === "overview" ? "bg-[#9B2335] text-white" : "text-gray-600"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            activeTab === "events" ? "bg-[#9B2335] text-white" : "text-gray-600"
          }`}
        >
          Events
        </button>
        <button
          onClick={() => setActiveTab("gallery")}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            activeTab === "gallery" ? "bg-[#9B2335] text-white" : "text-gray-600"
          }`}
        >
          Gallery
        </button>
        <button
          onClick={() => setActiveTab("news")}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            activeTab === "news" ? "bg-[#9B2335] text-white" : "text-gray-600"
          }`}
        >
          News
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`px-3 py-1.5 rounded-lg font-medium ${
            activeTab === "members" ? "bg-[#9B2335] text-white" : "text-gray-600"
          }`}
        >
          Members
        </button>
        <button
          onClick={() => setActiveTab("campaigns")}
          className={`px-3 py-1.5 rounded-lg font-medium ${activeTab === "campaigns" ? "bg-[#9B2335] text-white" : "text-gray-600"}`}
        >
          Campaigns
        </button>
      </div>

      {/* ── Main Container ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ── TAB 1: OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-fadeIn">
            {/* Banner */}
            <div className="bg-gradient-to-r from-[#9B2335] via-[#821828] to-[#4F0F18] rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Welcome to Admin Portal
                  </h2>
                  <p className="text-rose-100 text-sm mt-1 max-w-xl">
                    Add, edit, or remove Upcoming Events, Gallery Highlights, and News & Updates with exact matching design.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={openNewEventModal}
                    className="bg-white text-[#9B2335] hover:bg-rose-50 px-4 py-2 rounded-xl text-xs font-bold shadow transition-transform active:scale-95 flex items-center gap-1.5"
                  >
                    <Plus size={15} />
                    <span>Add Event</span>
                  </button>
                  <button
                    onClick={openNewGalleryModal}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={15} />
                    <span>Add Photo</span>
                  </button>
                  <button
                    onClick={openNewNewsModal}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={15} />
                    <span>Add News</span>
                  </button>
                  <button
                    onClick={openNewCampaignModal}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    <Plus size={15} />
                    <span>Add Campaign</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
              <div
                onClick={() => setActiveTab("events")}
                className="bg-white p-5 rounded-2xl border border-[#E9DDD8] shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Upcoming Events
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#9B2335] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <CalendarDays size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900">{events.length}</span>
                  <span className="text-xs text-emerald-600 font-semibold">Active Events</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#9B2335] font-semibold">
                  <span>Manage Events</span>
                  <ChevronRight size={14} />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("gallery")}
                className="bg-white p-5 rounded-2xl border border-[#E9DDD8] shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Gallery Highlights
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ImageIcon size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900">{gallery.length}</span>
                  <span className="text-xs text-amber-700 font-semibold">Curated Memories</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-amber-700 font-semibold">
                  <span>Manage Gallery</span>
                  <ChevronRight size={14} />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("news")}
                className="bg-white p-5 rounded-2xl border border-[#E9DDD8] shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    News & Updates
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Newspaper size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900">{news.length}</span>
                  <span className="text-xs text-blue-700 font-semibold">Published Articles</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-blue-700 font-semibold">
                  <span>Manage News</span>
                  <ChevronRight size={14} />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("members")}
                className="bg-white p-5 rounded-2xl border border-[#E9DDD8] shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Alumni Members
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Users size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900">{members.length}</span>
                  <span className="text-xs text-purple-700 font-semibold">Registered Records</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-purple-700 font-semibold">
                  <span>Directory View</span>
                  <ChevronRight size={14} />
                </div>
              </div>

              <div
                onClick={() => setActiveTab("campaigns")}
                className="bg-white p-5 rounded-2xl border border-[#E9DDD8] shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Campaigns
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#9B2335] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Heart size={20} />
                  </div>
                </div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900">{campaigns.length}</span>
                  <span className="text-xs text-[#9B2335] font-semibold">Active Campaigns</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-[#9B2335] font-semibold">
                  <span>Manage Campaigns</span>
                  <ChevronRight size={14} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: UPCOMING EVENTS (Exact match with Image 1) ── */}
        {activeTab === "events" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E9DDD8] shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-rose-50 text-[#9B2335]">
                    <CalendarDays size={20} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span>Upcoming Events Manager</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live PostgreSQL Database
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Add events with photos directly from your local PC, stored in database <code className="bg-gray-100 text-rose-800 px-1 py-0.5 rounded font-mono text-[11px]">events</code> table.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchLiveEvents(true)}
                  disabled={refreshingEvents}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs disabled:opacity-50"
                  title="Reload events from database"
                >
                  <RotateCw size={13} className={refreshingEvents ? "animate-spin text-[#9B2335]" : "text-gray-500"} />
                  <span>{refreshingEvents ? "Syncing..." : "Sync Database"}</span>
                </button>

                <button
                  onClick={openNewEventModal}
                  className="bg-[#9B2335] hover:bg-[#7a1b28] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
                >
                  <Plus size={16} />
                  <span>Add New Event</span>
                </button>

                <div className="text-xs bg-rose-50 text-[#9B2335] px-3 py-2 rounded-xl font-bold border border-rose-200">
                  Total in Database: {events.length}
                </div>
              </div>
            </div>

            {/* Events Grid (Exact Website Style from Image 1) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((ev) => (
                <div
                  key={ev.id}
                  className="event-card group bg-white rounded-2xl border border-[#E9DDD8] overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all relative"
                >
                  {/* Image & Badges */}
                  <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={ev.img || "/campus-building.png"}
                      alt={ev.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />

                    {/* Date Badge */}
                    <div
                      className="absolute top-3 left-3 rounded-xl px-2.5 py-2 text-center shadow-lg"
                      style={{ background: "#9B2335", minWidth: "48px" }}
                    >
                      <div className="text-xl font-extrabold text-white leading-tight">{ev.day}</div>
                      <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider">{ev.month}</div>
                    </div>

                    {/* Mode / Type Badge */}
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-sm shadow flex items-center gap-1"
                      style={{ color: "#9B2335" }}
                    >
                      {ev.mode === "Online" ? <Globe size={11} /> : <Building2 size={11} />}
                      <span>{ev.type || `${ev.mode} Event`}</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="text-sm font-extrabold text-gray-900 mb-2 group-hover:text-[#9B2335] transition-colors leading-snug line-clamp-2">
                      {ev.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 font-medium mb-3">
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-[#9B2335]" /> {ev.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-[#9B2335]" /> {ev.location}
                      </span>
                    </div>

                    <p className="text-[12px] text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">
                      {ev.desc}
                    </p>

                    {/* Tags */}
                    <div className="flex gap-1.5 flex-wrap mb-4">
                      {ev.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#9B2335] border border-red-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Preview Button */}
                    <div className="w-full text-center py-2 px-3 rounded-xl border border-[#9B2335] text-[#9B2335] font-bold text-xs">
                      Register Now →
                    </div>
                  </div>

                  {/* Admin Controls Footer */}
                  <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-400 font-mono">Mode: {ev.mode}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditEventModal(ev)}
                        className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:text-[#9B2335] hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Pencil size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: "event", id: String(ev.id), title: ev.title })}
                        className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 3: GALLERY HIGHLIGHTS (Exact match with Image 2) ── */}
        {activeTab === "gallery" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E9DDD8] shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-50 text-amber-700">
                    <ImageIcon size={20} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span>Gallery Highlights Manager</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live PostgreSQL Database
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Add memories with photos directly from your local PC, stored in database <code className="bg-gray-100 text-amber-800 px-1 py-0.5 rounded font-mono text-[11px]">gallery_items</code> table.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchLiveGallery(true)}
                  disabled={refreshingGallery}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs disabled:opacity-50"
                  title="Reload gallery from database"
                >
                  <RotateCw size={13} className={refreshingGallery ? "animate-spin text-[#9B2335]" : "text-gray-500"} />
                  <span>{refreshingGallery ? "Syncing..." : "Sync Database"}</span>
                </button>

                <button
                  onClick={openNewGalleryModal}
                  className="bg-[#9B2335] hover:bg-[#7a1b28] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
                >
                  <Plus size={16} />
                  <span>Add Gallery Photo</span>
                </button>

                <div className="text-xs bg-amber-50 text-amber-800 px-3 py-2 rounded-xl font-bold border border-amber-200">
                  Total in Database: {gallery.length}
                </div>
              </div>
            </div>

            {/* Gallery Grid (Exact Website Style from Image 2) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((g) => (
                <div
                  key={g.id}
                  className="group rounded-2xl overflow-hidden border border-[#E9DDD8] bg-white shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  {/* Photo Card View */}
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={g.img || "/campus-building.png"}
                      alt={g.label}
                      fill
                      className="object-cover opacity-85 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                      unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/30 pointer-events-none" />

                    {/* Category badge (top-left) */}
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm shadow"
                        style={{ color: "#9B2335" }}
                      >
                        {g.category}
                      </span>
                    </div>

                    {/* Year badge (top-right) */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/20">
                        {g.year}
                      </span>
                    </div>

                    {/* Title & Desc Overlay on Photo (matching Image 2) */}
                    <div className="absolute bottom-3 left-3 right-3 z-10">
                      <h4 className="text-white text-sm font-extrabold leading-snug drop-shadow-sm">{g.label}</h4>
                      <p className="text-white/80 text-[11px] font-medium mt-1 line-clamp-2 leading-relaxed">
                        {g.desc}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-500 font-medium">Category: {g.category}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditGalleryModal(g)}
                        className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:text-[#9B2335] hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Pencil size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: "gallery", id: String(g.id), title: g.label })}
                        className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 4: NEWS & UPDATES (Exact match with Image 3 & Image 4) ── */}
        {activeTab === "news" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E9DDD8] shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Newspaper className="text-blue-600" size={20} />
                  <span>News & Updates Manager</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage news banner photo, headline, author, publish date, read time, excerpt, and full story.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => fetchLiveNews(true)}
                  disabled={refreshingNews}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-2xs disabled:opacity-50"
                  title="Reload news from database"
                >
                  <RotateCw size={13} className={refreshingNews ? "animate-spin text-[#9B2335]" : "text-gray-500"} />
                  <span>{refreshingNews ? "Syncing..." : "Sync Database"}</span>
                </button>

                <button
                  onClick={openNewNewsModal}
                  className="bg-[#9B2335] hover:bg-[#7a1b28] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
                >
                  <Plus size={16} />
                  <span>Add News Article</span>
                </button>

                <div className="text-xs bg-blue-50 text-blue-800 px-3 py-2 rounded-xl font-bold border border-blue-200">
                  Total in Database: {news.length}
                </div>
              </div>
            </div>

            {/* News Grid (Exact Website Style from Image 4) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#E9DDD8] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  {/* Photo & Category Badge */}
                  <div className="relative h-44 w-full bg-gray-100 overflow-hidden">
                    <Image
                      src={item.img || "/campus-building.png"}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized
                    />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className="text-[10px] font-extrabold px-3 py-1 rounded-full text-white shadow-md tracking-wide"
                        style={{ background: "#9B2335" }}
                      >
                        {item.category}
                      </span>
                    </div>

                    {item.featured && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow">
                          ★ Featured
                        </span>
                      </div>
                    )}
                  </div>

                  {/* News Content */}
                  <div className="p-5 flex flex-col flex-1">
                    <h4 className="text-sm font-extrabold text-gray-900 group-hover:text-[#9B2335] transition-colors leading-snug line-clamp-2 mb-2">
                      {item.title}
                    </h4>

                    <p className="text-[12px] text-gray-500 leading-relaxed mb-4 flex-1 line-clamp-3">
                      {item.excerpt}
                    </p>

                    {/* Meta Footer (matching Image 4) */}
                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-[#9B2335]" />
                          {item.readTime}
                        </span>
                        <span>•</span>
                        <span>{item.date}</span>
                      </div>

                      <button
                        onClick={() => setPreviewNewsModal(item)}
                        className="font-bold text-[#9B2335] hover:underline flex items-center gap-1"
                      >
                        <span>Read</span>
                        <ChevronRight size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Admin Controls */}
                  <div className="bg-gray-50 px-4 py-2.5 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-400 truncate max-w-[140px]">By {item.author}</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEditNewsModal(item)}
                        className="px-2.5 py-1 text-xs font-semibold text-gray-700 hover:text-[#9B2335] hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Pencil size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({ type: "news", id: String(item.id), title: item.title })}
                        className="px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TAB 5: MEMBERS DIRECTORY (Live PostgreSQL Database Sync & Data Table) ── */}
        {activeTab === "members" && (
          <div className="space-y-5 animate-fadeIn">
            {/* Header & Live Database Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E9DDD8] shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-purple-50 text-purple-700">
                    <Users size={20} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span>Alumni Members Directory</span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        Live PostgreSQL Database Connected
                      </span>
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Showing all registered alumni records directly from the database <code className="bg-gray-100 text-purple-800 px-1 py-0.5 rounded font-mono text-[11px]">members</code> table.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={() => fetchLiveMembers(true)}
                  disabled={refreshingMembers}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs disabled:opacity-50"
                  title="Reload members from PostgreSQL database"
                >
                  <RotateCw size={13} className={refreshingMembers ? "animate-spin text-[#9B2335]" : "text-gray-500"} />
                  <span>{refreshingMembers ? "Syncing..." : "Sync Database"}</span>
                </button>

                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-2xs"
                  title="Download all members as CSV spreadsheet"
                >
                  <Download size={13} className="text-gray-500" />
                  <span>Export CSV</span>
                </button>

                <Link
                  href="/invite"
                  target="_blank"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#9B2335] text-white text-xs font-bold hover:bg-[#801b2a] transition-all shadow-sm"
                >
                  <Plus size={14} />
                  <span>Add Alumni</span>
                </Link>

                <div className="text-xs bg-purple-50 text-purple-900 px-3 py-1.5 rounded-xl font-bold border border-purple-200">
                  Total in Database: {members.length}
                </div>
              </div>
            </div>

            {/* Controls: Search, Filters & View Toggle */}
            <div className="bg-white p-4 rounded-2xl border border-[#E9DDD8] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Search by name, email, company, role, department, location..."
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#9B2335]/20 focus:border-[#9B2335]"
                />
                {memberSearch && (
                  <button
                    onClick={() => setMemberSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* Filters */}
              <div className="flex items-center flex-wrap gap-2">
                {/* Department Filter */}
                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs">
                  <Filter size={12} className="text-gray-500" />
                  <select
                    value={memberDeptFilter}
                    onChange={(e) => setMemberDeptFilter(e.target.value)}
                    className="bg-transparent font-semibold text-gray-700 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Departments</option>
                    <option value="Computer">Computer (CSE)</option>
                    <option value="Civil">Civil</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Electrical">Electrical</option>
                    <option value="CDDM">CDDM</option>
                  </select>
                </div>

                {/* Status Filter */}
                <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs">
                  <ShieldCheck size={12} className="text-gray-500" />
                  <select
                    value={memberStatusFilter}
                    onChange={(e) => setMemberStatusFilter(e.target.value)}
                    className="bg-transparent font-semibold text-gray-700 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="ALL">All Status</option>
                    <option value="VERIFIED">Verified Only</option>
                    <option value="PENDING">Pending Verification</option>
                  </select>
                </div>

                {/* View Switcher: Table vs Cards */}
                <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
                  <button
                    onClick={() => setMemberViewMode("table")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      memberViewMode === "table" ? "bg-white text-[#9B2335] shadow-xs" : "text-gray-600 hover:text-gray-900"
                    }`}
                    title="View as Data Table"
                  >
                    <TableIcon size={13} />
                    <span>Table</span>
                  </button>
                  <button
                    onClick={() => setMemberViewMode("cards")}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      memberViewMode === "cards" ? "bg-white text-[#9B2335] shadow-xs" : "text-gray-600 hover:text-gray-900"
                    }`}
                    title="View as Cards"
                  >
                    <LayoutGrid size={13} />
                    <span>Cards</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Result Summary */}
            {(() => {
              const q = memberSearch.toLowerCase().trim();
              const filtered = members.filter((m) => {
                const matchSearch =
                  !q ||
                  (m.name && m.name.toLowerCase().includes(q)) ||
                  (m.email && m.email.toLowerCase().includes(q)) ||
                  (m.phone && m.phone.toLowerCase().includes(q)) ||
                  (m.company && m.company.toLowerCase().includes(q)) ||
                  (m.role && m.role.toLowerCase().includes(q)) ||
                  (m.dept && m.dept.toLowerCase().includes(q)) ||
                  (m.department_name && m.department_name.toLowerCase().includes(q)) ||
                  (m.degree && m.degree.toLowerCase().includes(q)) ||
                  (m.location && m.location.toLowerCase().includes(q));

                const matchDept =
                  memberDeptFilter === "ALL" ||
                  (m.dept && m.dept.toLowerCase().includes(memberDeptFilter.toLowerCase())) ||
                  (m.department_name && m.department_name.toLowerCase().includes(memberDeptFilter.toLowerCase()));

                const matchStatus =
                  memberStatusFilter === "ALL" ||
                  (memberStatusFilter === "VERIFIED" && m.verified) ||
                  (memberStatusFilter === "PENDING" && !m.verified);

                return matchSearch && matchDept && matchStatus;
              });

              if (loadingMembers) {
                return (
                  <div className="bg-white rounded-2xl border border-[#E9DDD8] p-12 text-center shadow-sm">
                    <Loader2 size={32} className="animate-spin text-[#9B2335] mx-auto mb-3" />
                    <h4 className="font-bold text-gray-800 text-sm">Fetching Members from Database...</h4>
                    <p className="text-xs text-gray-500 mt-1">Connecting directly to PostgreSQL members table.</p>
                  </div>
                );
              }

              if (filtered.length === 0) {
                return (
                  <div className="bg-white rounded-2xl border border-[#E9DDD8] p-12 text-center shadow-sm">
                    <Users size={36} className="text-gray-300 mx-auto mb-3" />
                    <h4 className="font-bold text-gray-800 text-sm">No Alumni Members Found</h4>
                    <p className="text-xs text-gray-500 mt-1">
                      {memberSearch || memberDeptFilter !== "ALL" || memberStatusFilter !== "ALL"
                        ? "Try adjusting your search query or department/status filters."
                        : "There are currently no members in the database. Use the Add Alumni button to register new alumni."}
                    </p>
                    {(memberSearch || memberDeptFilter !== "ALL" || memberStatusFilter !== "ALL") && (
                      <button
                        onClick={() => {
                          setMemberSearch("");
                          setMemberDeptFilter("ALL");
                          setMemberStatusFilter("ALL");
                        }}
                        className="mt-3 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition-colors"
                      >
                        Reset All Filters
                      </button>
                    )}
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {/* Results Subtitle */}
                  <div className="flex items-center justify-between text-xs text-gray-500 px-1 font-medium">
                    <span>
                      Showing <strong className="text-gray-800 font-bold">{filtered.length}</strong> of{" "}
                      <strong className="text-gray-800 font-bold">{members.length}</strong> members recorded in database
                    </span>
                    {(memberSearch || memberDeptFilter !== "ALL" || memberStatusFilter !== "ALL") && (
                      <button
                        onClick={() => {
                          setMemberSearch("");
                          setMemberDeptFilter("ALL");
                          setMemberStatusFilter("ALL");
                        }}
                        className="text-[#9B2335] hover:underline font-semibold"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>

                  {/* ── VIEW 1: DATA TABLE VIEW ── */}
                  {memberViewMode === "table" && (
                    <div className="bg-white rounded-2xl border border-[#E9DDD8] shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100/60 border-b border-[#E9DDD8] text-gray-700 font-bold uppercase tracking-wider text-[11px]">
                              <th className="py-3.5 px-4 w-12 text-center">#</th>
                              <th className="py-3.5 px-4 min-w-[200px]">Alumni Member</th>
                              <th className="py-3.5 px-4 min-w-[180px]">Contact Info</th>
                              <th className="py-3.5 px-4 min-w-[170px]">Education Details</th>
                              <th className="py-3.5 px-4 min-w-[180px]">Career & Role</th>
                              <th className="py-3.5 px-4 min-w-[140px]">Location & Exp</th>
                              <th className="py-3.5 px-4 min-w-[150px]">Skills</th>
                              <th className="py-3.5 px-4 min-w-[110px] text-center">Status</th>
                              <th className="py-3.5 px-4 min-w-[120px] text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {filtered.map((mem, idx) => {
                              const initials = (mem.name || "Alumni")
                                .split(" ")
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((w: string) => w[0].toUpperCase())
                                .join("");
                              const avatarColors = ["#9B2335", "#1e3a5f", "#2d6a4f", "#6b3a2a", "#4a4a8a", "#7b4f2e"];
                              const avatarBg = avatarColors[idx % avatarColors.length];

                              return (
                                <tr
                                  key={mem.id}
                                  className="hover:bg-purple-50/20 transition-colors group"
                                >
                                  {/* # / ID */}
                                  <td className="py-3.5 px-4 text-center font-mono text-[11px] text-gray-400">
                                    {mem.id}
                                  </td>

                                  {/* Member Avatar & Name */}
                                  <td className="py-3.5 px-4">
                                    <div className="flex items-center gap-3">
                                      <div className="relative shrink-0">
                                        <div
                                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-2xs"
                                          style={{ background: avatarBg }}
                                        >
                                          {initials}
                                        </div>
                                        {mem.verified && (
                                          <span
                                            className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center"
                                            title="Verified Profile"
                                          >
                                            <Check size={8} className="text-white" />
                                          </span>
                                        )}
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-1.5">
                                          <button
                                            onClick={() => {
                                              setSelectedMember(mem);
                                              setMemberDetailModalOpen(true);
                                            }}
                                            className="font-bold text-gray-900 hover:text-[#9B2335] text-xs transition-colors text-left"
                                          >
                                            {mem.name}
                                          </button>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
                                          <span>Batch {mem.year || mem.graduation_year || "2025"}</span>
                                          {(mem.linkedin || mem.linkedin_url) && (
                                            <>
                                              <span>&bull;</span>
                                              <a
                                                href={mem.linkedin || mem.linkedin_url || "#"}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-[#9B2335] hover:underline inline-flex items-center gap-0.5 text-[10px] font-semibold"
                                                title="Open LinkedIn"
                                              >
                                                <Globe size={10} /> LinkedIn
                                              </a>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </td>

                                  {/* Contact Info (Email & Phone from Step 1 of form) */}
                                  <td className="py-3.5 px-4">
                                    <div className="space-y-0.5">
                                      <p className="text-[11px] text-gray-700 flex items-center gap-1.5 font-medium truncate max-w-[200px]" title={mem.email}>
                                        <Mail size={12} className="text-gray-400 shrink-0" />
                                        <span>{mem.email}</span>
                                      </p>
                                      {mem.phone && (
                                        <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                                          <Phone size={12} className="text-gray-400 shrink-0" />
                                          <span>{mem.phone}</span>
                                        </p>
                                      )}
                                    </div>
                                  </td>

                                  {/* Education Details (from Step 2 of form) */}
                                  <td className="py-3.5 px-4">
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-1.5 flex-wrap">
                                        <span className="font-bold text-gray-800 text-[11px]">
                                          {mem.degree || "B.Tech"}
                                        </span>
                                        <span className="bg-purple-50 text-purple-800 border border-purple-200 px-1.5 py-0.2 rounded text-[10px] font-semibold">
                                          {mem.dept || mem.department_short || mem.department_name || "Engineering"}
                                        </span>
                                      </div>
                                      <p className="text-[10px] text-gray-400 truncate max-w-[160px]" title={mem.institute || "Tolani F. G. Polytechnic"}>
                                        {mem.institute || "Tolani F. G. Polytechnic"}
                                      </p>
                                    </div>
                                  </td>

                                  {/* Career & Role (from Step 2 of form) */}
                                  <td className="py-3.5 px-4">
                                    {mem.company || mem.role ? (
                                      <div className="space-y-0.5">
                                        <p className="font-bold text-gray-800 text-[11px] flex items-center gap-1">
                                          <Building2 size={11} className="text-gray-400 shrink-0" />
                                          <span>{mem.company || "Company"}</span>
                                        </p>
                                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                                          <Briefcase size={11} className="text-gray-400 shrink-0" />
                                          <span>{mem.role || "Professional"}</span>
                                        </p>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400 italic text-[11px]">Not specified</span>
                                    )}
                                  </td>

                                  {/* Location & Experience (from Step 1 & 2 of form) */}
                                  <td className="py-3.5 px-4">
                                    <div className="space-y-0.5">
                                      {mem.location ? (
                                        <p className="text-[11px] text-gray-700 flex items-center gap-1">
                                          <MapPin size={11} className="text-[#9B2335] shrink-0" />
                                          <span className="truncate max-w-[130px]">{mem.location}</span>
                                        </p>
                                      ) : (
                                        <span className="text-gray-400 text-[11px] block">-</span>
                                      )}
                                      <p className="text-[10px] text-gray-500">
                                        Exp: <strong className="text-gray-700 font-semibold">{mem.experience_years ?? mem.experience ?? 0} yrs</strong>
                                      </p>
                                    </div>
                                  </td>

                                  {/* Skills (from Step 2 of form) */}
                                  <td className="py-3.5 px-4">
                                    {Array.isArray(mem.skills) && mem.skills.length > 0 ? (
                                      <div className="flex flex-wrap gap-1 max-w-[180px]">
                                        {mem.skills.slice(0, 2).map((s, sIdx) => (
                                          <span
                                            key={sIdx}
                                            className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-[10px] font-medium"
                                          >
                                            {s}
                                          </span>
                                        ))}
                                        {mem.skills.length > 2 && (
                                          <span
                                            onClick={() => {
                                              setSelectedMember(mem);
                                              setMemberDetailModalOpen(true);
                                            }}
                                            className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer hover:bg-purple-100"
                                            title={mem.skills.slice(2).join(", ")}
                                          >
                                            +{mem.skills.length - 2}
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <span className="text-gray-300 text-[10px] italic">-</span>
                                    )}
                                  </td>

                                  {/* Status (from Step 3 of form) */}
                                  <td className="py-3.5 px-4 text-center">
                                    {mem.verified ? (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                        <CheckCircle size={11} className="text-emerald-600" />
                                        Verified
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                        <Clock size={11} className="text-amber-600" />
                                        Pending
                                      </span>
                                    )}
                                  </td>

                                  {/* Actions */}
                                  <td className="py-3.5 px-4 text-right">
                                    <div className="flex items-center justify-end gap-1.5">
                                      {/* View Details */}
                                      <button
                                        onClick={() => {
                                          setSelectedMember(mem);
                                          setMemberDetailModalOpen(true);
                                        }}
                                        className="p-1.5 rounded-lg text-gray-500 hover:text-purple-700 hover:bg-purple-50 transition-colors"
                                        title="View Full Profile Details"
                                      >
                                        <Eye size={14} />
                                      </button>

                                      {/* Toggle Verify */}
                                      <button
                                        onClick={() => handleToggleVerify(mem)}
                                        className={`p-1.5 rounded-lg transition-colors ${
                                          mem.verified
                                            ? "text-emerald-600 hover:bg-emerald-50"
                                            : "text-amber-600 hover:bg-amber-50"
                                        }`}
                                        title={mem.verified ? "Mark as Unverified" : "Approve & Mark Verified"}
                                      >
                                        <ShieldCheck size={14} />
                                      </button>

                                      {/* Delete */}
                                      <button
                                        onClick={() =>
                                          setDeleteConfirm({
                                            type: "member",
                                            id: String(mem.id),
                                            title: mem.name,
                                          })
                                        }
                                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        title="Remove Member from Database"
                                      >
                                        <Trash2 size={14} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* ── VIEW 2: CARDS GRID VIEW ── */}
                  {memberViewMode === "cards" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                      {filtered.map((mem, idx) => {
                        const initials = (mem.name || "Alumni")
                          .split(" ")
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((w: string) => w[0].toUpperCase())
                          .join("");
                        const avatarColors = ["#9B2335", "#1e3a5f", "#2d6a4f", "#6b3a2a", "#4a4a8a", "#7b4f2e"];
                        const avatarBg = avatarColors[idx % avatarColors.length];

                        return (
                          <div
                            key={mem.id}
                            className="bg-white rounded-2xl border border-[#E9DDD8] shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between text-center relative group"
                          >
                            <div>
                              {/* Avatar with Status badge */}
                              <div className="relative mb-3 mx-auto w-16 h-16">
                                <div
                                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow"
                                  style={{ background: avatarBg }}
                                >
                                  {initials}
                                </div>
                                {mem.verified ? (
                                  <span
                                    className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white flex items-center justify-center"
                                    title="Verified Alumni"
                                  >
                                    <Check size={9} className="text-white" />
                                  </span>
                                ) : (
                                  <span
                                    className="absolute bottom-0 right-0 w-4 h-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center"
                                    title="Pending Verification"
                                  />
                                )}
                              </div>

                              {/* Name */}
                              <h4
                                onClick={() => {
                                  setSelectedMember(mem);
                                  setMemberDetailModalOpen(true);
                                }}
                                className="font-bold text-sm leading-tight mb-0.5 cursor-pointer hover:underline text-[#9B2335]"
                              >
                                {mem.name}
                              </h4>

                              {/* Degree · Year · Dept */}
                              <p className="text-[11px] text-gray-500 font-medium mb-1">
                                {mem.degree || "B.Tech"}, {mem.year || mem.graduation_year || "2025"}, {mem.dept || mem.department_short || mem.department_name || "Engineering"}
                              </p>

                              {/* Email */}
                              <p className="text-[10px] text-gray-400 flex items-center justify-center gap-1 mb-2 truncate max-w-[220px] mx-auto">
                                <Mail size={10} className="shrink-0" />
                                <span>{mem.email}</span>
                              </p>

                              <div className="w-full border-t border-gray-100 my-2" />

                              {/* Company + Role */}
                              {mem.company && (
                                <p className="text-[11px] text-gray-700 flex items-center justify-center gap-1.5 mb-1">
                                  <Briefcase size={11} className="text-[#9B2335] shrink-0" />
                                  <span className="font-semibold">{mem.company}</span>
                                  {mem.role && <span className="text-gray-400 font-normal">({mem.role})</span>}
                                </p>
                              )}

                              {/* Location */}
                              {mem.location && (
                                <p className="text-[11px] text-gray-500 flex items-center justify-center gap-1.5 mb-2">
                                  <MapPin size={11} className="text-[#9B2335] shrink-0" />
                                  <span>{mem.location}</span>
                                </p>
                              )}

                              {/* Skills Pills */}
                              {Array.isArray(mem.skills) && mem.skills.length > 0 && (
                                <div className="flex flex-wrap justify-center gap-1 my-2">
                                  {mem.skills.slice(0, 3).map((s, sIdx) => (
                                    <span key={sIdx} className="bg-gray-50 border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded text-[10px]">
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Card Footer Actions */}
                            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                              <button
                                onClick={() => {
                                  setSelectedMember(mem);
                                  setMemberDetailModalOpen(true);
                                }}
                                className="text-xs font-semibold text-[#9B2335] hover:underline flex items-center gap-1"
                              >
                                <Eye size={12} /> View Details
                              </button>

                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => handleToggleVerify(mem)}
                                  className={`p-1.5 rounded-lg text-xs ${
                                    mem.verified ? "text-emerald-700 hover:bg-emerald-50" : "text-amber-700 hover:bg-amber-50"
                                  }`}
                                  title={mem.verified ? "Verified profile" : "Click to verify"}
                                >
                                  <ShieldCheck size={14} />
                                </button>
                                <button
                                  onClick={() =>
                                    setDeleteConfirm({
                                      type: "member",
                                      id: String(mem.id),
                                      title: mem.name,
                                    })
                                  }
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                                  title="Remove member"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* CAMPAIGNS TAB */}
        {activeTab === "campaigns" && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E9DDD8] shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Heart className="text-[#9B2335]" size={20} />
                  <span>Donation Campaigns Manager</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">Add, edit, or remove donation campaigns shown on the Donation page.</p>
              </div>
              <button onClick={openNewCampaignModal} className="bg-[#9B2335] hover:bg-[#7a1b28] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0">
                <Plus size={16} />
                <span>Add New Campaign</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {campaigns.map((camp) => (
                <div key={camp.id} className="bg-white rounded-2xl border border-[#E9DDD8] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
                  <div className="relative h-40 w-full bg-gray-100 overflow-hidden">
                    <Image src={camp.img || "/campus-building.png"} alt={camp.title} fill className="object-cover" unoptimized />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full text-white shadow-md" style={{ background: "#9B2335" }}>{camp.tag}</span>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{camp.daysLeft}d left</div>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-extrabold text-gray-900 text-sm leading-snug mb-1">{camp.title}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 mb-3">{camp.desc}</p>
                    <div className="mb-2">
                      <div className="flex justify-between text-[11px] text-gray-500 font-medium mb-1">
                        <span className="flex items-center gap-1"><TrendingUp size={10} className="text-[#9B2335]" />{camp.donors} donors</span>
                        <span className="font-bold text-[#9B2335]">{camp.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: camp.percentage + "%", background: "#9B2335" }} />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-gray-500 mb-3">
                      <span className="font-bold text-gray-800">{camp.raised} raised</span>
                      <span>of {camp.target}</span>
                    </div>
                    <div className="mt-auto flex gap-2">
                      <button onClick={() => openEditCampaignModal(camp)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-colors">
                        <Pencil size={12} />Edit
                      </button>
                      <button onClick={() => handleDeleteCampaign(camp.id, camp.title)} className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors">
                        <Trash2 size={12} />Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {campaigns.length === 0 && (
                <div className="col-span-full bg-white rounded-2xl border border-[#E9DDD8] p-10 text-center">
                  <Heart className="mx-auto mb-3 text-gray-300" size={40} />
                  <p className="text-sm font-bold text-gray-600">No campaigns yet</p>
                  <p className="text-xs text-gray-400 mt-1 mb-4">Click Add New Campaign to create your first campaign.</p>
                  <button onClick={openNewCampaignModal} className="px-4 py-2 bg-[#9B2335] text-white rounded-xl text-xs font-bold hover:bg-[#7a1b28]">Add Campaign</button>
                </div>
              )}
            </div>
          </div>
        )}

      
      </main>

      {/* ─────────────────────────────────────────────────────────────
          MODAL 1: ADD / EDIT EVENT MODAL (With Live Website Preview)
      ────────────────────────────────────────────────────────────── */}
      {eventModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-6 animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-[#9B2335] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarDays size={20} />
                <h3 className="font-bold text-base">
                  {editingEvent ? "Edit Event (PostgreSQL Database)" : "Add New Event (PostgreSQL Database)"}
                </h3>
              </div>
              <button
                onClick={() => setEventModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 max-h-[82vh] overflow-y-auto">
              {/* Left Column: Input Form */}
              <form onSubmit={handleSaveEvent} className="lg:col-span-7 p-6 space-y-4 text-xs">
                {/* 1. Photo Selection */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span>1. Event Photo / Banner Image *</span>
                    <span className="text-[11px] text-gray-400 font-normal">Upload or pick preset</span>
                  </label>

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="file"
                      ref={eventFileRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadEventPhoto}
                    />
                    <button
                      type="button"
                      onClick={() => eventFileRef.current?.click()}
                      disabled={uploadingEventPhoto}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-[#9B2335] rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-rose-200 disabled:opacity-50"
                      title="Choose photo from local PC"
                    >
                      {uploadingEventPhoto ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-[#9B2335]" />
                          <span>Uploading PC Photo...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          <span>Upload Photo</span>
                        </>
                      )}
                    </button>
                    <input
                      type="text"
                      value={eventForm.img}
                      onChange={(e) => setEventForm({ ...eventForm, img: e.target.value })}
                      placeholder="Image URL or local PC upload path"
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>

                  {/* Presets */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-gray-400 font-semibold">Quick Presets:</span>
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setEventForm({ ...eventForm, img: preset.url })}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                          eventForm.img === preset.url
                            ? "bg-[#9B2335] text-white border-[#9B2335]"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Event Title */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">2. Event Name / Title *</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="e.g. Global Alumni Meet 2026"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                  />
                </div>

                {/* 3. Event Date (Day, Month, Year) */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Day (DD) *</label>
                    <input
                      type="text"
                      required
                      value={eventForm.day}
                      onChange={(e) => setEventForm({ ...eventForm, day: e.target.value })}
                      placeholder="25"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Month (MMM) *</label>
                    <input
                      type="text"
                      required
                      value={eventForm.month}
                      onChange={(e) => setEventForm({ ...eventForm, month: e.target.value.toUpperCase() })}
                      placeholder="JUN"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Year *</label>
                    <input
                      type="text"
                      required
                      value={eventForm.year}
                      onChange={(e) => setEventForm({ ...eventForm, year: e.target.value })}
                      placeholder="2026"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>
                </div>

                {/* 4. Time & Mode (Online / Offline) */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Event Time *</label>
                    <input
                      type="text"
                      required
                      value={eventForm.time}
                      onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })}
                      placeholder="10:00 AM"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Event Mode *</label>
                    <div className="grid grid-cols-2 gap-1.5 p-1 bg-gray-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() =>
                          setEventForm({
                            ...eventForm,
                            mode: "Online",
                            type: "Virtual Event",
                            location: eventForm.location === "Tolani Auditorium" ? "Online" : eventForm.location,
                          })
                        }
                        className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          eventForm.mode === "Online" ? "bg-white text-[#9B2335] shadow" : "text-gray-600"
                        }`}
                      >
                        Online
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEventForm({
                            ...eventForm,
                            mode: "Offline",
                            type: "In-Person Event",
                            location: eventForm.location === "Online" ? "Tolani Auditorium" : eventForm.location,
                          })
                        }
                        className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          eventForm.mode === "Offline" ? "bg-white text-[#9B2335] shadow" : "text-gray-600"
                        }`}
                      >
                        Offline
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Venue / Location & Type */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Location / Venue *</label>
                    <input
                      type="text"
                      required
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      placeholder={eventForm.mode === "Online" ? "Online / Zoom" : "Tolani Auditorium, Campus"}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Event Type Badge</label>
                    <select
                      value={eventForm.type}
                      onChange={(e) => setEventForm({ ...eventForm, type: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    >
                      <option value="Virtual Event">Virtual Event</option>
                      <option value="In-Person Event">In-Person Event</option>
                      <option value="Online Session">Online Session</option>
                      <option value="Department Meetup">Department Meetup</option>
                      <option value="Career Webinar">Career Webinar</option>
                      <option value="Summit">Summit</option>
                    </select>
                  </div>
                </div>

                {/* 6. Short Description */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Short Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={eventForm.desc}
                    onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })}
                    placeholder="Join alumni from across the world for an inspiring meet..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                  />
                </div>

                {/* 7. Tags */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={eventForm.tagsInput}
                    onChange={(e) => setEventForm({ ...eventForm, tagsInput: e.target.value })}
                    placeholder="Virtual, Networking, Tech"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEventModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingEvent || uploadingEventPhoto}
                    className="px-6 py-2.5 rounded-xl font-bold bg-[#9B2335] hover:bg-[#7a1b28] text-white shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {savingEvent && <Loader2 size={14} className="animate-spin" />}
                    <span>{savingEvent ? "Saving to Database..." : (editingEvent ? "Save Changes" : "Create Event")}</span>
                  </button>
                </div>
              </form>

              {/* Right Column: Live Card Preview (Matching Image 1) */}
              <div className="lg:col-span-5 p-6 bg-gray-50 flex flex-col justify-start">
                <div className="flex items-center gap-1.5 font-bold text-gray-700 text-xs mb-3">
                  <Eye size={14} className="text-[#9B2335]" />
                  <span>Live Website Preview (Image 1 Style)</span>
                </div>

                {/* Card Preview */}
                <div className="event-card bg-white rounded-2xl border border-[#E9DDD8] overflow-hidden shadow-md flex flex-col">
                  <div className="relative h-44 w-full bg-gray-200 overflow-hidden">
                    <Image
                      src={eventForm.img || "/campus-building.png"}
                      alt="Event Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />

                    {/* Date Badge */}
                    <div
                      className="absolute top-3 left-3 rounded-xl px-2.5 py-2 text-center shadow-lg"
                      style={{ background: "#9B2335", minWidth: "48px" }}
                    >
                      <div className="text-xl font-extrabold text-white leading-tight">
                        {eventForm.day || "25"}
                      </div>
                      <div className="text-[10px] font-bold text-white/80 uppercase tracking-wider">
                        {eventForm.month || "JUN"}
                      </div>
                    </div>

                    {/* Type Badge */}
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-sm shadow flex items-center gap-1"
                      style={{ color: "#9B2335" }}
                    >
                      {eventForm.mode === "Online" ? <Globe size={11} /> : <Building2 size={11} />}
                      <span>{eventForm.type || "Virtual Event"}</span>
                    </div>
                  </div>

                  <div className="p-4 flex flex-col">
                    <h4 className="text-sm font-extrabold text-gray-900 mb-1.5 leading-snug line-clamp-2">
                      {eventForm.title || "Your Event Title Here"}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500 font-medium mb-2.5">
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-[#9B2335]" /> {eventForm.time || "10:00 AM"}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin size={11} className="text-[#9B2335]" /> {eventForm.location || "Online"}
                      </span>
                    </div>

                    <p className="text-[11px] text-gray-500 leading-relaxed mb-3 line-clamp-3">
                      {eventForm.desc || "Short description will appear here on the public events card..."}
                    </p>

                    <div className="flex gap-1.5 flex-wrap mb-3">
                      {eventForm.tagsInput
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                        .map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-[#9B2335] border border-red-100"
                          >
                            {tag}
                          </span>
                        ))}
                    </div>

                    <div className="w-full text-center py-2 px-3 rounded-xl border border-[#9B2335] text-[#9B2335] font-bold text-xs bg-white">
                      Register Now →
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 2: ADD / EDIT GALLERY MODAL (With Live Website Preview)
      ────────────────────────────────────────────────────────────── */}
      {galleryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-4xl w-full rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-6 animate-fadeIn">
            <div className="bg-[#9B2335] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon size={20} />
                <h3 className="font-bold text-base">
                  {editingGallery ? "Edit Gallery Photo (PostgreSQL Database)" : "Add Gallery Photo (PostgreSQL Database)"}
                </h3>
              </div>
              <button
                onClick={() => setGalleryModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 max-h-[82vh] overflow-y-auto">
              {/* Form */}
              <form onSubmit={handleSaveGallery} className="lg:col-span-7 p-6 space-y-4 text-xs">
                {/* Photo */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span>1. Gallery Photo / Image *</span>
                    <span className="text-[11px] text-gray-400 font-normal">Upload from computer or pick preset</span>
                  </label>

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="file"
                      ref={galleryFileRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadGalleryPhoto}
                    />
                    <button
                      type="button"
                      onClick={() => galleryFileRef.current?.click()}
                      disabled={uploadingGalleryPhoto}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-[#9B2335] rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-rose-200 disabled:opacity-50"
                      title="Choose photo from local PC"
                    >
                      {uploadingGalleryPhoto ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-[#9B2335]" />
                          <span>Uploading PC Photo...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          <span>Upload Photo</span>
                        </>
                      )}
                    </button>
                    <input
                      type="text"
                      value={galleryForm.img}
                      onChange={(e) => setGalleryForm({ ...galleryForm, img: e.target.value })}
                      placeholder="Image URL or local PC upload path"
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>

                  {/* Presets */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-gray-400 font-semibold">Quick Presets:</span>
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setGalleryForm({ ...galleryForm, img: preset.url })}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                          galleryForm.img === preset.url
                            ? "bg-[#9B2335] text-white border-[#9B2335]"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">2. Event Name / Photo Label *</label>
                  <input
                    type="text"
                    required
                    value={galleryForm.label}
                    onChange={(e) => setGalleryForm({ ...galleryForm, label: e.target.value })}
                    placeholder="e.g. Alumni Meet 2026 / Campus Visit"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                  />
                </div>

                {/* Category & Year */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">3. Category *</label>
                    <select
                      value={galleryForm.category}
                      onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    >
                      <option value="Annual Event">Annual Event</option>
                      <option value="Virtual">Virtual</option>
                      <option value="Networking">Networking</option>
                      <option value="Campus">Campus</option>
                      <option value="Academic">Academic</option>
                      <option value="Cultural">Cultural</option>
                      <option value="Tech">Tech</option>
                      <option value="Department">Department</option>
                      <option value="Sports">Sports</option>
                      <option value="Graduation">Graduation</option>
                      <option value="Social">Social</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">4. Year *</label>
                    <input
                      type="text"
                      required
                      value={galleryForm.year}
                      onChange={(e) => setGalleryForm({ ...galleryForm, year: e.target.value })}
                      placeholder="2026"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">5. Short Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={galleryForm.desc}
                    onChange={(e) => setGalleryForm({ ...galleryForm, desc: e.target.value })}
                    placeholder="A grand gathering of Tolani alumni from across the globe, celebrating bonds and shared memories."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                  />
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setGalleryModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingGallery || uploadingGalleryPhoto}
                    className="px-6 py-2.5 rounded-xl font-bold bg-[#9B2335] hover:bg-[#7a1b28] text-white shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {savingGallery && <Loader2 size={14} className="animate-spin" />}
                    <span>{savingGallery ? "Saving to Database..." : (editingGallery ? "Save Changes" : "Add to Gallery")}</span>
                  </button>
                </div>
              </form>

              {/* Live Preview (Matching Image 2) */}
              <div className="lg:col-span-5 p-6 bg-gray-50 flex flex-col justify-start">
                <div className="flex items-center gap-1.5 font-bold text-gray-700 text-xs mb-3">
                  <Eye size={14} className="text-[#9B2335]" />
                  <span>Live Website Preview (Image 2 Style)</span>
                </div>

                <div className="relative h-56 w-full rounded-2xl overflow-hidden shadow-lg bg-slate-900 group">
                  <Image
                    src={galleryForm.img || "/campus-building.png"}
                    alt="Gallery Preview"
                    fill
                    className="object-cover opacity-85"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

                  {/* Category pill */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-sm shadow"
                      style={{ color: "#9B2335" }}
                    >
                      {galleryForm.category || "Annual Event"}
                    </span>
                  </div>

                  {/* Year pill */}
                  <div className="absolute top-3 right-3 z-10">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm border border-white/20">
                      {galleryForm.year || "2026"}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <div className="absolute bottom-3 left-3 right-3 z-10">
                    <h4 className="text-white text-sm font-extrabold leading-snug drop-shadow-sm">
                      {galleryForm.label || "Your Photo Label Here"}
                    </h4>
                    <p className="text-white/80 text-[11px] font-medium mt-1 line-clamp-2 leading-relaxed">
                      {galleryForm.desc || "Short memory description will appear here over the photo..."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 3: ADD / EDIT NEWS MODAL (With Live Website Preview)
      ────────────────────────────────────────────────────────────── */}
      {newsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-5xl w-full rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-6 animate-fadeIn">
            <div className="bg-[#9B2335] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Newspaper size={20} />
                <h3 className="font-bold text-base">
                  {editingNews ? "Edit News Article (PostgreSQL Database)" : "Add News Article (PostgreSQL Database)"}
                </h3>
              </div>
              <button
                onClick={() => setNewsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 max-h-[82vh] overflow-y-auto">
              {/* Form */}
              <form onSubmit={handleSaveNews} className="lg:col-span-7 p-6 space-y-4 text-xs">
                {/* Photo */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span>1. Article Banner Image *</span>
                    <span className="text-[11px] text-gray-400 font-normal">Upload or pick preset</span>
                  </label>

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="file"
                      ref={newsFileRef}
                      accept="image/*"
                      className="hidden"
                      onChange={handleUploadNewsBanner}
                    />
                    <button
                      type="button"
                      onClick={() => newsFileRef.current?.click()}
                      disabled={uploadingNewsBanner}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-[#9B2335] rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-rose-200 disabled:opacity-50"
                      title="Choose banner from local PC"
                    >
                      {uploadingNewsBanner ? (
                        <>
                          <Loader2 size={14} className="animate-spin text-[#9B2335]" />
                          <span>Uploading PC Banner...</span>
                        </>
                      ) : (
                        <>
                          <Upload size={14} />
                          <span>Upload Banner</span>
                        </>
                      )}
                    </button>
                    <input
                      type="text"
                      value={newsForm.img}
                      onChange={(e) => setNewsForm({ ...newsForm, img: e.target.value })}
                      placeholder="Image URL or local PC upload path"
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>

                  {/* Presets */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-gray-400 font-semibold">Quick Presets:</span>
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setNewsForm({ ...newsForm, img: preset.url })}
                        className={`text-[10px] px-2 py-0.5 rounded-full border transition-colors ${
                          newsForm.img === preset.url
                            ? "bg-[#9B2335] text-white border-[#9B2335]"
                            : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Headline */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">2. Article Headline / Title *</label>
                  <input
                    type="text"
                    required
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    placeholder="e.g. Tolani Alumni Entrepreneur Raises ₹50 Crore in Funding"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                  />
                </div>

                {/* Category & Author */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">3. Category *</label>
                    <select
                      value={newsForm.category}
                      onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    >
                      <option value="Reunion">Reunion</option>
                      <option value="Community">Community</option>
                      <option value="Success Story">Success Story</option>
                      <option value="Programs">Programs</option>
                      <option value="Achievement">Achievement</option>
                      <option value="Department News">Department News</option>
                      <option value="Scholarship">Scholarship</option>
                      <option value="Platform Update">Platform Update</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">4. Author Name *</label>
                    <input
                      type="text"
                      required
                      value={newsForm.author}
                      onChange={(e) => setNewsForm({ ...newsForm, author: e.target.value })}
                      placeholder="e.g. Alumni Portal Editorial / Dean Office"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>
                </div>

                {/* Date & Read Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">5. Publish Date *</label>
                    <input
                      type="text"
                      required
                      value={newsForm.date}
                      onChange={(e) => setNewsForm({ ...newsForm, date: e.target.value })}
                      placeholder="e.g. Aug 05, 2026"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">6. Read Time *</label>
                    <input
                      type="text"
                      required
                      value={newsForm.readTime}
                      onChange={(e) => setNewsForm({ ...newsForm, readTime: e.target.value })}
                      placeholder="e.g. 3 min read / 5 min read"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>
                </div>

                {/* Short Excerpt */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">7. Short Excerpt (Feed Card Summary) *</label>
                  <textarea
                    rows={2}
                    required
                    value={newsForm.excerpt}
                    onChange={(e) => setNewsForm({ ...newsForm, excerpt: e.target.value })}
                    placeholder="Brief 2-3 line summary that appears on the card..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                  />
                </div>

                {/* Full Article Content */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    8. Full Article Story (Shown in Reader Modal) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                    placeholder="Write detailed multi-paragraph article story here..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                  />
                </div>

                {/* Featured toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="featured-news"
                    checked={newsForm.featured}
                    onChange={(e) => setNewsForm({ ...newsForm, featured: e.target.checked })}
                    className="w-4 h-4 text-[#9B2335] rounded focus:ring-[#9B2335]"
                  />
                  <label htmlFor="featured-news" className="font-bold text-gray-800 cursor-pointer">
                    Feature this article prominently on homepage & news feed
                  </label>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setNewsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingNews || uploadingNewsBanner}
                    className="px-6 py-2.5 rounded-xl font-bold bg-[#9B2335] hover:bg-[#7a1b28] text-white shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-1.5"
                  >
                    {savingNews && <Loader2 size={14} className="animate-spin" />}
                    <span>{savingNews ? "Publishing to Database..." : (editingNews ? "Save Changes" : "Publish News")}</span>
                  </button>
                </div>
              </form>

              {/* Live Preview (Matching Image 4) */}
              <div className="lg:col-span-5 p-6 bg-gray-50 flex flex-col justify-start">
                <div className="flex items-center gap-1.5 font-bold text-gray-700 text-xs mb-3">
                  <Eye size={14} className="text-[#9B2335]" />
                  <span>Live Website Preview (Image 4 Style)</span>
                </div>

                <div className="bg-white rounded-2xl border border-[#E9DDD8] overflow-hidden shadow-md flex flex-col">
                  <div className="relative h-44 w-full bg-gray-200 overflow-hidden">
                    <Image
                      src={newsForm.img || "/campus-building.png"}
                      alt="News Preview"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className="text-[10px] font-extrabold px-3 py-1 rounded-full text-white shadow-md tracking-wide"
                        style={{ background: "#9B2335" }}
                      >
                        {newsForm.category || "Reunion"}
                      </span>
                    </div>

                    {newsForm.featured && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 shadow">
                          ★ Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 flex flex-col">
                    <h4 className="text-sm font-extrabold text-gray-900 leading-snug line-clamp-2 mb-2">
                      {newsForm.title || "Your News Headline Here"}
                    </h4>

                    <p className="text-[11px] text-gray-500 leading-relaxed mb-3 line-clamp-3">
                      {newsForm.excerpt || "Short excerpt summary will appear here on the news card..."}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium pt-3 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Clock size={11} className="text-[#9B2335]" />
                          {newsForm.readTime || "3 min read"}
                        </span>
                        <span>•</span>
                        <span>{newsForm.date || "Today"}</span>
                      </div>

                      <span className="font-bold text-[#9B2335] flex items-center gap-0.5">
                        <span>Read</span>
                        <ChevronRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 4: FULL NEWS ARTICLE READER MODAL (Matching Image 3)
      ────────────────────────────────────────────────────────────── */}
      {previewNewsModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setPreviewNewsModal(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl relative w-full max-w-2xl overflow-hidden my-6 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Hero Image */}
            <div className="relative h-56 sm:h-64 w-full bg-gray-100 overflow-hidden">
              <Image
                src={previewNewsModal.img || "/campus-building.png"}
                alt={previewNewsModal.title}
                fill
                className="object-cover"
                unoptimized
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 60%)" }}
              />

              <span
                className="absolute top-4 left-4 text-[10px] font-extrabold px-3 py-1 rounded-full shadow-lg text-white tracking-wide"
                style={{ background: "#9B2335" }}
              >
                {previewNewsModal.category}
              </span>

              <button
                onClick={() => setPreviewNewsModal(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8 max-h-[60vh] overflow-y-auto">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400 font-medium mb-3">
                <span className="flex items-center gap-1.5">
                  <User size={12} className="text-[#9B2335]" />
                  {previewNewsModal.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar size={12} className="text-[#9B2335]" />
                  {previewNewsModal.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <BookOpen size={12} className="text-[#9B2335]" />
                  {previewNewsModal.readTime}
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug mb-3">
                {previewNewsModal.title}
              </h2>

              <div className="w-10 h-[3px] rounded-full mb-4" style={{ background: "#9B2335" }} />

              <div className="space-y-3 text-xs sm:text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                <p>{previewNewsModal.content || previewNewsModal.excerpt}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>Tolani Alumni Portal • Official News</span>
                <button
                  onClick={() => setPreviewNewsModal(null)}
                  className="px-4 py-2 bg-[#9B2335] text-white rounded-xl font-bold hover:bg-[#7a1b28] transition-colors"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL 5: DELETE CONFIRMATION DIALOG (SAFE PREVIEW)
      ────────────────────────────────────────────────────────────── */}

        {/* 
          MODAL: ADD / EDIT CAMPAIGN MODAL (Two-Column Split with Live Website Preview - Matching News Style)
       */}
      {campaignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-5xl w-full rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-6 animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-[#9B2335] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={20} />
                <h3 className="font-bold text-base">
                  {editingCampaign ? "Edit Campaign (Preview Mode)" : "Add Campaign (Preview Mode)"}
                </h3>
              </div>
              <button
                onClick={() => setCampaignModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-gray-100 max-h-[82vh] overflow-y-auto">
              {/* Left Column: Input Form */}
              <form onSubmit={handleSaveCampaign} className="lg:col-span-7 p-6 space-y-4 text-xs">
                {/* 1. Campaign Banner Image */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center justify-between">
                    <span>1. Campaign Banner Image *</span>
                    <span className="text-[11px] text-gray-400 font-normal">Upload or pick preset</span>
                  </label>

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="file"
                      ref={campaignFileRef}
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageFile(e, (url) => setCampaignForm({ ...campaignForm, img: url }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => campaignFileRef.current?.click()}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-[#9B2335] rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-rose-200 shrink-0"
                    >
                      <Upload size={14} />
                      <span>Upload Banner</span>
                    </button>
                    <input
                      type="text"
                      value={campaignForm.img}
                      onChange={(e) => setCampaignForm({ ...campaignForm, img: e.target.value })}
                      placeholder="Or enter Image URL"
                      className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>

                  {/* Quick Presets */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-gray-400 font-semibold">Quick Presets:</span>
                    {PRESET_IMAGES.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCampaignForm({ ...campaignForm, img: preset.url })}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                          campaignForm.img === preset.url
                            ? "bg-[#9B2335] text-white shadow-xs"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Campaign Title */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    2. Campaign Headline / Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={campaignForm.title}
                    onChange={(e) => setCampaignForm({ ...campaignForm, title: e.target.value })}
                    placeholder="e.g. Scholarship Fund / Campus Development Fund"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                  />
                </div>

                {/* 3. Category & Tag Badge Label */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">3. Category *</label>
                    <select
                      value={campaignForm.category}
                      onChange={(e) => setCampaignForm({ ...campaignForm, category: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335] bg-white"
                    >
                      <option>Education</option>
                      <option>Infrastructure</option>
                      <option>Research</option>
                      <option>Community</option>
                      <option>Environment</option>
                      <option>Sports</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">4. Tag / Badge Label *</label>
                    <input
                      type="text"
                      required
                      value={campaignForm.tag}
                      onChange={(e) => setCampaignForm({ ...campaignForm, tag: e.target.value })}
                      placeholder="e.g. Education Support"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>
                </div>

                {/* 4. Target Amount & Raised Amount */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">5. Target Amount (₹) *</label>
                    <input
                      type="number"
                      required
                      min={1}
                      value={campaignForm.targetNum}
                      onChange={(e) => setCampaignForm({ ...campaignForm, targetNum: e.target.value })}
                      placeholder="500000"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">6. Raised So Far (₹)</label>
                    <input
                      type="number"
                      min={0}
                      value={campaignForm.raisedNum}
                      onChange={(e) => setCampaignForm({ ...campaignForm, raisedNum: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>
                </div>

                {/* 5. Donors & Days Left */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">7. Total Donors Count</label>
                    <input
                      type="number"
                      min={0}
                      value={campaignForm.donors}
                      onChange={(e) => setCampaignForm({ ...campaignForm, donors: e.target.value })}
                      placeholder="0"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">8. Days Left</label>
                    <input
                      type="number"
                      min={1}
                      value={campaignForm.daysLeft}
                      onChange={(e) => setCampaignForm({ ...campaignForm, daysLeft: e.target.value })}
                      placeholder="30"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                    />
                  </div>
                </div>

                {/* 6. Campaign Description */}
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    9. Campaign Description (Feed Card Summary) *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={campaignForm.desc}
                    onChange={(e) => setCampaignForm({ ...campaignForm, desc: e.target.value })}
                    placeholder="Brief 2-3 line summary describing how funds will be utilized..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:border-[#9B2335]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setCampaignModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl font-bold bg-[#9B2335] hover:bg-[#7a1b28] text-white shadow-md transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <Heart size={14} />
                    <span>{editingCampaign ? "Save Changes" : "Publish Campaign"}</span>
                  </button>
                </div>
              </form>

              {/* Right Column: Live Website Preview (Matching User Screenshot Style) */}
              <div className="lg:col-span-5 p-6 bg-gray-50 flex flex-col justify-start">
                <div className="flex items-center gap-1.5 font-bold text-gray-700 text-xs mb-3">
                  <Eye size={14} className="text-[#9B2335]" />
                  <span>Live Website Preview (Donation Card Style)</span>
                </div>

                {/* Preview Campaign Card */}
                {(() => {
                  const tNum = parseInt(campaignForm.targetNum) || 500000;
                  const rNum = parseInt(campaignForm.raisedNum) || 0;
                  const pct = tNum > 0 ? Math.min(100, Math.round((rNum / tNum) * 100)) : 0;
                  const fmt = (n: number) => "₹" + n.toLocaleString("en-IN");
                  return (
                    <div className="bg-white rounded-2xl border border-[#E9DDD8] overflow-hidden shadow-md flex flex-col">
                      {/* Image + Badges */}
                      <div className="relative h-44 w-full bg-gray-200 overflow-hidden">
                        <Image
                          src={campaignForm.img || "/campus-building.png"}
                          alt="Campaign Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute top-3 left-3 z-10">
                          <span
                            className="text-[10px] font-extrabold px-3 py-1 rounded-full text-white shadow-md tracking-wide"
                            style={{ background: "#9B2335" }}
                          >
                            {campaignForm.tag || "Education Support"}
                          </span>
                        </div>

                        <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow">
                          {campaignForm.daysLeft || "30"}d left
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 flex flex-col">
                        <h4 className="text-sm font-extrabold text-gray-900 leading-snug line-clamp-2 mb-1.5">
                          {campaignForm.title || "Your Campaign Title Here"}
                        </h4>

                        <p className="text-[11px] text-gray-500 leading-relaxed mb-3 line-clamp-3">
                          {campaignForm.desc || "Short campaign description will appear here on the donation card..."}
                        </p>

                        {/* Progress */}
                        <div className="space-y-1.5 mb-3 pt-2 border-t border-gray-100">
                          <div className="flex items-center justify-between text-[11px] text-gray-600 font-medium">
                            <span className="flex items-center gap-1">
                              <TrendingUp size={11} className="text-[#9B2335]" />
                              <span>{campaignForm.donors || "0"} donors</span>
                            </span>
                            <span className="font-extrabold text-[#9B2335]">{pct}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-300"
                              style={{ width: `${pct}%`, background: "#9B2335" }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-gray-500 font-medium mb-3">
                          <span className="font-bold text-gray-900">{fmt(rNum)} raised</span>
                          <span className="text-gray-400">of {fmt(tNum)}</span>
                        </div>

                        {/* Button */}
                        <button
                          type="button"
                          className="w-full py-2 rounded-xl text-xs font-bold text-white shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                          style={{ background: "#9B2335" }}
                        >
                          <Heart size={12} className="fill-white" />
                          <span>Contribute Now</span>
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          MODAL: ALUMNI MEMBER FULL PROFILE DETAILS (Matching form.png)
      ────────────────────────────────────────────────────────────── */}
      {memberDetailModalOpen && selectedMember && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-3xl w-full rounded-3xl shadow-2xl border border-gray-200 overflow-hidden my-6 animate-fadeIn">
            {/* Modal Header */}
            <div className="bg-[#9B2335] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold text-base shadow-xs">
                  {(selectedMember.name || "AL").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <span>{selectedMember.name}</span>
                    {selectedMember.verified ? (
                      <span className="bg-emerald-500/20 text-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-emerald-400/30 flex items-center gap-1">
                        <Check size={10} /> Verified Alumni
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-200 text-[10px] px-2 py-0.5 rounded-full font-semibold border border-amber-400/30">
                        Pending Verification
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-white/80">
                    Alumni ID #{selectedMember.id} &bull; {selectedMember.degree || "B.Tech"}, {selectedMember.year || selectedMember.graduation_year || "2025"} &bull; {selectedMember.dept || selectedMember.department_name || "Engineering"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setMemberDetailModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto space-y-5 text-xs text-gray-700">
              {/* Step 1: Personal Information (Matching Step 1 in form.png) */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-[#9B2335] uppercase tracking-wider mb-3">
                  <User size={14} />
                  <span>Personal Information (Step 1)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <span className="block text-[10px] text-gray-400 font-medium">Full Name</span>
                    <span className="font-semibold text-gray-800">{selectedMember.name || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-medium">Email Address</span>
                    <span className="font-semibold text-gray-800 break-all">{selectedMember.email || "-"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-medium">Phone Number</span>
                    <span className="font-semibold text-gray-800">{selectedMember.phone || "Not provided"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-medium">Date of Birth</span>
                    <span className="font-semibold text-gray-800">
                      {selectedMember.dob ? new Date(selectedMember.dob).toLocaleDateString("en-IN") : "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-medium">Gender</span>
                    <span className="font-semibold text-gray-800 capitalize">{selectedMember.gender || "Not specified"}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-medium">Current Location</span>
                    <span className="font-semibold text-gray-800">{selectedMember.location || "Not provided"}</span>
                  </div>
                  <div className="sm:col-span-2 md:col-span-3">
                    <span className="block text-[10px] text-gray-400 font-medium">LinkedIn Profile</span>
                    {(selectedMember.linkedin || selectedMember.linkedin_url) ? (
                      <a
                        href={selectedMember.linkedin || selectedMember.linkedin_url || "#"}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#9B2335] hover:underline font-semibold inline-flex items-center gap-1 mt-0.5"
                      >
                        <Globe size={11} />
                        {selectedMember.linkedin || selectedMember.linkedin_url}
                      </a>
                    ) : (
                      <span className="text-gray-400 italic">No LinkedIn profile provided</span>
                    )}
                  </div>
                  <div className="sm:col-span-2 md:col-span-3">
                    <span className="block text-[10px] text-gray-400 font-medium">Short Bio</span>
                    <p className="mt-0.5 text-gray-700 bg-white p-2.5 rounded-xl border border-gray-100 italic leading-relaxed">
                      &ldquo;{selectedMember.bio || "Passionate alumni of Tolani Polytechnic community."}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2: Education & Career Details (Matching Step 2 in form.png) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Education */}
                <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#9B2335] uppercase tracking-wider mb-3">
                    <GraduationCap size={14} />
                    <span>Education Details</span>
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-medium">Degree</span>
                      <span className="font-semibold text-gray-800">{selectedMember.degree || "B.Tech"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 font-medium">Branch / Department</span>
                      <span className="font-semibold text-gray-800">{selectedMember.department_name || selectedMember.dept || "Engineering"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 font-medium">Batch / Year of Passing</span>
                      <span className="font-semibold text-gray-800">{selectedMember.year || selectedMember.graduation_year || "2025"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 font-medium">Institute</span>
                      <span className="font-semibold text-gray-800">{selectedMember.institute || "Tolani F. G. Polytechnic"}</span>
                    </div>
                  </div>
                </div>

                {/* Career */}
                <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#9B2335] uppercase tracking-wider mb-3">
                    <Briefcase size={14} />
                    <span>Career Details</span>
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <span className="block text-[10px] text-gray-400 font-medium">Current Company</span>
                      <span className="font-semibold text-gray-800">{selectedMember.company || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 font-medium">Job Title / Role</span>
                      <span className="font-semibold text-gray-800">{selectedMember.role || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 font-medium">Work Location</span>
                      <span className="font-semibold text-gray-800">{selectedMember.location || "Not provided"}</span>
                    </div>
                    <div>
                      <span className="block text-[10px] text-gray-400 font-medium">Experience</span>
                      <span className="font-semibold text-gray-800">{selectedMember.experience_years ?? selectedMember.experience ?? 0} years</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills & Technologies */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-[#9B2335] uppercase tracking-wider mb-2">
                  <Sparkles size={14} />
                  <span>Skills &amp; Technologies</span>
                </div>
                {Array.isArray(selectedMember.skills) && selectedMember.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {selectedMember.skills.map((s, idx) => (
                      <span key={idx} className="bg-white text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200 font-medium text-[11px] shadow-2xs">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic text-[11px]">No skills listed</p>
                )}
              </div>

              {/* Step 3: Identity Verification (Matching Step 3 in form.png) */}
              <div className="bg-gray-50/70 p-4 rounded-2xl border border-gray-200/80">
                <div className="flex items-center gap-2 text-xs font-bold text-[#9B2335] uppercase tracking-wider mb-3">
                  <ShieldCheck size={14} />
                  <span>Identity Verification (Step 3)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <span className="block text-[10px] text-gray-400 font-medium">Verification Status</span>
                    <span className="font-bold flex items-center gap-1 mt-0.5">
                      {selectedMember.verified ? (
                        <span className="text-emerald-700 flex items-center gap-1">
                          <CheckCircle2 size={13} /> Verified
                        </span>
                      ) : (
                        <span className="text-amber-700 flex items-center gap-1">
                          <Clock size={13} /> Pending Verification
                        </span>
                      )}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-medium">Verification Method</span>
                    <span className="font-semibold text-gray-800 capitalize">
                      {selectedMember.verification_method || "Email Verification"}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-gray-400 font-medium">Registered Date</span>
                    <span className="font-semibold text-gray-800">
                      {selectedMember.created_at ? new Date(selectedMember.created_at).toLocaleDateString("en-IN") : "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="bg-gray-50 border-t border-gray-200 p-4 flex items-center justify-between">
              <button
                onClick={() => handleToggleVerify(selectedMember)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                  selectedMember.verified
                    ? "bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100"
                    : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
              >
                {selectedMember.verified ? "Mark as Unverified" : "Approve & Verify Member"}
              </button>
              <button
                onClick={() => setMemberDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white max-w-sm w-full rounded-2xl shadow-2xl border border-gray-200 p-6 space-y-4 animate-scaleUp">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 size={24} />
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-bold text-gray-900 text-base">Remove Item?</h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to remove{" "}
                <strong className="text-gray-800 font-semibold">&ldquo;{deleteConfirm.title}&rdquo;</strong>?
              </p>
              {deleteConfirm.type === "member" ? (
                <p className="text-[11px] text-red-700 bg-red-50 p-2 rounded-lg mt-2 border border-red-200">
                  ⚠️ This member record will be permanently deleted from your PostgreSQL database.
                </p>
              ) : deleteConfirm.type === "event" ? (
                <p className="text-[11px] text-red-700 bg-red-50 p-2 rounded-lg mt-2 border border-red-200">
                  ⚠️ This event record will be permanently deleted from your PostgreSQL database.
                </p>
              ) : deleteConfirm.type === "gallery" ? (
                <p className="text-[11px] text-red-700 bg-red-50 p-2 rounded-lg mt-2 border border-red-200">
                  ⚠️ This gallery photo record will be permanently deleted from your PostgreSQL database.
                </p>
              ) : deleteConfirm.type === "news" ? (
                <p className="text-[11px] text-red-700 bg-red-50 p-2 rounded-lg mt-2 border border-red-200">
                  ⚠️ This news article record will be permanently deleted from your PostgreSQL database.
                </p>
              ) : (
                <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-2 border border-amber-200">
                  ℹ️ Preview Mode Safe: This item will only be hidden in your current preview session and will NOT modify your live PostgreSQL database.
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-700 transition-colors shadow"
              >
                Yes, Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
