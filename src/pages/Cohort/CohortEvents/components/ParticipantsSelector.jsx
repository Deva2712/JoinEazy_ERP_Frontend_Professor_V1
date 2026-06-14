// components/ParticipantsSelector.jsx

import React, { useEffect } from "react";
import { Users, Search, Check } from "lucide-react";

const ParticipantsSelector = ({
  loading,
  eventData,

  showParticipantsMenu,
  setShowParticipantsMenu,

  showMembersMenu,
  setShowMembersMenu,

  showGroupsMenu,
  setShowGroupsMenu,

  onParticipantSelect,
  onMemberSelect,
  onGroupSelect,

  availableMembers,
  availableGroups,

  memberSearchTerm,
  setMemberSearchTerm,

  groupSearchTerm,
  setGroupSearchTerm,
}) => {
  const getParticipantDisplayText = () => {
    if (eventData.selectedParticipant === "Everyone") {
      return "Everyone";
    }

    if (eventData.selectedParticipant === "Select Member") {
      if (!eventData.selectedMemberId) {
        return "Select Member";
      }

      const selectedMember = availableMembers.find(
        (m) => m.id === eventData.selectedMemberId
      );

      return selectedMember
        ? selectedMember.name
        : "Select Member";
    }

    if (eventData.selectedParticipant === "Select Group") {
      if (!eventData.selectedGroupId) {
        return "Select Group";
      }

      const selectedGroup = availableGroups.find(
        (g) => g.id === eventData.selectedGroupId
      );

      return selectedGroup
        ? selectedGroup.name
        : "Select Group";
    }

    return eventData.selectedParticipant;
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".participants-dropdown")) {
      setShowParticipantsMenu(false);
      setShowMembersMenu(false);
      setShowGroupsMenu(false);
    }
  };

  useEffect(() => {
    if (
      showParticipantsMenu ||
      showMembersMenu ||
      showGroupsMenu
    ) {
      document.addEventListener(
        "mousedown",
        handleClickOutside
      );

      return () => {
        document.removeEventListener(
          "mousedown",
          handleClickOutside
        );
      };
    }
  }, [
    showParticipantsMenu,
    showMembersMenu,
    showGroupsMenu,
  ]);

  return (
    <div className="relative participants-dropdown pt-1">
      {/* Main Selector */}
      <div className="flex items-center space-x-2">
        <Users
          size={18}
          className="text-gray-500 flex-shrink-0"
        />

        <button
          type="button"
          onClick={() =>
            setShowParticipantsMenu(
              !showParticipantsMenu
            )
          }
          className="flex-1 text-left text-gray-700 bg-transparent border-none focus:outline-none focus:ring-0 p-0"
          disabled={loading}
          style={{ fontSize: "16px" }}
        >
          {getParticipantDisplayText()}
        </button>
      </div>

      {/* Participants Menu */}
      {showParticipantsMenu && (
        <div className="absolute top-full left-6 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            <button
              type="button"
              onClick={() =>
                onParticipantSelect("Everyone")
              }
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
            >
              Everyone

              {eventData.selectedParticipant ===
                "Everyone" && (
                <Check
                  size={16}
                  className="text-blue-600"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                onParticipantSelect(
                  "Select Member"
                )
              }
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
            >
              Select Member

              {eventData.selectedParticipant ===
                "Select Member" && (
                <Check
                  size={16}
                  className="text-blue-600"
                />
              )}
            </button>

            <button
              type="button"
              onClick={() =>
                onParticipantSelect(
                  "Select Group"
                )
              }
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
            >
              Select Group

              {eventData.selectedParticipant ===
                "Select Group" && (
                <Check
                  size={16}
                  className="text-blue-600"
                />
              )}
            </button>
          </div>
        </div>
      )}

      {/* Members Dropdown */}
      {showMembersMenu && (
        <div className="absolute top-full left-6 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search members..."
                value={memberSearchTerm}
                onChange={(e) =>
                  setMemberSearchTerm(
                    e.target.value
                  )
                }
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {availableMembers.map((member) => (
              <button
                key={member.id}
                type="button"
                onClick={() =>
                  onMemberSelect(member)
                }
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs">
                    {member.name.charAt(0)}
                  </div>

                  <span>{member.name}</span>
                </div>

                {eventData.selectedMemberId ===
                  member.id && (
                  <Check
                    size={16}
                    className="text-blue-600"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() =>
                setShowMembersMenu(false)
              }
              className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Groups Dropdown */}
      {showGroupsMenu && (
        <div className="absolute top-full left-6 mt-1 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                placeholder="Search groups..."
                value={groupSearchTerm}
                onChange={(e) =>
                  setGroupSearchTerm(
                    e.target.value
                  )
                }
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="max-h-48 overflow-y-auto">
            {availableGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() =>
                  onGroupSelect(group)
                }
                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs">
                    <Users
                      size={12}
                      className="text-blue-600"
                    />
                  </div>

                  <div>
                    <div>{group.name}</div>

                    <div className="text-xs text-gray-500">
                      {group.memberCount} members
                    </div>
                  </div>
                </div>

                {eventData.selectedGroupId ===
                  group.id && (
                  <Check
                    size={16}
                    className="text-blue-600"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() =>
                setShowGroupsMenu(false)
              }
              className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantsSelector;