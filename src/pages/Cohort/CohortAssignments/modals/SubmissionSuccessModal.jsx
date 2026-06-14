import React from "react";
import { CheckCircle } from "lucide-react";

const SubmissionSuccessModal = ({ isOpen, onClose, assignmentName, celebrationImage }) => {
  if (!isOpen) return null;

  const submissionDate = new Date();
  const formattedDate = submissionDate.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
  const formattedTime = submissionDate.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
        {/* Success Image */}
        <div className="mb-6">
          {celebrationImage ? (
            <img 
              src={celebrationImage} 
              alt="Celebration" 
              className="w-48 h-48 mx-auto object-contain"
            />
          ) : (
            <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-20 h-20 text-white" />
            </div>
          )}
        </div>

        {/* Success Message */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Submission Confirmed!
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-1">
          You've successfully marked the assignment
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-semibold mb-4">
          "{assignmentName}"
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          as submitted. Fantastic work!
        </p>

        {/* Submission Date and Time */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Submitted on</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{formattedDate}</p>
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{formattedTime}</p>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          Return to Assignments
        </button>
      </div>
    </div>
  );
};

export default SubmissionSuccessModal;