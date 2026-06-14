// src/pages/StudentDashboard/StudentDashboardUI.jsx
import React, { useState } from "react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import UpcomingTasks from "./components/UpcomingTasks";
import StudentHeroBanner from "./components/Studentherobanner";
import ModuleSearch from "./components/Modulesearch";
import ModuleGrid from "./components/Modulegrid";
import { DashboardLoading, DashboardError } from "./components/Dashboardloadingerror";
import { getGreetingName, resolveAcademicYear } from "./hooks/Dashboardhelpers";
import navCards from "./config/navCards";

export default function StudentDashboardUI({
  loading = false,
  error = null,
  onRetry = () => {},
  userProfile = {
    fullName: "Demo Student",
    rollNumber: "student123",
    organization: "Mahindra University",
    semester: null,
    academicYear: null,
  },
  tasks = [],
  onToggleTask = null,
  onAddTask = null,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) return <DashboardLoading />;
  if (error) return <DashboardError error={error} onRetry={onRetry} />;

  const greetingName = getGreetingName(userProfile.fullName);
  const academicYear = resolveAcademicYear(userProfile.academicYear);
  const semester = userProfile.semester || "Semester 2";

  const filteredNavCards = navCards.filter(
    ({ label, sublabel }) =>
      label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sublabel.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
      <HeaderController />

      <StudentHeroBanner
        greetingName={greetingName}
        userProfile={userProfile}
        semester={semester}
        academicYear={academicYear}
      />

      <main className="px-4 py-8 max-w-7xl mx-auto w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
        <UpcomingTasks tasks={tasks} onToggleTask={onToggleTask} onAddTask={onAddTask} />

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