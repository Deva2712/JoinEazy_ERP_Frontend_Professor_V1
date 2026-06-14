// src/pages/ProfessorDashboard/components/ModuleSearch.jsx
import { Search, X } from "lucide-react";

export default function ModuleSearch({ searchQuery, onSearchChange, onClear }) {
  return (
    <div className="mb-8">
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
        <input
          type="text"
          placeholder="Search modules..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-12 pr-4 py-3 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-blue-600 transition-all"
        />
        {searchQuery && (
          <button
            onClick={onClear}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}