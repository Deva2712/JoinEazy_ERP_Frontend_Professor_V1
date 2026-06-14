// src/pages/CohortMembers/utility/useCohortModals.js

import { useState } from "react";

const useCohortModals = ({ members, isInGroup, user_type, handleCreateGroupSubmit }) => {
  const [showProfileModal,      setShowProfileModal]      = useState(false);
  const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
  const [showCreateGroupModal,  setShowCreateGroupModal]  = useState(false);
  const [selectedProfileId,     setSelectedProfileId]     = useState(null);
  const [selectedGroupId,       setSelectedGroupId]       = useState(null);

  const handleCreateGroup = () => {
    if (user_type !== 1 && isInGroup) return alert("You are already in a group");
    setShowCreateGroupModal(true);
  };

  const handleMemberDetails = (memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    if (member.type === "group") {
      if (!member.groupId) return alert("Error: Group ID is missing.");
      setSelectedGroupId(member.groupId);
      setShowGroupDetailsModal(true);
    } else {
      setSelectedProfileId(memberId);
      setShowProfileModal(true);
    }
  };

  const handleGroupNameClick = (groupId) => {
    setSelectedGroupId(groupId);
    setShowGroupDetailsModal(true);
  };

  const handleCreateGroupSubmitAndClose = async (groupData) => {
    await handleCreateGroupSubmit(groupData);
    setShowCreateGroupModal(false);
  };

  const closeProfileModal = () => {
    setShowProfileModal(false);
    setSelectedProfileId(null);
  };

  const closeGroupDetailsModal = () => {
    setShowGroupDetailsModal(false);
    setSelectedGroupId(null);
  };

  return {
    // State
    showProfileModal,
    showGroupDetailsModal,
    showCreateGroupModal,
    selectedProfileId,
    selectedGroupId,
    // Handlers
    handleCreateGroup,
    handleMemberDetails,
    handleGroupNameClick,
    handleCreateGroupSubmitAndClose,
    closeProfileModal,
    closeGroupDetailsModal,
    setShowCreateGroupModal,
  };
};

export default useCohortModals;