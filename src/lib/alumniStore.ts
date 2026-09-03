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

/* ─── Initial Seed Members (16 members = exactly 2 pages of 8) ─── */
export const INITIAL_MEMBERS: Member[] = [
  { id: 1, name: "Daksh Ahir", degree: "B.Tech", year: "2025", dept: "CSE", company: "Google", role: "Software Engineer", location: "Bangalore, India", email: "daksh.ahir@alumni.tolani.ac.in", phone: "+91 98765 43210", linkedin: "www.linkedin.com/in/daksh-ahir-759a863a7/", bio: "Passionate software engineer at Google, working on large-scale distributed systems. Former gold medalist at Tolani. Love open-source contributions and community building.", skills: ["React", "Node.js", "Python", "Cloud", "Kubernetes"], achievements: ["Dean's List 2024–25", "Best Project Award 2025", "Smart India Hackathon Winner"], experience: "2", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 2, name: "Kunal Solanki", degree: "B.Tech", year: "2024", dept: "CSE", company: "Microsoft", role: "Product Manager", location: "Hyderabad, India", email: "kunal.solanki@alumni.tolani.ac.in", phone: "+91 87654 32109", linkedin: "https://www.linkedin.com/in/kunal-solanki-3093613a8/", bio: "Product Manager at Microsoft Azure, driving cloud innovation. Alumni mentor and startup advisor.", skills: ["Product Strategy", "Agile", "Azure", "Data Analytics", "Leadership"], achievements: ["Microsoft Rising Star 2025", "Alumni Mentor of the Year"], experience: "3", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 3, name: "Khushal Bhatiya", degree: "BA (J&MC)", year: "2026", dept: "Journalism", company: "Zomato", role: "Content Strategist", location: "Gurugram, India", email: "khushal.bhatiya@alumni.tolani.ac.in", phone: "+91 76543 21098", linkedin: "https://www.linkedin.com/in/khushal-bhatiya-33864942b/", bio: "Content Strategist at Zomato, crafting brand narratives. Passionate about digital media and creative storytelling.", skills: ["Content Strategy", "SEO", "Social Media", "Brand Writing", "Analytics"], achievements: ["Best Journalist Award 2026", "Editor, Tolani Times"], experience: "1", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 4, name: "Raghav Rathod", degree: "BBA", year: "2026", dept: "Business", company: "Deloitte", role: "Business Analyst", location: "Mumbai, India", email: "raghav.rathod@alumni.tolani.ac.in", phone: "+91 65432 10987", linkedin: "https://www.linkedin.com/in/raghav-rathod-6b7945402/", bio: "Business Analyst at Deloitte Consulting. Expert in financial modelling and digital transformation.", skills: ["Financial Modelling", "Consulting", "Excel", "Power BI", "Strategy"], achievements: ["Deloitte Rising Talent 2026", "CFA Level 1"], experience: "1", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 5, name: "Bhoomi Sumbad", degree: "B.Tech", year: "2026", dept: "CSE", company: "Amazon", role: "SDE II", location: "Chennai, India", email: "bhoomi.sumbad@alumni.tolani.ac.in", phone: "+91 54321 09876", linkedin: "https://www.linkedin.com/in/bhoomi-sumbad-1131683ba/", bio: "Software Development Engineer at Amazon Web Services. Backend systems enthusiast and competitive programmer.", skills: ["Java", "AWS", "System Design", "Microservices", "DSA"], achievements: ["Amazon Star Performer Q2 2026", "Open Source Contributor"], experience: "2", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 6, name: "Dev Gouswami", degree: "BA (J&MC)", year: "2020", dept: "Journalism", company: "Times Of India", role: "Senior Reporter", location: "Kolkata, India", email: "dev.gouswami@alumni.tolani.ac.in", phone: "+91 43210 98765", linkedin: "https://www.linkedin.com/in/dev-goswami-61467b2b9/", bio: "Senior Reporter at Times of India covering politics, culture and social affairs.", skills: ["Investigative Journalism", "Reporting", "Editing", "Video Production"], achievements: ["Press Club Award 2024", "Tolani Distinguished Alumnus"], experience: "5", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 7, name: "Parth Pitroda", degree: "B.Tech", year: "2023", dept: "IT", company: "Infosys", role: "Tech Lead", location: "Pune, India", email: "parth.pitroda@alumni.tolani.ac.in", phone: "+91 32109 87654", linkedin: "https://www.linkedin.com/in/parth-pitroda1/", bio: "Tech Lead at Infosys managing enterprise application development. Passionate about clean code and agile methodologies.", skills: ["Java EE", "Spring Boot", "Docker", "CI/CD", "Oracle DB"], achievements: ["Infosys Insta Award 2025", "Certified Scrum Master"], experience: "3", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 8, name: "Solanki Yashvi", degree: "BBA", year: "2021", dept: "Business", company: "Accenture", role: "Management Consultant", location: "Noida, India", email: "yashvi.solanki@alumni.tolani.ac.in", phone: "+91 21098 76543", linkedin: "linkedin.com/in/solankiyashvi", bio: "Management Consultant at Accenture Strategy. Specialist in digital transformation and ERP implementations.", skills: ["Management Consulting", "SAP", "Change Management", "ERP", "PMO"], achievements: ["Accenture ACE Award 2024", "Tolani Top 10 Graduates"], experience: "4", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 9, name: "Priya Nair", degree: "B.Tech", year: "2022", dept: "ECE", company: "TCS", role: "Embedded Engineer", location: "Kochi, India", email: "priya.nair@alumni.tolani.ac.in", phone: "+91 91234 56789", linkedin: "linkedin.com/in/priyanair", bio: "Embedded systems engineer working on IoT devices at TCS Innovation Labs. Robotics enthusiast and IEEE volunteer.", skills: ["Embedded C", "RTOS", "IoT", "PCB Design", "ARM Cortex"], achievements: ["TCS Star of the Month", "IEEE Best Paper Award", "Robotics Club Founder"], experience: "3", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 10, name: "Vikram Tiwari", degree: "M.Tech", year: "2021", dept: "CSE", company: "Wipro", role: "Senior Architect", location: "Bhopal, India", email: "vikram.tiwari@alumni.tolani.ac.in", phone: "+91 82345 67890", linkedin: "linkedin.com/in/vikramtiwari", bio: "Senior Solution Architect at Wipro. Specializes in enterprise cloud migrations and DevOps transformations. Guest faculty at Tolani.", skills: ["Cloud Architecture", "DevOps", "Terraform", "Azure", "Solution Design"], achievements: ["Wipro Pinnacle Award", "Guest Faculty Tolani 2024", "AWS Certified Architect"], experience: "5", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 11, name: "Meera Joshi", degree: "B.Tech", year: "2020", dept: "IT", company: "HCL", role: "Data Scientist", location: "Delhi, India", email: "meera.joshi@alumni.tolani.ac.in", phone: "+91 73456 78901", linkedin: "linkedin.com/in/meerajoshi", bio: "Data Scientist at HCL Analytics building ML models for financial predictions. Kaggle expert. Published researcher in AI ethics.", skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Data Visualization"], achievements: ["Kaggle Expert Badge", "HCL Excellence Award", "Published AI Research Paper"], experience: "5", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 12, name: "Aarav Singh", degree: "BBA", year: "2023", dept: "Business", company: "KPMG", role: "Audit Associate", location: "Ahmedabad, India", email: "aarav.singh@alumni.tolani.ac.in", phone: "+91 64567 89012", linkedin: "linkedin.com/in/aaravsingh", bio: "Audit Associate at KPMG India. Specialist in statutory audit and risk advisory. CA finalist.", skills: ["Audit", "Risk Advisory", "IFRS", "Financial Analysis", "Compliance"], achievements: ["KPMG Future Leader 2024", "CA Finalist", "NSC Gold Medal"], experience: "2", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 13, name: "Divya Patel", degree: "B.Tech", year: "2024", dept: "CSE", company: "Flipkart", role: "Full Stack Developer", location: "Surat, India", email: "divya.patel@alumni.tolani.ac.in", phone: "+91 55678 90123", linkedin: "linkedin.com/in/divyapatel", bio: "Full Stack Developer at Flipkart building scalable e-commerce solutions. React & Node specialist.", skills: ["React", "Node.js", "MongoDB", "GraphQL", "TypeScript"], achievements: ["Flipkart Spark Award", "Women in Tech Lead", "HackWithIndia Winner"], experience: "2", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 14, name: "Rahul Verma", degree: "MBA", year: "2022", dept: "Management", company: "HDFC Bank", role: "Branch Manager", location: "Jaipur, India", email: "rahul.verma@alumni.tolani.ac.in", phone: "+91 46789 01234", linkedin: "linkedin.com/in/rahulverma", bio: "Branch Manager at HDFC Bank. Expert in retail banking and wealth management.", skills: ["Banking", "Wealth Management", "CRM", "Team Leadership", "Risk Management"], achievements: ["HDFC Fastest Growth Award", "Youngest Branch Manager", "MBA Gold Medal"], experience: "4", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 15, name: "Tanvi Desai", degree: "B.Tech", year: "2021", dept: "Mechanical", company: "Tata Motors", role: "Design Engineer", location: "Vadodara, India", email: "tanvi.desai@alumni.tolani.ac.in", phone: "+91 37890 12345", linkedin: "linkedin.com/in/tanvidesai", bio: "Automotive Design Engineer at Tata Motors, working on next-gen EV platforms.", skills: ["CAD/CAM", "SolidWorks", "ANSYS", "EV Systems", "GD&T"], achievements: ["Tata Innovator Award 2024", "Best Design Thesis 2021", "SAE India Member"], experience: "4", institute: "Tolani F. & Polytechnic", verified: true },
  { id: 16, name: "Karan Malhotra", degree: "B.Tech", year: "2025", dept: "Civil", company: "L&T", role: "Project Engineer", location: "Chandigarh, India", email: "karan.malhotra@alumni.tolani.ac.in", phone: "+91 28901 23456", linkedin: "linkedin.com/in/karanmalhotra", bio: "Project Engineer at L&T Construction managing large-scale infrastructure projects.", skills: ["AutoCAD", "STAAD Pro", "Project Management", "Structural Analysis", "MS Project"], achievements: ["L&T Star Performer 2025", "Best Civil Graduate 2025", "LEED Green Associate"], experience: "1", institute: "Tolani F. & Polytechnic", verified: true },
];

const STORAGE_KEY = "tolani_alumni_members_v1";

/* ─── LocalStorage Helpers ─── */
export function getStoredMembers(): Member[] {
  if (typeof window === "undefined") return INITIAL_MEMBERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEMBERS));
      return INITIAL_MEMBERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch (err) {
    console.error("Error reading alumni members:", err);
  }
  return INITIAL_MEMBERS;
}

export function saveMembers(members: Member[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    window.dispatchEvent(new Event("alumni_members_updated"));
  } catch (err) {
    console.error("Error saving alumni members:", err);
  }
}

export function addMember(newMember: Omit<Member, "id">): Member {
  const current = getStoredMembers();
  const maxId = current.reduce((max, m) => Math.max(max, m.id), 0);
  const memberWithId: Member = { ...newMember, id: maxId + 1, verified: true, createdAt: new Date().toISOString() };
  saveMembers([...current, memberWithId]);
  return memberWithId;
}

export function getMemberById(id: number): Member | undefined {
  return getStoredMembers().find((m) => m.id === id);
}

/* ─── React Hook for Live Sync ─── */
export function useAlumniMembers() {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setMembers(getStoredMembers());
    setIsLoaded(true);
    const handleUpdate = () => setMembers(getStoredMembers());
    window.addEventListener("alumni_members_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("alumni_members_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  const handleAddMember = (data: Omit<Member, "id">) => {
    const created = addMember(data);
    setMembers(getStoredMembers());
    return created;
  };

  return { members, isLoaded, addMember: handleAddMember, getMemberById: (id: number) => members.find((m) => m.id === id) };
}
