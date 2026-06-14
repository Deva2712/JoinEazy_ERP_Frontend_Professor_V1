import React, { useState, useEffect, useCallback } from "react";
import {
    Clock, CheckSquare, Square, Calendar,
    BookOpen, Users, ClipboardList, History,
    CheckCircle2, X, ChevronDown, ChevronUp,
} from "lucide-react";

/* ─────────────────── constants ─────────────────── */

const TYPE_STYLES = {
    assignment:   "bg-blue-50   dark:bg-blue-900/20   text-blue-800   dark:text-blue-300   border-blue-200   dark:border-blue-800",
    meeting:      "bg-purple-50 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800",
    class:        "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    custom:       "bg-amber-50  dark:bg-amber-900/20  text-amber-800  dark:text-amber-300  border-amber-200  dark:border-amber-800",
    substitution: "bg-rose-50   dark:bg-rose-900/20   text-rose-800   dark:text-rose-300   border-rose-200   dark:border-rose-800",
};

const TYPE_ICONS = {
    assignment:   BookOpen,
    meeting:      Users,
    class:        ClipboardList,
    custom:       Clock,
    substitution: ClipboardList,
};

const TYPE_LABELS = {
    assignment:   "Assignment",
    meeting:      "Meeting",
    class:        "Class",
    custom:       "Personal",
    substitution: "Substitution",
};

/* ─────────────────── helpers ─────────────────── */

/**
 * Returns today's date string in "DD MMM YYYY" format (e.g. "22 May 2026").
 * Used as the key for today's history bucket.
 */
const todayLabel = () => {
    const d = new Date();
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const STORAGE_KEY = "upcomingTasksHistory";

/** Load history from localStorage (or return empty object on first run). */
const loadHistory = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    } catch {
        return {};
    }
};

/** Persist history to localStorage. */
const saveHistory = (history) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch { /* quota exceeded – silently ignore */ }
};

/* ─────────────────── sub-components ─────────────────── */

