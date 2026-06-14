// src/pages/CohortMembers/CohortMembersUI.jsx
import React from "react";
import GradeModal from "../CohortMembers/Modals/GradeModal";
import AssignmentInfoModal from "./AssignmentInfoModal";
import CohortMembersHeader from "./component/Cohortmembersheader";
import MembersList from "./component/Memberslist";
import { useCohortMembersState } from "./utility/Usecohortmembersstate";

const CohortMembersUI = ({
	members, memberType, user_type, isInGroup,
	loading, error, currentUserId,
	onMemberTypeChange, onCreateGroup, onMemberDetails,
	onGroupNameClick, onRemove, onExport,
	searchTerm, onSearchChange,
	totalGroups, membersInGroups, currentCourseMembers,
	assignments = [], grades = {}, onGradeSubmit,
}) => {
	const {
		memberTypeRef,
		showGradeModal, setShowGradeModal,
		selectedGrade, setSelectedGrade,
		selectedAssignmentId, bulkGradeGroups,
		editingGroupGrade, setEditingGroupGrade,
		groupGradeValue, setGroupGradeValue,
		editingIndividualGrade, setEditingIndividualGrade,
		individualGradeValue, setIndividualGradeValue,
		showAssignmentInfoModal, setShowAssignmentInfoModal,
		assignmentInfoData, setAssignmentInfoData,
		setShowDisabledCreatePopup,
	} = useCohortMembersState({ assignments });

	if (loading) return <div className="flex items-center justify-center min-h-[400px]">Loading members...</div>;
	if (error)   return <div className="flex items-center justify-center min-h-[400px]">{error}</div>;

	return (
		<div className="px-2 sm:px-3 md:px-4 pb-20 md:pb-4">
			<div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
				<CohortMembersHeader
					memberType={memberType}
					memberTypeRef={memberTypeRef}
					user_type={user_type}
					isInGroup={isInGroup}
					searchTerm={searchTerm}
					totalGroups={totalGroups}
					membersInGroups={membersInGroups}
					currentCourseMembers={currentCourseMembers}
					onMemberTypeChange={onMemberTypeChange}
					onCreateGroup={onCreateGroup}
					onExport={onExport}
					onSearchChange={onSearchChange}
					setShowDisabledCreatePopup={setShowDisabledCreatePopup}
				/>

				<MembersList
					members={members}
					memberType={memberType}
					user_type={user_type}
					currentUserId={currentUserId}
					assignments={assignments}
					grades={grades}
					editingIndividualGrade={editingIndividualGrade}
					individualGradeValue={individualGradeValue}
					setIndividualGradeValue={setIndividualGradeValue}
					setEditingIndividualGrade={setEditingIndividualGrade}
					editingGroupGrade={editingGroupGrade}
					groupGradeValue={groupGradeValue}
					setGroupGradeValue={setGroupGradeValue}
					setEditingGroupGrade={setEditingGroupGrade}
					bulkGradeGroups={bulkGradeGroups}
					selectedAssignmentId={selectedAssignmentId}
					onGradeSubmit={onGradeSubmit}
					onMemberDetails={onMemberDetails}
					onGroupNameClick={onGroupNameClick}
					onRemove={onRemove}
					setAssignmentInfoData={setAssignmentInfoData}
					setShowAssignmentInfoModal={setShowAssignmentInfoModal}
				/>
			</div>

			{showGradeModal && selectedGrade && (
				<GradeModal
					isOpen={showGradeModal}
					onClose={() => { setShowGradeModal(false); setSelectedGrade(null); }}
					member={selectedGrade.member}
					assignment={selectedGrade.assignment}
					currentGrade={selectedGrade.grade}
					onSubmit={onGradeSubmit}
					isGroupGrading={selectedGrade.isGroupGrading}
				/>
			)}

			<AssignmentInfoModal
				isOpen={showAssignmentInfoModal}
				onClose={() => { setShowAssignmentInfoModal(false); setAssignmentInfoData(null); }}
				assignment={assignmentInfoData?.assignment}
				grade={assignmentInfoData?.grade}
				isGroupAssignment={assignmentInfoData?.isGroupAssignment}
				membersGradedIndividually={assignmentInfoData?.membersGradedIndividually}
			/>
		</div>
	);
};

export default CohortMembersUI;