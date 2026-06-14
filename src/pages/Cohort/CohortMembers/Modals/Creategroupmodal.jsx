import React, { useState } from "react";
import { X } from "lucide-react";
import { getMemberDisplayName } from "../utility/Usegroupmembers";

const CreateGroupModal = ({
  isOpen,
  onClose,
  onSubmit,
  availableMembers,
  maxGroupMembers = 4,
  minGroupMembers = 1,
  userType = 0,
}) => {
  const [groupName, setGroupName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isProfessor = userType === 1;
  const maxSelectable = isProfessor ? maxGroupMembers : Math.max(0, maxGroupMembers - 1);

  const filteredMembers = availableMembers.filter(
    (m) =>
      m.name.toLowerCase().includes(memberSearchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(memberSearchTerm.toLowerCase())
  );

  const handleMemberToggle = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      if (selectedMembers.length >= maxSelectable) {
        setError(
          `Cannot add more than ${maxSelectable} ${isProfessor ? "members" : "additional members"} to a group`
        );
        return;
      }
      setSelectedMembers([...selectedMembers, memberId]);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return setError("Group name is required");
    if (!projectName.trim()) return setError("Project name is required");

    const currentGroupSize = isProfessor ? selectedMembers.length : 1 + selectedMembers.length;
    if (selectedMembers.length > maxSelectable) {
      return setError(
        `Cannot add more than ${maxSelectable} ${isProfessor ? "members" : "additional members"} to a group`
      );
    }
    if (currentGroupSize < minGroupMembers) {
      return setError(`At least ${minGroupMembers} members are required to create a group`);
    }

    setLoading(true);
    setError(null);
    try {
      await onSubmit({
        name: groupName,
        projectName,
        description: groupDescription,
        members: selectedMembers,
        availableMembers,
      });
      setGroupName("");
      setProjectName("");
      setGroupDescription("");
      setSelectedMembers([]);
      setMemberSearchTerm("");
    } catch (err) {
      setError(err.message || "Failed to create group");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Create Group</h3>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Group Name *
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter group name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="text-xs text-gray-600 dark:text-gray-400 space-y-0.5 py-1">
              <div>Minimum: {minGroupMembers} • Maximum: {maxGroupMembers}</div>
              <div>
                {isProfessor ? (
                  <>Joined: {selectedMembers.length}/{maxGroupMembers}</>
                ) : (
                  <>You will be added automatically as the group leader. Joined: {1 + selectedMembers.length}/{maxGroupMembers}</>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Search Members
              </label>
              <input
                type="text"
                value={memberSearchTerm}
                onChange={(e) => setMemberSearchTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by roll number"
              />
            </div>

            <div className="border border-gray-200 dark:border-gray-700 rounded-md max-h-48 overflow-y-auto">
              {filteredMembers.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={selectedMembers.includes(member.id)}
                      onChange={() => handleMemberToggle(member.id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {getMemberDisplayName(member)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{member.email}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {error && <div className="text-sm text-red-600 dark:text-red-400">{error}</div>}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {loading ? "Creating..." : "Create Group"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateGroupModal;