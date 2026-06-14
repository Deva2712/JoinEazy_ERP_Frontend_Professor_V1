// src/pages/FinanceManagement/components/FinanceHero.jsx
import { ArrowLeft, Clock, AlertCircle, Receipt, Wallet, History, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import StatSummaryCard from "../../../components/common/StatSummaryCard";

const TABS = [
  { key: "expenses", label: "Expense Claims",    icon: Receipt },
  { key: "advances", label: "Advances Requests", icon: Wallet  },
  { key: "history",  label: "History",           icon: History },
  { key: "support",  label: "Support",           icon: User, mobileOnly: true },
];

const FinanceHero = ({ pendingCount, rejectedCount, activeTab, onTabChange }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-yellow-500 via-amber-600 to-orange-600 dark:from-amber-800 dark:via-amber-950 dark:to-orange-950 text-white">
      <div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Finance Management</h1>
              <p className="text-white/80 text-sm mt-0.5">Manage your expenses and advances.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatSummaryCard label="Pending Requests" value={String(pendingCount)} icon={Clock} />
            <StatSummaryCard label="Action Required"  value={String(rejectedCount)} icon={AlertCircle} />
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {TABS.map(({ key, label, icon: Icon, mobileOnly }) => (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap
                ${mobileOnly ? "lg:hidden" : ""}
                ${activeTab === key
                  ? "bg-gray-50 dark:bg-[#0f1117] text-amber-700 dark:text-amber-500"
                  : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceHero;