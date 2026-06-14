import React from "react";
import { Plus, CalendarDays, Clock } from "lucide-react";
import { EVENT_TYPES } from "../constants/calendar.constants";

const DayPanel = ({ date, events, onOpenAddModal }) => {
    if (!date) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-16 text-gray-400">
                <CalendarDays className="size-10 mb-3 opacity-40" />
                <p className="text-sm">Select a day to see events</p>
            </div>
        );
    }

    const dateKey   = date.toISOString().split("T")[0];
    const dayEvents = events.filter((e) => e.date === dateKey);

    return (
        <div className="h-full flex flex-col">

            {/* Panel header */}
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                    </p>
                    <p className="text-xs text-gray-400">
                        {dayEvents.length} event{dayEvents.length !== 1 ? "s" : ""}
                    </p>
                </div>
                <button
                    onClick={() => onOpenAddModal(date)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 hover:bg-violet-700 text-white text-xs font-bold rounded-xl transition-colors"
                >
                    <Plus className="size-3.5" />Add
                </button>
            </div>

            {/* Events list */}
            {dayEvents.length > 0 ? (
                <div className="space-y-2 overflow-y-auto flex-1">
                    {dayEvents.map((ev) => {
                        const cfg  = EVENT_TYPES[ev.type] ?? EVENT_TYPES.personal;
                        const Icon = cfg.icon;
                        return (
                            <div key={ev.id} className={`flex items-start gap-3 p-3 rounded-xl border ${cfg.light}`}>
                                <div className={`p-1.5 rounded-lg ${cfg.color} bg-opacity-20 shrink-0`}>
                                    <Icon className="size-4" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{ev.title}</p>
                                    {ev.time && (
                                        <p className="text-xs opacity-70 flex items-center gap-1 mt-0.5">
                                            <Clock className="size-3" />{ev.time}
                                        </p>
                                    )}
                                    {ev.notes && (
                                        <p className="text-xs opacity-60 mt-0.5 line-clamp-2">{ev.notes}</p>
                                    )}
                                </div>
                                <span className="text-[10px] font-bold opacity-60 capitalize shrink-0">
                                    {ev.type}
                                </span>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center flex-1 py-8 text-gray-400">
                    <p className="text-sm">
                        No events ·{" "}
                        <button
                            onClick={() => onOpenAddModal(date)}
                            className="text-violet-600 dark:text-violet-400 font-semibold underline"
                        >
                            Add one
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
};

export default DayPanel;