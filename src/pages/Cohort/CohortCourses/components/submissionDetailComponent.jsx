import React, { useState } from "react";
import { Calendar, Paperclip } from "lucide-react";


const SubmissionDetailComponent = ({
  submission,
  courseData,
  onGrade,
  user_type,
  formatFileSize,
}) => {
  const [gradeInput, setGradeInput] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [individualGrading, setIndividualGrading] = useState(false);
  const [individualGrades, setIndividualGrades] = useState({});

  const handleSubmitGrade = () => {
    if (gradeInput && !isNaN(gradeInput)) {
      const grade = parseFloat(gradeInput);
      const maxPoints = courseData?.points || 100;

      const weightage = (
        (grade / maxPoints) *
        (courseData?.weightage || 10)
      ).toFixed(1);

      onGrade(submission.id, grade, weightage);

      setIsGrading(false);
      setGradeInput("");
    }
  };

  const handleIndividualGradeChange = (userId, grade) => {
    setIndividualGrades((prev) => ({
      ...prev,
      [userId]: grade,
    }));
  };

  const handleSaveIndividualGrades = () => {
    console.log("Saving individual grades:", individualGrades);

    setIsGrading(false);
    setIndividualGrading(false);
    setIndividualGrades({});
  };

  const groupMembers =
    submission.memberType === 1 ? submission.groupMembers || [] : [];

  return (
    <div className="space-y-6">

      {/* Student Info */}
      <div className="flex items-center gap-3">
        <img
          src={submission.avatar}
          alt={submission.studentName}
          className="w-10 h-10 rounded-full flex-shrink-0"
        />
        <div className="flex-1">
          <h3 className="font-semibold text-[15px] text-gray-900">
            {submission.studentName}
          </h3>
          <p className="text-sm text-gray-600">
            {submission.description}
          </p>
        </div>
      </div>

      {/* Submitted Date */}
      <div className="flex items-center gap-2 mt-1 text-[15px] text-black">
        <Calendar size={17} />
        <span>
          Submitted on{" "}
          {new Date(submission.submittedAt).toLocaleDateString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }
          )}
        </span>
      </div>

      {/* Attachments */}
      {submission.attachments?.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-3">
            Submitted Files
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {submission.attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <Paperclip size={16} className="text-gray-600" />

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {attachment.name}
                  </p>
                  <p className="text-xs text-gray-600">
                    {formatFileSize(attachment.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grading Section */}
      {user_type === 1 && (
        <div className="p-4 border border-gray-200 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-3">
            Grading
          </h4>

          {/* Already graded */}
          {submission.graded ? (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Grade:
                </span>
                <span className="font-medium text-green-600">
                  {submission.grade}/{courseData?.points || 100}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Weightage:
                </span>
                <span className="font-medium text-green-600">
                  {submission.weightage}%
                </span>
              </div>

              <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                Graded
              </span>
            </div>
          ) : (
            <div className="space-y-3">

              {!isGrading ? (
                <button
                  onClick={() => setIsGrading(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium"
                >
                  Grade Submission
                </button>
              ) : (
                <>
                  {/* Group toggle */}
                  {submission.memberType === 1 && (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-700">
                        Individual Grading
                      </span>

                      <input
                        type="checkbox"
                        checked={individualGrading}
                        onChange={(e) =>
                          setIndividualGrading(e.target.checked)
                        }
                      />
                    </div>
                  )}

                  {/* Individual grading */}
                  {individualGrading &&
                  submission.memberType === 1 ? (
                    <div className="space-y-3">
                      <h5 className="font-medium">
                        Grade Each Member
                      </h5>

                      {groupMembers.map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-3 p-3 border rounded-lg"
                        >
                          <img
                            src={member.avatar}
                            className="w-8 h-8 rounded-full"
                          />

                          <div className="flex-1">
                            <p className="text-sm font-medium">
                              {member.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member.username}
                            </p>
                          </div>

                          <input
                            type="number"
                            value={
                              individualGrades[member.id] || ""
                            }
                            onChange={(e) =>
                              handleIndividualGradeChange(
                                member.id,
                                e.target.value
                              )
                            }
                            className="w-20 border px-2 py-1 rounded"
                            placeholder="Grade"
                          />
                        </div>
                      ))}

                      <button
                        onClick={handleSaveIndividualGrades}
                        className="w-full bg-green-600 text-white py-2 rounded-lg"
                      >
                        Save Individual Grades
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Normal grading */}
                      <input
                        type="number"
                        value={gradeInput}
                        onChange={(e) =>
                          setGradeInput(e.target.value)
                        }
                        className="w-full border px-3 py-2 rounded-lg"
                        placeholder="Enter grade"
                      />

                      <button
                        onClick={handleSubmitGrade}
                        className="w-full bg-green-600 text-white py-2 rounded-lg"
                      >
                        Submit Grade
                      </button>
                    </>
                  )}

                  {/* Cancel */}
                  <button
                    onClick={() => {
                      setIsGrading(false);
                      setGradeInput("");
                      setIndividualGrading(false);
                      setIndividualGrades({});
                    }}
                    className="w-full bg-gray-500 text-white py-2 rounded-lg"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmissionDetailComponent;