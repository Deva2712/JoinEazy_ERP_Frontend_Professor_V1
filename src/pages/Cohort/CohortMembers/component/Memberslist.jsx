// src/pages/CohortMembers/MembersList.jsx
import React from "react";
import { Users } from "lucide-react";
import MemberRow from "./MemberRow";

const MembersList = ({
	members,
	memberType,
	user_type,
	currentUserId,
	assignments,
	grades,
	editingIndividualGrade,
	individualGradeValue,
	setIndividualGradeValue,
	setEditingIndividualGrade,
	editingGroupGrade,
	groupGradeValue,
	setGroupGradeValue,
	setEditingGroupGrade,
	bulkGradeGroups,
	selectedAssignmentId,
	onGradeSubmit,
	onMemberDetails,
	onGroupNameClick,
	onRemove,
	setAssignmentInfoData,
	setShowAssignmentInfoModal,
}) => {
	if (!members.length) {
		return (
			<div className="p-8 text-center">
				<Users size={32} className="text-gray-300 mx-auto mb-2" />
				<h3 className="text-sm font-medium">No {memberType.toLowerCase()} found</h3>
			</div>
		);
	}

	return members.map((member) => (
		<MemberRow
			key={member.id}
			member={member}
			user_type={user_type}
			currentUserId={currentUserId}
			memberType={memberType}
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
	));
};

export default MembersList;