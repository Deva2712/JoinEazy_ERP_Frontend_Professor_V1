// src/pages/Registrar/components/shared.jsx
import React from "react";
import {
  Clock, CircleCheck, XCircle, Send,
  Mail, Phone, MapPin, Info,
} from "lucide-react";

/* ─── Registrar Contact Info ─────────────────────────────────────── */
export const REGISTRAR_CONTACT = {
  email: "registrar@university.edu.in",
  phone: "+91-20-2650-1234",
  officeHours: "Mon – Fri, 9:30 AM – 4:30 PM",
  location: "Administration Block, Room 101, Ground Floor",
};

/* ─── All requestable document types ────────────────────────────── */
export const ALL_DOC_TYPES = [
  "Bonafide Certificate",
  "No Dues Certificate",
  "Character Certificate",
  "Conduct Certificate",
  "Letter of Recommendation",
  "Official Transcript (Sealed)",
  "Unofficial Transcript",
  "Provisional Transcript",
  "Transfer Certificate (TC)",
  "Migration Certificate",
  "10th Grade Mark Sheet Copy",
  "12th Grade Mark Sheet Copy",
  "CMM Certificate",
];

/* ─── Required admission documents (admin-verified) ──────────────── */
export const REQUIRED_DOCS = [
  { id: "rd1",  label: "10th Grade Mark Sheet (Original + 2 copies)",           category: "Academic" },
  { id: "rd2",  label: "12th Grade Mark Sheet / Diploma (Original + 2 copies)",  category: "Academic" },
  { id: "rd3",  label: "Entrance Score Card (JEE / CET / NEET etc.)",             category: "Academic" },
  { id: "rd4",  label: "School / College Leaving Certificate",                    category: "Academic" },
  { id: "rd5",  label: "Migration Certificate (if from another board)",           category: "Academic" },
  { id: "rd6",  label: "Caste / Category Certificate (SC/ST/OBC if applicable)",  category: "Identity" },
  { id: "rd7",  label: "Domicile / Residence Certificate",                        category: "Identity" },
  { id: "rd8",  label: "Aadhar Card (Self-attested photocopy)",                   category: "Identity" },
  { id: "rd9",  label: "Passport-size Photographs (6 copies)",                    category: "Identity" },
  { id: "rd10", label: "Medical Fitness Certificate (from registered doctor)",    category: "Other"    },
  { id: "rd11", label: "Gap Certificate (if applicable)",                         category: "Other"    },
  { id: "rd12", label: "Anti-Ragging Undertaking (signed)",                       category: "Other"    },
];

/* ─── Mock faculty list for LoR ──────────────────────────────────── */
export const FACULTY_LIST = [
  { id: "f1", name: "Dr. Anjali Sharma",   dept: "Computer Science" },
  { id: "f2", name: "Prof. Ramesh Gupta",  dept: "Mathematics" },
  { id: "f3", name: "Dr. Priya Nair",      dept: "Electronics" },
  { id: "f4", name: "Prof. Sunil Mehta",   dept: "Computer Science" },
  { id: "f5", name: "Dr. Kavita Desai",    dept: "Physics" },
];

/* ─── StatusBadge ────────────────────────────────────────────────── */
export const StatusBadge = ({ status }) => {
  const styles = {
    Processing: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
    Ready:      "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    Rejected:   "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    Submitted:  "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
    Pending:    "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
    Approved:   "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
    Missing:    "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
    Verified:   "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  };
  const icons = {
    Processing: <Clock className="size-3 mr-1" />,
    Ready:      <CircleCheck className="size-3 mr-1" />,
    Approved:   <CircleCheck className="size-3 mr-1" />,
    Verified:   <CircleCheck className="size-3 mr-1" />,
    Rejected:   <XCircle className="size-3 mr-1" />,
    Missing:    <XCircle className="size-3 mr-1" />,
    Submitted:  <Send className="size-3 mr-1" />,
    Pending:    <Clock className="size-3 mr-1" />,
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${styles[status] || "bg-gray-50 border-gray-200 text-gray-600"}`}>
      {icons[status]}{status}
    </span>
  );
};

/* ─── StatusTimeline ─────────────────────────────────────────────── */
export const StatusTimeline = ({ status }) => {
  const steps    = ["Submitted", "Processing", "Ready"];
  const failedAt = status === "Rejected" ? 1 : -1;
  const currentIdx = failedAt >= 0 ? failedAt : steps.indexOf(status);
  return (
    <div className="flex items-center gap-1 mt-3">
      {steps.map((step, i) => {
        const done   = i < currentIdx || (status === "Ready" && i <= currentIdx);
        const active = i === currentIdx && status !== "Rejected";
        const failed = failedAt === i;
        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-0.5">
              <div className={`size-2 rounded-full ${failed ? "bg-red-500" : done || active ? "bg-purple-500" : "bg-gray-200 dark:bg-gray-700"}`} />
              <span className={`text-[10px] whitespace-nowrap ${failed ? "text-red-500" : done || active ? "text-purple-600 dark:text-purple-400 font-semibold" : "text-gray-400"}`}>
                {failed ? "Rejected" : step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-px flex-1 mb-3.5 ${i < currentIdx ? "bg-purple-400" : "bg-gray-200 dark:bg-gray-700"}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ─── ContactCard ────────────────────────────────────────────────── */
export const ContactCard = () => (
  <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
      <Info className="size-4 text-purple-500" /> Registrar Office Contact
    </h3>
    <div className="space-y-3">
      {[
        { icon: <Mail className="size-4 text-purple-600 dark:text-purple-400" />, bg: "bg-purple-50 dark:bg-purple-900/20", label: "Email",
          content: <a href={`mailto:${REGISTRAR_CONTACT.email}`} className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline">{REGISTRAR_CONTACT.email}</a> },
        { icon: <Phone className="size-4 text-blue-600 dark:text-blue-400" />, bg: "bg-blue-50 dark:bg-blue-900/20", label: "Phone",
          content: <a href={`tel:${REGISTRAR_CONTACT.phone}`} className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:underline">{REGISTRAR_CONTACT.phone}</a> },
        { icon: <Clock className="size-4 text-amber-600 dark:text-amber-400" />, bg: "bg-amber-50 dark:bg-amber-900/20", label: "Office Hours",
          content: <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{REGISTRAR_CONTACT.officeHours}</p> },
        { icon: <MapPin className="size-4 text-green-600 dark:text-green-400" />, bg: "bg-green-50 dark:bg-green-900/20", label: "Location",
          content: <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{REGISTRAR_CONTACT.location}</p> },
      ].map(({ icon, bg, label, content }) => (
        <div key={label} className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${bg} shrink-0`}>{icon}</div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
            {content}
          </div>
        </div>
      ))}
    </div>
  </div>
);