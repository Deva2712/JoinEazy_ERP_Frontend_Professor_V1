// src/pages/CohortNotes/CohortNotesUI.jsx

import React, { useEffect, useRef } from "react";
import { Notebook } from "lucide-react";
import { NotesToolbar, NoteCard, EmptyState } from "./components/Notesuiparts";

const CohortNotesUI = ({
  notes, searchTerm, sortBy, showFilterMenu,
  onSearchChange, onSortChange, onFilterToggle,
  onCreateNote, onNoteClick,
  loading, error, onRetry,
}) => {
  const filterMenuRef = useRef(null);

  useEffect(() => {
    if (!showFilterMenu) return;
    const handleClickOutside = (e) => {
      if (filterMenuRef.current && !filterMenuRef.current.contains(e.target)) onFilterToggle();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilterMenu, onFilterToggle]);

  if (loading) {
    return (
      <div className="flex flex-col h-full items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4" />
        <p className="text-gray-600">Loading notes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-full items-center justify-center py-20">
        <div className="text-red-500 mb-4">Failed to load notes: {error}</div>
        <button onClick={onRetry} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="py-5 sm:py-6 space-y-5 sm:space-y-6 pb-[72px] sm:pb-6 px-4">
      <NotesToolbar
        filterMenuRef={filterMenuRef}
        showFilterMenu={showFilterMenu}
        sortBy={sortBy}
        searchTerm={searchTerm}
        onFilterToggle={onFilterToggle}
        onSortChange={onSortChange}
        onSearchChange={onSearchChange}
        onCreateNote={onCreateNote}
      />

      <div className="columns-1 md:columns-2 lg:columns-3 gap-5 sm:gap-6">
        {notes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteClick={onNoteClick} />
        ))}
      </div>

      {notes.length === 0 && <EmptyState searchTerm={searchTerm} />}

      {/* FAB — mobile only */}
      <button
        onClick={onCreateNote}
        className="fixed bottom-[92px] right-5 w-14 h-14 bg-[#1E61F0] text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105 sm:hidden z-50"
        style={{ backgroundColor: "rgb(30, 97, 240)" }}
      >
        <Notebook size={24} />
      </button>
    </div>
  );
};

export default CohortNotesUI;