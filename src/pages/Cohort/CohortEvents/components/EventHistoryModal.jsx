import { useState } from "react";
import { X, CheckCircle2, XCircle, Calendar, Clock, MapPin, ChevronDown, ChevronUp } from "lucide-react";

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return {
    month: date.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    day: date.getDate(),
    full: date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  };
};

// ─── Single History Card ─────────────────────────────────────────────────────

const HistoryCard = ({ event }) => {
  const [expanded, setExpanded] = useState(false);
  const { month, day, full } = formatDate(event.date);
  const completed = event.attended !== false; // default true unless explicitly false

  return (
    <div
      className={`rounded-2xl border transition-all duration-200 ${
        completed
          ? "border-green-200 bg-green-50/60"
          : "border-red-200 bg-red-50/40"
      }`}
    >
      {/* Main Row */}
      <div
        className="flex items-center gap-3 p-3.5 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        {/* Date Badge */}
        <div
          className={`flex-shrink-0 w-11 h-11 flex flex-col items-center justify-center rounded-xl text-center ${
            completed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
          }`}
        >
          <span className="text-[10px] font-bold leading-none">{month}</span>
          <span className="text-base font-bold leading-none mt-0.5">{day}</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 line-clamp-1">{event.title}</p>
          <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {event.startTime} – {event.endTime}
            </span>
            {event.location && (
              <span className="flex items-center gap-1 line-clamp-1">
                <MapPin size={11} />
                {event.location}
              </span>
            )}
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {completed ? (
            <span className="flex items-center gap-1 text-xs font-semibold text-green-700 bg-green-100 px-2.5 py-1 rounded-full">
              <CheckCircle2 size={12} />
              Completed
            </span>
          ) : (
            <span className="flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-100 px-2.5 py-1 rounded-full">
              <XCircle size={12} />
              Missed
            </span>
          )}
          {expanded ? (
            <ChevronUp size={14} className="text-gray-400" />
          ) : (
            <ChevronDown size={14} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Expanded Detail */}
      {expanded && (
        <div className="px-4 pb-3.5 pt-0 border-t border-dashed border-gray-200 mt-1">
          <p className="text-xs text-gray-500 mt-2">{full}</p>
          {event.description && (
            <p className="text-sm text-gray-700 mt-1.5 leading-relaxed">{event.description}</p>
          )}
        </div>
      )}
    </div>
  );
};

// ─── Main Modal ──────────────────────────────────────────────────────────────

const EventHistoryModal = ({ isOpen, onClose, pastEvents = [] }) => {
  const [filter, setFilter] = useState("all"); // "all" | "completed" | "missed"

  if (!isOpen) return null;

  const completed = pastEvents.filter((e) => e.attended !== false);
  const missed = pastEvents.filter((e) => e.attended === false);

  const displayed =
    filter === "completed"
      ? completed
      : filter === "missed"
      ? missed
      : pastEvents;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle (mobile) */}
        <div className="flex justify-center pt-3 sm:hidden">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 sm:pt-5 pb-3 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={17} className="text-[#1E61F0]" />
              Event History
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {completed.length} completed · {missed.length} missed
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Summary Bar */}
        <div className="px-5 py-3 flex gap-2 border-b border-gray-100">
          {/* Progress strip */}
          {pastEvents.length > 0 && (
            <div className="w-full flex rounded-full overflow-hidden h-2 bg-red-200 mb-1 mt-1">
              <div
                className="bg-green-500 transition-all duration-500"
                style={{ width: `${(completed.length / pastEvents.length) * 100}%` }}
              />
            </div>
          )}
        </div>

        {/* Filter Chips */}
        <div className="px-5 py-3 flex gap-2 flex-wrap">
          {[
            { key: "all", label: `All (${pastEvents.length})` },
            { key: "completed", label: `✓ Completed (${completed.length})` },
            { key: "missed", label: `✗ Missed (${missed.length})` },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-150 ${
                filter === key
                  ? key === "missed"
                    ? "bg-red-500 text-white border-red-500"
                    : key === "completed"
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-[#1E61F0] text-white border-[#1E61F0]"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Event List */}
        <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-2.5">
          {displayed.length === 0 ? (
            <div className="text-center py-16 text-gray-400 text-sm">
              No events found
            </div>
          ) : (
            displayed.map((event) => (
              <HistoryCard key={event.id} event={event} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EventHistoryModal;