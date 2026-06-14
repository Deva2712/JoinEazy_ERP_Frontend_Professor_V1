// src/pages/Placement/components/PlacementBanner.jsx
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Briefcase, FileText, Upload, Trophy } from "lucide-react";
import StatSummaryCard from "../../../components/common/StatSummaryCard";

const TABS = [
  { key: "jobs",    label: "Job Listings",      Icon: Briefcase },
  { key: "applied", label: "My Applications",   Icon: FileText  },
  { key: "resume",  label: "Resume & Projects", Icon: Upload    },
  { key: "history", label: "Placement History", Icon: Trophy    },
];

export default function PlacementBanner({ activeTab, onTabChange, applicationsCount }) {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-900 dark:via-teal-900 dark:to-cyan-900 text-white">
      <div className="max-w-7xl mx-auto px-4 pt-5 pb-0">
        <div className="flex items-center justify-between gap-6 mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
            >
              <ArrowLeft className="size-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Placement Cell</h1>
              <p className="text-white/70 text-sm mt-0.5">Jobs, internships, applications &amp; placement history.</p>
            </div>
          </div>
          <div className="pb-2 md:pb-0">
            <StatSummaryCard label="Applied" value={applicationsCount.toString()} icon={Briefcase} />
          </div>
        </div>

        <div className="flex items-center gap-1 overflow-x-auto">
          {TABS.map(({ key, label, Icon }) => (
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