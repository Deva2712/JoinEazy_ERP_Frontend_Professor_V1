import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, LayoutGrid, RefreshCw, BookOpen } from "lucide-react";
import HeaderController from "../../components/layout/Header/HeaderController";
import BottomNavController from "../../components/layout/BottomNav/BottomNavController";
import FooterController from "../../components/layout/Footer/FooterController";
import StatSummaryCard from "../../components/common/StatSummaryCard";
import TodayPlanView from "./views/TodayPlanView";
import WeeklyTimetableView from "./views/WeeklyTimetableView";
import StudentSessionsView from "./views/StudentSessionsView";

const TABS = [
    { key: "today",    label: "Today's Plan",     icon: CalendarDays },
    { key: "weekly",   label: "Weekly Timetable", icon: LayoutGrid   },
    { key: "sessions", label: "Sessions",         icon: BookOpen     },
];

const StudentScheduleUI = ({
    loading,
    activeTab,
    onTabChange,
    todaysClasses,
    todaysTasks,
    timetable,
    sessions,
    showModal,
    onOpenModal,
    onCloseModal,
    showImportModal,
    onOpenImportModal,
    onCloseImportModal,
    onImportTimetable,
    onAddTask,
    onToggleTask,
    onDeleteTask,
    todayName,
}) => {
    const navigate = useNavigate();

    const completedTasks = todaysTasks.filter((t) => t.done).length;
    const activeSessions = sessions.filter((s) => s.status === "Ongoing").length;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />

            {/* Hero */}
            <div className="bg-gradient-to-br from-indigo-700 via-blue-800 to-violet-900 dark:from-indigo-900 dark:via-blue-950 dark:to-violet-950 text-white">
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
                                <h1 className="text-2xl font-bold tracking-tight">Schedule & Planner</h1>
                                <p className="text-white/70 text-sm mt-0.5">
                                    {todayName} · Your classes and personal plan for today.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pb-2 md:pb-0">
                            <StatSummaryCard
                                label="Today's Classes"
                                value={todaysClasses.length.toString()}
                                icon={CalendarDays}
                            />
                            <StatSummaryCard
                                label="Active Sessions"
                                value={activeSessions.toString()}
                                icon={BookOpen}
                            />
                            <StatSummaryCard
                                label="Tasks Done"
                                value={`${completedTasks}/${todaysTasks.length}`}
                                icon={LayoutGrid}
                            />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                        {TABS.map(({ key, label, icon: Icon }) => (
                            <button
                                key={key}
                                onClick={() => onTabChange(key)}
                                className={`flex items-center gap-2 px-5 py-3 text-sm font-bold rounded-t-2xl transition-all whitespace-nowrap ${
                                    activeTab === key
                                        ? "bg-gray-50 dark:bg-[#0f1117] text-indigo-700 dark:text-indigo-400"
                                        : "text-white/70 hover:text-white hover:bg-white/10"
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main */}
            <main className="max-w-7xl mx-auto px-4 py-6 w-full pb-24 md:pb-12">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                        <RefreshCw className="size-10 animate-spin mb-4 text-indigo-500" />
                        <p className="font-bold text-gray-700 dark:text-white">Loading your schedule...</p>
                    </div>
                ) : (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                        {activeTab === "today" && (
                            <TodayPlanView
                                todaysClasses={todaysClasses}
                                todaysTasks={todaysTasks}
                                showModal={showModal}
                                onOpenModal={onOpenModal}
                                onCloseModal={onCloseModal}
                                onAddTask={onAddTask}
                                onToggleTask={onToggleTask}
                                onDeleteTask={onDeleteTask}
                                todayName={todayName}
                            />
                        )}
                        {activeTab === "weekly" && (
                            <WeeklyTimetableView
                                timetable={timetable}
                                todayName={todayName}
                                showImportModal={showImportModal}
                                onOpenImportModal={onOpenImportModal}
                                onCloseImportModal={onCloseImportModal}
                                onImportTimetable={onImportTimetable}
                            />
                        )}
                       {activeTab === "sessions" && (
    <StudentSessionsView sessions={sessions} />
)}
                    </div>
                )}
            </main>

            <BottomNavController />
            <FooterController />
        </div>
    );
};

export default StudentScheduleUI;