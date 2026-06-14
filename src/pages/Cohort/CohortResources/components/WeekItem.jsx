import React from "react";
import { Calendar, ChevronRight, ChevronDown, Edit2, Trash2 } from "lucide-react";

const WeekItem = ({ week, isSelected, onSelect, onEdit, onDelete }) => {
  return (
    <div
      onClick={() => onSelect(week)}
      className={`p-3 rounded-lg cursor-pointer transition-colors border ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 border-l-4 border-l-blue-500"
          : "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">

          <div className="flex items-center gap-2 mb-1">
            <Calendar
              size={16}
              className={isSelected ? "text-blue-600 dark:text-blue-400 flex-shrink-0" : "text-gray-500 dark:text-gray-400 flex-shrink-0"}
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              Week {week.weekNumber}: {week.title}
            </span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{week.dateRange}</p>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-600 dark:text-gray-400">
              {week.totalResources || 0} {week.totalResources === 1 ? "resource" : "resources"}
            </span>
            {isSelected
              ? <ChevronDown size={16} className="text-blue-600 dark:text-blue-400 flex-shrink-0" />
              : <ChevronRight size={16} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />
            }
          </div>

        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(week); }}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            title="Edit week"
          >
            <Edit2 size={14} className="text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (confirm("Delete this week and all its resources?")) onDelete(week.id);
            }}
            className="p-1 hover:bg-red-100 dark:hover:bg-red-900/50 rounded"
            title="Delete week"
          >
            <Trash2 size={14} className="text-red-600 dark:text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WeekItem;