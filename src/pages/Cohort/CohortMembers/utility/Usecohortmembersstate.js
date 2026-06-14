// src/pages/CohortMembers/useCohortMembersState.js
import { useEffect, useRef, useState } from "react";

export const useCohortMembersState = ({ assignments = [] }) => {
	const memberTypeRef = useRef(null);

	const [showGradeModal, setShowGradeModal] = useState(false);
	const [selectedGrade, setSelectedGrade] = useState(null);

	const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
	const [bulkGradeGroups, setBulkGradeGroups] = useState(false);

	const [editingGroupGrade, setEditingGroupGrade] = useState(null);
	const [groupGradeValue, setGroupGradeValue] = useState("");

	const [editingIndividualGrade, setEditingIndividualGrade] = useState(null);
	const [individualGradeValue, setIndividualGradeValue] = useState("");

	const [showAssignmentInfoModal, setShowAssignmentInfoModal] = useState(false);
	const [assignmentInfoData, setAssignmentInfoData] = useState(null);

	const [showDisabledCreatePopup, setShowDisabledCreatePopup] = useState(false);

	// Auto-select "all" if group assignments exist and none selected yet
	useEffect(() => {
		if (assignments.length > 0 && !selectedAssignmentId) {
			const hasGroupAssignments = assignments.some((a) => a.type === "group");
			if (hasGroupAssignments) {
				setSelectedAssignmentId("all");
			}
		}
	}, [assignments, selectedAssignmentId]);

	return {
		memberTypeRef,

		showGradeModal,
		setShowGradeModal,
		selectedGrade,
		setSelectedGrade,

		selectedAssignmentId,
		setSelectedAssignmentId,
		bulkGradeGroups,
		setBulkGradeGroups,

		editingGroupGrade,
		setEditingGroupGrade,
		groupGradeValue,
		setGroupGradeValue,

		editingIndividualGrade,
		setEditingIndividualGrade,
		individualGradeValue,
		setIndividualGradeValue,

		showAssignmentInfoModal,
		setShowAssignmentInfoModal,
		assignmentInfoData,
		setAssignmentInfoData,

		showDisabledCreatePopup,
		setShowDisabledCreatePopup,
	};
};