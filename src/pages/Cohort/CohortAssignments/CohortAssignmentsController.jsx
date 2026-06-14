import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfessorAssignmentsUI from "./ProfessorAssignmentsUI";
import StudentAssignmentsUI from "./StudentAssignmentsUI";
import { courseService } from "../../../api/services/course.service";

const CohortAssignmentsController = ({ cohortId, cohortData }) => {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalMembers, setTotalMembers] = useState(0);
  const [totalGroups, setTotalGroups] = useState(0);

  // FIX: Operator precedence bug — wrap ternary condition properly
  // Pehle: cohortData?.user_type || role === 'creator' || role === 'professor' ? 1 : 0
  // Yeh galat parse hota tha: (cohortData?.user_type || role==='creator' || role==='professor') ? 1 : 0
  // Ab: user_type directly cohortData se aata hai (useCohortData fix ke baad reliable hai)
  // role fallback sirf tab use hoga jab user_type undefined ho
  const user_type = (() => {
    if (cohortData?.user_type === 1) return 1;
    if (cohortData?.user_type === 0) return 0;
    if (cohortData?.is_admin === true) return 1;
    const role = cohortData?.role;
    if (role === "creator" || role === "professor" || role === "admin") return 1;
    return 0;
  })();

  // Fetch assignments
  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await courseService.getAssignments(cohortId);

      if (response && response.success) {
        let fetchedAssignments = [];
        let fetchedTotalMembers = 0;
        let fetchedTotalGroups = 0;

        if (Array.isArray(response.data)) {
          fetchedAssignments = response.data;
        } else if (response.data?.assignments) {
          fetchedAssignments = response.data.assignments;
          fetchedTotalMembers = response.data.totalMembers || 0;
          fetchedTotalGroups = response.data.totalGroups || 0;
        }

        // Normalize field names
        fetchedAssignments = fetchedAssignments.map((assignment) => ({
          ...assignment,
          name: assignment.name || assignment.title || assignment.assignment_name,
          deadline: assignment.deadline || assignment.dueDate || assignment.due_date,
          submissionLink: assignment.submissionLink || assignment.submission_link,
          isSubmitted:
            assignment.isSubmitted ||
            assignment.is_submitted ||
            assignment.submitted ||
            assignment.status === "submitted",
          submittedAt:
            assignment.submittedAt ||
            assignment.submitted_at ||
            assignment.submittedDate ||
            assignment.submitted_date,
          groupSubmittedAt:
            assignment.groupSubmittedAt || assignment.group_submitted_at,
        }));

        setAssignments(fetchedAssignments);
        setTotalMembers(fetchedTotalMembers);
        setTotalGroups(fetchedTotalGroups);
      } else {
        setError(response?.error || "Failed to load assignments");
      }
    } catch (err) {
      console.error("Error fetching assignments:", err);
      setError("Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cohortId) fetchAssignments();
  }, [cohortId]);

  // Create assignment (Professor only)
  const handleCreateAssignment = async (assignmentData) => {
    try {
      const response = await courseService.createAssignment(cohortId, assignmentData);
      if (response && response.success) {
        await fetchAssignments();
        return { success: true };
      } else {
        const errorMsg =
          response?.error || response?.message || "Failed to create assignment";
        throw new Error(errorMsg);
      }
    } catch (err) {
      console.error("Error creating assignment:", err);
      throw err;
    }
  };

  // Update assignment (Professor only)
  const handleUpdateAssignment = async (assignmentId, updatedData) => {
    try {
      const response = await courseService.updateAssignment(
        cohortId,
        assignmentId,
        updatedData
      );
      if (response.success) {
        await fetchAssignments();
      } else {
        throw new Error(response.error || "Failed to update assignment");
      }
    } catch (err) {
      console.error("Error updating assignment:", err);
      throw err;
    }
  };

  // Delete assignment (Professor only)
  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const response = await courseService.deleteAssignment(cohortId, assignmentId);
      if (response.success) {
        await fetchAssignments();
      } else {
        throw new Error(response.error || "Failed to delete assignment");
      }
    } catch (err) {
      console.error("Error deleting assignment:", err);
      alert(err.message || "Failed to delete assignment");
    }
  };

  // Mark as submitted (Student only)
  const handleMarkSubmitted = async (assignment) => {
    try {
      const assignmentId = assignment.assignment_id || assignment.id;
      const response = await courseService.markAssignmentSubmitted(
        cohortId,
        assignmentId
      );

      if (response.success) {
        setAssignments((prev) =>
          prev.map((a) =>
            a.id === assignmentId || a.assignment_id === assignmentId
              ? { ...a, isSubmitted: true, submittedAt: new Date().toISOString() }
              : a
          )
        );
        alert("Assignment marked as submitted successfully!");
      } else {
        alert(`Failed: ${response.message || response.error}`);
      }
    } catch (err) {
      console.error("Error marking as submitted:", err);
      alert(`Error: ${err.message || "Failed to mark assignment as submitted"}`);
    }
  };

  // View submissions (Professor only)
  const handleViewSubmissions = (assignment) => {
    // navigate(`/c/${cohortId}/assignments/${assignment.id}/submissions`);
    console.log("View submissions for:", assignment.name);
  };

  // Join group (Student only)
  const handleJoinGroup = () => {
    navigate(`/c/${cohortId}/members`);
  };

  // Render based on user type
  if (user_type === 1) {
    return (
      <ProfessorAssignmentsUI
        assignments={assignments}
        loading={loading}
        error={error}
        totalMembers={totalMembers}
        totalGroups={totalGroups}
        onCreateAssignment={handleCreateAssignment}
        onUpdateAssignment={handleUpdateAssignment}
        onDeleteAssignment={handleDeleteAssignment}
        onViewSubmissions={handleViewSubmissions}
      />
    );
  }

  return (
    <StudentAssignmentsUI
      assignments={assignments}
      loading={loading}
      error={error}
      onMarkSubmitted={handleMarkSubmitted}
      onJoinGroup={handleJoinGroup}
    />
  );
};

export default CohortAssignmentsController;