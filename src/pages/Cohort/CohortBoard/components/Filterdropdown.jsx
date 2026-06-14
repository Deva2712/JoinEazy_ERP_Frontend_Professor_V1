import React, { useState, useEffect } from "react";
import { ListFilter } from "lucide-react";

const FilterDropdown = ({
  showFilterDropdown,
  onFilterDropdownToggle,
  sortBy, sortOptions, onSortChange,
  activeFilters, postTypeFilters, onFilterChange,
  postsFrom, postsFromOptions, onPostsFromChange,
}) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showPostTypesDropdown, setShowPostTypesDropdown] = useState(false);
  const [showPostsFromDropdown, setShowPostsFromDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".dropdown-container")) {
        if (showFilterDropdown) onFilterDropdownToggle();
        setShowSortDropdown(false);
        setShowPostTypesDropdown(false);
        setShowPostsFromDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilterDropdown, onFilterDropdownToggle]);

  const sections = [
    {
      id: "sort", label: "Sort by",
      showDropdown: showSortDropdown,
      toggle: () => { setShowSortDropdown((p) => !p); setShowPostTypesDropdown(false); setShowPostsFromDropdown(false); },
      currentValue: sortBy,
      options: sortOptions.map((o) => ({ id: o.id, label: o.label, value: o.id })),
      onSelect: onSortChange,
    },
    {
      id: "postType", label: "Post Type",
      showDropdown: showPostTypesDropdown,
      toggle: () => { setShowPostTypesDropdown((p) => !p); setShowSortDropdown(false); setShowPostsFromDropdown(false); },
      currentValue: activeFilters,
      options: postTypeFilters.map((f) => ({ id: f.id, label: f.label, value: f.id })),
      onSelect: onFilterChange,
      isMultiSelect: true,
    },
    {
      id: "from", label: "From",
      showDropdown: showPostsFromDropdown,
      toggle: () => { setShowPostsFromDropdown((p) => !p); setShowSortDropdown(false); setShowPostTypesDropdown(false); },
      currentValue: postsFrom,
      options: postsFromOptions.map((o) => ({ id: o.id, label: o.label, value: o.id })),
      onSelect: onPostsFromChange,
    },
  ];

  return (
    <div className="relative dropdown-container">
      <button onClick={onFilterDropdownToggle}
        className="flex items-center justify-center px-4 pr-[18px] gap-2 bg-white font-medium transition-all duration-200 whitespace-nowrap"
        style={{ height: "38px", borderRadius: "9999px", border: "1px solid #D3D6DA", color: "#374151" }}>
        <ListFilter size={15} style={{ strokeWidth: "2.1" }} />
        <span className="text-sm hidden sm:block">Filter</span>
      </button>

      {showFilterDropdown && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-[#D3D6DA] z-50 min-w-[220px]"
          style={{ borderRadius: "16px", boxShadow: "0 10px 25px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}>
          <div className="p-3 space-y-0.5">
            {sections.map((section) => (
              <div key={section.id}>
                <button onClick={section.toggle}
                  className="w-full flex items-center justify-between px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                  <span>{section.label}</span>
                  <svg className={`w-4 h-4 transition-transform ${section.showDropdown ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {section.showDropdown && (
                  <div className="ml-3">
                    {section.options.map((option) => {
                      const isSelected = section.isMultiSelect
                        ? (option.id === "all" && section.currentValue.length === 0) || section.currentValue.includes(option.id)
                        : section.currentValue === option.value;
                      return (
                        <button key={option.id} onClick={() => section.onSelect(option.value)}
                          className="w-full text-left px-2 py-1.5 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                          style={{ fontWeight: isSelected ? "bold" : "normal", color: "#374151" }}>
                          {option.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;