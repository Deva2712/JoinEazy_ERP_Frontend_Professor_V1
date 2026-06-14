import React, { useState } from "react";
import { X, Calendar, FileText, Users, Clock, Upload, Share2, Tag, ArrowLeft, Paperclip, BookOpen, Award, BarChart3, CheckCircle } from "lucide-react";
import { getDeadlineInfo, formatFileSize } from "../CohortCourses/utils/courseUtils";
import SubmissionDetailComponent from "../CohortCourses/components/submissionDetailComponent";
import SubmissionsList from "../CohortCourses/components/SubmissionList";
import CourseComments from "./components/Coursecomments";

const CohortCoursesContentUI = ({ isOpen, onClose, courseData, loading, cohortId, cohortData }) => {
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [showSubmissionDetail, setShowSubmissionDetail] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  if (!isOpen) return null;

  const deadlineInfo = getDeadlineInfo(courseData);
  const user_type = cohortData?.is_admin ? 1 : 0;
  const isDeadlinePassed = courseData && new Date(courseData.deadline) < new Date();
  const submissions = courseData?.submissions || [];

  const handleViewSubmission = (submission) => { setSelectedSubmission(submission); setShowSubmissionDetail(true); };
  const handleBackToSubmissions = () => { setShowSubmissionDetail(false); setSelectedSubmission(null); };

  // Submission Detail
  if (showSubmissions && showSubmissionDetail && selectedSubmission && user_type === 1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:p-4 overflow-y-auto overflow-x-hidden">
        <div className="bg-white sm:rounded-2xl w-full sm:max-w-[40rem] h-[100vh] sm:h-auto sm:max-h-[90vh] flex flex-col my-auto sm:border border-[#52586633]">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#52586633]">
            <div className="flex items-center gap-3">
              <button onClick={handleBackToSubmissions}><ArrowLeft size={20} className="text-gray-600" /></button>
              <h2 className="text-lg sm:text-xl font-semibold text-black">{courseData?.title || "Course Details"}</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-600" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5">
            <SubmissionDetailComponent submission={selectedSubmission} courseData={courseData} onGrade={(id, grade, weightage) => console.log("Grading:", id, grade, weightage)} user_type={user_type} formatFileSize={formatFileSize} />
          </div>
        </div>
      </div>
    );
  }

  // Submissions List
  if (showSubmissions && user_type === 1) {
    return <SubmissionsList submissions={submissions} courseData={courseData} onClose={onClose} onBack={() => setShowSubmissions(false)} onViewSubmission={handleViewSubmission} />;
  }

  // Main Modal
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 sm:p-4 overflow-y-auto overflow-x-hidden">
      <div className="bg-white sm:rounded-2xl w-full sm:max-w-[40rem] h-[100vh] sm:h-auto sm:max-h-[90vh] flex flex-col my-auto sm:border border-[#52586633]">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#52586633]">
          <h2 className="text-lg sm:text-xl font-semibold text-black">{loading ? "Loading..." : courseData?.title || "Course Details"}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-600" /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-12"><div className="text-lg text-gray-600">Loading course details...</div></div>
          ) : courseData ? (
            <div className="p-5">
              {/* Status Row */}
              <div className="flex items-center justify-between mb-4">
                {user_type === 0 ? (
                  <div className="flex items-center gap-2">
                    <Calendar size={16} style={{ color: deadlineInfo.color }} />
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: deadlineInfo.color }} />
                    <span className="text-[15px] font-medium" style={{ color: deadlineInfo.color }}>{deadlineInfo.text}</span>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-gray-700">{courseData.submissionCount || 0}/{courseData.totalSubmissions || 0} Submissions</span>
                )}
              </div>

              <p className="text-gray-800 font-normal text-base mb-5">{courseData.description}</p>

              {/* Attachments */}
              {courseData.attachments?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-[15px] font-semibold text-black mb-2">Attachments</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {courseData.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-3 p-2 px-3 border border-[#52586633] rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                        <Paperclip size={16} className="text-gray-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                          <p className="text-xs text-gray-600">{formatFileSize(attachment.size)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Details */}
              <div className="mb-6 space-y-3">
                {[
                  [Clock, `Deadline: ${courseData.deadline ? `${new Date(courseData.deadline).toLocaleDateString()} at ${new Date(courseData.deadline).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true })}` : "Not set"}`],
                  [BookOpen, `Graded Type: ${courseData.gradedType || "Assignment"}`],
                  [Award, `Points: ${courseData.points || "100"}`],
                  [BarChart3, `Weightage: ${courseData.weightage || "10%"}`],
                  [Users, `Type: ${courseData.type || "Individual"}`],
                  [CheckCircle, `Status: ${courseData.status || "Active"}`],
                ].map(([Icon, text], i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Icon size={17} className="text-gray-600" />
                    <span className="text-[15px] text-gray-700">{text}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {user_type === 1 ? (
                <div className="flex gap-3 mb-6">
                  <button onClick={() => setShowSubmissions(true)} className="w-auto bg-blue-600 hover:bg-blue-700 text-sm py-2 px-3 text-white rounded-lg font-medium transition-colors">View All Submissions</button>
                  <button className="w-auto border border-gray-300 hover:bg-gray-50 py-2 px-3 text-sm text-gray-700 rounded-lg font-medium transition-colors">Edit Course</button>
                </div>
              ) : !isDeadlinePassed && (
                <div className="mb-6 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50">
                  <h3 className="text-lg font-semibold text-black mb-3">Your Submission</h3>
                  <div className="space-y-3">
                    <button className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors w-full">
                      <Upload size={16} className="text-gray-600" /><span className="text-sm text-gray-700">Upload Files</span>
                    </button>
                    <div className="flex gap-3">
                      {courseData.submitted ? (
                        <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">Unsubmit</button>
                      ) : (
                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors">Submit Assignment</button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Share / Tag */}
              <div className="flex items-center gap-3 border-t border-b border-gray-200 py-4 mb-6">
                <button className="flex items-center gap-2 text-sm font-medium text-gray-700"><Share2 size={16} className="text-gray-600" />Share</button>
                <button className="flex items-center gap-2 text-sm font-medium text-gray-700"><Tag size={16} className="text-gray-600" />Tag to Note</button>
              </div>

              <CourseComments initialComments={courseData?.comments || []} cohortData={cohortData} />
            </div>
          ) : (
            <div className="flex items-center justify-center p-12">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium mb-2 text-gray-600">Course not found</h3>
                <p className="text-sm text-gray-500">The requested course could not be found.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CohortCoursesContentUI;