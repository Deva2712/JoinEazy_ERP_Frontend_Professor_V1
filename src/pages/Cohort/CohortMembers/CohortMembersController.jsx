// src/pages/CohortMembers/CohortMembersController.jsx

import React from "react";
import CohortMembersUI               from "./CohortMembersUI";
import CohortMembersProfileController from "./CohortMembersProfileController";
import GroupDetailsModal             from "./Modals/GroupDetailsModal";
import CreateGroupModal              from "./Modals/Creategroupmodal";
import useGroupMembers               from "./utility/Usegroupmembers";
import useMemberExport               from "./utility/Usememberexport";
import useCohortModals               from "./utility/Usecohortmodals";

const CohortMembersController = ({ cohortId, cohortData }) => {
  const {
    members, filteredMembers, loading, error,
    isInGroup, currentUserId, totalGroups, membersInGroups,
    assignments, grades, user_type,
    sortBy, memberType, searchTerm,
    setSortBy, setMemberType, setSearchTerm,
    fetchMembers, handleGradeSubmit, handleRemoveMember, handleCreateGroupSubmit,
  } = useGroupMembers(cohortId, cohortData);

  const { handleExportMembers } = useMemberExport({
    members, assignments, grades, cohortData, memberType,
  });

  const modals = useCohortModals({
    members, isInGroup, user_type, handleCreateGroupSubmit,
  });

  // ── Loading / error states ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading members...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <CohortMembersUI
        members={filteredMembers}
        sortBy={sortBy} memberType={memberType} user_type={user_type}
        loading={loading} error={error}
        isInGroup={isInGroup} currentUserId={currentUserId}
        searchTerm={searchTerm} totalGroups={totalGroups} membersInGroups={membersInGroups}
        assignments={assignments} grades={grades}
        maxCourseMembers={cohortData?.max_course_members || 1400}
        currentCourseMembers={members.filter((m) => m.type === "individual").length}
        onSortChange={setSortBy} onMemberTypeChange={setMemberType}
        onCreateGroup={modals.handleCreateGroup}
        onMemberDetails={modals.handleMemberDetails}
        onGroupNameClick={modals.handleGroupNameClick}
        onRemove={handleRemoveMember} onExport={handleExportMembers}
        onSearchChange={setSearchTerm} onGradeSubmit={handleGradeSubmit}
      />

      {modals.showProfileModal && modals.selectedProfileId && (
        <CohortMembersProfileController
          memberId={modals.selectedProfileId}
          onClose={modals.closeProfileModal}
        />
      )}

      <CreateGroupModal
        isOpen={modals.showCreateGroupModal}
        onClose={() => modals.setShowCreateGroupModal(false)}
        onSubmit={modals.handleCreateGroupSubmitAndClose}
        availableMembers={members.filter(
          (m) => m.type === "individual" && !m.isInGroup &&
            (currentUserId ? m.realUserId !== currentUserId : true) && !!m.realUserId
        )}
        maxGroupMembers={cohortData?.max_groups_members || 4}
        minGroupMembers={cohortData?.min_groups_members || 1}
        userType={user_type}
      />

      {modals.showGroupDetailsModal && modals.selectedGroupId && (
        <GroupDetailsModal
          isOpen={modals.showGroupDetailsModal}
          onClose={modals.closeGroupDetailsModal}
          groupId={modals.selectedGroupId}
          cohortId={cohortId} userType={user_type} cohortData={cohortData}
          onGroupUpdated={fetchMembers}
          assignments={assignments} grades={grades}
          onGradeSubmit={handleGradeSubmit}
        />
      )}
    </>
  );
};

export default CohortMembersController;