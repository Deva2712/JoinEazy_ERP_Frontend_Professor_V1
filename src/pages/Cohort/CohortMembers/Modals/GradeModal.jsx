import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { getMemberDisplayName } from "../utility/memberUtils";

const GradeModal = ({ isOpen, onClose, member, assignment, currentGrade, onSubmit, isGroupGrading }) => {
  const [score, setScore] = useState(currentGrade?.score?.toString() || "");
  const [feedback, setFeedback] = useState(currentGrade?.feedback || "");

  useEffect(() => {
    if (isOpen) {
      setScore(currentGrade?.score?.toString() || "");
      setFeedback(currentGrade?.feedback || "");
    }
  }, [isOpen, currentGrade]);

  const handleSubmit = async () => {
    const numScore = parseFloat(score);
    if (isNaN(numScore) || numScore < 0 || numScore > assignment.marks) {
      alert(`Score must be between 0 and ${assignment.marks}`);
      return;
    }
    const result = await onSubmit(member, assignment, numScore, feedback, isGroupGrading);
    if (result?.success) onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100">
            Grade Assignment{" "}
            {isGroupGrading && <span className="text-blue-600">(Group)</span>}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isGroupGrading ? "Group: " : "Student: "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {getMemberDisplayName(member)}
              </span>
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Assignment:{" "}
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {assignment.title}
              </span>
            </p>
            {isGroupGrading && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                This grade will be applied to all group members
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Score (out of {assignment.marks})
            </label>
            <input
              type="number"
              min="0"
              max={assignment.marks}
              step="0.5"
              value={score}
              onChange={(e) => {
                const val = e.target.value;
                const num = parseFloat(val);
                if (val === "" || (num >= 0 && num <= assignment.marks)) setScore(val);
              }}
              onBlur={(e) => {
                const num = parseFloat(e.target.value);
                if (!isNaN(num)) {
                  if (num > assignment.marks) setScore(assignment.marks.toString());
                  else if (num < 0) setScore("0");
                }
              }}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Feedback
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
              placeholder="Enter feedback..."
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Submit Grade
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GradeModal;