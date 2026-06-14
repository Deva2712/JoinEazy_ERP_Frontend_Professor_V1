// src/pages/CohortNotes/components/NotesUIParts.jsx
import React from "react";
import { Search, ListFilter, Notebook } from "lucide-react";
// ─── Sort Options ─────────────────────────────────────────────────────────────
export const SORT_OPTIONS = [
  "Recently updated",
  "Latest first",
  "Oldest first",
  "Sorted (A-Z)",
  "Sorter (Z-A)",
];

// ─── Filter Button + Dropdown ─────────────────────────────────────────────────

export const FilterMenu = ({ filterMenuRef, showFilterMenu, sortBy, onFilterToggle, onSortChange }) => (
  <div className="relative">
    <button
      onClick={onFilterToggle}
      className="w-[38px] h-[38px] bg-white border border-[#D3D6DA] rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors"
    >
      <ListFilter size={18} className="text-black" />
    </button>

    {showFilterMenu && (
      <div
        ref={filterMenuRef}
        className="absolute top-12 left-0 bg-white border border-[#D3D6DA] rounded-xl shadow-2xl z-10 min-w-48"
      >
        <div className="p-4">
          <div className="text-sm font-medium text-gray-700 mb-1.5">Sort by</div>
          <div className="space-y-2.5">
            {SORT_OPTIONS.map((option) => (
              <label key={option} className="flex items-center gap-2.5 rounded-lg cursor-pointer transition-colors">
                <input
                  type="radio"
                  name="sortBy"
                  value={option}
                  checked={sortBy === option}
                  onChange={() => onSortChange(option)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                />
                <span className="text-sm text-gray-700 select-none">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    )}
  </div>
);

// ─── Toolbar (filter + search + create) ──────────────────────────────────────

export const NotesToolbar = ({ filterMenuRef, showFilterMenu, sortBy, searchTerm, onFilterToggle, onSortChange, onSearchChange, onCreateNote }) => (
  <div className="flex items-center gap-3.5 sm:gap-4">
    <FilterMenu
      filterMenuRef={filterMenuRef}
      showFilterMenu={showFilterMenu}
      sortBy={sortBy}
      onFilterToggle={onFilterToggle}
      onSortChange={onSortChange}
    />

    <div className="relative flex-1 max-w-md">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search size={17} className="text-gray-700" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Search for notes"
        className="w-full h-[38px] pl-10 pr-4 pt-[1px] bg-white border border-[#D3D6DA] rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-black text-[15px] placeholder-gray-700"
      />
    </div>

    <button
      onClick={onCreateNote}
      className="ml-auto h-[38px] w-[38px] sm:w-auto sm:px-4 bg-[#1E61F0] text-sm text-white rounded-full items-center justify-center gap-1.5 hover:bg-blue-700 transition-colors hidden sm:flex"
      style={{ backgroundColor: "rgb(30, 97, 240)" }}
    >
      <Notebook size={16} />
      <span className="font-medium pr-0.5">Create Note</span>
    </button>
  </div>
);

// ─── Note Content Truncator ───────────────────────────────────────────────────

const truncateContent = (content, maxLength = 250) => {
  const paragraphs = content.split("\n").filter((p) => p.trim());
  let totalLength = 0;
  let displayParagraphs = [];
  let needsEllipsis = false;

  for (const paragraph of paragraphs) {
    if (totalLength + paragraph.length <= maxLength) {
      displayParagraphs.push(paragraph);
      totalLength += paragraph.length;
    } else {
      const remaining = maxLength - totalLength;
      if (remaining > 50) {
        let truncated = "";
        for (const word of paragraph.split(" ")) {
          if ((truncated + word).length <= remaining) truncated += (truncated ? " " : "") + word;
          else break;
        }
        if (truncated) displayParagraphs.push(truncated);
      }
      needsEllipsis = true;
      break;
    }
  }

  if (displayParagraphs.length < paragraphs.length) needsEllipsis = true;
  return { displayParagraphs, needsEllipsis };
};

// ─── Note Card ────────────────────────────────────────────────────────────────

export const NoteCard = ({ note, onNoteClick }) => {
  const { displayParagraphs, needsEllipsis } = truncateContent(note.content);

  return (
    <div
      className="bg-white rounded-[20px] p-[16px] sm:p-[18px] border border-[#D3D6DA] cursor-pointer break-inside-avoid mb-5 sm:mb-6 block w-full"
      onClick={() => onNoteClick(note.id)}
    >
      <h3 className="font-bold text-black text-[17px] line-clamp-1 mb-0.5">{note.title}</h3>
      <p className="text-[13px] font-medium text-black line-clamp-1">{note.lastUpdated}</p>
      <hr className="border-gray-200 my-2.5" />

      {note.category && (
        <div
          className="flex items-center rounded-md px-2.5 h-8 mb-2.5"
          style={{ backgroundColor: note.colors?.background || "#e8daff" }}
        >
          <span className="text-[12px] font-medium line-clamp-1" style={{ color: note.colors?.text || "#6929c4" }}>
            {note.category}
          </span>
        </div>
      )}

      <div className="text-black text-sm pr-1">
        {displayParagraphs.map((paragraph, index) =>
          paragraph.trim() ? (
            <p key={index} className="mb-3 last:mb-0.5 leading-normal">
              {paragraph}
              {needsEllipsis && index === displayParagraphs.length - 1 ? "..." : ""}
            </p>
          ) : null
        )}
      </div>
    </div>
  );
};

// ─── Empty State ──────────────────────────────────────────────────────────────

export const EmptyState = ({ searchTerm }) => (
  <div className="text-center py-12">
    <div className="text-gray-400 mb-2">
      <Search size={48} className="mx-auto" />
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-1">No notes found</h3>
    <p className="text-gray-500">
      {searchTerm ? "Try adjusting your search terms" : "Create your first note to get started"}
    </p>
  </div>
);