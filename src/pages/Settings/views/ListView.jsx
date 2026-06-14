import React from "react";
import { useNavigate } from "react-router-dom";
import {
    User, Phone, Users, GraduationCap, FileText, Globe,
    LayoutGrid, Calendar, Stethoscope, Landmark, Printer,
    Clipboard, ChevronRight, LogOut, Settings, Lock, Bug,
} from "lucide-react";
import { cardClass, labelCls } from "../components/ProfilePrimitives";

const SECTIONS = [
    { id: "personal",  label: "Personal Info",    icon: User,          color: "text-blue-600",    bg: "bg-blue-100 dark:bg-blue-900/30"       },
    { id: "contact",   label: "Contact Details",  icon: Phone,         color: "text-teal-600",    bg: "bg-teal-100 dark:bg-teal-900/30"       },
    { id: "family",    label: "Family Details",   icon: Users,         color: "text-orange-600",  bg: "bg-orange-100 dark:bg-orange-900/30"   },
    { id: "academic",  label: "Academic History", icon: GraduationCap, color: "text-violet-600",  bg: "bg-violet-100 dark:bg-violet-900/30"   },
    { id: "entrance",  label: "Entrance Exams",   icon: Clipboard,     color: "text-sky-600",     bg: "bg-sky-100 dark:bg-sky-900/30"         },
    { id: "documents", label: "Documents",        icon: FileText,      color: "text-rose-600",    bg: "bg-rose-100 dark:bg-rose-900/30"       },
    { id: "passport",  label: "Passport & Visa",  icon: Globe,         color: "text-emerald-600", bg: "bg-emerald-100 dark:bg-emerald-900/30" },
    { id: "portfolio", label: "My Portfolio",     icon: LayoutGrid,    color: "text-purple-600",  bg: "bg-purple-100 dark:bg-purple-900/30"   },
    { id: "gap",       label: "Gap Details",      icon: Calendar,      color: "text-slate-600",   bg: "bg-slate-100 dark:bg-slate-900/30"     },
    { id: "medical",   label: "Medical Details",  icon: Stethoscope,   color: "text-red-600",     bg: "bg-red-100 dark:bg-red-900/30"         },
    { id: "bank",      label: "Bank Details",     icon: Landmark,      color: "text-blue-700",    bg: "bg-blue-100 dark:bg-blue-900/30"       },
    { id: "print",     label: "Print Profile",    icon: Printer,       color: "text-gray-600",    bg: "bg-gray-100 dark:bg-gray-800"          },
];

export { SECTIONS };

const ListView = ({ studentData, profileImageUrl, onImageUpload, onLogout, additionalLinks = [] }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </div>
                    <h1 className="text-xl font-black text-gray-900 dark:text-white">My Profile</h1>
                </div>
                <button onClick={onLogout}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs transition-all">
                    <LogOut className="size-4" /> Sign Out
                </button>
            </div>

            {/* Avatar card */}
            <div className={`${cardClass} flex flex-col sm:flex-row items-center gap-4 sm:gap-5`}>
                <div className="size-20 rounded-3xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 text-3xl font-black overflow-hidden border-2 border-white dark:border-gray-700 shadow-xl">
                    {profileImageUrl && profileImageUrl !== "https://via.placeholder.com/150"
                        ? <img src={profileImageUrl} alt={studentData.fullName} className="size-full object-cover" />
                        : <span>{(studentData.fullName || "S")[0].toUpperCase()}</span>}
                </div>
                <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="text-lg font-bold text-gray-900 dark:text-white truncate">{studentData.fullName || "Student"}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">{studentData.officialEmail}</div>
                    {studentData.rollNumber && <div className="text-xs text-blue-600 dark:text-blue-400 font-medium mt-0.5">{studentData.rollNumber}</div>}
                </div>
                <label className="cursor-pointer w-full sm:w-auto px-5 py-2.5 bg-gray-100 dark:bg-gray-800 text-center text-gray-900 dark:text-white rounded-xl font-bold text-xs hover:bg-gray-200 dark:hover:bg-gray-700 transition-all">
                    <input type="file" className="hidden" accept="image/*"
                        onChange={e => e.target.files[0] && onImageUpload(e.target.files[0])} />
                    Change Photo
                </label>
            </div>

            {/* Sections */}
            <div>
                <p className={`${labelCls} mb-3`}>Profile Sections</p>
                <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    {SECTIONS.map((sec, i) => (
                        <button key={sec.id} onClick={() => navigate(`/settings/${sec.id}`)}
                            className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#252a36] transition-colors text-left ${i !== SECTIONS.length - 1 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}>
                            <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${sec.bg}`}>
                                <sec.icon className={`size-4 ${sec.color}`} />
                            </div>
                            <span className="flex-1 text-sm font-bold text-gray-900 dark:text-white">{sec.label}</span>
                            <ChevronRight className="size-4 text-gray-400 shrink-0" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Account */}
            <div>
                <p className={`${labelCls} mb-3`}>Account</p>
                <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                    {[
                        { icon: Lock, label: "Security",     desc: "Update your password",   path: "password",   color: "bg-rose-100 dark:bg-rose-900/30 text-rose-600"   },
                        { icon: Bug,  label: "Report a Bug", desc: "Submit technical issues", path: "bug-report", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600" },
                    ].map((item, i) => (
                        <button key={item.label} onClick={() => navigate(`/settings/${item.path}`)}
                            className={`w-full flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-[#252a36] transition-colors text-left ${i === 0 ? "border-b border-gray-100 dark:border-gray-800" : ""}`}>
                            <div className={`size-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                <item.icon className="size-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-gray-900 dark:text-white">{item.label}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</div>
                            </div>
                            <ChevronRight className="size-4 text-gray-400 shrink-0" />
                        </button>
                    ))}
                </div>
            </div>

            {/* Legal */}
            {additionalLinks.length > 0 && (
                <div>
                    <p className={`${labelCls} mb-3`}>Legal Information</p>
                    <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
                        {additionalLinks.map(link => (
                            <a key={link.id} href={link.path} target="_blank" rel="noreferrer"
                                className="flex items-center justify-between px-6 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252a36] transition-colors border-b border-gray-100 dark:border-gray-800 last:border-0">
                                {link.label} <ChevronRight className="size-4 text-gray-400" />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ListView;