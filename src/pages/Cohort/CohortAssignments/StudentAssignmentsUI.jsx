import React, { useState } from "react";
import { AlertCircle, FileText } from "lucide-react";
import AssignmentDetailsModal from "./modals/AssignmentDetailsModal";
import AssignmentFilters from "./components/AssignmentFilters";
import SubmissionSuccessModal from "./modals/SubmissionSuccessModal";
import AssignmentCard from "./components/StudentAssignmentCard";

const FONT = { fontFamily: '"Roboto", system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif' };

const MOCK_GROUP_INFO = {
  groupId: 1, groupName: 'Team Alpha', isLeader: false,
  isGroupLeader: false, leaderName: 'Alice Johnson', members: [2, 1, 3],
};

const StudentAssignmentsUI = ({ assignments, loading, error, onMarkSubmitted }) => {
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedAssignmentName, setSubmittedAssignmentName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const handleSubmitClick = async (assignment) => {
    const name = assignment.name || assignment.title || assignment.assignment_name;
    const confirmed = window.confirm(`Are you sure you want to mark "${name}" as submitted?\n\nThis will notify your professor.`);
    if (confirmed) {
      await onMarkSubmitted(assignment);
      setSubmittedAssignmentName(name);
      setShowSuccessModal(true);
    }
  };

  const handleSeeMore = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDetailsModal(true);
  };

  const filteredAssignments = assignments
    .filter(a => {
      const name = a.name || a.title || a.assignment_name;
      const matchesSearch = name?.toLowerCase().includes(searchQuery.toLowerCase()) || a.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch && (typeFilter === 'all' || a.type === typeFilter);
    })
    .map(a => (a.type === 'group' && a.id === 105) ? { ...a, groupInfo: MOCK_GROUP_INFO } : a);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" style={FONT}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading assignments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]" style={FONT}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-5 lg:py-6 xl:py-8 pb-24 md:pb-5" style={FONT}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="w-6 h-6" />
          My Assignments
        </h1>
      </div>

      <AssignmentFilters searchQuery={searchQuery} setSearchQuery={setSearchQuery} typeFilter={typeFilter} setTypeFilter={setTypeFilter} />

      {filteredAssignments.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No assignments found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchQuery || typeFilter !== 'all' ? 'Try adjusting your search or filters' : 'Your assignments will appear here'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} onSeeMore={handleSeeMore} onSubmitClick={handleSubmitClick} />
          ))}
        </div>
      )}

      <AssignmentDetailsModal
        isOpen={showDetailsModal}
        onClose={() => { setShowDetailsModal(false); setSelectedAssignment(null); }}
        assignment={selectedAssignment}
      />

      <SubmissionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        assignmentName={submittedAssignmentName}
        celebrationImage="/assets/celebration.png"
      />
    </div>
  );
};

export default StudentAssignmentsUI;