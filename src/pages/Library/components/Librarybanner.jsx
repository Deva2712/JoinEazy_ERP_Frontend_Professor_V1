// src/pages/Library/components/LibraryBanner.jsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BookMarked, AlertCircle, Compass, Send, User } from "lucide-react";
import StatSummaryCard from "../../../components/common/StatSummaryCard";

const TABS = [
  { key: "borrowed",    label: "Borrowed", icon: BookMarked },
  { key: "browse",      label: "Browse",   icon: Compass    },
  { key: "my-requests", label: "Requests", icon: Send       },
  { key: "support",     label: "Support",  icon: User, mobileOnly: true },
];

export default function LibraryBanner({ activeTab, onTabChange, borrowedBooks, overdueCount, pendingCount }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 dark:from-green-900 dark:via-green-950 dark:to-emerald-950 text-white">
      <div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/dashboard")} className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors">
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Library</h1>
              <p className="text-green-50 text-sm mt-0.5">Browse, request, and manage your borrowed books.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pb-2 md:pb-0">
            <StatSummaryCard label="Borrowed" value={String(borrowedBooks.length)} icon={BookMarked} />
            <StatSummaryCard label="Overdue"  value={String(overdueCount)}         icon={AlertCircle} />
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {TABS.map(({ key, label, icon: Icon, mobileOnly }) => {
            const active = activeTab === key;
            const badge  = key === "my-requests" && pendingCount > 0 ? pendingCount : null;
            return (
              <button key={key} onClick={() => onTabChange(key)}
                className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap ${mobileOnly ? "lg:hidden" : ""} ${active ? "bg-gray-50 dark:bg-[#0f1117] text-green-700 dark:text-green-400" : "text-white/70 hover:text-white hover:bg-white/10"}`}>
                <Icon className="w-4 h-4" /> {label}
                {badge && (
                  <span className={`inline-flex items-center justify-center text-[10px] font-bold w-[18px] h-[18px] rounded-full ml-1.5 ${active ? "bg-green-600 text-white" : "bg-white text-green-700"}`}>
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}