/** One task row inside an expanded day — same style as notification card */
const TaskHistoryCard = ({ task }) => {
    const TypeIcon  = TYPE_ICONS[task.type]  || Clock;
    const typeStyle = TYPE_STYLES[task.type] || TYPE_STYLES.custom;
    const typeLabel = TYPE_LABELS[task.type] || "Task";

    return (
        <div className="group flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-gray-800/50 ring-1 ring-gray-200 dark:ring-gray-800 border-l-4 border-l-transparent data-[done=true]:border-l-green-400 data-[done=false]:border-l-gray-200 dark:data-[done=false]:border-l-gray-700" data-done={task.completed}>
            <div className={`p-2.5 rounded-xl flex-shrink-0 ${task.completed ? "bg-green-50 dark:bg-green-900/20 text-green-600" : "bg-gray-50 dark:bg-gray-800 text-gray-400"}`}>
                {task.completed
                    ? <CheckCircle2 className="size-5" />
                    : <TypeIcon className="size-5" />
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-[14px] text-gray-900 dark:text-white leading-tight line-clamp-1">
                    {task.title}
                </p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${typeStyle}`}>
                        <TypeIcon className="w-2.5 h-2.5" />
                        {typeLabel}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                        · {task.date} · {task.time}
                    </span>
                </div>
            </div>
            <span className={`text-[11px] font-bold flex-shrink-0 mt-0.5 ${task.completed ? "text-green-500" : "text-gray-400"}`}>
                {task.completed ? "Done" : "Missed"}
            </span>
        </div>
    );
};

/** Collapsible day section */
const DaySection = ({ dateLabel, tasks, isToday }) => {
    const [open, setOpen] = useState(isToday);
    const done   = tasks.filter((t) => t.completed).length;
    const missed = tasks.filter((t) => !t.completed).length;

    return (
        <div>
            <button
                onClick={() => setOpen((v) => !v)}
                className="w-full flex items-center justify-between px-1 py-2 hover:opacity-70 transition-opacity"
            >
                <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                        {isToday ? "Today" : dateLabel}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    {done > 0 && (
                        <span className="text-[11px] font-bold text-green-600 dark:text-green-400">
                            {done} done
                        </span>
                    )}
                    {missed > 0 && (
                        <span className="text-[11px] font-bold text-gray-400">
                            {missed} missed
                        </span>
                    )}
                    {open
                        ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                        : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    }
                </div>
            </button>

            {open && (
                <div className="space-y-3 mt-1">
                    {tasks.map((t) => <TaskHistoryCard key={t.id} task={t} />)}
                </div>
            )}
        </div>
    );
};

/** History modal — styled like the Notifications panel */
const HistoryModal = ({ onClose, history }) => {
    const today    = todayLabel();
    const allDates = Object.keys(history).sort((a, b) => new Date(b) - new Date(a));

    return (
        <div
            className="fixed inset-0 z-[60] flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            <div className="bg-white dark:bg-[#0f1117] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-300">

                {/* header */}
                <div className="p-5 sm:p-6 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30">
                            <History className="size-5" />
                        </div>
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                            Task History
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                    >
                        <X className="size-5 text-gray-500" />
                    </button>
                </div>

                {/* body */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-white dark:bg-[#0f1117]">
                    {allDates.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-400">No task history yet.</p>
                        </div>
                    ) : (
                        allDates.map((date) => {
                            const { tasks: dayTasks = [] } = history[date] || {};
                            if (dayTasks.length === 0) return null;
                            return (
                                <DaySection
                                    key={date}
                                    dateLabel={date}
                                    tasks={dayTasks}
                                    isToday={date === today}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

/* ─────────────────── main component ─────────────────── */

const UpcomingTasks = ({ tasks: tasksProp = [], onToggleTask }) => {
    const [allTasks,      setAllTasks]      = useState(tasksProp);
    const [visibleIds,    setVisibleIds]    = useState(() => tasksProp.slice(0, 6).map((t) => t.id));
    const [removing,      setRemoving]      = useState(null);
    const [showHistory,   setShowHistory]   = useState(false);

    /* history state – persisted in localStorage */
    const [history, setHistory] = useState(loadHistory);

    /* ── sync tasks from parent ── */
    useEffect(() => {
        setAllTasks(tasksProp);
        setVisibleIds((prev) => {
            const valid = prev.filter((id) => tasksProp.some((t) => t.id === id && !t.completed));
            const extra = tasksProp
                .filter((t) => !t.completed && !valid.includes(t.id))
                .slice(0, 6 - valid.length)
                .map((t) => t.id);
            return [...valid, ...extra];
        });
    }, [tasksProp]);

    /* ── jab bhi koi task complete ho, use permanently history mein record karo ── */
    const recordTaskToHistory = useCallback((task, isCompleted) => {
        const dateKey = todayLabel(); // hamesha aaj ki date use karo

        setHistory((prev) => {
            const dayData = prev[dateKey] || { completed: 0, remaining: 0, tasks: [] };

            // tasks list update karo — agar task pehle se hai toh update, warna add karo
            const existingIdx = dayData.tasks.findIndex((t) => t.id === task.id);
            let updatedTasks;
            if (existingIdx >= 0) {
                updatedTasks = dayData.tasks.map((t) =>
                    t.id === task.id ? { ...t, completed: isCompleted } : t
                );
            } else {
                updatedTasks = [...dayData.tasks, { ...task, completed: isCompleted }];
            }

            const completed = updatedTasks.filter((t) =>  t.completed).length;
            const remaining = updatedTasks.filter((t) => !t.completed).length;

            const updated = {
                ...prev,
                [dateKey]: { completed, remaining, tasks: updatedTasks },
            };
            saveHistory(updated);
            return updated;
        });
    }, []);

    /* ── naye tasks jo abhi tak history mein nahi hain unhe bhi record karo ── */
    useEffect(() => {
        tasksProp.forEach((task) => {
            recordTaskToHistory(task, task.completed);
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tasksProp]);

    /* ── toggle a task ── */
    const toggleTask = useCallback((id) => {
        setRemoving(id);
        setTimeout(() => {
            const task = allTasks.find((t) => t.id === id);
            if (task) recordTaskToHistory(task, true); // completed mark karo history mein
            if (onToggleTask) onToggleTask(id);
            setVisibleIds((vids) => {
                const next = vids.filter((v) => v !== id);
                const more = tasksProp.find((t) => !t.completed && !next.includes(t.id) && t.id !== id);
                return more ? [...next, more.id] : next;
            });
            setRemoving(null);
        }, 300);
    }, [onToggleTask, tasksProp]);

    /* derived */
    const visibleTasks    = visibleIds.map((id) => allTasks.find((t) => t.id === id)).filter(Boolean);
    const totalRemaining  = allTasks.filter((t) => !t.completed).length;
    const totalCompleted  = allTasks.filter((t) =>  t.completed).length;

    return (
        <>
            <div className="mb-8 bg-white dark:bg-[#1a1d26] rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">

                {/* ── Header ── */}
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-2.5 rounded-xl">
                            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight">
                                Upcoming Tasks
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Your next priorities</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* history button */}
                        <button
                            onClick={() => setShowHistory(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-200 group"
                            title="View task history"
                        >
                            <History className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                History
                            </span>
                            {totalCompleted > 0 && (
                                <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-green-100 dark:bg-green-500/20 text-[10px] font-bold text-green-600 dark:text-green-400">
                                    {totalCompleted}
                                </span>
                            )}
                        </button>

                        {totalRemaining > 0 && (
                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
                                </span>
                                <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                                    {totalRemaining} Active
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Grid ── */}
                {visibleTasks.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {visibleTasks.map((task) => {
                            const TypeIcon   = TYPE_ICONS[task.type]  || Clock;
                            const typeStyle  = TYPE_STYLES[task.type] || TYPE_STYLES.custom;
                            const typeLabel  = TYPE_LABELS[task.type] || "Task";
                            const isRemoving = removing === task.id;

                            return (
                                <div
                                    key={task.id}
                                    style={{
                                        transition: "all 0.3s ease",
                                        opacity:    isRemoving ? 0 : 1,
                                        transform:  isRemoving ? "scale(0.97)" : "scale(1)",
                                    }}
                                    className="group/item flex flex-col gap-2 p-4 rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] hover:bg-white dark:hover:bg-white/[0.05] hover:shadow-sm hover:border-blue-200 dark:hover:border-blue-500/30 transition-all duration-200"
                                >
                                    {/* Row 1: type badge + checkbox */}
                                    <div className="flex items-center justify-between gap-2">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${typeStyle}`}>
                                            <TypeIcon className="w-2.5 h-2.5" />
                                            {typeLabel}
                                        </span>
                                        <button
                                            onClick={() => toggleTask(task.id)}
                                            className="text-gray-300 dark:text-gray-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors flex-shrink-0"
                                        >
                                            {isRemoving
                                                ? <CheckSquare className="w-4 h-4 text-green-500" />
                                                : <Square      className="w-4 h-4" />
                                            }
                                        </button>
                                    </div>

                                    {/* Row 2: title */}
                                    <p className="flex-1 text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors leading-snug line-clamp-2">
                                        {task.title}
                                    </p>

                                    {/* Row 3: date/time */}
                                    <div className="flex items-center gap-1.5 pt-2 border-t border-gray-100 dark:border-white/5 mt-auto">
                                        <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                        <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate">
                                            {task.date} · {task.time}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-white/[0.02]">
                        <div className="bg-white dark:bg-[#1a1d26] p-3.5 rounded-full mb-3">
                            <CheckSquare className="w-7 h-7 text-gray-300 dark:text-gray-600" />
                        </div>
                        <p className="text-sm font-bold text-gray-900 dark:text-white">All caught up!</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">No pending tasks for today.</p>
                    </div>
                )}
            </div>

            {showHistory && (
                <HistoryModal
                    onClose={() => setShowHistory(false)}
                    history={history}
                />
            )}
        </>
    );
};

export default UpcomingTasks;