
// export default CohortEventsCreateUI;


import React from "react";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Loader2,
} from "lucide-react";

import ParticipantsSelector from "./components/ParticipantsSelector";

const CohortEventsCreateUI = ({
  isOpen,
  onClose,
  eventData,
  onInputChange,
  onSave,
  loading,
  error,
  isEditMode,
  cohortData,
  isRequestMode = false,
  user_type = 1,

  // participants props
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
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex md:items-center md:justify-center items-end justify-center bg-black bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white md:rounded-2xl rounded-b-none shadow-lg w-full max-w-[35rem] relative h-[100vh] md:h-auto md:max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {isRequestMode
              ? "Request Event"
              : isEditMode
              ? "Edit Event"
              : "Create New Event"}
          </h2>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
            disabled={loading}
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-3">

            {/* Title */}
            <input
              type="text"
              placeholder="Title"
              value={eventData.title}
              onChange={(e) =>
                onInputChange("title", e.target.value)
              }
              className="w-full text-2xl font-semibold bg-transparent border-none focus:outline-none p-0"
              disabled={loading}
            />

            {/* Description */}
            <textarea
              placeholder="Description"
              value={eventData.description}
              onChange={(e) =>
                onInputChange("description", e.target.value)
              }
              className="w-full resize-none bg-transparent border-none focus:outline-none p-0"
              rows={2}
              disabled={loading}
            />

            {/* Location */}
            {user_type === 1 && (
              <div className="flex items-center space-x-2">
                <MapPin size={18} className="text-gray-500" />

                <input
                  type="text"
                  placeholder="Enter Location"
                  value={eventData.location}
                  onChange={(e) =>
                    onInputChange("location", e.target.value)
                  }
                  className="flex-1 bg-transparent border-none focus:outline-none p-0"
                  disabled={loading}
                />
              </div>
            )}

            {/* Date */}
            <div className="flex items-center space-x-2">
              <Calendar size={18} className="text-gray-500" />

              <input
                type="date"
                value={eventData.date}
                onChange={(e) =>
                  onInputChange("date", e.target.value)
                }
                className="flex-1 bg-transparent border-none focus:outline-none p-0"
                disabled={loading}
              />
            </div>

            {/* Start Time */}
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-gray-500" />

              <input
                type="time"
                value={eventData.startTime}
                onChange={(e) =>
                  onInputChange("startTime", e.target.value)
                }
                className="flex-1 bg-transparent border-none focus:outline-none p-0"
                disabled={loading}
              />

              <span className="text-sm text-gray-500">
                Start Time
              </span>
            </div>

            {/* End Time */}
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-gray-500" />

              <input
                type="time"
                value={eventData.endTime}
                onChange={(e) =>
                  onInputChange("endTime", e.target.value)
                }
                className="flex-1 bg-transparent border-none focus:outline-none p-0"
                disabled={loading}
              />

              <span className="text-sm text-gray-500">
                End Time
              </span>
            </div>

            {/* Participants Component */}
            {user_type === 1 && (
              <ParticipantsSelector
                eventData={eventData}
                loading={loading}

                showParticipantsMenu={showParticipantsMenu}
                setShowParticipantsMenu={setShowParticipantsMenu}

                showMembersMenu={showMembersMenu}
                setShowMembersMenu={setShowMembersMenu}

                showGroupsMenu={showGroupsMenu}
                setShowGroupsMenu={setShowGroupsMenu}

                onParticipantSelect={onParticipantSelect}
                onMemberSelect={onMemberSelect}
                onGroupSelect={onGroupSelect}

                availableMembers={availableMembers}
                availableGroups={availableGroups}

                memberSearchTerm={memberSearchTerm}
                setMemberSearchTerm={setMemberSearchTerm}

                groupSearchTerm={groupSearchTerm}
                setGroupSearchTerm={setGroupSearchTerm}
              />
            )}

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-200">
          <button
            onClick={onSave}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-full flex items-center justify-center disabled:opacity-50"
          >
            {loading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}

            {loading
              ? isRequestMode
                ? "Requesting..."
                : isEditMode
                ? "Updating..."
                : "Creating..."
              : isRequestMode
              ? "Request Event"
              : isEditMode
              ? "Update Event"
              : "Create Event"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CohortEventsCreateUI;