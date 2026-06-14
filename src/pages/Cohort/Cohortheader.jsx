import React from "react";
import {
  Settings, ClipboardList, FileText, Users, Calendar, CalendarCheck,
  ArrowLeft, GraduationCap, Award, LayoutDashboard, BookOpen,
  UserCheck, Clipboard, Megaphone, FolderOpen,
} from "lucide-react";
import StatSummaryCard from "../../components/common/StatSummaryCard";

const iconMap = {
  details: BookOpen,
  members: Users,
  assignments: ClipboardList,
  materials: FolderOpen,
  attendance: UserCheck,
  "my-meetings": CalendarCheck,
  announcements: Megaphone,
  board: LayoutDashboard,
  courses: FileText,
  leaderboard: Award,
  events: Calendar,
  notes: FileText,
};

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null;

const CohortHeader = ({ cohortData, tabs, activeTab, onTabClick, onSettingsClick }) => {
  const user_type = cohortData?.user_type ?? 0;

  return (
    <div className="bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-800 dark:from-blue-900 dark:via-blue-950 dark:to-indigo-950 text-white">
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-0">

        {/* Title + Stats Row */}
        <div className="flex flex-col gap-4 mb-5">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">

            {/* Back + Title */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => (window.location.href = "/my-courses")}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors backdrop-blur-sm"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{cohortData.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  {cohortData.course_codes?.map((code, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-blue-900/50 text-xs font-bold uppercase tracking-wider text-blue-200 border border-blue-500/30">
                      {code}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
              <StatSummaryCard
                label={user_type === 1 ? "Members" : "Group"}
                value={user_type === 1 ? `${cohortData.member_count || 0}` : cohortData.group_name || "None"}
                icon={Users}
              />
              <StatSummaryCard
                label="Ongoing Assignments"
                value={(cohortData.pending_assignments || 0).toString()}
                icon={Clipboard}
              />
            </div>
          </div>

          {/* Meta Info + Settings */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex flex-wrap items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-blue-100 font-semibold">
                <div className="p-1.5 bg-white/10 rounded-lg">
                  <GraduationCap className="size-4" />
                </div>
                {user_type === 1 ? "Taught by You" : `Taught by ${cohortData.instructor || "Professor"}`}
              </div>
              {cohortData.start_date && (
                <div className="flex items-center gap-2 text-blue-100 font-semibold">
                  <div className="p-1.5 bg-white/10 rounded-lg">
                    <Calendar className="size-4" />
                  </div>
                  {fmtDate(cohortData.start_date)} &rarr; {fmtDate(cohortData.end_date)}
                </div>
              )}
            </div>

            {user_type === 1 && (
              <button
                onClick={onSettingsClick}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-blue-800 hover:bg-blue-50 rounded-xl shadow-lg transition-all font-bold text-sm"
              >
                <Settings size={16} />
                Course Settings
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar scroll-smooth">
          {tabs.map((tab) => {
            const Icon = iconMap[tab.id] || FileText;
            return (
              <button
                key={tab.id}
                onClick={() => onTabClick(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gray-50 dark:bg-[#0f1117] text-blue-700 dark:text-blue-400"
                    : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={16} />
                {tab.name}
              </button>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default CohortHeader;