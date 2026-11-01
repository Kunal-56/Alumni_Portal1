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
  id: string;
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
  id: string;
  label: string;
  category: string;
  year: string;
  desc: string;
  img: string;
  bg?: string;
}

interface NewsItem {
  id: string;
  title: string;
  date: string;
  category: string;
  author: string;
  readTime: string;
  excerpt: string;
  content?: string;
  img: string;
  featured: boolean;
}

interface MemberItem {
  id: string;
  name: string;
  email: string;
  dept: string;
  year: string;
  company: string;
  role: string;
  verified: boolean;
  location?: string;
  degree?: string;
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
  const [members, setMembers] = useState<MemberItem[]>(INITIAL_MEMBERS);
  const [campaigns, setCampaigns] = useState<CampaignItem[]>(INITIAL_CAMPAIGNS);

  // ── Event Modal State ──
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
    type: "event" | "gallery" | "news";
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

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title.trim()) return;

    const tags = eventForm.tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (editingEvent) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingEvent.id
            ? {
                ...ev,
                title: eventForm.title.trim(),
                day: eventForm.day.trim() || "01",
                month: eventForm.month.trim().toUpperCase() || "JAN",
                year: eventForm.year.trim() || "2026",
                time: eventForm.time.trim() || "10:00 AM",
                mode: eventForm.mode,
                location:
                  eventForm.location.trim() ||
                  (eventForm.mode === "Online" ? "Online" : "Tolani Auditorium"),
                type: eventForm.type,
                desc: eventForm.desc.trim(),
                tags: tags.length ? tags : ["Alumni"],
                img: eventForm.img || "/campus-building.png",
              }
            : ev
        )
      );
      triggerToast(`Event "${eventForm.title}" updated in Preview Mode!`);
    } else {
      const newEvt: EventItem = {
        id: `evt-${Date.now()}`,
        title: eventForm.title.trim(),
        day: eventForm.day.trim() || "01",
        month: eventForm.month.trim().toUpperCase() || "JAN",
        year: eventForm.year.trim() || "2026",
        time: eventForm.time.trim() || "10:00 AM",
        mode: eventForm.mode,
        location:
          eventForm.location.trim() ||
          (eventForm.mode === "Online" ? "Online" : "Tolani Auditorium"),
        type: eventForm.type,
        desc: eventForm.desc.trim(),
        tags: tags.length ? tags : ["Alumni"],
        img: eventForm.img || "/campus-building.png",
      };
      setEvents((prev) => [newEvt, ...prev]);
      triggerToast(`Event "${newEvt.title}" added to Preview Mode!`);
    }
    setEventModalOpen(false);
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

  const handleSaveGallery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.label.trim()) return;

    if (editingGallery) {
      setGallery((prev) =>
        prev.map((g) =>
          g.id === editingGallery.id
            ? {
                ...g,
                label: galleryForm.label.trim(),
                category: galleryForm.category,
                year: galleryForm.year.trim() || "2026",
                desc: galleryForm.desc.trim(),
                img: galleryForm.img || "/campus-building.png",
              }
            : g
        )
      );
      triggerToast(`Gallery photo "${galleryForm.label}" updated in Preview Mode!`);
    } else {
      const newGal: GalleryItem = {
        id: `gal-${Date.now()}`,
        label: galleryForm.label.trim(),
        category: galleryForm.category,
        year: galleryForm.year.trim() || "2026",
        desc: galleryForm.desc.trim(),
        img: galleryForm.img || "/campus-building.png",
      };
      setGallery((prev) => [newGal, ...prev]);
      triggerToast(`Gallery photo "${newGal.label}" added in Preview Mode!`);
    }
    setGalleryModalOpen(false);
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

  const handleSaveNews = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.title.trim()) return;

    if (editingNews) {
      setNews((prev) =>
        prev.map((n) =>
          n.id === editingNews.id
            ? {
                ...n,
                title: newsForm.title.trim(),
                category: newsForm.category,
                author: newsForm.author.trim() || "Editorial Team",
                date: newsForm.date.trim() || "Today",
                readTime: newsForm.readTime.trim() || "3 min read",
                excerpt: newsForm.excerpt.trim(),
                content: newsForm.content.trim() || newsForm.excerpt.trim(),
                img: newsForm.img || "/campus-building.png",
                featured: Boolean(newsForm.featured),
              }
            : n
        )
      );
      triggerToast(`News article updated in Preview Mode!`);
    } else {
      const newN: NewsItem = {
        id: `nws-${Date.now()}`,
        title: newsForm.title.trim(),
        category: newsForm.category,
        author: newsForm.author.trim() || "Editorial Team",
        date: newsForm.date.trim() || "Today",
        readTime: newsForm.readTime.trim() || "3 min read",
        excerpt: newsForm.excerpt.trim(),
        content: newsForm.content.trim() || newsForm.excerpt.trim(),
        img: newsForm.img || "/campus-building.png",
        featured: Boolean(newsForm.featured),
      };
      setNews((prev) => [newN, ...prev]);
      triggerToast(`News article "${newN.title.slice(0, 30)}..." published in Preview Mode!`);
    }
    setNewsModalOpen(false);
  };

  // ── DELETE ACTIONS ──
  const executeDelete = () => {
    if (!deleteConfirm) return;
    const { type, id, title } = deleteConfirm;

    if (type === "event") {
      setEvents((prev) => prev.filter((e) => e.id !== id));
      triggerToast(`Event "${title}" removed (Preview Mode)`);
    } else if (type === "gallery") {
      setGallery((prev) => prev.filter((g) => g.id !== id));
      triggerToast(`Gallery photo "${title}" removed (Preview Mode)`);
    } else if (type === "news") {
      setNews((prev) => prev.filter((n) => n.id !== id));
      triggerToast(`News article removed (Preview Mode)`);
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
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <CalendarDays className="text-[#9B2335]" size={20} />
                  <span>Upcoming Events Manager</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage event photo, title, time, date, mode (online/offline), description, and tags.
                </p>
              </div>

              <button
                onClick={openNewEventModal}
                className="bg-[#9B2335] hover:bg-[#7a1b28] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
              >
                <Plus size={16} />
                <span>Add New Event</span>
              </button>
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
                        onClick={() => setDeleteConfirm({ type: "event", id: ev.id, title: ev.title })}
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
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <ImageIcon className="text-amber-600" size={20} />
                  <span>Gallery Highlights Manager</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Manage gallery photo, event name/title, category badge, year, and description.
                </p>
              </div>

              <button
                onClick={openNewGalleryModal}
                className="bg-[#9B2335] hover:bg-[#7a1b28] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
              >
                <Plus size={16} />
                <span>Add Gallery Photo</span>
              </button>
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
                        onClick={() => setDeleteConfirm({ type: "gallery", id: g.id, title: g.label })}
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

              <button
                onClick={openNewNewsModal}
                className="bg-[#9B2335] hover:bg-[#7a1b28] text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all active:scale-95 shrink-0"
              >
                <Plus size={16} />
                <span>Add News Article</span>
              </button>
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
                        onClick={() => setDeleteConfirm({ type: "news", id: item.id, title: item.title })}
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

        {/* ── TAB 5: MEMBERS DIRECTORY ── */}
        {activeTab === "members" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#E9DDD8] shadow-sm">
              <div>
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Users className="text-purple-600" size={20} />
                  <span>Alumni Members Directory</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Registered alumni members of Tolani F.G. Polytechnic community.
                </p>
              </div>
              <div className="text-xs bg-purple-50 text-purple-800 px-3 py-1.5 rounded-xl font-semibold border border-purple-200">
                Total Alumni: {members.length}
              </div>
            </div>

            {/* Member Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {members.map((mem, idx) => {
                const initials = mem.name
                  .split(" ")
                  .filter(Boolean)
                  .slice(0, 2)
                  .map((w: string) => w[0].toUpperCase())
                  .join("");
                const avatarColors = ["#9B2335","#1e3a5f","#2d6a4f","#6b3a2a","#4a4a8a","#7b4f2e"];
                const avatarBg = avatarColors[idx % avatarColors.length];
                return (
                  <div
                    key={mem.id}
                    className="bg-white rounded-2xl border border-[#E9DDD8] shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col items-center text-center"
                  >
                    {/* Avatar with online dot */}
                    <div className="relative mb-3">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow"
                        style={{ background: avatarBg }}
                      >
                        {initials}
                      </div>
                      <span className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white block" />
                    </div>

                    {/* Name */}
                    <p className="font-bold text-sm leading-tight mb-0.5" style={{ color: "#9B2335" }}>
                      {mem.name}
                    </p>

                    {/* Degree · Year · Dept */}
                    <p className="text-[11px] text-gray-500 font-medium mb-1">
                      {mem.degree || "B.Tech"}, {mem.year}, {mem.dept}
                    </p>

                    {/* Email */}
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mb-2">
                      <Mail size={10} />
                      {mem.email}
                    </p>

                    <div className="w-full border-t border-gray-100 mb-2" />

                    {/* Company + Role */}
                    {mem.company && (
                      <p className="text-[11px] text-gray-600 flex items-center gap-1.5 mb-1">
                        <Briefcase size={11} className="text-[#9B2335] shrink-0" />
                        <span className="font-medium">{mem.company}</span>
                      </p>
                    )}

                    {/* Location */}
                    {mem.location && (
                      <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                        <MapPin size={11} className="text-[#9B2335] shrink-0" />
                        {mem.location}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
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
                  {editingEvent ? "Edit Event (Preview Mode)" : "Add New Event (Preview Mode)"}
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
                      onChange={(e) => handleImageFile(e, (url) => setEventForm({ ...eventForm, img: url }))}
                    />
                    <button
                      type="button"
                      onClick={() => eventFileRef.current?.click()}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-[#9B2335] rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-rose-200"
                    >
                      <Upload size={14} />
                      <span>Upload Photo</span>
                    </button>
                    <input
                      type="text"
                      value={eventForm.img}
                      onChange={(e) => setEventForm({ ...eventForm, img: e.target.value })}
                      placeholder="Or enter Image URL (/campus-building.png)"
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
                    className="px-6 py-2.5 rounded-xl font-bold bg-[#9B2335] hover:bg-[#7a1b28] text-white shadow-md transition-all active:scale-95"
                  >
                    {editingEvent ? "Save Changes" : "Create Event"}
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
                  {editingGallery ? "Edit Gallery Photo (Preview Mode)" : "Add Gallery Photo (Preview Mode)"}
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
                      onChange={(e) =>
                        handleImageFile(e, (url) => setGalleryForm({ ...galleryForm, img: url }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => galleryFileRef.current?.click()}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-[#9B2335] rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-rose-200"
                    >
                      <Upload size={14} />
                      <span>Upload Photo</span>
                    </button>
                    <input
                      type="text"
                      value={galleryForm.img}
                      onChange={(e) => setGalleryForm({ ...galleryForm, img: e.target.value })}
                      placeholder="Or enter Image URL"
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
                    className="px-6 py-2.5 rounded-xl font-bold bg-[#9B2335] hover:bg-[#7a1b28] text-white shadow-md transition-all active:scale-95"
                  >
                    {editingGallery ? "Save Changes" : "Add to Gallery"}
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
                  {editingNews ? "Edit News Article (Preview Mode)" : "Add News Article (Preview Mode)"}
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
                      onChange={(e) =>
                        handleImageFile(e, (url) => setNewsForm({ ...newsForm, img: url }))
                      }
                    />
                    <button
                      type="button"
                      onClick={() => newsFileRef.current?.click()}
                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-[#9B2335] rounded-xl font-bold flex items-center gap-1.5 transition-colors border border-rose-200"
                    >
                      <Upload size={14} />
                      <span>Upload Banner</span>
                    </button>
                    <input
                      type="text"
                      value={newsForm.img}
                      onChange={(e) => setNewsForm({ ...newsForm, img: e.target.value })}
                      placeholder="Or enter Image URL"
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
                      <option value="Campus">Campus</option>
                      <option value="Innovation">Innovation</option>
                      <option value="Academic">Academic</option>
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
                    className="px-6 py-2.5 rounded-xl font-bold bg-[#9B2335] hover:bg-[#7a1b28] text-white shadow-md transition-all active:scale-95"
                  >
                    {editingNews ? "Save Changes" : "Publish News"}
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
              <p className="text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg mt-2 border border-amber-200">
                ℹ️ Preview Mode Safe: This item will only be hidden in your current preview session and will NOT modify your live PostgreSQL database.
              </p>
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
