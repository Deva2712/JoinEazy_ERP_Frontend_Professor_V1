import React from "react";
import { X, ArrowLeft } from "lucide-react";

const SubmissionsList = ({
  submissions,
  courseData,
  onClose,
  onBack,
  onViewSubmission,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:p-4 overflow-y-auto overflow-x-hidden">
      <div className="bg-white sm:rounded-2xl w-full sm:max-w-[40rem] h-[100vh] sm:h-auto sm:max-h-[90vh] flex flex-col my-auto sm:border border-[#52586633]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#52586633]">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="transition-colors">
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h2 className="text-lg sm:text-xl font-semibold text-black">
              {courseData?.title || "Course Details"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Submissions List */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-0">
            <h3 className="text-base font-semibold text-black mb-2">
              All Submissions ({submissions.length})
            </h3>
          </div>

          <div className="space-y-0">
            {submissions.map((submission, index) => (
              <div
                key={submission.id}
                className={`flex items-center justify-between p-4 px-0 ${
                  index < submissions.length - 1 ? "border-b" : ""
                }`}
                style={{
                  borderColor:
                    index < submissions.length - 1 ? "#52586633" : "transparent",
                }}
              >
                <div className="flex items-center gap-3">
                  {submission.memberType !== 1 && (
                    <img
                      src={submission.avatar}
                      alt={submission.studentName}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                  )}
                  <div className={`${submission.memberType === 1 ? "ml-0" : ""}`}>
                    <p className="font-medium text-gray-900 text-[15px]">
                      {submission.studentName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {submission.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      submission.graded
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {submission.graded ? "Graded" : "Not Graded"}
                  </span>
                  <button
                    onClick={() => onViewSubmission(submission)}
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionsList;