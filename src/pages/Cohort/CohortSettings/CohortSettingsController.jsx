// export default CohortSettingsController;

import React from "react";
import CohortSettingsUI from "./CohortSettingsUI";
import useCohortSettings from "./utility/Usecohortsettings";

const CohortSettingsController = ({ isOpen, onClose, cohortData }) => {
  const {
    form,
    saveError,
    deleteError,
    isDeleting,
    showDeleteConfirmation,
    importParticipantsFile,
    maxGroupMembers,  setMaxGroupMembers,
    minGroupMembers,  setMinGroupMembers,
    maxCourseMembers, setMaxCourseMembers,
    handleOverlayClick,
    handleSave,
    handleDeleteCourse,
    handleImportParticipants,
    handleDeleteClick,
    handleDeleteCancel,
  } = useCohortSettings({ cohortData, isOpen, onClose });

  if (!isOpen) return null;

  return (
    <CohortSettingsUI
      isOpen={isOpen}
      onClose={onClose}
      onOverlayClick={handleOverlayClick}
      form={form}
      onSave={handleSave}
      cohortData={cohortData}
      saveError={saveError}
      onImportParticipants={handleImportParticipants}
      importParticipantsFile={importParticipantsFile}
      maxGroupMembers={maxGroupMembers}
      onMaxGroupMembersChange={setMaxGroupMembers}
      minGroupMembers={minGroupMembers}
      onMinGroupMembersChange={setMinGroupMembers}
      maxCourseMembers={maxCourseMembers}
      onMaxCourseMembersChange={setMaxCourseMembers}
      deleteError={deleteError}
      isDeleting={isDeleting}
      showDeleteConfirmation={showDeleteConfirmation}
      onDeleteClick={handleDeleteClick}
      onDeleteConfirm={handleDeleteCourse}
      onDeleteCancel={handleDeleteCancel}
    />
  );
};

export default CohortSettingsController;