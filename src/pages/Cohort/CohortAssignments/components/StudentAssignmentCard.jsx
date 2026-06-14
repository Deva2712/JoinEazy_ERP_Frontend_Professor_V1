import React from "react";
import { Clock, CheckCircle, AlertCircle, FileText, ExternalLink, Users } from "lucide-react";

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
const formatTime = (d) => new Date(d).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
const isDeadlinePassed = (d) => new Date() > new Date(d);
const truncateDescription = (description, maxLength = 50) => {
  if (!description) return { truncated: '', needsTruncation: false };
  const text = description.replace(/<[^>]*>/g, '');
  if (text.length <= maxLength) return { truncated: text, needsTruncation: false };
  return { truncated: text.substring(0, maxLength) + '...', needsTruncation: true };
};

const AssignmentCard = ({ assignment, onSeeMore, onSubmitClick }) => {
  const isSubmitted = assignment.isSubmitted || assignment.is_submitted || (assignment.type === 'group' && assignment.groupSubmitted);
  const deadlinePassed = isDeadlinePassed(assignment.deadline);
  const isGroupAssignment = assignment.type === 'group';
  const isGroupLeader = assignment.groupInfo?.isLeader || assignment.groupInfo?.isGroupLeader;
  const inGroup = !!assignment.groupInfo;
  const canSubmit = !isSubmitted && !deadlinePassed && (!isGroupAssignment || (isGroupAssignment && isGroupLeader));
  const { truncated, needsTruncation } = truncateDescription(assignment.description);
  const assignmentName = assignment.name || assignment.title || assignment.assignment_name;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-200 flex flex-col">
      {/* Card Header */}
      <div className="p-4 relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-900" style={{ minHeight: "80px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-white flex-1" style={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: '1.4' }} title={assignmentName}>
            {assignmentName}
          </h3>
          <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${assignment.type === 'group' ? 'bg-purple-200 text-purple-800' : 'bg-blue-200 text-blue-800'}`}>
            {assignment.type === 'group' ? 'Group' : 'Individual'}
          </span>
        </div>
      </div>

      {/* Description */}
      <div className="px-4 pt-4 pb-3">
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          {truncated}
          {needsTruncation && (
            <button onClick={() => onSeeMore(assignment)} className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium ml-1">
              See more
            </button>
          )}
        </p>
      </div>

      {/* Due Date and Marks */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-900 dark:text-blue-300">Due Date</span>
            </div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{formatDate(assignment.deadline)}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">{formatTime(assignment.deadline)}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700/50 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-900 dark:text-blue-300">Total Marks</span>
            </div>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">{assignment.marks || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Status Notes */}
      {isSubmitted && (
        <div className="px-4 pb-3">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700/50 rounded-lg p-2.5 flex items-center justify-center gap-2">
            <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
            <p className="text-xs text-green-800 dark:text-green-300 font-semibold">
              Submitted on {formatDate(assignment.submittedAt || assignment.groupSubmittedAt)} at {formatTime(assignment.submittedAt || assignment.groupSubmittedAt)}
            </p>
          </div>
        </div>
      )}

      {!isSubmitted && deadlinePassed && (
        <div className="px-4 pb-3">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700/50 rounded-lg p-2.5 flex items-center justify-center gap-2">
            <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
            <p className="text-xs text-red-800 dark:text-red-300 font-semibold">Deadline Passed</p>
          </div>
        </div>
      )}

      {isGroupAssignment && !isSubmitted && !deadlinePassed && (
        <div className="px-4 pb-3">
          {!inGroup ? (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-2.5 flex items-center justify-center gap-2">
              <AlertCircle size={16} className="text-yellow-700 dark:text-yellow-400" />
              <p className="text-xs text-yellow-800 dark:text-yellow-300 font-medium">please create or join a group</p>
            </div>
          ) : !isGroupLeader ? (
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700/50 rounded-lg p-2.5 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users size={16} className="text-purple-700 dark:text-purple-400" />
                <p className="text-xs text-purple-800 dark:text-purple-300 font-semibold">please ask group leader to submit</p>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <div className="flex-1"></div>

      {/* Action Buttons */}
      {canSubmit && (
        <div className="px-4 pb-4">
          <div className="flex gap-3">
            <a href={assignment.submissionLink} target="_blank" rel="noopener noreferrer" className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm flex items-center justify-center gap-2 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600">
              <ExternalLink className="w-4 h-4" />
              Link
            </a>
            <button onClick={() => onSubmitClick(assignment)} className="flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600">
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard;