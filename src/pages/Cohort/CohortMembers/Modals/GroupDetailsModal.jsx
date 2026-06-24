import React, { useState, useEffect } from "react";
import {
  X,
  Edit,
  Trash2,
  Plus,
  Users,
  Search,
  RefreshCw,
} from "lucide-react";

import { courseService } from "../../../../api/services/course.service";

import {
  getMemberDisplayName,
  getMemberInitial,
} from "../utility/groupUtils";

import GroupMembersSection from "../component/GroupMembersSection";

const GroupDetailsModal = ({
  isOpen,
  onClose,
  groupId,
  cohortId,
  onGroupUpdated,
  userType = 0,
  cohortData,
  assignments = [],
  grades = {},
  onGradeSubmit,
}) => {
  const [groupData, setGroupData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);

  const [showAddMember, setShowAddMember] = useState(false);
  const [availableMembers, setAvailableMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingAvailableMembers, setLoadingAvailableMembers] =
    useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    projectName: "",
  });

  const [forceUpdate, setForceUpdate] = useState(0);

  // FIX: grading state was missing entirely — caused
  // "setEditingGrade is not defined" crash on click
  const [editingGrade, setEditingGrade] = useState(null); // { userId, assignmentId }
  const [gradeFormData, setGradeFormData] = useState({ score: "" });

  useEffect(() => {
    if (isOpen && groupId) {
      fetchGroupDetails();
    }
  }, [isOpen, groupId, forceUpdate]);

  const fetchGroupDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await courseService.getGroupDetails(
        groupId,
        cohortId
      );

      if (response.success) {
        setGroupData(response.data);

        setEditForm({
          name: response.data.group.group_name || "",
          projectName: response.data.group.project_name || "",
        });
      } else {
        setError("Failed to fetch group details");
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching group details");
    } finally {
      setLoading(false);
    }
  };

  const refreshGroupDetails = () => {
    setForceUpdate((prev) => prev + 1);
  };

  const fetchAvailableMembers = async () => {
    try {
      setLoadingAvailableMembers(true);

      const response = await courseService.getAvailableMembers(
        cohortId,
        groupId
      );

      if (response?.success) {
        let membersArray = [];

        if (Array.isArray(response.data)) {
          membersArray = response.data;
        } else if (Array.isArray(response.data?.members)) {
          membersArray = response.data.members;
        }

        setAvailableMembers(membersArray);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAvailableMembers(false);
    }
  };

  useEffect(() => {
    if (showAddMember) {
      fetchAvailableMembers();
    }
  }, [showAddMember]);

  const handleEditSubmit = async () => {
    if (userType !== 1) {
      alert("Only professors can edit groups.");
      return;
    }

    try {
      const updateData = {
        group_name: editForm.name,
        project_name: editForm.projectName,
      };

      const response = await courseService.updateGroup(
        cohortId,
        groupId,
        updateData
      );

      if (response.success) {
        setIsEditing(false);

        fetchGroupDetails();

        if (onGroupUpdated) onGroupUpdated();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update group");
    }
  };

  const handleDeleteGroup = async () => {
    if (userType !== 1) {
      alert("Only professors can delete groups.");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete this group?"
      )
    ) {
      try {
        const response = await courseService.deleteGroup(
          cohortId,
          groupId
        );

        if (response.success) {
          onClose();

          if (onGroupUpdated) onGroupUpdated();
        }
      } catch (err) {
        console.error(err);
        alert("Failed to delete group");
      }
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (userType !== 1) {
      alert("Only professors can remove members.");
      return;
    }

    try {
      const response = await courseService.removeGroupMember(
        groupId,
        memberId
      );

      if (response.success) {
        fetchGroupDetails();

        if (onGroupUpdated) onGroupUpdated();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to remove member");
    }
  };

  const handleAddMember = async (memberId) => {
    try {
      const response = await courseService.addMembersToGroup(
        groupId,
        [memberId]
      );

      if (response.success) {
        fetchGroupDetails();
        fetchAvailableMembers();

        if (onGroupUpdated) onGroupUpdated();
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add member");
    }
  };

  // ── FIX: grading handlers — were referenced in GroupMembersSection but never defined ──
  const handleGradeClick = (member, assignment, grade) => {
    setEditingGrade({
      userId: member.user?.user_id,
      assignmentId: assignment.id,
    });
    setGradeFormData({ score: grade?.score ?? "" });
  };

  const handleGradeCancel = () => {
    setEditingGrade(null);
    setGradeFormData({ score: "" });
  };

  const handleGradeSubmitInline = async (member, assignment) => {
    const score = gradeFormData.score;
    if (score === "" || score === null || score === undefined) {
      handleGradeCancel();
      return;
    }
    try {
      if (onGradeSubmit) {
        await onGradeSubmit(member.user?.user_id, assignment.id, Number(score));
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save grade");
    } finally {
      handleGradeCancel();
    }
  };

  const getAssignmentHoverMessage = (assignment, grade) => {
    if (grade?.score !== null && grade?.score !== undefined) {
      return `${assignment.name || assignment.title}: ${grade.score}/${assignment.marks}`;
    }
    if (assignment.deadline && new Date() > new Date(assignment.deadline)) {
      return `${assignment.name || assignment.title}: Deadline passed, not submitted`;
    }
    return `${assignment.name || assignment.title}: Not graded yet`;
  };

  // FIX: filter out members already in the group from available members list
  const filteredAvailableMembers = availableMembers.filter((m) => {
    const term = searchTerm.toLowerCase();
    const name = (m.display_name || m.username || m.email || "").toLowerCase();
    return name.includes(term) || (m.email || "").toLowerCase().includes(term);
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Group Details
          </h2>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshGroupDetails}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <RefreshCw size={18} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">
              {error}
            </div>
          ) : (
            <>
              {/* Group Info */}
              <div className="border rounded-xl overflow-hidden dark:border-gray-700">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold dark:text-white">
                      {groupData?.group?.group_name}
                    </h3>

                    <p className="text-sm text-gray-500">
                      {groupData?.group?.project_name ||
                        "No project assigned"}
                    </p>
                  </div>

                  {userType === 1 && (
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          setIsEditing(!isEditing)
                        }
                        className="p-2 bg-blue-100 text-blue-600 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={handleDeleteGroup}
                        className="p-2 bg-red-100 text-red-600 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>

                      <button
                        onClick={() =>
                          setShowAddMember(true)
                        }
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-1"
                      >
                        <Plus size={16} />
                        Add Member
                      </button>
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div className="p-4 space-y-3">
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          name: e.target.value,
                        })
                      }
                      placeholder="Group Name"
                      className="w-full p-2 border rounded-lg"
                    />

                    <input
                      type="text"
                      value={editForm.projectName}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          projectName: e.target.value,
                        })
                      }
                      placeholder="Project Name"
                      className="w-full p-2 border rounded-lg"
                    />

                    <button
                      onClick={handleEditSubmit}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      Save Changes
                    </button>
                  </div>
                )}

                {/* FIX: Add Member panel — was completely missing, button did nothing visible */}
                {showAddMember && (
                  <div className="p-4 border-t dark:border-gray-700 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-sm dark:text-white">
                        Add Member to Group
                      </h4>
                      <button
                        onClick={() => setShowAddMember(false)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="relative">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or email..."
                        className="w-full pl-9 p-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 dark:text-white"
                      />
                    </div>

                    {loadingAvailableMembers ? (
                      <div className="flex justify-center py-6">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      </div>
                    ) : filteredAvailableMembers.length > 0 ? (
                      <div className="max-h-64 overflow-y-auto space-y-2">
                        {filteredAvailableMembers.map((m) => (
                          <div
                            key={m.user_id || m.id || m.email}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-lg p-2"
                          >
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs flex-shrink-0">
                                {getMemberInitial(m)}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium dark:text-white truncate">
                                  {getMemberDisplayName(m)}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                  {m.email}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleAddMember(m.user_id || m.id)}
                              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 flex-shrink-0"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-4">
                        No available members to add
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/*  Members Section Component */}
              <GroupMembersSection
                groupData={groupData}
                userType={userType}
                assignments={assignments}
                grades={grades}
                editingGrade={editingGrade}
                gradeFormData={gradeFormData}
                setGradeFormData={setGradeFormData}
                handleGradeClick={handleGradeClick}
                handleGradeSubmitInline={handleGradeSubmitInline}
                handleGradeCancel={handleGradeCancel}
                handleRemoveMember={handleRemoveMember}
                getAssignmentHoverMessage={getAssignmentHoverMessage}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsModal;