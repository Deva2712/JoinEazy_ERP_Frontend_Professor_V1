// src/pages/Dashboard/HodDashboardUI.jsx
import React, { useState } from "react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import UpcomingTasks from "./components/UpcomingTasks";
import ModuleSearch from "./components/Modulesearch";
import ModuleGrid from "./components/Modulegrid";
import { DashboardLoading, DashboardError } from "./components/Dashboardloadingerror";
import hodNavCards from "./config/HodNavcards";
import { Building2, Calendar, ClipboardCheck } from "lucide-react";

const TITLE_PREFIXES = ["Dr.", "Prof.", "Mr.", "Mrs.", "Ms."];

function getGreetingName(fullName = "") {
  const parts = fullName.split(" ");
  const count = TITLE_PREFIXES.includes(parts[0]) ? 2 : 1;
  return parts.slice(0, count).join(" ");
}

export default function HodDashboardUI({
  loading = false,
  error = null,
  onRetry = () => {},
  userProfile = {
    fullName: "Dr. HOD",
    employeeId: "HOD-001",
    organization: "Mahindra University",
    department: "Computer Science",
  },
  tasks,
  onToggleTask = null,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) return <DashboardLoading />;
  if (error)   return <DashboardError error={error} onRetry={onRetry} />;

  const greetingName = getGreetingName(userProfile.fullName);

  const filteredNavCards = hodNavCards.filter(
    ({ label, sublabel }) =>
      label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sublabel.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
      <HeaderController />

      {/* Hero — teal theme to differentiate from professor (blue) */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-800 to-cyan-800 dark:from-teal-900 dark:via-teal-950 dark:to-cyan-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">

            <div className="space-y-1">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white/15 rounded-full text-teal-100 mb-2">
                <ClipboardCheck className="size-3" /> Head of Department
              </span>
              <h1 className="text-3xl font-bold">👋 Welcome back, {greetingName}!</h1>
              <p className="text-teal-100 text-lg">
                Here's an overview of your courses, schedules, and administrative tasks.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:justify-end w-full text-white">
              <div className="bg-white/10 dark:bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md flex-1 min-w-[220px] shadow-sm">
                <div className="flex items-center gap-3 mb-2 text-teal-200">
                  <Building2 className="size-5" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Department</h3>
                </div>
                <p className="text-lg font-semibold truncate leading-tight">
                  {userProfile.department || userProfile.organization}
                </p>
              </div>

              <div className="bg-white/10 dark:bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-md flex-1 min-w-[220px] shadow-sm">
                <div className="flex items-center gap-3 mb-2 text-teal-200">
                  <Calendar className="size-5" />
                  <h3 className="text-[10px] font-bold uppercase tracking-[0.2em]">Today's Date</h3>
                </div>
                <p className="text-lg font-semibold truncate leading-tight">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      <main className="px-4 py-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
        <UpcomingTasks tasks={tasks} onToggleTask={onToggleTask} />
        <ModuleSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClear={() => setSearchQuery("")}
        />
        <ModuleGrid navCards={filteredNavCards} />
      </main>

      <BottomNavController />
      <FooterController />
    </div>
  );
}