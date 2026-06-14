// src/pages/ProfessorDashboard/ProfessorDashboardUI.jsx
import React, { useState } from "react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import UpcomingTasks from "./components/UpcomingTasks";
import HeroBanner from "./components/Herobanner";
import ModuleSearch from "./components/Modulesearch";
import ModuleGrid from "./components/Modulegrid";
import { DashboardLoading, DashboardError } from "./components/Dashboardloadingerror";
import hodNavCards from "./config/HodNavcards";
import professorNavCards from "./config/Professornavcards";

const TITLE_PREFIXES = ["Dr.", "Prof.", "Mr.", "Mrs.", "Ms."];

function getGreetingName(fullName) {
  const parts = fullName.split(" ");
  const count = TITLE_PREFIXES.includes(parts[0]) ? 2 : 1;
  return parts.slice(0, count).join(" ");
}

export default function ProfessorDashboardUI({
  loading = false,
  error = null,
  onRetry = () => {},
  userProfile = {
    fullName: "John Doe",
    employeeId: "PROF-001",
    organization: "Mahindra University",
  },
  tasks,
  onToggleTask = null,
}) {
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) return <DashboardLoading />;
  if (error) return <DashboardError error={error} onRetry={onRetry} />;

  const greetingName = getGreetingName(userProfile.fullName);
  const filteredNavCards = professorNavCards.filter(
    ({ label, sublabel }) =>
      label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sublabel.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="bg-gray-50 dark:bg-[#0f1117] min-h-screen font-sans">
      <HeaderController />

      <HeroBanner greetingName={greetingName} userProfile={userProfile} />

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