// src/pages/Finance/components/FinanceBanner.jsx
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft, Building2, IndianRupee, Clock, Receipt,
  CheckCircle, TrendingDown,
} from "lucide-react";
import StatSummaryCard from "../../../components/common/StatSummaryCard";
import { fmt } from "./shared";

export const TABS = [
  { key: "contact",  label: "Contact",         icon: Building2   },
  { key: "fees",     label: "Fee Overview",    icon: IndianRupee },
  { key: "history",  label: "Payment History", icon: Clock       },
  { key: "receipts", label: "Receipts",        icon: Receipt     },
];

export default function FinanceBanner({ activeTab, onTabChange, totalPaid, totalDue }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 text-white">
      <div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
        <div className="flex items-center justify-between gap-6 mb-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
              <p className="text-white/70 text-sm mt-0.5">Fee payments, receipts & due reminders.</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <StatSummaryCard label="Total Paid" value={fmt(totalPaid)} icon={CheckCircle}  />
            <StatSummaryCard label="Total Due"  value={fmt(totalDue)}  icon={TrendingDown} />
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
                activeTab === key
                  ? "bg-gray-50 dark:bg-[#0f1117] text-emerald-600 dark:text-emerald-400"
                  : "text-white/70 hover:bg-white/10"
              }`}
            >
              <Icon className="size-4" />{label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}