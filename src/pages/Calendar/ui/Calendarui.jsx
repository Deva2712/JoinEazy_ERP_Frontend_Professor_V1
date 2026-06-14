import React from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft, RefreshCw, AlertTriangle,
    ChevronLeft, ChevronRight, Filter, FileUp,
} from "lucide-react";
import HeaderController    from "../../../components/layout/Header/HeaderController";
import BottomNavController from "../../../components/layout/BottomNav/BottomNavController";
import FooterController    from "../../../components/layout/Footer/FooterController";

import { DAYS, MONTHS, EVENT_TYPES } from "../constants/calendar.constants";
import DayPanel            from "../views/DayPanel";
import EventPill           from "../views/EventPill";
import ImportScheduleModal from "../components/ImportScheduleModal";
import AddEventModal       from "../components/AddEventModal";

const CalendarUI = ({
    loading,
    error,
    onRetry,
    filteredEvents,
    upcomingEvents,
    grid,
    cursor,
    selectedDate,
    filter,
    showAddModal,
    addModalDate,
    showImportModal,
    onPrevMonth,
    onNextMonth,
    onSelectDate,
    onFilterChange,
    onOpenAddModal,
    onCloseAddModal,
    onOpenImportModal,
    onCloseImportModal,
    onAddEvent,
    onImportSchedule,
    getEventsForDate,
    isToday,
    isSelected,
}) => {
    const navigate = useNavigate();
    const year     = cursor.getFullYear();
    const month    = cursor.getMonth();

    /* ── Loading state ─────────────────────────────────────────── */
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
                <HeaderController />
                <div className="flex justify-center py-32">
                    <RefreshCw className="size-10 animate-spin text-violet-600" />
                </div>
                <BottomNavController />
                <FooterController />
            </div>
        );
    }

    /* ── Error state ───────────────────────────────────────────── */
    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117]">
                <HeaderController />
                <div className="flex flex-col items-center py-32 gap-4">
                    <AlertTriangle className="size-10 text-red-500" />
                    <p className="font-bold dark:text-white">Failed to load calendar</p>
                    <button onClick={onRetry} className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold">
                        Retry
                    </button>
                </div>
                <BottomNavController />
                <FooterController />
            </div>
        );
    }

    /* ── Main render ───────────────────────────────────────────── */
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] font-sans">
            <HeaderController />

            {/* Banner */}
            <div className="bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-700 dark:from-violet-900 dark:via-indigo-900 dark:to-blue-900 text-white">
                <div className="max-w-7xl mx-auto px-4 py-5">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate("/dashboard")}
                                className="p-2.5 bg-white/10 hover:bg-white/20 rounded-2xl transition-colors"
                            >
                                <ArrowLeft className="size-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">Calendar</h1>
                                <p className="text-white/70 text-sm mt-0.5">
                                    Classes, exams, holidays &amp; personal events.
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onOpenImportModal}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-bold border border-white/25 transition-colors"
                        >
                            <FileUp className="size-4" />Import Schedule
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-6 pb-24 md:pb-12 w-full">

                {/* Filter row */}
                <div className="flex items-center gap-2 mb-6 overflow-x-auto">
                    <Filter className="size-4 text-gray-400 shrink-0" />
                    {[
                        { key: "all", label: "All" },
                        ...Object.entries(EVENT_TYPES).map(([k, v]) => ({ key: k, label: v.label })),
                    ].map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => onFilterChange(key)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
                                filter === key
                                    ? "bg-violet-600 text-white border-violet-600"
                                    : "bg-white dark:bg-[#1a1d26] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Upcoming Events */}
                <div className="mb-6">
                    <h3 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Upcoming Events</h3>
                    {upcomingEvents.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {upcomingEvents.map((ev) => {
                                const cfg  = EVENT_TYPES[ev.type] ?? EVENT_TYPES.personal;
                                const Icon = cfg.icon;
                                return (
                                    <div key={ev.id} className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.light}`}>
                                        <div className={`p-1.5 rounded-lg ${cfg.color} bg-opacity-20 shrink-0`}>
                                            <Icon className="size-4" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-semibold truncate">{ev.title}</p>
                                            <p className="text-xs opacity-70">
                                                {new Date(ev.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                {ev.time ? ` · ${ev.time}` : ""}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-400">No upcoming events.</p>
                    )}
                </div>

                {/* Calendar grid + Day panel */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Calendar grid */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">

                            {/* Month navigation */}
                            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
                                <button
                                    onClick={onPrevMonth}
                                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <ChevronLeft className="size-5 text-gray-600 dark:text-gray-400" />
                                </button>
                                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                                    {MONTHS[month]} {year}
                                </h2>
                                <button
                                    onClick={onNextMonth}
                                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                >
                                    <ChevronRight className="size-5 text-gray-600 dark:text-gray-400" />
                                </button>
                            </div>

                            {/* Day-of-week headers */}
                            <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800">
                                {DAYS.map((d) => (
                                    <div
                                        key={d}
                                        className="py-2 text-center text-[10px] font-bold text-gray-400 uppercase tracking-wider"
                                    >
                                        {d}
                                    </div>
                                ))}
                            </div>

                            {/* Date cells */}
                            <div className="grid grid-cols-7">
                                {grid.map((date, i) => {
                                    const dayEvents = getEventsForDate(date);
                                    const sel = isSelected(date);
                                    const tod = isToday(date);
                                    return (
                                        <div
                                            key={i}
                                            onClick={() => onSelectDate(date)}
                                            className={`min-h-[72px] p-1.5 border-b border-r border-gray-100 dark:border-gray-800 transition-colors ${
                                                date ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50" : ""
                                            } ${sel ? "bg-violet-50 dark:bg-violet-900/20" : ""}`}
                                        >
                                            {date && (
                                                <>
                                                    <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                                                        tod
                                                            ? "bg-violet-600 text-white"
                                                            : sel
                                                            ? "text-violet-600 dark:text-violet-400"
                                                            : "text-gray-700 dark:text-gray-300"
                                                    }`}>
                                                        {date.getDate()}
                                                    </div>
                                                    <div className="space-y-0.5">
                                                        {dayEvents.slice(0, 2).map((ev) => (
                                                            <EventPill key={ev.id} event={ev} />
                                                        ))}
                                                        {dayEvents.length > 2 && (
                                                            <div className="text-[9px] text-gray-400 font-bold pl-1">
                                                                +{dayEvents.length - 2} more
                                                            </div>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-wrap gap-3 mt-3 px-1">
                            {Object.entries(EVENT_TYPES).map(([k, v]) => (
                                <div key={k} className="flex items-center gap-1.5">
                                    <div className={`size-2.5 rounded-full ${v.color}`} />
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{v.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Day detail panel */}
                    <div className="bg-white dark:bg-[#1a1d26] rounded-2xl border border-gray-200 dark:border-gray-800 p-5 lg:min-h-[500px]">
                        <DayPanel
                            date={selectedDate}
                            events={filteredEvents}
                            onOpenAddModal={onOpenAddModal}
                        />
                    </div>
                </div>
            </main>

            {/* Modals */}
            {showImportModal && (
                <ImportScheduleModal
                    onClose={onCloseImportModal}
                    onImport={onImportSchedule}
                />
            )}
            {showAddModal && addModalDate && (
                <AddEventModal
                    date={addModalDate}
                    onClose={onCloseAddModal}
                    onAdd={onAddEvent}
                />
            )}

            <BottomNavController />
            <FooterController />
        </div>
    );
};

export default CalendarUI;