// src/pages/CohortNotes/CohortNotesController.jsx

import React, { useState } from "react";
import CohortNotesUI               from "./CohortNotesUI";
import CohortNotesCreateController from "./CohortNotesCreateController";
import useNotesData                from "./utility/Usenotesdata";
import useNotesNav                 from "./utility/Usenotesnav";

const CohortNotesController = ({ cohortId, cohortData }) => {
  const [searchTerm,     setSearchTerm]     = useState("");
  const [sortBy,         setSortBy]         = useState("Recently updated");
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const { filteredNotes, loading, error, handleRetry } = useNotesData(cohortId);
  const { showCreateModal, handleCreateNote, handleNoteClick, handleCloseCreateModal } = useNotesNav();

  const handleSortChange   = (option) => { setSortBy(option); setShowFilterMenu(false); };
  const handleFilterToggle = ()       => setShowFilterMenu((prev) => !prev);

  return (
    <>
      <CohortNotesUI
        notes={filteredNotes}
        searchTerm={searchTerm}
        sortBy={sortBy}
        showFilterMenu={showFilterMenu}
        onSearchChange={setSearchTerm}
        onSortChange={handleSortChange}
        onFilterToggle={handleFilterToggle}
        onCreateNote={handleCreateNote}
        onNoteClick={handleNoteClick}
        loading={loading}
        error={error}
        onRetry={handleRetry}
      />

      {showCreateModal && (
        <CohortNotesCreateController
          isOpen={showCreateModal}
          onClose={handleCloseCreateModal}
          cohortId={cohortId}
        />
      )}
    </>
  );
};

export default CohortNotesController;